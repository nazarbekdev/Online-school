// Viloyat va tumanlarni yuklash
async function loadRegionsAndDistricts() {
    try {
        const response = await fetch('/uzbekistan-regions.json'); // uzbekistan-regions.json faylini yuklash
        const data = await response.json();
        const regions = data.regions;

        const regionSelect = document.createElement('select');
        regionSelect.id = 'new-region-select';
        const defaultRegionOption = document.createElement('option');
        defaultRegionOption.value = '';
        defaultRegionOption.textContent = 'Viloyatni tanlang';
        regionSelect.appendChild(defaultRegionOption);

        const districtSelect = document.createElement('select');
        districtSelect.id = 'new-district-select';
        const defaultDistrictOption = document.createElement('option');
        defaultDistrictOption.value = '';
        defaultDistrictOption.textContent = 'Tumanni tanlang';
        districtSelect.appendChild(defaultDistrictOption);

        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region.name;
            option.textContent = region.name;
            regionSelect.appendChild(option);
        });

        regionSelect.addEventListener('change', (event) => {
            const selectedRegion = event.target.value;
            districtSelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Tumanni tanlang';
            districtSelect.appendChild(defaultOption);

            if (selectedRegion) {
                const selectedRegionData = regions.find(r => r.name === selectedRegion);
                selectedRegionData.districts.forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
                districtSelect.value = ''; // Tuman qiymatini reset qilish
            }
        });

        // Edit formlarga select'larni qo'shish
        const regionEditForm = document.getElementById('region-edit');
        const districtEditForm = document.getElementById('district-edit');
        regionEditForm.querySelector('input').replaceWith(regionSelect);
        districtEditForm.querySelector('input').replaceWith(districtSelect);

        // Joriy qiymatlarni o'rnatish
        const currentRegion = document.getElementById('student-region').textContent.trim();
        const currentDistrict = document.getElementById('student-district').textContent.trim();

        // uzbekistan-regions.json dagi viloyatlar bilan mosligini tekshirish
        const matchedRegion = regions.find(r => r.name === currentRegion);
        if (matchedRegion) {
            regionSelect.value = matchedRegion.name;
            regionSelect.dispatchEvent(new Event('change')); // Tumanlarni yangilash uchun
            districtSelect.value = currentDistrict; // Tuman qiymatini o'rnatish
        }
    } catch (error) {
        console.error('Viloyat va tumanlarni yuklashda xato:', error);
    }
}

// Student ID'ni olish
const studentId = localStorage.getItem("user_id");

// Profilni yuklash
async function loadProfile() {
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`);
        const data = await response.json();
        if (response.ok) {
            document.getElementById('student-fullname').textContent = `${data.first_name} ${data.last_name}` || 'Noma’lum';
            document.getElementById('student-gender').textContent = data.gender || 'Noma’lum';
            document.getElementById('student-phone').textContent = data.phone_number || 'Noma’lum';
            document.getElementById('student-email').textContent = data.email || 'Noma’lum';
            document.getElementById('student-region').textContent = data.region || 'Noma’lum';
            document.getElementById('student-district').textContent = data.district || 'Noma’lum';
            document.getElementById('student-school').textContent = data.school || 'Noma’lum';
            document.getElementById('student-class').textContent = data.class_id || 'Noma’lum';

            const imageUrl = data.image && !data.image.startsWith('http')
                ? `http://127.0.0.1:8000${data.image}`
                : data.image;
            document.getElementById('student-image').src = imageUrl || 'https://via.placeholder.com/150';

            await loadStudentSubjects();
            document.getElementById('new-fullname').value = `${data.first_name} ${data.last_name}` || '';
            document.getElementById('new-phone').value = data.phone_number || '';
            document.getElementById('new-email').value = data.email || '';
            document.getElementById('new-region').value = data.region || '';
            document.getElementById('new-district').value = data.district || '';
            document.getElementById('new-school').value = data.school || '';
        } else {
            throw new Error(data.error || 'Ma\'lumot yuklanmadi');
        }
        await loadRegionsAndDistricts();
    } catch (error) {
        console.error('Profilni yuklashda xato:', error);
        alert('Ma\'lumot yuklashda xato yuz berdi.');
    }
}

