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

    const type = id.split("_")[1];

    // Retrieve authenticated user information
    const uid = req.body.uid;

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
    // TODO COME BACK TO THIS ERROR
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

    const type = id.split("_")[1];

    const ref = db.ref("collections/" + type + "/" + id);

    const snapshot = await ref.once("value");

    if (snapshot.exists()) {
      const data = snapshot.val();
      res.json(data);
    } else {
      return res.status(404).send("Submission not found");
    }
  } catch (error) {
    // TODO COME BACK TO THIS ERROR
    return res.status(500).send("Server error: " + error.message);
  }
});

// get user data by email this is for the dashboard feature
// ... (other imports and code)

router.get("/userDashboard/:email", async (req, res) => {
  try {
    const startTime = performance.now();
    const email = req.params.email;

    const usersRef = db.ref("users");
    const usersSnapshot = await usersRef.orderByChild("email").equalTo(email).once("value");

    if (!usersSnapshot.exists()) {
      return res.status(404).send("User not found");
    }

    const userData = usersSnapshot.val();
    const uid = Object.keys(userData)[0];
    const userObject = userData[uid];

    const userSubmissionsRef = db.ref(`users/${uid}/submissions`);
    const userSubmissionsSnapshot = await userSubmissionsRef.once("value");
    const userSubmissionsData = userSubmissionsSnapshot.val();

    // console.log("userSubmissionsData", userSubmissionsData);

    if (!userSubmissionsData) {
      var endTime = performance.now();
      console.log("No submissions, this query took " + (endTime - startTime) + " milliseconds.");
      return res.json({
        uid: uid,
        displayName: userObject.displayName,
        email: userObject.email,
        submissionCount: userObject.submissionCount,
      });
    }

    const userSubmissionData = {};
    const submissionsCount = {
      proverbs: 0,
      poetrys: 0,
    };
    const mostVotes = [];
    const mostRecent = [];

    const submissionKeys = Object.keys(userSubmissionsData);
    const submissionPromises = submissionKeys.map(key => {
      const submission = userSubmissionsData[key];

      const type = submission.entry_id.split("_")[1];


      const submissionRef = db.ref(`collections/${type}/${submission.entry_id}`);
      return submissionRef.once("value");
    });

    const submissionSnapshots = await Promise.all(submissionPromises);

    submissionSnapshots.forEach((submissionSnapshot, index) => {
      const submissionData = submissionSnapshot.val();
      const key = submissionKeys[index];

      userSubmissionData[key] = {
        title: submissionData.title,
        content: submissionData.content,
        creationDate: submissionData.creationDate
      };



      const submission = submissionData.id

      console.log("submission", submission);

      const type = submission.split("_")[1];

      submissionsCount[type] = (submissionsCount[type] || 0) + 1;
      

      if (userSubmissionData[key].upvotes >= 1) {
        mostVotes.push(userSubmissionData[key]);
      }


      mostRecent.push(userSubmissionData[key]);
    });

 
    // Sort mostVotes and mostRecent and return the top 5
    mostVotes.sort((a, b) => b.upvotes - a.upvotes);
    mostRecent.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

    // Limit to the top 5
    mostVotes.splice(5);
    mostRecent.splice(5);

    var endTime = performance.now();
    console.log("Yes submissions, this query took " + (endTime - startTime) + " milliseconds.");

    res.json({
      uid: uid,
      displayName: userObject.displayName,
      email: userObject.email,
      submissionCount: userObject.submissionCount,
      userStats: {
        proverbs: submissionsCount["proverb"],
        poetrys: submissionsCount["Poetry"],
        totalSubmissions: submissionKeys.length,
      },
      mostVotes: mostVotes,
      mostRecent: mostRecent,
    });

    console.log(res)
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).send("Server error: " + error.message);
  }
});



module.exports = router;
