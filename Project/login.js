document.addEventListener('DOMContentLoaded', function () {
     
    const loginButton = document.querySelector('button');
    
    loginButton.addEventListener('click', function () {
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        
        loginUser(username, password);
    });
});


function loginUser(username, password){
    fetch('/Project/DataStore/users.json')
    .then(response => response.json())
    .then(users =>{
        const user =users.find(user => user.username === username && user.password === password);

        if(user){
            redirectUser(user);
        }else{
            alert('Invalid username or password!');
        }
    })
    .catch(error => {
        console.error('Error loading users:', error);
        alert('An error occurred while processing your request.');
    });

}
function redirectUser(user) {
    
    if (user.role === 'admin') {
        window.location.href = '/admin-page.html';  
    } else if (user.role === 'student') {
        window.location.href = '/main.html';  
    } else if (user.role === 'instructor') {
        window.location.href = '/instructor-page.html';  
    }
}
