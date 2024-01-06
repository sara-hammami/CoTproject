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

        if (response.ok) {
            const responseData = await response.json();
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

// Attach the verifyCode function to the button click event
document.addEventListener('DOMContentLoaded', function () {
    const verifyButton = document.getElementById('verifyButton');
    if (verifyButton) {
        verifyButton.addEventListener('click', verifyCode);
    }

    // Assuming you have an HTML input field for email and a button with the ID 'Sendcode'

});