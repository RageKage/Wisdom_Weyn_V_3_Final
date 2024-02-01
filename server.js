let express = require("express");
var cors = require("cors");
let admin = require("firebase-admin");

// initialize Firebase Admin using our env called ADMIN_SDK
// console.log(process.env);
var serviceAccount = require('./wisdom-weyn-firebase-adminsdk-cmkcb-2df3bce2fb.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wisdom-weyn-default-rtdb.firebaseio.com",
});

let api = require("./routes/endpoint");

let app = express();
app.use(cors());

app.use(express.json());
app.use("/api", api);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
  res.status(500).send("Server error: " + err);
});

let server = app.listen(process.env.PORT || 3000, function () {
  console.log("server running on port " + server.address().port);
});
