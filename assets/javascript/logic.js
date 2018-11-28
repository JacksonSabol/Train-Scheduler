// Initialize Firebase
var config = {
    apiKey: "AIzaSyAKKsUI20X6x_ov5-dSXjvkk0JxzXWv4WQ",
    authDomain: "train-scheduler-77a7d.firebaseapp.com",
    databaseURL: "https://train-scheduler-77a7d.firebaseio.com",
    projectId: "train-scheduler-77a7d",
    storageBucket: "train-scheduler-77a7d.appspot.com",
    messagingSenderId: "386972897169"
};
firebase.initializeApp(config);

// Assign variable to point to Firebase database
var database = firebase.database();

// Assign variable to hold current time for comparison to train time and frequency to calculate next arrival time and minutes away
var currentTime = moment().format('LTS');
// Console log for testing - can't just assign value and have it update continuously
console.log(currentTime);

// Add event listener for submit button to begin function for adding new train lines
$("#submit-button").on("click", function (event) {
    // Prevent default action of submitting a form, which is refresh the page
    event.preventDefault();

    // Assign variables to hold the value of the text input fields for each parameter of a train line
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    // Add moment.js format for military time and add function to check if it's the correct format when inputted
    var trainTime = $("#train-time").val().trim();
    var trainFrequency = $("#frequency").val().trim();

    // Add conditionals to make sure all fields are filled; add conditionals to make sure frequency input is a number; 

    // Create a local "temporary" object for holding train line data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainTime,
        frequency: trainFrequency
    };

    // Upload new train line data to the Firebase database - use .push not .set so it doesn't overwrite
    database.ref().push(newTrain);

    // Console log for testing
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    // alert("Employee successfully added"); Research modals to inform user that the train was added successfully

    // Clear all of the input text fields to make ready for another entry
    $("#train-name").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");
});