const admin = require("firebase-admin");
const db = admin.database();

function handleError(res, error) {
  // Determine the status code based on the error code
  let statusCode = 500; // Default to internal server error
  let errorMessage = error || "An unexpected error occurred.";

  switch (error.code) {
    case "auth/id-token-expired":
      statusCode = 403; // Forbidden
      errorMessage = "Session expired, please login again.";
      break;
    case "auth/email-already-exists":
      statusCode = 400; // Bad Request
      errorMessage = "The email address is already in use by another account.";
      break;
    case "auth/invalid-email":
      statusCode = 400;
      errorMessage = "The email address is improperly formatted.";
      break;

    case "auth/invalid-password":
      statusCode = 400;
      errorMessage = "The password is invalid.";
      break;

    case "auth/invalid-uid":
      statusCode = 400;
      errorMessage = "The user ID must be a non-empty string.";
      break;

    case "auth/user-not-found":
      statusCode = 404;
      errorMessage = "User not found.";
      break;
    default:
      break;
  }

  res.status(statusCode).json(errorMessage);
}

async function verifyToken(idToken) {
  return await admin.auth().verifyIdToken(idToken);
}

function sendUnauthorized(res, message) {
  res.status(401).send(message);
}

function sendNotFound(res, message) {
  res.status(404).send(message);
}

module.exports = {
  handleError,
  verifyToken,
  sendUnauthorized,
  sendNotFound,
};
