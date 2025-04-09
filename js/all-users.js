document.addEventListener("DOMContentLoaded", function () {
    // API'dan ma'lumotlarni olish funksiyasi
    async function fetchData() {
        try {
            // 1. Barcha foydalanuvchilarni olish
            const allUsersResponse = await fetch(`${config.BASE_URL}/auth/all/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!allUsersResponse.ok) {
                throw new Error(`All users so'rovida xato: ${allUsersResponse.status}`);
            }
            const allUsersData = await allUsersResponse.json();

            // 2. Offline studentlarni olish
            const offlineResponse = await fetch(`${config.BASE_URL}/courses/offline-student/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!offlineResponse.ok) {
                throw new Error(`Offline students so'rovida xato: ${offlineResponse.status}`);
            }
            const offlineData = await offlineResponse.json();

            // Offline studentlar sonini aniqlash
            const offlineCount = offlineData.length > 0 && offlineData[0].count !== undefined ? offlineData[0].count : 0;

            // Foydalanuvchilarni rollarga ko'ra hisoblash
            let teacherCount = 0;
            let studentCount = 0;
            let onlineCount = 0;

            if (Array.isArray(allUsersData)) {
                allUsersData.forEach(user => {
                    if (user.role === 'teacher') {
                        teacherCount++;
                    } else if (user.role === 'student') {
                        studentCount++;
                        // Online studentlarni aniqlash uchun qo'shimcha logika
                        if (user.phone_number && user.phone_number.startsWith('+998')) {
                            onlineCount++;
                        }
                    }
                });
            } else {
                throw new Error("All users data array emas!");
            }

            // Ma'lumotlarni HTML ga yozish
            document.getElementById('teacher-count').textContent = teacherCount;
            document.getElementById('student-count').textContent = studentCount + offlineCount;
            document.getElementById('online-count').textContent = studentCount;
            document.getElementById('offline-count').textContent = offlineCount;

        } catch (error) {
            console.error("Ma'lumot olishda xatolik:", error);
            // Xatolik holatida default qiymatlarni qo'yish
            document.getElementById('teacher-count').textContent = 'N/A';
            document.getElementById('student-count').textContent = 'N/A';
            document.getElementById('online-count').textContent = 'N/A';
            document.getElementById('offline-count').textContent = 'N/A';
        }
    }

    // Ma'lumotlarni yuklash
    fetchData();
});