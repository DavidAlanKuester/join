firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        sidebarSetUserImg();
    } else {
        // User is signed out.
        window.location.href = './index.html';
    }
}, function (error) {
    console.log(error);
});

let selectedUsers = [];
// let userID = [];
let users = [];
let tasks = [];

function getUsers() {

    var isDone = firebase.database().ref('users').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            //console.log(childSnapshot.val().img);
            users.push(childSnapshot.val());
        })
    });

    isDone.then(updateUserSelection);
}

// *************** Mode to enable Cancel & Create Button -Start ************************
function enableBtns() {
    addTaskForm.addEventListener('input', () => {
        executeEnableButtonScript();
    });


    addTaskForm.addEventListener('select', () => {
        executeEnableButtonScript();
    });

}

function executeEnableButtonScript() {
    if (fieldIsFilled(titleInput)
        && fieldIsFilled(descriptionInput)
        && fieldIsFilled(importanceInput)
        && fieldIsFilled(datePickerInput)
        && fieldIsFilled(categoryInput)
        && selectedUsers.length > 0) {
        createBtn.disabled = false;
    } else {
        createBtn.disabled = true;
    }
}

function fieldIsFilled(field) {
    return field.value.length > 0;
}
// *************** Mode to enable Cancel & Create Button -End ************************

/**
 * Updates the user picker which is displayed in the dialog after pressing the "add" button.
 * Selecetd users will be displayed with a green background-color.
 * 
 */
function updateUserSelection() {
    document.getElementById('user-picker-container').innerHTML = '';
    /*firebase.database().ref('users').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let user = childSnapshot.val();
            let classes = 'user-picker-row';
            if (selectedUsers.includes(user)) {
                classes += ' user-picker-row-select';
            }
            let htmlContent = generateHtml(classes, childSnapshot.val().id, childSnapshot.val().name, childSnapshot.val().img);
            document.getElementById('user-picker-container').insertAdjacentHTML("beforeend", htmlContent);
        })
    });*/
    users.forEach(function (user) {

        let classes = 'user-picker-row';
        if (selectedUsers.includes(user)) {
            classes += ' user-picker-row-select';
        }

        let htmlContent = `
    <div id="user-row-${user.id}" class="${classes}" onclick="selectUser('${user.id}')">
    <img src="${user.img}" style="width: 75px; height: 75px; padding: 8px; object-fit: cover">
    ${user.name}
</div>
`;
        document.getElementById('user-picker-container').insertAdjacentHTML("beforeend", htmlContent);
    });
}

// function generateHtml(classes, userId, userName, userImg) {
//     return `
//     <div id="user-row-${userId}" class="${classes}" onclick="selectUser('${userId}')">
//         <img src="./${userImg}" style="width: 75px; height: 75px; padding: 8px;">
//         ${userName}
//     </div>
//     `;
// }
// console.log(generateHtml())

function selectUser(id) {

    /*firebase.database().ref('/users/' + id).once('value').then(function (snapshot) {
        // ...
        let user = snapshot.val();
        if (selectedUsers.includes(user)) {
            // Remove from array
            selectedUsers = selectedUsers.filter(function (u) {
                return u.id !== user.id;
            });

        } else {
            selectedUsers.push(user);
        }
    });*/

    let user = users.find(function (u) {
        return u.id == id;
    });

    if (selectedUsers.includes(user)) {
        // Remove from array
        selectedUsers = selectedUsers.filter(function (u) {
            return u.id !== user.id;
        });

    } else {
        selectedUsers.push(user);
    }

    updateUserSelection();
}

function back() {
    hideDialog();
    updateSelectedUserRow();
    executeEnableButtonScript();

    if (selectedUsers.length > 0) {// Show remove button

        document.getElementById('remove-btn').classList.remove('d-none');
    } else {
        document.getElementById('remove-btn').classList.add('d-none');
    }
}

function updateSelectedUserRow() {
    document.getElementById('assign-person-div').innerHTML = '';
    // Render selected users
    for (let i = 0; i < selectedUsers.length; i++) {
        let user = selectedUsers[i];
        let htmlContent = `<div><img src="${user.img}"></div>`;
        document.getElementById('assign-person-div').insertAdjacentHTML("beforeend", htmlContent);
    }
}

function hideDialog() {
    document.getElementById('addPersonBlend').classList.add('d-none');
}

// function getUserID() {
//     for (let i = 0; i < selectedUsers.length; i++) {
//         let user = selectedUsers[i];
//         userID.push(user.id);
//     }
// }

