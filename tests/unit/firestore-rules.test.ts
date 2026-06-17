import { readFileSync } from 'fs';
import { resolve } from 'path';
import { beforeAll, beforeEach, afterAll, describe, it } from 'vitest';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertSucceeds,
  assertFails
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;
const PROJECT_ID = 'madamesoul-rules-test';

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Firestore Security Rules', () => {
  // Helpers to get Firestore instances
  const getUnauthenticatedDb = () => testEnv.unauthenticatedContext().firestore();
  const getAuthenticatedDb = (userId: string, role?: string) => {
    const token = role ? { role } : {};
    return testEnv.authenticatedContext(userId, token).firestore();
  };

  describe('/users/{userId} rules', () => {
    it('should deny access to anonymous users', async () => {
      const db = getUnauthenticatedDb();
      const ref = doc(db, 'users/user_1');
      await assertFails(getDoc(ref));
      await assertFails(setDoc(ref, { userId: 'user_1', lastLogin: new Date().toISOString() }));
    });

    it('should allow user to CRUD their own document with valid schema', async () => {
      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'users/user_1');
      
      // Create/Set
      await assertSucceeds(setDoc(ref, {
        userId: 'user_1',
        lastLogin: new Date().toISOString()
      }));

      // Get
      await assertSucceeds(getDoc(ref));
    });

    it('should deny user from writing to another users document', async () => {
      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'users/user_2');
      await assertFails(getDoc(ref));
      await assertFails(setDoc(ref, { userId: 'user_2', lastLogin: new Date().toISOString() }));
    });

    it('should allow employee/admin to read any user document', async () => {
      // Setup a user doc first using admin (rules-unit-testing allows using adminContext for setup)
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'users/user_1'), { userId: 'user_1', lastLogin: new Date().toISOString() });
      });

      const employeeDb = getAuthenticatedDb('emp_1', 'employee');
      const ref = doc(employeeDb, 'users/user_1');
      await assertSucceeds(getDoc(ref));
    });
  });

  describe('/admin_users/{userId} rules', () => {
    it('should deny non-admin and non-employee from reading or writing', async () => {
      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'admin_users/user_1');
      await assertFails(getDoc(ref));
      await assertFails(setDoc(ref, { name: 'Unauthorized' }));
    });

    it('should allow admin and employee to read their own or others admin user profile', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'admin_users/admin_1'), { name: 'Admin One' });
      });

      const adminDb = getAuthenticatedDb('admin_1', 'admin');
      const employeeDb = getAuthenticatedDb('emp_1', 'employee');

      await assertSucceeds(getDoc(doc(adminDb, 'admin_users/admin_1')));
      await assertSucceeds(getDoc(doc(employeeDb, 'admin_users/admin_1')));
    });

    it('should prevent all writes from client side', async () => {
      const adminDb = getAuthenticatedDb('admin_1', 'admin');
      const ref = doc(adminDb, 'admin_users/admin_1');
      await assertFails(setDoc(ref, { name: 'Attempt write' }));
    });
  });

  describe('/user_moons/{userId} balance manipulation rules', () => {
    it('should allow owner to read their balance', async () => {
      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'user_moons/user_1');
      await assertSucceeds(getDoc(ref));
    });

    it('should deny owner from setting arbitrary high balance on create', async () => {
      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'user_moons/user_1');
      // Rules allow balance == 1 (purchasedBalance == 1) or balance == 5 (welcome bonus)
      // Any other starting value like 100 should fail
      await assertFails(setDoc(ref, {
        userId: 'user_1',
        balance: 100
      }));
    });

    it('should allow owner to create user_moons document with balance 5', async () => {
      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'user_moons/user_1');
      await assertSucceeds(setDoc(ref, {
        userId: 'user_1',
        balance: 5
      }));
    });

    it('should deny owner from arbitrarily increasing balance on update', async () => {
      // Setup initial user_moons document
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'user_moons/user_1'), {
          userId: 'user_1',
          balance: 5,
          dailyFreeBalance: 0,
          purchasedBalance: 5
        });
      });

      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'user_moons/user_1');

      // Attempt to increase balance to 10
      await assertFails(updateDoc(ref, {
        balance: 10
      }));
    });

    it('should allow employee/admin to update balance arbitrarily', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'user_moons/user_1'), {
          userId: 'user_1',
          balance: 5
        });
      });

      const db = getAuthenticatedDb('admin_1', 'admin');
      const ref = doc(db, 'user_moons/user_1');

      await assertSucceeds(updateDoc(ref, {
        balance: 100
      }));
    });
  });

  describe('/error_logs/{logId} log integrity rules', () => {
    it('should allow clients to create error logs', async () => {
      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'error_logs/log_123');
      await assertSucceeds(setDoc(ref, {
        source: 'client',
        userId: 'user_1',
        error: 'Test error message'
      }));
    });

    it('should deny clients from updating or deleting error logs', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'error_logs/log_123'), {
          source: 'client',
          userId: 'user_1',
          error: 'Test error message'
        });
      });

      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'error_logs/log_123');

      await assertFails(updateDoc(ref, { error: 'Modified error' }));
      await assertFails(deleteDoc(ref));
    });

    it('should allow employees/admins to read error logs', async () => {
      const db = getAuthenticatedDb('emp_1', 'employee');
      const ref = doc(db, 'error_logs/log_123');
      await assertSucceeds(getDoc(ref));
    });
  });

  describe('/admin_audit_logs/{logId} audit trail rules', () => {
    it('should deny standard users from reading or creating audit logs', async () => {
      const db = getAuthenticatedDb('user_1');
      const ref = doc(db, 'admin_audit_logs/audit_123');
      await assertFails(getDoc(ref));
      await assertFails(setDoc(ref, { action: 'Malicious Action' }));
    });

    it('should allow employee/admin to create audit logs', async () => {
      const db = getAuthenticatedDb('emp_1', 'employee');
      const ref = doc(db, 'admin_audit_logs/audit_123');
      await assertSucceeds(setDoc(ref, {
        action: 'Reset User Moon Balance',
        adminId: 'emp_1',
        timestamp: new Date().toISOString()
      }));
    });

    it('should allow admins (but not employees) to read audit logs', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'admin_audit_logs/audit_123'), { action: 'Some Action' });
      });

      const adminDb = getAuthenticatedDb('admin_1', 'admin');
      const employeeDb = getAuthenticatedDb('emp_1', 'employee');

      await assertSucceeds(getDoc(doc(adminDb, 'admin_audit_logs/audit_123')));
      await assertFails(getDoc(doc(employeeDb, 'admin_audit_logs/audit_123')));
    });

    it('should deny update and delete of audit logs to everyone including admins', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'admin_audit_logs/audit_123'), { action: 'Some Action' });
      });

      const adminDb = getAuthenticatedDb('admin_1', 'admin');
      const ref = doc(adminDb, 'admin_audit_logs/audit_123');

      await assertFails(updateDoc(ref, { action: 'Modify Action' }));
      await assertFails(deleteDoc(ref));
    });
  });
});
