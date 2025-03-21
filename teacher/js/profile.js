// profile.js

async function loadSubjects() {
    const response = await window.utils.apiFetch('http://127.0.0.1:8000/courses/subjects/');
    return await response.json();
}

// Profilni yuklash
async function loadProfile() {
    try {
        const response = await window.utils.apiFetch('http://127.0.0.1:8000/teachers/profile/');
        const data = await response.json();
        if (response.ok) {
            document.getElementById('teacher-fullname').textContent = `${data.first_name} ${data.last_name}`;
            document.getElementById('teacher-phone').textContent = data.phone_number || 'Noma’lum';
            const imageElement = document.getElementById('teacher-image');
            if (data.image) {
                imageElement.src = data.image;
            } else {
                imageElement.src = 'Unknown.jpeg';
            }

            // Mutaxassisliklarni yuklash
            const teacherId = data.id;
            const expertiseResponse = await window.utils.apiFetch(`http://127.0.0.1:8000/courses/teacher-expertise/${teacherId}/`);
            const expertiseData = await expertiseResponse.json();
            if (expertiseResponse.ok) {
                // Subject ID larni olish va takrorlanishni oldini olish
                const subjectIds = [...new Set(expertiseData.map(item => item.subject))]; // Set yordamida noyob ID lar
                const subjectsData = await loadSubjects(); // API dan subjectlarni olish
                const subjectNames = subjectIds.map(id => {
                    const subject = subjectsData.find(s => s.id === id);
                    return subject ? subject.name : `Noma’lum (ID: ${id})`;
                }).join(", ");
                document.getElementById('teacher-specialty').textContent = subjectNames || 'Noma’lum';
            } else {
                throw new Error('Mutaxassislik ma’lumotlari yuklanmadi');
            }
        } else {
            throw new Error(data.error || 'Ma\'lumot yuklanmadi');
        }
    } catch (error) {
        console.error('Profilni yuklashda xato:', error);
        document.getElementById('profile-card').innerHTML = `<p>Xatolik: ${error.message}</p>`;
    }
}

// Tahrirlashni yoqish/o‘chirish
window.toggleEdit = function(field) {
    const editForm = document.getElementById(`${field}-edit`);
    if (editForm) {
        editForm.classList.toggle('hidden');
        if (!editForm.classList.contains('hidden')) {
            if (field === 'fullname') {
                document.getElementById('new-fullname').value = document.getElementById('teacher-fullname').textContent;
            } else if (field === 'phone') {
                document.getElementById('new-phone').value = document.getElementById('teacher-phone').textContent;
            }
        }
    }
};

// Tahrirlashni bekor qilish
window.cancelEdit = function(field) {
    toggleEdit(field);
};

// Ismni saqlash
window.saveFullname = async function() {
    const newFullname = document.getElementById('new-fullname').value.split(' ');
    const first_name = newFullname[0] || '';
    const last_name = newFullname[1] || '';
    try {
        const formData = new FormData();
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        const response = await window.utils.apiFetchWithFile('http://127.0.0.1:8000/teachers/profile/', formData, 'PATCH');
        const data = await response.json();
        if (response.ok) {
            document.getElementById('teacher-fullname').textContent = `${data.first_name} ${data.last_name}`;
            toggleEdit('fullname');
        } else {
            throw new Error(data.error || 'Ismni yangilashda xato');
        }
    } catch (error) {
        console.error('Ismni yangilashda xato:', error);
        alert('Ismni yangilashda xato yuz berdi.');
    }
};

// Telefonni saqlash
window.savePhone = async function() {
    const newPhone = document.getElementById('new-phone').value;
    try {
        const formData = new FormData();
        formData.append('phone_number', newPhone);
        const response = await window.utils.apiFetchWithFile('http://127.0.0.1:8000/teachers/profile/', formData, 'PATCH');
        const data = await response.json();
        if (response.ok) {
            document.getElementById('teacher-phone').textContent = data.phone_number;
            toggleEdit('phone');
        } else {
            throw new Error(data.error || 'Telefonni yangilashda xato');
        }
    } catch (error) {
        console.error('Telefonni yangilashda xato:', error);
        alert('Telefonni yangilashda xato yuz berdi.');
    }
};

// Rasmni saqlash
window.saveImage = async function() {
    const fileInput = document.getElementById('new-image');
    if (fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        try {
            const response = await window.utils.apiFetchWithFile('http://127.0.0.1:8000/teachers/profile/', formData, 'PATCH');
            const data = await response.json();
            if (response.ok) {
                document.getElementById('teacher-image').src = data.image ? data.image : 'Unknown.jpeg';
                toggleEdit('image');
            } else {
                throw new Error(data.error || 'Rasmni yangilashda xato');
            }
        } catch (error) {
            console.error('Rasmni yangilashda xato:', error);
            alert('Rasmni yangilashda xato yuz berdi: ' + error.message);
        }
    } else {
        alert('Iltimos, rasm tanlang!');
    }
};

// Sahifa yuklanganda
window.onload = () => {
    loadProfile();
    window.utils.initializeMenu();
};

// Xavfsizlik uchun utils mavjudligini tekshirish
if (typeof window.utils === 'undefined' || typeof window.utils.apiFetch !== 'function') {
    console.error('utils.js yuklanmadi yoki apiFetch funksiyasi topilmadi. Iltimos, HTML’da <script src="js/utils.js"></script> tartibini tekshiring.');
}