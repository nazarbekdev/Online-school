function showModal(subject) {
    document.getElementById('modal-title').innerText = subject + ' Testi';
    document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

const texts = [
    "Kelajak muhandislarini bugun yaratamiz!",
    "Mantiq va algoritmlar olamiga qadam qo'ying!",
    "Intellektual imkoniyatlaringizni kashf eting!",
    "Raqamlar va kodlar orqasidagi sehrni o'rganing!",
    "Matematika va algoritmlar bilan kelajagingizni kodlang!"
];

const typingText = document.querySelector(".typing-text");

let textIndex = 0;
let charIndex = 0;

function type() {
if (charIndex < texts[textIndex].length) {
    // Har bir harfni qo'shish
    typingText.textContent += texts[textIndex][charIndex];
    charIndex++;
    setTimeout(type, 100); // Har bir harf orasidagi vaqt
} else {
    // Matn tugagach, keyingi matnni boshlash
    setTimeout(erase, 2000); // 2 soniya kutish
}
}

function erase() {
if (charIndex > 0) {
    // Har bir harfni o'chirish
    typingText.textContent = texts[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, 50); // Har bir harf orasidagi vaqt
} else {
    // Keyingi matnni boshlash
    textIndex = (textIndex + 1) % texts.length; // Matnlar ro'yxatini aylantirish
    setTimeout(type, 500); // 0.5 soniya kutish
}
}

// Dastlabki matnni boshlash
type();