document.addEventListener('DOMContentLoaded', async () => {
    let studentsGlobal = [];
    await loadData(); 

    const loginButton = document.querySelector('button');
    loginButton.addEventListener('click', handleLoginClick);

    function handleLoginClick() {
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        loginUser(username, password);
    }

    async function loadData() {
        const savedStudents = localStorage.getItem("students");
        if (savedStudents && savedStudents.length !== 0) {
            studentsGlobal = JSON.parse(savedStudents);
        } else {
            try {
                const res2 = await fetch('/Project/DataStore/students.json');
                if (!res2.ok) throw new Error("Failed to fetch students.json");
                studentsGlobal = await res2.json();
                saveData();
            } catch (err) {
                console.error("Error loading student data:", err);
            }
        }
    }

    function changeLoggedin(student) {
        for (let s of studentsGlobal) {
            if (s.username === student.username) {
                s.loggedIn = true;
            }
        }
        saveData();
    }

    function saveData() {
        localStorage.setItem("students", JSON.stringify(studentsGlobal));
    }

    function loginUser(username, password) {
        fetch('/Project/DataStore/users.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.username === username && user.password === password);
                if (user) {
                    localStorage.setItem('loggedInUser', JSON.stringify(user));
                    if (user.role === "student") {
                        changeLoggedin(user);
                    }
                    redirectUser(user);
                } else {
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
            window.location.href = 'admin-page.html';
        } else if (user.role === 'student') {
            window.location.href = 'main.html';
        } else if (user.role === 'instructor') {
            window.location.href = 'instructor-page.html';
        }
    }
});
