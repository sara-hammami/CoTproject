// sendMail.js

async function sendMail(email) {
    const url = `https://smartwastemanagement.me/api/mail/${email}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to send mail');
        }

        // Assuming the response is not JSON, no need to parse it
        console.log('Mail sent successfully!');

        // Redirect to code.html after successful mail send
        window.location.href = 'code.html';
    } catch (error) {
        console.error('Error sending mail:', error.message);
        throw error;
    }
}

// Assuming you have an HTML input field for email and a button with the ID 'Sendcode'
const emailInput = document.getElementById('email');

// Send mail when the user clicks the button
document.getElementById('Sendcode').addEventListener('click', async () => {
    const email = emailInput.value.trim();
    try {
        await sendMail(email);
        // Display success message or perform other actions
        console.log('Verification code sent successfully!');
    } catch (error) {
        // Display error message or handle the error
        console.error('Error:', error.message);
    }
});
