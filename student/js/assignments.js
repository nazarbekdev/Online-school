// API so‘rovlar uchun umumiy funksiya
async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("access_token");
    const defaultOptions = {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        ...options,
    };
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
        throw new Error(`API so'rovda xato: ${response.status}`);
    }
    return response;
}

// Fayl jo‘natish uchun API funksiyasi
async function apiFetchWithFile(url, formData) {
    let token = localStorage.getItem("access_token");

    // Token mavjudligini tekshirish
    if (!token) {
        throw new Error("Token topilmadi. Iltimos, tizimga qayta kiring.");
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.status === 401) {
            // Token muddati o‘tgan bo‘lsa, yangilashga urinamiz
            try {
                token = await refreshAccessToken();
                // Yangi token bilan qayta so‘rov jo‘natish
                const retryResponse = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!retryResponse.ok) {
                    const errorText = await retryResponse.text();
                    throw new Error(`API so'rovda xato: ${retryResponse.status} - ${errorText}`);
                }

                return retryResponse;
            } catch (refreshError) {
                console.error("Tokenni yangilashda xato:", refreshError);
                throw new Error("Tizimga qayta kirish kerak!");
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API so'rovda xato: ${response.status} - ${errorText}`);
        }

        return response;
    } catch (error) {
        console.error("apiFetchWithFile xatosi:", error);
        throw error;
    }
}

// Tokenni yangilash funksiyasi
async function refreshAccessToken() {
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
        window.location.href = '../index.html';
        throw error;
    }
}

// Menyu funksiyasi
function initializeMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

// Chiqish funksiyasi
function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    window.location.href = "../index.html";
}

// Modalni ochish (deadline tekshiruvi qo‘shildi)
function openSubmitModal(materialId) {
    const modal = document.getElementById("submit-assignment-modal");
    if (modal) {
        // Materialni topish uchun materials ro'yxatini ishlatamiz
        loadAssignments().then(() => {
            const materialsResponse = apiFetch(`${config.BASE_URL}/teachers/materials/`);
            materialsResponse.then(response => response.json()).then(materials => {
                const material = materials.find(m => m.id === parseInt(materialId));
                if (material && material.deadline) {
                    const deadline = new Date(material.deadline);
                    const now = new Date();
                    if (deadline < now) {
                        alert("Kechirasiz, bu vazifaning deadline vaqti o‘tib ketgan!");
                        return; // Modal ochilmaydi
                    }
                }
                modal.classList.remove("send-hidden");
                modal.style.display = "flex"; // Qo‘lda display ni o‘rnatish
                const form = document.getElementById("submit-assignment-form");
                if (form) {
                    form.dataset.materialId = materialId;
                } else {
                    console.error("Form elementi topilmadi!");
                }
            }).catch(error => console.error("Materialni yuklashda xato:", error));
        }).catch(error => console.error("loadAssignments chaqirishda xato:", error));
    } else {
        console.error("Modal elementi topilmadi!");
    }
}

// Modalni yopish
function closeModal() {
    const modal = document.getElementById("submit-assignment-modal");
    if (modal) {
        modal.classList.add("send-hidden");
        modal.style.display = "none"; 
        document.getElementById("submit-assignment-form").reset();
    }
}

// Vazifa jo‘natish
async function submitAssignment(event) {
    event.preventDefault();

    const materialId = document.getElementById("submit-assignment-form").dataset.materialId;
    const fileInput = document.getElementById("assignment-file");
    const file = fileInput.files[0];
    const studentId = localStorage.getItem("user_id");

    if (!materialId || !file) {
        alert("Material ID va fayl majburiy!");
        return;
    }

    const formData = new FormData();
    formData.append("material_id", materialId);
    formData.append("file", file);

    try {
        const response = await apiFetchWithFile(`${config.BASE_URL}/students/submit-assignment/`, formData);
        const data = await response.json();
        if (response.ok) {
            alert("Vazifa muvaffaqiyatli jo‘natildi!");
            closeModal();
        } else {
            throw new Error(data.error || "Vazifani jo‘natishda xato yuz berdi.");
        }
    } catch (error) {
        alert(`Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring!`);
    }
}

