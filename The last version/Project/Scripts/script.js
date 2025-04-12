document.addEventListener("DOMContentLoaded", async () => {
  let currentInstructor = "";
  let loggedInUser = {};
  let studentMap = {};

  const classSelect = document.getElementById("classSelect");
  const gradesTable = document.querySelector(".grades-table table");
  const submitBtn = document.querySelector(".submit-btn");

  let coursesGlobal = [];
  let studentsGlobal = [];

  await loadData();

  // Save data back to localStorage
  function saveData() {
    localStorage.setItem("courses", JSON.stringify(coursesGlobal));
    localStorage.setItem("students", JSON.stringify(studentsGlobal));
  }

  // Load courses and students from localStorage or fetch from server
  async function loadData() {
    const savedCourses = localStorage.getItem("courses");
    const savedStudents = localStorage.getItem("students");

    const loggedInInstructor = localStorage.getItem("loggedInUser");
    if (loggedInInstructor && loggedInInstructor.length > 0) {
      loggedInUser = JSON.parse(loggedInInstructor);
      currentInstructor = loggedInUser.fullName;
    }

    if (savedCourses && savedCourses.length > 0) {
      coursesGlobal = JSON.parse(savedCourses);
    } else {
      try {
        const res = await fetch("/Project/DataStore/courses.json");
        if (!res.ok) throw new Error("Failed to fetch courses.json");
        coursesGlobal = await res.json();
        localStorage.setItem("courses", JSON.stringify(coursesGlobal));
      } catch (err) {
        console.error("Error loading course data:", err);
      }
    }

    if (savedStudents && savedStudents.length > 0) {
      studentsGlobal = JSON.parse(savedStudents);
    } else {
      try {
        const res2 = await fetch("/Project/DataStore/students.json");
        if (!res2.ok) throw new Error("Failed to fetch students.json");
        studentsGlobal = await res2.json();
        localStorage.setItem("students", JSON.stringify(studentsGlobal));
      } catch (err) {
        console.error("Error loading student data:", err);
      }
    }

    buildStudentMap();
    populateInstructorCourses();
  }

  // Build the student map using for...of loop
  function buildStudentMap() {
    studentMap = {};
    for (const student of studentsGlobal) {
      studentMap[String(student.username)] = student.name;
    }
  }

  // Populate dropdown with classes for this instructor
  function populateInstructorCourses() {
    if (!currentInstructor || !Array.isArray(loggedInUser.courses)) return;

    const instructorCourseIds = loggedInUser.courses;
    const instructorCourses = [];

    coursesGlobal.forEach(dept => {
      dept.coursesList.forEach(course => {
        if (instructorCourseIds.includes(course.id)) {
          course.classes.forEach(cls => {
            instructorCourses.push({
              id: course.id,
              CRN: cls.CRN,
              enrolledStudents: cls.enrolledStudents
            });
          });
        }
      });
    });

    if (instructorCourses.length > 0) {
      instructorCourses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.CRN;
        option.textContent = `${course.id} - CRN: ${course.CRN}`;
        classSelect.appendChild(option);
      });

      classSelect.value = instructorCourses[0].CRN;
      renderStudents(classSelect.value);
    } else {
      const opt = document.createElement("option");
      opt.textContent = "No courses assigned.";
      classSelect.appendChild(opt);
    }
  }

  // Render students enrolled in selected CRN
  function renderStudents(CRN) {
    const selectedCourse = coursesGlobal
      .flatMap(dept => dept.coursesList)
      .flatMap(course => course.classes)
      .find(cls => cls.CRN === CRN);

    if (!selectedCourse) return;

    const enrolledStudents = selectedCourse.enrolledStudents;
    gradesTable.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

    if (enrolledStudents.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 3;
      cell.textContent = "No students enrolled in this class.";
      cell.style.textAlign = "center";
      cell.style.color = "#777";
      row.appendChild(cell);
      gradesTable.appendChild(row);
      return;
    }

    enrolledStudents.forEach(studentId => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = studentId;

      const nameCell = document.createElement("td");
      nameCell.textContent = studentMap[studentId] || "Unknown Student";

      const gradeCell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.value = "";
      input.dataset.studentId = studentId;
      gradeCell.appendChild(input);

      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(gradeCell);
      gradesTable.appendChild(row);
    });
  }

  classSelect.addEventListener("change", () => {
    renderStudents(classSelect.value);
  });

  // Submit grades for students
  submitBtn.addEventListener("click", () => {
    const CRN = classSelect.value;
    const selectedCourse = coursesGlobal
      .flatMap(dept => dept.coursesList)
      .flatMap(course => course.classes)
      .find(cls => cls.CRN === CRN);

    if (!selectedCourse) return;

    const courseId = selectedCourse.id;
    const inputs = gradesTable.querySelectorAll("input");

    inputs.forEach(input => {
      const studentId = input.dataset.studentId;
      const grade = input.value.trim();

      const student = studentsGlobal.find(s => s.username === studentId);
      if (student) {
        const existingCourse = student.completedCourses.find(c => c.course === courseId);

        if (existingCourse) {
          existingCourse.grade = grade;
        } else {
          student.completedCourses.push({ course: courseId, grade });
        }

        const enrolledStudent = selectedCourse.enrolledStudents.find(s => s.studentId === studentId);
        if (enrolledStudent) {
          enrolledStudent.grade = grade;
        } else {
          selectedCourse.enrolledStudents.push({ studentId, grade });
        }
      }
    });

    saveData();
    alert("Grades submitted and student records updated!");
  });
});
