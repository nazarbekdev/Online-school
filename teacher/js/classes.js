// classes.js

// Fan nomlarini yuklash
async function loadSubjects() {
    try {
        const response = await window.utils.apiFetch('http://127.0.0.1:8000/courses/subjects/');
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error('Fanlar yuklanmadi');
        }
    } catch (error) {
        console.error('Fanlarni yuklashda xato:', error);
        return [];
    }
}

// Test turlari nomlarini yuklash
async function loadTestTypes() {
    try {
        const response = await window.utils.apiFetch('http://127.0.0.1:8000/students/test-types/');
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error('Test turlari yuklanmadi');
        }
    } catch (error) {
        console.error('Test turlari yuklashda xato:', error);
        return [];
    }
}

// O‘quvchi profilini yuklash
async function loadStudentProfile(studentId) {
    try {
        const response = await window.utils.apiFetch(`http://127.0.0.1:8000/students/profile/${studentId}/`);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error('O‘quvchi profili yuklanmadi');
        }
    } catch (error) {
        console.error('O‘quvchi profili yuklashda xato:', error);
        return null;
    }
}

// Test natijalarini yuklash
async function loadTestResults(studentId) {
    try {
        const response = await window.utils.apiFetch(`http://127.0.0.1:8000/students/test-results/${studentId}/`);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error('Test natijalari yuklanmadi');
        }
    } catch (error) {
        console.error('Test natijalari yuklashda xato:', error);
        return [];
    }
}

// Bajargan fayllarni yuklash
async function loadSubmissions(studentId) {
    try {
        const response = await window.utils.apiFetch(`http://127.0.0.1:8000/students/submit-assignment/${studentId}/`);
        const data = await response.json();
        if (response.ok) {
            // submitted_at bo‘yicha tartiblash (eng yangisidan eng eskisiga)
            return data.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
        } else {
            throw new Error('Fayllar yuklanmadi');
        }
    } catch (error) {
        console.error('Fayllar yuklashda xato:', error);
        return [];
    }
}

// Sinfga tegishli o‘quvchilarni yuklash
async function loadStudentsForClass(classNumber, subjectId) {
    try {
        const response = await window.utils.apiFetch(`http://127.0.0.1:8000/courses/student-subject/${classNumber}/${subjectId}/`);
        const studentsData = await response.json();
        if (response.ok) {
            return studentsData;
        } else {
            throw new Error('O‘quvchilar yuklanmadi');
        }
    } catch (error) {
        console.error('O‘quvchilar yuklashda xato:', error);
        return [];
    }
}

// Sinflarni yuklash va ko‘rsatish
async function loadClasses() {
    try {
        const teacherResponse = await window.utils.apiFetch('http://127.0.0.1:8000/teachers/profile/');
        const teacherData = await teacherResponse.json();
        if (!teacherResponse.ok) {
            throw new Error('O‘qituvchi ma’lumotlari yuklanmadi');
        }
        const teacherId = teacherData.id;

        const expertiseResponse = await window.utils.apiFetch(`http://127.0.0.1:8000/courses/teacher-expertise/${teacherId}/`);
        const expertiseData = await expertiseResponse.json();
        if (!expertiseResponse.ok) {
            throw new Error('Sinflar ma’lumotlari yuklanmadi');
        }

        const subjects = await loadSubjects();

        const classList = document.getElementById('class-list');
        classList.innerHTML = '';

        expertiseData.forEach(item => {
            const classNumber = item.class_number;
            const subjectId = item.subject;
            const subject = subjects.find(s => s.id === subjectId);
            const subjectName = subject ? subject.name : `Noma’lum (ID: ${subjectId})`;

            const button = document.createElement('button');
            button.className = 'class-item';
            button.setAttribute('data-class-number', classNumber);
            button.setAttribute('data-subject-id', subjectId);
            button.setAttribute('data-expertise-id', item.id);
            button.onclick = () => showStudents(classNumber, subjectId);
            button.textContent = `${classNumber}-sinf | ${subjectName}`;
            classList.appendChild(button);
        });

        if (expertiseData.length === 0) {
            classList.innerHTML = '<p>Sinflar topilmadi</p>';
        }
    } catch (error) {
        console.error('Sinflar yuklashda xato:', error);
        document.getElementById('class-list').innerHTML = `<p>Xatolik: ${error.message}</p>`;
    }
}

