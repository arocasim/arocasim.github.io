import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_tAJvCTjKToN2BK72DmCLwYuy33w8MzM",
  authDomain: "recipes-de725.firebaseapp.com",
  projectId: "recipes-de725",
  storageBucket: "recipes-de725.firebasestorage.app",
  messagingSenderId: "330902086589",
  appId: "1:330902086589:web:27892f404d198b0c0268d4",
  measurementId: "G-97CQW8GN5T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
export { auth, db, analytics };
