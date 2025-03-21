// Statik ma’lumotlar (simulyatsiya)
const staticStudents = {
    '1': [
        { 
            id: '2', 
            username: 'Vali', 
            classId: '1', 
            fullname: 'Vali Ismailov', 
            gender: 'Erkak', 
            phone: '+998 90 123 45 68', 
            email: 'vali@example.com', 
            region: 'Toshkent', 
            school: '3-maktab', 
            className: '1-sinf', 
            subjects: [
                { name: 'Fizika', rating: '3-o‘rin' },
                { name: 'Matematika', rating: '5-o‘rin' }
            ], 
            image: 'student.jpeg', 
            testResults: { moc: 80, dtm: 85, fizika: 82 }, 
            rating: "2-o'rin", 
            files: ['darslik3.pdf'] 
        }
    ]
};

const staticClasses = [
    { id: '1', name: '1-sinf' },
    { id: '2', name: '2-sinf' },
    { id: '3', name: '3-sinf' }
];

const staticAssignments = [
    { id: '1', title: 'Matematika topshirigi', type: 'PDF', deadline: '2025-03-10', status: 'Yuklanmagan', file: 'math_task.pdf', classId: '1' },
    { id: '2', title: 'Fizika test', type: 'Test', deadline: '2025-03-15', status: 'Tekshirilmoqda', file: 'physics_test.pdf', classId: '1' },
    { id: '3', title: 'Video loyiha', type: 'Video', deadline: '2025-03-05', status: 'Muddati tugagan', file: 'video_project.mp4', classId: '1' }
];

const staticTestResults = [
    { id: '1', title: 'MOC Test', subject: 'Matematika', deadline: '2025-03-12', score: 85, classId: '1' },
    { id: '2', title: 'DTM Test', subject: 'Fizika', deadline: '2025-03-18', score: null, classId: '1' },
    { id: '3', title: 'Matematika Imtihon', subject: 'Matematika', deadline: '2025-03-08', score: 78, classId: '1' }
];

// Current student simulyatsiyasi (real loyihada backend’dan keladi)
let currentStudent = staticStudents['1'][0]; // Vali’ni ishlatamiz

// Profil ma’lumotlarini yuklash
function loadProfile() {
    if (currentStudent) {
        document.getElementById('student-fullname').textContent = currentStudent.fullname || 'Noma’lum';
        document.getElementById('student-gender').textContent = currentStudent.gender || 'Noma’lum';
        document.getElementById('student-phone').textContent = currentStudent.phone || 'Noma’lum';
        document.getElementById('student-email').textContent = currentStudent.email || 'Noma’lum';
        document.getElementById('student-region').textContent = currentStudent.region || 'Noma’lum';
        document.getElementById('student-school').textContent = currentStudent.school || 'Noma’lum';
        document.getElementById('student-class').textContent = currentStudent.className || 'Noma’lum';
        document.getElementById('student-image').src = currentStudent.image || 'student.jpeg';

        const subjectsList = document.getElementById('student-subjects');
        if (currentStudent.subjects && currentStudent.subjects.length > 0) {
            subjectsList.innerHTML = currentStudent.subjects.map(s => `<li>${s.name}, Reyting: ${s.rating}</li>`).join('');
        } else {
            subjectsList.innerHTML = '<li>Fanlar mavjud emas</li>';
        }
    } else {
        console.error('Current student topilmadi');
    }
}

// Edit formalarini boshqarish
function toggleEdit(field) {
    const editForm = document.getElementById(`${field}-edit`);
    if (editForm) {
        editForm.classList.toggle('hidden');
    }
}

function saveImage() {
    const fileInput = document.getElementById('new-image');
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentStudent.image = e.target.result;
            document.getElementById('student-image').src = currentStudent.image;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
    toggleEdit('image');
}

function saveFullname() {
    const newFullname = document.getElementById('new-fullname').value;
    if (newFullname) {
        currentStudent.fullname = newFullname;
        document.getElementById('student-fullname').textContent = currentStudent.fullname;
    }
    toggleEdit('fullname');
}

function savePhone() {
    const newPhone = document.getElementById('new-phone').value;
    if (newPhone) {
        currentStudent.phone = newPhone;
        document.getElementById('student-phone').textContent = currentStudent.phone;
    }
    toggleEdit('phone');
}

function saveEmail() {
    const newEmail = document.getElementById('new-email').value;
    if (newEmail) {
        currentStudent.email = newEmail;
        document.getElementById('student-email').textContent = currentStudent.email;
    }
    toggleEdit('email');
}

function saveRegion() {
    const newRegion = document.getElementById('new-region').value;
    if (newRegion) {
        currentStudent.region = newRegion;
        document.getElementById('student-region').textContent = currentStudent.region;
    }
    toggleEdit('region');
}

function saveSchool() {
    const newSchool = document.getElementById('new-school').value;
    if (newSchool) {
        currentStudent.school = newSchool;
        document.getElementById('student-school').textContent = newSchool;
    }
    toggleEdit('school');
}

function saveClass() {
    const newClass = document.getElementById('new-class').value;
    if (newClass) {
        currentStudent.className = newClass;
        document.getElementById('student-class').textContent = currentStudent.className;
    }
    toggleEdit('class');
}

function cancelEdit(field) {
    toggleEdit(field);
}

