const admin = require("firebase-admin");
const db = admin.database();

var handleError = require("../errorHandler").handleError;
var verifyToken = require("../errorHandler.js").verifyToken;
var sendNotFound = require("../errorHandler.js").sendNotFound;
var sendUnauthorized = require("../errorHandler.js").sendUnauthorized;

const DeleteSubmission = async (id, uid, res) => {
  // the updates object
  let updates = {};

  // Check if the user is authenticated to delete the submission
  const userRef = db.ref("users/" + uid);
  userRef.once("value", (userSnapshot) => {
    if (!userSnapshot.exists()) {
      return sendNotFound(res, "User not found");
    }

    const userSubmissionsRef = db.ref(`users/${uid}`);

    const submissionKey = userSubmissionsRef
      .orderByChild("submissions")
      .equalTo(id);

    userSubmissionsRef.once("value", (userSubmissionsSnapshot) => {
      if (!userSubmissionsSnapshot.exists()) {
        console.error("User has no submissions");
        return sendNotFound(res, "User has no submissions");
      }

      if (!submissionKey) {
        return sendNotFound(res, "Submission not found");
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
                return handleError(res, error);
              });
          });
        });
      });
    });
  });
};

module.exports = { DeleteSubmission };