// O‘quvchilarni jadval ko‘rinishida ko‘rsatish
async function showStudents(classNumber, subjectId) {
    const studentsSection = document.getElementById('students-section');
    const studentsTableBody = document.getElementById('students-table-body');
    const studentClassTitle = document.getElementById('student-class-title');
    const subjects = await loadSubjects();
    studentClassTitle.textContent = `${classNumber}-sinf | ${subjects.find(s => s.id === subjectId)?.name || 'Noma’lum'} o‘quvchilari`;
    studentsSection.classList.remove('hidden');

    const studentsData = await loadStudentsForClass(classNumber, subjectId);
    const testTypes = await loadTestTypes();

    studentsTableBody.innerHTML = '';

    for (const student of studentsData) {
        const studentProfile = await loadStudentProfile(student.student);
        const testResults = await loadTestResults(student.student);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <a href="#" class="student-name" onclick="showStudentDetails(${student.student}, ${classNumber}, ${subjectId}); return false;">
                    ${studentProfile?.first_name || 'Noma’lum'} ${studentProfile?.last_name || 'Noma’lum'}
                </a>
            </td>
            <td>Hozircha aniqlanmagan</td>
            <td>
                ${testTypes.map(type => {
                    const result = testResults.find(r => r.test_type === type.id && r.subject === subjectId);
                    return result ? `${type.name}: ${result.score}` : `${type.name}: Noma’lum`;
                }).join(', ')}
            </td>
        `;
        studentsTableBody.appendChild(row);
    }
}

// O‘quvchining to‘liq ma’lumotlarini ko‘rsatish
async function showStudentDetails(studentId, classNumber, subjectId) {
    const studentDetailSection = document.getElementById('student-detail-section');
    const studentDetailTitle = document.getElementById('student-detail-title');
    const studentDetailContent = document.getElementById('student-detail-content');
    const subjects = await loadSubjects();
    const studentProfile = await loadStudentProfile(studentId);
    const testResults = await loadTestResults(studentId);
    const submissions = await loadSubmissions(studentId);
    const testTypes = await loadTestTypes();

    studentDetailTitle.textContent = `${studentProfile?.first_name || 'Noma’lum'} ${studentProfile?.last_name || 'Noma’lum'} - Ma’lumotlar`;
    studentDetailContent.innerHTML = `
        <p><strong>Sinf:</strong> ${classNumber}-sinf</p>
        <div class="test-results">
            <strong>Test natijalari:</strong>
            ${testTypes.map(type => {
                const result = testResults.find(r => r.test_type === type.id && r.subject === subjectId);
                const score = result ? parseFloat(result.score) : 0;
                const percentage = Math.min((score / 189) * 100, 100); // Maksimal ball 189 deb faraz qilindi
                return `
                    <div class="test-result-item">
                        <span>${type.name}:</span>
                        <span>${result ? result.score : 'Noma’lum'}</span>
                    </div>
                    <div class="test-result-bar">
                        <div style="width: ${percentage}%"></div>
                    </div>
                `;
            }).join('')}
        </div>
        <p><strong>Reyting:</strong> Hozircha aniqlanmagan</p>
        <div class="files-list">
            <h4>Darsga oid fayllar:</h4>
            ${submissions.length > 0 ? submissions.map(submission => `
                <div class="file-item">
                    <a href="${submission.file}" target="_blank">${submission.file.split('/').pop()}</a>
                    <span>${new Date(submission.submitted_at).toLocaleString()}</span>
                </div>
            `).join('') : '<p>Fayllar yo‘q</p>'}
        </div>
    `;
    studentDetailSection.classList.remove('hidden');
}

// O‘quvchilar bo‘limini yopish
function closeStudentsSection() {
    document.getElementById('students-section').classList.add('hidden');
}

// O‘quvchining to‘liq ma’lumotlar bo‘limini yopish
function closeStudentDetailSection() {
    document.getElementById('student-detail-section').classList.add('hidden');
}

// Sahifa yuklanganda
window.onload = () => {
    loadClasses();
    window.utils.initializeMenu();
};

// Xavfsizlik uchun utils mavjudligini tekshirish
if (typeof window.utils === 'undefined' || typeof window.utils.apiFetch !== 'function') {
    console.error('utils.js yuklanmadi yoki apiFetch funksiyasi topilmadi. Iltimos, HTML’da <script src="js/utils.js"></script> tartibini tekshiring.');
}