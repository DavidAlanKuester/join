const MatrixIds =
{
    ADD_Task_DO: "matrix-tasks-do-here",
    ADD_TASK_SCHEDULE: "matrix-tasks-schedule-here",
    ADD_TASK_DELEGATE: "matrix-tasks-delegate-here",
    ADD_TASK_ELIMINATE: "matrix-tasks-eliminate-here"
}
Object.freeze(MatrixIds);


function initializeMatrix(currentUserId) {
    let matrixTasks = [];
    getMatrixTasks(tasksDummy, currentUserId, matrixTasks);
    checkTasksForArrivingDueDate(matrixTasks);
    initializeTasksInMatrix(matrixTasks);
}


function getMatrixTasks(tasks, userId, matrixTasks) {
    tasks.forEach(task => {
        if (isCurrentUserTasks(task, userId) || isCreatorCurrentUser(task, userId) ) {
            matrixTasks.push(task);
        }
    });
}


function isCurrentUserTasks(task, userId) {
    task["assigned-to"].forEach(assigneeId => {
        if (assigneeId.toString() === userId.toString()) {
            return true;
        }
    });
    return false;
}


function isCreatorCurrentUser(task, userId) {
    return (task["creator"].toString() === userId.toString());
}


function checkTasksForArrivingDueDate(matrixTasks) {
    matrixTasks.forEach(task => {
        if (isScheduleTask(task) && isDue(task["due-date"])) {
            setTaskCategoryToDo(task);
        }
    });
}


function initializeTasksInMatrix(matrixTasks) {
    matrixTasks.forEach(task => {
        switch (task["display"]) {
            case eisenhowerMatrixCategrories.DO:
                addTaskToMatrix(task, MatrixIds.ADD_Task_DO);
                break;
    
            case eisenhowerMatrixCategrories.SCHEDULE:
                addTaskToMatrix(task, MatrixIds.ADD_TASK_SCHEDULE);
                break;
    
            case eisenhowerMatrixCategrories.DELEGATE:
                addTaskToMatrix(task, MatrixIds.ADD_TASK_DELEGATE);
                break;

            case eisenhowerMatrixCategrories.ELIMINATE:
                addTaskToMatrix(task, MatrixIds.ADD_TASK_ELIMINATE);
                break;            
    
            default:
                console.error("Error in initializeTasksInMatrix");
                break;
        }
    });
    
}


function addTaskToMatrix(task, IdString){
    let taskHtmlString = createTask(task);
    document.getElementById(IdString).insertAdjacentHTML("beforeend", taskHtmlString);
}


/**
 * This function takes a date String and returns a string converted in the format DD-MM-YYYY
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


function createTask(task) {
    return (`<div class="matrix-task-container">
         <div class="matrix-task-date"> ${ConvertToEuropeanDateString(task['due-date'], '.')} </div>
         <div class="matrix-task-title"> ${task['title']} </div>
         <div class="matrix-task-description"> ${task['description']} </div>
         <div class="matrix-task-category-img-container">
         <div class="matrix-task-category"> ${task['category']} </div>
         <div><img src="img/person.png" class="matrix-task-img"></div>
         </div>
         </div>`);
}


function isScheduleTask(task) {
    return (task["display"].toString() === eisenhowerMatrixCategrories.SCHEDULE.toString());
}


function setTaskCategoryToDo(task) {
    task["display"] = eisenhowerMatrixCategrories.DO;
}


function isTaskImportant(task) {
    return task.importance == 0;
}


function isDue(dateString) {
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let dueDate = new Date(dateString);
    return dueDate.getTime() <= today;
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