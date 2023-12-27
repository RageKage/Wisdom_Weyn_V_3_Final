import { getDatabase, ref, set } from "firebase/database";

const db = getDatabase();

async function addUserData(userData, username) {
  const user = userData.user;
  try {
    if (!user.uid || !user.email) {
      throw new Error("Invalid user data: UID or email is missing.");
    }
    await user?.reload();
    await set(ref(db, "users/" + user.uid), {
      displayName: username,
      email: user.email,
      createdAt: user.metadata.creationTime || null,
      lastLoginAt: user.metadata.lastSignInTime || null,
      submissionCount: 0,
    });
  } catch (error) {
    console.error("Error adding user data:", error);
    throw error; // Re-throw the error so that it can be caught in the calling function
  }
}

async function addUserDataviaGoogle(user) {
  try {
    if (!user.uid || !user.email) {
      throw new Error("Invalid user data: UID or email is missing.");
    }
    const userData = {
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      createdAt: user.metadata.creationTime || null,
      lastLoginAt: user.metadata.lastSignInTime || null,
      submissionCount: 0,
    };
    await set(ref(db, "users/" + user.uid), userData);
  } catch (error) {
    console.error("Error adding user data:", error);
    throw error;
  }
}

export { addUserData, addUserDataviaGoogle };
