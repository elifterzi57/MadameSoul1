import admin from "firebase-admin";
import "dotenv/config";

// Initialize Firebase Admin (will pick up credentials from GOOGLE_APPLICATION_CREDENTIALS)
admin.initializeApp({
  projectId: "madamesoul-926f6"
});

const db = admin.firestore();

async function seedAdmin() {
  const email = "elifterzi@yandex.com";
  const password = "613415";
  
  try {
    console.log(`Checking if user ${email} exists...`);
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log(`Kullanıcı zaten mevcut: ${userRecord.uid}`);
    } catch (authErr: any) {
      if (authErr.code === 'auth/user-not-found') {
        console.log(`Admin kullanıcısı bulunamadı, oluşturuluyor...`);
        userRecord = await admin.auth().createUser({
          email,
          password,
          emailVerified: true
        });
        console.log(`Yeni admin kullanıcısı oluşturuldu: ${userRecord.uid}`);
      } else {
        throw authErr;
      }
    }

    const uid = userRecord.uid;

    // 1. Custom Claims (role: admin)
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    console.log(`Custom user claim 'admin' başarıyla atandı.`);

    // 2. admin_users koleksiyonuna kayıt ekleme
    await db.collection("admin_users").doc(uid).set({
      email,
      role: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`admin_users koleksiyonuna kayıt eklendi.`);

    // 3. Audit log kaydı oluşturma
    await db.collection("admin_audit_logs").add({
      action: "SEED_ADMIN",
      performedBy: "system",
      targetUser: uid,
      details: { email, role: "admin" },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Audit log başarıyla oluşturuldu.`);

    console.log("Admin seeding işlemi başarıyla tamamlandı.");
    process.exit(0);
  } catch (err: any) {
    console.error("Seed işlemi sırasında hata:", err.message || err);
    process.exit(1);
  }
}

seedAdmin();
