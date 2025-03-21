// Statik ma’lumotlar
const staticClasses = [
    { id: '1', name: '1-sinf' },
    { id: '2', name: '2-sinf' },
    { id: '3', name: '3-sinf' }
];

const staticStudents = {
    '1': [
        { 
            id: '1', 
            username: 'Ali', 
            grade: '', 
            phone: '+998 90 123 45 67', 
            classId: '1', 
            fullname: 'Ali Abdulov', 
            testResults: {
                moc: 85,
                dtm: 90,
                matematika: 88
            },
            rating: "3-o'rin",
            files: ['darslik1.pdf', 'darslik2.docx']
        },
        { 
            id: '2', 
            username: 'Vali', 
            grade: '', 
            phone: '+998 90 123 45 68', 
            classId: '1', 
            fullname: 'Vali Ismailov', 
            testResults: {
                moc: 80,
                dtm: 85,
                fizika: 82
            },
            rating: "2-o'rin",
            files: ['darslik3.pdf']
        }
    ],
    // Boshqa sinflar uchun studentlar avvalgi kodda qoldi
};

const staticMaterials = [
    { id: '1', classId: '1', subject: 'matematika', topic: 'Matematika 1-chorak', file: 'math.pdf' },
    { id: '2', classId: '2', subject: 'fizika', topic: 'Fizika 2-chorak', file: 'physics.pdf' }
];

const staticTests = [
    { id: '1', classId: '1', subject: 'matematika', topic: 'Matematika testi', quarter: '1-chorak', file: 'math_test.docx' },
    { id: '2', classId: '2', subject: 'fizika', topic: 'Fizika testi', quarter: '2-chorak', file: 'physics_test.docx' }
];

const staticAssignments = [
    { id: '1', className: '1-sinf', student: { username: 'Ali' }, topic: 'Matematika topshiriqi', file: 'ali_assignment.pdf', grade: '' },
    { id: '2', className: '1-sinf', student: { username: 'Vali' }, topic: 'Fizika topshiriqi', file: 'vali_assignment.pdf', grade: '' }
];

// Navbar menyusi
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Sinflarni ko‘rsatish
function loadClasses() {
    const classList = document.getElementById('class-list');
    if (classList) {
        staticClasses.forEach(cls => {
            const li = document.createElement('li');
            li.className = 'class-item';
            li.textContent = cls.name;
            li.onclick = () => goToClassDetail(cls.id);
            classList.appendChild(li);
        });
    }
}

// Sinf detallariga o‘tish
function goToClassDetail(classId) {
    window.location.href = `class-detail.html?classId=${classId}`;
}

// Ortga qaytish (sinf ro‘yxatiga)
function goBackToClass() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId');
    if (studentId) {
        // Barcha studentlarni bir massivga aylantiramiz
        const allStudents = Object.values(staticStudents).flat();
        const student = allStudents.find(s => s.id === studentId);
        if (student) {
            window.location.href = `class-detail.html?classId=${student.classId}`;
        } else {
            console.error('Student topilmadi');
            window.location.href = 'class-detail.html?classId=1'; // Standart sinfga qaytish
        }
    } else {
        console.error('Student ID topilmadi URL’da');
        window.location.href = 'class-detail.html?classId=1'; // Standart sinfga qaytish
    }
}

// Sinf detallarini ko‘rsatish (kartochkalar bilan)
function loadClassDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('classId');
    if (classId) {
        const students = staticStudents[classId] || [];
        const container = document.getElementById('student-container');
        if (container) {
            container.innerHTML = ''; // Oldingi ma’lumotlarni tozalash
            students.forEach(student => {
                const card = document.createElement('a');
                card.href = `student-detail.html?studentId=${student.id}`;
                card.className = 'student-card';
                card.innerHTML = `
                    <h4>${student.username}</h4>
                    <p><strong>Sinf:</strong> ${staticClasses.find(cls => cls.id === student.classId)?.name || 'Noma’lum'}</p>
                    <p><strong>Baho:</strong> ${student.grade || 'Belgilanmagan'}</p>
                    <p><strong>Telefon:</strong> ${student.phone}</p>
                `;
                container.appendChild(card);
            });
        } else {
            console.error('Student container topilmadi (#student-container)');
        }
    } else {
        console.error('Class ID topilmadi URL’da');
    }
}

