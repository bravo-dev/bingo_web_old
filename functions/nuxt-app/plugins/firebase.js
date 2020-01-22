
import firebase from 'firebase'

if (!firebase.apps.length) {
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
}

export default firebase