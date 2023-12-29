document.addEventListener('DOMContentLoaded', function() {
    // Simulate asynchronous data fetching
    setTimeout(function() {
        // Replace 'Loading...' with actual data
        document.getElementById('username').innerText = 'John Doe'; // Replace with actual name
        document.getElementById('useremail').innerText = 'john.doe@example.com'; // Replace with actual email
    }, 1000); // Simulate a 1-second delay for data fetching
});