// O‘quvchi detallarini ko‘rsatish va tugmani yangilash
function loadStudentDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId');
    if (studentId) {
        // Barcha studentlarni bir massivga aylantiramiz
        const allStudents = Object.values(staticStudents).flat();
        const student = allStudents.find(s => s.id === studentId);
        if (student) {
            document.getElementById('student-name').textContent = student.username;
            document.getElementById('student-class').textContent = staticClasses.find(cls => cls.id === student.classId)?.name || 'Noma’lum';
            document.getElementById('student-fullname').textContent = student.fullname;
            document.getElementById('student-test-results').textContent = `
                MOC: ${student.testResults.moc || 'Noma’lum'}, 
                DTM: ${student.testResults.dtm || 'Noma’lum'}, 
                ${student.testResults.matematika ? `Matematika: ${student.testResults.matematika}` : 
                student.testResults.fizika ? `Fizika: ${student.testResults.fizika}` : 'Noma’lum'}
            `;
            document.getElementById('student-rating').textContent = student.rating || 'Noma’lum';
            
            const filesList = document.getElementById('student-files');
            if (student.files && student.files.length > 0) {
                filesList.innerHTML = student.files.map(file => `<li>${file} <button onclick="downloadFile('${file}')">Yuklab olish</button></li>`).join('');
            } else {
                filesList.innerHTML = '<li>Fayl mavjud emas</li>';
            }

            // Ortga qaytish tugmasini icon va matn bilan yangilash
            const backBtn = document.getElementById('backBtn');
            if (backBtn) {
                backBtn.innerHTML = `<i class="fa-solid fa-turn-left"></i> Ortga qaytish`; // Icon va matn
                backBtn.onclick = goBackToClass; // Tugma funksiyasini bog‘lash
            }
        } else {
            console.error('Student topilmadi');
        }
    } else {
        console.error('Student ID topilmadi URL’da');
    }
}

// Fayl yuklab olish funksiyasi (statik holatda simulyatsiya)
function downloadFile(fileName) {
    alert(`${fileName} yuklab olindi! (Statik ma’lumotlarda fayl mavjud emas)`);
}

// Sinflarni va fanlarni select’ga yuklash
function loadClassOptions(selectId) {
    const select = document.getElementById(selectId);
    if (select) {
        staticClasses.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            select.appendChild(option);
        });
    }
}

function loadSubjectOptions(selectId) {
    const subjects = [
        { value: '', text: 'Fan tanlang' },
        { value: 'matematika', text: 'Matematika' },
        { value: 'fizika', text: 'Fizika' },
        { value: 'kimyo', text: 'Kimyo' },
        { value: 'biologiya', text: 'Biologiya' }
    ];
    const select = document.getElementById(selectId);
    if (select) {
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.value;
            option.textContent = subject.text;
            select.appendChild(option);
        });
    }
}

// Material qo‘shish formasi
function toggleMaterialForm() {
    const form = document.getElementById('material-form');
    if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            loadClassOptions('classSelect');
            loadSubjectOptions('subjectSelect');
        }
    }
}

// Test qo‘shish formasi
function toggleTestForm() {
    const form = document.getElementById('test-form');
    if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            loadClassOptions('testClassSelect');
            loadSubjectOptions('testSubjectSelect');
        }
    }
}

// Material yuklash (statik holatda faqat UI’da ko‘rsatish)
function uploadMaterial() {
    const classId = document.getElementById('classSelect')?.value;
    const subject = document.getElementById('subjectSelect')?.value;
    const topic = document.getElementById('topicInput')?.value;
    if (topic && classId && subject) {
        const newMaterial = { 
            id: staticMaterials.length + 1, 
            classId, 
            subject, 
            topic, 
            file: 'new_material.pdf' 
        };
        staticMaterials.push(newMaterial);
        alert('Material muvaffaqiyatli yuklandi! (Statik ma’lumotlarda saqlanmaydi)');
        toggleMaterialForm();
        loadMaterials();
    } else {
        alert('Sinf, fan va mavzu to‘ldirilishi kerak.');
    }
}