// Student tanlagan fanlarini yuklash
async function loadStudentSubjects() {
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/courses/student-subject/${studentId}/`);
        const studentSubjects = await response.json();
        const subjectsList = document.getElementById('student-subjects');

        if (response.ok && Array.isArray(studentSubjects) && studentSubjects.length > 0) {
            const allSubjectsResponse = await window.utils.apiFetch(`${config.BASE_URL}/courses/subjects/`);
            const allSubjects = await allSubjectsResponse.json();

            subjectsList.innerHTML = studentSubjects.map(studentSubject => {
                const subject = allSubjects.find(s => s.id === studentSubject.subject);
                const subjectName = subject ? subject.name : 'Noma’lum';
                return `<li>${subjectName}, Reyting: ${studentSubject.reyting}</li>`;
            }).join('');
            return studentSubjects.map(s => s.subject); // Tanlangan fanlar ID'larini qaytarish
        } else {
            subjectsList.innerHTML = '<li>Fanlar mavjud emas</li>';
            return []; // Agar fanlar bo'lmasa, bo'sh massiv qaytarish
        }
    } catch (error) {
        console.error('Student fanlarini yuklashda xato:', error);
        const subjectsList = document.getElementById('student-subjects');
        subjectsList.innerHTML = '<li>Fanlar mavjud emas</li>';
        return [];
    }
}

// Fanlar ro'yxatini tahrirlash uchun yuklash
async function loadSubjectsForEdit() {
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/courses/subjects/`);
        if (!response.ok) {
            throw new Error(`Fanlarni yuklashda xato: ${response.status}`);
        }
        const allSubjects = await response.json();
        const studentSubjects = await loadStudentSubjects(); // Tanlangan fanlar ID'lari
        const availableSubjects = allSubjects.filter(subject => !studentSubjects.includes(subject.id));

        const subjectSelect = document.getElementById("new-subject");
        subjectSelect.innerHTML = '<option value="">Fan tanlang...</option>';
        availableSubjects.forEach(subject => {
            const option = document.createElement("option");
            option.value = subject.id;
            option.textContent = subject.name || `Fan ${subject.id}`;
            subjectSelect.appendChild(option);
        });
    } catch (error) {
        alert("Fanlarni yuklashda xato yuz berdi!");
    }
}

// Fan qo'shish formasini ko'rsatish
window.showAddSubjectForm = function () {
    const addSubjectForm = document.getElementById("add-subject-form");
    addSubjectForm.classList.toggle("hidden");
    if (!addSubjectForm.classList.contains("hidden")) {
        loadSubjectsForEdit(); // Formani ochganda fanlar ro'yxatini yuklash
    }
};

// Fan qo'shishni bekor qilish
window.cancelAddSubject = function () {
    const addSubjectForm = document.getElementById("add-subject-form");
    addSubjectForm.classList.add("hidden");
};

// Yangi fan qo'shish
window.saveSubject = async function () {
    const newSubjectId = document.getElementById("new-subject").value;
    if (!newSubjectId) {
        alert("Iltimos, fan tanlang!");
        return;
    }

    // Profil ma'lumotlaridan class_id ni olish
    const profileResponse = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`);
    const profileData = await profileResponse.json();
    const classId = profileData.class_id;

    if (!classId) {
        alert("Sinf ma'lumoti topilmadi!");
        return;
    }

    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/courses/student-subject/`, {
            method: "POST",
            body: JSON.stringify({
                reyting: 0, // Default reyting
                student: parseInt(studentId), // Student ID
                subject: parseInt(newSubjectId), // Tanlangan fan ID'si
                class_number: parseInt(classId) // Joriy sinf ID'si
            }),
        });
        const data = await response.json();
        if (response.ok) {
            await loadStudentSubjects();
            document.getElementById("add-subject-form").classList.add("hidden");
            toggleEdit("subjects");
        } else {
            throw new Error(data.error || "Fanni qo'shishda xato");
        }
    } catch (error) {
        console.error("Fanni qo'shishda xato:", error);
        alert("Fanni qo'shishda xato yuz berdi: ");
    }
};

window.saveRegion = async function() {
    const newRegion = document.getElementById('new-region-select').value;
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`, {
            method: 'PATCH',
            body: JSON.stringify({ region: newRegion }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('student-region').textContent = data.region;
            toggleEdit('region');
        } else {
            throw new Error(data.error || 'Viloyatni yangilashda xato');
        }
    } catch (error) {
        alert('Viloyatni yangilashda xato yuz berdi.');
    }
};

window.saveDistrict = async function() {
    const newDistrict = document.getElementById('new-district-select').value;
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`, {
            method: 'PATCH',
            body: JSON.stringify({ district: newDistrict }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('student-district').textContent = data.district;
            toggleEdit('district');
        } else {
            throw new Error(data.error || 'Tumanni yangilashda xato');
        }
    } catch (error) {
        alert('Tumanni yangilashda xato yuz berdi.');
    }
};

