// API’lardan ma’lumotlarni olish funksiyasi
async function fetchData(url, token = null) {
    try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP xatosi: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ma’lumotlarni olishda xato:', error);
        return [];
    }
}

// Foydalanuvchi ID’sini olish
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
// Dropdownlarni ochish/yopish funksiyasi
function toggleDropdown(dropdownId) {
    const dropdownContent = document.getElementById(dropdownId);
    dropdownContent.classList.toggle('show');
}

// Dropdown opsiyasini tanlash funksiyasi
function selectOption(dropdownBtnId, dropdownId, value) {
    const dropdownBtn = document.getElementById(dropdownBtnId);
    dropdownBtn.textContent = value;
    toggleDropdown(dropdownId);

    // Test turini tanlashda moslashuv
    if (dropdownBtnId === 'test-type-btn') {
        updateFormBasedOnTestType(value);
    }

    // Barcha kerakli maydonlar to‘ldirilganligini tekshirish
    checkIfAllSelected();
}

// Test turiga qarab formani moslashtirish
async function updateFormBasedOnTestType(testType) {
    const classGroup = document.getElementById('class-group');
    const subjectGroup = document.getElementById('subject-group');
    const variantGroup = document.getElementById('variant-group');
    const quarterGroup = document.getElementById('quarter-group');
    const classOptions = document.getElementById('class-options');
    const subjectOptions = document.getElementById('subject-options');
    const variantOptions = document.getElementById('variant-options');

    // Barcha maydonlarni yashirish va tozalash
    classGroup.classList.add('hidden');
    subjectGroup.classList.add('hidden');
    variantGroup.classList.add('hidden');
    quarterGroup.classList.add('hidden');
    document.getElementById('class-btn').textContent = 'Sinf tanlang';
    document.getElementById('subject-btn').textContent = 'Fan tanlang';
    document.getElementById('variant-btn').textContent = 'Variant tanlang';
    document.getElementById('quarter-btn').textContent = 'Chorak tanlang';

    // API’dan fanlar va variantlarni olish
    const subjects = await fetchData('http://127.0.0.1:8000/courses/subjects/');
    const variants = await fetchData('http://127.0.0.1:8000/tests/variants/');

    // Test turiga qarab moslashuv
    if (testType === 'Mock') {
        subjectGroup.classList.remove('hidden');
        variantGroup.classList.remove('hidden');

        // Fanlar (barchasi API’dan olinadi, statik filter yo‘q)
        subjectOptions.innerHTML = subjects
            .map(subject => `<div class="option" data-value="${subject.name}">${subject.name}</div>`)
            .join('');

        // Variantlar (barchasi API’dan olinadi)
        variantOptions.innerHTML = variants
            .map(variant => `<div class="option" data-value="${variant.name}">${variant.name}</div>`)
            .join('');
    } else if (testType === 'DTM') {
        subjectGroup.classList.remove('hidden');
        variantGroup.classList.remove('hidden');

        // Fanlar (barchasi API’dan olinadi, statik filter yo‘q)
        subjectOptions.innerHTML = subjects
            .map(subject => `<div class="option" data-value="${subject.name}">${subject.name}</div>`)
            .join('');

        // Variantlar (barchasi API’dan olinadi)
        variantOptions.innerHTML = variants
            .map(variant => `<div class="option" data-value="${variant.name}">${variant.name}</div>`)
            .join('');
    } else if (testType === 'Fanga oid') {
        classGroup.classList.remove('hidden');
        subjectGroup.classList.remove('hidden');
        variantGroup.classList.remove('hidden');
        quarterGroup.classList.remove('hidden');

        // Sinflar (API’dan olinadi)
        const classes = await fetchData('http://127.0.0.1:8000/courses/classes/');
        classOptions.innerHTML = classes
            .map(cls => `<div class="option" data-value="${cls.name}">${cls.name}</div>`)
            .join('');

        // Fanlar (barchasi API’dan olinadi)
        subjectOptions.innerHTML = subjects
            .map(subject => `<div class="option" data-value="${subject.name}">${subject.name}</div>`)
            .join('');

        // Variantlar (barchasi API’dan olinadi)
        variantOptions.innerHTML = variants
            .map(variant => `<div class="option" data-value="${variant.name}">${variant.name}</div>`)
            .join('');
    }
}

// Barcha maydonlar to‘ldirilganligini tekshirish
function checkIfAllSelected() {
    const testType = document.getElementById('test-type-btn').textContent;
    const subject = document.getElementById('subject-btn').textContent;
    const variant = document.getElementById('variant-btn').textContent;
    const classBtn = document.getElementById('class-btn').textContent;
    const quarter = document.getElementById('quarter-btn').textContent;
    const startBtn = document.getElementById('start-btn');

    if (testType === 'Test turini tanlang') return;

    if (testType === 'Fanga oid') {
        if (
            subject !== 'Fan tanlang' &&
            variant !== 'Variant tanlang' &&
            classBtn !== 'Sinf tanlang' &&
            quarter !== 'Chorak tanlang'
        ) {
            startBtn.classList.remove('hidden');
        } else {
            startBtn.classList.add('hidden');
        }
    } else {
        if (subject !== 'Fan tanlang' && variant !== 'Variant tanlang') {
            startBtn.classList.remove('hidden');
        } else {
            startBtn.classList.add('hidden');
        }
    }
}

