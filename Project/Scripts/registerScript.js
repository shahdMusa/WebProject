document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.querySelector("#searchBtn");
    const courseNameInput = document.querySelector("#courseName");
    const idInput = document.querySelector("#idNum");
    const tableContainer = document.querySelector("#tableContainer");
    const pendingCourses = document.querySelector("#pendingCourses");
    const logoutBtn = document.querySelector('#logout button');

    let coursesGlobal = [];
    let studentsGlobal = [];

    async function loadData() {
        const savedCourses = localStorage.getItem("courses");
        const savedStudents = localStorage.getItem("students");
        if (!savedCourses.length === 0) {
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

        if (!savedStudents.length === 0) {
            studentsGlobal = JSON.parse(savedStudents);
        } else {
            try {
                const res2 = await fetch('/Project/DataStore/students.json');
                if (!res2.ok) { throw new Error("Failed to fetch students.json") };
                studentsGlobal = await res2.json();
                saveData();
            } catch (err) {
                console.error("Error loading course data:", err);
            }
        }
    }

    function saveData() {
        localStorage.setItem("courses", JSON.stringify(coursesGlobal));
        localStorage.setItem("students", JSON.stringify(studentsGlobal));
    }

    loadData();

    function loggedStudent() {
        for (let s of studentsGlobal) {
            if (s.loggedIn) {
                return s;
            }
        }
    }

    // Register Course Function
    function registerCourse(courseId, CRN) {
        /* In the first place this page won't be shown to the student who are not logged in. 
         Therefore they are already logged in. */
        //the CRN represents the class of the desired instructor
        const student = loggedStudent();
        let course = null;
        let desiredClass = null;

        for (let c of coursesGlobal) {
            for (let i of c.coursesList) {
                for (let classC of i.classes) {
                    if (CRN === classC.CRN) {
                        desiredClass = classC;
                        course = i;
                        break;
                    }
                }
                if (desiredClass) break;
            }
            if (desiredClass) break;
        }

        if (!desiredClass) {
            alert("Something went wrong. Could not find the course/class.");
            return null;
        }

        // Check if student has passed all prerequisites
        let prereqs = [];
        let passed = true;

        for (let subjectt of coursesGlobal) {
            for (let c of subjectt.coursesList) {
                if (courseId === c.id) {
                    course = c;
                    course.prerequisites.forEach((p) => {
                        prereqs.push(p);
                    });
                    break;
                }
            }
        }

        for (let i = 0; i < prereqs.length; i++) {
            if (prereqs.length > 0) {
                passed = prereqs.every(p =>
                    student.completedCourses.some(c => c.course === p)
                );
            }
        }

        if (passed === false) {
            alert("You must complete all prerequisite courses to register.");
            return null;
        }

        //check if the course is open or not
        if (!course || course.status !== "open") {
            alert("Course is not available.");
            return null;
        }

        // Check if the class has available places
        const enrolledStudentsNum = desiredClass.enrolledStudents.length;
        if (enrolledStudentsNum >= desiredClass.capacity) {
            alert("Class is full.");
            return null;
        }

        // Prevent if already completed
        if (student.completedCourses.some(c => c.course === courseId)) {
            alert("You have already completed this course.");
            return null;
        }

        // Prevent if already pending
        if (student.pendingCourses.includes(courseId)) {
            alert("You have already registered for this course (pending approval).");
            return null;
        }

        // Register student in the class (pending approval)
        desiredClass.pendingApproval.push(student.username);
        student.pendingCourses.push(courseId);

        saveData();

        alert(`Registered for ${course.name} (Pending approval).`);
        return desiredClass;
    }

    // Function to search and display courses based on course name and CRN
    function searchCourses(courseName, courseId) {
        let wantedCourses = [];

        for (let i of coursesGlobal) {
            if (courseName === '' || i.subject.toLowerCase().includes(courseName.toLowerCase())) {
                for (let c of i.coursesList) {
                    if (courseId === '' || c.id.toLowerCase().includes(courseId.toLowerCase())) {
                        wantedCourses.push(c);
                    }
                }
            }
        }

        if (wantedCourses.length === 0) {
            tableContainer.innerHTML = `<p>No courses found matching your search criteria.</p>`;
        } else {
            displayCourses(wantedCourses);
        }
    }


    // Display Courses
    function displayCourses(courseList) {
        tableContainer.innerHTML = `
        <table>
            <thead>
            <tr>
                <th>Course CRN</th>
                <th>Title</th>
                <th>Instructor</th>
                <th>Time</th>
                <th>Capacity</th>
                <th></th>
            </tr>
            </thead>
            <tbody> </tbody>
            </table >
                `;

        const tableBody = document.querySelector("#tableContainer tbody");
        for (let i of courseList) {
            for (let c of i.classes) {
                const rowAdd = ` <tr data-course-id="${i.id}">
                <td>${c.CRN}</td>
                <td>${i.name}</td>
                <td>${c.instructor}</td>
                <td>${c.schedule}</td>
                <td>${c.capacity}</td>
                <td><button id="registerBtn" class="registerBtn">Register</button></td>
                </tr>
            </tbody>
        </table>
        `;
                tableBody.innerHTML += rowAdd;
            }
        }
        addRegisterEventListeners();
    }

    // Add Register Button Event Listeners
    function addRegisterEventListeners() {
        const pendContainer = document.querySelector("#register-container");
        pendContainer.style.display = "block";

        const registerBtns = document.querySelectorAll("#registerBtn");
        registerBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                const row = this.closest("tr");
                const courseId = row.dataset.courseId;
                const cells = row.querySelectorAll("td");

                const CRN = cells[0].textContent.trim();
                const name = cells[1].textContent.trim();
                const instructor = cells[2].textContent.trim();
                const schedule = cells[3].textContent.trim();
                const capacity = cells[4].textContent.trim();

                const wantedCourse = registerCourse(courseId, CRN);
                if (wantedCourse !== null) {
                    addPendingCourseTable(courseId, CRN, name, instructor, schedule, capacity);
                }
            });
        });
    }

    function addPendingCourseTable(courseId, CRN, name, instructor, schedule, capacity) {
        // Check if the course is already in the pending table
        const isAlreadyRegistered = Array.from(document.querySelectorAll("#pendingCourses tbody tr"))
            .some(tr => tr.cells[0].innerText === CRN);

        if (isAlreadyRegistered) {
            alert("You have already registered for this course.");
            return;
        }

        // Add the course to the pendingCourses table
        const rowPend = `
                <tr data-course-id="${courseId}">
                    <td>${CRN}</td>
                    <td>${name}</td>
                    <td>${instructor}</td>
                    <td>${schedule}</td>
                    <td>${capacity}</td>
                    <td><button id="removeBtn" class="removeBtn">Remove</button></td>
                </tr>
        `;
        const pendingTable = document.querySelector("#pendingCourses tbody");
        pendingTable.innerHTML += rowPend;
        addRemoveEventListeners();

    }

    function addRemoveEventListeners() {
        const removeBtns = document.querySelectorAll("#removeBtn");
        removeBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                const row = this.closest("tr");
                const CRN = row.cells[0].innerText.trim();
                const courseId = row.dataset.courseId;
                const student = loggedStudent();

                for (let subject of coursesGlobal) {
                    for (let course of subject.coursesList) {
                        for (let classC of course.classes) {
                            if (classC.CRN === CRN) {
                                classC.pendingApproval = classC.pendingApproval.filter(username => username !== student.username);
                                break;
                            }
                        }
                    }
                }

                student.pendingCourses = student.pendingCourses.filter(id => id !== courseId);
                row.remove();
                saveData();
            });
        });
    }

    // Search Button Click Handler
    searchBtn.addEventListener("click", () => {
        const courseName = courseNameInput.value.trim();
        const idn = idInput.value.trim();
        searchCourses(courseName, idn);
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



