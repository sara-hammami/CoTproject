// code.js

// Function to display a toast message
// code.js

// Function to send a verification code to the server
async function verifyCodeRequest(code) {
    const url = 'https://smarwastemanagement.ltn:8080/mail/' + code; // Replace with your actual endpoint

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData.status; // Adjust based on your server response structure
    } catch (error) {
        console.error('Error during code verification request: ', error);
        throw error; // Propagate the error
    }
}

// Function to request a new verification code from the server
async function resendCodeRequest() {
    const url = 'https://smarwastemanagement.ltn:8080/mail'; // Replace with your actual endpoint

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        // Log or handle the response data if needed
        console.log('Resend code response: ', responseData);

        // Return success or any relevant data
        return responseData;
    } catch (error) {
        console.error('Error during code resend request: ', error);
        throw error; // Propagate the error
    }
}

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

// Function to verify the entered code
function verifyCode() {
    // Get the code input value
    const codeInput = document.getElementById('codeInput');
    const code = codeInput.value.trim();

    // Perform code verification logic
    verifyCodeRequest(code)
        .then((response) => {
            // Check if the code is valid
            if (response === 'Correct verification code!') {
                // Navigate to the new password page
                window.location.href = 'newpassword';
            } else {
                // Display an error toast for invalid code
                showToast('Invalid code');
            }
        })
        .catch((error) => {
            // Display an error toast
            showToast('Failed to verify code. Please try again.');
            console.error('Error during code verification: ', error);
        });
}

// Function to resend the verification code
function resendCode() {
    // Perform code resend logic
    resendCodeRequest()
        .then(() => {
            // Display a success toast
            showToast('Code resent successfully');
        })
        .catch((error) => {
            // Display an error toast
            showToast('Failed to resend code. Please try again.');
            console.error('Error during code resend: ', error);
        });
}

// Attach the verifyCode function to the button click event
document.getElementById('verifyButton').addEventListener('click', verifyCode);

// Attach the resendCode function to the button click event
document.getElementById('resendButton').addEventListener('click', resendCode);