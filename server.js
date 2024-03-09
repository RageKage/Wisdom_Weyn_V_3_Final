let express = require("express");
var cors = require("cors");
let admin = require("firebase-admin");

// Import your service account here to use in production
var serviceAccount = require("./wisdom-weyn-firebase-adminsdk-cmkcb-2df3bce2fb.json");

// Default configuration for production
let config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wisdom-weyn-default-rtdb.firebaseio.com",
};

// Modify config for non-production environments
if (process.env.NODE_ENV !== "production") {
  // Point to the local Firebase emulator for database
  config = {
    databaseURL: "http://127.0.0.1:9000/?ns=wisdom-weyn-default-rtdb",
    credential: admin.credential.cert(serviceAccount),
  };

  // Point to the local Firebase Auth emulator
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

  // Point to the local Firebase Database emulator
  process.env.FIREBASE_DATABASE_EMULATOR_HOST = "localhost:9000";
}

// Initialize Firebase Admin with the configured settings
admin.initializeApp(config);

let api = require("./routes/endpoint");

let app = express();

app.use(cors());

app.use(express.json());
app.use("/api", api);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
  res.status(500).send("Server error: " + err.message); // Improved error handling
});

// Start server on the specified port or default to 3000
let server = app.listen(process.env.PORT || 3000, function () {
  console.log("server running on port " + server.address().port);
});