window.toggleEdit = function(field) {
    const editForm = document.getElementById(`${field}-edit`);
    if (editForm) {
        editForm.classList.toggle('hidden');
    }
};

window.cancelEdit = function(field) {
    toggleEdit(field);
};

window.saveImage = async function() {
    const fileInput = document.getElementById('new-image');
    if (fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        try {
            const response = await window.utils.apiFetchWithFile(`${config.BASE_URL}/students/profile/image/`, formData);
            const data = await response.json();
            if (response.ok) {
                const imageUrl = data.image && !data.image.startsWith('http')
                    ? `http://127.0.0.1:8000${data.image}`
                    : data.image;
                document.getElementById('student-image').src = imageUrl || 'https://via.placeholder.com/150';
                toggleEdit('image');
            } else {
                throw new Error(data.error || 'Rasmni yangilashda xato');
            }
        } catch (error) {
            alert('Rasmni yangilashda xato yuz berdi: ' + error.message);
        }
    } else {
        alert('Iltimos, rasm tanlang!');
    }
};

window.saveFullname = async function() {
    const newFullname = document.getElementById('new-fullname').value.split(' ');
    const first_name = newFullname[0] || '';
    const last_name = newFullname[1] || '';
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`, {
            method: 'PATCH',
            body: JSON.stringify({ first_name, last_name }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('student-fullname').textContent = `${data.first_name} ${data.last_name}`;
            toggleEdit('fullname');
        } else {
            throw new Error(data.error || 'Ismni yangilashda xato');
        }
    } catch (error) {
        alert('Ismni yangilashda xato yuz berdi.');
    }
};

window.savePhone = async function() {
    const newPhone = document.getElementById('new-phone').value;
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`, {
            method: 'PATCH',
            body: JSON.stringify({ phone_number: newPhone }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('student-phone').textContent = data.phone_number;
            toggleEdit('phone');
        } else {
            throw new Error(data.error || 'Telefonni yangilashda xato');
        }
    } catch (error) {
        alert('Telefonni yangilashda xato yuz berdi.');
    }
};

window.saveEmail = async function() {
    const newEmail = document.getElementById('new-email').value;
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`, {
            method: 'PATCH',
            body: JSON.stringify({ email: newEmail }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('student-email').textContent = data.email;
            toggleEdit('email');
        } else {
            throw new Error(data.error || 'Emailni yangilashda xato');
        }
    } catch (error) {
        console.error('Emailni yangilashda xato:', error);
        alert('Emailni yangilashda xato yuz berdi.');
    }
};

window.saveSchool = async function() {
    const newSchool = document.getElementById('new-school').value;
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`, {
            method: 'PATCH',
            body: JSON.stringify({ school: newSchool }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('student-school').textContent = data.school;
            toggleEdit('school');
        } else {
            throw new Error(data.error || 'Maktabni yangilashda xato');
        }
    } catch (error) {
        alert('Maktabni yangilashda xato yuz berdi.');
    }
};

window.saveClass = async function() {
    const newClassId = document.getElementById('new-class-select').value;
    if (!newClassId) {
        alert("Iltimos, sinf tanlang!");
        return;
    }
    try {
        const response = await window.utils.apiFetch(`${config.BASE_URL}/students/profile/`, {
            method: 'PATCH',
            body: JSON.stringify({ class_id: newClassId }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('student-class').textContent = data.class_id;
            toggleEdit('class');
            await loadStudentSubjects(); // Sinf o'zgarganidan keyin fanlarni yangilash
        } else {
            throw new Error(data.error || 'Sinfni yangilashda xato');
        }
    } catch (error) {
        alert('Sinfni yangilashda xato yuz berdi.');
    }
};

window.onload = () => {
    loadProfile();
    window.utils.initializeMenu(); // Menu'ni ishga tushirish
};

// Xavfsizlik uchun utils mavjudligini tekshirish
if (typeof window.utils === 'undefined' || typeof window.utils.apiFetch !== 'function') {
    console.error('Xatolik yuz berdi...');
}
