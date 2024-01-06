$(document).ready(function () {
    var accesstoken = localStorage.getItem("accesstoken");
    var mail = localStorage.getItem("mail");
    var Authorizationheader = "Bearer " + accesstoken;

    $.ajax({
        url: 'https://smarwastemanagement.ltn:8443/api/profile/' + mail,
        type: 'GET',  // Remove the extra identifier 'headers' here
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': Authorizationheader
        },
        success: function (data) {
            console.log('Load was performed.');
            console.log(data);

            // Update HTML content
            document.getElementById("username").innerText = data.fullname || "Unknown";
            document.getElementById("useremail").innerText = mail || "Unknown";
        }
    });

});
