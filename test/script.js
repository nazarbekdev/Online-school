let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let timeLeft;
let timerInterval;
let incorrectAnswers = []; // Xato qilingan savollar ro‘yxati
let feedbackData = null; // Feedback ma’lumotlarini saqlash uchun

// API’dan savollarni olish
async function fetchQuestions() {
    try {
        const testParams = JSON.parse(localStorage.getItem('testParams'));
        if (!testParams) {
            throw new Error('Test parametrlari topilmadi');
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Iltimos, tizimga kiring!');
            window.location.href = '../login.html';
            return;
        }

        const testTypesResponse = await fetch('http://127.0.0.1:8000/students/test-types/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!testTypesResponse.ok) {
            if (testTypesResponse.status === 401) {
                alert('Autentifikatsiya xatosi! Iltimos, qayta tizimga kiring.');
                window.location.href = '../login.html';
                return;
            }
            throw new Error(`Test turlari yuklanmadi: ${testTypesResponse.status}`);
        }
        const testTypes = await testTypesResponse.json();
        const testType = testTypes.find(t => t.id === parseInt(testParams.test_type));
        if (!testType) {
            throw new Error('Test turi topilmadi');
        }
        timeLeft = testType.duration * 60;

        const queryParams = new URLSearchParams({
            test_type: testParams.test_type,
            subject: testParams.subject,
            variant: testParams.variant,
        });

        if (testParams.class_number && testParams.class_number !== 'Sinf tanlang') {
            queryParams.append('class_number', testParams.class_number);
        }
        if (testParams.quarter && testParams.quarter !== 'Chorak tanlang') {
            queryParams.append('quarter', testParams.quarter);
        }

        const response = await fetch(`http://127.0.0.1:8000/tests/questions/filter/?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                alert('Autentifikatsiya xatosi! Iltimos, qayta tizimga kiring.');
                window.location.href = '../login.html';
                return;
            }
            throw new Error(`HTTP xatosi: ${response.status}`);
        }
        questions = await response.json();

        if (questions.length === 0) {
            throw new Error('Savollar topilmadi');
        }

        createNavigationPanel();
        displayQuestion(currentQuestionIndex);
        startTimer();
    } catch (error) {
        console.error('Savollarni olishda xato:', error);
        alert('Savollarni yuklashda xato yuz berdi: ' + error.message);
    }
}

// Foydalanuvchi ID’sini va rolini olish
async function getStudentId() {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('Token topilmadi');
        }

        const response = await fetch('http://127.0.0.1:8000/students/profile/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Autentifikatsiya xatosi! Iltimos, qayta tizimga kiring.');
                window.location.href = '../login.html';
                return;
            }
            if (response.status === 403) {
                alert('Test yechish faqatgina o\'quvchilar uchun!');
                window.location.href = '../index.html';
                return;
            }
            throw new Error('Foydalanuvchi ID’sini olishda xato');
        }

        const userData = await response.json();

        // Foydalanuvchi rolini tekshirish
        if (userData.role !== 'student') {
            alert('Test yechish faqatgina o\'quvchilar uchun!');
            window.location.href = '../index.html';
            return;
        }

        return userData.id;
    } catch (error) {
        console.error('Foydalanuvchi ID’sini olishda xato:', error);
        throw error;
    }
}

// Taymerni boshlash
function startTimer() {
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishTest();
            return;
        }

        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

// Navigatsiya panelini yaratish
function createNavigationPanel() {
    const navPanel = document.getElementById('navigation-panel');
    navPanel.innerHTML = '';
    questions.forEach((_, index) => {
        const navItem = document.createElement('div');
        navItem.textContent = index + 1;
        navItem.addEventListener('click', () => {
            currentQuestionIndex = index;
            displayQuestion(currentQuestionIndex);
        });
        navPanel.appendChild(navItem);
    });
}

// Joriy savolni ko‘rsatish
function displayQuestion(index) {
    const questionArea = document.getElementById('question-area');
    questionArea.innerHTML = '';

    const question = questions[index];
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    let questionHTML = `
        <h3>Savol ${index + 1}: ${question.text}</h3>
        ${
        question.image
            ? `
                    <div class="image-container">
                        <img src="${question.image}" alt="Question Image" class="zoomable-image" loading="lazy" onerror="this.src='/path/to/placeholder.png';">
                    </div>
                `
            : ''
    }
    `;

    if (question.question_type === 'yopiq') {
        const options = [
            {value: question.correct_answer, isCorrect: true},
            {value: question.option_1, isCorrect: false},
            {value: question.option_2, isCorrect: false},
            {value: question.option_3, isCorrect: false}
        ].filter(option => option.value);

        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        questionHTML += `
            <div class="options">
                ${options.map(option => `
                    <div class="option" data-value="${option.value}">${option.value}</div>
                `).join('')}
            </div>
        `;

        questionDiv.innerHTML = questionHTML;

        const optionElements = questionDiv.querySelectorAll('.option');
        optionElements.forEach(option => {
            option.addEventListener('click', () => {
                optionElements.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                userAnswers[question.id] = option.getAttribute('data-value');
                updateNavigationPanel();
            });

            if (userAnswers[question.id] === option.getAttribute('data-value')) {
                OPTION.classList.add('selected');
            }
        });
    } else if (question.question_type === 'ochiq') {
        questionHTML += `
            <div class="open-answer">
                <input type="text" class="open-answer-input" placeholder="Javobingizni kiriting" value="${userAnswers[question.id] || ''}">
            </div>
        `;

        questionDiv.innerHTML = questionHTML;

        const input = questionDiv.querySelector('.open-answer-input');
        input.addEventListener('input', () => {
            userAnswers[question.id] = input.value.trim();
            updateNavigationPanel();
        });
    }

    questionArea.appendChild(questionDiv);

    // Zoom funksiyasi
    const zoomableImages = questionDiv.querySelectorAll('.zoomable-image');
    zoomableImages.forEach(img => {
        img.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-content">
                    <span class="image-modal-close">×</span>
                    <img src="${img.src}" alt="Zoomed Image">
                </div>
            `;
            document.body.appendChild(modal);

            const closeModal = modal.querySelector('.image-modal-close');
            closeModal.addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });

    if (window.MathJax) {
        MathJax.typesetPromise().then(() => {
            console.log('Formulalar ko‘rsatildi');
        }).catch(err => console.error('MathJax xatosi:', err));
    }

    updateNavigationButtons();
}

