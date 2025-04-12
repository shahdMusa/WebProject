document.addEventListener("DOMContentLoaded", async () => {
  const table = document.querySelector("#table table");
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save Status Changes";
  saveBtn.id = "save-status-btn";

  const courseForm = document.querySelector("#course-form");
  const searchInput = document.getElementById("courseSearch");
  const searchBtn = document.getElementById("searchBtn");
  const logoutBtn = document.querySelector('#logout button');
  logoutBtn.addEventListener('click', handleLogout);

  let coursesGlobal = [];
  let studentsGlobal = [];
  await loadData();

  function handleLogout() {
    changeLoggedin();
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
  }
  
  renderTable();

  async function loadData() {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses && savedCourses.length > 0) {
      coursesGlobal = JSON.parse(savedCourses);
    } else {
      try {
        const res = await fetch('/Project/DataStore/courses.json');
        if (!res.ok) throw new Error("Failed to fetch courses.json");
        coursesGlobal = await res.json();
        localStorage.setItem("courses", JSON.stringify(coursesGlobal));
      } catch (err) {
        console.error("Error loading course data:", err);
      }
    }
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
    localStorage.setItem("courses", JSON.stringify(coursesGlobal));
  }

  function renderTable() {
    table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

    coursesGlobal.forEach(dept => {
      dept.coursesList.forEach(course => {
        course.classes.forEach(cls => {
          const row = document.createElement("tr");

          const statusCell = document.createElement("td");
          const statusSelect = document.createElement("select");

          ["open", "pending", "delete"].forEach(status => {
            const opt = document.createElement("option");
            opt.value = status;
            opt.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            if (status === course.status) opt.selected = true;
            statusSelect.appendChild(opt);
          });
          statusCell.appendChild(statusSelect);

          row.innerHTML = `
            <td>${course.id.toUpperCase()}</td>
            <td>${course.name}</td>
            <td>${cls.instructor}</td>
            <!-- status cell will be inserted -->
            <td>${cls.schedule}</td>
            <td>${cls.enrolledStudents?.length || 0}</td>
          `;

          row.insertBefore(statusCell, row.children[3]);
          row.dataset.courseId = course.id;
          row.dataset.instructor = cls.instructor;
          table.appendChild(row);
        });
      });
    });

    if (!document.querySelector("#save-status-btn")) {
      table.parentElement.appendChild(saveBtn);
    }
  }

  saveBtn.addEventListener("click", () => {
    const rows = table.querySelectorAll("tr:not(:first-child)");

    rows.forEach(row => {
      const courseId = row.dataset.courseId;
      const instructor = row.dataset.instructor;
      const selectedStatus = row.querySelector("select").value;

      coursesGlobal.forEach(dept => {
        const courseIndex = dept.coursesList.findIndex(c => c.id === courseId);
        const course = dept.coursesList[courseIndex];
        if (course) {
          if (selectedStatus === "delete") {
            course.classes = course.classes.filter(cls => cls.instructor !== instructor);
            if (course.classes.length === 0) {
              dept.coursesList.splice(courseIndex, 1);
            }
          } else {
            course.status = selectedStatus;
          }
        }
      });
    });

    saveData();
    alert("Changes saved!");
    location.reload();
  });

  courseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newCourse = {
      id: document.querySelector("#courseNo").value,
      name: document.querySelector("#courseName").value,
      status: document.querySelector("#status").value,
      prerequisites: [],
      description: "",
      classes: [{
        instructor: document.querySelector("#instructor").value,
        schedule: document.querySelector("#timeDay").value,
        capacity: 50,
        enrolledStudents: new Array(Number(document.querySelector("#registeredCount").value)).fill({ id: "s1" }) // dummy data
      }]
    };

    // Push to first department (or update logic as needed)
    if (coursesGlobal.length > 0) {
      coursesGlobal[0].coursesList.push(newCourse);
    } else {
      coursesGlobal.push({
        department: "Default",
        coursesList: [newCourse]
      });
    }

    saveData();
    alert("Course added successfully!");
    location.reload();
  });

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    const rows = document.querySelectorAll("#table table tr:not(:first-child)");

    rows.forEach(row => {
      const courseNo = row.cells[0].textContent.trim().toLowerCase();

      if (courseNo === query) {
        Array.from(row.cells).forEach(cell => {
          cell.classList.add("high");
        });
      } else {
        Array.from(row.cells).forEach(cell => {
          cell.classList.remove("high");
        });
      }
    });
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});
