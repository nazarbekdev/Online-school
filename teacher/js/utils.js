// teacher/js/utils.js

// Utils ob'ekti
window.utils = window.utils || {};

// Tokenni yangilash funksiyasi
window.utils.refreshAccessToken = async function () {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('Refresh token mavjud emas. Iltimos, qayta kiring.');
    }

    try {
        const response = await fetch(`${config.BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Refresh token yaroqsiz yoki muddati tugagan.');
        }

        const data = await response.json();
        const newAccessToken = data.access;
        localStorage.setItem('access_token', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error('Tokenni yangilashda xato:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        alert('Tizimga qayta kiring!');
        window.location.href = 'index.html';
        throw error;
    }
};

// API so'rovlarini amalga oshirish
window.utils.apiFetch = async function(url, options = {}) {
    try {
        const token = localStorage.getItem('access_token');
        // Agar options.body FormData bo'lsa, Content-Type qo‘shmaymiz
        const isFormData = options.body instanceof FormData;
        const headers = {
            'Authorization': token ? `Bearer ${token}` : '',
            ...options.headers,
        };

        // Agar FormData bo‘lmasa, Content-Type qo‘shamiz
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'So‘rovda xato');
        }

        return response;
    } catch (error) {
        console.error('API so‘rovda xato:', error);
        throw error;
    }
};

// Fayl bilan API so'rovlarini amalga oshirish
window.utils.apiFetchWithFile = async function(url, formData, method = 'PATCH') {
    try {
        const token = localStorage.getItem('access_token');
        const headers = {
            'Authorization': token ? `Bearer ${token}` : '',
        };

        const response = await fetch(url, {
            method: method,
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Fayl yuklashda xato');
        }

        return response;
    } catch (error) {
        console.error('Fayl yuklashda xato:', error);
        throw error;
    }
};

// Tizimdan chiqish
window.utils = window.utils || {};
window.utils.logout = function () {
    const isConfirmed = confirm("Chiqmoqchimisiz?");
    if (isConfirmed) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '../index.html';
    } else {
        console.log("Chiqish bekor qilindi");
    }
};

// Navbar menyusini boshqarish
window.utils.initializeMenu = function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    } else {
        console.warn('Menu toggle yoki nav-menu element topilmadi.');
    }
};

// Teacher uchun xavfsizlik tekshiruvi (masalan, faqat o'qituvchilar uchun)
window.utils.checkTeacherRole = async function() {
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/teachers/profile/`);
        const data = await response.json();
        if (data.role !== 'teacher') {
            throw new Error('Faqat o‘qituvchilar uchun ruxsat berilgan!');
        }
        return true;
    } catch (error) {
        console.error('Role tekshiruvida xato:', error);
        window.location.href = '../index.html'; // Ruxsat bo'lmasa login sahifasiga qaytish
        return false;
    }
};

// Sahifa yuklanganda avtomatik ishga tushirish
window.onload = () => {
    window.utils.initializeMenu();
    window.utils.checkTeacherRole(); // Faqat o'qituvchilar uchun tekshiruv
};