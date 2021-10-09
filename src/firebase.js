import firebase from "firebase/compat";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAoo61qZkNWaubIqyODOkamcu9fCP0VbFA",
  authDomain: "my-project-v1-3a2a2.firebaseapp.com",
  projectId: "my-project-v1-3a2a2",
  storageBucket: "my-project-v1-3a2a2.appspot.com",
  messagingSenderId: "803740137218",
  appId: "1:803740137218:web:8393bb85b6c22a3e2a741b",
  measurementId: "G-RELD43NLV8",
});

const db = app.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
