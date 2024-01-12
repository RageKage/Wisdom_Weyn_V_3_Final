let express = require("express");
let router = express.Router();
router.use(express.json());

// Import Firebase Admin
let admin = require("firebase-admin");

var db = admin.database();

// getting all of the data in my collections
router.get("/collections", function (req, res) {
  try {
    const ref = db.ref("/collections");

    ref.once(
      "value",
      (snapshot) => {
        let data = snapshot.val();
        res.json(data);
      },
      (errorObject) => {
        res
          .status(500)
          .send("Error reading from database: " + errorObject.name);
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Server error: " + error.message);
  }
});

// ! future update make this code more efficient and smaller using multi-path updates,
// this is to add a new submission to the database
router.post("/submissions", async (req, res) => {
  try {
    // this is the data that is being sent from the client side
    const formData = req.body;

    // validate the form isn't empty
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).send("Please provide form data");
    }

    // make sure we have the right keys
    const requiredKeys = ["content", "meaning", "picked", "user_id"];
    for (const key of requiredKeys) {
      if (!formData.hasOwnProperty(key) || !formData[key]) {
        return res.status(400).send(`Missing or empty value for key: ${key}`);
      }
    }

    // this is to get the date and time of the submission
    const getisodate = new Date().toISOString();
    const date = new Date(getisodate);

    // now we need to add the submission to the user's submissions, creating a path to the user's submissions
    const userSubmissionRef = db.ref(
      "users/" + formData.user_id.uid + "/submissions"
    );

    // now we need to create a unique key for the submission
    const submissionRef = userSubmissionRef.push();

    const newEntryID = submissionRef.key;

    // create a unique key for the submission
    let submissionKey = "submission_" + newEntryID;

    // now we need to check what type of submission it is and add the type to the key
    if (formData.picked === "proverb") {
      submissionKey = "submission_proverb_" + newEntryID;
    } else if (formData.picked === "Poetry") {
      submissionKey = "submission_Poetry_" + newEntryID;
    }

    // now we check if the user has any submissions if so we add to it if not we create it
    const userSnapshot = await userSubmissionRef.once("value");

    // this for future use if we want to edit the submission
    if (userSnapshot.exists()) {
      await userSubmissionRef.update({
        [newEntryID]: {
          entry_id: submissionKey,
          user_id: formData.user_id.uid,
        },
      });
    }
    // if the user does not have any submissions we create it and add the first submission
    else {
      await userSubmissionRef.set({
        [newEntryID]: {
          entry_id: submissionKey,
          user_id: formData.user_id.uid,
        },
      });
    }

    // now we need to update the user's submission count
    const updateUserCount = db.ref("users/" + formData.user_id.uid);

    const userCountSnapshot = await updateUserCount.once("value");

    const userCountData = userCountSnapshot.val();

    const userCount = userCountData.submissionCount;

    if (userCountSnapshot.exists()) {
      await updateUserCount.update({
        submissionCount: userCount + 1,
      });
    }

    // send client a success message
    res.json({
      message: "Submission successful!",
    });

    // now we create make path to the collection find the type and add the submission key to it, this should create a path like this collections/Poetry/submission_Poetry_1
    const collectionRef = db.ref(
      "collections/" + formData.picked + "/" + submissionKey
    );

    const collectionSnapshot = await userSubmissionRef.once("value");

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
        submittedBy: formData.user_id.email,
        username: formData.user_id.username,
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
        submittedBy: formData.user_id.email,
        username: formData.user_id.username,
        type: formData.picked,
      });
    }
  } catch (error) {
    return res.status(500).send("Server error: " + error.message);
  }
});
// ! future update make this code more efficient and smaller using multi-path updates, also improve the error handling and also redo the upvote and downvote code, instead of downvote create a report this way we can keep track of the number of reports and if it reaches a certain number we can delete the submission
// function to handle upvoting and downvoting
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
    console.error(`Error updating ${voteType}vote:`, error);
    res.status(500).send(`Server error: ${error.message}`);
  }
};

