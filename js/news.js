// DOM elementlarini aniqlashdan oldin DOM yuklanishini kutamiz
document.addEventListener('DOMContentLoaded', () => {
    // DOM elementlari
    const categoriesContainer = document.querySelector('.categories');
    const searchInput = document.getElementById('search-input');
    const newsList = document.getElementById('news-list');
    const popularNewsList = document.getElementById('popular-news');

    let selectedCategoryId = null;

    // Elementlar mavjudligini tekshirish
    if (!categoriesContainer || !newsList || !popularNewsList) {
        console.error('DOM elementlari topilmadi: categories, news-list yoki popular-news yo‘q');
        return;
    }

    if (!searchInput) {
        console.error('search-input elementi topilmadi');
        return;
    }

    // Kategoriyalarni yuklash
    async function loadCategories() {
        try {
            const response = await fetch(`${config.BASE_URL}/news/categories/`);
            if (!response.ok) {
                throw new Error(`HTTP xatosi: ${response.status} - ${response.statusText}`);
            }
            const categories = await response.json();
            if (!Array.isArray(categories)) {
                throw new Error('Kategoriyalar massiv formatida emas');
            }
            categoriesContainer.innerHTML = '';
            categories.forEach(category => {
                const button = document.createElement('button');
                button.classList.add('px-4', 'py-2', 'bg-gray-200', 'rounded');
                button.textContent = category.name;
                button.addEventListener('click', () => {
                    document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('bg-gray-400'));
                    button.classList.add('bg-gray-400');
                    selectedCategoryId = category.id;
                    loadNews();
                });
                categoriesContainer.appendChild(button);
            });
        } catch (error) {
            console.error('Kategoriyalarni yuklashda xato:', error);
            categoriesContainer.innerHTML = '<p class="text-red-500">Kategoriyalarni yuklashda xato yuz berdi</p>';
        }
    }

    // Yangiliklarni yuklash
    async function loadNews() {
        try {
            let url = `${config.BASE_URL}/news/news/`;
            const params = new URLSearchParams();
            if (selectedCategoryId) {
                params.append('category_id', selectedCategoryId);
            }
            if (searchInput.value) {
                params.append('search', searchInput.value);
            }
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP xatosi: ${response.status} - ${response.statusText}`);
            }
            const news = await response.json();
            if (!Array.isArray(news)) {
                throw new Error('Yangiliklar massiv formatida emas');
            }
            newsList.innerHTML = '';
            news.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('news-card', 'border', 'p-4', 'rounded-lg');
                div.innerHTML = `
                    <img src="${item.image || 'img/blog/Unknown.jpeg'}" alt="${item.title}" class="w-full h-48 object-cover rounded">
                    <h3 class="text-xl font-bold mt-2">${item.title}</h3>
                    <p class="text-gray-600 mt-1">${item.description}</p>
                    <span class="text-gray-500 text-sm">${new Date(item.created_at).toLocaleDateString('uz-UZ')}, ${item.author}</span>
                    <a href="news-detail.html?id=${item.id}" class="text-blue-500 mt-2 block">Batafsil o‘qish</a>
                `;
                newsList.appendChild(div);
            });
        } catch (error) {
            console.error('Yangiliklarni yuklashda xato:', error);
            newsList.innerHTML = '<p class="text-red-500">Yangiliklarni yuklashda xato yuz berdi</p>';
        }
    }

    // Mashhur yangiliklarni yuklash
    async function loadPopularNews() {
        try {
            const response = await fetch(`${config.BASE_URL}/news/popular-news/`);
            if (!response.ok) {
                throw new Error(`HTTP xatosi: ${response.status} - ${response.statusText}`);
            }
            const popularNews = await response.json();
            if (!Array.isArray(popularNews)) {
                throw new Error('Mashhur yangiliklar massiv formatida emas');
            }
            popularNewsList.innerHTML = '';
            popularNews.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="news-detail.html?id=${item.id}" class="text-blue-500">${item.title}</a>`;
                popularNewsList.appendChild(li);
            });
        } catch (error) {
            console.error('Mashhur yangiliklarni yuklashda xato:', error);
            popularNewsList.innerHTML = '<p class="text-red-500">Mashhur yangiliklarni yuklashda xato yuz berdi</p>';
        }
    }

    // Qidiruv funksiyasi
    searchInput.addEventListener('input', () => {
        loadNews();
    });

    // Dastlabki yuklash
    loadCategories();
    loadNews();
    loadPopularNews();
});