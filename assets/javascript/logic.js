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
    var trainTime = moment.unix($("#train-time").val().trim()).format("HH:mm");
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

// Create Firebase event for adding new train line to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Assign variables to hold the value of the database key/value pairs for each parameter of a train line
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;

    // Console log for testing
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);

    // Add moment.js or simple JS method to format start time to military time
    var trainStartTime = moment.unix(trainTime).format("HH:mm");

    // Calculate the difference between trainStartTime and current time for 'Next Arrival' and 'Minutes Away'


    // Assign a variable to ynamically create a new row
    var newTrainRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(trainStartTime), // Switch to nextArrival when calculation is complete
        $("<td>").text("Not Available") // Switch to minutesAway when calculation is complete
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newTrainRow);
});