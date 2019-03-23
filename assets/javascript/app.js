// Initialize Firebase
var config = {
    apiKey: "AIzaSyCdb-jYN3PSNp1aKXmgdn0lcZDohTDE97Q",
    authDomain: "fir-8e6fe.firebaseapp.com",
    databaseURL: "https://fir-8e6fe.firebaseio.com",
    projectId: "fir-8e6fe",
    storageBucket: "fir-8e6fe.appspot.com",
    messagingSenderId: "742448154146"
};

firebase.initializeApp(config);

// -------------- variables --------------
var database = firebase.database();

//Declaring the current time
var currentTime = moment().format();
console.log("current time: " + currentTime);
var name = "";
var destination = "";
var start = "";
var frequency = 0;
var nextArrival = "";


// submit button click event
$("#submit-btn").on("click", function (event) {
    event.preventDefault();

    // store user input in variables
    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    // .format("X") is a unix timestamp
    var start = moment($("#firstTime-input").val().trim(), "HH:mm").format("X");
    var frequency = $("#frequency-input").val().trim();

    // input new values into database
    database.ref().push({
        name: name,
        destination: destination,
        start: start,
        frequency: frequency
    });
    // clears textboxes after submit
    clearInputs();
});

// database children
database.ref().on("child_added", function (childSnapshot) {

    // store values in variables
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTimeInput = childSnapshot.val().start;
    var frequency = childSnapshot.val().frequency;

    // --------------calculations ---------------------
    var diffTime = moment().diff(moment.unix(trainTimeInput), "minutes");
    var timeRemainder = moment().diff(moment.unix(trainTimeInput), "minutes") % frequency;
    var minutes = frequency - timeRemainder;

    var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");
    console.log("Next Arrival: " + nextTrainArrival);
    // -------------calculations section end ----------------


    //   appending the data to the table
    $("#trainData").append("<tr><td>" + trainName + "</td><td>" +
        trainDestination + "</td><td>" + frequency + "</td><td>" +
        nextTrainArrival + "</td><td>" + minutes + "</td></tr>");


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// function to clear the textboxes after a submission
function clearInputs() {
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTime-input").val("");
    $("#frequency-input").val("");
}