// Route for upvoting
router.put("/submissions/:id/upvote", async (req, res) => {
  handleVote(req, res, "upvotes");
});

// Route for downvoting
router.put("/submissions/:id/downvote", async (req, res) => {
  handleVote(req, res, "downvotes");
});

// ! future update make this code more efficient and smaller using multi-path updates
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
      return res.status(404).send("Submission not found");
    }
  } catch (error) {
    return res.status(500).send("Server error: " + error.message);
  }
});

// ! future update make this code more efficient and smaller using multi-path updates
// get user data by email this is for the dashboard feature
router.get("/users/:email/dashboard", async (req, res) => {
  try {
    const email = req.params.email;

    const usersRef = db.ref("users");

    // get the user by email
    const usersSnapshot = await usersRef
      .orderByChild("email")
      .equalTo(email)
      .once("value");

    // if the user does not exist return a 404
    if (!usersSnapshot.exists()) {
      return res.status(404).send("User not found");
    }

    const userData = usersSnapshot.val();
    const uid = Object.keys(userData)[0];
    const userObject = userData[uid];

    const userSubmissionsRef = db.ref(`users/${uid}/submissions`);
    const userSubmissionsSnapshot = await userSubmissionsRef.once("value");
    const userSubmissionsData = userSubmissionsSnapshot.val();

    // If the user has no submissions, return the user object
    if (!userSubmissionsData) {
      return res.json({
        uid: uid,
        username: userObject.username,
        email: userObject.email,
        submissionCount: userObject.submissionCount,
      });
    }

    const userSubmissionData = {};

    // track the number of submissions
    const submissionsCount = {
      proverbs: 0,
      poetrys: 0,
    };

    // track the most votes and most recent submissions
    const mostVotes = [];
    const mostRecent = [];

    // get the keys of the submissions
    const submissionKeys = Object.keys(userSubmissionsData);
    const submissionPromises = submissionKeys.map((key) => {
      const submission = userSubmissionsData[key];

      const type = submission.entry_id.split("_")[1];

      const submissionRef = db.ref(
        `collections/${type}/${submission.entry_id}`
      );
      return submissionRef.once("value");
    });

    const submissionSnapshots = await Promise.all(submissionPromises); // get all of the submissions

    submissionSnapshots.forEach((submissionSnapshot, index) => {
      const submissionData = submissionSnapshot.val();
      const key = submissionKeys[index];

      // from the submission data we only need the title, content, creationDate, id, and upvotes, nothing else
      userSubmissionData[key] = {
        title: submissionData.title,
        content: submissionData.content,
        creationDate: submissionData.creationDate,
        id: submissionData.id,
        upvotes: submissionData.upvotes,
      };

      const submission = submissionData.id;

      const type = submission.split("_")[1];

      // increment the submission count
      submissionsCount[type] = (submissionsCount[type] || 0) + 1;

      // Add the submission to mostVotes and mostRecent if it has at least 1 upvote
      if (userSubmissionData[key].upvotes >= 1) {
        mostVotes.push(userSubmissionData[key]);
      }

      // Add the submission to mostRecent
      mostRecent.push(userSubmissionData[key]);
    });

    // Sort mostVotes and mostRecent and return the top 5
    mostVotes.sort((a, b) => b.upvotes - a.upvotes);

    // Sort by creation date
    mostRecent.sort(
      (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
    );

    // Limit to the top 5
    mostVotes.splice(5);
    mostRecent.splice(5);

    // return the data
    res.json({
      uid: uid,
      username: userObject.username,
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
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send("Server error: " + error.message);
  }
});

// ! future update make this code more efficient and smaller using multi-path updates
// delete a submission
router.delete("/submissions/:id/:uid", async (req, res) => {
  try {
    const id = req.params.id;
    const uid = req.params.uid;

    // Check if the user is authenticated to delete the submission
    const userRef = db.ref("users/" + uid);
    const userSnapshot = await userRef.once("value");

    if (!userSnapshot.exists()) {
      return res.status(404).send("User not found");
    }

    const userSubmissionsRef = db.ref(`users/${uid}/submissions`);
    const userSubmissionsSnapshot = await userSubmissionsRef.once("value");

    if (!userSubmissionsSnapshot.exists()) {
      console.error("User has no submissions");
      return res.status(404).send("Submission not found");
    }

    const userSubmissionsData = userSubmissionsSnapshot.val();
    const submissionKeys = Object.keys(userSubmissionsData);
    const submissionKey = submissionKeys.find((key) => {
      const submission = userSubmissionsData[key];
      return submission.entry_id === id;
    });

    if (!submissionKey) {
      return res.status(404).send("Submission not found");
    }

    // Remove the submission from the collections
    const type = id.split("_")[1];
    const collectionRef = db.ref(`collections/${type}/${id}`);
    const collectionSnapshot = await collectionRef.once("value");

    if (collectionSnapshot.exists()) {
      await collectionRef.remove();
    }

    // Remove the submission from the user's submissions
    await userSubmissionsRef.child(submissionKey).remove();

    // update the user's submission count, decrement by 1
    const newSubmissionCount = Object.keys(userSubmissionsData).length;

    if (newSubmissionCount <= 0) {
      await userRef.update({ submissionCount: 0 });
    }

    await userRef.update({ submissionCount: newSubmissionCount });

    // now remove it from the user's votes collection
    const userVotesRef = db.ref(`users/${uid}/votes`);
    const userVotesSnapshot = await userVotesRef.once("value");

    if (userVotesSnapshot.exists()) {
      const userVotesData = userVotesSnapshot.val();
      const voteKeys = Object.keys(userVotesData);
      const voteKey = voteKeys.find((key) => {
        return key === id;
      });

      if (voteKey) {
        await userVotesRef.child(voteKey).remove();
      }
    }

    res.json({
      message: "Submission deleted!",
    });
  } catch (error) {
    return res.status(500).send("Server error: " + error.message);
  }
});

// check server status
router.get("/server/status", async (req, res) => {
  try {
    res.json({
      message: "Server is up!",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Server error: " + error.message);
  }
});

// update username
router.put("/users/:uid", async (req, res) => {
  try {
    // Get user reference
    const userRef = db.ref("users/" + req.params.uid);
    const userSnapshot = await userRef.once("value");

    if (!userSnapshot.exists()) {
      return res.status(404).send("User not found");
    }

    const userData = userSnapshot.val(); // get user data
    const oldUsername = userData.username; // get old username
    const newUsername = req.body.username; // the new one

    // the updates object
    let updates = {};

    // Update usernames in user collection
    updates[`/users/${req.params.uid}/username`] = newUsername;

    // Update username in submissions collection
    if (userData.submissions) {
      for (const submission of Object.values(userData.submissions)) {
        const type = submission.entry_id.split("_")[1];
        updates[`/collections/${type}/${submission.entry_id}/username`] =
          newUsername;
      }
    }

    // Update the username in the usernames collection as well
    updates[`/usernames/${oldUsername}`] = null; // remove old username
    updates[`/usernames/${newUsername}`] = { uid: req.params.uid }; // add new username

    // now we update the database with the new username all at once using multi-path updates and also error handling
    try {
      await db.ref().update(updates);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Server error: " + error.message);
    }

    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Server error: " + error.message);
  }
});

// get user by id
// router.get('/users/:id', async (req, res) => {
//   try {
//     const id = req.params.id;

//     const userRef = db.ref('users/' + id);
//     const userSnapshot = await userRef.once('value');

//     if (!userSnapshot.exists()) {
//       return res.status(404).send('User not found');
//     }

//     const userData = userSnapshot.val();

//     res.json({
//       uid: userData.uid,
//       displayName: userData.displayName,
//       email: userData.email,
//       submissionCount: userData.submissionCount,
//     });
//   } catch (error) {
//     return res.status(500).send('Server error: ' + error.message);
//   }
// })

module.exports = router;
