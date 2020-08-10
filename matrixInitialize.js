import {includeHTML} from "./includeHTML.js"

//removed from body tag call so that it works when running the site on o server
window.onload = function(){
    includeHTML();
};