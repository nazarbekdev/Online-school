// Global o'zgaruvchilar
let cachedTestTypes = [];
let cachedSubjects = [];

// Test natijalarini yuklash
async function loadTestResults() {
    try {
        const studentId = localStorage.getItem("user_id");
        if (!studentId) {
            throw new Error("Foydalanuvchi ID topilmadi. Iltimos, tizimga qayta kiring.");
        }

        // Test turlari va fanlarni olish
        const [testTypesResponse, subjectsResponse] = await Promise.all([
            window.utils.apiFetch(`${config.BASE_URL}/students/test-types/`),
            window.utils.apiFetch(`${config.BASE_URL}/courses/subjects/`)
        ]);
        cachedTestTypes = await testTypesResponse.json();
        cachedSubjects = await subjectsResponse.json();

        // Test natijalarini olish
        const testResultsResponse = await window.utils.apiFetch(`${config.BASE_URL}/students/test-results/${studentId}/`);
        const testResults = await testResultsResponse.json();

        // Test turlari bo‘yicha filtrlash
        const mocResults = testResults.filter(result => result.test_type === 1);
        const dtmResults = testResults.filter(result => result.test_type === 2);
        const subjectResults = testResults.filter(result => result.test_type === 3);

        // Natijalarni render qilish
        renderTestResults("moc-results", mocResults, "Moc");
        renderTestResults("dtm-results", dtmResults, "DTM");
        renderTestResults("subject-results", subjectResults, "Fanga oid");

    } catch (error) {
        console.error("Test natijalarini yuklashda xato:", error);
        document.getElementById('tests-results').innerHTML = `<p>Xatolik: ${error.message}</p>`;
    }
}

// Test natijalarini render qilish funksiyasi
function renderTestResults(containerId, results, testType) {
    const container = document.getElementById(containerId);
    if (results.length > 0) {
        container.innerHTML = results.map(result => {
            const subjectName = cachedSubjects.find(s => s.id === result.subject)?.name || `Fan ${result.subject}`;
            // Sanani kk-oo-yyyy formatida chiqarish
            const date = new Date(result.created_at);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;
            return `
                <div class="test-card">
                    <h4>${testType} Test #${result.id}</h4>
                    <p>Fan: ${subjectName}</p>
                    <p>Sana: ${formattedDate}</p>
                    <p>To‘g‘ri javoblar: ${result.correct}</p>
                    <p>Ball: ${result.score}</p>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = `<p>Bu turdagi test natijalari yo‘q.</p>`;
    }
}

// Test yechish sahifasiga o‘tish
function goToTest() {
    window.location.href = "../test-home.html"; // Test yechish sahifasiga yo‘naltirish
}

// Sahifa yuklanganda
window.onload = () => {
    loadTestResults();
    window.utils.initializeMenu(); // Menu'ni ishga tushirish
};

// Xavfsizlik uchun utils mavjudligini tekshirish
if (typeof window.utils === 'undefined' || typeof window.utils.apiFetch !== 'function') {
    console.error('utils.js yuklanmadi yoki apiFetch funksiyasi topilmadi. Iltimos, HTML’da <script src="js/utils.js"></script> tartibini tekshiring.');
}