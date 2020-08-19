'use strict';

let allUsers;
let currentUser;

//grab a form
const singUpForm = document.querySelector('#singup-form');
const logInForm = document.querySelector('#login-form');

//grab an input
const inputSingUpEmail = singUpForm.querySelector('#new-email');
const inputSingUpName = singUpForm.querySelector('#new-name');
const inputNewPassword = singUpForm.querySelector('#new-password');
const inputNewPassword2 = singUpForm.querySelector('#new-password2');
const inputLogInName = logInForm.querySelector('#user-name');


const firebaseConfig = {
    apiKey: "AIzaSyCRp6HOOvimVaOUUBZRQzEGWmqLSKVVZOw",
    authDomain: "join-444de.firebaseapp.com",
    databaseURL: "https://join-444de.firebaseio.com",
    projectId: "join-444de",
    storageBucket: "join-444de.appspot.com",
    messagingSenderId: "1040256295028",
    appId: "1:1040256295028:web:c6c39d7f1f7d9c72223121",
    measurementId: "G-XNM82E9BW7"
};


function init(){
        //prevents from breaking
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
}

//create a functions to push
function firebasePush(user) {


    console.log(' user.password is ',  user.password);

    // Register new user
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log('user created?', errorCode, errorMessage);

      });

      
    //push itself
    // var userRef = firebase.database().ref('users').push().set(
    //     user
    // );

}

//push on form submit
if (singUpForm) {
    singUpForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: Compare if password == password2
        let user = {
            email: inputSingUpEmail.value,
            password: inputNewPassword.value,
            name: inputSingUpName.value
        }
        firebasePush(user);

        //shows alert if everything went well.
        return alert('Data Successfully Sent to Realtime Database');
    })
}

function firebaseGetUser(userName) {
    //prevents from braking
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    //get all users
    return firebase.database().ref('users/').once('value').then(function (snapshot) {

        snapshot.forEach(childSnapshot => {
            if (childSnapshot.val().name == userName) {
                currentUser = childSnapshot.val();
            }
        })
        console.log(currentUser);
    });
}

//get on form submit
if (logInForm) {
    logInForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        firebaseGetUser(inputLogInName.value);
        //show alert if everything went well.
        return alert('Data Successfully Get from Realtime Database');
    })
}