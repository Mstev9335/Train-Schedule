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

// variables
// =======================================
var database = firebase.database();

//Declaring the current time
var currentTime = moment().format();
console.log("current time: "+ currentTime);
var name = "";
var destination = "";
var start = "";
var frequency = "";
var nextArrival = "";
var minutesAway = "";


// submit button click event
$("#submit-btn").on("click", function (event) {
    event.preventDefault();

    // getting data
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
    clearInputs();
});

// database children
database.ref().on("child_added", function (childSnapshot) {

    // store database values in variables 
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;

    // convert current time into a nice HH:MM format
    var trainStartPretty = moment.unix(trainTime).format("HH:mm A");
    console.log("start time: "+ trainStartPretty);

    //convert train time
    var trainTimeConverted = moment(trainTime, "HH:mm");
        console.log("current Time: "+trainTimeConverted);
    
    //subtracting time
    var timeDifference = moment().diff(moment(trainTimeConverted), "minutes");
      console.log("time difference in minutes: " +timeDifference);
      
    //   setting frequency in variable
    var frequencyMinutes = childSnapshot.val().frequency;
      console.log("Frequency Minutes: " + frequencyMinutes);
    
    //   getting the number of minutes away
    var minutesAway = Math.abs(timeDifference % frequencyMinutes);
        console.log("Minutes Away: " + minutesAway);
    
    // getting the next arrival time
    var nextArrival = moment(currentTime).add(minutesAway, "minutes").format("hh:mm A");
      console.log("Next Arrival: " + nextArrival);

    //   appending the data to the table
      $("#trainData").append("<tr><td>" + trainName + "</td><td>" +
       trainDestination + "</td><td>" + trainFrequency + "</td><td>" +
        nextArrival + "</td><td>" + minutesAway + "</td></tr>");


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