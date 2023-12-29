let sidebarOpen = false;

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    if (sidebarOpen) {
        sidebar.style.width = '0';
        content.style.marginLeft = '0';
    } else {
        sidebar.style.width = '250px';
        content.style.marginLeft = '250px';
    }

    sidebarOpen = !sidebarOpen;
}

// Add this function to close the sidebar when an item is clicked
function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    sidebar.style.width = '0';
    content.style.marginLeft = '0';

    sidebarOpen = false;
}
function continueToLogin() {
    window.location.href = '/pages/login.html'; // Navigate to the login page
}
