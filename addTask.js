// *************** Mode to enable Cancel & Create Button -Start ************************


function disableBtn() {
    document.getElementById('cancel-btn').disabled = true;
    document.getElementById('create-btn').disabled = true;
}

function enableBtn() {
    enableCancelBtn();
    enableCreateTaskBtn();
}

function enableCancelBtn() {
    document.getElementById('cancel-btn').disabled =
        document.getElementById('title-input').value.trim().length == 0;
}

function enableCreateTaskBtn() {
    document.getElementById('create-btn').disabled =
        document.getElementById('title-input').value.trim().length == 0;
}

// *************** Mode to enable Cancel & Create Button -End ************************

// *****Assigned To Section - Add Persons -Start *********
persons = 0;

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

    /* ADD REMOVE BtN with JavaScript

    if (persons <=1) {
        let removeBtn = document.createElement('button')
        let div = document.getElementById('assign-person-btn-div');
        removeBtn.classList.add('btn');
        removeBtn.classList.add('btn-danger');
        removeBtn.style.backgroundColor ="#dc3545";
        removeBtn.innerHTML = "Remove";
        div.appendChild(removeBtn);
    }
    */
}
function removePerson() {
    persons = 0;
    document.getElementById('assign-person-div').innerHTML = '';
    document.getElementById('remove-btn-div').classList.add('d-none');

}


// *****Assigned To Section - Add Persons - End *********

// ***** Value Add from Select to P - start ******* 
function selectCategory() {
    let categoryChoice = document.getElementById('category-input');
    let displayCategoryText = categoryChoice.options[categoryChoice.selectedIndex].text;
    document.getElementById('category-output').innerHTML = displayCategoryText;
}

function selectImportance() {
    let importanceChoice = document.getElementById('importance-input');
    let displayImportanceText = importanceChoice.options[importanceChoice.selectedIndex].text;
    document.getElementById('importance-output').innerHTML = displayImportanceText;
}
// ***** Value Add from Select to P - End ******* 





// ***** Create Task (JSON Push) - start ******* 
// ***** Create Task (JSON Push) - End ******* 
let tasks = [];
let taskID = 0

function createTask() {
    newTask();
 
}


function newTask() {
   // let personDiv = document.getElementById('assign-person-div');
    // let Imgs = personDiv.document.getElementsByTagName('img');
    let newTask = {
        "task-id": taskID++,
        "title": document.getElementById('title-input').value,
        "category": document.getElementById('category-input').value,
        "description": document.getElementById('description-input').value,
        "due-date": document.getElementById('date-input').value,
        "importance": document.getElementById('importance-input').value,
      //  "assigned-to": Imgs
    }
    tasks.push(newTask)
    console.log(newTask);
}
