firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        sidebarSetUserImg();
        saveUidFromCurrentUserInLocalStorage();
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
 */
async function initializeMatrix() {
    let allTasks = [];
    let matrixTasks = [];
    await getAllTasks(allTasks);
    matrixTasks = getMatrixTasks(matrixTasks, allTasks);
    checkTasksForArrivingDueDate(matrixTasks);
    initializeTasksInMatrix(matrixTasks);
    storeMatrixTasksInLocalStorage(matrixTasks);
}


async function getAllTasks(allTasks) {
    try {
        let db = firebase.database();
        await db.ref("tasks").once('value')
            .then(function (tasks) {
                return tasks.forEach(task => {
                    allTasks.push(task.toJSON());
                });
            });
    } catch (error) {
        console.error(error + "Error occured when loading all tasks from firebase" + result);
    }
}


/**
 * This method iterates through all tasks, checks if they are relevant 
 * to display in the matrix of the current user and returns them.
 */
function getMatrixTasks(matrixTasks, allTasks) {
    let userId = localStorage.getItem("curUserUid");
    return allTasks.filter(
        task => (
            task["creator"].toString() === userId.toString() ||
            isAssignedToCurrentUser(task, userId)
        )
    )
}


function isAssignedToCurrentUser(task, curUserId) {
    const object = task["assigned-to"];
    for (const key in object) {
        if (object[key].toString() === curUserId.toString()) {
            return true;
        }
    }
    return false;
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
            try {
                firebase.database().ref("tasks/" + task["task-id"])
                    .update({
                        "display": eisenhowerCategory
                    })
                    .then(() => {
                        setTaskCategoryToDo(task);
                    })
            } catch (error) {
                console.error(error + " | Error in checkTasksForArrivingDueDate while updating task-id: [" + task["task-id"] + "]");
            }
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
            case EISENHOWER_MATRIX_CATEGORIES.DO:
                addTaskToMatrix(task, MATRIX_IDs.ADD_Task_DO, EISENHOWER_MATRIX_CATEGORIES.DO);
                break;

            case EISENHOWER_MATRIX_CATEGORIES.SCHEDULE:
                addTaskToMatrix(task, MATRIX_IDs.ADD_TASK_SCHEDULE, EISENHOWER_MATRIX_CATEGORIES.SCHEDULE);
                break;

            case EISENHOWER_MATRIX_CATEGORIES.DELEGATE:
                addTaskToMatrix(task, MATRIX_IDs.ADD_TASK_DELEGATE, EISENHOWER_MATRIX_CATEGORIES.DELEGATE);
                break;

            case EISENHOWER_MATRIX_CATEGORIES.ELIMINATE:
                addTaskToMatrix(task, MATRIX_IDs.ADD_TASK_ELIMINATE, EISENHOWER_MATRIX_CATEGORIES.ELIMINATE);
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
    return (`<div id="task#${task["task-id"]}" class="matrix-task-container ${sidebarColorClassString.toLowerCase()}" 
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
    updateDisplayStatusOfTask(id, taskId, eisenhowerCategory, updateTask, matrixTasks);
}


function updateDisplayStatusOfTask(id, taskId, eisenhowerCategory, updateTask, matrixTasks) {
    try {
        let taskRef = firebase.database().ref("tasks/" + taskId);
        taskRef.update({
            "display": eisenhowerCategory
        })
            .then(() => {
                updateTask[0]["display"] = eisenhowerCategory;
                adjustTaskSideColor(id, eisenhowerCategory);
                localStorage.setItem("matrixTasks", JSON.stringify(matrixTasks));
            });
    } catch (error) {
        console.error(error + " | Error occured in updateDisplayStatusOfTask when updating Task [Task-id: " + taskId + "].");
    }
}


/**
 * This method changes the left side border color according to its Eisenhower category
 * @param {String} taskHtmlId - The ID to an object in the html side
 * @param {String} eisenhowerCategory - The Eisenhower category the task changes to 
 */
function adjustTaskSideColor(taskHtmlId, eisenhowerCategory) {
    let task = document.getElementById(taskHtmlId);
    task.classList.remove(EISENHOWER_MATRIX_CATEGORIES.DO, EISENHOWER_MATRIX_CATEGORIES.SCHEDULE,
        EISENHOWER_MATRIX_CATEGORIES.DELEGATE, EISENHOWER_MATRIX_CATEGORIES.ELIMINATE);
    switch (eisenhowerCategory) {
        case EISENHOWER_MATRIX_CATEGORIES.DO:
            task.classList.add(EISENHOWER_MATRIX_CATEGORIES.DO);
            break;

        case EISENHOWER_MATRIX_CATEGORIES.SCHEDULE:
            task.classList.add(EISENHOWER_MATRIX_CATEGORIES.SCHEDULE);
            break;

        case EISENHOWER_MATRIX_CATEGORIES.DELEGATE:
            task.classList.add(EISENHOWER_MATRIX_CATEGORIES.DELEGATE);
            break;

        case EISENHOWER_MATRIX_CATEGORIES.ELIMINATE:
            task.classList.add(EISENHOWER_MATRIX_CATEGORIES.ELIMINATE);
            break;

        default:
            console.error(error + "| Error occured in adjustTaskSideColor")
            break;
    }

}


function saveUidFromCurrentUserInLocalStorage() {
    localStorage.setItem("curUserUid", firebase.auth().currentUser.uid);
}


/**
 * This task accepts a task and returns true if that task has the display property of schedule
 * @param {JSON<Object>} task - a task represented as a JSON object 
 */
function isScheduleTask(task) {
    return (task["display"].toString() === EISENHOWER_MATRIX_CATEGORIES.SCHEDULE.toString());
}

/*  #######################################################################################################################
                                    FOR INITIALIZE EISENHOWERCATEGORY WHEN CREATING TASK
    #######################################################################################################################
function getEisenhowerCategory(task) {
    // criteria for DO-Task
    if (isTaskImportant(task) && isDue(task["due-date"])) {
        return EISENHOWER_MATRIX_CATEGORIES.DO;
    }
    //criteria for schedule task
    if (isTaskImportant(task)) {
        return EISENHOWER_MATRIX_CATEGORIES.SCHEDULE;
    }
    // criteria for delegate task
    if (!isTaskImportant(task)) {
        return EISENHOWER_MATRIX_CATEGORIES.DELEGATE;
    }
}


function AddTaskInEisenhowerCategory(
    task, doTasks, scheduleTasks, delegateTasks, eliminateTasks) {
    let category = getEisenhowerCategory(task);
    switch (category) {
        case EISENHOWER_MATRIX_CATEGORIES.DO:
            doTasks.push(task);
            break;

        case EISENHOWER_MATRIX_CATEGORIES.SCHEDULE:
            scheduleTasks.push(task);
            break;

        case EISENHOWER_MATRIX_CATEGORIES.DELEGATE:
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