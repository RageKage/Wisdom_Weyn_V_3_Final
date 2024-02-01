let express = require("express");
let router = express.Router();
let Fuse = require("fuse.js");
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
        if (!data || Object.keys(data).length === 0) {
          return res.status(404).send("No data found");
        }

        // Merge proverbs and poetry into one array
        let mergedData = [];
        Object.keys(data).forEach((type) => {
          mergedData = mergedData.concat(Object.values(data[type]));
        });

        // Sort by up votes in descending order and then by most recent
        mergedData.sort((a, b) => {
          if (b.votes.upvote.count === a.votes.upvote.count) {
            return new Date(b.creationDate) - new Date(a.creationDate);
          }
          return b.votes.upvote.count - a.votes.upvote.count;
        });

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedData = mergedData.slice(startIndex, endIndex);

        // Check if there is any data to return
        if (paginatedData.length === 0) {
          return res.status(404).send("You have reached the end of the data");
        }

        // Return the data
        res.json(paginatedData);
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
    // get the form data
    const formData = req.body;

    // check if the form data is empty
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).send("Please provide form data");
    }

    // check that the form data has all of the required keys
    const requiredKeys = ["content", "meaning", "picked", "user_id"];
    for (const key of requiredKeys) {
      if (!formData[key]) {
        return res.status(400).send(`Missing value for key: ${key}`);
      }
    }

    // the multi-path updates object
    const updates = {};

    const getisodate = new Date().toISOString();
    const date = new Date(getisodate);

    // get the reference to the user's submissions
    const userSubmissionRef = db.ref(
      `users/${formData.user_id.uid}/submissions`
    );

    // create a new entry id using firebase push
    const submissionRef = userSubmissionRef.push();
    const newEntryID = submissionRef.key;

    // create a new submission key
    let submissionKey = `submission_${formData.picked}_${newEntryID}`;

    // create the submission data object
    const submissionData = {
      entry_id: submissionKey,
      user_id: formData.user_id.uid,
    };

    // add the path the updates object to the update the user's submissions
    updates[`users/${formData.user_id.uid}/submissions/${submissionKey}`] =
      submissionData;

    // update the user's submission count
    const updateUserCount = db.ref(`users/${formData.user_id.uid}`);
    const userCountSnapshot = await updateUserCount.once("value");
    const userCount = userCountSnapshot.child("submissionCount").val() || 0;

    // add the path to the updates object to update the user's submission count
    updates[`users/${formData.user_id.uid}/submissionCount`] = userCount + 1;

    // collection data
    const collectionData = {
      id: submissionKey,
      entry_id: newEntryID,
      title: formData.title,
      content: formData.content,
      meaning: formData.meaning,
      creationDate: date,
      // item.votes.upvote.
      votes: {
        upvote: {
          count: 0,
        },
        downvote: {
          count: 0,
        },
      },
      flagged: false,
      submittedBy: formData.user_id.email,
      username: formData.user_id.username,
      type: formData.picked,
    };

    // add the path to the updates object to update the collection
    updates[`collections/${formData.picked}/${submissionKey}`] = collectionData;

    // now we update the database with the new submission all at once using multi-path updates and also error handling
    try {
      await db.ref().update(updates);
      res.json({ message: "Submission successful!" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Server error: " + error.message);
    }
  } catch (error) {
    console.error("Error in submission:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to handle voting
const handleVote = async (req, res, newVoteType) => {
  try {
    const id = req.params.id;
    const uid = req.body.uid;
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
    console.error(`Error updating vote:`, error);
    res.status(500).send(`Server error: ${error.message}`);
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
      return res.status(404).send("Submission not found");
    }
  } catch (error) {
    return res.status(500).send("Server error: " + error.message);
  }
});

// get user data by email this is for the dashboard feature
router.get("/users/:email/dashboard", async (req, res) => {
  try {
    // get the email from the request
    const email = req.params.email;
    const usersRef = db.ref("users");

    const usersSnapshot = await usersRef
      .orderByChild("email")
      .equalTo(email)
      .once("value"); // get the user data

    if (!usersSnapshot.exists()) {
      return res.status(404).send("User not found");
    }

    const userData = usersSnapshot.val();
    const uid = Object.keys(userData)[0];
    const userObject = userData[uid];

    const userSubmissionsRef = db.ref(`users/${uid}/submissions`);
    const userSubmissionsSnapshot = await userSubmissionsRef.once("value");
    const userSubmissionsData = userSubmissionsSnapshot.val() || {}; // get the user's submissions

    const submissionKeys = Object.keys(userSubmissionsData);
    const submissionPromises = submissionKeys.map((key) => {
      const type = key.split("_")[1];
      const submissionRef = db.ref(`collections/${type}/${key}`);
      return submissionRef.once("value");
    });

    // get all of the user's submissions
    const submissionSnapshots = await Promise.all(submissionPromises);

    // create an object with the user's submissions
    const userSubmissionData = {};
    submissionSnapshots.forEach((snapshot) => {
      const data = snapshot.val();
      if (data !== null && data.id !== undefined) {
        userSubmissionData[data.id] = data;
      }
    });

    // get the user's submission count
    const submissionsCount = {
      proverbs: submissionKeys.filter((key) => key.includes("proverb")).length,
      poetrys: submissionKeys.filter((key) => key.includes("Poetry")).length,
      totalSubmissions: submissionKeys.length,
    };

    // get the top 5 most voted submissions
    const mostVotes = Object.values(userSubmissionData).filter(
      (submission) => submission.votes.upvote.count > 0
    );
    const mostRecent = Object.values(userSubmissionData);

    // sort the submissions by most votes and most recent
    mostVotes.sort((a, b) => b.votes.upvote.count - a.votes.upvote.count);
    mostVotes.splice(5);

    mostRecent.sort(
      (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
    );
    mostRecent.splice(5);

    // return the user data
    res.json({
      uid: uid,
      username: userObject.username,
      email: userObject.email,
      submissionCount: userObject.submissionCount,
      userStats: submissionsCount,
      mostVotes: mostVotes,
      mostRecent: mostRecent,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send("Server error: " + error.message);
  }
});

// delete a submission
router.delete("/submissions/:id/:uid", (req, res) => {
  const id = req.params.id;
  const uid = req.params.uid;

  // the updates object
  let updates = {};

  // Check if the user is authenticated to delete the submission
  const userRef = db.ref("users/" + uid);
  userRef.once("value", (userSnapshot) => {
    if (!userSnapshot.exists()) {
      return res.status(404).send("User not found");
    }

    const userSubmissionsRef = db.ref(`users/${uid}`);

    const submissionKey = userSubmissionsRef
      .orderByChild("submissions")
      .equalTo(id);

    userSubmissionsRef.once("value", (userSubmissionsSnapshot) => {
      if (!userSubmissionsSnapshot.exists()) {
        console.error("User has no submissions");
        return res.status(404).send("Submission not found");
      }

      if (!submissionKey) {
        return res.status(404).send("Submission not found");
      }

      // Remove the submission from the collections
      const type = id.split("_")[1];
      const collectionRef = db.ref(`collections/${type}/${id}`);
      collectionRef.once("value", (collectionSnapshot) => {
        if (collectionSnapshot.exists()) {
          // remove the data from the updates object
          updates[`collections/${type}/${id}`] = null;
        }

        // Remove the submission from the user's submissions
        updates[`users/${uid}/submissions/${id}`] = null;

        // update the user's submission count, decrement by 1
        const usersubRef = db.ref(`users/${uid}/submissions`);
        usersubRef.once("value", (usersubSnapshot) => {
          const newSubmissionCount = usersubSnapshot.numChildren();

          if (newSubmissionCount <= 0) {
            updates[`users/${uid}/submissionCount`] = 0;
          } else {
            updates[`users/${uid}/submissionCount`] = newSubmissionCount;
          }

          // now remove it from the user's votes collection
          const userVotesRef = db.ref(`users/${uid}/votes`);
          userVotesRef.once("value", (userVotesSnapshot) => {
            if (userVotesSnapshot.exists()) {
              const submissionKey = userSubmissionsRef
                .orderByChild("votes")
                .equalTo(id);

              if (submissionKey) {
                updates[`users/${uid}/votes/${id}`] = null;
              }
            }

            // now we update the database with the new submission all at once using multi-path updates and also error handling
            db.ref()
              .update(updates)
              .then(() => {
                res.json({
                  message: "Submission deleted!",
                });
              })
              .catch((error) => {
                console.error("Error:", error);
                return res.status(500).send("Server error: " + error.message);
              });
          });
        });
      });
    });
  });
});

// update username
router.put("/users/:uid", (req, res) => {
  const uid = req.params.uid;
  const newUsername = req.body.username;

  // the updates object
  const updates = {};

  // Check if the user is authenticated to update the username
  const userRef = db.ref("users/" + uid);
  userRef.once("value", (userSnapshot) => {
    if (!userSnapshot.exists()) {
      return res.status(404).send("User not found");
    }

    userRef.once("value", (userSnapshot) => {
      if (!userSnapshot.exists()) {
        return res.status(404).send("User not found");
      }

      const userData = userSnapshot.val(); // get user data
      const oldUsername = userData.username; // get old username

      // Update usernames in user collection
      updates[`/users/${uid}/username`] = newUsername;

      // Update username in submissions collection
      if (userData.submissions) {
        for (const submissionKey of Object.keys(userData.submissions)) {
          const type = submissionKey.split("_")[1];
          updates[`/collections/${type}/${submissionKey}/username`] =
            newUsername;
        }
      }

      // Update the username in the usernames collection as well
      updates[`/usernames/${oldUsername}`] = null; // remove old username
      updates[`/usernames/${newUsername}`] = { uid: uid }; // add new username

      // now we update the database with the new username all at once using multi-path updates and also error handling
      db.ref()
        .update(updates)
        .then(() => {
          res.status(200).json({ message: "Username updated successfully" });
        })
        .catch((error) => {
          console.error("Error:", error);
          return res.status(500).send("Server error: " + error.message);
        });
    });
  });
});

// search for a submission by proverbs or poetry, or title
//         .get(apiPath + `/search/${query}`, { headers })

router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const results = await searchDatabase(query);

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).send("No matches found");
    }
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
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