// Vazifalarni yuklash
function loadAssignments() {
    const assignmentsList = document.getElementById('assignments-list');
    if (currentStudent && assignmentsList) {
        const studentAssignments = staticAssignments.filter(a => a.classId === currentStudent.classId);
        if (studentAssignments.length > 0) {
            assignmentsList.innerHTML = studentAssignments.map(assignment => `
                <div class="assignment-card">
                    <h4>${assignment.title}</h4>
                    <p>Turi: ${assignment.type}</p>
                    <p>Muddat: ${assignment.deadline}</p>
                    <p>Status: <span style="color: ${assignment.status === 'Muddati tugagan' ? '#dc3545' : '#28a745'}">${assignment.status}</span></p>
                    <button onclick="downloadFile('${assignment.file}')">Yuklab olish</button>
                    <input type="file" id="upload-${assignment.id}" style="margin-top: 10px;">
                    <button onclick="uploadAssignment('${assignment.id}')">Yuklash</button>
                </div>
            `).join('');
        } else {
            assignmentsList.innerHTML = '<p>Hech qanday vazifa topilmadi.</p>';
        }
    }
}

// Vazifa yuklash simulyatsiyasi
function uploadAssignment(assignmentId) {
    const fileInput = document.getElementById(`upload-${assignmentId}`);
    if (fileInput.files && fileInput.files[0]) {
        alert(`Fayl yuklandi: ${fileInput.files[0].name}. Status: Yuklanmoqda.`);
        // Realda statusni backend’ga yangilash kerak
    } else {
        alert('Iltimos, fayl tanlang!');
    }
}

// Fayl yuklab olish simulyatsiyasi
function downloadFile(fileName) {
    alert(`${fileName} yuklab olindi! (Statik ma’lumotlarda fayl mavjud emas)`);
}

function logout() {
    currentStudent = null;
    document.getElementById('student-name').textContent = '';
    document.getElementById('student-class').textContent = '';
    document.getElementById('student-fullname').textContent = '';
    document.getElementById('student-gender').textContent = '';
    document.getElementById('student-phone').textContent = '';
    document.getElementById('student-email').textContent = '';
    document.getElementById('student-region').textContent = '';
    document.getElementById('student-school').textContent = '';
    document.getElementById('student-rating').textContent = '';
    document.getElementById('student-test-results').textContent = '';
    document.getElementById('student-files').innerHTML = 'Loading...';
    document.getElementById('student-subjects').innerHTML = 'Loading...';
    document.getElementById('student-image').src = 'https://via.placeholder.com/150';
    // Real loyihada login sahifasiga qaytarish
    window.location.href = 'index.html'; // Misol sifatida qayta yuklash
}

function loadDashboard() {
    if (currentStudent) {
        document.getElementById('student-name').textContent = currentStudent.username;
        document.getElementById('student-class').textContent = staticClasses.find(cls => cls.id === currentStudent.classId)?.name || 'Noma’lum';
        document.getElementById('student-rating').textContent = currentStudent.rating || 'Noma’lum';
        document.getElementById('student-test-summary').textContent = `MOC: ${currentStudent.testResults.moc || 'Noma’lum'}, DTM: ${currentStudent.testResults.dtm || 'Noma’lum'}`;
    } else {
        console.error('Current student topilmadi');
        // Real loyihada login sahifasiga yo‘naltirish
    }
}


// Test natijalarini yuklash
function loadTestResults() {
    console.log('loadTestResults chaqirildi'); // Debugging uchun
    const testsResults = document.getElementById('tests-results');
    if (currentStudent && testsResults) {
        console.log('currentStudent:', currentStudent); // Debugging uchun
        const studentTestResults = staticTestResults.filter(t => t.classId === currentStudent.classId);
        console.log('studentTestResults:', studentTestResults); // Debugging uchun
        if (studentTestResults.length > 0) {
            testsResults.innerHTML = studentTestResults.map(test => `
                <div class="test-card">
                    <h4>${test.title}</h4>
                    <p>Fan: ${test.subject}</p>
                    <p>Muddat: ${test.deadline}</p>
                    <p>Natija: ${test.score !== null ? test.score + ' ball' : 'Hali topshirilmagan'}</p>
                    <button onclick="goToTest()">Test yechish</button>
                </div>
            `).join('');
        } else {
            testsResults.innerHTML = '<p>Hech qanday natija topilmadi.</p>';
        }
    } else {
        console.log('currentStudent yoki testsResults topilmadi'); // Debugging uchun
    }
}

// Test yechishga o‘tish
function goToTest() {
    window.location.href = 'home-test.html'; // home-test.html ga yo‘naltirish
}

// Sahifa yuklanganda funksiyalarni chaqirish
window.onload = () => {
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current Page:', currentPage); // Debugging uchun

    if (currentPage === 'index.html') {
        loadDashboard();
    }

    if (currentPage === 'profile.html') {
        loadProfile();
    }

    if (currentPage === 'assignments.html') {
        loadAssignments();
    }

    if (currentPage === 'tests.html') {
        loadTestResults(); // Natijalarni yuklash
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
        console.log('menuToggle va navMenu topildi'); // Debugging uchun
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            console.log('Menu toggle bosildi, active class qo‘shildi/yechildi'); // Debugging uchun
        });
    } else {
        console.log('menuToggle yoki navMenu topilmadi:', { menuToggle, navMenu }); // Debugging uchun
    }
};