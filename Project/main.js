document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('#logout button');

    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser'); 
        window.location.href = 'login.html'; 
    });

});
