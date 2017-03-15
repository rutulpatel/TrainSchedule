$(function() {

    //Initialize firebase
    var config = {
        apiKey: "AIzaSyAkFnY9KB3kxQDolUKL88SJ0etCPXrbUdg",
        authDomain: "train-schedule-c4925.firebaseapp.com",
        databaseURL: "https://train-schedule-c4925.firebaseio.com",
        storageBucket: "train-schedule-c4925.appspot.com",
        messagingSenderId: "494060214144"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    function addEmployeeToHTML(id, name, destination, time, frequency) {
        var trow = $("<tr>").attr("id", id);
        var tcolName = $("<td>").text(name);
        var tcolDest = $("<td>").text(destination);
        var tcolTime = $("<td>").text(time);
        var tcolFreq = $("<td>").text(frequency);
        var tcolMinAway = $("<td>").text(frequency);
        trow.append(tcolName).append(tcolDest).append(tcolFreq).append(tcolTime).append(tcolMinAway);
        $(".train-data").append(trow);
    }

    //loads data from database at initial page load and after every change made to the database
    database.ref().on("child_added", function(cS) { //cS stands for childSnapshot
            addEmployeeToHTML(cS.getKey(), cS.val().name, cS.val().destination, cS.val().time, cS.val().frequency);
        }),
        function(errorObj) {
            console.log("The read failed: " + errorObj.code);
        };

    database.ref().on("child_removed", function(cS) {
            $("#" + cS.getKey()).remove();
        }),
        function(errorObj) {
            console.log("Error: " + errorObj.code);
        };

    $("#submitBtn").on("click", function(event) {
        event.preventDefault();
        var name = $("#trainName").val().trim();
        var destination = $("#trainDestination").val().trim();
        var time = $("#trainTime").val().trim();
        var freq = $("#trainFreq").val();
        database.ref().push({
            name: name,
            destination: destination,
            time: time,
            frequency: freq,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("[id^=train]").val("");
    });
});