// Function to change the password
async function changePassword(code, password) {
    const url = `https://smarwastemanagement.ltn:8443/api/mail/${code}/${password}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (response.ok) {
            // Password changed successfully, redirect to the login page
            console.log('Response:', responseData);
            window.location.href = 'login.html'; // Replace with the actual login page URL
        } else {
            // Handle password change failure
            console.error('Request failed with status ' + response.status);
            // Optionally, you can display an error message or handle the failure in another way
        }
    } catch (error) {
        // Handle fetch error
        console.error('Error during password change:', error.message);
        // Optionally, you can display an error message or handle the error in another way
    }
}

// Add event listener to the "Update" button
document.getElementById('update').addEventListener('click', async function() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const verificationCode = document.getElementById('codeInput').value;

    // Check if passwords match
    if (password === confirmPassword) {
        // Call the changePassword function
        await changePassword(verificationCode, password);
    } else {
        console.error('Passwords do not match');
        // Handle password mismatch, e.g., display an error message
    }
});
