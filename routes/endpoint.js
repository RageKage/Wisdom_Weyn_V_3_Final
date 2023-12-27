let express = require("express");
let router = express.Router();
router.use(express.json());

// Import Firebase Admin
// const functions = require("firebase-functions");
let admin = require("firebase-admin");

var db = admin.database();
const { set, ref } = require("firebase/database");

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
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();

    // this is the current date in the format of Month Day, Year
    const currentDate = `${month} ${day}, ${year}`;

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
    // this creates a reference to the path of the type or in this case teh form.type and then it's new id "newEntryID"
    const newEntryRef = db.ref(`${formData.picked}s/${newEntryID}`);

    // this is the data that will be saved into the reference above
    const entryData = {
      id: newEntryID,
      title: formData.title,
      content: formData.content,
      meaning: formData.meaning,
      creationDate: currentDate,
      upvotes: 0,
      downvotes: 0,
      flagged: false,
    };
    // this will now save that data into the reference
    await newEntryRef.set(entryData);

    // now we need to add the submission to the user's submissions
    const userSubmissionRef = db.ref(
      "users/" + formData.user_id + "/submissions"
    );

    // now we check if the user has any submissions if so we add to it if not we create it
    const userSnapshot = await userSubmissionRef.once("value");

    if (userSnapshot.exists()) {
      await userSubmissionRef.update({
        [newEntryID]: {
          entry_id: newEntryID,
          user_id: formData.user_id,
        },
      });
    }
    // if the user does not have any submissions we create it and add the first submission
    else {
      await userSubmissionRef.set({
        [newEntryID]: {
          entry_id: newEntryID,
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

    // create a unique key for the submission
    const submissionKey = "submission_" + newEntryID;

    // make path to the collection find the type and add the submission key to it, this should create a path like this collections/Poetry/submission_Poetry_1
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
        entry_id: newEntryID,
        title: formData.title,
        content: formData.content,
        meaning: formData.meaning,
        creationDate: currentDate,
        upvotes: 0,
        downvotes: 0,
        flagged: false,
        submittedBy: email,
        username: username,
        type: formData.picked,
      });
    } else {
      await collectionRef.set({
        entry_id: newEntryID,
        title: formData.title,
        content: formData.content,
        meaning: formData.meaning,
        creationDate: currentDate,
        upvotes: 0,
        downvotes: 0,
        flagged: false,
        submittedBy: email,
        username: username,
        type: formData.picked,
      });
    }

    // send client a data object with the new entry id and a success message
    res.json({
      message: "Submission successful!",
    });
  } catch (error) {
    return res.status(500).send("Server error: " + error.message);
  }
});

module.exports = router;
