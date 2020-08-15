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

/**
 * This method initially loads the Matrix
 * @param {number} currentUserId - a number representing the ID of the current user
 */
function initializeMatrix(currentUserId) {
    /**
     * A list of Json tasks that should be represented in the matrix
     */
    let matrixTasks = [];
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
        if (isCurrentUserAssigneeInTask(task, userId) || isCreatorCurrentUserOfTask(task, userId)) {
            matrixTasks.push(task);
        }
    });
}

/**
 * This method iterates through all assginees in a task 
 * and returns true if the provided userID is inside that list
 * @param {Json object} task - a task represented as a JSON object 
 * @param {number} userId - a number representing the user-ID
 */
function isCurrentUserAssigneeInTask(task, userId) {
    task["assigned-to"].forEach(assigneeId => {
        if (assigneeId.toString() === userId.toString()) return true;
    });
    return false;
}

/**
 * This method returns true if the provided task belongs to te provided user-ID. False if not
 * @param {Json object} task - a task represented as a JSON object 
 * @param {number} userId - a number representing the user-ID
 */
function isCreatorCurrentUserOfTask(task, userId) {
    return (task["creator"].toString() === userId.toString());
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


function allowDrop(ev) {
    ev.preventDefault();
}

function dragTask(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


function dropTask(ev) {
    ev.preventDefault();
    let id = ev.dataTransfer.getData("text");
    console.log(ev.target);
    console.log(ev.target.class);
    ev.target.appendChild(document.getElementById(id));
    // update task based on task id
    console.log("foo");
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


function loadTasksIntoCategories(doTasks, scheduleTasks, delegateTasks, eliminateTasks) {
    tasks["user-tasks"].forEach(user => {
        user.tasks.forEach(task => {
            AddTaskInEisenhowerCategory(task,
                doTasks, scheduleTasks, delegateTasks, eliminateTasks)
        });
    });
}

#######################################################################################################################
#######################################################################################################################
*/