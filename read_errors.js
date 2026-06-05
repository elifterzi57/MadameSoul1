import admin from "firebase-admin";

admin.initializeApp({
  projectId: "madamesoul-926f6"
});

const db = admin.firestore();

const main = async () => {
  try {
    console.log("Fetching latest error logs...");
    const snap = await db.collection("error_logs").orderBy("createdAt", "desc").limit(5).get();
    snap.forEach(doc => {
      console.log("LOG:", doc.id, JSON.stringify(doc.data(), null, 2));
    });

    console.log("Fetching latest server logs / telemetry...");
    const telSnap = await db.collection("ai_telemetry").orderBy("createdAt", "desc").limit(2).get();
    telSnap.forEach(doc => {
      console.log("TELEMETRY:", doc.id, JSON.stringify(doc.data(), null, 2));
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

main();
