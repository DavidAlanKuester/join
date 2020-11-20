

async function deleteProfile() {
    var user = auth.currentUser;
    await deleteUserTasks(user.uid);
    await deleteUserFromAssigne(user.uid);
    await deleteUserImg(user.uid);
    await deleteUserObject(user.uid);
    await deleteUser();
    //console.log('USER IMG, DATABASE AND ACCOUNT DELETED');
}

function deleteUser() {
    var user = auth.currentUser;
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
    return databaseRef('users/' + userId).remove().then(function () {
        console.log('DATABASE USER OBJECT DELETED');
    }).catch(function (error) {
        console.error('ERROR DELETING DATABASE USER OBJECT. ', error);
    });
}

function deleteUserTasks(userId) {
    return databaseRef('tasks').once('value').then(function (snapshot) {
        snapshot.forEach(childSnapshot => {
            if (childSnapshot.child('creator').val() == userId) {
                databaseRef('tasks/' + childSnapshot.key).remove().then(function () {
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
    return databaseRef('tasks').once('value').then(function (snapshot) {
        snapshot.forEach(childSnapshot => {
            var childData = childSnapshot.child('assigned-to').val();
            childData.forEach((id, index) => {
                if (id == userId) {
                    childData.splice(index, 1);
                    var newAssigneObj = getNewObjFromArray(childData);
                    databaseRef('tasks/' + childSnapshot.key + '/assigned-to/').set(newAssigneObj).then(function () {
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

// ******* Responsive Menu- start ******* 
function showMenu() {
    document.getElementById('responsive-menu-click').classList.remove('hide-menu');
    document.getElementById('blackbendjava').classList.remove('d-none');
}

function removeMenu() {
    document.getElementById('responsive-menu-click').classList.add('hide-menu');
    document.getElementById('blackbendjava').classList.add('d-none');
}
// ******* Responsive Menu- end ******* 

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

    } else {
        // User is signed out.

    }
}, function (error) {
    console.log(error);
});

function checkForAnonymousLogOut() {
    if (auth.currentUser.isAnonymous) {
        deleteProfile();
    } else {
        logUserOut();
    }
}

function logUserOut() {
    auth.signOut();
}

function writeUserData(userId, userName, userEmail, imageUrl) {
    return databaseRef('users/' + userId).set({
        id: userId,
        img: imageUrl,
        name: userName,
        email: userEmail
    });
}

let createdTasks;


function initalizeAnonymousUser(user) {
    // delete all tasks of user
    databaseRef("tasks").once("value")
        .then((tasks) => {
            tasks.forEach(task => {
                // delete task
                if (task.child("creator").val() === user.uid) {
                    databaseRef("tasks/" + task.child("task-id"))
                        .remove()
                        .catch(console.error("Error occured when deleting the task"));
                }
            });
        })
        // add dummy tasks to user
        .then(() => {
            createDummyTask(user.uid, "Organise Design Thinking Workshop", "marketing",
                "Identify new products to satisfy business needs", "2020-10-15", "High",
                "High", user.uid, "Do");
            createDummyTask(user.uid, "Create pitch for customer meeting", "sales",
                "Pitch should not be longer then 5 minutes", "2021-04-10", "High",
                "High", user.uid, "Schedule");
            createDummyTask(user.uid, "Organise Christmas business party", "it",
                "A location and a date also has to be decided", "202-09-10", "Low",
                "Low", user.uid, "Delegate");
            createDummyTask(user.uid, "Market research for new branch", "other",
                "Evaluate if a new branch should be opened", "2020-10-10", "High",
                "High", user.uid, "Eliminate");
        })
        ;
}


function createDummyTask(creator, newTaskTitle, newTaskCategory,
    newTaskDescription, newTaskDueDate, newTaskUrgency,
    newTaskImportance, newTaskAssignee, newTaskDisplay) {
    let newTaskAssigneeArray = [newTaskAssignee];
    let newTaskId = databaseRef('tasks/').push().key;
    databaseRef('tasks/' + newTaskId).set(
        {
            "creator": creator,
            "task-id": newTaskId,
            "title": newTaskTitle,
            "category": newTaskCategory,
            "description": newTaskDescription,
            "due-date": newTaskDueDate,
            "urgency": newTaskUrgency,
            "importance": newTaskImportance,
            "assigned-to": newTaskAssigneeArray,
            "display": newTaskDisplay,
        }
    ).catch(console.error("error occured"));
}


/**
 * This method calls firebase and saves all users to the local storage
 */
function saveUsersToLocalStorage() {

    databaseRef('users').once('value').then(function (snapshot) {
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
    document.getElementById("user-img").src = auth.currentUser.photoURL;
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
    auth.onAuthStateChanged(function (user) {
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
    auth.onAuthStateChanged(function (user) {
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
    auth.onAuthStateChanged(function (user) {
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
    auth.onAuthStateChanged(function (user) {
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
    var uploadTask = storageRef.child('images/' + auth.currentUser.uid + '/profileImg').put(file, metadata);

    // monitor Firebase upload progress and catch errors
    uploadTask.on(storage.TaskEvent.STATE_CHANGED,
        function (snapshot) {
            // calculate progress as a percentage
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');

            // check for a change in u0pload state
            switch (snapshot.state) {
                case storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case storage.TaskState.RUNNING:
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
            storageRef.child('images/' + auth.currentUser.uid + '/profileImg').getDownloadURL()
                .then(function (uri) {
                    console.log('the image uploaded and can be found at ' + uri);
                    document.getElementById('user-img').src = uri;
                    auth.currentUser.updateProfile({
                        photoURL: uri
                    }).then(function () {
                        return databaseRef('users/' + auth.currentUser.uid + '/img/').set(uri);
                    });
                });
        })

}