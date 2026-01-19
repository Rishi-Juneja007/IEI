/**
 * IEI Student Chapter - Application Logic
 * Encapsulated to avoid global variable pollution
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('registrationForm');
    const studentsTableBody = document.getElementById('studentsBody');
    const noStudentsMsg = document.getElementById('no-students-msg');

    // Storage Key
    const STORAGE_KEY = 'iei_students_data';

    /**
     * Initialize Application
     */
    function init() {
        loadStudents();
        form.addEventListener('submit', handleRegistration);
    }

    /**
     * Handle Form Submission
     * @param {Event} e 
     */
    function handleRegistration(e) {
        e.preventDefault();

        // 1. Extract Values
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

        // 2. Validate
        if (!validateStudent(student)) {
            return;
        }

        // 3. Save to LocalStorage
        saveStudent(student);

        // 4. Update UI
        addStudentToTable(student);
        toggleEmptyState(false);
        form.reset();

        // 5. Feedback
        alert('Registration Successful! Student added to the database.');
    }

    /**
     * Validate Student Data
     * @param {Object} student 
     * @returns {boolean} isValid
     */
    function validateStudent(student) {
        // Basic required check (HTML5 does most of this, but double check)
        if (!student.fullName || !student.enrollmentNo || !student.branch || !student.semester) {
            alert('Please fill in all required fields.');
            return false;
        }

        // Email Validation Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(student.email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        // Phone Validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(student.phone)) {
            alert('Phone number must be exactly 10 digits.');
            return false;
        }

        return true;
    }

    /**
     * Save Student to LocalStorage
     * @param {Object} student 
     */
    function saveStudent(student) {
        const students = getStudentsFromStorage();
        students.push(student);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }

    /**
     * Retrieve Students from LocalStorage
     * @returns {Array} students
     */
    function getStudentsFromStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Load and Display Students on Page Load
     */
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

    /**
     * Add Single Student Row to Table
     * @param {Object} student 
     */
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

    /**
     * Toggle "No students" message
     * @param {boolean} isEmpty 
     */
    function toggleEmptyState(isEmpty) {
        if (isEmpty) {
            noStudentsMsg.classList.remove('hidden');
            studentsTableBody.parentElement.classList.add('hidden');
        } else {
            noStudentsMsg.classList.add('hidden');
            studentsTableBody.parentElement.classList.remove('hidden');
        }
    }

    /**
     * Prevent XSS helper
     * @param {string} str 
     * @returns {string} escaped string
     */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Start App
    init();
});
