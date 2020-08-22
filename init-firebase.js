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

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        //return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error('persistence ' + errorCode + ' ' + errorMessage);
    });