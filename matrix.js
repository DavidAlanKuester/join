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

/**
 * Enum der IDs zum hinzufügen der task zu den Eisenhower Kategorien 
 */
const MATRIX_IDs = 
{
    ADD_Task_DO: "matrix-tasks-do-here",
    ADD_TASK_SCHEDULE: "matrix-tasks-schedule-here",
    ADD_TASK_DELEGATE: "matrix-tasks-delegate-here",
    ADD_TASK_ELIMINATE: "matrix-tasks-eliminate-here"
}
Object.freeze(MATRIX_IDs);


/**
 * This method loads the Matrix
 * @param {JSON} currentUser - the current user represented as a JSON
 */
async function initializeMatrix(currentUser) {
    let matrixTasks = await getMatrixTasks(currentUser.uid);
    checkTasksForArrivingDueDate(matrixTasks);
    initializeTasksInMatrix(matrixTasks);
    storeMatrixTasksInLocalStorage(matrixTasks);
}

/**
 * This method iterates through all tasks, checks if they are relevant 
 * to display in the matrix of the current user and returns them.
 * @param {string} userId - The ID of the user
 */
 async function getMatrixTasks(userId) {
    let allTasks = [];
    allTasks = await getAllTasks(allTasks);
    let matrixTasks = [];
    matrixTasks =
        allTasks.filter(
            task => (task["assigned-to"].includes(userId) || task["creator"].toString() === userId.toString())
        )
    return matrixTasks;
}


function getAllTasks(allTasks) {
    let db = firebase.database();
    value = db.ref("tasks").once('value').then(function(tasks){
        tasks.forEach(task => {
            allTasks.push(task.toJSON());
        });
    });
    return allTasks;
}


/**
 * This method iterates through all Json tasks and checks if a task
 * with the property schedule has reached its due date.
 * If the due date has been reached the task is set to Category do 
 * @param {Array<JSON>} matrixTasks - a list of Json tasks
 */
function checkTasksForArrivingDueDate(matrixTasks) {
    matrixTasks.forEach(task => {
        if (isScheduleTask(task) && isDue(task["due-date"])) {
            setTaskCategoryToDo(task);
            // update task in firebase to do
            firebase.database().ref("tasks/" + task["task-id"])
                .update({
                    "display" : eisenhowerMatrixCategrories.DO
                }, function(error) {
                    if (error) {
                        console.error("Error while saving task in");
                    } else {
                        console.log("success");
                    }
                }
            );
        }
    });
}


/**
 * This method iterates through all tasks and adds the task to the matrix
 * according to the display property of the task
 * @param {Array<JSON>} matrixTasks - a list of Json tasks
 */
function initializeTasksInMatrix(matrixTasks) {
    matrixTasks.forEach(task => {
        switch (task["display"]) {
            case eisenhowerMatrixCategrories.DO:
                addTaskToMatrix(task, MATRIX_IDs.ADD_Task_DO, "do");
                break;

            case eisenhowerMatrixCategrories.SCHEDULE:
                addTaskToMatrix(task, MATRIX_IDs.ADD_TASK_SCHEDULE, "schedule");
                break;

            case eisenhowerMatrixCategrories.DELEGATE:
                addTaskToMatrix(task, MATRIX_IDs.ADD_TASK_DELEGATE, "delegate");
                break;

            case eisenhowerMatrixCategrories.ELIMINATE:
                addTaskToMatrix(task, MATRIX_IDs.ADD_TASK_ELIMINATE, "eliminate");
                break;

            default:
                console.error("Error in initializeTasksInMatrix");
                break;
        }
    });

}

/**
 * This method creates an html task from a Json task and adds it to a provided ID
 * @param {JSON<Object>} task - a task represented as a JSON object 
 * @param {String} IdString - a string representing the ID where to add the task
 */
function addTaskToMatrix(task, IdString, sidebarColorClassString) {
    let taskHtmlString = createMatrixTask(task, sidebarColorClassString);
    document.getElementById(IdString).insertAdjacentHTML("beforeend", taskHtmlString);
}


/**
 * This function takes a date String and returns a string converted in the format DD-MM-YYYY.
 * The delimiter between the date can be set to an arbitrary string.
 * @param {String} dateString - ISO 8601 string "YYYY-MM-DD"
 * @param {String} delimiter - symbol between the date parts e.g. - in "MM-DD"
 */
function ConvertToEuropeanDateString(dateString, delimiter) {
    let date = new Date(dateString);
    return (
        '' + date.getDay() + delimiter
        + date.getMonth() + delimiter
        + date.getFullYear().toString().substr(2, 2)
    );
}

/**
 * This task accepts a task, creates a HTML object to represent that task
 * and returns the created task
 * @param {JSON<Object>} task - a task represented as a JSON object 
 */
function createMatrixTask(task, sidebarColorClassString) {
    return (`<div id="task-${task["task-id"]}" class="matrix-task-container ${sidebarColorClassString}" 
            draggable="true" ondragstart="dragTask(event)">
         <div class="matrix-task-date"> ${ConvertToEuropeanDateString(task['due-date'], '.')} </div>
         <div class="matrix-task-title"> ${task['title']} </div>
         <div class="matrix-task-description"> ${task['description']} </div>
         <div class="matrix-task-category-img-container">
         <div class="matrix-task-category"> ${task['category']} </div>
         <div><img src="img/id0.png" class="matrix-task-img"></div>
         </div>
         </div>`);
}


function storeMatrixTasksInLocalStorage(matrixTasks) {
    localStorage.setItem("matrixTasks", JSON.stringify(matrixTasks));
}

