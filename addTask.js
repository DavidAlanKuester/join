let selectedUsers = [];
let userID = [];

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
        && fieldIsFilled(categoryInput)) {
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
    users.forEach(function (user) {

        let classes = 'user-picker-row';
        if (selectedUsers.includes(user)) {
            classes += ' user-picker-row-select';
        }

        let htmlContent = `
    <div id="user-row-${user.id}" class="${classes}" onclick="selectUser(${user.id})">
    <img src="./${user.img}" style="width: 75px; height: 75px; padding: 8px;">
    ${user.name}
</div>
`;
        document.getElementById('user-picker-container').insertAdjacentHTML("beforeend", htmlContent);
    });
}

function selectUser(id) {
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
    console.log('selectedUsers:', selectedUsers);

    updateUserSelection();
}

function back() {
    hideDialog();
    updateSelectedUserRow();

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
        let htmlContent = `<div><img src="${user.img}">${user.name}</div>`;
        document.getElementById('assign-person-div').insertAdjacentHTML("beforeend", htmlContent);
    }
}

function hideDialog() {
    document.getElementById('addPersonBlend').classList.add('d-none');
}

function getUserID() {
    for (let i = 0; i < selectedUsers.length; i++) {
        let user = selectedUsers[i];
        userID.push(user.id);
    }
}

function addPerson() {
    document.getElementById('addPersonBlend').classList.remove('d-none');
}

function removePerson() {
    selectedUsers = [];
    updateSelectedUserRow();
    updateUserSelection();

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
    addDisableAttributeBtn();
    displaySucessAlert();

    setTimeout(function () {
        cancelTask();
    }, 1000);
}

function addDisableAttributeBtn() {
    cancelBtn.disabled = true;
    createBtn.disabled = true;
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

    let newTask = {
        "task-id": taskID++,
        "title": document.getElementById('titleInput').value,
        "category": document.getElementById('categoryInput').value,
        "description": document.getElementById('descriptionInput').value,
        "due-date": document.getElementById('datePickerInput').value,
        "urgency": urgency,
        "importance": document.getElementById('importanceInput').value,
        "assigned-to": selectedUsersIds,
        "display": display,
    }

    tasks.push(newTask)
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
        display = "Eliminate";
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

