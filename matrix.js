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
                            "importance": "1",
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

}

function callJson() {
    let doTasks = [];
    let scheduleTasks = [];
    let delegateTasks = [];
    let eliminateTasks = [];

    tasks["user-tasks"].forEach(user => {
        user.tasks.forEach(task => {
            AddTaskInEisenhowerCategory(task,
                doTasks, scheduleTasks, delegateTasks, eliminateTasks)
        });
    });
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
    if (isDue(task.dueDate && taskIsimportant(task))) {
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

function getCurrentDateString() {
    let date = new Date();
    year = date.getFullYear();
    month = date.getMonth();
    date = date.getDate();
    return (year + '-' + (month + 1) + '-' + date);
}

function isDue(dateString) {
    let today = new Date();
    today = new Date(today.getFullYear, today.getMonth, today.getDate);
    dueDate = new Date(dateString);
    return (dueDate.getTime() <= today) ? true : false;
}
