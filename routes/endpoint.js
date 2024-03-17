let express = require("express");
let router = express.Router();
let Fuse = require("fuse.js");
router.use(express.json());

// Import Firebase Admin
let admin = require("firebase-admin");

var db = admin.database();

var handleError = require("./errorHandler.js").handleError;
var verifyToken = require("./errorHandler.js").verifyToken;
var sendNotFound = require("./errorHandler.js").sendNotFound;
var sendUnauthorized = require("./errorHandler.js").sendUnauthorized;

// CRUD
var updateData = require("./helper/Update.js").updateData;
var updateUsername = require("./helper/Update.js").updateUsername;
var handleVoting = require("./helper/Update.js").handleVoting;
var getDashboardData = require("./helper/Read.js").getDashboardData;
var getCollections = require("./helper/Read.js").getCollections;
var createSubmission = require("./helper/Create.js").createSubmission;
var DeleteSubmission = require("./helper/Delete.js").DeleteSubmission;

var storeUserData = require("./helper/Create.js").storeUserData;
var updateLastloginAt = require("./helper/Update.js").updateLastloginAt;

var addUsernameToDB = require("./helper/Create.js").addUsernameToDB;

// getting all of the data in my collections
router.get("/collections", async function (req, res) {
  try {
    await getCollections(req, res);
  } catch (error) {
    return handleError(res, error);
  }
});

// Route to add a new submission to the database
router.post("/submissions", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    sendUnauthorized(res, "Unauthorized");
  }

  try {
    const decodedToken = await verifyToken(idToken);

    await createSubmission(req, res, decodedToken);
  } catch (error) {
    return handleError(res, error);
  }
});

// Function to handle voting
const handleVote = async (req, res, newVoteType) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    sendUnauthorized(res, "Unauthorized");
  }

  try {
    const decodedToken = await verifyToken(idToken);

    const uid = decodedToken.uid;
    const id = req.params.id;

    await handleVoting(req, res, newVoteType, uid, id);
  } catch (error) {
    return handleError(res, error);
  }
};

// Route for upvoting
router.put("/submissions/:id/upvote", async (req, res) => {
  handleVote(req, res, "upvote");
});

// Route for downvoting
router.put("/submissions/:id/downvote", async (req, res) => {
  handleVote(req, res, "downvote");
});

// this is to get one submission by id
router.get("/submissions/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // get the type of submission
    const type = id.split("_")[1];

    // get the reference to the collection
    const ref = db.ref("collections/" + type + "/" + id);

    const snapshot = await ref.once("value");

    if (snapshot.exists()) {
      const data = snapshot.val();
      // return the data
      res.json(data);
    } else {
      return sendNotFound(res, "Submission not found");
    }
  } catch (error) {
    return handleError(res, error);
  }
});

// get user data by username this is for the dashboard feature
router.get("/users/:username", async (req, res) => {
  try {
    // get the email from the request
    const username = req.params.username;

    await getDashboardData(username, res);
  } catch (error) {
    return handleError(res, error);
  }
});

// delete a submission
router.delete("/submissions/:id", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    sendUnauthorized(res, "Unauthorized");
  }

  try {
    const decodedToken = await verifyToken(idToken);

    const uid = decodedToken.uid;

    const id = req.params.id;

    await DeleteSubmission(id, uid, res);
  } catch (error) {
    return handleError(res, error);
  }
});

// update username
router.put("/users/:uid", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    sendUnauthorized(res, "Unauthorized");
  }

  // Verify the ID token and extract the user's Firebase UID
  try {
    const decodedToken = await verifyToken(idToken);
    const uid = decodedToken.uid;
    const newUsername = req.body.username;

    // validate the data is good and exists
    await updateUsername(newUsername, uid, res);
  } catch (error) {
    return handleError(res, error);
  }
});

// search for a submission by proverbs or poetry, or title
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const results = await searchDatabase(query);

    if (results.length > 0) {
      res.json(results);
    } else {
      return sendNotFound(res, "No results found");
    }
  } catch (error) {
    return handleError(res, error);
  }
});

async function searchDatabase(query) {
  const ref = db.ref("/collections");
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  const allSubmissions = [];
  for (const key in data) {
    allSubmissions.push(...Object.values(data[key]));
  }

  const options = {
    includeScore: true,
    threshold: 0.3,
    minMatchCharLength: 2,
    keys: ["title", "content", "meaning"],
  };

  const fuse = new Fuse(allSubmissions, options);
  const results = fuse.search(query);

  return results.map((result) => result.item);
}

// Route to create user account
router.post("/users/create", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return sendUnauthorized(res, "Unauthorized");
  }

  try {
    const decodedToken = await verifyToken(idToken);
    const uid = decodedToken.uid;
    const userData = req.body;

    await storeUserData(res, userData, uid);
  } catch (error) {
    return handleError(res, error);
  }
});

// Route to sync google user data
router.post("/users/sync", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return sendUnauthorized(res, "Unauthorized");
  }

  try {
    const decodedToken = await verifyToken(idToken);
    const uid = decodedToken.uid;
    const userData = req.body;

    await storeUserData(res, userData, uid);
  } catch (error) {
    return handleError(res, error);
  }
});

// Check if the username is already in the database
router.get("/validate/user/username", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return sendUnauthorized(res, "Unauthorized");
  }

  try {
    const decodedToken = await verifyToken(idToken);
    const uid = decodedToken.uid;
    const usernamesRef = db.ref("usernames");

    const exists = await UsernameInDB(uid, usernamesRef);

    res.json({ exists });
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).send("Server error"); // Proper error response
  }
});

async function UsernameInDB(uid, usernamesRef) {
  const snapshot = await usernamesRef.once("value");
  const data = snapshot.val();

  if (data) {
    const usernames = Object.values(data).map((user) => user.uid); // map to array of UIDs

    // now check if the useruid is in the usernames array and if yes then return existd or ture else false
    if (usernames.includes(uid)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// add user username to the db
router.post("/users/username", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return sendUnauthorized(res, "Unauthorized");
  }

  try {
    const decodedToken = await verifyToken(idToken);
    const uid = decodedToken.uid;
    const username = req.body.username;

    await addUsernameToDB(username, uid, res);
  } catch (error) {
    return handleError(res, error);
  }
});

// update user last login time
router.post("/users/lastLoginAt", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return sendUnauthorized(res, "Unauthorized");
  }

  try {
    const decodedToken = await verifyToken(idToken);
    const uid = decodedToken.uid;
    const userData = req.body;

    await updateLastloginAt(res, userData, uid);
  } catch (error) {
    return handleError(res, error);
  }
});

// check server status
router.get("/server/status", async (req, res) => {
  try {
    res.json({
      message: "Server is up!",
    });
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = router;
