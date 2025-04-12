document.addEventListener("DOMContentLoaded", async () => {
  const table = document.querySelector("#table table");
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save Status Changes";
  saveBtn.id = "save-status-btn";

  const courseForm = document.querySelector("#course-form");
  const searchInput = document.getElementById("courseSearch");
  const searchBtn = document.getElementById("searchBtn");

  let courseData = await fetch("courses.json").then(res => res.json());

  function renderTable() {
    table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

    courseData.forEach(dept => {
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

  saveBtn.addEventListener("click", async () => {
    const rows = table.querySelectorAll("tr:not(:first-child)");

    rows.forEach(row => {
      const courseId = row.dataset.courseId;
      const instructor = row.dataset.instructor;
      const selectedStatus = row.querySelector("select").value;

      courseData.forEach(dept => {
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

    const res = await fetch("/update-validation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData)
    });

    const result = await res.json();
    if (result.success) {
      alert("Changes saved!");
      location.reload();
    } else {
      alert("Failed to save updates.");
    }
  });

  courseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newCourse = {
      courseNo: document.querySelector("#courseNo").value,
      courseName: document.querySelector("#courseName").value,
      instructor: document.querySelector("#instructor").value,
      status: document.querySelector("#status").value,
      timeDay: document.querySelector("#timeDay").value,
      registeredCount: document.querySelector("#registeredCount").value
    };

    const res = await fetch("/add-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse)
    });

    const result = await res.json();
    if (result.success) {
      alert("Course added successfully!");
      location.reload();
    } else {
      alert("Failed to add course.");
    }
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

  renderTable();
});
