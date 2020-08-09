const MatrixIds =
{
    ADD_Task_DO: "matrix-tasks-do-here",
    ADD_TASK_SCHEDULE: "matrix-tasks-schedule-here",
    ADD_TASK_DELEGATE: "matrix-tasks-delegate-here",
    ADD_TASK_ELIMINATE: "matrix-tasks-eliminate-here"
}
Object.freeze(MatrixIds);

let tasks =
{
    "user-tasks":
        [
            {
                "user-id": "0",
                "tasks":
                    [
                        {
                            "task-id": "0",
                            "title": "Create PowerPoint Presentation",
                            "due-date": "2020-08-07",
                            "category": "Management",
                            "importance": "0",
                            "description": "Create a management summary for the 2020 quartal 3 turnover",
                            "assigned-to":
                                [
                                    "0"
                                ],
                            "in-projects":
                                [
                                    "0",
                                    "1"
                                ]
                        },
                        {
                            "task-id": "1",
                            "title": "Organise Business Party",
                            "due-date": "2020-08-20",
                            "category": "Marketing",
                            "importance": "0",
                            "description": "Organize a remote business party for the marketing department",
                            "assigned-to":
                                [
                                    "0",
                                    "1"
                                ],
                            "in-projects":
                                [
                                    "0"
                                ]
                        },
                        {
                            "task-id": "2",
                            "title": "Pick up package",
                            "due-date": "2020-08-31",
                            "category": "Other",
                            "importance": "1",
                            "description": "",
                            "assigned-to":
                                [
                                    "0",
                                    "1"
                                ],
                            "in-projects":
                                [
                                    "0"
                                ]
                        }
                    ]
            },
            {
                "user-id": "1",
                "tasks":
                    [
                        {
                            "task-id": "3",
                            "title": "Prepare Sales Meeting",
                            "due-date": "2020-08-22",
                            "category": "Sales",
                            "importance": "1",
                            "description": "Prepare for a sales meeting to inform about the product offers",
                            "assigned-to":
                                [
                                    "1"
                                ],
                            "in-projects":
                                [
                                    "0"
                                ]
                        }

                    ]
            }
        ]
};

function initializeMatrix() {
    let doTasks = [];
    let scheduleTasks = [];
    let delegateTasks = [];
    let eliminateTasks = [];
    loadTasksIntoCategories(doTasks, scheduleTasks, delegateTasks, eliminateTasks);
    initializeCategoryInMatrix(doTasks, MatrixIds.ADD_Task_DO);
    initializeCategoryInMatrix(scheduleTasks, MatrixIds.ADD_TASK_SCHEDULE);
    initializeCategoryInMatrix(delegateTasks, MatrixIds.ADD_TASK_DELEGATE);
    initializeCategoryInMatrix(eliminateTasks, MatrixIds.ADD_TASK_ELIMINATE);
}

function loadTasksIntoCategories(doTasks, scheduleTasks, delegateTasks, eliminateTasks) {
    tasks["user-tasks"].forEach(user => {
        user.tasks.forEach(task => {
            AddTaskInEisenhowerCategory(task,
                doTasks, scheduleTasks, delegateTasks, eliminateTasks)
        });
    });
    /*     console.log("do");
        console.log(doTasks);
        console.log("schedule");
        console.log(scheduleTasks);
        console.log("delegate");
        console.log(delegateTasks);
        console.log("eliminate");
        console.log(eliminateTasks); */
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

        /*case eisenhowerMatrixCategrories.SCHEDULE:
            eliminateTasks.push(task);
            break;
        */
        default:
            console.log("Error in AddTaskInEisenhoverCategory");
            break;
    }
}

function getEisenhowerCategory(task) {
    // criteria for DO-Task
    if (taskIsimportant(task) && isDue(task["due-date"])) {
        return eisenhowerMatrixCategrories.DO;
    }
    //criteria for schedule task
    if (taskIsimportant(task)) {
        return eisenhowerMatrixCategrories.SCHEDULE;
    }
    // criteria for delegate task
    if (!taskIsimportant(task)) {
        return eisenhowerMatrixCategrories.DELEGATE;
    }
    // criteria for eliminate task
    // TODO
    // To define
}

function taskIsimportant(task) {
    return (task.importance == 0) ? true : false;
}

function isDue(dateString) {
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let dueDate = new Date(dateString);
    return (dueDate.getTime() <= today) ? true : false;
}

/**
 * This function takes a date String and returns a string converted in the format DD-MM-YYYY
 * @param {} date 
 */
function ConvertToEuropeanDateString(dateString, delimiter) {
    let date = new Date(dateString);
    return (
        '' + date.getDay() + delimiter
        + date.getMonth() + delimiter
        + date.getFullYear().toString().substr(2, 2)
    );
}

function initializeCategoryInMatrix(tasksJson, IdString) {
    tasksJson.forEach(taskJson => {
        let taskHtmlString = createTask(taskJson);
        document.getElementById(IdString).insertAdjacentHTML("beforeend", taskHtmlString);
    });
}

function createTask(task) {
    return ('<div class="matrix-task-container">'
        + '<div class="matrix-task-date">' + ConvertToEuropeanDateString(task['due-date'], '.') + '</div>'
        + '<div class="matrix-task-title">' + task['title'] + '</div>'
        + '<div class="matrix-task-description">' + task['description'] + '</div>'
        + '<div class="matrix-task-category-img-container">'
        + '<div class="matrix-task-category">' + task['category'] + '</div>'
        + '<div><img src="img/person.png" class="matrix-task-img"></div>'
        + '</div>'
        + '</div>');


}

/*
    function getCurrentDateString() {
            let date = new Date();
    year = date.getFullYear();
    month = date.getMonth();
    date = date.getDate();
    return (year + '-' + (month + 1) + '-' + date);
}
*/