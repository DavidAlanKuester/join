/**
 * Enum der IDs zum hinzufügen der task zu den Eisenhower Kategorien 
 */
const MatrixIds =
{
    ADD_Task_DO: "matrix-tasks-do-here",
    ADD_TASK_SCHEDULE: "matrix-tasks-schedule-here",
    ADD_TASK_DELEGATE: "matrix-tasks-delegate-here",
    ADD_TASK_ELIMINATE: "matrix-tasks-eliminate-here"
}
Object.freeze(MatrixIds);

let matrixTasks = [];


/**
 * This method initially loads the Matrix
 * @param {number} currentUserId - a number representing the ID of the current user
 */
function initializeMatrix(currentUserId) {
    /**
     * A list of Json tasks that should be represented in the matrix
     */
    getMatrixTasks(tasksDummy, currentUserId, matrixTasks);
    checkTasksForArrivingDueDate(matrixTasks);
    initializeTasksInMatrix(matrixTasks);
}

/**
 * This method iterates through all tasks and checks if they are relevant 
 * to display in the matrix of the current user.
 * and returns all relevant elements.
 * @param {Json Array} tasks - a Json array representing all taks 
 * @param {number} userId - a number representing a user Id
 * @param {Json Array} matrixTasks - a Json array representing all tasks relevant to display in the matrix
 */
function getMatrixTasks(tasks, userId, matrixTasks) {
    tasks.forEach(task => {
        if (task["assigned-to"].includes(userId) || task["creator"].toString() === userId.toString()) {
            matrixTasks.push(task);
        }
    });
}


/**
 * This method iterates through all Json tasks and checks if a task
 * with the property schedule has reached its due date.
 * If the due date has been reached the task is set to Category do 
 * @param {Json arbitrary} matrixTasks - a list of Json tasks
 */
function checkTasksForArrivingDueDate(matrixTasks) {
    matrixTasks.forEach(task => {
        if (isScheduleTask(task) && isDue(task["due-date"])) setTaskCategoryToDo(task);
    });
}

/**
 * This method iterates through all tasks and adds the task to the matrix
 * according to the display property of the task
 * @param {Json Array} matrixTasks - a list of Json tasks
 */
function initializeTasksInMatrix(matrixTasks) {
    matrixTasks.forEach(task => {
        switch (task["display"]) {
            case eisenhowerMatrixCategrories.DO:
                addTaskToMatrix(task, MatrixIds.ADD_Task_DO, "do");
                break;

            case eisenhowerMatrixCategrories.SCHEDULE:
                addTaskToMatrix(task, MatrixIds.ADD_TASK_SCHEDULE, "schedule");
                break;

            case eisenhowerMatrixCategrories.DELEGATE:
                addTaskToMatrix(task, MatrixIds.ADD_TASK_DELEGATE, "delegate");
                break;

            case eisenhowerMatrixCategrories.ELIMINATE:
                addTaskToMatrix(task, MatrixIds.ADD_TASK_ELIMINATE, "eliminate");
                break;

            default:
                console.error("Error in initializeTasksInMatrix");
                break;
        }
    });

}

/**
 * This method creates an html task from a Json task and adds it to a provided ID
 * @param {Json object} task - a task represented as a JSON object 
 * @param {String} IdString - a string representing the ID where to add the task
 */
function addTaskToMatrix(task, IdString, sidebarColorClassString) {
    let taskHtmlString = createMatrixTask(task, sidebarColorClassString);
    document.getElementById(IdString).insertAdjacentHTML("beforeend", taskHtmlString);
}


/**
 * This function takes a date String and returns a string converted in the format DD-MM-YYYY.
 * The delimiter between the date can be set to an arbitrary string.
 * @param {ISO 8601 string} dateString 
 * @param {string} delimiter 
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
 * @param {Json object} task - a task represented as a JSON object 
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

/**
 * This method allows to drop an element over an area
 * @param {HTML5 DropDOwnEvent} ev - The event created from an HTML5 drop down event
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This method saves the id of the element that is being dragged
 * @param {HTML5 DropDOwnEvent} ev - The event created from an HTML5 drop down event
 */
function dragTask(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


/**
 * This method controls if drop is performed inside the correct area marked with "drop-area"
 * @param {HTML5 DropDOwnEvent} ev - The event created from an HTML5 drop down event
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
 * @param {HTML5 DropDownEvent} ev - The event created from an HTML5 drop down event
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
    let taskId = id.toString().substr(5);
    let updateTask = matrixTasks.filter(task => task["task-id"] === taskId);
    updateTask[0]["display"] = eisenhowerCategory;
    adjustTaskSideColor(id, eisenhowerCategory);
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

/**
 * This method is used for testing purposes of the dropdown functionality
 * @param {number} id 
 */
function checkTask(id) {
    matrixTasks.forEach(task => {
        if (task["task-id"] === id.toString()) {
            console.log(task["display"]);
        }
    });
}

/**
 * This task accepts a task and returns true if that task has the display property of schedule
 * @param {Json object} task - a task represented as a JSON object 
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