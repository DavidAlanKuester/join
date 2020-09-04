firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        sidebarSetUserImg();
		document.getElementById("loader").classList.add("d-none");
		document.getElementById("user-profile-container").classList.remove("d-none");
		document.getElementById("user-name").innerHTML = user.displayName;
		
		document.getElementById("user-email").innerHTML = user.email;
		document.getElementById("user-img2").src = user.photoURL;
		
    } else {
        // User is signed out.
        ui.start('#firebaseui-auth-container', uiConfig);
    }
}, function (error) {
    console.log(error);
});
