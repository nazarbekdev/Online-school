// Utils ob'ektini global scope'da e'lon qilamiz
window.utils = window.utils || {};

// Tokenni yangilash funksiyasi
window.utils.refreshAccessToken = async function () {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('Refresh token mavjud emas. Iltimos, qayta kiring.');
    }

    try {
        const response = await fetch('http://localhost:8000/api/token/refresh/', {
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

// API so'rov funksiyasi
window.utils.apiFetch = async function (url, options = {}) {
    let token = localStorage.getItem('access_token');
    let defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        ...options,
    };

    console.log('defaultOptions:', defaultOptions);
    let response = await fetch(url, defaultOptions);
    console.log('response:', response);

    if (response.status === 401) {
        try {
            token = await window.utils.refreshAccessToken();
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
            response = await fetch(url, defaultOptions);
            console.log('Yangi token bilan qayta so‘rov:', response);
        } catch (error) {
            throw error;
        }
    }

    if (response.status === 401) {
        alert('Iltimos, tizimga kiring!');
        window.location.href = 'index.html';
        throw new Error('Unauthorized');
    }

    return response;
};

// Fayl bilan API so'rov funksiyasi
window.utils.apiFetchWithFile = async function (url, formData) {
    let token = localStorage.getItem('access_token');
    let defaultOptions = {
        method: 'POST',
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
    };

    let response = await fetch(url, defaultOptions);
    if (response.status === 401) {
        try {
            token = await window.utils.refreshAccessToken();
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
            response = await fetch(url, defaultOptions);
        } catch (error) {
            throw error;
        }
    }

    if (response.status === 401) {
        alert('Iltimos, tizimga kiring!');
        window.location.href = 'index.html';
        throw new Error('Unauthorized');
    }
    return response;
};

window.utils = window.utils || {};
window.utils.logout = function () {
    console.log("Logout funksiyasi ishga tushdi"); // Bu konsolda ko‘rinishi kerak
    const isConfirmed = confirm("Chiqmoqchimisiz?");
    if (isConfirmed) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '../index.html';
    } else {
        console.log("Chiqish bekor qilindi");
    }
};

// Menu'ni boshqarish funksiyasi
window.utils.initializeMenu = function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
};