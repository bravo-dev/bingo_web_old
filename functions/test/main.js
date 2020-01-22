const firebase = require('firebase')
require('firebase/firestore')
const firebaseConfig = {
    apiKey: "AIzaSyAeFm_Pt77a4MJTm_kVc3bmJwsOmjtj0XQ",
    authDomain: "bingo-bravo.firebaseapp.com",
    databaseURL: "https://bingo-bravo.firebaseio.com",
    projectId: "bingo-bravo",
    storageBucket: "bingo-bravo.appspot.com",
    messagingSenderId: "881248657163",
    appId: "1:881248657163:web:d3fed59e3a60a6a8f28c0e"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

db.collection("users").add({
    code: "xxxxxx",
    name: "hiro"
})
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.log("Error adding document: ", error)
})