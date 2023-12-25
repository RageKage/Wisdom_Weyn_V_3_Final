// auth.js
import { ref } from "vue";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";

const auth = getAuth();
const user = ref(null);

// Sign up with email and password
function signupWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Sign in with email and password
function signinWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Sign in with Google
function signinWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

// Export the functions and reactive data
export { user, signupWithEmail, signinWithEmail, signinWithGoogle };
