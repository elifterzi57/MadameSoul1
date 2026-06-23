import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccountPath = './service-account.json';
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function main() {
  console.log("Starting Premium User Migration...");
  
  const premiumUserIds = new Set<string>();

  // 1. Scan moon_transactions where type === 'buy'
  console.log("Scanning moon_transactions...");
  const txSnap = await db.collection("moon_transactions").where("type", "==", "buy").get();
  txSnap.forEach(doc => {
    const data = doc.data();
    if (data.userId) {
      premiumUserIds.add(data.userId);
    }
  });
  console.log(`Found ${txSnap.size} buy transactions, mapping to ${premiumUserIds.size} unique users.`);

  // 2. Scan checkout_attempts where status === 'completed'
  console.log("Scanning checkout_attempts...");
  const attemptsSnap = await db.collection("checkout_attempts").where("status", "==", "completed").get();
  attemptsSnap.forEach(doc => {
    const data = doc.data();
    if (data.userId) {
      premiumUserIds.add(data.userId);
    }
  });
  console.log(`Total unique premium users after scanning checkout_attempts: ${premiumUserIds.size}`);

  // 3. Scan users where lifetimeValue > 0
  console.log("Scanning users with lifetimeValue > 0...");
  const usersSnap = await db.collection("users").where("lifetimeValue", ">", 0).get();
  usersSnap.forEach(doc => {
    premiumUserIds.add(doc.id);
  });
  console.log(`Total unique premium users to migrate: ${premiumUserIds.size}`);

  if (premiumUserIds.size === 0) {
    console.log("No premium users found to migrate.");
    return;
  }

  // 4. Update the user documents
  const batch = db.batch();
  let count = 0;
  for (const userId of premiumUserIds) {
    const userRef = db.collection("users").doc(userId);
    // Use merge to prevent overwriting other fields
    batch.set(userRef, {
      isPremium: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    count++;
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Committed batch of ${count} users.`);
    }
  }

  // Commit remaining
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`Migration completed successfully. Marked ${count} users as Premium (isPremium = true).`);
}

main().catch(console.error);
