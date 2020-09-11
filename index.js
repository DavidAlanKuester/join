firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        sidebarSetUserImg();
        document.getElementById('loader').style.display = 'none';
        document.getElementById("user-profile-container").classList.remove("d-none");
        document.getElementById("firebaseui-auth-container").classList.add("d-none");
        document.getElementById("user-name").innerHTML = user.displayName;
        document.getElementById("user-email").innerHTML = user.email;
        document.getElementById("user-img2").src = user.photoURL;
    } else {
        // User is signed out.
        document.getElementById("user-profile-container").classList.add("d-none");
        document.getElementById("firebaseui-auth-container").classList.remove("d-none");
        ui.start('#firebaseui-auth-container', uiConfig);
    }
}, function (error) {
    console.log(error);
});

function openDeleteAccountDialog() {
    document.getElementById("user-profile-container").classList.add("d-none");
    document.getElementById("delete-account-dialog").classList.remove("d-none");
    //document.getElementById("psw-form").addEventListener("submit", checkCredential);
}

function closeDeleteAccountDialog() {
    document.getElementById("delete-account-dialog").classList.add("d-none");
    document.getElementById("user-profile-container").classList.remove("d-none");
    document.getElementById("psw-info").innerHTML = "Enter your password!";
}

function checkForAnonymousDelete() {
    if (firebase.auth().currentUser.isAnonymous) {
        deleteProfile();
        closeDeleteAccountDialog();
    } else {
        openDeleteAccountDialog();
    }
}

async function checkCredential() {

    var user = firebase.auth().currentUser;
    // Prompt the user to re-provide their sign-in credentials
    var providedPassword = document.getElementById("psw").value;
    var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        providedPassword
    );

    user.reauthenticateWithCredential(credential).then(function () {
        // User re-authenticated.
        console.log("USER REAUTH");
        deleteProfile();
        closeDeleteAccountDialog();
    }).catch(function (error) {
        // An error happened. Wrong Password or User Has No Password
        console.error(error);
        if (error.code == 'auth/too-many-requests') {
            document.getElementById("psw-info").innerHTML = error.message;
        } else {
            document.getElementById("psw-info").innerHTML = "Wrong Password!";
        }
    });
}