/**
 * This method allows to drop an element over an area
 * @param {DataTransfer} ev - The event created from an HTML5 drop down event
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This method saves the id of the element that is being dragged
 * @param {DataTransfer} ev - The event created from an HTML5 drop down event
 */
function dragTask(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


/**
 * This method controls if drop is performed inside the correct area marked with "drop-area"
 * @param {DataTransfer} ev - The event created from an HTML5 drop down event
 */
function dropTask(ev) {
    ev.target.classList.forEach(cssClass => {
        if (cssClass === 'drop-area') {
            performDropTask(ev);
        }
    });
}

/**
 * This method performs drop of the dropdown 
 * and switches the task to its new place & calls the update function
 * @param {DataTransfer} ev - The event created from an HTML5 drop down event
 */
function performDropTask(ev) {
    ev.preventDefault();
    let id = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(id));
    updateTask(id, ev.target.getAttribute("data-eisenhower-category"));
}


/**
 * This Method performs the updaing of a task by changing its display property 
 * and its side border color according to the provided eisenhower category
 * @param {String} id - The html ID of the object
 * @param {String} eisenhowerCategory - Represents one of the 4 Eisenhower categories
 */
function updateTask(id, eisenhowerCategory) {
    let taskId = id.substr(5);
    let matrixTasks = JSON.parse(localStorage.getItem("matrixTasks"));
    let updateTask = matrixTasks.filter(task => task["task-id"] === taskId);
    updateTask[0]["display"] = eisenhowerCategory;
    adjustTaskSideColor(id, eisenhowerCategory);
    localStorage.setItem("matrixTasks", JSON.stringify(matrixTasks));
}


/**
 * This method changes the left side border color according to its Eisenhower category
 * @param {String} taskHtmlId - The ID to an object in the html side
 * @param {String} eisenhowerCategory - The Eisenhower category the task changes to 
 */
function adjustTaskSideColor(taskHtmlId, eisenhowerCategory) {
    let task = document.getElementById(taskHtmlId);
    task.classList.remove(eisenhowerMatrixCategrories.DO, eisenhowerMatrixCategrories.SCHEDULE,
        eisenhowerMatrixCategrories.DELEGATE, eisenhowerMatrixCategrories.ELIMINATE);
    switch (eisenhowerCategory) {
        case eisenhowerMatrixCategrories.DO:
            task.classList.add(eisenhowerMatrixCategrories.DO);
            break;

        case eisenhowerMatrixCategrories.SCHEDULE:
            task.classList.add(eisenhowerMatrixCategrories.SCHEDULE);
            break;

        case eisenhowerMatrixCategrories.DELEGATE:
            task.classList.add(eisenhowerMatrixCategrories.DELEGATE);
            break;

        case eisenhowerMatrixCategrories.ELIMINATE:
            task.classList.add(eisenhowerMatrixCategrories.ELIMINATE);
            break;

        default:
            console.error("Error occured in adjustTaskSideColor")
            break;
    }

}


function getCurrentUserFromSession() {
    return firebase.auth().currentUser
}


let hello = [];
let value;
/**
 * This method is used for testing purposes of the dropdown functionality
 * @param {number} id 
 */
function checkTask(id) {
    /*let matrixTasks = JSON.parse(localStorage.getItem("matrixTasks"));
    matrixTasks.forEach(task => {
        if (task["task-id"] === id.toString()) {
            console.log(task["display"]);
        }
    });*/
    let db = firebase.database();
    value = db.ref("tasks").once('value').then(function(tasks){
        tasks.forEach(task => {
            hello.push(task.toJSON());
        });
    });
    console.log(hello);
}

function logStuff() {
    console.log(hello);
    console.log(value);
}

// update task in firebase to do
function updateFireBase() {
    let taskReference = firebase.database().ref("tasks/" + "MFkpzQEnn3s9t1MZwY3");
    taskReference.update({
        "description" : "Description 11"
    });
    // tasksReference.update({
    //     "MFkpzQEnn3s9t1MZwY3": {
    //         "description" : "Description 3"
    //     }
    // })
    console.log("fo");
}


/**
 * This task accepts a task and returns true if that task has the display property of schedule
 * @param {JSON<Object>} task - a task represented as a JSON object 
 */
function isScheduleTask(task) {
    return (task["display"].toString() === eisenhowerMatrixCategrories.SCHEDULE.toString());
}

/*  #######################################################################################################################
                                    FOR INITIALIZE EISENHOWERCATEGORY WHEN CREATING TASK
    #######################################################################################################################
function getEisenhowerCategory(task) {
    // criteria for DO-Task
    if (isTaskImportant(task) && isDue(task["due-date"])) {
        return eisenhowerMatrixCategrories.DO;
    }
    //criteria for schedule task
    if (isTaskImportant(task)) {
        return eisenhowerMatrixCategrories.SCHEDULE;
    }
    // criteria for delegate task
    if (!isTaskImportant(task)) {
        return eisenhowerMatrixCategrories.DELEGATE;
    }
}


function AddTaskInEisenhowerCategory(
    task, doTasks, scheduleTasks, delegateTasks, eliminateTasks) {
    let category = getEisenhowerCategory(task);
    switch (category) {
        case eisenhowerMatrixCategrories.DO:
            doTasks.push(task);
            break;

        case eisenhowerMatrixCategrories.SCHEDULE:
            scheduleTasks.push(task);
            break;

        case eisenhowerMatrixCategrories.DELEGATE:
            delegateTasks.push(task);
            break;

        default:
            console.error("Error in AddTaskInEisenhoverCategory");
            break;
    }
}

#######################################################################################################################
#######################################################################################################################
*/