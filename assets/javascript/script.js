$(function() {
    $("#submitBtn").on("click", function(event) {
        event.preventDefault();
        console.log($("#trainName").val());
        console.log($("#trainDestination").val());
        console.log($("#trainTime").val());
        console.log($("#trainFreq").val());
    });
});