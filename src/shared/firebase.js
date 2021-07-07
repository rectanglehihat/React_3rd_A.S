import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCbT8BA6xyI5DFHNZEjJqAyBeVWLbDqGd4",
    authDomain: "magazine-4af00.firebaseapp.com",
    projectId: "magazine-4af00",
    storageBucket: "magazine-4af00.appspot.com",
    messagingSenderId: "927140096923",
    appId: "1:927140096923:web:f0117121bed3c9db670f3e",
    measurementId: "G-3FZLEPRN1R"
}

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export{auth, apiKey, firestore, storage};