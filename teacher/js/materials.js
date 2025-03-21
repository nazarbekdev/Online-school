// Modal oynalarni ochish/yopish
window.toggleMaterialForm = function() {
    const materialForm = document.getElementById('material-form');
    materialForm.classList.toggle('hidden');
};

window.toggleTestForm = function() {
    const testForm = document.getElementById('test-form');
    testForm.classList.toggle('hidden');
};

// Muddat bo‘limini ko‘rsatish/yashirish
window.toggleDeadlineField = function() {
    const taskSelect = document.getElementById('taskSelect');
    const deadlineLabel = document.getElementById('deadlineLabel');
    const deadlineInput = document.getElementById('deadlineInput');
    if (taskSelect.value === 'Sinf') {
        deadlineLabel.classList.remove('hidden');
        deadlineInput.classList.remove('hidden');
    } else {
        deadlineLabel.classList.add('hidden');
        deadlineInput.classList.add('hidden');
        deadlineInput.value = ''; // Kurs tanlanganda muddatni tozalash
    }
};

// Sinf va fanlarni yuklash
async function loadClassesAndSubjects() {
    try {
        // Teacherga biriktirilgan sinf va fanlarni olish
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

        // Fan nomlarini olish
        const subjectsResponse = await window.utils.apiFetch('http://127.0.0.1:8000/courses/subjects/');
        const subjectsData = await subjectsResponse.json();
        if (!subjectsResponse.ok) {
            throw new Error('Fanlar yuklanmadi');
        }

        // Sinf va fanlarni duplicate larsiz olish
        const classSelect = document.getElementById('classSelect');
        const subjectSelect = document.getElementById('subjectSelect');
        const testClassSelect = document.getElementById('testClassSelect');
        const testSubjectSelect = document.getElementById('testSubjectSelect');

        const classes = [...new Set(expertiseData.map(item => item.class_number))].sort((a, b) => a - b);
        const subjects = expertiseData.map(item => ({
            id: item.subject,
            name: subjectsData.find(subject => subject.id === item.subject)?.name || 'Noma’lum'
        }));
        const uniqueSubjects = [...new Map(subjects.map(item => [item.id, item])).values()];

        // Sinf ro‘yxatini to‘ldirish
        classes.forEach(classNumber => {
            const option = document.createElement('option');
            option.value = classNumber;
            option.textContent = `${classNumber}-sinf`;
            classSelect.appendChild(option);
            const testOption = option.cloneNode(true);
            testClassSelect.appendChild(testOption);
        });

        // Fan ro‘yxatini to‘ldirish
        uniqueSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
            const testOption = option.cloneNode(true);
            testSubjectSelect.appendChild(testOption);
        });
    } catch (error) {
        console.error('Sinf va fanlarni yuklashda xato:', error);
        alert('Sinf va fanlarni yuklashda xato yuz berdi: ' + error.message);
    }
}

// Material yuklash
window.uploadMaterial = async function() {
    const classSelect = document.getElementById('classSelect').value;
    const subjectSelect = document.getElementById('subjectSelect').value;
    const taskSelect = document.getElementById('taskSelect').value;
    const topicInput = document.getElementById('topicInput').value;
    const lectureFile = document.getElementById('lectureFile').files[0];
    const presentationFile = document.getElementById('presentationFile').files[0];
    const videoLink = document.getElementById('videoLink').value;
    const deadlineInput = document.getElementById('deadlineInput').value;

    // Validatsiya
    if (!classSelect || !subjectSelect || !taskSelect || !topicInput || !lectureFile) {
        alert('Iltimos, barcha majburiy maydonlarni to‘ldiring!');
        return;
    }

    if (videoLink && !videoLink.includes('youtu.be') && !videoLink.includes('youtube.com')) {
        alert('Iltimos, faqat YouTube havolasini kiriting!');
        return;
    }

    if (deadlineInput && !/^\d{4}-\d{2}-\d{2}$/.test(deadlineInput)) {
        alert('Muddatni YYYY-MM-DD formatida kiriting (masalan, 2025-01-29)!');
        return;
    }

    try {
        // Teacherga biriktirilgan ma’lumotlarni olish
        const teacherResponse = await window.utils.apiFetch('http://127.0.0.1:8000/teachers/profile/');
        const teacherData = await teacherResponse.json();
        if (!teacherResponse.ok) {
            throw new Error('O‘qituvchi ma’lumotlari yuklanmadi');
        }
        const teacherId = teacherData.id;

        // FormData ni tayyorlash
        const formData = new FormData();
        formData.append('teacher', teacherId); // teacher_id ni qo‘shish
        formData.append('class_number', classSelect);
        formData.append('subject', subjectSelect);
        formData.append('task_type', taskSelect);
        formData.append('topic', topicInput);
        formData.append('lecture_file', lectureFile);
        if (presentationFile) formData.append('presentation_file', presentationFile);
        if (videoLink) formData.append('video_link', videoLink);
        if (deadlineInput && taskSelect === 'Sinf') formData.append('deadline', deadlineInput);

        const response = await window.utils.apiFetchWithFile(
            'http://127.0.0.1:8000/teachers/materials/',
            formData,
            'POST'
        );
        const data = await response.json();
        if (response.ok) {
            alert('Material muvaffaqiyatli yuklandi!');
            toggleMaterialForm();
            loadMaterialsAndTests(); // Yangi materialni ko‘rsatish uchun
        } else {
            throw new Error(data.error || 'Material yuklashda xato');
        }
    } catch (error) {
        console.error('Material yuklashda xato:', error);
        alert('Material yuklashda xato yuz berdi: ' + error.message);
    }
};

