// js/splashscreen.js

document.addEventListener("DOMContentLoaded", function () {
    navigateToWelcome();
});

function navigateToWelcome() {
    // Implement logic to navigate to the welcome page after a delay
    setTimeout(function () {
        window.location.replace("welcome.html");
    }, 500);
}
