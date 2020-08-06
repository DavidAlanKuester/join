

function disableBtn() {
    document.getElementById('cancel-btn').disabled = true;
    document.getElementById('create-btn').disabled = true;

}

function enableBtn() {
    document.getElementById('cancel-btn').disabled =
    document.getElementById('title-input').value.trim().length == 0 &&
    document.getElementById('category-input').value.trim().length == 0 &&
    document.getElementById('description-input').value.trim().length == 0 &&
    document.getElementById('date-input').value.trim().length == 0 &&
    document.getElementById('urgency-input').value.trim().length == 0 &&
    document.getElementById('importance-input').value.trim().length == 0;

    document.getElementById('create-btn').disabled = 
    document.getElementById('title-input').value.trim().length == 0 &&
    document.getElementById('category-input').value.trim().length == 0 &&
    document.getElementById('description-input').value.trim().length == 0 &&
    document.getElementById('date-input').value.trim().length == 0 &&
    document.getElementById('urgency-input').value.trim().length == 0 &&
    document.getElementById('importance-input').value.trim().length == 0;
}


