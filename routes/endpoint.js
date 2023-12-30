let express = require("express");
let router = express.Router();
router.use(express.json());

// Import Firebase Admin
// const functions = require("firebase-functions");
let admin = require("firebase-admin");

var db = admin.database();
const { set, ref, update, remove } = require("firebase/database");

// getting all of the data in my collections
router.get("/all-collections", function (req, res) {
  // set a reference to to my collection collections
  const ref = db.ref("/collections");

  // now we get the collection
  ref.once(
    "value",
    (snapshot) => {
      let data = snapshot.val();
      res.json(data); // send it to the client side
    },
    (errorObject) => {
      console.log("The read failed: " + errorObject.name);
      res.status(500).send("Error reading from database: " + errorObject.name);
    }
  );
});

// this is to add a new submission to the database
router.post("/sendSubmission", async (req, res) => {
  try {
    // this is the data that is being sent from the client side
    const formData = req.body;

    const getisodate = new Date().toISOString();
    const date = new Date(getisodate);

    let counterRef;
    if (formData.picked === "proverb") {
      counterRef = db.ref("counter/proverb_count");
    } else if (formData.picked === "Poetry") {
      counterRef = db.ref("counter/Poetry_count");
    } else {
      throw new Error(
        "Could not find type " +
          formData.picked +
          " in form " +
          JSON.stringify(formData) +
          "."
      );
    }

    // counter so we can increase counter so that each proverb or poetry is unique following this format type_count
    const countSnapshot = await counterRef.once("value");
    const currentCount = countSnapshot.exists() ? countSnapshot.val() : 0;
    await counterRef.set(currentCount + 1);

    const newEntryID = `${formData.picked}_${currentCount + 1}`;

    // create a unique key for the submission
    const submissionKey = "submission_" + newEntryID;

    // now we need to add the submission to the user's submissions
    const userSubmissionRef = db.ref(
      "users/" + formData.user_id + "/submissions"
    );

    // now we check if the user has any submissions if so we add to it if not we create it
    const userSnapshot = await userSubmissionRef.once("value");

    if (userSnapshot.exists()) {
      await userSubmissionRef.update({
        [newEntryID]: {
          entry_id: submissionKey,
          user_id: formData.user_id,
        },
      });
    }
    // if the user does not have any submissions we create it and add the first submission
    else {
      await userSubmissionRef.set({
        [newEntryID]: {
          entry_id: submissionKey,
          user_id: formData.user_id,
        },
      });
    }

    // now we need to update the user's submission count
    const updateUserCount = db.ref("users/" + formData.user_id);

    const userCountSnapshot = await updateUserCount.once("value");

    const userCountData = userCountSnapshot.val();

    const userCount = userCountData.submissionCount;

    if (userCountSnapshot.exists()) {
      await updateUserCount.update({
        submissionCount: userCount + 1,
      });
    }

    // now we create make path to the collection find the type and add the submission key to it, this should create a path like this collections/Poetry/submission_Poetry_1
    const collectionRef = db.ref(
      "collections/" + formData.picked + "/" + submissionKey
    );

    const collectionSnapshot = await userSubmissionRef.once("value");

    const userRef = db.ref("users/" + formData.user_id);

    const collectionsUserSnapshot = await userRef.once("value");
    const userData = collectionsUserSnapshot.val();

    const username = userData.displayName;
    const email = userData.email;

    // we check if the collection exists if so we add to it if not we create it, this can we future edit the submission if needed
    if (collectionSnapshot.exists()) {
      await collectionRef.update({
        id: submissionKey,
        entry_id: newEntryID,
        title: formData.title,
        content: formData.content,
        meaning: formData.meaning,
        creationDate: date,
        upvotes: 0,
        downvotes: 0,
        flagged: false,
        submittedBy: email,
        username: username,
        type: formData.picked,
      });
    } else {
      await collectionRef.set({
        id: submissionKey,
        entry_id: newEntryID,
        title: formData.title,
        content: formData.content,
        meaning: formData.meaning,
        creationDate: date,
        upvotes: 0,
        downvotes: 0,
        flagged: false,
        submittedBy: email,
        username: username,
        type: formData.picked,
      });
    }

    // send client a success message
    res.json({
      message: "Submission successful!",
    });
  } catch (error) {
    return res.status(500).send("Server error: " + error.message);
  }
});

