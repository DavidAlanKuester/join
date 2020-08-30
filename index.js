firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
    } else {
        // User is signed out.
        ui.start('#firebaseui-auth-container', uiConfig);
    }
}, function (error) {
    console.log(error);
});