// Test yuklash
window.uploadTest = async function() {
    const classSelect = document.getElementById('testClassSelect').value;
    const subjectSelect = document.getElementById('testSubjectSelect').value;
    const topicInput = document.getElementById('testTopicInput').value;
    const quarterSelect = document.getElementById('quarterSelect').value;
    const testFile = document.getElementById('testFile').files[0];

    // Validatsiya
    if (!classSelect || !subjectSelect || !topicInput || !quarterSelect || !testFile) {
        alert('Iltimos, barcha majburiy maydonlarni to‘ldiring!');
        return;
    }

    try {
        const teacherResponse = await window.utils.apiFetch('http://127.0.0.1:8000/teachers/profile/');
        const teacherData = await teacherResponse.json();
        if (!teacherResponse.ok) {
            throw new Error('O‘qituvchi ma’lumotlari yuklanmadi');
        }
        const teacherId = teacherData.id;

        const formData = new FormData();
        formData.append('class_number', classSelect);
        formData.append('subject', subjectSelect);
        formData.append('topic', topicInput);
        formData.append('quarter', quarterSelect);
        formData.append('test_file', testFile);
        formData.append('teacher', teacherId);

        const response = await window.utils.apiFetchWithFile(
            'http://127.0.0.1:8000/teachers/tests/',
            formData,
            'POST'
        );
        const data = await response.json();
        if (response.ok) {
            alert('Test muvaffaqiyatli yuklandi!');
            toggleTestForm();
            loadMaterialsAndTests(); // Yangi testni ko‘rsatish uchun
        } else {
            throw new Error(data.error || 'Test yuklashda xato');
        }
    } catch (error) {
        console.error('Test yuklashda xato:', error);
        alert('Test yuklashda xato yuz berdi: ' + error.message);
    }
};

// Yuklangan materiallar va testlarni yuklash
async function loadMaterialsAndTests() {
    try {
        const teacherResponse = await window.utils.apiFetch('http://127.0.0.1:8000/teachers/profile/');
        const teacherData = await teacherResponse.json();
        if (!teacherResponse.ok) {
            throw new Error('O‘qituvchi ma’lumotlari yuklanmadi');
        }
        const teacherId = teacherData.id;

        // Materiallarni yuklash
        const materialsResponse = await window.utils.apiFetch(`http://127.0.0.1:8000/teachers/materials/details/${teacherId}/`);
        const materialsData = await materialsResponse.json();
        if (!materialsResponse.ok) {
            throw new Error('Materiallar yuklanmadi');
        }

        // Testlarni yuklash
        const testsResponse = await window.utils.apiFetch(`http://127.0.0.1:8000/teachers/tests/details/${teacherId}/`);
        const testsData = await testsResponse.json();
        if (!testsResponse.ok) {
            throw new Error('Testlar yuklanmadi');
        }

        // Fan nomlarini olish
        const subjectsResponse = await window.utils.apiFetch('http://127.0.0.1:8000/courses/subjects/');
        const subjectsData = await subjectsResponse.json();
        if (!subjectsResponse.ok) {
            throw new Error('Fanlar yuklanmadi');
        }

        // Materiallarni ko‘rsatish
        const materialList = document.getElementById('material-list');
        materialList.innerHTML = '';
        materialsData.forEach(material => {
            const subjectName = subjectsData.find(subject => subject.id === material.subject)?.name || 'Noma’lum';
            const card = document.createElement('div');
            card.className = 'material-card';
            card.innerHTML = `
                <h5>${material.class_number}-sinf | ${subjectName}</h5>
                <p><strong>Mavzu:</strong> ${material.topic}</p>
                <p><strong>Yaratilgan vaqt:</strong> ${new Date(material.created_at).toLocaleString()}</p>
                <div class="file-links">
                    <a href="${material.lecture_file}" target="_blank">Ma’ruza fayli</a>
                    ${material.presentation_file ? `<a href="${material.presentation_file}" target="_blank">Taqdimot fayli</a>` : ''}
                </div>
            `;
            materialList.appendChild(card);
        });

        // Testlarni ko‘rsatish
        const testList = document.getElementById('test-list');
        testList.innerHTML = '';
        testsData.forEach(test => {
            const subjectName = subjectsData.find(subject => subject.id === test.subject)?.name || 'Noma’lum';
            const card = document.createElement('div');
            card.className = 'test-card';
            card.innerHTML = `
                <h5>${test.class_number}-sinf | ${subjectName}</h5>
                <p><strong>Mavzu:</strong> ${test.topic}</p>
                <p><strong>Chorak:</strong> ${test.quarter}</p>
                <p><strong>Yaratilgan vaqt:</strong> ${new Date(test.created_at).toLocaleString()}</p>
                <div class="file-links">
                    <a href="${test.test_file}" target="_blank">Test fayli</a>
                </div>
            `;
            testList.appendChild(card);
        });
    } catch (error) {
        console.error('Material va testlarni yuklashda xato:', error);
        alert('Material va testlarni yuklashda xato yuz berdi: ' + error.message);
    }
}

// Sahifa yuklanganda
window.onload = () => {
    loadClassesAndSubjects();
    loadMaterialsAndTests();
    window.utils.initializeMenu();
};

// Xavfsizlik uchun utils mavjudligini tekshirish
if (typeof window.utils === 'undefined' || typeof window.utils.apiFetch !== 'function') {
    console.error('utils.js yuklanmadi yoki apiFetch funksiyasi topilmadi. Iltimos, HTML’da <script src="/static/js/utils.js"></script> tartibini tekshiring.');
}