const API_URL = '/api';

// Check Authentication
function checkAuth() {
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'index.html';
    } else if (isLoggedIn && isLoginPage) {
        window.location.href = 'dashboard.html';
    }
}

// Call checkAuth on all pages
checkAuth();

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });
}

// Login Form Handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            
            if (response.ok && data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = data.message || 'Login failed';
            }
        } catch (error) {
            errorDiv.textContent = 'Server connection error.';
        }
    });
}

// Add Student Handling
const addStudentForm = document.getElementById('addStudentForm');
if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = document.getElementById('studentId').value;
        const name = document.getElementById('name').value;
        const course = document.getElementById('course').value;
        const email = document.getElementById('email').value;
        const errorDiv = document.getElementById('addError');

        try {
            const response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: studentId, name, course, email })
            });

            if (response.ok) {
                alert('Student added successfully!');
                window.location.href = 'view-students.html';
            } else {
                const data = await response.json();
                errorDiv.textContent = data.error || 'Failed to add student';
            }
        } catch (error) {
            errorDiv.textContent = 'Server connection error.';
        }
    });
}

// Global variable to hold students data
let studentsList = [];

// Load Students Functionality
async function loadStudents() {
    const tableBody = document.getElementById('studentsBody');
    const noDataMsg = document.getElementById('noDataMsg');
    
    if(!tableBody) return; // Only run on view page

    try {
        const response = await fetch(`${API_URL}/students`);
        if (response.ok) {
            studentsList = await response.json();
            renderStudents(studentsList);
        } else {
            noDataMsg.style.display = 'block';
            noDataMsg.textContent = 'Failed to fetch students data.';
        }
    } catch (error) {
        noDataMsg.style.display = 'block';
        noDataMsg.textContent = 'Server connection error.';
    }
}

// Render Students to Table
function renderStudents(students) {
    const tableBody = document.getElementById('studentsBody');
    const noDataMsg = document.getElementById('noDataMsg');
    
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        noDataMsg.style.display = 'block';
        return;
    }
    
    noDataMsg.style.display = 'none';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.email}</td>
            <td>
                <button class="btn btn-small" onclick="editStudent('${student.id}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle Search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredStudents = studentsList.filter(student => 
            student.name.toLowerCase().includes(searchTerm) || 
            student.id.toLowerCase().includes(searchTerm)
        );
        renderStudents(filteredStudents);
    });
}

// Handle Refresh List
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', loadStudents);
}

// Delete Student
async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student record?')) {
        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Student deleted successfully');
                loadStudents(); // Reload the list
            } else {
                alert('Failed to delete student');
            }
        } catch (error) {
            alert('Server connection error');
        }
    }
}

// Navigate to Edit Student
function editStudent(id) {
    const student = studentsList.find(s => s.id === id);
    if (student) {
        // Store student data temporarily in sessionStorage
        sessionStorage.setItem('editStudentData', JSON.stringify(student));
        window.location.href = 'edit-student.html';
    }
}

// Edit Student Form Handling
const editStudentForm = document.getElementById('editStudentForm');
if (editStudentForm) {
    // Populate form on load
    const studentData = JSON.parse(sessionStorage.getItem('editStudentData'));
    if (studentData) {
        document.getElementById('editStudentId').value = studentData.id;
        document.getElementById('editName').value = studentData.name;
        document.getElementById('editCourse').value = studentData.course;
        document.getElementById('editEmail').value = studentData.email;
    } else {
        window.location.href = 'view-students.html'; // Redirect if no data
    }

    // Handle submit
    editStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editStudentId').value;
        const name = document.getElementById('editName').value;
        const course = document.getElementById('editCourse').value;
        const email = document.getElementById('editEmail').value;
        const errorDiv = document.getElementById('editError');

        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, course, email }) // ID doesn't change
            });

            if (response.ok) {
                alert('Student updated successfully!');
                sessionStorage.removeItem('editStudentData');
                window.location.href = 'view-students.html';
            } else {
                const data = await response.json();
                errorDiv.textContent = data.error || 'Failed to update student';
            }
        } catch (error) {
            errorDiv.textContent = 'Server connection error.';
        }
    });
}
