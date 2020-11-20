// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    // ...
    apiKey: "AIzaSyDRpOoUeyOqoVIZCiRIiwNj4pVFn8qgW2s",
    authDomain: "join-a7169.firebaseapp.com",
    databaseURL: "https://join-a7169.firebaseio.com",
    projectId: "join-a7169",
    storageBucket: "join-a7169.appspot.com",
    messagingSenderId: "1033729031894",
    appId: "1:1033729031894:web:22aaf4c9c0c2e8e2ee9377",
    measurementId: "G-383YPV4VPK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// initiate and create a reference to firebase storage
var storage = firebase.storage();
var storageRef = storage.ref();
var database = firebase.database();
var databaseRef = database.ref();
var auth = firebase.auth();
authRef = auth.ref;
