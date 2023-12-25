let express = require("express");

let router = express.Router();

// getting all of the data in my collections "Collections"

// sending a submission to firebase (proverb or poem)

// ! FUTURE IMPLEMENTATION

var admin = require("firebase-admin");

var db = admin.database();

// example testing for firebase
router.get('/testing', function(req, res) {
  // set a reference to to my collection collections
  const ref = db.ref('/collections');

  // now we get the collection
  ref.once('value', (snapshot) => {
    let data = snapshot.val();
    console.log(data);
    res.json(data); // send it to the client side
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
    res.status(500).send('Error reading from database: ' + errorObject.name);
  });
});

module.exports = router;
