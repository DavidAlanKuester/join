firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

    } else {
        // User is signed out.

    }
}, function (error) {
    console.log(error);
});

function checkForAnonymousLogOut() {
    if (firebase.auth().currentUser.isAnonymous) {
        deleteProfile();
    } else {
        logUserOut();
    }
}

function logUserOut() {
  firebase.auth().signOut();
}

function writeUserData(userId, userName, userEmail, imageUrl) {
    return firebase.database().ref('users/' + userId).set({
        id: userId,
        img: imageUrl,
        name: userName,
        email: userEmail
    });
}

let createdTasks;


/**
 * This method calls firebase and saves all users to the local storage
 */
function saveUsersToLocalStorage() {

    firebase.database().ref('users').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            users.push(childSnapshot.val());
        })
    });
    console.log(users);
    localStorage.setItem("users", JSON.stringify(users));
}

/**
 * This method retrieves all users from the local storage
 */
function getUsersFromLocalStorage() {
    return JSON.parse(localStorage.getItem("users"));
}

/**
 * This Enums defines the names of the Eisenhower Category
 */
const EISENHOWER_MATRIX_CATEGORIES =
{
    DO: "Do",
    SCHEDULE: "Schedule",
    DELEGATE: "Delegate",
    ELIMINATE: "Eliminate"
}
Object.freeze(EISENHOWER_MATRIX_CATEGORIES);

/**
 * 
 * Includes html file inside container using w3-include-html attribute's values as the name of the html file
 * example: <div w3-include-html="fileName.html"></div>
 * 
 * Changes the visual output of sidebar.html links to match the current navigated site
 * 
 * @param {string} site - name of the site to which the HTML file was included
 */
function includeHTML(site) {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    changeSideBarTo(site);
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

/**
 * 
 * Changes the sidebar links visual output to match the current navigated site 
 * 
 * @param {string} site - name of the site 
 */
function changeSideBarTo(site) {
    switch (site) {
        case "list":
            changeSideBarLinksToListSelected();
            break;
        case "matrix":
            changeSideBarLinksToMatrixSelected();
            break;
        case "addTask":
            changeSideBarLinksToAddtask();
            break;
        case "index":
            changeSideBarLinksToIndex();
            break;
        case "imprint":
            changeSideBarLinksToImprint();
            break;
        case "data-protection":
            changeSideBarLinksToDataProtection();
            break;
        case "help":
            changeSideBarLinksToHelp();
            break;
        default:
            console.error("ERROR:: unknown site " + site + " please check your site function includeHTML call attribute value to match one of the cases");
            break;
    }
}

function sidebarSetUserImg() {
    document.getElementById("user-img").src = firebase.auth().currentUser.photoURL;
}

function changeSideBarLinksToListSelected() {
    document.getElementById("matrix-link").classList.add("link-unselected");
    document.getElementById("addTask-link").classList.add("link-unselected");
    document.getElementById("list-link").classList.add("link-selected");
    document.getElementById("list-link").innerHTML = "List";
    document.getElementById("imprint-link").classList.add("link-unselected");
    document.getElementById("data-protection-link").classList.add("link-unselected");
    document.getElementById("help-link").classList.add("link-unselected");
}

function changeSideBarLinksToMatrixSelected() {
    document.getElementById("matrix-link").classList.add("link-selected");
    document.getElementById("addTask-link").classList.add("link-unselected");
    document.getElementById("list-link").classList.add("link-unselected");
    document.getElementById("list-link").innerHTML = "List";
    document.getElementById("imprint-link").classList.add("link-unselected");
    document.getElementById("data-protection-link").classList.add("link-unselected");
    document.getElementById("help-link").classList.add("link-unselected");
}

function changeSideBarLinksToAddtask() {
    document.getElementById("matrix-link").classList.add("link-unselected");
    document.getElementById("list-link").classList.add("link-unselected");
    document.getElementById("addTask-link").classList.add("link-selected");
    document.getElementById("list-link").innerHTML = "View List";
    document.getElementById("imprint-link").classList.add("link-unselected");
    document.getElementById("data-protection-link").classList.add("link-unselected");
    document.getElementById("help-link").classList.add("link-unselected");
}

function changeSideBarLinksToIndex() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            document.getElementById("app-links").classList.remove("d-none");
            document.getElementById("user").classList.remove("d-none");
            document.getElementById("log-out-btn").classList.remove("d-none");
            document.getElementById("list-link").innerHTML = 'View List';
        } else {
            // User is signed out.
            document.getElementById("app-links").classList.add("d-none");
            document.getElementById("user").classList.add("d-none");
            document.getElementById("log-out-btn").classList.add("d-none");
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }, function (error) {
        console.log(error);
    });
    document.getElementById("imprint-link").classList.add("link-unselected");
    document.getElementById("data-protection-link").classList.add("link-unselected");
    document.getElementById("help-link").classList.add("link-unselected");
}


