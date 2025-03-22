// Static savollar ro'yxati
const questions = [
    {
        id: 1,
        question: "Savol 1: JavaScript nima?",
        options: ["Dasturlash tili", "Operatsion sistema", "Ma'lumotlar bazasi", "Framework"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png",
        correct: "Dasturlash tili", // To‘g‘ri javobni qo‘shish
        level: 1 // 1-darajali savol
    },
    {
        id: 2,
        question: "Savol 2: HTML ning asosiy vazifasi nima?",
        options: ["Ma'lumotlarni saqlash", "Veb-sahifa strukturasi", "Server bilan aloqa", "Animatsiya yaratish"],
        image: "/Users/uzmacbook/Desktop/course/student-dashboard/Unknown.jpeg",
        correct: "Veb-sahifa strukturasi",
        level: 2 // 2-darajali savol
    },
    {
        id: 3,
        question: "Savol 3: CSS nima uchun ishlatiladi?",
        options: ["Dasturlash", "Stil berish", "Ma'lumotlar bazasini boshqarish", "API integratsiyasi"],
        image: "/Users/uzmacbook/Desktop/course/student-dashboard/Unknown.jpeg",
        correct: "Stil berish",
        level: 3 // 3-darajali savol
    }
    // Qolgan savollarni ham shunday daraja va to‘g‘ri javob bilan to‘ldiring
];
// Tanlangan javoblarni saqlash uchun obyekt
const selectedAnswers = {};

// DOM elementlari
const questionArea = document.getElementById('question-area');
const navigationPanel = document.getElementById('navigation-panel');

// Savollar va navigatsiyani yaratish
function renderQuestions() {
    questions.forEach((q, index) => {
        // Navigatsiya tugmasini yaratish
        const navButton = document.createElement('div');
        navButton.textContent = q.id;
        navButton.setAttribute('data-id', q.id);
        navButton.addEventListener('click', () => showQuestion(q.id));
        navigationPanel.appendChild(navButton);

        // Faqat birinchi savolni ko'rsatish
        if (index === 0) {
            showQuestion(q.id);
        }
    });
}

// Savolni ko'rsatish
function showQuestion(id) {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    // Savolni o'chirish va yangilash
    questionArea.innerHTML = '';
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.setAttribute('data-id', question.id);

    // Savol matni
    const questionText = document.createElement('p');
    questionText.textContent = question.question;

    // Rasm (agar mavjud bo'lsa)
    if (question.image) {
        const img = document.createElement('img');
        img.src = question.image;
        img.alt = `Rasm ${question.id}`;
        questionDiv.appendChild(img);
    }

    // Javob variantlari
    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');
    question.options.forEach(option => {
        const optionBtn = document.createElement('div');
        optionBtn.classList.add('option');
        optionBtn.textContent = option;

        // Agar avval tanlangan javob bo'lsa, uni belgilash
        if (selectedAnswers[question.id] === option) {
            optionBtn.classList.add('selected');
        }

        // Javobni tanlash hodisasi
        optionBtn.addEventListener('click', () => selectOption(question.id, option));
        optionsDiv.appendChild(optionBtn);
    });

    questionDiv.appendChild(questionText);
    questionDiv.appendChild(optionsDiv);
    questionArea.appendChild(questionDiv);
}

// Javobni tanlash
function selectOption(id, option) {
    // Tanlangan javobni saqlash
    selectedAnswers[id] = option;

    // Joriy savolni qayta ko'rsatish
    showQuestion(id);

    // Navigatsiyada belgilash
    const navButton = document.querySelector(`#navigation-panel div[data-id="${id}"]`);
    if (navButton) {
        navButton.classList.add('answered');
    }
}

// Sahifa yuklanganda savollarni yaratish
window.onload = () => {
    renderQuestions();
    showQuestion(questions[0].id); // Birinchi savolni ko‘rsatish
};

// ---- Savollarni oldinga va ortga o'tkazish tugmalari ----
// Joriy savol indeksi
let currentQuestionIndex = 0;

// DOM elementlari
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// Oldingisi tugmasi
prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(questions[currentQuestionIndex].id);
    }
});

