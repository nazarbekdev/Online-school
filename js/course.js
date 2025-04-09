// DOM elementlari
const subjectButtonsContainer = document.querySelector('.subjects .buttons-row');
const gradeButtonsContainer = document.querySelector('.grades .buttons-row');
const topicsList = document.getElementById('topics');
const topicTitle = document.getElementById('topic-title');
const videoContainer = document.getElementById('video-container');
const description = document.getElementById('description');
const actionButtons = document.querySelector('.action-buttons');

let selectedSubjectId = null;
let selectedGradeId = null;

// API so'rovlar uchun umumiy funksiya
async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('access_token'); // Token'ni localStorage'dan olish
    if (!token) {
        alert('Tizimga kirish talab qilinadi!');
        window.location.href = 'login.html'; // Login sahifasiga yo‘naltirish
        throw new Error('Token mavjud emas');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Har doim token qo'shiladi
        ...options.headers,
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Noma’lum xato' }));
        console.error('API xatosi:', errorData);
        throw new Error(errorData.detail || `Xato: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// Fanlarni API'dan yuklash
async function loadSubjects() {
    try {
        const subjects = await apiFetch(`${config.BASE_URL}/courses/subjects/`);
        subjectButtonsContainer.innerHTML = '';
        if (Array.isArray(subjects)) {
            subjects.forEach(subject => {
                const button = document.createElement('button');
                button.classList.add('subject-btn');
                button.dataset.subjectId = subject.id;
                button.textContent = subject.name;
                button.addEventListener('click', () => {
                    document.querySelectorAll('.subject-btn').forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                    selectedSubjectId = subject.id;
                    updateTopics();
                });
                subjectButtonsContainer.appendChild(button);
            });
        } else {
            throw new Error('Fanlar ro‘yxati noto‘g‘ri formatda');
        }
    } catch (error) {}
}

// Sinflarni API'dan yuklash
async function loadGrades() {
    try {
        const grades = await apiFetch(`${config.BASE_URL}/courses/classes/`);
        gradeButtonsContainer.innerHTML = '';
        if (Array.isArray(grades)) {
            grades.forEach(grade => {
                const button = document.createElement('button');
                button.classList.add('grade-btn');
                button.dataset.gradeId = grade.id;
                button.textContent = grade.name;
                button.addEventListener('click', () => {
                    document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                    selectedGradeId = grade.id;
                    updateTopics();
                });
                gradeButtonsContainer.appendChild(button);
            });
        } else {
            throw new Error('Sinflar ro‘yxati noto‘g‘ri formatda');
        }
    } catch (error) {}
}

// Mavzularni API'dan yuklash
async function updateTopics() {
    if (!selectedSubjectId || !selectedGradeId) {
        topicsList.innerHTML = '';
        return;
    }

    try {
        const topics = await apiFetch(`${config.BASE_URL}/teachers/materials/${selectedGradeId}/${selectedSubjectId}/`);
        topicsList.innerHTML = '';
        if (Array.isArray(topics)) {
            topics.forEach(topic => {
                const li = document.createElement('li');
                li.textContent = topic.topic;
                li.addEventListener('click', () => showTopicContent(topic));
                topicsList.appendChild(li);
            });
        } else {
            throw new Error('Mavzular ro‘yxati noto‘g‘ri formatda');
        }
    } catch (error) {
        alert('Mavzularni yuklashda xato yuz berdi: ' + error.message);
    }
}

// Mavzu kontentini ko'rsatish
function showTopicContent(topic) {
    topicTitle.textContent = topic.title;

    let videoId = '';
    if (topic.video_link) {
        const url = new URL(topic.video_link);
        if (url.pathname.includes('/shorts/')) {
            videoId = url.pathname.split('/shorts/')[1];
        } else if (url.pathname.includes('/watch')) {
            videoId = url.searchParams.get('v');
        } else {
            videoId = url.pathname.split('/')[1];
        }
        videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        videoContainer.innerHTML = '<p>Video mavjud emas.</p>';
    }

    description.textContent = topic.description || '';
    actionButtons.style.display = 'block';

    document.getElementById('test-button').onclick = () => {
        if (topic.test_file) {
            window.open(topic.test_file, '_blank');
        } else {
            alert('Test fayl mavjud emas.');
        }
    };

    document.getElementById('lecture-button').onclick = () => {
        if (topic.lecture_file) {
            window.open(topic.lecture_file, '_blank');
        } else {
            alert('Maruza matni mavjud emas.');
        }
    };

    document.getElementById('presentation-button').onclick = () => {
        if (topic.presentation_file) {
            window.open(topic.presentation_file, '_blank');
        } else {
            alert('Taqdimot mavjud emas.');
        }
    };
}

// Dastlabki yuklash
window.onload = () => {
    loadSubjects();
    loadGrades();
};