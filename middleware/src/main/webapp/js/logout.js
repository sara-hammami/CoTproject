// logout.js

async function logout() {
    console.log('Logout function is called');
    //  clearing all session-related data
    const deleted1 = await secureStorage.deleteSecureData("accessToken");
    const deleted2 = await secureStorage.deleteSecureData("refreshToken");
    localStorage.removeItem("signInId");
    localStorage.removeItem("mail");

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