// Navigatsiya panelini yangilash
function updateNavigationPanel() {
    const navItems = document.querySelectorAll('#navigation-panel div');
    navItems.forEach((item, index) => {
        const question = questions[index];
        const userAnswer = userAnswers[question.id];
        if (userAnswer && userAnswer.trim() !== '') {
            item.classList.add('answered');
        } else {
            item.classList.remove('answered');
        }
    });
}

// Navigatsiya tugmalarini yangilash
function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;
}

// Kutish animatsiyasini ko‘rsatish
function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="spinner"></div>
    `;
    document.body.appendChild(loadingOverlay);
    return loadingOverlay;
}

// Kutish animatsiyasini yashirish
function hideLoading(loadingOverlay) {
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Testni yakunlash va natijalarni saqlash
async function finishTest() {
    clearInterval(timerInterval);

    let correctAnswers = 0;
    let totalScore = 0;
    let maxPossibleScore = 0;
    const results = [];
    const details = [];
    incorrectAnswers = []; // Global o‘zgaruvchini tozalash

    questions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        const isCorrect = userAnswer && userAnswer.trim() === question.correct_answer;
        if (isCorrect) {
            correctAnswers++;
            totalScore += question.score;
        } else {
            incorrectAnswers.push({
                question_id: question.id,
                question_text: question.text,
                user_answer: userAnswer || 'Javob berilmadi',
                correct_answer: question.correct_answer,
                question_type: question.question_type,
                difficulty: question.difficulty
            });
        }
        maxPossibleScore += question.score;

        results.push({
            question: question.text,
            question_type: question.question_type,
            difficulty: question.difficulty,
            userAnswer: userAnswer || 'Javob berilmadi',
            isCorrect: isCorrect,
            score: question.score
        });

        details.push({
            question: question.id,
            user_answer: userAnswer || 'Javob berilmadi',
            is_correct: isCorrect,
            score: isCorrect ? question.score : 0,
            question_type: question.question_type,
            difficulty: question.difficulty
        });
    });

    const testParams = JSON.parse(localStorage.getItem('testParams'));
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Iltimos, tizimga kiring!');
        window.location.href = '../login.html';
        return;
    }

    const studentId = await getStudentId();
    const testResultData = {
        student: studentId,
        subject: testParams.subject,
        test_type: testParams.test_type,
        variant: testParams.variant,
        quarter: testParams.quarter && testParams.quarter !== 'Chorak tanlang' ? testParams.quarter : null,
        correct: `${correctAnswers}/${questions.length}`,
        score: `${totalScore.toFixed(1)}/${maxPossibleScore.toFixed(1)}`,
        percentage: (correctAnswers / questions.length) * 100,
        details: details
    };

    try {
        // Test natijalarini saqlash
        const response = await fetch('http://127.0.0.1:8000/students/test-results/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(testResultData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server javobi:', errorText);
            if (response.status === 401) {
                alert('Autentifikatsiya xatosi! Iltimos, qayta tizimga kiring.');
                window.location.href = '../login.html';
                return;
            }
            if (response.status === 403) {
                alert('Siz bu testni avval ishlagansiz. Mock va Fanga oid testlarni faqat bir marta ishlash mumkin.');
                window.location.href = '../index.html';
                return;
            }
            throw new Error(`HTTP xatosi: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Natijalar saqlandi:', responseData);

        // Modal oynani ko‘rsatish (faqat natijalar jadvali)
        const modal = document.getElementById('result-modal');
        modal.classList.remove('hidden');

        const scoreElement = document.getElementById('score');
        const percentageElement = document.getElementById('percentage');
        const totalScoreElement = document.getElementById('total-score');
        const resultsTable = document.getElementById('results-table');

        const totalQuestions = questions.length;
        const percentage = (correctAnswers / totalQuestions) * 100;

        scoreElement.textContent = `${correctAnswers}/${totalQuestions}`;
        percentageElement.textContent = `${Math.round(percentage)}%`;
        totalScoreElement.textContent = `Umumiy ball: ${totalScore.toFixed(1)} / ${maxPossibleScore.toFixed(1)}`;

        const circleProgress = document.querySelector('.circle-progress');
        const circumference = 2 * Math.PI * 70;
        const offset = circumference - (percentage / 100) * circumference;
        circleProgress.style.strokeDasharray = `${circumference} ${circumference}`;
        circleProgress.style.strokeDashoffset = offset;

        resultsTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Savol</th>
                        <th>Savol turi</th>
                        <th>Savol darajasi</th>
                        <th>Sizning javobingiz</th>
                        <th>Holati</th>
                        <th>Ball</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(result => `
                        <tr>
                            <td>${result.question}</td>
                            <td>${result.question_type}</td>
                            <td>${result.difficulty}</td>
                            <td>${result.userAnswer}</td>
                            <td style="color: ${result.isCorrect ? 'green' : 'red'}">
                                ${result.isCorrect ? 'To‘g‘ri' : 'Noto‘g‘ri'}
                            </td>
                            <td>${result.isCorrect ? result.score : 0}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        const summaryTable = document.createElement('div');
        summaryTable.className = 'summary-table';
        summaryTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Savol turi</th>
                        <th>Savol darajasi</th>
                        <th>To‘g‘ri javoblar</th>
                        <th>Ball</th>
                        <th>Foiz</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${[...new Set(results.map(r => r.question_type))].join(', ')}</td>
                        <td>${[...new Set(results.map(r => r.difficulty))].join(', ')}</td>
                        <td>${correctAnswers}/${totalQuestions}</td>
                        <td>${totalScore.toFixed(1)}/${maxPossibleScore.toFixed(1)}</td>
                        <td>${Math.round(percentage)}%</td>
                    </tr>
                </tbody>
            </table>
        `;
        resultsTable.appendChild(summaryTable);
    } catch (error) {
        console.error('Natijalarni saqlashda xato:', error);
        alert('Natijalarni saqlashda xato yuz berdi: ' + error.message);
    }
}