// Keyingisi tugmasi
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(questions[currentQuestionIndex].id);
    }
});

// Modal elementlari
const resultModal = document.getElementById('result-modal');
const closeModalBtn = document.querySelector('.close-btn');
const restartButton = document.getElementById('restart-button');
const homeButton = document.getElementById('home-button');
const finishButton = document.getElementById('finish-button');

// Doiraviy diagramma elementlari
const circleProgress = document.querySelector('.circle-progress');
const scoreText = document.getElementById('score');
const percentageText = document.getElementById('percentage');
const resultsTable = document.getElementById('results-table'); // Jadval uchun element

// Tugatish tugmasi bosilganda natijani ko'rsatish
finishButton.addEventListener('click', () => {
    showResult();
});

// Natijani ko‘rsatish funksiyasi
function showResult() {
    // Savollarni darajaga bo‘yicha guruhlash
    const levels = {
        1: { total: 0, correct: 0, score: 0 }, // 1-darajali
        2: { total: 0, correct: 0, score: 0 }, // 2-darajali
        3: { total: 0, correct: 0, score: 0 }, // 3-darajali
        4: { total: 0, correct: 0, score: 0 }  // 4-darajali
    };

    // Har bir savolni tekshirish
    questions.forEach(q => {
        levels[q.level].total++; // Darajadagi savollar soni
        if (selectedAnswers[q.id] === q.correct) {
            levels[q.level].correct++; // To‘g‘ri javoblar soni
            levels[q.level].score += 2; // Har bir to‘g‘ri javob uchun 2 ball
        }
    });

    // Umumiy statistika
    const totalQuestions = questions.length;
    const totalCorrect = Object.values(levels).reduce((sum, level) => sum + level.correct, 0);
    const totalScore = totalCorrect * 2; // Umumiy maksimal ball = savollar soni * 2
    const totalPercentage = Math.round((totalScore / (totalQuestions * 2)) * 100);

    // Modal elementlarini yangilash
    scoreText.textContent = `${totalCorrect} / ${totalQuestions}`; // 19 / 22
    percentageText.textContent = `${totalPercentage}%`; // 100%

    // Umumiy ballni chiqarish
    const totalScoreText = document.getElementById('total-score');
    totalScoreText.textContent = `Umumiy ball: ${totalScore}`;

    // Doiraviy diagrammani yangilash
    const circumference = 440; // Sizda r=70 bo‘lgani uchun 2 * PI * 70 ≈ 440
    const offset = circumference - (totalPercentage / 100) * circumference;
    circleProgress.style.strokeDashoffset = offset;

    // Jadvalni yaratish
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Savol turi</th>
                    <th>Savollar soni</th>
                    <th>To‘g‘ri javoblar soni</th>
                    <th>Ball</th>
                    <th>Foiz</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Har bir darajani jadvalga qo‘shish
    for (let level = 1; level <= 4; level++) {
        const levelData = levels[level];
        if (levelData.total > 0) {
            const percentage = Math.round((levelData.score / (levelData.total * 2)) * 100);
            tableHTML += `
                <tr>
                    <td>${level}-darajali savol</td>
                    <td>${levelData.total}</td>
                    <td>${levelData.correct}</td>
                    <td>${levelData.score}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }
    }

    // Jami qatorini qo‘shish
    tableHTML += `
                <tr>
                    <td>Jami</td>
                    <td>${totalQuestions}</td>
                    <td>${totalCorrect}</td>
                    <td>${totalScore}</td>
                    <td>100%</td>
                </tr>
            </tbody>
        </table>
    `;

    resultsTable.innerHTML = tableHTML;

    // Modalni ko‘rsatish
    resultModal.classList.remove('hidden');
}

// Modalni yopish
closeModalBtn.addEventListener('click', () => {
    resultModal.classList.add('hidden');
});

// Qayta boshlash tugmasi
restartButton.addEventListener('click', () => {
    window.location.href = 'test-solution.html';
});

// Bosh sahifa tugmasi
homeButton.addEventListener('click', () => {
    window.location.href = '/Users/uzmacbook/Downloads/etrain-master/test-home.html';
});
