
// *************** Mode to enable Cancel & Create Button -Start ************************

function enableBtns() {
    addTaskForm.addEventListener('input', () => {
        if (titleInput.value.length > 0 && descriptionInput.value.length > 0 && dateInput.value.length > 0) {
            createBtn.removeAttribute('disabled');
        } else if (titleInput.value.length > 0 || descriptionInput.value.length > 0 || dateInput.value.length > 0) {
            cancelBtn.removeAttribute('disabled');
        }
    });

}

// *************** Mode to enable Cancel & Create Button -End ************************

// *****Assigned To Section - Add Persons -Start *********
let persons = 0;

function addPerson() {
    persons++;
    if (persons <= 4) {
        let person = document.createElement('img');
        let div = document.getElementById('assign-person-div');
        person.src = 'img/person.png';
        div.appendChild(person);
        persons = persons + 0;
    }
    if (persons <= 1) {
        document.getElementById('remove-btn-div').classList.remove('d-none');
    }
}
function removePerson() {
    persons = 0;
    document.getElementById('assign-person-div').innerHTML = '';
    document.getElementById('remove-btn-div').classList.add('d-none');
}
// *****Assigned To Section - Add Persons - End *********

// ***** Value Add from Select to P - start ******* 
function selectCategory() {
    let categoryChoice = document.getElementById('categoryInput');
    let displayCategoryText = categoryChoice.options[categoryChoice.selectedIndex].text;
    document.getElementById('categoryOutput').innerHTML = displayCategoryText;
    categoryOutputBoolean = true;
}

function selectImportance() {
    let importanceChoice = document.getElementById('importanceInput');
    let displayImportanceText = importanceChoice.options[importanceChoice.selectedIndex].text;
    document.getElementById('importance-output').innerHTML = displayImportanceText;
}
// ***** Value Add from Select to P - End ******* 

// ***** Create Task (JSON Push) - start ******* 

let tasks = [];
let taskID = 0

function createTask() {
    newTask();
    addDisableAttributeBtn();
    displaySucessAlert();
    setTimeout(function(){ 
        cancelTask();
    }, 1000);
}

function addDisableAttributeBtn() {
    cancelBtn.disabled = true;
    createBtn.disabled = true;
   
}
function newTask() {
    // let personDiv = document.getElementById('assign-person-div');
    // let Imgs = personDiv.document.getElementsByTagName('img');
    let newTask = {
        "task-id": taskID++,
        "title": document.getElementById('titleInput').value,
        "category": document.getElementById('categoryInput').value,
        "description": document.getElementById('descriptionInput').value,
        "due-date": document.getElementById('dateInput').value,
        "importance": document.getElementById('importanceInput').value,
        //  "assigned-to": Imgs
    }
    tasks.push(newTask)
}

function displaySucessAlert() {
    document.getElementById('createdTaskAlert').classList.remove('d-none');
    setTimeout(function(){ 
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
    document.getElementById('dateInput').value = "";
    document.getElementById('importanceInput').value = ""
    document.getElementById('importanceOutput').innerHTML = "";
}
// ***** Cancel Task  - End ******* 


