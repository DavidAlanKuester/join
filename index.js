
// Listen to the form submit event
$('#singup-form').submit(function (evt) {

    // Target the form elements by their ids
    // And build the form object like this using jQuery: 
    var formData = {
        "uname": $('#uname').val(),
        "uemail": $('#uemail').val(),
    }

    evt.preventDefault(); //Prevent the default form submit action

    // You have formData here and can do this:
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig); //Initialize your firebase here passing your firebase account config object
    firebase.database().ref('/users').push(formData); // Adds the new form data to the list under formDataTree node
})