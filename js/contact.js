// DOM elementlari
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

// Elementlar mavjudligini tekshirish
if (!contactForm || !nameInput || !emailInput || !phoneInput || !subjectInput || !messageInput) {
    console.error('Forma elementlari topilmadi');
    alert('Forma elementlari topilmadi. Iltimos, HTML-ni tekshiring.');
} else {
    // Formani yuborish hodisasi
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Standart yuborishni to'xtatish

        // Form ma'lumotlarini yig'ish
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            subject: subjectInput.value,
            message: messageInput.value
        };

        try {
            const response = await fetch(`${config.BASE_URL}/contacts/contact-request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.status === 201) {
                alert('So‘rov muvaffaqiyatli yuborildi!');
                contactForm.reset(); // Formani tozalash
            } else if (response.status === 401) {
                alert('Autentifikatsiya xatosi: Iltimos, tizimga kiring.');
            } else if (response.status === 400) {
                alert('Forma ma’lumotlarida xato: ' + JSON.stringify(result));
            } else {
                alert('Xatolik yuz berdi: ' + response.statusText);
            }
        } catch (error) {
            console.error('So‘rov yuborishda xato:', error);
            alert('Internet ulanmadi yoki server xatosi yuz berdi: ' + error.message);
        }
    });
}