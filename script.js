document.addEventListener('DOMContentLoaded', () => {
   
    const form = document.getElementById('registrationForm');
    const studentsTableBody = document.getElementById('studentsBody');
    const noStudentsMsg = document.getElementById('no-students-msg');

    
    const STORAGE_KEY = 'iei_students_data';

    
    function init() {
        loadStudents();
        form.addEventListener('submit', handleRegistration);
    }

    
    function handleRegistration(e) {
        e.preventDefault();

       
        const formData = new FormData(form);
        const student = {
            id: Date.now(), // Simple unique ID
            fullName: formData.get('fullName').trim(),
            enrollmentNo: formData.get('enrollmentNo').trim(),
            branch: formData.get('branch'),
            semester: formData.get('semester'),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            timestamp: new Date().toISOString()
        };

        
        if (!validateStudent(student)) {
            return;
        }

      
        saveStudent(student);

        
        addStudentToTable(student);
        toggleEmptyState(false);
        form.reset();

        
        alert('Registration Successful! Student added to the database.');
    }

    
    function validateStudent(student) {
        // Basic required check (HTML5 does most of this, but double check)
        if (!student.fullName || !student.enrollmentNo || !student.branch || !student.semester) {
            alert('Please fill in all required fields.');
            return false;
        }

        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(student.email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(student.phone)) {
            alert('Phone number must be exactly 10 digits.');
            return false;
        }

        return true;
    }

    
    function saveStudent(student) {
        const students = getStudentsFromStorage();
        students.push(student);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }

    
    function getStudentsFromStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    
    function loadStudents() {
        const students = getStudentsFromStorage();
        studentsTableBody.innerHTML = ''; // Clear current

        if (students.length === 0) {
            toggleEmptyState(true);
        } else {
            toggleEmptyState(false);
            students.forEach(addStudentToTable);
        }
    }

    
    function addStudentToTable(student) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${escapeHtml(student.fullName)}</td>
            <td>${escapeHtml(student.enrollmentNo)}</td>
            <td>${student.branch}</td>
            <td>${student.semester}th</td>
            <td>
                <div>${escapeHtml(student.email)}</div>
                <small>${escapeHtml(student.phone)}</small>
            </td>
        `;

        studentsTableBody.appendChild(row);
    }

    
    function toggleEmptyState(isEmpty) {
        if (isEmpty) {
            noStudentsMsg.classList.remove('hidden');
            studentsTableBody.parentElement.classList.add('hidden');
        } else {
            noStudentsMsg.classList.add('hidden');
            studentsTableBody.parentElement.classList.remove('hidden');
        }
    }

    
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Start App
    init();
});

