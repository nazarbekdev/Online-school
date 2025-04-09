document.addEventListener("DOMContentLoaded", function() {
    const authSection = document.getElementById("auth-section");

    // localStorage’dan foydalanuvchi login qilganligini tekshirish
    const accessToken = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (accessToken && role) {
        // Foydalanuvchi login qilgan – user ikonasi ko‘rsatiladi
        authSection.innerHTML = `
            <a href="${role === 'teacher' ? 'teacher/profile.html' : 'student/profile.html'}" class="user-icon">
                <i class="fa-solid fa-user"></i> ${role}
            </a>
        `;
    } else {
        // Foydalanuvchi login qilmagan – standart "Kirish" tugmasi
        authSection.innerHTML = `
            <button class="button_login" onclick="window.location.href='login.html'">
                <i class="fa-solid fa-right-to-bracket"></i> Kirish
            </button>
        `;
    }
});
