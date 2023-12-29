// login.js

async function performLogin() {
    const emailInput = document.getElementById('emailInput').value;
    const passwordInput = document.getElementById('passwordInput').value;

    // Validation logic (similar to Flutter validation)
    if (!emailInput.trim()) {
        showToast('Please Enter your email');
        return;
    }

    // Add more validation if needed...

    try {
        // Perform the login using asynchronous functions
        const signInId = await requestLoginId();
        const authCode = await requestAuthCode(emailInput, passwordInput, signInId);
        const token = await requestToken(authCode);

        // Store tokens (you may want to implement a secure storage mechanism)
        localStorage.setItem('accessToken', token.accessToken);
        localStorage.setItem('refreshToken', token.refreshToken);

        // Navigate to the home page or perform other actions
        console.log('Successfully logged in');
    } catch (error) {
        showToast('Invalid Login');
        console.error(error);
    }
}

async function requestLoginId() {
    const response = await fetch('http://smarwastemanagement.ltn:8080/api/authorize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Pre-Authorization': 'Bearer YOUR_ENCODED_STRING', // Replace with your encoded string
        },
    });

    const data = await response.json();
    return data.signInId;
}

async function requestAuthCode(email, password, signInId) {
    const response = await fetch('http://smarwastemanagement.ltn:8080/api/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mail: email,
            password: password,
            signInId: signInId,
        }),
    });

    const data = await response.json();
    return data.authCode;
}

async function requestToken(authCode) {
    const response = await fetch('http://smarwastemanagement.ltn:8080/api/oauth/token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Post-Authorization': 'Bearer YOUR_ENCODED_STRING', // Replace with your encoded string
        },
    });

    return await response.json();
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

