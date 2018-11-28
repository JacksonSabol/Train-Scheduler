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

// Add event listener for submit button to begin function for adding new train lines
$("#submit-button").on("click", function (event) {
    // Prevent default action of submitting a form, which is refresh the page
    event.preventDefault();

    // Assign variables to hold the value of the text input fields for each parameter of a train line
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    // Add moment.js format for military time - not currently working, will continue researching docs
    var trainTime = moment($("#train-time").val().trim(), "HH", "mm").format("X");
    var trainFrequency = $("#frequency").val().trim();

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
    $("#employee-name-input").val("");
    $("#role-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
});