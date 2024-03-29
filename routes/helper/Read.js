const admin = require("firebase-admin");
const db = admin.database();

var handleError = require("../errorHandler").handleError;
var verifyToken = require("../errorHandler.js").verifyToken;
var sendNotFound = require("../errorHandler.js").sendNotFound;
var sendUnauthorized = require("../errorHandler.js").sendUnauthorized;

async function getDashboardData(username, res) {
  try {
    const { uid, userObject } = await fetchUserDataAndSubmissions(username);

    const userSubmissionsData = await fetchUserSubmissions(uid);

    const userSubmissionData = await processSubmissions(userSubmissionsData);

    const { mostVotes, mostRecent } =
      sortAndFilterSubmissions(userSubmissionData);

    const submissionsCount = {
      proverbs: Object.keys(userSubmissionsData).filter((key) =>
        key.includes("Proverb"),
      ).length,
      poetrys: Object.keys(userSubmissionsData).filter((key) =>
        key.includes("Poetry"),
      ).length,
      totalSubmissions: Object.keys(userSubmissionsData).length,
    };

    res.json({
      uid,
      username: userObject.username,
      email: userObject.email,
      submissionCount: userObject.submissionCount,
      userStats: submissionsCount,
      bio: userObject.bio,
      photoURL: userObject.photoURL,
      interests: userObject.interests,
      mostVotes,
      mostRecent,
    });
  } catch (error) {
    if (error.message === "UserNotFound") {
      return sendNotFound(res, "User not found");
    }
    return handleError(res, error);
  }
}

async function fetchUserDataAndSubmissions(username) {
  const usernameRef = db.ref(`usernames/${username}`);

  const usernameSnapshot = await usernameRef.once("value");

  if (!usernameSnapshot.exists()) {
    throw new Error("UserNotFound");
  }

  const usernameUID = usernameSnapshot.val();
  const uid = usernameUID.uid;

  const userRef = db.ref(`users/${uid}`);

  const userSnapshot = await userRef.once("value");

  if (!userSnapshot.exists()) {
    throw new Error("UserNotFound");
  }

  const userObject = userSnapshot.val();

  return { uid, userObject };
}

async function fetchUserSubmissions(uid) {
  const userSubmissionsRef = db.ref(`users/${uid}/submissions`);
  const userSubmissionsSnapshot = await userSubmissionsRef.once("value");
  const userSubmissionsData = userSubmissionsSnapshot.val() || {};
  return userSubmissionsData;
}

async function processSubmissions(userSubmissionsData) {
  const submissionKeys = Object.keys(userSubmissionsData);
  const submissionPromises = submissionKeys.map((key) => {
    const type = key.split("_")[1];
    const submissionRef = db.ref(`collections/${type}/${key}`);
    return submissionRef.once("value");
  });

  const submissionSnapshots = await Promise.all(submissionPromises);
  return submissionSnapshots.reduce((acc, snapshot) => {
    const data = snapshot.val();
    if (data && data.id) {
      acc[data.id] = data;
    }
    return acc;
  }, {});
}

function sortAndFilterSubmissions(userSubmissionData) {
  const mostVotes = Object.values(userSubmissionData).filter(
    (submission) => submission.votes && submission.votes.upvote.count > 0,
  );
  const mostRecent = [...Object.values(userSubmissionData)]; // Clone to avoid mutating original array

  mostVotes
    .sort((a, b) => b.votes.upvote.count - a.votes.upvote.count)
    .splice(5);
  mostRecent
    .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
    .splice(5);

  return { mostVotes, mostRecent };
}

const getCollections = async (req, res) => {
  const ref = db.ref("/collections");
  try {
    const data = await fetchCollectionsData(ref);

    // check if the data is empty
    if (data === null) {
      return sendNotFound(
        res,
        "No data found in the database. Please check back later.",
      );
    }
    const mergedData = mergeAndSortCollections(data);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = paginateData(mergedData, page, limit);

    if (paginatedData.length === 0) {
      return sendNotFound(res, "You have reached the end of the data");
    }

    res.json(paginatedData);
  } catch (error) {
    if (error.message === "NoDataFound") {
      return sendNotFound(res, "No data found");
    }
    return handleError(res, error);
  }
};

function paginateData(data, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return data.slice(startIndex, endIndex);
}

function mergeAndSortCollections(data) {
  let mergedData = [];
  Object.keys(data).forEach((type) => {
    mergedData = mergedData.concat(Object.values(data[type]));
  });

  mergedData.sort((a, b) => {
    if (b.votes.upvote.count === a.votes.upvote.count) {
      return new Date(b.creationDate) - new Date(a.creationDate);
    }
    return b.votes.upvote.count - a.votes.upvote.count;
  });
  return mergedData;
}

async function fetchCollectionsData(ref) {
  const snapshot = await ref.once("value");
  const data = snapshot.val();
  return data;
}

module.exports = { getDashboardData, getCollections };