function changeSideBarLinksToImprint() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            document.getElementById("app-links").classList.remove("d-none");
            document.getElementById("user").classList.remove("d-none");
            document.getElementById("log-out-btn").classList.remove("d-none");
            document.getElementById("matrix-link").classList.add("link-unselected");
            document.getElementById("list-link").classList.add("link-unselected");
            document.getElementById("addTask-link").classList.add("link-unselected");
            document.getElementById("list-link").innerHTML = 'View List';
            sidebarSetUserImg();
        } else {
            // User is signed out.
            document.getElementById("app-links").classList.add("d-none");
            document.getElementById("user").classList.add("d-none");
            document.getElementById("log-out-btn").classList.add("d-none");
        }
    }, function (error) {
        console.log(error);
    });
    document.getElementById("imprint-link").classList.add("link-selected");
    document.getElementById("data-protection-link").classList.add("link-unselected");
    document.getElementById("help-link").classList.add("link-unselected");
}


function changeSideBarLinksToDataProtection() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            document.getElementById("app-links").classList.remove("d-none");
            document.getElementById("user").classList.remove("d-none");
            document.getElementById("log-out-btn").classList.remove("d-none");
            document.getElementById("matrix-link").classList.add("link-unselected");
            document.getElementById("list-link").classList.add("link-unselected");
            document.getElementById("addTask-link").classList.add("link-unselected");
            document.getElementById("list-link").innerHTML = 'View List';
            sidebarSetUserImg();
        } else {
            // User is signed out.
            document.getElementById("app-links").classList.add("d-none");
            document.getElementById("user").classList.add("d-none");
            document.getElementById("log-out-btn").classList.add("d-none");
        }
    }, function (error) {
        console.log(error);
    });
    document.getElementById("imprint-link").classList.add("link-unselected");
    document.getElementById("data-protection-link").classList.add("link-selected");
    document.getElementById("help-link").classList.add("link-unselected");
}


function changeSideBarLinksToHelp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            document.getElementById("app-links").classList.remove("d-none");
            document.getElementById("user").classList.remove("d-none");
            document.getElementById("log-out-btn").classList.remove("d-none");
            document.getElementById("matrix-link").classList.add("link-unselected");
            document.getElementById("list-link").classList.add("link-unselected");
            document.getElementById("addTask-link").classList.add("link-unselected");
            document.getElementById("list-link").innerHTML = 'View List';
            sidebarSetUserImg();
        } else {
            // User is signed out.
            document.getElementById("app-links").classList.add("d-none");
            document.getElementById("user").classList.add("d-none");
            document.getElementById("log-out-btn").classList.add("d-none");
        }
    }, function (error) {
        console.log(error);
    });
    document.getElementById("imprint-link").classList.add("link-unselected");
    document.getElementById("data-protection-link").classList.add("link-unselected");
    document.getElementById("help-link").classList.add("link-selected");
}


/**
 * This method accepts a task and sets the display property of that task to "do"
 * @param {Json object} task - a task represented as a JSON object
 */
function setTaskCategoryToDo(task) {
    task["display"] = EISENHOWER_MATRIX_CATEGORIES.DO;
}

/**
 * This method accepts a task and returns if the task is an important task.
 * @param {Json object} task - a task represented as a JSON object
 */
function isTaskImportant(task) {
    return task.importance == 0;
}

/**
 * This method gets a String that represents a date and 
 * returns true if that date is today or in the past. False if not today or in the past. 
 * @param {ISO 8601 string} dateString - accepts a ISO 8601 String Syntax (YYYY-MM-DD)
 */
function isDue(dateString) {
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let dueDate = new Date(dateString);
    return dueDate.getTime() <= today;
}


function changeProfileImg() {
    console.log('CHANGE CURRENT USER PROFILE IMG');
    let fileUploadElemet = document.createElement('input');
    fileUploadElemet.setAttribute('accept', 'image/*');
    fileUploadElemet.setAttribute('name', 'file');
    fileUploadElemet.setAttribute('type', 'file');
    fileUploadElemet.addEventListener('change', handleFileSelect);
    fileUploadElemet.click();



    //document.getElementById("profileImgInput").classList.remove("d-none");
    // setting an event listener on the file upload input button
    //document.getElementById("profileImgInput").addEventListener('change', handleFileSelect);

    // handle file upload called whenever files are selected
    function handleFileSelect(event) {
        var file = event.target.files[0];
        uploadFile(file);
    }
}

// pushing files to Firebase storage
function uploadFile(file) {
    // set file metadata
    var metadata = {
        contentType: file.type
    };

    // use Firebase push call to upload file to Firebase
    var uploadTask = storageRef.child('images/' + firebase.auth().currentUser.uid + '/profileImg').put(file, metadata);

    // monitor Firebase upload progress and catch errors
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        function (snapshot) {
            // calculate progress as a percentage
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');

            // check for a change in u0pload state
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            // catch an error when it happens, note: there are more error codes
            switch (error.code) {
                case 'storage/bucket_not_found':
                    console.log('The Bucket for this storage could not be found');
                    break;
                case 'storage/unauthorized':
                    console.log('User doesn\'t have access');
                    break;
                case 'storage/cancelled':
                    console.log('User cancelled the upload process');
                    break;
                case 'storage/unknown':
                    console.log('Unknown error');
                    break;
            }
            return;
        }, function () {
            // on success, display the uploaded image on the page
            storageRef.child('images/' + firebase.auth().currentUser.uid + '/profileImg').getDownloadURL()
                .then(function (uri) {
                    console.log('the image uploaded and can be found at ' + uri);
                    document.getElementById('user-img').src = uri;
                    firebase.auth().currentUser.updateProfile({
                        photoURL: uri
                    }).then(function () {
                        return firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/img/').set(uri);
                    });
                });
        })
}