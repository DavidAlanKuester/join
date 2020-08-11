
// *************** Mode to enable Cancel & Create Button -Start ************************

function enableBtns() {
    addTaskForm.addEventListener('input', () => {
        if (titleInput.value.length > 0 && descriptionInput.value.length > 0 && dateInput.value.length > 0)  {
            cancelBtn.removeAttribute('disabled');
            createBtn.removeAttribute('disabled');
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
    let importanceChoice = document.getElementById('importance-input');
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
}

function addDisableAttributeBtn() {
    cancelBtn.setAttribute('cancelBtn', 'disabled');
    createBtn.setAttribute('createBtn', 'disabled');
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
        "importance": document.getElementById('importance-input').value,
      //  "assigned-to": Imgs
    }
    tasks.push(newTask)
}
// ***** Create Task (JSON Push) - End ******* 



