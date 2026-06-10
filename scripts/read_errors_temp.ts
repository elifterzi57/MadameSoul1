import admin from "firebase-admin";

admin.initializeApp({
  projectId: "madamesoul-926f6"
});

const db = admin.firestore();

const main = async () => {
  try {
    console.log("Fetching latest error logs...");
    const snap = await db.collection("error_logs").orderBy("createdAt", "desc").limit(10).get();
    snap.forEach(doc => {
      console.log("LOG ID:", doc.id);
      console.log("DATA:", JSON.stringify(doc.data(), null, 2));
    });

    console.log("Fetching latest activity stream logs...");
    const streamSnap = await db.collection("activity_stream").orderBy("createdAt", "desc").limit(10).get();
    streamSnap.forEach(doc => {
      console.log("STREAM LOG ID:", doc.id);
      console.log("DATA:", JSON.stringify(doc.data(), null, 2));
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

main();
