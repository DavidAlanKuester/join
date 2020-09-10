firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        sidebarSetUserImg();
        saveCurrentUserinLocalStorage();
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

let deleteIconSrc = "https://firebasestorage.googleapis.com/v0/b/join-a7169.appspot.com/o/images%2Fdelete-icon.png?alt=media&token=bf0c915f-383c-4510-8e9a-2398d9b228dc";
/**
 * This method loads the Matrix
 */
async function initializeMatrix() {
    let allTasks = [];
    let matrixTasks = [];
    await getAllTasks(allTasks);
    matrixTasks = getMatrixTasks(allTasks);
    checkTasksForArrivingDueDate(matrixTasks);
    initializeTasksInMatrix(matrixTasks);
    storeMatrixTasksInLocalStorage(matrixTasks);
}

/**
 * Calls Firebase toretrieve all Tasks from all users 
 * and adds them in an Array called allTasks
 * @param {Array<JSON>} allTasks - a Array that will hold the tasks of all users
 */
async function getAllTasks(allTasks) {
    try {
        let db = firebase.database();
        let tasks = await db.ref("tasks").once('value');
        tasks.forEach(task => {
            allTasks.push(task.toJSON());
        });
    } catch (error) {
        console.error(error + "Error occured when loading all tasks from firebase" + result);
    }
}


/**
 * This method iterates through all tasks, checks if they are relevant 
 * to display in the matrix of the current user and returns them.
 * @param {Array<JSON>} allTasks - an Array of Json tasks
 */
function getMatrixTasks(allTasks) {
    let userId = localStorage.getItem("curUserId");
    return allTasks.filter(
        task => (
            task["creator"].toString() === userId.toString() ||
            isAssignedToCurrentUser(task, userId)
        )
    )
}

/**
 * This methods checks if a task is assgined to the current User
 * @param {JSON} task - a JSON object represented as a task
 * @param {string} curUserId - the current ID of a user
 */
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
 * @param {String} sidebarColorClassString - a string that defines the color of the task
 */
async function addTaskToMatrix(task, IdString, sidebarColorClassString) {
    let curUserId = localStorage.getItem("curUserId");
    let assignees = Object.values(task["assigned-to"]);
    let userImgSource = await getUserImgSource(curUserId, assignees);
    let taskHtmlString = createMatrixTask(task, sidebarColorClassString, userImgSource);
    document.getElementById(IdString).insertAdjacentHTML("beforeend", taskHtmlString);
}

/**
 * This method checks of the current user is an assignee in a task
 * if not the picture of the first assignee is used
 * @param {string} curUserId - id of the current user 
 * @param {JSON} assignees - all assignees of the Task
 */
async function getUserImgSource(curUserId, assignees) {
    if (!assignees.includes(curUserId)) {
        try {
            let db = firebase.database();
            let snapshot = await db.ref("users/FumFBvYctqPMmgimbLvk4APx4px1/img").once("value");
            //let imgSource = await db.ref("users/" + assignees[0] + "/img").once("value");
            return snapshot.val();
        } catch (error) {
            console.error(error + " |  Error occured in getUserImgSource");
        }
    } else {
        let val = localStorage.getItem("curUserImgSource");
        return val;
    }
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
function createMatrixTask(task, sidebarColorClassString, userImgSource) {
    return (`<div id="task#${task["task-id"]}" class="matrix-task-container ${sidebarColorClassString.toLowerCase()}" 
            draggable="true" ondragstart="dragTask(event)">
         <div class="matrix-task-top">
            <div class="matrix-task-date">${ConvertToEuropeanDateString(task["due-date"], '.')}</div>
            <img src="${deleteIconSrc}" onclick="deleteTask('task#${task["task-id"]}')">
         </div>
         <div class="matrix-task-title"> ${task["title"]} </div>
         <div class="matrix-task-description"> ${task["description"]} </div>
         <div class="matrix-task-category-img-container">
         <div class="matrix-task-category"> ${task["category"]} </div>
         <div><img src="${userImgSource}" class="matrix-task-img"></div>
         </div>
         </div>`
    );
}

/**
 * This function saves all Matrix Tasks to Local Storage
 * @param {Array<JSON>} matrixTasks - An Array representing JSON tasks
 */
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

/**
 * Updates the display status of a task to firebase when a 'drop' in drag 'n drop was done
 * @param {string} id - HTML ID of a task
 * @param {string} taskId - ID of a task 
 * @param {string} eisenhowerCategory - a string with the category the task will change to
 * @param {JSON} updateTask - A JSON for saving the task locally 
 * @param {Array<JSON>} matrixTasks - All taks to save locally after the update
 */
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

/**
 * This method calls the auth() method from firebase and saves the current user into Local Storage
 */
function saveCurrentUserinLocalStorage() {
    localStorage.setItem("curUserId", firebase.auth().currentUser.uid);
    localStorage.setItem("curUserImgSource", firebase.auth().currentUser.photoURL);
}


/**
 * This task accepts a task and returns true if that task has the display property of schedule
 * @param {JSON<Object>} task - a task represented as a JSON object 
 */
function isScheduleTask(task) {
    return (task["display"].toString() === EISENHOWER_MATRIX_CATEGORIES.SCHEDULE.toString());
}


/**
 * 
 * @param {string} id - id of a task to eb deleted in firbase and in the app
 */
function deleteTask(id) {
    let taskId = id.substr(5);
    let matrixTasks = JSON.parse(localStorage.getItem("matrixTasks"));
    let taskRef = firebase.database().ref("tasks/" + taskId);
    taskRef.remove()
        .then(() => {
            let taskIndex = matrixTasks.findIndex((task) => task["task-id"] === taskId);
            matrixTasks.splice(taskIndex, 1);
            document.getElementById(id).remove();
        }
        ).catch(console.error("Error occured in deleteTask"));
}
