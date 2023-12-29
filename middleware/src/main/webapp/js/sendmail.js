async function sendMail(email) {
    const url = `https://smarwastemanagement.ltn:8443/api/mail/${email}`;

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

        const responseData = await response.json();
        console.log('Mail sent:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error sending mail:', error.message);
        throw error;
    }
}

// Example usage:

// Assuming you have an HTML input field for email and a button with the ID 'Sendcode'
const emailInput = document.getElementById('email');

// Send mail when the user clicks the button
document.getElementById('Sendcode').addEventListener('click', async () => {
    const email = emailInput.value.trim();
    try {
        await sendMail(email);
        // Display success message or perform other actions
    } catch (error) {
        // Display error message or handle the error
        console.error('Error:', error.message);
    }
});
