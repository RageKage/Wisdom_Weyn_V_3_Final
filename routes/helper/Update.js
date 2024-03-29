const admin = require("firebase-admin");
const db = admin.database();

var handleError = require("../errorHandler").handleError;
var verifyToken = require("../errorHandler.js").verifyToken;
var sendNotFound = require("../errorHandler.js").sendNotFound;
var sendUnauthorized = require("../errorHandler.js").sendUnauthorized;

async function updateData(updatesObject, res) {
  try {
    await db.ref().update(updatesObject);
  } catch (error) {
    handleError(res, error);
  }
}

async function updateUsername(newUsername, uid, res) {
  try {
    const updates = {};
    const userRef = db.ref("users/" + uid);

    userRef.once("value", async (userSnapshot) => {
      if (!userSnapshot.exists()) {
        return sendNotFound(res, "User not found");
      }

      const usernameRef = db.ref(`usernames/${newUsername}`);
      const usernameSnapshot = await usernameRef.once("value");

      if (usernameSnapshot.exists()) {
        return sendUnauthorized(res, "Username already taken");
      }

      const userData = userSnapshot.val();
      const oldUsername = userData.username;

      updates[`/users/${uid}/username`] = newUsername;

      if (userData.submissions) {
        for (const submissionKey of Object.keys(userData.submissions)) {
          const type = submissionKey.split("_")[1];
          updates[`/collections/${type}/${submissionKey}/username`] =
            newUsername;
        }
      }

      updates[`/usernames/${oldUsername}`] = null;
      updates[`/usernames/${newUsername}`] = { uid: uid };

      await updateData(updates, res);
      res.status(200).json({ message: "Username updated successfully" });
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function handleVoting(req, res, newVoteType, uid, id) {
  try {
    const type = id.split("_")[1];

    const userVotesRef = db.ref(`users/${uid}/votes/${id}`);
    const votesRef = db.ref(`collections/${type}/${id}/votes`);

    const currentVote = (await userVotesRef.once("value")).val();

    // Update user's vote
    if (currentVote === newVoteType) {
      // User is removing their vote
      await userVotesRef.remove();
      await votesRef.child(currentVote).child("users").child(uid).remove();
      await votesRef
        .child(currentVote)
        .child("count")
        .transaction((count) => (count ? count - 1 : 0));
    } else {
      // New vote or changing vote
      await userVotesRef.set(newVoteType);

      // Remove previous vote if exists
      if (currentVote) {
        await votesRef.child(currentVote).child("users").child(uid).remove();
        await votesRef
          .child(currentVote)
          .child("count")
          .transaction((count) => (count ? count - 1 : 0));
      }

      // Add new vote
      await votesRef.child(newVoteType).child("users").child(uid).set(true);
      await votesRef
        .child(newVoteType)
        .child("count")
        .transaction((count) => (count || 0) + 1);
    }

    res.json({ message: "Vote updated!" });
  } catch (error) {
    handleError(res, error);
  }
}

const updateLastloginAt = async (res, userData, uid) => {
  const userRef = db.ref(`users/${uid}`);
  const snapshot = await userRef.once("value");
  if (snapshot.exists()) {
    // If user already exists, only update lastLoginAt
    await userRef.update({ lastLoginAt: userData.lastLoginAt || null });
  } else {
    // If user doesn't exist, return Error
    return handleError(res, "User not found");
  }
  res.json("User data processed successfully.");
};

// updateUserDetails

async function updateUserDetails(res, data, uid) {
  const bio = data.bio;
  const interests = data.interests;

  const userRef = db.ref(`users/${uid}`);

  const snapshot = await userRef.once("value");

  // now if any of the bio or interests field is not present in the data then create them else update them
  if (snapshot.exists()) {
    if (bio) {
      await userRef.update({ bio: bio });
    }
    if (interests) {
      await userRef.update({ interests: interests });
    }
  } else {
    // If user doesn't exist, return Error
    return handleError(res, "User not found");
  }

  res.json("User data processed successfully.");
}

module.exports = {
  updateData,
  updateUsername,
  handleVoting,
  updateLastloginAt,
  updateUserDetails,
};
