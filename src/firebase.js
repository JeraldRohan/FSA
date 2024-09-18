import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiVtPAGS8k9xUid-W5rQDJPj0qDoBmcuA",
  authDomain: "full-stack-c6372.firebaseapp.com",
  projectId: "full-stack-c6372",
  storageBucket: "full-stack-c6372.appspot.com",
  messagingSenderId: "863822998103",
  appId: "1:863822998103:web:14cdcdd11be6d0ad92d112",
  measurementId: "G-8EHK5QHV6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };