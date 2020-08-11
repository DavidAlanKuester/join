function getUserById(id) {
   for(let i = 0; i < taskDummy["user-tasks"].length; i++){
       const user = taskDummy["user-tasks"][i];
       if( user["user-id"] == id){
           return user;
       }
   }
   return "NO_USER_WITH_ID: "+id+"FOUND";
}

function createAssigment(user, task){
    return {
        eisenhowerMatrixCategorie: getEisenhowerCategorie(task.importance, task.due-date),
        to: user,
        category: task["category"],
        details: task["descrition"]
    }
}

function getEisenhowerCategorie(important, dueDate){
    let urgent = calculateUrgency(dueDate);
    if(urgent && important){
        return "HIGH";
    }

    if(important && !urgent){
        return "SCHEDULE";
    }

    if(urgent && !important){
        return "DELEGATE";
    }

    if(!urgent && !important){
        return "ELIMINATE";
    }
}

function calculateUrgency(date){
    const oneDayMilliseconds = 86400000;
    let time = new Date().getTime();
    date.split("-");
    let shortDate = dueDate[1]+"/"+dueDate[0]+"/"+dueDate[2]; //convert date to short string format "MM/DD/YEAR"
    let dateToMilliseconds = new Date(shortDate).getTime();
    let timeDifference = dateToMilliseconds - time;
    if(timeDifference < oneDayMilliseconds){
        return true;// urgent
    }
    return false;// not urgent
}

function getProjectMatrix(currentProjetId, currentUserId) {

    let currentUser = getUserById(currentUserId);
    console.log("CURRENT USER", currentUser);

    let tasksInCurrentProject = [];

   currentUser.tasks.forEach(task => {
       task["in-projects"].forEach(id =>{
           if( id == currentProjetId){
               tasksInCurrentProject.push(task);
           }
       });
   });

   let assigments = [];
   
    tasksInCurrentProject.forEach(task =>{
        task["assigned-to"].forEach(userId =>{
            assigments.push(createAssigment(getUserById(userId, task)));
        });
   });


  /* console.log("TASKS LIST IN CURRENT PROJECT "+currentProjetId, tasksInCurrentProject);*/
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