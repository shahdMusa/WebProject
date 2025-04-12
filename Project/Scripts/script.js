document.addEventListener("DOMContentLoaded", async () => {
    const currentInstructor = "Jane Doe"; 
    const classSelect = document.getElementById("classSelect");
    const gradesTable = document.querySelector(".grades-table table");
    const submitBtn = document.querySelector(".submit-btn");
  
    const [coursesRes, studentsRes] = await Promise.all([
      fetch("courses.json"),
      fetch("students.json")
    ]);
    const courseData = await coursesRes.json();
    const studentData = await studentsRes.json();
  
    localStorage.setItem("studentsData", JSON.stringify(studentData));
  
    const studentMap = {};
    studentData.forEach(student => {
      studentMap[student.id] = student.name;
    });
  
    const instructorCourses = [];
    courseData.forEach(dept => {
      dept.coursesList.forEach(course => {
        course.classes.forEach(cls => {
          if (cls.instructor === currentInstructor) {
            instructorCourses.push({
              id: course.id,
              CRN: cls.CRN,
              enrolledStudents: cls.enrolledStudents
            });
          }
        });
      });
    });
  
    instructorCourses.forEach(course => {
      const option = document.createElement("option");
      option.value = course.CRN;
      option.textContent = course.CRN;
      classSelect.appendChild(option);
    });
  
    let gradeBook = {};
  
    function renderStudents(CRN) {
      const selectedCourse = instructorCourses.find(c => c.CRN === CRN);
      if (!selectedCourse) return;
    
      gradesTable.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());
    
      if (selectedCourse.enrolledStudents.length === 0) {
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
    
      selectedCourse.enrolledStudents.forEach((studentId) => {
        const row = document.createElement("tr");
    
        const idCell = document.createElement("td");
        idCell.textContent = studentId;
    
        const nameCell = document.createElement("td");
        nameCell.textContent = studentMap[studentId] || "Unknown Student";
    
        const gradeCell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.value = gradeBook[studentId] || "";
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
  
    submitBtn.addEventListener("click", () => {
      const CRN = classSelect.value;
      const selectedCourse = instructorCourses.find(c => c.CRN === CRN);
      const courseId = selectedCourse.id;
  
      const inputs = gradesTable.querySelectorAll("input");
      const localStudents = JSON.parse(localStorage.getItem("studentsData")) || [];
  
      inputs.forEach(input => {
        const studentId = input.dataset.studentId;
        const grade = input.value.trim();
        gradeBook[studentId] = grade;
  
        const student = localStudents.find(s => s.id === studentId);
        if (student) {
          const existing = student.completedCourses.find(c => c.course === courseId);
          if (existing) {
            existing.grade = grade;
          } else {
            student.completedCourses.push({ course: courseId, grade });
          }
        }
      });
  
      localStorage.setItem("studentsData", JSON.stringify(localStudents));
      alert("Grades submitted and student records updated!");
    });
  
    if (instructorCourses.length > 0) {
      classSelect.value = instructorCourses[0].CRN;
      renderStudents(classSelect.value);
    } else {
      const opt = document.createElement("option");
      opt.textContent = "No courses assigned.";
      classSelect.appendChild(opt);
    }
  });
  