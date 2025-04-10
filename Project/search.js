document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('#searchInput');
    const courseTableBody = document.querySelector('#courseTableBody');
    const logoutBtn = document.querySelector('#logout button');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser'); 
        window.location.href = 'login.html'; 
    });

    let allCourses = [];
  

    fetch("/Project/DataStore/courses.json")
      .then(response => response.json())
      .then(data => {
        
        data.forEach(subject => {
          subject.coursesList.forEach(course => {
            allCourses.push({
              subject: subject.subject,
              id: course.id,
              name: course.name,
              status: course.status,
              classes: course.classes,
            });
          });
        });
        displayCourses(allCourses); 
      })
      .catch(error => {
        console.error("Error loading courses.json:", error);
      });
  
    
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
  
      const filteredCourses = allCourses.filter(course => {
        const nameMatch = course.name.toLowerCase().includes(query);
        const subjectMatch = course.subject.toLowerCase().includes(query);
        return nameMatch || subjectMatch;
      });
  
      displayCourses(filteredCourses);
    });
  
    function displayCourses(courses) {
      courseTableBody.innerHTML = "";
  
      if (courses.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent = "No courses found.";
        cell.style.textAlign = "center";
        row.appendChild(cell);
        courseTableBody.appendChild(row);
        return;
      }
  
      courses.forEach(course => {
        course.classes.forEach(cls => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${cls.instructor}</td>
            <td>${course.status}</td>
            <td>${cls.schedule}</td>
            <td>${cls.capacity}</td>
          `;
          courseTableBody.appendChild(row);
        });
      });
    }
  });
  