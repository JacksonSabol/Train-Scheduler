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
    // Add moment.js format for military time and add function to check if it's the correct format when inputted
    var trainTime = $("#train-time").val().trim();
    var trainFrequency = $("#frequency").val().trim();
    trainFrequency = parseInt(trainFrequency);

    // Add conditionals to make sure all fields are filled √
    if ((trainName === "") || (trainDestination === "") || (trainTime === "") || (trainFrequency === "")) {
        $('#emptyField').modal('show');
    }
    // Add conditional to make sure frequency input is a non-negative number √ 
    else if ((Number.isInteger(trainFrequency) === false) || (trainFrequency < 1)) {
        $('#trainFrequencyModal').modal('show');
    }
    // Add conditional to call function that forces user to input First Train Time in exact military time format
    else if (timePolice(trainTime) === false) {
        // timePolice function returns false and shows modal unless time format is perfect
    }
    else {

        // Create a local "temporary" object for holding train line data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            start: trainTime,
            frequency: trainFrequency
        };

        // Upload new train line data to the Firebase database - use .push not .set so it doesn't overwrite
        database.ref().push(newTrain);

        // Clear all of the input text fields to make ready for another entry
        $("#train-name").val("");
        $("#destination").val("");
        $("#train-time").val("");
        $("#frequency").val("");
    }
});

// Add function to force user to input first train time in military time
function timePolice(whatistime) {
    // Add conditional to check if user input string is 5 characters in length and check that 3rd character is ":"
    if ((whatistime.length !== 5) || (whatistime.charAt(2) !== ":")) {
        // Display modal if user input isn't 4 indices split by a colon i.e. HH:mm
        $('#trainTimeModal').modal('show');
        // Return false to if condition in submit-button function 
        return false;
    }

    // Save user input into separate variables for hours and minutes
    var hours = (parseInt(whatistime.slice(0, 2)));
    var minutes = (parseInt(whatistime.slice(3, 5)));

    // Add condition to check if hours and minutes are integers
    if ((Number.isInteger(hours) === false) || (Number.isInteger(minutes) === false)) {
        // Display modal if hours and minutes aren't integers
        $('#trainTimeIntegerModal').modal('show');
        // Return false to if condition in submit-button function
        return false;
    }

    // Add conditional to check if hours and minutes ranges are valid for time formatting - no negative hours/minutes; no hours more than 24 in a day; no minutes more than 60 in an hour
    if ((hours < 0 || hours > 23) || (minutes < 0 || minutes > 59)) {
        // Display modal if conditions aren't met
        $('#trainTimeFormatModal').modal('show');
        // Return false to if condition in submit-button function
        return false;
    }
    // Return true to if condition in submit-button only if the input for First Train Time is formatted perfectly
    return true;
};

// Function to dynamically create and append train line information to the DOM
function displayTrains (childSnapshot) {
    // Assign variables to hold the value of the database key/value pairs for each parameter of a train line
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;
    var trainKey = childSnapshot.key;

    // Calculate the difference between trainStartTime and current time for 'Next Arrival' and 'Minutes Away'

    // Assign variable to hold moment object of first train time
    var firstTrainTime = moment(trainTime, "HH:mm");
    // Assign variable to hold current time for comparison
    var currentTime = moment();

    // Calculate time difference between currentTime and firstTrainTime
    var timeDifference = currentTime.diff(firstTrainTime, 'minutes');

    // Assign minutesAway and nextTrainTime to reassign in conditionals
    var minutesAway = 0;
    var nextTrainTime = moment();

    // Add condition to check if the time difference is less than or equal to 0 to determine whether the first train has arrived
    if (timeDifference <= 0) {
        // Reassign minutesAway to the time that remains before the arrival of the first train
        minutesAway = -timeDifference;
        // Reassign the nextTrainTime to the first scheduled train since they are referencing the same train
        nextTrainTime = firstTrainTime;
    }
    // Else condition where the first train has arrived
    else {
        // Calculate the time since the last train as the remainder of the timeDifference and the trainFrequency
        var timeSinceLastTrain = (timeDifference % trainFrequency);
        // Subtract that from trainFrequency to determine how many minutes until the next train
        minutesAway = (trainFrequency - timeSinceLastTrain);
        // Reassign nextTrainTime to the currentTime plus the minutesAway
        nextTrainTime = currentTime.add(minutesAway, 'minutes');
    }

    // Dynamically generate a 'delete' button for each train line
    var deleteButton = $("<button>");
    var removeSpan = $("<span>");
    deleteButton.addClass("remove-button");
    deleteButton.attr("data-key", trainKey);
    removeSpan.addClass("glyphicon glyphicon-remove");
    deleteButton.append(removeSpan);

    // Assign a variable to dynamically create a new row
    var newTrainRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrainTime.format("HH:mm")),
        $("<td>").text(minutesAway + " minutes"),
        $("<td align='right'>").html(deleteButton)
    );
    // Add an ID of each Firebase entry's key as a unique identifier to allow us to delete train lines
    newTrainRow.attr("id", trainKey);
    
    // Append the new row to the table
    $("#train-table > tbody").append(newTrainRow);
}

// Create Firebase event for adding new train line to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    // Invoke the displayTrains function and pass it the Firebase childSnapshot
    displayTrains(childSnapshot);
});

// Add 'remove' button functionality to newTrainRow
$("body").on("click", ".remove-button", function () {
    // Remove data (child) from firebase associated with this buttons key
    database.ref().child($(this).attr("data-key")).remove();
});
// Create Firebase event for to listen for the deletion of a train line from the database - updates the trains listed accordingly
database.ref().on("child_removed", function (snapshot) {
    // Assign a variable to hold the train's unique 'key'
    var trainKey = snapshot.key;
    // Remove row with id that matches key of child that was removed
    $("#" + trainKey).remove();
});


