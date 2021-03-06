# Join
Welcome to join, an application that has been created as a group project during the training in the Developer Academy.

## What is Join?
Join is a task-managing-application where you can organize tasks based on importance and urgency and assign them to work areas and colleagues.
You can create your own account and assign tasks to your friends and colleagues.

## How does Join work?
You just want to know how the user interface works? Check out our help component!
Detailed Information is listed below:

### Add Task
Information will be available here soon.
### List
Information will be available here soon.
### Matrix
Matrix loads all tasks from firebase and filters those task that are relevant to the current user.
Additionally, all tasks with the display property "schedule" are checked for an arriving due-date.
If the due-date has arrived their display property is changed to "do".
After this all tasks that are relevant to the user are created as HTML objects and displayed to the user.
Furthermore, it is possible to change the type of a task by drag and dropping a task in the matrix user interface
from one category to another. If the "drop" of drag and drop is performed the display property of the task is
being updated to firebase. When the call was successfull, we also update the task in the user interface and display
it to its new category.
Apart of changing a task we can also deleting a task by clicking on a garbage can. If a garbage can on a task is clicked 
a asynchronous call is send to firebase to delete the task. If the task is deleted successfully the task is also deleted
in the user interface.

## Creators
This application was created by David Küster, Mihai-Andrei Neacsu and Eric Bruch. You can find our contact details on our page under imprint.
Check out who was responsible for what part of the page below:

### David Küster
* Programmed the Add Task component with JavaScript.
* Designed the Add Task, Imprint, Data-Protection and the Help components with HTML & CSS.
* Constructed responsive Design for the Add Task, Imprint, Data-Protection, Menu and the Help components with CSS.

### Mihai-Andrei Neacsu
* Programmed the List component with JavaScript.
* Designed the Menu, Index & List component with HTML & CSS.
* Constructed responsive Design for the Menu, Index & List component.
* Linked Join with a Firebase.

### Eric Bruch
* Programmed the Matrix component with JavaScript.
* Designed the Matrix component with HTML & CSS.
* Constructed responsive Design for the Matrix component.
* Linked Join with a Firebase.

## Getting started!!
Check out our page on: 
https://david-kuester.de/join/index.html
