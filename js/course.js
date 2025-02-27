// Ma'lumotlar bazasi (JSON formatida)
const data = {
    math: {
        5: [
            { title: "Natural sonlar", video: "https://www.youtube.com/embed/abc123", description: "Natural sonlar haqida tushuncha.", quiz: ["Savol 1?", "Savol 2?"] },
            { title: "Kasrlar", video: "https://www.youtube.com/embed/def456", description: "Kasrlar haqida tushuncha.", quiz: ["Savol 1?", "Savol 2?"] }
        ],
        6: [
            {
                title: "Algebra asoslari",
                video: "https://www.youtube.com/embed/ghi789",
                description: "Algebra matematikaning muhim tarmoqlaridan biri bo'lib, u sonlar va ular ustida bajariladigan amallarni o'rganadi. Algebraik ifodalar, tenglamalar, funksiyalar va grafiklar algebra kursining asosiy tushunchalarini tashkil etadi. Algebra yordamida biz noma'lum miqdorlarni topish, murakkab masalalarni yechish va real hayotdagi muammolarni matematik usullar bilan modellashtirish imkonini olamiz. Algebraik tenglamalar orqali fizika, iqtisodiyot va boshqa sohalardagi muammolarni ham yechish mumkin. Shuningdek, algebra dasturlash va kompyuter fanlarida ham keng qo'llaniladi.",
                quiz: ["Savol 1?", "Savol 2?"]
            }        ]
    },
    physics: {
        7: [
            { title: "Mexanika", video: "https://www.youtube.com/embed/jkl012", description: "Mexanika haqida tushuncha.", quiz: ["Savol 1?", "Savol 2?"] }
        ]
    }
};

// DOM elementlari
const subjectButtons = document.querySelectorAll('.subject-btn');
const gradeButtons = document.querySelectorAll('.grade-btn');
const topicsList = document.getElementById('topics');
const topicTitle = document.getElementById('topic-title');
const videoContainer = document.getElementById('video-container');
const description = document.getElementById('description');
const quizButton = document.getElementById('quiz-button');

let selectedSubject = null;
let selectedGrade = null;

// Fan tanlash
subjectButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Oldingi tanlangan fanni yoqish
        subjectButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedSubject = button.dataset.subject;
        updateTopics();
    });
});

// Sinf tanlash
gradeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Oldingi tanlangan sinfni yoqish
        gradeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedGrade = button.dataset.grade;
        updateTopics();
    });
});

// Mavzularni yangilash
function updateTopics() {
    if (!selectedSubject || !selectedGrade) {
        topicsList.innerHTML = '';
        return;
    }

    const topics = data[selectedSubject][selectedGrade] || [];
    topicsList.innerHTML = '';

    topics.forEach((topic, index) => {
        const li = document.createElement('li');
        li.textContent = topic.title;
        li.addEventListener('click', () => showTopicContent(topic));
        topicsList.appendChild(li);
    });
}

// Mavzu kontentini ko'rsatish
function showTopicContent(topic) {
    topicTitle.textContent = topic.title;
    videoContainer.innerHTML = `<iframe src="${topic.video}" frameborder="0" allowfullscreen></iframe>`;
    description.textContent = topic.description;

    // Test tugmasini ko'rsatish
    quizButton.style.display = 'block';
    quizButton.onclick = () => {
        window.location.href = 'test/test-solution.html';
    };
}