// Event delegation bilan tugmalarga hodisa qo‘shish
document.addEventListener("DOMContentLoaded", () => {
    initializeMenu();

    // Assignments-grid ichidagi tugmalarga hodisa
    const assignmentsGrid = document.getElementById("assignments-grid");
    if (assignmentsGrid) {
        assignmentsGrid.addEventListener("click", (event) => {
            const button = event.target.closest("button");
            if (button) {
                if (button.textContent.includes("Jo‘natish")) {
                    const materialId = button.getAttribute("data-material-id");
                    if (materialId) {
                        openSubmitModal(materialId);
                    }
                } else if (button.textContent.includes("Yuklab olish")) {
                    const fileUrl = button.getAttribute("data-file-url");
                    if (fileUrl) {
                        downloadAssignment(fileUrl);
                    } else {
                        console.error("File URL topilmadi!");
                    }
                }
            }
        });
    } else {
        console.error("assignments-grid elementi topilmadi!");
    }

    // Formaga hodisa qo‘shish
    const form = document.getElementById("submit-assignment-form");
    if (form) {
        form.addEventListener("submit", submitAssignment);
    } else {
        console.error("submit-assignment-form elementi topilmadi!");
    }

    // Vazifalarni yuklash
    loadAssignments();
});

// Vazifalarni yuklash
async function loadAssignments() {
    try {
        const studentId = localStorage.getItem("user_id");
        if (!studentId) {
            throw new Error("Foydalanuvchi ID topilmadi. Iltimos, tizimga qayta kiring.");
        }

        const subjectsResponse = await apiFetch(`${config.BASE_URL}/courses/student-subject/${studentId}/`);
        const studentSubjects = await subjectsResponse.json();
        if (!studentSubjects.length) {
            throw new Error("Tanlangan fanlar topilmadi.");
        }

        const subjectIds = studentSubjects.map(s => s.subject);
        const classNumber = studentSubjects[0].class_number;

        // Barcha fanlar ro'yxatini olish
        const allSubjectsResponse = await apiFetch(`${config.BASE_URL}/courses/subjects/`);
        const allSubjects = await allSubjectsResponse.json();

        // Fanlar ro'yxatidan ID va nomni olish
        const subjectNames = {};
        allSubjects.forEach(subject => {
            subjectNames[subject.id] = subject.name || `Fan ${subject.id}`; 
        });

        const materialsResponse = await apiFetch(`${config.BASE_URL}/teachers/materials/`);
        const materials = await materialsResponse.json();

        const filteredMaterials = materials.filter(material =>
            material.class_number === classNumber && subjectIds.includes(material.subject)
        );

        const assignmentsGrid = document.getElementById("assignments-grid");
        assignmentsGrid.innerHTML = "";

        if (filteredMaterials.length > 0) {
            filteredMaterials.forEach(material => {
                const assignmentCard = document.createElement("div");
                assignmentCard.className = "assignment-card";
                assignmentCard.innerHTML = `
                    <h4>Fan nomi: ${subjectNames[material.subject] || `Fan ${material.subject}`}</h4>
                    <p>Mavzu: ${material.topic}</p>
                    <p>Muddati: ${material.deadline || "Belgilanmagan"}</p>
                    <button data-material-id="${material.id}" data-file-url="${material.lecture_file || material.presentation_file}">
                        <i class="fas fa-download"></i> Yuklab olish
                    </button>
                    <button data-material-id="${material.id}">
                        <i class="fas fa-upload"></i> Jo‘natish
                    </button>
                `;
                assignmentsGrid.appendChild(assignmentCard);
            });
        } else {
            assignmentsGrid.innerHTML = "<p>Sizning sinf va fanlaringizga mos vazifa topilmadi.</p>";
        }
    } catch (error) {
        console.error("Vazifalarni yuklashda xato:", error);
        document.getElementById("assignments-grid").innerHTML = `<p>Xatolik: ${error.message}</p>`;
    }
}

// Vazifani yuklab olish
async function downloadAssignment(fileUrl) {
    if (fileUrl) {
        window.open(fileUrl, "_blank");
    } else {
        alert("Yuklab olish uchun fayl mavjud emas.");
    }
}