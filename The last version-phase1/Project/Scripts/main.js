document.addEventListener('DOMContentLoaded', async () => {
    let studentsGlobal = [];
    await loadData(); 

    const logoutBtn = document.querySelector('#logout button');
    logoutBtn.addEventListener('click', handleLogout);

    function handleLogout() {
        changeLoggedin(); 
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
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

    function changeLoggedin() {
        const student = loggedStudent();
        if (!student) return;

        for (let s of studentsGlobal) {
            if (s.username === student.username) {
                s.loggedIn = false;
            }
        }
        saveData();
    }

    function loggedStudent() {
        return studentsGlobal.find(s => s.loggedIn);
    }

    function saveData() {
        localStorage.setItem("students", JSON.stringify(studentsGlobal));
    }
});
