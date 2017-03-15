$(function() {

    function addEmployeeToHTML(name, destination, time, frequency) {
        var trow = $("<tr>");
        var tcolName = $("<td>").text(name);
        var tcolDest = $("<td>").text(destination);
        var tcolTime = $("<td>").text(time);
        var tcolFreq = $("<td>").text(frequency);
        var tcolMinAway = $("<td>").text(frequency);

        trow.append(tcolName).append(tcolDest).append(tcolTime).append(tcolFreq).append(tcolMinAway);
        $(".train-data").append(trow);
    }

    $("#submitBtn").on("click", function(event) {
        event.preventDefault();
        var name = $("#trainName").val().trim();
        var destination = $("#trainDestination").val().trim();
        var time = $("#trainTime").val().trim();
        var freq = $("#trainFreq").val();
        addEmployeeToHTML(name, destination, time, freq);
        $("[id^=train]").val("");
    });

});