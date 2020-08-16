/**
 *
 * Calculates and returns Eisenhower Matrix Categorie based on the importance and dueDate of a task
 *
 * @param {number} important - Task Importance Level
 * @param {string} dueDate - Task Due Date
 * @returns {string} - Eisenhower Matrix Categorie Name
*/
function getEisenhowerCategorie(important, dueDate) {
    /**
     * @type {boolean} - Result of the calculated urgency based on the task dueDate
     */
    let urgent = calculateUrgency(dueDate);

    if (urgent && important) {
        return eisenhowerMatrixCategrories.DO;
    }

    if (important && !urgent) {
        return eisenhowerMatrixCategrories.SCHEDULE;
    }

    if (urgent && !important) {
        return eisenhowerMatrixCategrories.DELEGATE;
    }

    if (!urgent && !important) {
        return eisenhowerMatrixCategrories.ELIMINATE;
    }
}

/**
*
* @type {number} - Constat number that represent one Day in milliseconds
*/
const ONE_DAY_MILLISECONDS = 86400000;

/**
*
*  Calculates the urgency of a task.
*
* @param {string} date - ISO-8601 string date format YYYY-MM-DD
* @returns {boolean} - true if the time difference between date and actual time is less then one day, else false
*/
function calculateUrgency(date) {
    /**
     * @type {number} - actual time in milliseconds
     */
    let time = new Date().getTime();
    /**
     * @type {number} - converted date from string to milliseconds
     */
    let dateToMilliseconds = new Date(date).getTime();
    let timeDifference = dateToMilliseconds - time;

    // true = urgent
    return timeDifference < ONE_DAY_MILLISECONDS;
}

/**
* @type { HTMLDivElement } - Div Container of the Generated HTML Code for a Task
*/
let listContent;

/**
 *
 * Loops the currentUserTasks Arrary, for each task object and for each userId number in each task.assigned-to array,
 * generates HTML Code and inserts the Code before the end of listContent HTMLElement.
 */
function initiateListContent() {

    listContent = document.getElementById("list");

    currentUserTasks.forEach(task => {
        task["assigned-to"].forEach(userId => {
            /**
             * @type {string} - Generated HTML Code
             */
            let listItem = generateListItem(getUserById(userId), task);
            listContent.insertAdjacentHTML("beforeend", listItem);
        })
    });
}

/**
 * Holds the tasks created by the current user
 * @type {Array}
 */
let currentUserTasks = [];

/**
 *
 * Initialise currentUserTasks Array
 *
 * @param {number} userId - Used to get only the tasks created by the user with id value same as userId from tasksDummy Array
 */
function initiateUserTasksArray(userId) {
    tasksDummy.forEach(task => {
        if (task.creator == userId) {
            currentUserTasks.push(task);
        }
    });
}

/**
 *
 * Returns user object with id value same as id parameter value
 *
 * @param {number} id - a number id to find the wanted user from  users array
 * @returns {(object|undefined)} user with id value same as id parameter value or undefinde if users array has no user that matches the id parameter value
 */
function getUserById(id) {
    return users.find(user => user.id == id);
}

/**
 *
 * Generates HTML Code for a task
 *
 * @param {object} user - Display image, name and email of the user
 * @param {object} task - Display task color, categorie and description
 * @returns {string}  multiline string HTML Code
 */
function generateListItem(user, task) {
    return `
    <div class="list-item-content  ${task.display}">
    <div class="assigned-to-content">
        <img src="${user.img}" class="assigned-to-img rounded-circle">
        <div>${user.name}<br>${user.eMail}</div>
    </div>
    <div class="category-content">${task.category}</div>
    <div class="details-content">${task.title}</div>
    </div>
`;
}

/**
 *
 *  Initialise currentUserTasks array and listContent HTML element with the tasks to be displayed
 *
 * @param {number} currentUserId - Used to initiate currentUserTasks Array with tasks created by the user with id same as given currentUserId
 */
function displayListOfAssigments(currentUserId) {

    initiateUserTasksArray(currentUserId);
    initiateListContent();
}