function addPerson() {
    document.getElementById('addPersonBlend').classList.remove('d-none');
    document.getElementById('overall-person-div').style.justifyContent = 'space-between';
}

function removePerson() {
    document.getElementById('overall-person-div').style.justifyContent = 'flex-start';
    selectedUsers = [];
    updateSelectedUserRow();
    updateUserSelection();
    executeEnableButtonScript();


    document.getElementById('remove-btn').classList.add('d-none');
}
// *****Assigned To Section - Add Persons - End *********

// ***** Value Add from Select to P - start ******* 
function selectCategory() {
    let categoryChoice = document.getElementById('categoryInput');
    let displayCategoryText = categoryChoice.options[categoryChoice.selectedIndex].text;
    document.getElementById('categoryOutput').innerHTML = displayCategoryText;
    categoryOutputBoolean = true;

    executeEnableButtonScript();
}

let importance;

function selectImportance() {
    let importanceChoice = document.getElementById('importanceInput');
    let displayImportanceText = importanceChoice.options[importanceChoice.selectedIndex].text;
    document.getElementById('importanceOutput').innerHTML = displayImportanceText;
    importance = document.getElementById('importanceInput').value;
}
// ***** Value Add from Select to P - End ******* 

// ***** Create Task (JSON Push) - start ******* 
let taskID = 0

function createTask() {
    defineUrgency();
    defineMatrix();
    newTask();
    displaySucessAlert();

    setTimeout(function () {
        cancelTask();
    }, 1000);
}



function newTask() {

    let selectedUsersIds = [];

    //    for(let i=0; i < selectedUsers.length; i++) {
    //        let user = selectedUsers[i];
    //        selectedUsersIds.push(user.id);
    //    }

    selectedUsers.forEach(function (user) {
        selectedUsersIds.push(user.id);
    });

    var newTaskId = firebase.database().ref('tasks/').push().key;

    let newTask = {
        "task-id": newTaskId,
        "title": document.getElementById('titleInput').value,
        "category": document.getElementById('categoryInput').value,
        "description": document.getElementById('descriptionInput').value,
        "due-date": document.getElementById('datePickerInput').value,
        "urgency": urgency,
        "importance": document.getElementById('importanceInput').value,
        "assigned-to": selectedUsersIds,
        "display": display,
    }

    var isDone = firebase.database().ref('tasks/' + newTaskId).set(
        {
            "creator": firebase.auth().currentUser.uid,
            "task-id": newTaskId,
            "title": document.getElementById('titleInput').value,
            "category": document.getElementById('categoryInput').value,
            "description": document.getElementById('descriptionInput').value,
            "due-date": document.getElementById('datePickerInput').value,
            "urgency": urgency,
            "importance": document.getElementById('importanceInput').value,
            "assigned-to": selectedUsersIds,
            "display": display,
        }
    );

    isDone.then(tasks.push(newTask));
}

function displaySucessAlert() {
    document.getElementById('createdTaskAlert').classList.remove('d-none');
    setTimeout(function () {
        document.getElementById('createdTaskAlert').classList.add('d-none');
    }, 1000);
}
// ***** Create Task (JSON Push) - End ******* 

// ***** Cancel Task  - Start ******* 
function cancelTask() {
    document.getElementById('titleInput').value = "";
    document.getElementById('categoryInput').value = ""
    document.getElementById('categoryOutput').innerHTML = "";
    document.getElementById('descriptionInput').value = "";
    document.getElementById('datePickerInput').value = "";
    document.getElementById('importanceInput').value = ""
    document.getElementById('importanceOutput').innerHTML = "";
    removePerson()
    urgency = "";
    display = "";
}
// ***** Cancel Task  - End *******

// datePicker 

let selectedDate;
let dayTime = 86400000;
let urgency;
let display;

function getDate() {
    selectedDate = new Date(document.getElementById('datePickerInput').value).getTime();
}

function defineUrgency() {
    let createdTaskTime = new Date().getTime();
    let DueDatedifference = selectedDate - createdTaskTime;

    if (DueDatedifference < dayTime) {
        urgency = "High";
    } else {
        urgency = "Low";
    }
}

function defineMatrix() {
    if (importance == "High" && urgency == "High") {
        display = "Do";
    } else if (importance == "High" && urgency == "Low") {
        display = "Schedule";
    } else if (importance == "Low" && urgency == "High") {
        display = "Delegate";
    } else if (importance == "Low" && urgency == "Low") {
        display = "Delegate";
    }
}

function pickOnlyfutureDays() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('datePickerInput').setAttribute('min', today);
}

