const admin = require("firebase-admin");

const db = admin.database();

var handleError = require("../errorHandler").handleError;
var verifyToken = require("../errorHandler.js").verifyToken;
var sendNotFound = require("../errorHandler.js").sendNotFound;
var sendUnauthorized = require("../errorHandler.js").sendUnauthorized;

const createSubmission = async (req, res, decodedToken) => {
  const uid = decodedToken.uid;
  const email = decodedToken.email;
  const formData = req.body;

  if (
    !formData.content.trim() ||
    !formData.meaning.trim() ||
    (formData.picked === "Poetry" && !formData.title.trim())
  ) {
    return handleError(res, "Please fill in all fields");
  }

  const date = new Date().toISOString();
  const submissionRef = db.ref(`users/${uid}/submissions`).push();

  const { submissionKey, updates } = await generateSubmissionData(
    formData,
    submissionRef.key,
    date,
    uid,
    email,
  );

  // Update submission count
  updates[`users/${uid}/submissionCount`] = await updateSubmissionCount(uid);

  await db.ref().update(updates);
  res.json({ message: "Submission successful!", submissionId: submissionKey });
};

async function updateSubmissionCount(userId) {
  const userCountSnapshot = await db.ref(`users/${userId}`).once("value");
  const userCount = userCountSnapshot.child("submissionCount").val() || 0;
  return userCount + 1;
}

async function generateSubmissionData(
  formData,
  submissionRefKey,
  date,
  uid,
  email,
) {
  const submissionKey = `submission_${formData.picked}_${submissionRefKey}`;
  const username = await getUserUsername(uid);

  // check the username exists
  if (!username) {
    return handleError(res, "Username does not exist");
  }

  return {
    submissionKey,
    updates: {
      [`users/${uid}/submissions/${submissionKey}`]: {
        entry_id: submissionKey,
        user_id: uid,
      },
      [`collections/${formData.picked}/${submissionKey}`]: {
        id: submissionKey,
        entry_id: submissionRefKey,
        title: formData.title,
        content: formData.content,
        meaning: formData.meaning,
        creationDate: date,
        votes: { upvote: { count: 0 }, downvote: { count: 0 } },
        flagged: false,
        submittedBy: email,
        username: username,
        type: formData.picked,
      },
    },
  };
}

// get user username using there uid
function getUserUsername(uid) {
  const usernameRef = db.ref(`users/${uid}/username`).once("value");

  // snapshot value
  return usernameRef.then((snapshot) => {
    return snapshot.val();
  });
}

function validateUserData(userData) {
  if (!userData || Object.keys(userData).length === 0) {
    handleError(res, "Please provide user data");
  }

  const requiredKeys = ["personalName", "email"];
  for (const key of requiredKeys) {
    if (!userData[key]) {
      handleError(res, `Missing value for field: ${key}`);
    }
  }
}

const storeUserData = async (res, userData, uid) => {
  try {
    // validate userData
    validateUserData(userData);

    await db.ref(`users/${uid}`).set({
      personalName: userData.personalName,
      email: userData.email,
      createdAt: userData.createdAt || null,
      lastLoginAt: userData.lastLoginAt || null,
      submissionCount: 0,
    });
    res.json("User data processed successfully.");
  } catch (error) {
    return handleError(res, error);
  }
};

const addUsernameToDB = async (username, uid, res) => {
  try {
    let updates = {};
    if (!username) {
      return handleError(res, "Please provide a username");
    }

    // check if username is already taken
    const usernameRef = db.ref(`usernames/${username}`);
    const usernameSnapshot = await usernameRef.once("value");
    if (usernameSnapshot.exists()) {
      return handleError(res, "Username already taken");
    }

    updates[`/users/${uid}/username`] = username;
    updates[`/usernames/${username}`] = { uid: uid };

    await db.ref().update(updates);

    res.json({ message: "Username updated successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  createSubmission,
  storeUserData,
  addUsernameToDB,
};
