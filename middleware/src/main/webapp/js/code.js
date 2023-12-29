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

// Function to send a verification code to the server
async function verifCode(code) {
    const url = `https://smarwastemanagement.ltn:8443/api/mail/${code}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'manual', // Equivalent to followRedirects: false
        });

        const responseData = await response.json();

        if (response.ok) {
            const data = responseData.toString();
            const data1 = data.substring(30, 66);
            return data1;
        } else {
            throw new Error('Request failed with status ' + response.status);
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Function to request a new verification code from the server
async function resendCodeRequest() {
    const url = 'https://smarwastemanagement.ltn:8443/api/mail'; // Replace with your actual endpoint

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

// Function to verify the entered code
function verifyCode() {
    // Get the code input value
    const codeInput = document.getElementById('codeInput');
    const code = codeInput.value.trim();

    // Perform code verification logic
    verifCode(code)
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
document.addEventListener('DOMContentLoaded', function () {
    const verifyButton = document.getElementById('verifyButton');
    if (verifyButton) {
        verifyButton.addEventListener('click', verifyCode);
    }

    const resendButton = document.getElementById('resendButton');
    if (resendButton) {
        resendButton.addEventListener('click', resendCode);
    }
});
