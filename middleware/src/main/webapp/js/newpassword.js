function updatePassword() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    if (password.trim() === '' || confirmPassword.trim() === '') {
        alert('Please enter both password and confirmation');
        return;
    }

    if (password.length < 8 || password !== confirmPassword) {
        alert('Invalid password or password confirmation');
        return;
    }

    // Call the function to update the password
    // For now, simulate navigation to the success page
    window.location.href = 'changepasswordsuccess';
}
