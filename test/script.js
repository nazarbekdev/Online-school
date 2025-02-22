// Static savollar ro'yxati
const questions = [
    {
        id: 1,
        question: "Savol 1: JavaScript nima?",
        options: ["Dasturlash tili", "Operatsion sistema", "Ma'lumotlar bazasi", "Framework"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 2,
        question: "Savol 2: HTML ning asosiy vazifasi nima?",
        options: ["Ma'lumotlarni saqlash", "Veb-sahifa strukturasi", "Server bilan aloqa", "Animatsiya yaratish"],
        image: "/Users/uzmacbook/Desktop/course/student-dashboard/Unknown.jpeg"
    },
    {
        id: 3,
        question: "Savol 3: CSS nima uchun ishlatiladi?",
        options: ["Dasturlash", "Stil berish", "Ma'lumotlar bazasini boshqarish", "API integratsiyasi"],
        image: "/Users/uzmacbook/Desktop/course/student-dashboard/Unknown.jpeg"
    },
    {
        id: 4,
        question: "Savol 4: React.js nima?",
        options: ["Backend framework", "Frontend kutubxona", "Ma'lumotlar bazasi", "Operatsion sistema"],
        image: "/Users/uzmacbook/Desktop/course/student-dashboard/Unknown.jpeg"
    },
    {
        id: 5,
        question: "Savol 5: Node.js nima uchun ishlatiladi?",
        options: ["Frontend ishlanmalar", "Backend ishlanmalar", "Grafik dizayn", "Video montaj"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 6,
        question: "Savol 6: Git nima uchun kerak?",
        options: ["Versiyalarni boshqarish", "Veb-sahifa yaratish", "Ma'lumotlar bazasini boshqarish", "Animatsiya yaratish"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 7,
        question: "Savol 7: REST API nima?",
        options: ["Protokol", "Framework", "Arxiv", "Interfeys"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 8,
        question: "Savol 8: SQL nima uchun ishlatiladi?",
        options: ["Ma'lumotlar bazasini boshqarish", "Veb-sahifa yaratish", "Stil berish", "Animatsiya yaratish"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 9,
        question: "Savol 9: MongoDB nima?",
        options: ["NoSQL ma'lumotlar bazasi", "SQL ma'lumotlar bazasi", "Framework", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 10,
        question: "Savol 10: Docker nima uchun ishlatiladi?",
        options: ["Konteynerlashtirish", "Veb-sahifa yaratish", "Stil berish", "Animatsiya yaratish"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 11,
        question: "Savol 11: TypeScript nima?",
        options: ["JavaScript superset", "CSS framework", "HTML versiyasi", "Backend kutubxona"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 12,
        question: "Savol 12: Redux nima uchun ishlatiladi?",
        options: ["State boshqaruvi", "Stil berish", "Animatsiya yaratish", "Ma'lumotlar bazasini boshqarish"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 13,
        question: "Savol 13: JWT nima?",
        options: ["Autentifikatsiya tokeni", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 14,
        question: "Savol 14: OAuth nima uchun ishlatiladi?",
        options: ["Autentifikatsiya", "Stil berish", "Animatsiya yaratish", "Ma'lumotlar bazasini boshqarish"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 15,
        question: "Savol 15: GraphQL nima?",
        options: ["Query tillari", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 16,
        question: "Savol 16: AWS nima?",
        options: ["Cloud platforma", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 17,
        question: "Savol 17: CI/CD nima?",
        options: ["Continuous Integration/Deployment", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 18,
        question: "Savol 18: Kubernetes nima?",
        options: ["Konteyner orkestrator", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 19,
        question: "Savol 19: Firebase nima?",
        options: ["Backend servis", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 20,
        question: "Savol 20: Webpack nima?",
        options: ["Modul bundler", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 21,
        question: "Savol 21: Babel nima?",
        options: ["JavaScript kompilyatori", "Framework", "Protokol", "Dasturlash tili"],
        image: null
    },
    {
        id: 22,
        question: "Savol 22: Jest nima?",
        options: ["Testing framework", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 23,
        question: "Savol 23: ESLint nima?",
        options: ["Kodni tekshirish vositasi", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 24,
        question: "Savol 24: Prettier nima?",
        options: ["Kod formatlash vositasi", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 25,
        question: "Savol 25: Nginx nima?",
        options: ["Web server", "Framework", "Protokol", "Dasturlash tili"],
        image: null
    },
    {
        id: 26,
        question: "Savol 26: Apache nima?",
        options: ["Web server", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 27,
        question: "Savol 27: Redis nima?",
        options: ["In-memory ma'lumotlar bazasi", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    },
    {
        id: 28,
        question: "Savol 28: RabbitMQ nima?",
        options: ["Message broker", "Framework", "Protokol", "Dasturlash tili"],
        image: null
    },
    {
        id: 29,
        question: "Savol 29: Elasticsearch nima?",
        options: ["Qidiruv tizimi", "Framework", "Protokol", "Dasturlash tili"],
        image: null
    },
    {
        id: 30,
        question: "Savol 30: Kubernetes nima?",
        options: ["Konteyner orkestrator", "Framework", "Protokol", "Dasturlash tili"],
        image: "/Users/uzmacbook/Desktop/course/teacher-dashboard/teacher.png"
    }
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
};

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


// Tugatish tugmasi bosilganda natijani ko'rsatish
finishButton.addEventListener('click', () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;
    const score = answeredQuestions * 2; // Har bir javob uchun 2 ball
    const totalScore = totalQuestions * 2; // Umumiy maksimal ball
    const percentage = Math.round((score / totalScore) * 100);

    // Diagramma uchun foizni yangilash
    scoreText.textContent = `${answeredQuestions} / ${totalQuestions}`
    percentageText.textContent = `${percentage}%`;

    // Umumiy ballni chiqarish
    const totalScoreText = document.getElementById('total-score');
    totalScoreText.textContent = `Umumiy ball: ${score}`;

    // Doiraviy diagrammani yangilash
    const offset = 440 - (score / totalScore) * 440;
    circleProgress.style.strokeDashoffset = offset;

    // Modalni ko'rsatish
    resultModal.classList.remove('hidden');
});



// Modalni yopish
closeModalBtn.addEventListener('click', () => {
    resultModal.classList.add('hidden');
});

// Qayta boshlash tugmasi
restartButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    selectedAnswers = {};
    resultModal.classList.add('hidden');
});

// Bosh sahifa tugmasi
homeButton.addEventListener('click', () => {
    window.location.href = '/';
});



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

// Dastlabki savolni ko'rsatish
window.onload = () => {
    renderQuestions();
    showQuestion(questions[currentQuestionIndex].id);
};