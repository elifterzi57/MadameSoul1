const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let credential = admin.credential.applicationDefault();

const serviceAccountPath = path.join(__dirname, 'service-account.json');
if (fs.existsSync(serviceAccountPath)) {
  console.log('Using service-account.json credentials...');
  credential = admin.credential.cert(serviceAccountPath);
} else {
  console.log('Using application default credentials...');
}

admin.initializeApp({
  credential,
  projectId: "madamesoul-926f6"
});

const auth = admin.auth();
const db = admin.firestore();

async function seedAdmin() {
  const email = 'elifterzi57@gmail.com';
  const password = '613415';

  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log('User already exists in Auth:', userRecord.uid);
      // Update password to 613415
      await auth.updateUser(userRecord.uid, { password });
      console.log('Successfully updated password to 613415');
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          password,
          emailVerified: true,
          displayName: 'Super Admin'
        });
        console.log('Successfully created new user in Auth:', userRecord.uid);
      } else {
        throw e;
      }
    }

    // Set custom claim
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
    console.log('Set custom claim role: admin');

    // Add to admin_users collection
    await db.collection('admin_users').doc(userRecord.uid).set({
      email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('Successfully added user to admin_users collection.');

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