// Feedback’ni ko‘rish
document.getElementById('feedback-button').addEventListener('click', async () => {
    if (incorrectAnswers.length === 0) {
        alert('Sizda xato qilingan savollar yo‘q, feedback mavjud emas.');
        return;
    }

    if (feedbackData && feedbackData.feedback) {
        // Agar feedback allaqachon yuklangan bo‘lsa, darhol ko‘rsatamiz
        displayFeedback(feedbackData.feedback);
        return;
    }

    // Feedback’ni API’dan olish
    const loadingOverlay = showLoading();
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('Token topilmadi');
        }

        const feedbackResponse = await fetch('http://127.0.0.1:8000/students/feedback/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ incorrect_answers: incorrectAnswers })
        });

        if (!feedbackResponse.ok) {
            throw new Error('Feedback olishda xato: ' + feedbackResponse.status);
        }

        feedbackData = await feedbackResponse.json();
        hideLoading(loadingOverlay);
        displayFeedback(feedbackData.feedback);
    } catch (error) {
        hideLoading(loadingOverlay);
        console.error('Feedback olishda xato:', error);
        alert('Feedback olishda xato yuz berdi: ' + error.message);
    }
});

// Feedback’ni ko‘rsatish funksiyasi
function displayFeedback(feedback) {
    const feedbackModal = document.createElement('div');
    feedbackModal.className = 'feedback-modal';
    feedbackModal.innerHTML = `
        <div class="feedback-modal-content">
            <span class="feedback-close-btn">×</span>
            <h2>Xatolaringiz bo‘yicha Feedback</h2>
            <div class="feedback-list">
                ${feedback.map(item => `
                    <div class="feedback-item">
                        <h3>Savol: ${item.question_text}</h3>
                        <p><strong>Sizning javobingiz:</strong> ${item.user_answer}</p>
                        <p><strong>To‘g‘ri javob:</strong> ${item.correct_answer}</p>
                        <p><strong>Feedback:</strong> ${marked.parse(item.feedback)}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(feedbackModal);

    const closeFeedbackModal = feedbackModal.querySelector('.feedback-close-btn');
    closeFeedbackModal.addEventListener('click', () => {
        feedbackModal.remove();
    });

    feedbackModal.addEventListener('click', (e) => {
        if (e.target === feedbackModal) {
            feedbackModal.remove();
        }
    });
}

// Oldingisi tugmasi
document.getElementById('prev-button').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
});

// Keyingisi tugmasi
document.getElementById('next-button').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
});

// Testni yakunlash (foydalanuvchi tugmani bosganda)
document.getElementById('finish-button').addEventListener('click', () => {
    finishTest();
});

// Natijalar Modal oynasini yopish
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('result-modal').classList.add('hidden');
});

// Bosh sahifaga qaytish
document.getElementById('home-button').addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Sahifa yuklanganda savollarni olish
document.addEventListener('DOMContentLoaded', fetchQuestions);