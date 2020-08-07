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
    document.getElementById('title-input').value.trim().length == 0 &&
    document.getElementById('category-input').value.trim().length == 0 &&
    document.getElementById('description-input').value.trim().length == 0 &&
    document.getElementById('date-input').value.trim().length == 0 &&
    document.getElementById('urgency-input').value.trim().length == 0 &&
    document.getElementById('importance-input').value.trim().length == 0;
}

function enableCreateTaskBtn() {
    document.getElementById('create-btn').disabled = 
    document.getElementById('title-input').value.trim().length == 0 &&
    document.getElementById('category-input').value.trim().length == 0 &&
    document.getElementById('description-input').value.trim().length == 0 &&
    document.getElementById('date-input').value.trim().length == 0 &&
    document.getElementById('urgency-input').value.trim().length == 0 &&
    document.getElementById('importance-input').value.trim().length == 0;
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
    if (persons <=1) {
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


// *****Assigned To Section - Add Persons - End *********


function createTask() {

}



