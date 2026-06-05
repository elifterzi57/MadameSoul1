import { describe, it, expect } from 'vitest';

interface TransactionInput {
  userId: string;
  amount: number;
  type: string;
  paymentProvider: string;
  idempotencyKey: string;
  clientMetadata: {
    userAgent: string;
    os: string;
    appVersion: string;
  };
}

function validateTransactionInput(data: any): boolean {
  if (!data.userId || typeof data.userId !== 'string') {
    throw new Error('Invalid or missing userId');
  }
  if (typeof data.amount !== 'number') {
    throw new Error('Invalid or missing amount');
  }
  if (!['spend', 'buy', 'bonus', 'refund'].includes(data.type)) {
    throw new Error('Invalid or missing type');
  }
  if (!data.paymentProvider || !['stripe', 'app_store', 'google_play', 'daily_gift', 'welcome_bonus', 'admin_dusting'].includes(data.paymentProvider)) {
    throw new Error('Invalid or missing paymentProvider');
  }
  if (!data.idempotencyKey || typeof data.idempotencyKey !== 'string') {
    throw new Error('Invalid or missing idempotencyKey');
  }
  if (!data.clientMetadata || typeof data.clientMetadata !== 'object') {
    throw new Error('Invalid or missing clientMetadata');
  }
  const meta = data.clientMetadata;
  if (!meta.userAgent || typeof meta.userAgent !== 'string' ||
      !meta.os || typeof meta.os !== 'string' ||
      !meta.appVersion || typeof meta.appVersion !== 'string') {
    throw new Error('Invalid clientMetadata fields');
  }
  return true;
}

describe('MS-192 Transaction Input Validation Logic', () => {
  it('should accept valid transaction metadata', () => {
    const validTx = {
      userId: 'user_123',
      amount: -1,
      type: 'spend',
      paymentProvider: 'daily_gift',
      idempotencyKey: 'key_xyz_789',
      clientMetadata: {
        userAgent: 'Mozilla/5.0...',
        os: 'macOS',
        appVersion: '1.0.0'
      }
    };
    expect(validateTransactionInput(validTx)).toBe(true);
  });

  it('should reject transaction missing idempotencyKey', () => {
    const invalidTx = {
      userId: 'user_123',
      amount: -1,
      type: 'spend',
      paymentProvider: 'daily_gift',
      clientMetadata: {
        userAgent: 'Mozilla/5.0...',
        os: 'macOS',
        appVersion: '1.0.0'
      }
    };
    expect(() => validateTransactionInput(invalidTx)).toThrowError('idempotencyKey');
  });

  it('should reject transaction with invalid paymentProvider', () => {
    const invalidTx = {
      userId: 'user_123',
      amount: -1,
      type: 'spend',
      paymentProvider: 'bitcoin_wallet',
      idempotencyKey: 'key_xyz_789',
      clientMetadata: {
        userAgent: 'Mozilla/5.0...',
        os: 'macOS',
        appVersion: '1.0.0'
      }
    };
    expect(() => validateTransactionInput(invalidTx)).toThrowError('paymentProvider');
  });

  it('should reject transaction with incomplete clientMetadata', () => {
    const invalidTx = {
      userId: 'user_123',
      amount: -1,
      type: 'spend',
      paymentProvider: 'stripe',
      idempotencyKey: 'key_xyz_789',
      clientMetadata: {
        userAgent: 'Mozilla/5.0...',
        // os and appVersion are missing
      }
    };
    expect(() => validateTransactionInput(invalidTx)).toThrowError('clientMetadata');
  });
});
