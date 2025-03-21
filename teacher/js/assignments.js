// assignments.js

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

// Material nomini va muddatini yuklash
async function loadMaterialDetails(materialId) {
    try {
        const response = await window.utils.apiFetch(`http://127.0.0.1:8000/teachers/materials/name/${materialId}/`);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error('Material ma’lumotlari yuklanmadi');
        }
    } catch (error) {
        console.error('Material ma’lumotlarini yuklashda xato:', error);
        return null;
    }
}

// Teacherga biriktirilgan sinf va fanlarni yuklash
async function loadTeacherExpertise() {
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

        // Takrorlanishni oldini olish uchun Set dan foydalanamiz
        const uniqueClassesAndSubjects = [];
        const seen = new Set();
        expertiseData.forEach(item => {
            const key = `${item.class_number}-${item.subject}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueClassesAndSubjects.push({
                    class_number: item.class_number,
                    subject: item.subject
                });
            }
        });

        return uniqueClassesAndSubjects;
    } catch (error) {
        console.error('Teacherga biriktirilgan sinflarni yuklashda xato:', error);
        return [];
    }
}

// Topshiriqlarni yuklash
async function loadAssignments(classNumber, subjectId) {
    try {
        const response = await window.utils.apiFetch(`http://127.0.0.1:8000/students/submit-assignment/mark/${classNumber}/${subjectId}/`);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error('Topshiriqlar yuklanmadi');
        }
    } catch (error) {
        console.error('Topshiriqlarni yuklashda xato:', error);
        return [];
    }
}

// Barcha topshiriqlarni yuklash va jadvalni to‘ldirish
async function loadAllAssignments() {
    const assignmentTableBody = document.getElementById('assignment-table-body');
    assignmentTableBody.innerHTML = ''; // Jadvalni tozalash

    try {
        // Teacherga biriktirilgan sinf va fanlarni olish
        const expertise = await loadTeacherExpertise();
        if (expertise.length === 0) {
            assignmentTableBody.innerHTML = '<tr><td colspan="10">Topshiriqlar topilmadi</td></tr>';
            return;
        }

        const subjects = await loadSubjects();

        // Har bir sinf va fan bo‘yicha topshiriqlarni olish
        for (const { class_number, subject } of expertise) {
            const assignments = await loadAssignments(class_number, subject);
            for (const assignment of assignments) {
                const studentProfile = await loadStudentProfile(assignment.student);
                const materialDetails = await loadMaterialDetails(assignment.material);
                const subjectName = subjects.find(s => s.id === assignment.subject)?.name || 'Noma’lum';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${assignment.class_number}-sinf</td>
                    <td>${studentProfile?.first_name || 'Noma’lum'} ${studentProfile?.last_name || 'Noma’lum'}</td>
                    <td>${subjectName}</td>
                    <td>${materialDetails?.topic || 'Noma’lum'}</td>
                    <td><span id="grade-${assignment.id}">${assignment.grade === 0 ? 'Baholanmagan' : assignment.grade}</span></td>
                    <td><a href="${assignment.file}" target="_blank">${assignment.file.split('/').pop()}</a></td>
                    <td>${new Date(assignment.submitted_at).toLocaleString()}</td>
                    <td>${materialDetails?.deadline || 'Noma’lum'}</td>
                    <td><button onclick="showGradeModal(${assignment.id})">Baho berish</button></td>
                    <td><button onclick="downloadAssignment('${assignment.file}')">Yuklab olish</button></td>
                `;
                assignmentTableBody.appendChild(row);
            }
        }

        if (assignmentTableBody.innerHTML === '') {
            assignmentTableBody.innerHTML = '<tr><td colspan="10">Topshiriqlar topilmadi</td></tr>';
        }
    } catch (error) {
        console.error('Topshiriqlarni yuklashda xato:', error);
        assignmentTableBody.innerHTML = `<tr><td colspan="10">Xatolik: ${error.message}</td></tr>`;
    }
}

// Modal oynani ko‘rsatish
let currentAssignmentId = null;
window.showGradeModal = function(assignmentId) {
    currentAssignmentId = assignmentId;
    document.getElementById('grade-modal').classList.remove('hidden');
    document.getElementById('gradeInput').value = '';
};

// Modal oynani yashirish
window.hideGradeModal = function() {
    document.getElementById('grade-modal').classList.add('hidden');
    currentAssignmentId = null;
};

// Baho tasdiqlash
window.submitGrade = async function() {
    const gradeInput = document.getElementById('gradeInput').value;
    const grade = parseInt(gradeInput);

    // grade ni tekshirish
    if (isNaN(grade) || grade < 1 || grade > 5) {
        alert('Iltimos, 1-5 oralig‘ida baho kiriting!');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('grade', grade);
        const response = await window.utils.apiFetchWithFile(
            `http://127.0.0.1:8000/students/submit-assignment/mark/${currentAssignmentId}/`,
            formData,
            'PATCH'
        );
        const data = await response.json();
        if (response.ok) {
            document.getElementById(`grade-${currentAssignmentId}`).textContent = data.grade;
            hideGradeModal();
        } else {
            throw new Error(data.error || 'Baho saqlashda xato');
        }
    } catch (error) {
        console.error('Baho saqlashda xato:', error);
        alert('Baho saqlashda xato yuz berdi: ' + error.message);
    }
};

// Faylni yuklab olish
window.downloadAssignment = function(fileUrl) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Sahifa yuklanganda
window.onload = () => {
    loadAllAssignments();
    window.utils.initializeMenu();
};

// Xavfsizlik uchun utils mavjudligini tekshirish
if (typeof window.utils === 'undefined' || typeof window.utils.apiFetch !== 'function') {
    console.error('utils.js yuklanmadi yoki apiFetch funksiyasi topilmadi. Iltimos, HTML’da <script src="js/utils.js"></script> tartibini tekshiring.');
}