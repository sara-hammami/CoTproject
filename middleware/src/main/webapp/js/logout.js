// logout.js

async function logout() {
    // Your logout logic here
    // For example, clearing secure data
    const deleted1 = await secureStorage.deleteSecureData("accessToken");
    const deleted2 = await secureStorage.deleteSecureData("refreshToken");

    // Redirect to the login page
    window.location.href = 'login.html';
}

// Attach the logout function to the logout link click event
document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', logout);
    }
});