const handleVote = async (req, res, voteType) => {
  try {
    const id = req.params.id;
    console.log("Submission ID:", id);

    const type = id.split("_")[1];
    console.log("Submission Type:", type);

    // Retrieve authenticated user information
    const uid = req.body.uid;
    console.log("Authenticated User ID:", uid);

    const userVotesRef = db.ref(`users/${uid}/votes`);
    const userVoteSnapshot = await userVotesRef.once("value");

    if (userVoteSnapshot.exists()) {
      const userVotes = userVoteSnapshot.val();

      // Check if the user has voted on this post
      if (id in userVotes) {
        // User is removing their vote
        const previousVoteType = userVotes[id];
        await userVotesRef.child(id).remove();

        // remove it from collections as well
        const ref = db.ref(`collections/${type}/${id}`);
        const snapshot = await ref.once("value");

        if (snapshot.exists()) {
          const data = snapshot.val();
          const voteCount = data[previousVoteType];

          // Only update the vote count if it's greater than 0
          if (voteCount > 0) {
            await ref.update({ [previousVoteType]: voteCount - 1 });
          }
        }

        res.json({
          message: `Vote removed!`,
        });
      } else {
        // User is switching there vote
        await userVotesRef.update({ [id]: voteType });

        // update the vote count in collections
        const ref = db.ref(`collections/${type}/${id}`);
        const snapshot = await ref.once("value");

        if (snapshot.exists()) {
          const data = snapshot.val();
          // update the vote count in collections
          await ref.update({
            upvotes:
              voteType === "upvotes"
                ? (data.upvotes || 0) + 1
                : data.upvotes || 0,
            downvotes:
              voteType === "downvotes"
                ? (data.downvotes || 0) + 1
                : data.downvotes || 0,
          });
        }

        const message = "Vote changed!";
        // send client a success message
        res.json({
          message: message,
        });
      }
    } else {
      // User is adding a new vote
      const newVote = {};
      newVote[id] = voteType;
      await userVotesRef.set(newVote);

      const ref = db.ref(`collections/${type}/${id}`);
      const snapshot = await ref.once("value");

      if (snapshot.exists()) {
        const data = snapshot.val();
        await ref.update({ [voteType]: (data[voteType] || 0) + 1 });
      }

      const message = "Updated vote!, " + voteType;
      // send client a success message
      res.json({
        message: message,
      });
    }
  } catch (error) {
    console.error(`Error updating ${voteType}vote:`, error);
    res.status(500).send(`Server error: ${error.message}`);
  }
};

// Route for upvoting
router.put("/upvoteSubmission/:id", async (req, res) => {
  handleVote(req, res, "upvotes");
});

// Route for downvoting
router.put("/downvoteSubmission/:id", async (req, res) => {
  handleVote(req, res, "downvotes");
});

// this is to get one submission by id
router.get("/getSubmission/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Received request for submission ID: " + id);

    const type = id.split("_")[1];

    const ref = db.ref("collections/" + type + "/" + id);

    const snapshot = await ref.once("value");

    if (snapshot.exists()) {
      console.log("Snapshot exists");
      const data = snapshot.val();
      res.json(data);
    } else {
      console.log("Snapshot does not exist");
      return res.status(404).send("Submission not found");
    }
  } catch (error) {
    return res.status(500).send("Server error: " + error.message);
  }
});

// get user by email this is for the dashboard feature 
router.get("/userDashboard/:email", async (req, res) => {
  try {
    const email = req.params.email;
    console.log("Received request for user email: " + email);

    const ref = db.ref("users");

    const snapshot = await ref.once("value");

    if (snapshot.exists()) {
      console.log("Snapshot exists");
      // find the user that matches the email address and then their data like the user uid and display name
      const data = snapshot.val();
      const user = Object.keys(data);
      const uid = user.find((user) => data[user].email === email);
      const userObject = data[uid];
      console.log("uid: " + uid);
      console.log("User object:", userObject);

      // get the user's submissions from the user's submissions reference

      const userSubmissionsRef = db.ref("users/" + uid + "/submissions");

      const userSubmissionsSnapshot = await userSubmissionsRef.once("value");

      const userSubmissionsData = userSubmissionsSnapshot.val();

      // if it's null, then the user has no submissions for this user
      if (userSubmissionsData === null) {
        return res.json({
          uid: uid,
          displayName: userObject.displayName,
          email: userObject.email,
          submissionCount: userObject.submissionCount,
        });
      }

      console.log("User submissions data:", userSubmissionsData);

      // get the submission_Poetry_1 from the user submission it's a value and find it the collections /collections

      const userSubmissions = Object.values(userSubmissionsData);

      console.log("User submissions:", userSubmissions);

      const userSubmissionKeys = userSubmissions.map(
        (submission) => submission.entry_id
      );

      console.log("User submission keys:", userSubmissionKeys);

      const userSubmissionData = {};

      for (const key of userSubmissionKeys) {
        const type = key.split("_")[1];

        const submissionRef = db.ref("collections/" + type + "/" + key);
        const submissionSnapshot = await submissionRef.once("value");
        const submissionData = submissionSnapshot.val();
        userSubmissionData[key] = submissionData;
      }

      // now we will return all of the data back to the client side
      res.json({
        uid: uid,
        displayName: userObject.displayName,
        email: userObject.email,
        submissionCount: userObject.submissionCount,
        submissions: userSubmissionData,
      });
    } else {
      console.log("Snapshot does not exist");
      return res.status(404).send("User not found");
    }
  } catch (error) {
    return res.status(500).send("Server error: " + error.message);
  }
});

module.exports = router;
