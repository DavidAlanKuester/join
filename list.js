//presumed tasks object structure

tasks =
{
    "user-tasks":
        [
            {
                "user-id": "1",
                "tasks":
                    [
                        {
                            "task-id": "1",
                            "title": "Create PowerPoint Presentation",
                            "due-date": "07-08-2020",
                            "category": "Management",
                            "importance": "1",
                            "description": "Create a management summary for the 2020 quartal 3 turnover",
                            "assigned-to":
                                [
                                    "1"
                                ],
                            "in-projects":
                                [
                                    "1",
                                    "2"
                                ]
                        },
                        {
                            "task-id": "2",
                            "title": "Organise Business Party",
                            "due-date": "20-08-2020",
                            "category": "Marketing",
                            "importance": "0",
                            "description": "Organize a remote business party for the marketing department",
                            "assigned-to":
                                [
                                    "1",
                                    "2"
                                ],
                            "in-projects":
                                [
                                    "1"
                                ]
                        },
                        {
                            "task-id": "3",
                            "title": "Pick up package",
                            "due-date": "31-08-2020",
                            "category": "Other",
                            "importance": "1",
                            "description": "",
                            "assigned-to":
                                [
                                    "1",
                                    "2"
                                ],
                            "in-projects":
                                [
                                    "1"
                                ]
                        }
                    ]
            },
            {
                "user-id": "2",
                "tasks":
                    [
                        {
                            "task-id": "4",
                            "title": "Prepare Sales Meeting",
                            "due-date": "22-08-2020",
                            "category": "Sales",
                            "importance": "1",
                            "description": "Prepare for a sales meeting to inform about the product offers",
                            "assigned-to":
                                [
                                    "2"
                                ],
                            "in-projects":
                                [
                                    "1"
                                ]
                        }

                    ]
            }
        ]
};

function getProjectMatrix(currentProjetId, currentUserId) {
    //display list of assigned tasks in order of level of urgency and importance

    let totalUsers = tasks["user-tasks"];
    console.log('Size of Total Users', totalUsers);
    let totalTasks = 0;
    for (let i = 0; i < totalUsers.length; i++) {
        totalTasks += totalUsers[i]["tasks"].length;
    }
    console.log('total tasks ', totalTasks);

    //get current user tasks list of current project

    let currentUserTaskslist = [];
    for (let i = 0; i < totalUsers.length; i++) {//get all tasks assigned by the user
        if (totalUsers[i]["user-id"] == currentUserId) {
            //found current user
            //collect all tasks assigned by the current user
            currentUserTaskslist = totalUsers[i]["tasks"];
            break;
        }
    }

    //search tasks list, if task assigned in current project, push it
    let currentProjectAssignedTasks = [];
    for (let i = 0; i < currentUserTaskslist.length; i++) {
        for (let j = 0; j < currentUserTaskslist[i]["in-projects"].length; j++) {
            if (currentUserTaskslist[i]["in-projects"][j] == currentProjetId) {
                currentProjectAssignedTasks.push(currentUserTaskslist[i]);
            }
        }
    }

    console.log("Current project " + currentProjetId + " of current user " + currentUserId + " has " + currentProjectAssignedTasks.length + " tasks assigned");

    //create same number of list-item-content elements as the number of tasks to append to list-content element 
    let listContent = document.getElementById("list");

    let listItems = [];
    for (let i = 0; i < currentProjectAssignedTasks.length; i++) {

        let listItemContent = document.createElement("div");
        listItemContent.classList.add("list-item-content");

        //user img 
        let assignedToImg = document.createElement("img");
        assignedToImg.src = "img/person.png";
        assignedToImg.classList.add("assigned-to-img", "rounded-circle");
        //listItemContent.appendChild(assignedToImg);

        //user name and contact for whom the tasks was assigned
        let userNameAndContact = document.createElement("div");
        userNameAndContact.innerHTML = "Name" + "<br>" + "Contact";
        //listItemContent.appendChild(userNameAndContact);

        let assignedToContent = document.createElement("div");
        assignedToContent.classList.add("assigned-to-content");
        assignedToContent.appendChild(assignedToImg);
        assignedToContent.appendChild(userNameAndContact);
        listItemContent.appendChild(assignedToContent);

        //task category value
        let categoryContent = document.createElement("div");
        categoryContent.classList.add("category-content");
        categoryContent.innerHTML = currentProjectAssignedTasks[i]["category"];
        listItemContent.appendChild(categoryContent);

        //task description value
        let descrition = document.createElement("div");
        descrition.classList.add("details-content");
        descrition.innerHTML = currentProjectAssignedTasks[i]["description"];
        listItemContent.appendChild(descrition);

        //TODO
        //get importance and due-date values
        //calculate the level of task importance and urgency
        //apply correct color to task

        listItems.push(listItemContent);
    }

    for (let i = 0; i < listItems.length; i++) {
        listContent.appendChild(listItems[i]);
    }

}