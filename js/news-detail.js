// URL'dan yangilik ID'sini olish
const urlParams = new URLSearchParams(window.location.search);
const newsId = urlParams.get('id');

// DOM elementlari
const newsTitle = document.getElementById('news-title');
const newsImage = document.getElementById('news-image');
const newsMeta = document.getElementById('news-meta');
const newsContent = document.getElementById('news-content');

// Yangilik detallarini yuklash
async function loadNewsDetail() {
    try {
        const response = await fetch(`http://localhost:8000/news/news/${newsId}/`);
        const news = await response.json();

        // Yangilik ma'lumotlarini to'ldirish
        newsTitle.textContent = news.title || 'Yangilik sarlavhasi yo‘q';
        newsImage.src = news.image ? `http://localhost:8000${news.image}` : 'img/blog/Unknown.jpeg';
        newsImage.alt = news.title || 'Yangilik rasmi';
        newsMeta.textContent = news.created_at ? `${new Date(news.created_at).toLocaleDateString('uz-UZ')}, ${news.author || "Noma'lum muallif"}` : "Sana va muallif ma'lum emas";
        newsContent.textContent = news.content || 'Kontent mavjud emas';
    } catch (error) {
        console.error('Yangilik detallarini yuklashda xato:', error);
        newsTitle.textContent = 'Yangilik topilmadi';
        newsImage.src = 'img/blog/Unknown.jpeg';
        newsContent.textContent = "Ma'lumot yuklanmadi. Iltimos, keyinroq urinib ko‘ring.";
    }
}

// Dastlabki yuklash
loadNewsDetail();
