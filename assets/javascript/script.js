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

    //remove a record from the database based on child's id
    function removeRow() {
        database.ref().child($(this).attr("id")).remove();
    }


    //add new row to the HTML table 
    function addRow(id, name, destination, frequency, startTime) {
        if (!$("#" + id).length) {
            var now = moment();
            var minAway;
            var nextArrival = moment(startTime, "HH:mm").add(parseInt(frequency), 'm').format("HH:mm");
            if (moment(startTime, "HH:mm").isBefore(now)) {
                while (moment(nextArrival, "HH:mm").isBefore(now)) {
                    nextArrival = moment(nextArrival, "HH:mm").add(parseInt(frequency), 'm').format("HH:mm");
                }
            }
            var hour = moment(nextArrival, "HH:mm").subtract(now.format("H"), "H").format("H");
            var min = moment(nextArrival, "HH:mm").subtract(now.format("m"), "m").format("m");
            minAway = (parseInt(hour) * 60) + parseInt(min);

            var trow = $("<tr>");
            var tcolName = $("<td>").text(name);
            var tcolDest = $("<td>").text(destination);
            var tcolNextArrivalTime = $("<td>").text(nextArrival);
            var tcolFreq = $("<td>").text(frequency);
            var tcolMinAway = $("<td>").text(minAway);
            var cancelButton = $("<td>").html($("<i>").attr({ "class": "fa fa-times", "id": id, "aria-hidden": "true" }));
            trow.append(cancelButton).append(tcolName).append(tcolDest).append(tcolFreq).append(tcolNextArrivalTime).append(tcolMinAway);
            $(".train-data").append(trow);
            $("#" + id).on("click", removeRow);
        }
    }


    //function to subscribe on child_added database event 
    function onChildAdded() {
        //clear html before loading
        $(".train-data").html("");
        //loads data from database at initial page load and after every change made to the database
        database.ref().on("child_added", function(cS) { //cS stands for childSnapshot
                addRow(cS.getKey(), cS.val().name, cS.val().destination, cS.val().frequency, cS.val().time);
            }),
            function(errorObj) {
                console.log("The read failed: " + errorObj.code);
            };
    }

    //function to subscribe on child_remove database event 
    function onChildRemoved() {
        //get called when the data is deleted from the database
        database.ref().on("child_removed", function(cS) {
                $("#" + cS.getKey()).parent().parent().remove();
            }),
            function(errorObj) {
                console.log("Error: " + errorObj.code);
            };
    }

    //listens to submitBtn clicks
    $("#submitBtn").on("click", function(event) {
        event.preventDefault();
        var name = $("#trainName").val().trim();
        var destination = $("#trainDestination").val().trim();
        var time = $("#trainTime").val().trim();
        var freq = $("#trainFreq").val().trim();
        var msg = "<h5>";
        if (name === "" || destination === "" || time === "" || freq === "") {
            if (name === "") {
                msg += "<li>" + $("#trainName").attr("data-error") + "</li><br/>";
            }
            if (destination === "") {
                msg += "<li>" + $("#trainDestination").attr("data-error") + "</li><br/>";
            }
            if (time === "") {
                msg += "<li>" + $("#trainTime").attr("data-error") + "</li><br/>";
            }
            if (freq === "") {
                msg += "<li>" + $("#trainFreq").attr("data-error") + "</li><br/>";
            }
            $(".modal-body").html(msg + "</h5>");
            msg = "";
            $("#submitBtn").attr("data-target", "#myModal");
        } else {
            $("#submitBtn").attr("data-target", "");
            database.ref().push({
                name: name,
                destination: destination,
                time: time,
                frequency: freq,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
            $("[id^=train]").val("");
        }
    });

    //initializes the listeners and timer to update data every minute
    onChildAdded();
    onChildRemoved();
    setInterval(onChildAdded, 60 * 1000);
});