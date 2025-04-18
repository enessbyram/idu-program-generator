import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';


const firebaseConfig = {
    apiKey: "AIzaSyC2bRW8OwlwqhzDA3YqC9Zp1MzypwVNY2g",
    authDomain: "idu-program-generator.firebaseapp.com",
    projectId: "idu-program-generator",
    storageBucket: "idu-program-generator.firebasestorage.app",
    messagingSenderId: "1000218237620",
    appId: "1:1000218237620:web:e730ac1c7237770ade95e1",
    measurementId: "G-76YZQZH8Z6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db }