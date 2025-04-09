const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

// Password visibility toggle
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    pwFields.forEach(password => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });
});

// Toggle between login, signup, and password reset forms
links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    if (link.classList.contains("signup-link")) {
      forms.classList.add("show-signup");
      forms.classList.remove("show-password-reset");
    } else if (link.classList.contains("login-link")) {
      forms.classList.remove("show-signup");
      forms.classList.remove("show-password-reset");
    }
  });
});

// "Parolni unutdingizmi?" havolasini boshqarish
document.querySelector(".forgot-pass").addEventListener("click", e => {
  e.preventDefault();
  forms.classList.add("show-password-reset");
  forms.classList.remove("show-signup");
});

// "Orqaga qaytish" havolasini boshqarish
document.querySelector(".back-to-login").addEventListener("click", e => {
  e.preventDefault();
  forms.classList.remove("show-password-reset");
  document.getElementById("telegram-step").style.display = "none";
  document.getElementById("password-reset-form").reset();
});

// Role-based field toggling and API data loading
document.addEventListener("DOMContentLoaded", function() {
  const roleSelect = document.getElementById("role");
  const talabaFields = document.getElementById("talaba-fields");
  const oqituvchiFields = document.getElementById("oqituvchi-fields");

  function toggleFields() {
    if (roleSelect.value === "student") {
      talabaFields.style.display = "block";
      oqituvchiFields.style.display = "none";
    } else {
      talabaFields.style.display = "none";
      oqituvchiFields.style.display = "block";
    }
  }

  roleSelect.addEventListener("change", toggleFields);
  toggleFields(); // Initial state

  // Sinflarni API'dan yuklash
  async function loadClasses() {
    try {
      const response = await fetch(`${config.BASE_URL}/courses/classes/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("API so'rovda xato: " + response.status);
      const classes = await response.json();
      const classSelect = document.getElementById("class_id");
      classSelect.innerHTML = '<option value="">Sinf tanlang...</option>';
      classes.forEach(classItem => {
        const option = document.createElement("option");
        option.value = classItem.id; // Sinf ID'sini value sifatida ishlatamiz
        option.textContent = classItem.name;
        classSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Sinflarni yuklashda xato:", error);
    }
  }

  // Fanlarni API'dan yuklash (faqat o‘qituvchi uchun)
  async function loadSubjects() {
    try {
      const response = await fetch(`${config.BASE_URL}/courses/subjects/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("API so'rovda xato: " + response.status);
      const subjects = await response.json();
      const subjectSelect = document.getElementById("subject");
      subjectSelect.innerHTML = '<option value="">Fan yo‘nalishini tanlang</option>';
      subjects.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject.id; // Fan ID'sini value sifatida ishlatamiz
        option.textContent = subject.name;
        subjectSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Fanlarni yuklashda xato:", error);
    }
  }

  // Sahifa yuklanganda fanlar va sinflar ro'yxatini yuklash
  loadClasses();
  loadSubjects();
});

// Login API call
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${config.BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Tizimga muvaffaqiyatli kirdingiz!");
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      window.location.href = data.role === "teacher" ? "index.html" : "index.html";
    } else {
      alert("Telefon raqam yoki parol noto\'g\'ri!");
    }
  } catch (error) {
    alert("Nimadur xato bo'ldi. Qaytadan urinib ko'ring!");
  }
});

// Register API call
document.getElementById("register-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const role = document.getElementById("role").value;
  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;
  const phoneNumber = document.getElementById("phone_number").value;
  const password = document.getElementById("password").value;

  let registerData = {
    username: phoneNumber,
    password: password,
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    role: role
  };

  if (role === "student") {
    const region = document.getElementById("region").value;
    const school = document.getElementById("school").value;
    const classId = document.getElementById("class_id").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;

    if (!region || !school || !classId || !gender) {
      alert("Barcha maydonlarni to'ldirish majburiy!");
      return;
    }

    registerData.region = region;
    registerData.school = school;
    registerData.class_id = classId;
    registerData.gender = gender;
  } else if (role === "teacher") {
    const subject = document.getElementById("subject").value;
    if (!subject) {
      alert("Fan tanlash majburiy!");
      return;
    }
    registerData.subject = subject; // Fan ID'sini yuboramiz
  }

  try {
    const response = await fetch(`${config.BASE_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData)
    });

    const data = await response.json();
    if (response.ok) {
      alert("Ro'yxatdan o'tish muvaffaqiyatli!, Endi tizimga kiring!");
      forms.classList.toggle("show-signup"); // Back to login form
    } else {
      alert("Ro'yxatdan o'tishda xatolik yuzaga keldi. Iltimos, qaytadan urinib ko'ring!");
    }
  } catch (error) {
    alert("Nimadur xato bo'ldi. Iltimos, qaytadan urinib ko'ring!");
  }
});

// Password Reset API call
document.getElementById("password-reset-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const phoneNumber = document.getElementById("reset-phone-number").value;

  try {
    const response = await fetch(`${config.BASE_URL}/auth/password-reset/request/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phoneNumber })
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById("password-reset-form").style.display = "none";
      document.getElementById("telegram-step").style.display = "block";
      document.getElementById("telegram-link").href = data.telegram_link;
    } else {
      alert("Xatolik yuz berdi. Iltimos, qaytadan urining!");
    }
  } catch (error) {
    alert("Xato yuz berdi. Iltimos, qaytadan urining.");
  }
});