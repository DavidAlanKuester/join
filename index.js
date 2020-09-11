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

async function deleteProfile() {
    var user = firebase.auth().currentUser;
    await deleteUserTasks(user.uid);
    await deleteUserFromAssigne(user.uid);
    await deleteUserImg(user.uid);
    await deleteUserObject(user.uid);
    await deleteUser();
    //console.log('USER IMG, DATABASE AND ACCOUNT DELETED');
}

function deleteUser() {
    var user = firebase.auth().currentUser;
    return user.delete().then(function () {
        // User deleted.
        console.log('USER DELETED', user);

    }).catch(function (error) {
        // An error happened.
        console.error('ERROR', error);
    });
}

function deleteUserImg(userId) {
    // Create a reference to the file to delete
    var userImgRef = storageRef.child('images/' + userId + '/profileImg');
    // Delete the file
    return userImgRef.delete().then(function () {
        // File deleted successfully
        console.log('USER IMG DELETED', userImgRef);
    }).catch(function (error) {
        // Uh-oh, an error occurred!
        console.error('ERROR DELETING USER IMG', error);
    });
}

function deleteUserObject(userId) {
    return firebase.database().ref('users/' + userId).remove().then(function () {
        console.log('DATABASE USER OBJECT DELETED');
    }).catch(function (error) {
        console.error('ERROR DELETING DATABASE USER OBJECT. ', error);
    });
}

function deleteUserTasks(userId) {
    return firebase.database().ref('tasks').once('value').then(function (snapshot) {
        snapshot.forEach(childSnapshot => {
            if (childSnapshot.child('creator').val() == userId) {
                firebase.database().ref('tasks/' + childSnapshot.key).remove().then(function () {
                    console.log('DATABASE USER TASK DELETED');
                }).catch(function (error) {
                    console.error('ERROR DELETING DATABASE USER TASK. ', error);
                });
            }
        });
    }).catch(function (error) {
        console.error('ERROR DELETING DATABASE USER TASKS', error);
    });
}

function deleteUserFromAssigne(userId) {
    return firebase.database().ref('tasks').once('value').then(function (snapshot) {
        snapshot.forEach(childSnapshot => {
            var childData = childSnapshot.child('assigned-to').val();
            childData.forEach((id, index) => {
                if (id == userId) {
                    childData.splice(index, 1);
                    var newAssigneObj = getNewObjFromArray(childData);
                    firebase.database().ref('tasks/' + childSnapshot.key + '/assigned-to/').set(newAssigneObj).then(function () {
                        console.log('DATABASE USER FROM TASK DELETED');
                    }).catch(function (error) {
                        console.error('ERROR DELETING DATABASE USER FROM TASK. ', error);
                    });
                }
            });
        });
    }).catch(function (error) {
        console.log('ERROR DELETING DATABSE USER FROM TASKS');
    });
}

function getNewObjFromArray(array) {
    var obj = {};
    array.forEach((element, index) => {
        obj[index] = element;
    });

    return obj;
}
