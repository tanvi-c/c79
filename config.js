import firebase from "firebase";
require("@firebase/firestore");
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCYv-MOkDtEEWjVY3ndgdAMOIWI-LwXC3Y",
  authDomain: "elibraryapp-36d98.firebaseapp.com",
  projectId: "elibraryapp-36d98",
  storageBucket: "elibraryapp-36d98.appspot.com",
  messagingSenderId: "37757228179",
  appId: "1:37757228179:web:eaea9883c3431e3c8de966"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();