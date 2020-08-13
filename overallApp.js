
let tasks = [];

let createdTasks;

let users = [
    {
        'id': 0,
        "img": "img/id0.png",
        "name": "JSON0",
        "eMail": "@JSON0.de"
    },
    {
        'id': 1,
        "img": "img/id0.png",
        "name": "JSON0",
        "eMail": "@JSON0.de"
    },
    {

        "id": 2,
        "img": "img/id1.png",
        "name": "JSON1",
        "eMail": "@JSON1.de"
    },
    {

        "id": 3,
        "img": "img/id2.png",
        "name": "JSON2",
        "eMail": "@JSON2.de"
    },
    {

        "id": 4,
        "img": "img/id3.png",
        "name": "JSON3",
        "eMail": "@JSON3.de"
    }
];

//presumed task object structure
//due-date should have short date string format "MM/DAY/YEAR"
let tasksDummy = [
    {
        "task-id": "0",
        "creator": "0",
        "title": "Create Marketing presentation",
        "due-date": "2020-08-12",
        "category": "Other",
        "importance": "1",
        "description": "",
        "assigned-to": [
            "0"
        ],
        "display": "do"
    },
    {
        "task-id": "1",
        "creator": "0",
        "title": "Organize Business Party",
        "due-date": "2020-08-25",
        "category": "Other",
        "importance": "1",
        "description": "",
        "assigned-to": [
            "0",
            "1"
        ],
        "display": "schedule"
    },
    {
        "task-id": "2",
        "creator": "0",
        "title": "Pick up package",
        "due-date": "2020-08-31",
        "category": "Other",
        "importance": "1",
        "description": "",
        "assigned-to": [
            "0",
            "1"
        ],
        "display": "delegate"
    },    
    {
        "task-id": "3",
        "creator": "0",
        "title": "HR Meeting Alignment",
        "due-date": "2020-09-15",
        "category": "HR",
        "importance": "1",
        "description": "",
        "assigned-to": [
            "0",
            "1"
        ],
        "display": "eliminate"
    }

];

const eisenhowerMatrixCategrories =
{
    DO: "do",
    SCHEDULE: "schedule",
    DELEGATE: "delegate",
    ELIMINATE: "eliminate"
}
Object.freeze(eisenhowerMatrixCategrories);

/**
 * 
 * Includes html file inside container using w3-include-html attribute's values as the name of the html file
 * example: <div w3-include-html="fileName.html"></div>
 * 
 * Changes the visual output of sidebar.html links to match the current navigated site
 * 
 * @param {string} site - name of the site to which the HTML file was included
 */
function includeHTML(site) {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    changeSideBarTo(site);
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

/**
 * 
 * Changes the sidebar links visual output to match the current navigated site 
 * 
 * @param {string} site - name of the site 
 */
function changeSideBarTo(site){
    switch(site){
        case "list":
            changeSideBarLinksToListSelected();
            break;
        case "matrix":
            changeSideBarLinksToMatrixSelected();
            break;
        case "addTask":
            changeSideBarLinksToAddtask();
            break;
        default:
            console.error("ERROR:: unknown site "+site);
    }
}

function changeSideBarLinksToListSelected(){
    document.getElementById("matrix-link").classList.add("link-unselected");
    document.getElementById("list-link").classList.add("link-selected");
    document.getElementById("list-link").innerHTML = "List";
}

function changeSideBarLinksToMatrixSelected(){
    document.getElementById("matrix-link").classList.add("link-selected");
    document.getElementById("list-link").classList.add("link-unselected");
    document.getElementById("list-link").innerHTML = "List";
}

function changeSideBarLinksToAddtask(){
    document.getElementById("matrix-link").classList.add("link-unselected");
    document.getElementById("list-link").classList.add("link-unselected");
    document.getElementById("list-link").innerHTML = "View List";
}