// Test yuklash (statik holatda faqat UI’da ko‘rsatish)
function uploadTest() {
    const classId = document.getElementById('testClassSelect')?.value;
    const subject = document.getElementById('testSubjectSelect')?.value;
    const topic = document.getElementById('testTopicInput')?.value; // Mavzuni olish
    const quarter = document.getElementById('quarterSelect')?.value;
    const fileInput = document.getElementById('testFile'); // Fayl input’ini olish
    let fileName = 'new_test.docx'; // Standart fayl nomi

    // Agar fayl tanlangan bo‘lsa, uning nomini olish
    if (fileInput && fileInput.files.length > 0) {
        fileName = fileInput.files[0].name || 'new_test.docx';
    }

    if (classId && subject && quarter && topic) {
        const newTest = { 
            id: staticTests.length + 1, 
            classId, 
            subject, 
            topic, 
            quarter, 
            file: fileName 
        };
        staticTests.push(newTest);
        alert('Test muvaffaqiyatli yuklandi! (Statik ma’lumotlarda saqlanmaydi)');
        toggleTestForm();
        loadTests();
    } else {
        alert('Sinf, fan, mavzu va chorak to‘ldirilishi kerak.');
    }
}

// Yuklangan materiallarni ko‘rsatish
function loadMaterials() {
    const list = document.getElementById('material-list');
    if (list) {
        list.innerHTML = '';
        staticMaterials.forEach(mat => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${mat.subject} - ${mat.topic}</span>
                            <button onclick="downloadMaterial(${mat.id})">Yuklab olish</button>`;
            list.appendChild(li);
        });
    }
}

// Yuklangan testlarni ko‘rsatish
function loadTests() {
    const list = document.getElementById('test-list');
    if (list) {
        list.innerHTML = '';
        staticTests.forEach(test => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${test.subject} - ${test.topic} (${test.quarter})</span>
                            <button onclick="downloadTest(${test.id})">Yuklab olish</button>`;
            list.appendChild(li);
        });
    }
}

// O‘quvchilarning topshiriqlarini ko‘rsatish (jadval)
function loadAssignments() {
    const table = document.getElementById('assignment-table');
    if (table) {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        staticAssignments.forEach(ass => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ass.className}</td>
                <td>${ass.student.username}</td>
                <td>${ass.topic}</td>
                <td><span id="grade-${ass.id}">${ass.grade || ''}</span></td>
                <td><button onclick="showGradeModal(${ass.id})">Baho berish</button></td>
                <td><button onclick="downloadAssignment(${ass.id})">Yuklab olish</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Baho berish modal oynasi
function showGradeModal(assignmentId) {
    const modal = document.getElementById('grade-modal');
    const gradeInput = document.getElementById('gradeInput');
    if (modal && gradeInput) {
        modal.classList.remove('hidden');
        gradeInput.dataset.assignmentId = assignmentId;
        gradeInput.value = ''; // Inputni tozalash
    } else {
        console.error('Modal yoki gradeInput element topilmadi.');
    }
}

function hideGradeModal() {
    const modal = document.getElementById('grade-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function submitGrade() {
    const grade = document.getElementById('gradeInput')?.value;
    const assignmentId = document.getElementById('gradeInput')?.dataset.assignmentId;
    if (grade !== null && !isNaN(grade) && grade >= 1 && grade <= 5) {
        const assignment = staticAssignments.find(ass => ass.id === assignmentId);
        if (assignment) {
            assignment.grade = grade;
            const gradeSpan = document.getElementById(`grade-${assignmentId}`);
            if (gradeSpan) {
                gradeSpan.textContent = grade;
            }
            // alert(`Topshiriq ${assignmentId} uchun baho: ${grade} berildi! (Statik ma’lumotlarda saqlanmaydi)`);
            hideGradeModal();
        } else {
            console.error('Topshiriq topilmadi');
            alert('Topshiriq topilmadi.');
        }
    } else {
        alert('Noto‘g‘ri baho kiritingildi (1-5 orasida bo‘lishi kerak).');
    }
}

// Yuklab olish funksiyalari (statik holatda faqat alert bilan simulyatsiya)
function downloadMaterial(id) {
    alert(`Material ${id} yuklab olindi! (Statik ma’lumotlarda fayl mavjud emas)`);
}

function downloadTest(id) {
    alert(`Test ${id} yuklab olindi! (Statik ma’lumotlarda fayl mavjud emas)`);
}

function downloadAssignment(id) {
    alert(`Topshiriq ${id} yuklab olindi! (Statik ma’lumotlarda fayl mavjud emas)`);
}

// Sahifa yuklanganda ishga tushirish
window.onload = () => {
    loadClasses();
    loadMaterials();
    loadTests();
    loadAssignments();
    if (window.location.pathname.includes('class-detail.html')) {
        loadClassDetail();
    }
    loadClassDetail(); // class-detail.html uchun
    if (window.location.pathname.includes('student-detail.html')) {
        loadStudentDetail(); // student-detail.html uchun
    }
};