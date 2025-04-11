document.addEventListener('DOMContentLoaded', initializeMainPage);

function initializeMainPage() {
    const logoutBtn = document.querySelector('#logout button');
    logoutBtn.addEventListener('click', handleLogout);
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}
