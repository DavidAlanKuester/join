let tasksInCurrentProject = [];
let assigments = [];
/* search the taskDummy object and gets the object with the user-id property that equals the id parameter*/
function getUserById(id) {
    for (let i = 0; i < taskDummy["user-tasks"].length; i++) {
        const user = taskDummy["user-tasks"][i];
        if (user["user-id"] == id) {
            return user;
        }
    }
    return "NO_USER_WITH_ID: " + id + "FOUND";
}

/*returns an object that holds the information of an list-item element appended to list-content element from list.html*/
function createAssigment(user, task) {
    return {
        eisenhowerMatrixCategorie: getEisenhowerCategorie(task.importance, task["due-date"]),
        to: user,
        category: task["category"],
        details: task["description"]
    }
}

/*calculates the level of eisenhowermatrix categorie needed for the coloring of the list-item element*/
function getEisenhowerCategorie(important, dueDate) {
    let urgent = calculateUrgency(dueDate);
    if (urgent && important) {
        return "do";
    }

    if (important && !urgent) {
        return "schedule";
    }

    if (urgent && !important) {
        return "delegate";
    }

    if (!urgent && !important) {
        return "eliminate";
    }
}

/*calculates the urgency of a task
* if difference of given date and time is less then one day, then task is urgen
* else task is not urgent
*/
function calculateUrgency(date) {
    const oneDayMilliseconds = 86400000;
    let time = new Date().getTime();
    let dateToMilliseconds = new Date(date).getTime();
    let timeDifference = dateToMilliseconds - time;
    if (timeDifference < oneDayMilliseconds) {
        return true;// urgent
    }
    return false;// not urgent
}

/*a task can be added to more projects*/
/*initialise tasksInCurrentProject only with the tasks of a given user that are added to a projectId*/
function initUserTasksFromProjectId(user, projectId) {
    user.tasks.forEach(task => {
        task["in-projects"].forEach(id => {
            if (id == projectId) {
                tasksInCurrentProject.push(task);
            }
        });
    });
}

/*a task can be assign to more users*/
/* first the tasksInCurrentProject array should be initialise, we only what the tasks that are in one project
/* initialise assigments array with tasks
* for each task assigment create assigment
*/
function initAssigments() {
    tasksInCurrentProject.forEach(task => {
        task["assigned-to"].forEach(userId => {
            assigments.push(createAssigment(users[userId], task)); //here userId is a index to users array of objects 
        });
    });
}

function getProjectMatrix(currentProjetId, currentUserId) {

    let currentUser = getUserById(currentUserId);
    console.log("CURRENT USER", currentUser);
    initUserTasksFromProjectId(currentUser, currentProjetId);
    console.log("Tasks in Project "+currentProjetId, tasksInCurrentProject);
    initAssigments();
    console.log("Assigments of user "+currentUserId, assigments);

    let listContent = document.getElementById("list");
    let listItems = [];

    assigments.forEach(assigment =>{
        let listItemContent = document.createElement("div");
        listItemContent.classList.add("list-item-content");

        //user img 
        let assignedToImg = document.createElement("img");
        assignedToImg.src = assigment.to.img;
        assignedToImg.classList.add("assigned-to-img", "rounded-circle");
        //listItemContent.appendChild(assignedToImg);

        //user name and contact for whom the tasks was assigned
        let userNameAndContact = document.createElement("div");
        userNameAndContact.innerHTML = assigment.to.name + "<br>" + assigment.to.eMail;
        //listItemContent.appendChild(userNameAndContact);

        let assignedToContent = document.createElement("div");
        assignedToContent.classList.add("assigned-to-content");
        assignedToContent.appendChild(assignedToImg);
        assignedToContent.appendChild(userNameAndContact);
        listItemContent.appendChild(assignedToContent);

        //task category value
        let categoryContent = document.createElement("div");
        categoryContent.classList.add("category-content");
        categoryContent.innerHTML =assigment.category;
        listItemContent.appendChild(categoryContent);

        //task description value
        let descrition = document.createElement("div");
        descrition.classList.add("details-content");
        descrition.innerHTML = assigment.details;
        listItemContent.appendChild(descrition);

        //TODO
        //get importance and due-date values
        //calculate the level of task importance and urgency
        //apply correct color to task
        listItemContent.classList.add(assigment.eisenhowerMatrixCategorie)

        listItems.push(listItemContent);
    });




    /* console.log("TASKS LIST IN CURRENT PROJECT "+currentProjetId, tasksInCurrentProject);*/
    //display list of assigned tasks in order of level of urgency and importance

    /*let totalUsers = tasks["user-tasks"];
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
    }*/

    for (let i = 0; i < listItems.length; i++) {
        listContent.appendChild(listItems[i]);
    }

}