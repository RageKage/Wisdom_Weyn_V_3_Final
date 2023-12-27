// For firebase authentications  and getting data from firebase for user authentication
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

function currentUser() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null); // set to null if no user logged in
        }
      },
      reject
    );
  });
}

// this is to get the current user from our db
function getCurrentUser(Useruid) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const userLocation = ref(db, "users/" + Useruid);

    onValue(
      userLocation,
      (snapshot) => {
        const data = snapshot.val();
        resolve(data); // return the data if the promise is resolved
      },
      (error) => {
        reject(error); //
      }
    );
  });
}

// signout the user

function signout() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (auth) {
      resolve(signOut(auth));
    } else {
      reject("User not signed out");
    }
  });
}

export { currentUser, getCurrentUser, signout };
