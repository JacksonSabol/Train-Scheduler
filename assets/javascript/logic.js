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

        // Console log for testing
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.start);
        console.log(newTrain.frequency);

        // Clear all of the input text fields to make ready for another entry
        $("#train-name").val("");
        $("#destination").val("");
        $("#train-time").val("");
        $("#frequency").val("");
    }
});

// Create Firebase event for adding new train line to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Assign variables to hold the value of the database key/value pairs for each parameter of a train line
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;

    // Add moment.js or simple JS method to format start time to military time
    // var trainStartTime = moment.unix(trainTime).format("HH:mm");

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

    // Console log for testing
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);
    console.log(timeDifference);
    console.log(minutesAway);
    console.log(nextTrainTime);

    // Assign a variable to ynamically create a new row
    var newTrainRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrainTime.format("HH:mm")),
        $("<td>").text(minutesAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newTrainRow);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});