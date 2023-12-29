// Function to change the password
function changePassword(code, password) {
    const url = `https://api.smartgarbagecot.me/api/mail/${code}/${password}`;

    // Define request options
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Make the POST request using Fetch API
    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Response:', responseData);
            // Handle success, e.g., display a success message
        })
        .catch(error => {
            console.error('Error:', error.message);
            // Handle error, e.g., display an error message
        });
}

// Add event listener to the "Update" button
document.getElementById('update').addEventListener('click', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password === confirmPassword) {
        const verificationCode = 'your_verification_code_here'; // Replace with the actual verification code
        changePassword(verificationCode, password);
    } else {
        console.error('Passwords do not match');
        // Handle password mismatch, e.g., display an error message
    }
});
