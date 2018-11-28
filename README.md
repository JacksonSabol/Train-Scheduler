# Welcome to CalTrain Trip Planner!

## The following project is an implementation of Google Firebase to track a local, Bay Area train

### Overview

I employed HTML, CSS, JavaScript, jQuery, JSON, and AJAX HTTP requests to make a dynamically generated train list. Users can add train lines to the list to keep track of their arrival time at a station. The point of this exercise was to use Firebase to store key-value pairs of train line information that gets dynamically generated with jQuery and appended to the web application. The user can input train line information as desired and the application will track the train, regardless of whether the user closes the tab, refreshes the page, or clears the cookies. 

### To Add a Train Line:

* Fill out the four required fields containing the train's information: Train Name; Destination; First Train Time; and Frequency. You will be alerted if the train information in the input fields needs modification before submittal.

* Click the Submit button to add a train line once all the fields are complete.

* Sit back, relax, and wait for your train to "arrive"!

I employed the use of modals to "alert" users of empty input fields and improper time formatting instead of using built in JavaScript alerts. They are less intrusive and fit the aesthetic of the page better. To make sure that added train lines are saved and displayed regardless of who views the application, I pushed all the input data to Google Firebase, then called it back to display it. I dynamically generated the elements to append them to a div well to hold the train line information. The code snippet below shows how to store and call back information using Firebase:

 ``` javascript
 // Push information from input fields to Firebase
$("#submit-button").on("click", function (event) {
    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var trainTime = $("#train-time").val().trim();
    var trainFrequency = $("#frequency").val().trim();
    trainFrequency = parseInt(trainFrequency);
    // Display modal if input fields are empty
    if ((trainName === "") || (trainDestination === "") || (trainTime === "") || (trainFrequency === "")) {
        $('#emptyField').modal('show');
    }
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainTime,
        frequency: trainFrequency
    };
    database.ref().push(newTrain);
});
// Pull information from Firebase to append to HTML
database.ref().on("child_added", function (childSnapshot) {
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;
    var newTrainRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrainTime.format("HH:mm")),
    $("<td>").text(minutesAway + " minutes")
    );
    $("#train-table > tbody").append(newTrainRow);
});
 ```
### Feel free to add your own train lines and watch them go!

[Link to my Train Scheduler](https://jacksonsabol.github.io/Train-Scheduler/)

Thank you for reading!

### Built With:
* HTML
* CSS
* JavaScript
* jQuery Library
* JSON
* Google Firebase
* Bootstrap CSS Library
* Bootstrap JavaScript Library