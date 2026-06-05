import admin from "firebase-admin";
import "dotenv/config";

// Initialize Firebase Admin
admin.initializeApp({
  projectId: "madamesoul-926f6"
});

const main = async () => {
  const email = process.argv[2];
  const role = process.argv[3];

  if (!email || !role) {
    console.error("Usage: npx tsx scripts/set_role.ts <email> <role>");
    console.error("Available roles: employee, admin, user");
    process.exit(1);
  }

  const validRoles = ["employee", "admin", "user"];
  if (!validRoles.includes(role)) {
    console.error(`Invalid role. Role must be one of: ${validRoles.join(", ")}`);
    process.exit(1);
  }

  try {
    console.log(`Locating user with email: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);
    const uid = user.uid;

    if (role === "user") {
      // Clear claims
      await admin.auth().setCustomUserClaims(uid, null);
      console.log(`Successfully cleared custom claims for user ${email} (uid: ${uid}). Role set to standard user.`);
    } else {
      // Set claims
      await admin.auth().setCustomUserClaims(uid, { role });
      console.log(`Successfully set role to '${role}' for user ${email} (uid: ${uid}).`);
    }

    process.exit(0);
  } catch (err: any) {
    console.error("Error setting custom claims:", err.message || err);
    process.exit(1);
  }
};

main();
