// sendmail.js

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
    return emailRegex.test(email.trim());
}

// Function to display a toast message
function showToast(message) {
    // Create a toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Append the toast to the body
    document.body.appendChild(toast);

    // Remove the toast after a certain duration
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000); // Adjust the duration as needed
}

// Function to send mail
function sendCode() {
    // Get the email input value
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();

    // Validate the email format
    if (!isValidEmail(email)) {
        showToast('Please Enter a valid email');
        return;
    }

    // Perform the mail sending logic
    sendMail(email)
        .then(() => {
            // Navigate to the code page
            window.location.href = '/pages</code.html';
        })
        .catch((error) => {
            // Display an error toast
            showToast('Failed to send code. Please try again.');
            console.error('Error during mail sending: ', error);
        });
}

// Attach the sendCode function to the button click event
document.getElementById('sendCodeButton').addEventListener('click', sendCode);
