document.addEventListener("DOMContentLoaded", async () => {
    const searchBtn = document.querySelector("#searchBtn");
    const courseNameInput = document.querySelector("#courseName");
    const idInput = document.querySelector("#idNum");
    const tableContainer = document.querySelector("#tableContainer");
    const registeredCourses = document.querySelector("#registeredCourses");
    const pathSelect = document.querySelector("#path");
    const pathTableContainer = document.querySelector("#path-table-container");
    const logoutBtn = document.querySelector('#logout button');

    let coursesGlobal = [];
    let studentsGlobal = [];

    await loadData();

    async function loadData() {
        const savedCourses = localStorage.getItem("courses");
        const savedStudents = localStorage.getItem("students");
    
        if (savedCourses && savedCourses.length > 0) {
            coursesGlobal = JSON.parse(savedCourses);
        } else {
            try {
                const res = await fetch('/Project/DataStore/courses.json');
                if (!res.ok) { throw new Error("Failed to fetch courses.json") };
                coursesGlobal = await res.json();
                saveData();
            } catch (err) {
                console.error("Error loading course data:", err);
            }
        }
    
        if (savedStudents && savedStudents.length > 0) {
            studentsGlobal = JSON.parse(savedStudents);
            console.log("Loaded students:", studentsGlobal);  // Log the students data
        } else {
            try {
                const res2 = await fetch('/Project/DataStore/students.json');
                if (!res2.ok) { throw new Error("Failed to fetch students.json") };
                studentsGlobal = await res2.json();
                saveData();
                console.log("Loaded students:", studentsGlobal);  // Log the students data
            } catch (err) {
                console.error("Error loading student data:", err);
            }
        }
    }
    
    function saveData() {
        localStorage.setItem("courses", JSON.stringify(coursesGlobal));
        localStorage.setItem("students", JSON.stringify(studentsGlobal));
    }


    function loggedStudent() {
        for (let s of studentsGlobal) {
            if (s.loggedIn) {
                return s;
            }
        }
    }


    // function updateTable(learningPath) {
    //     const student = loggedStudent();
    //     let courses = [];

    //     if (learningPath === "completed") {
    //         wantedPath = "completedCourses";
    //         courses = student.completedCourses;
    //         courses = courses.filter(course => course.grade !== "F");
    //         if (courses.length > 0) {
    //             displayCoursesWithGrade(courses);
    //         }

    //         return;
    //     }
    //     if (learningPath === "in-progress") {
    //         wantedPath = "registeredCourses";
    //         courses = student.registeredCourses;
    //     }
    //     if (learningPath === "pending") {
    //         wantedPath = "pendingCourses";
    //         courses = student.pendingCourses;
    //     }

    //     displayCourses(courses);

    // }

    function updateTable(learningPath) {
        const student = loggedStudent();
    
        if (!student) {
            console.error("No logged-in student found.");
            pathTableContainer.innerHTML = `<p>Error: No logged-in student found.</p>`;
            return;
        }
    
        let courses = [];
        let wantedPath;
    
        if (learningPath === "completed") {
            wantedPath = "completedCourses";
            courses = student.completedCourses || [];  
            courses = courses.filter(course => course.grade !== "F");
            if (courses.length > 0) {
                displayCoursesWithGrade(courses);
            }
            return;
        }
        if (learningPath === "in-progress") {
            wantedPath = "registeredCourses";
            courses = student.registeredCourses;
        }
        if (learningPath === "pending") {
            wantedPath = "pendingCourses";
            courses = student.pendingCourses;
        }
    
        displayCourses(courses);
    }
    

    // Display Courses with grades
    function displayCoursesWithGrade(courseList) {
        let courses = [];
    
        if (courseList.length === 0) {
            pathTableContainer.innerHTML = `<p>No courses found.</p>`;
            return;
        }
    
        for (let c of courseList) {
            for (let g of coursesGlobal) {
                for (let global of g.coursesList) {
                    if (c.course === global.id) {
                        courses.push({
                            id: global.id,
                            name: global.name,
                            grade: c.grade
                        });
                    }
                }
            }
        }
    
        let tableHTML = `
        <table>
            <thead>
            <tr>
                <th>Course ID</th>
                <th>Title</th>
                <th>Grade</th>
            </tr>
            </thead>
            <tbody>
        `;
    
        for (let i of courses) {
            tableHTML += `
            <tr data-course-id="${i.id}">
                <td>${i.id}</td>
                <td>${i.name}</td>
                <td>${i.grade}</td>
            </tr>
            `;
        }
    
        tableHTML += `</tbody></table>`;
        pathTableContainer.innerHTML = tableHTML;
    }

    // Display Courses 
    function displayCourses(courseList) {
        let courses = [];
        if (courseList.length === 0) {
            pathTableContainer.innerHTML = `<p>No courses found.</p>`;
        }
        for (let c of courseList) {
            for (let g of coursesGlobal) {
                for (let global of g.coursesList) {
                    if (c === global.id) {
                        courses.push(global);
                    }
                }
            }
        }

        for (let i of courses) {
            for (let cou of i.classes) {
                pathTableContainer.innerHTML = `
    <table>
        <thead>
        <tr>
            <th>Course CRN</th>
            <th>Title</th>
            <th>Instructor</th>
            <th>Time</th>
            <th>Capacity</th>
        </tr>
        </thead>
        <tbody>
            <tr data-course-id="${i.id}">
            <td>${cou.CRN}</td>
            <td>${i.name}</td>
            <td>${cou.instructor}</td>
            <td>${cou.schedule}</td>
            <td>${cou.capacity}</td>
            </tr>
        </tbody>
    </table>
    `;
            }
        }
    }


    pathSelect.addEventListener("change", function () {
        const learningPath = this.value;
        updateTable(learningPath);
    });

    logoutBtn.addEventListener('click', handleLogout);

    function handleLogout() {
        changeLoggedin();
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
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


});