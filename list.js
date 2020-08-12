/**
 * Holds the tasks created by the current user
 * @type {Array}
 */
let currentUserTasks = [];

/**
 * Initialise currentUserTasks array 
 * @param {number} userId - used to get only the tasks created by the user with id value same as userId from tasksDummy array 
 */
function initiateUserTasksArray(userId){
    tasksDummy.forEach( task => {
        if(task.creator == userId){
            currentUserTasks.push(task);
        }
    });
}

/**
 * Holds the assigments of each task
 * @type {Array}
 */
let assigments = [];

 function initiateAssigments(user, task){

 }

/**
 * Returns user with id value same as id parameter value
 * @param {number} id - a number id to find the wanted user from  users array
 * @returns {(object|undefined)} user with id value same as id parameter value or undefinde if users array has no user that matches the id parameter value
 */
function getUserById(id){
   return  users.find( user => user.id == id);
}

/**
 * 
 * @param {object} user 
 * @param {object} task 
 * @returns 
 */
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

    // true = urgent
    return timeDifference < oneDayMilliseconds;

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
* for each task and for each user that task was assigne to, create assigment
*/
function initAssigments() {
    tasksInCurrentProject.forEach(task => {
        task["assigned-to"].forEach(userId => {
            assigments.push(createAssigment(users[userId], task)); //here userId is a index to users array of objects 
        });
    });
}

/**
 * 
 * Generates HTML Code for a task
 * 
 * @param {object} user - Display image, name and email of the user
 * @param {object} task - Display task color, categorie and description
 */
function generateListItem(user, task) {
    return `
    <div class="list-item-content  ${task.display}">
    <div class="assigned-to-content">
        <img src="${user.img}" class="assigned-to-img rounded-circle">
        <div>${user.name}<br>${user.eMail}</div>
    </div>
    <div class="category-content">${task.category}</div>
    <div class="details-content">${task.description}</div>
    </div>
`;
}

function initiateList(currentUserId) {

    let listContent = document.getElementById("list");

    initiateUserTasksArray(currentUserId);

    currentUserTasks.forEach(task =>{
        task["assigned-to"].forEach( userId =>{
             let listItem = generateListItem(getUserById(userId), task);
             listContent.insertAdjacentHTML("beforeend",listItem);
        })
    });
}