$(document).ready(function() {
    // Check if the user has previously accepted the cookie policy
    if (localStorage.getItem("cookieAccepted") === "true") {
        $("#cookieBanner").hide(); // Hide the banner if accepted
    } else {
        $("#cookieBanner").show(); // Show the banner if not accepted
    }

    // Handle the "Accept" button click
    $("#acceptCookies").click(function() {
        localStorage.setItem("cookieAccepted", "true");
        $("#cookieBanner").hide();
    });

    // Handle the "Decline" button click
    $("#declineCookies").click(function() {
        // You can customize this part to handle cookie rejection as needed
        alert("Cookies declined. Some features may not work properly.");
        $("#cookieBanner").hide();
    });
});