// Testni boshlash
async function startTest() {
    const testType = document.getElementById('test-type-btn').textContent;
    const subject = document.getElementById('subject-btn').textContent;
    const variant = document.getElementById('variant-btn').textContent;
    const classBtn = document.getElementById('class-btn').textContent;
    const quarter = document.getElementById('quarter-btn').textContent;

    // Tokenni tekshirish
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Iltimos, tizimga kiring!');
        window.location.href = 'login.html';
        return;
    }

    // API’dan ID’larni olish
    const testTypes = await fetchData('http://127.0.0.1:8000/students/test-types/', token);
    const subjects = await fetchData('http://127.0.0.1:8000/courses/subjects/', token);
    const variants = await fetchData('http://127.0.0.1:8000/tests/variants/', token);
    const classes = await fetchData('http://127.0.0.1:8000/courses/classes/', token);

    // Tanlangan ma’lumotlarning ID’larini topish
    const testTypeId = testTypes.find(t => t.name === testType)?.id;
    const subjectId = subjects.find(s => s.name === subject)?.id;
    const variantId = variants.find(v => v.name === variant)?.id;
    const classId = classes.find(c => c.name === classBtn)?.id;

    // `quarter` qiymatini tekshirish
    const quarterValue = quarter !== 'Chorak tanlang' ? quarter : null;

    // Tanlangan ma’lumotlarni localStorage’da saqlash
    const testParams = {
        test_type: testTypeId,
        subject: subjectId,
        variant: variantId,
        class_number: classId,
        quarter: quarterValue
    };
    localStorage.setItem('testParams', JSON.stringify(testParams));

    // Mock va Fanga oid testlar uchun avvalgi natijalarni tekshirish
    if (testType !== 'DTM') {
        const studentId = await getStudentId();
        const previousResultsResponse = await fetch(`http://127.0.0.1:8000/students/test-results/${studentId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!previousResultsResponse.ok) {
            if (previousResultsResponse.status === 401) {
                alert('Autentifikatsiya xatosi! Iltimos, qayta tizimga kiring.');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Avvalgi natijalarni olishda xato');
        }

        const results = await previousResultsResponse.json();
        const hasPreviousResult = results.some(result => {
            const matchesBase = result.test_type === parseInt(testParams.test_type) &&
                                result.subject === parseInt(testParams.subject) &&
                                result.variant === parseInt(testParams.variant);
            // Fanga oid testlar uchun chorakni tekshirish
            if (testType === 'Fanga oid') {
                return matchesBase && result.quarter === testParams.quarter;
            }
            return matchesBase;
        });

        if (hasPreviousResult) {
            alert('Siz bu testni avval ishlagansiz. Mock va Fanga oid testlarni faqat bir marta ishlash mumkin.');
            return; // Test sahifasiga o‘tmaydi
        }
    }

    // Agar cheklov bo‘lmasa, test sahifasiga o‘tish
    window.location.href = 'test/test-solution.html';
}

// Sahifa yuklanganda ma’lumotlarni olish va dropdownlarni to‘ldirish
document.addEventListener('DOMContentLoaded', async () => {
    // Test turlarini olish
    const testTypes = await fetchData('http://127.0.0.1:8000/students/test-types/');
    const testTypeOptions = document.getElementById('test-type-options');
    testTypeOptions.innerHTML = testTypes
        .map(testType => `<div class="option" data-value="${testType.name}">${testType.name}</div>`)
        .join('');

    // Choraklar (statik tarzda qoldiriladi)
    const quarterOptions = document.getElementById('quarter-options');
    quarterOptions.innerHTML = `
        <div class="option" data-value="I chorak">I chorak</div>
        <div class="option" data-value="II chorak">II chorak</div>
        <div class="option" data-value="III chorak">III chorak</div>
        <div class="option" data-value="IV chorak">IV chorak</div>
    `;
});

// Dropdownlarni ochish/yopish uchun event listenerlar
document.getElementById('test-type-btn').addEventListener('click', () => toggleDropdown('test-type-options'));
document.getElementById('class-btn').addEventListener('click', () => toggleDropdown('class-options'));
document.getElementById('subject-btn').addEventListener('click', () => toggleDropdown('subject-options'));
document.getElementById('variant-btn').addEventListener('click', () => toggleDropdown('variant-options'));
document.getElementById('quarter-btn').addEventListener('click', () => toggleDropdown('quarter-options'));

// Event delegation yordamida opsiyalarni tanlash
document.addEventListener('click', (event) => {
    const option = event.target.closest('.option');
    if (option) {
        const dropdownContent = option.closest('.dropdown-content');
        const dropdownBtn = dropdownContent.previousElementSibling;
        const dropdownBtnId = dropdownBtn.id;
        const dropdownId = dropdownContent.id;
        const value = option.getAttribute('data-value') || option.textContent;
        selectOption(dropdownBtnId, dropdownId, value);
    }
});

// Dropdownlardan tashqariga bosilganda yopish
window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-btn') && !event.target.matches('.option')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// "Testni boshlash" tugmasiga event listener qo‘shish
document.getElementById('start-btn').addEventListener('click', startTest);