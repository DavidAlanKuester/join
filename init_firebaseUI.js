firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return; //firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error('persistence ' + errorCode + ' ' + errorMessage);
    });

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// FirebaseUI config.
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
            var user = authResult.user;
            var credential = authResult.credential;
            var isNewUser = authResult.additionalUserInfo.isNewUser;
            var providerId = authResult.additionalUserInfo.providerId;
            var operationType = authResult.operationType;
            // Do something with the returned AuthResult.
            if (isNewUser) {
                user.updateProfile({
                    photoURL: "./img/id0.png"
                }).then(function () {
                    // Update successful.
                    let isDone = writeUserData(user.uid, user.displayName, user.email, user.photoURL);
                    isDone.then(function () {
                        window.location.href = './addTask.html';
                    });
                }).catch(function (error) {
                    // An error happened.
                });
            } else {
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return true;
            }
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInSuccessUrl: './addTask.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        window.location.assign('<your-privacy-policy-url>');
    }
};