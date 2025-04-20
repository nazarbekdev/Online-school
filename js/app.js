// app.js

// Sahifalarni dinamik yuklash uchun HTML kontent
const routes = {
    '/': `
        <!-- banner part start-->
        <section class="banner_part">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 col-xl-6">
                        <div class="banner_text">
                            <div class="banner_text_iner">
                                <h5>Har bir bola o'rganishni orzu qiladi</h5>
                                <h1>Farzandlaringizni dunyoni yaxshiroq qilishga tayyorlang</h1>
                                <p>Bolalarning qiziqishlari cheksiz va biz ularni har tomonlama qo‘llab-quvvatlashga tayyormiz.
                                    Zamonaviy darslar, ilg‘or o‘qitish usullari va interaktiv o‘quv materiallari bilan ta’lim
                                    olish yanada qiziqarli va samarali bo‘ladi!</p>
                                <a href="/cource" class="btn_1">Kursga o'tish</a>
                                <a href="/test" class="btn_2">Test yechish</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- banner part start-->

        <!-- feature_part start-->
        <section class="feature_part">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6 col-xl-3 align-self-center">
                        <div class="single_feature_text">
                            <h2>Ajoyib <br> Imkoniyatlar</h2>
                            <p>Ixtisoslashgan maktabda sifatli ta’lim olish va kelajagingizni shakllantirish uchun ajoyib
                                imkoniyatlar ochiladi. Kelib, o‘zingizni rivojlantiring!</p>
                            <a href="/blog" class="btn_1">Batafsil</a>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="single_feature">
                            <div class="single_feature_part">
                                <span class="single_feature_icon"><i class="ti-stats-up"></i></span>
                                <h4>Sifatli Ta’lim</h4>
                                <p>Ilg‘or usullar, innovatsion darsliklar va sun’iy intellekt texnologiyalari bilan ta’lim
                                    oling. Kelajakda muvaffaqiyatga erishish uchun mustahkam asos quring va zamonaviy bilimlarga
                                    ega bo‘ling!</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="single_feature">
                            <div class="single_feature_part">
                                <span class="single_feature_icon"><i class="ti-user"></i></span>
                                <h4>Malakali O‘qituvchilar</h4>
                                <p>Tajribali va malakali o‘qituvchilar sizga bilim va ko‘nikmalarni o‘zlashtirishda yordam
                                    beradi. Sizni kelajakka tayyorlaymiz!</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="single_feature">
                            <div class="single_feature_part single_feature_part_2">
                                <span class="single_service_icon style_icon"><i class="ti-briefcase"></i></span>
                                <h4>Martaba Imkoniyatlari</h4>
                                <p>Ixtisoslashgan maktab bitiruvchilari uchun yuqori martaba imkoniyatlari va professional
                                    darajaga chiqish uchun yo‘l ochiladi!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- feature_part end-->

        <!-- learning part start-->
        <section class="learning_part">
            <div class="container">
                <div class="row align-items-sm-center align-items-lg-stretch">
                    <div class="col-md-7 col-lg-7">
                        <div class="learning_img">
                            <img src="img/learning_img.png" alt="Ixtisoslashgan maktab ta'limi">
                        </div>
                    </div>
                    <div class="col-md-5 col-lg-5">
                        <div class="learning_member_text">
                            <h5>Biz Haqimizda</h5>
                            <h2>Zamonaviy Bilimlar Dunyosi</h2>
                            <p>Ixtisoslashgan maktab sifatli ta’lim bilan birga sun’iy intellekt texnologiyalarini joriy qiladi.
                                O‘quvchilarimizni kelajakka tayyorlash uchun innovatsion yondashuvlar va ilhomli muhitni taqdim
                                etamiz.</p>
                            <ul>
                                <li><span class="ti-book"></span>Sun’iy intellekt yordamida individual o‘qish rejalari tuzamiz.</li>
                                <li><span class="ti-microphone"></span>Tajribali o‘qituvchilar bilan interaktiv darslar o‘tkazamiz.</li>
                            </ul>
                            <a href="/cource" class="btn_1">Batafsil</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- learning part end-->

        <!-- member_counter counter start -->
        <section class="member_counter" id="member-counter-section">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3 col-sm-6">
                        <div class="single_member_counter">
                            <span class="counter" id="teacher-count">0</span>
                            <h4>Barcha O‘qituvchilar</h4>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="single_member_counter">
                            <span class="counter" id="student-count">0</span>
                            <h4>Barcha O‘quvchilar</h4>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="single_member_counter">
                            <span class="counter" id="online-count">0</span>
                            <h4>Online O‘quvchilar</h4>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="single_member_counter">
                            <span class="counter" id="offline-count">0</span>
                            <h4>Offline O‘quvchilar</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- member_counter counter end -->

        <!-- learning part start-->
        <section class="advance_feature learning_part">
            <div class="container">
                <div class="row align-items-sm-center align-items-xl-stretch">
                    <div class="col-md-6 col-lg-6">
                        <div class="learning_member_text">
                            <h5>Ilg‘or Imkoniyatlar</h5>
                            <h2>Bizning Sun’iy Intellektga Asoslangan Ta’lim Tizim</h2>
                            <p>Ixtisoslashgan maktab sifatli ta’lim bilan birga sun’iy intellekt texnologiyalari joriy qilgan
                                ilg‘or tizimni taqdim etadi. O‘quvchilarimizni kelajakka tayyorlash uchun innovatsion
                                yondashuvlar va zamonaviy bilimlarni birlashtiramiz.</p>
                            <div class="row">
                                <div class="col-sm-6 col-md-12 col-lg-6">
                                    <div class="learning_member_text_iner">
                                        <span class="ti-desktop"></span>
                                        <h4>Har Yerda O‘rganing</h4>
                                        <p>Sun’iy intellekt yordamida onlayn platformalar orqali istalgan joyda ta’lim oling va
                                            bilimlaringizni rivojlantiring.</p>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-12 col-lg-6">
                                    <div class="learning_member_text_iner">
                                        <span class="ti-user"></span>
                                        <h4>Malakali O‘qituvchilar</h4>
                                        <p>Tajribali o‘qituvchilar va sun’iy intellekt vositalari bilan interaktiv darslar
                                            orqali bilimlarni chuqurlashtiring.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6">
                        <div class="learning_img">
                            <img src="img/advance_feature_img.png" alt="Sun’iy intellektli ta’lim tizimi">
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- learning part end-->
    `,
    '/cource': `
        <!-- Course part start-->
        <div class="container-course">
            <!-- Fanlar va sinflar -->
            <br><br><br>
            <div class="filters">
                <div class="subjects">
                    <h2>Fanlar</h2>
                    <div class="buttons-row">
                        <!-- Fanlar dinamik yuklanadi -->
                    </div>
                </div>

                <div class="grades">
                    <h2>Sinflar</h2>
                    <div class="buttons-row">
                        <!-- Sinflar dinamik yuklanadi -->
                    </div>
                </div>
            </div>

            <!-- Mavzular ro'yxati va kontent -->
            <div class="content-container">
                <!-- Chap tomon: Mavzular ro'yxati -->
                <div class="topics-list">
                    <h4>Mavzular ro'yxati</h4>
                    <ul id="topics"></ul>
                </div>

                <!-- O'ng tomon: Mavzu kontenti -->
                <div class="content-area">
                    <h4 id="topic-title">Mavzu tanlang...</h4>
                    <div id="video-container"></div>
                    <div id="description"></div>
                    <div class="action-buttons" style="display: none; margin-top: 20px;">
                        <button id="test-button" class="action-btn">Test yechish</button>
                        <button id="lecture-button" class="action-btn">Maruza matni</button>
                        <button id="presentation-button" class="action-btn">Taqdimot</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Course part end-->
    `,
    '/test': `
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <main>
            <div class="container-test">
                <h1 class="title-test">Test Yechish</h1>
                <div class="test-form">
                    <!-- Test turi -->
                    <div class="form-group">
                        <label for="test-type">Test turi</label>
                        <div class="dropdown">
                            <button class="dropdown-btn" id="test-type-btn">Test turini tanlang</button>
                            <div class="dropdown-content" id="test-type-options">
                                <div class="option" data-value="MOCK">MOCK</div>
                                <div class="option" data-value="DTM">DTM</div>
                                <div class="option" data-value="Fanga oid">Fanga oid</div>
                            </div>
                        </div>
                    </div>

                    <!-- Sinf (Fanga oid uchun) -->
                    <div class="form-group hidden" id="class-group">
                        <label for="class-select">Sinf</label>
                        <div class="dropdown">
                            <button class="dropdown-btn" id="class-btn">Sinf tanlang</button>
                            <div class="dropdown-content" id="class-options">
                                <!-- Sinflar dinamik tarzda qo‘shiladi -->
                            </div>
                        </div>
                    </div>

                    <!-- Fan -->
                    <div class="form-group hidden" id="subject-group">
                        <label for="subject-select">Fan</label>
                        <div class="dropdown">
                            <button class="dropdown-btn" id="subject-btn">Fan tanlang</button>
                            <div class="dropdown-content" id="subject-options">
                                <!-- Fanlar dinamik tarzda qo‘shiladi -->
                            </div>
                        </div>
                    </div>

                    <!-- Variant -->
                    <div class="form-group hidden" id="variant-group">
                        <label for="variant-select">Variant</label>
                        <div class="dropdown">
                            <button class="dropdown-btn" id="variant-btn">Variant tanlang</button>
                            <div class="dropdown-content" id="variant-options">
                                <!-- Variantlar dinamik tarzda qo‘shiladi -->
                            </div>
                        </div>
                    </div>

                    <!-- Chorak (Fanga oid uchun) -->
                    <div class="form-group hidden" id="quarter-group">
                        <label for="quarter-select">Chorak</label>
                        <div class="dropdown">
                            <button class="dropdown-btn" id="quarter-btn">Chorak tanlang</button>
                            <div class="dropdown-content" id="quarter-options">
                                <div class="option" data-value="I chorak">I chorak</div>
                                <div class="option" data-value="II chorak">II chorak</div>
                                <div class="option" data-value="III chorak">III chorak</div>
                                <div class="option" data-value="IV chorak">IV chorak</div>
                            </div>
                        </div>
                    </div>

                    <!-- Boshlash tugmasi -->
                    <button class="start-btn hidden" id="start-btn" onclick="startTest()">Boshlash</button>
                </div>
            </div>
        </main>
    `,
    '/blog': `
        <!-- News page start-->
        <section class="container mx-auto p-4">
            <!-- Hero Section -->
            <br><br><br>
            <div class="hero mb-8">
                <h2 class="text-3xl font-bold mt-4">Eng so‘nggi yangiliklar</h2>
            </div>

            <!-- Filtrlash va Qidiruv -->
            <div class="flex justify-between items-center mb-6">
                <div class="categories flex space-x-2">
                    <!-- Kategoriyalar dinamik yuklanadi -->
                </div>
                <input type="text" id="search-input" placeholder="Yangilik qidirish..." class="border px-4 py-2 rounded">
            </div>

            <!-- Yangiliklar Ro‘yxati -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="news-list">
                <!-- Yangiliklar dinamik yuklanadi -->
            </div>

            <!-- Yon Panel (Sidebar) -->
            <div class="mt-8 border p-4 rounded-lg">
                <h3 class="text-2xl font-bold">Mashhur yangiliklar</h3>
                <ul class="mt-2" id="popular-news">
                    <!-- Mashhur yangiliklar dinamik yuklanadi -->
                </ul>
            </div>
        </section>
        <!-- News page end-->
    `,
    '/news-detail': `
        <section class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4" id="news-title"></h1>
            <img id="news-image" class="w-full h-96 object-cover rounded mb-4" alt="Yangilik rasmi">
            <p class="text-gray-500 mb-2" id="news-meta"></p>
            <div class="prose max-w-none mb-4" id="news-content"></div>
            <a href="/blog" class="text-blue-500">Orqaga qaytish</a>
        </section>
    `,
    '/chat': `
        <br><br><br><br><br>
        <!-- Chat oynasi start -->
        <div class="chat-container">
            <div class="chat-header">
                <div class="chat-header-content">
                    <h2>Yordam xizmati</h2>
                    <span class="status-indicator"></span>
                </div>
                <!-- Sana uchun element -->
                <div><ul>Online</ul></div>
            </div>
            <div class="chat-body" id="chat-body">
                <!-- Chat tarixi bu yerda ko‘rsatiladi -->
            </div>
            <div class="chat-footer">
                <input type="text" id="user-input" placeholder="Savolingizni kiriting...">
                <button id="send-btn">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                    </svg>
                </button>
            </div>
        </div>
        <!-- Chat oynasi end-->
    `,
    '/contact': `
        <!-- ================ contact section start ================= -->
        <br><br>
        <div class="container-contact">
            <h3>BOG'LANISH</h3>
            
            <!-- Contact Info Container -->
            <div class="contact-info">
                <!-- 1-ustun: Ish vaqti -->
                <div class="info-column">
                    <div class="work-time">
                        <h3>Ish vaqti</h3>
                        <div class="days">
                            <span>Du</span>
                            <span>Se</span>
                            <span>Cho</span>
                            <span>Pa</span>
                            <span>Ju</span>
                            <span class="inactive">Sha</span>
                            <span class="inactive">Ya</span>
                        </div>
                        <p><b>9:00 dan 18:00 gacha</b></p>
                        <p>Tushlik: 13:00 dan 14:00 gacha</p>
                    </div>
                </div>

                <!-- 2-ustun: Manzil va Telefon -->
                <div class="info-column">
                    <p><i class="fa fa-map-marker"></i> 111600, Toshkent viloyati Chinoz tumani, Beshkapa MFY</p>
                    <p><i class="fa fa-phone"></i> +998 97 195 31 31</p>
                </div>

                <!-- 3-ustun: Email va Transport -->
                <div class="info-column">
                    <p><i class="fa fa-envelope"></i> muhriddin.maktab@gmail.com</p>
                    <p><i class="fa fa-phone"></i> +998 97 609 11 19</p>
                </div>
            </div><br>

            <div class="form-map">
                <form id="contactForm">
                    <h3>Saytga so'rov yuborish</h3>
                    <input type="text" id="name" placeholder="Ism" required>
                    <input type="email" id="email" placeholder="Email" required>
                    <input type="tel" id="phone" placeholder="Telefon raqami (+998901234567)" pattern="\+998[0-9]{9}" required>
                    <input type="text" id="subject" placeholder="Mavzu" required>
                    <textarea id="message" placeholder="Xabar" required></textarea>
                    <button type="submit">Yuborish</button>
                </form>

                <div class="map-container">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6186.128768756129!2d68.74626!3d40.9253878!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38adddbc1e0e7987%3A0xe8b2dce612233282!2sChinoz%20tuman%20ixtisoslashtirilgan%20maktabi!5e1!3m2!1sen!2s!4v1743763033292!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </div>
        <!-- ================ contact section end ================= -->
    `,
    '/login': `
        <section class="container forms">
            <!-- Login Form -->
            <div class="form login">
                <div class="form-content">
                    <header>Kirish</header>
                    <form id="login-form">
                        <div class="field input-field">
                            <input type="text" id="login-username" placeholder="Telefon raqam yoki Email" class="input" required>
                        </div>
                        <div class="field input-field">
                            <input type="password" id="login-password" placeholder="Parol" class="password" required>
                            <i class='bx bx-hide eye-icon'></i>
                        </div>
                        <div class="form-link">
                            <a href="/password-reset" class="forgot-pass">Parolni unutdingizmi?</a>
                        </div>
                        <div class="field button-field">
                            <button type="submit">Kirish</button>
                        </div>
                    </form>
                    <div class="form-link">
                        <span>Hisobingiz yo‘qmi? <a href="/signup" class="link signup-link">Ro'yxatdan o'tish</a></span>
                    </div>
                </div>
            </div>
        </section>
    `,
    '/signup': `
        <section class="container forms">
            <!-- Signup Form -->
            <div class="form signup">
                <div class="form-content">
                    <header>Ro'yxatdan O'tish</header>
                    <form id="register-form">
                        <!-- Role tanlash -->
                        <div class="field input-field">
                            <label>Rolingiz:</label>
                            <select id="role" name="role" required>
                                <option value="student">Talaba</option>
                                <option value="teacher">O‘qituvchi</option>
                            </select>
                        </div>

                        <!-- Umumiy maydonlar -->
                        <div class="field input-field">
                            <input type="text" id="first_name" placeholder="Ism" required>
                        </div>
                        <div class="field input-field">
                            <input type="text" id="last_name" placeholder="Familiya" required>
                        </div>
                        <div class="field input-field">
                            <input type="tel" id="phone_number" placeholder="Telefon raqam +998901234567" required>
                        </div>
                        <div class="field input-field">
                            <input type="password" id="password" placeholder="Parol" class="password" required>
                            <i class='bx bx-hide eye-icon'></i>
                        </div>

                        <!-- Faqat talaba uchun -->
                        <div id="talaba-fields">
                            <div class="field input-field">
                                <select id="region">
                                    <option value="">Viloyatni tanlang</option>
                                    <option value="Toshkent shahri">Toshkent shahri</option>
                                    <option value="Toshkent viloyati">Toshkent viloyati</option>
                                    <option value="Andijon">Andijon</option>
                                    <option value="Buxoro">Buxoro</option>
                                    <option value="Farg‘ona">Farg‘ona</option>
                                    <option value="Jizzax">Jizzax</option>
                                    <option value="Qashqadaryo">Qashqadaryo</option>
                                    <option value="Navoiy">Navoiy</option>
                                    <option value="Namangan">Namangan</option>
                                    <option value="Samarqand">Samarqand</option>
                                    <option value="Sirdaryo">Sirdaryo</option>
                                    <option value="Surxondaryo">Surxondaryo</option>
                                    <option value="Xorazm">Xorazm</option>
                                    <option value="Qoraqalpog‘iston Respublikasi">Qoraqalpog‘iston Respublikasi</option>
                                </select>
                            </div>
                            <div class="field input-field">
                                <input type="text" id="school" placeholder="Maktab">
                            </div>
                            <div class="field input-field">
                                <select id="class_id">
                                    <option value="">Sinf tanlang...</option>
                                    <!-- Sinflar API’dan yuklanadi -->
                                </select>
                            </div>
                            <div class="field input-field gender-field">
                                <label>Jins:</label>
                                <div class="gender-options">
                                    <label><input type="radio" name="gender" value="Erkak"> Erkak</label>
                                    <label><input type="radio" name="gender" value="Ayol"> Ayol</label>
                                </div>
                            </div>
                        </div>

                        <!-- Faqat o‘qituvchi uchun -->
                        <div id="oqituvchi-fields">
                            <div class="field input-field">
                                <select id="subject">
                                    <option value="">Fan yo‘nalishini tanlang</option>
                                    <!-- Fanlar API’dan yuklanadi -->
                                </select>
                            </div>
                        </div>

                        <!-- Ro‘yxatdan o‘tish tugmasi -->
                        <div class="field button-field">
                            <button type="submit">Ro'yxatdan o'tish</button>
                        </div>
                    </form>

                    <div class="form-link">
                        <span>Hisobingiz bormi? <a href="/" class="link login-link">Tizimga kirish</a></span>
                    </div>
                </div>
            </div>
        </section>
    `,
    '/password-reset': `
        <section class="container forms">
            <!-- Password Reset Form -->
            <div class="form password-reset">
                <div class="form-content">
                    <header>Parolni Tiklash</header>
                    <form id="password-reset-form">
                        <div class="field input-field">
                            <input type="tel" id="reset-phone-number" placeholder="Telefon raqam (+998901234567)" required>
                        </div>
                        <div class="field button-field">
                            <button type="submit">Keyingi</button>
                        </div>
                    </form>
                    <div id="telegram-step" style="display: none;">
                        <p>Telegram bot orqali parolni tiklash uchun quyidagi linkka o‘ting:</p>
                        <a id="telegram-link" href="#" target="_blank">Telegram Botga O‘tish</a>
                        <p>Botda jarayonni davom ettiring.</p>
                        <div class="form-link">
                            <a href="/" class="back-to-login">Orqaga qaytish</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `
};

// Sahifani yuklash funksiyasi
function loadPage() {
    const path = window.location.pathname;
    const content = routes[path] || routes['/']; // Agar yo'l topilmasa, asosiy sahifaga qaytish
    document.getElementById('app').innerHTML = content;

    // Har bir sahifa yuklanganda event listener'larni qayta sozlash
    setupEventListeners();
}

// Event listener'larni sozlash
function setupEventListeners() {
    // Navbar havolalari uchun
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const href = link.getAttribute("href");
            window.history.pushState({}, '', href);
            loadPage();
        });
    });

    // Banner va boshqa havolalar uchun
    const internalLinks = document.querySelectorAll("a[href^='/']");
    internalLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const href = link.getAttribute("href");
            window.history.pushState({}, '', href);
            loadPage();
        });
    });

    // all-users.js va check-login.js skriptlarini qayta ishga tushirish
    if (typeof updateUserCounts === 'function') {
        updateUserCounts(); // all-users.js ichidagi funksiya
    }
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus(); // check-login.js ichidagi funksiya
    }

    // Counter animatsiyasini qayta ishga tushirish
    if (typeof jQuery !== 'undefined') {
        $('.counter').counterUp({
            delay: 10,
            time: 1000
        });
    }

    // Kurslar sahifasi uchun course.js funksiyalarini qayta ishga tushirish
    if (window.location.pathname === '/cource' && typeof loadSubjects === 'function') {
        loadSubjects();
        loadClasses();
        loadTopics();
    }

    // Testlar sahifasi uchun home-script.js funksiyalarini qayta ishga tushirish
    if (window.location.pathname === '/test' && typeof setupDropdowns === 'function') {
        setupDropdowns();
        loadClasses();
        loadSubjects();
        loadVariants();
    }

    // Yangiliklar sahifasi uchun news.js funksiyalarini qayta ishga tushirish
    if (window.location.pathname === '/blog' && typeof loadNews === 'function') {
        loadNews();
        loadCategories();
        loadPopularNews();
    }

    // Yangilik batafsil sahifasi uchun news-detail.js funksiyalarini qayta ishga tushirish
    if (window.location.pathname === '/news-detail' && typeof loadNewsDetail === 'function') {
        loadNewsDetail();
    }

    // Chat sahifasi uchun chat.js funksiyalarini qayta ishga tushirish
    if (window.location.pathname === '/chat' && typeof initializeChat === 'function') {
        initializeChat();
    }

    // Aloqa sahifasi uchun contact.js funksiyalarini qayta ishga tushirish
    if (window.location.pathname === '/contact' && typeof setupContactForm === 'function') {
        setupContactForm();
    }

    // Login, Signup, Password Reset sahifalari uchun login.js funksiyalarini qayta ishga tushirish
    if (['/login', '/signup', '/password-reset'].includes(window.location.pathname)) {
        // Password visibility toggle
        const pwShowHide = document.querySelectorAll(".eye-icon");
        pwShowHide.forEach(eyeIcon => {
            eyeIcon.addEventListener("click", () => {
                let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
                pwFields.forEach(password => {
                    if (password.type === "password") {
                        password.type = "text";
                        eyeIcon.classList.replace("bx-hide", "bx-show");
                    } else {
                        password.type = "password";
                        eyeIcon.classList.replace("bx-show", "bx-hide");
                    }
                });
            });
        });

        // Toggle between login, signup, and password reset forms
        const links = document.querySelectorAll(".link");
        links.forEach(link => {
            link.addEventListener("click", e => {
                e.preventDefault();
                const href = link.getAttribute("href");
                window.history.pushState({}, '', href);
                loadPage();
            });
        });

        // "Parolni unutdingizmi?" havolasini boshqarish
        const forgotPassLink = document.querySelector(".forgot-pass");
        if (forgotPassLink) {
            forgotPassLink.addEventListener("click", e => {
                e.preventDefault();
                window.history.pushState({}, '', '/password-reset');
                loadPage();
            });
        }

        // "Orqaga qaytish" havolasini boshqarish
        const backToLoginLink = document.querySelector(".back-to-login");
        if (backToLoginLink) {
            backToLoginLink.addEventListener("click", e => {
                e.preventDefault();
                window.history.pushState({}, '', '/');
                loadPage();
            });
        }

        // Role-based field toggling
        const roleSelect = document.getElementById("role");
        if (roleSelect) {
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
        }

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
                if (classSelect) {
                    classSelect.innerHTML = '<option value="">Sinf tanlang...</option>';
                    classes.forEach(classItem => {
                        const option = document.createElement("option");
                        option.value = classItem.id;
                        option.textContent = classItem.name;
                        classSelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error("Sinflarni yuklashda xato:", error);
            }
        }

        // Fanlarni API'dan yuklash
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
                if (subjectSelect) {
                    subjectSelect.innerHTML = '<option value="">Fan yo‘nalishini tanlang</option>';
                    subjects.forEach(subject => {
                        const option = document.createElement("option");
                        option.value = subject.id;
                        option.textContent = subject.name;
                        subjectSelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error("Fanlarni yuklashda xato:", error);
            }
        }

        // Sahifa yuklanganda fanlar va sinflar ro'yxatini yuklash
        loadClasses();
        loadSubjects();

        // Login API call
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", async function(e) {
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
                        window.history.pushState({}, '', data.role === "teacher" ? '/teacher-dashboard' : '/student-dashboard');
                        loadPage();
                    } else {
                        alert("Telefon raqam yoki parol noto'g'ri!");
                    }
                } catch (error) {
                    alert("Nimadur xato bo'ldi. Qaytadan urinib ko'ring!");
                }
            });
        }

        // Register API call
        const registerForm = document.getElementById("register-form");
        if (registerForm) {
            registerForm.addEventListener("submit", async function(e) {
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
                    registerData.subject = subject;
                }

                try {
                    const response = await fetch(`${config.BASE_URL}/auth/register/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(registerData)
                    });

                    const data = await response.json();
                    if (response.ok) {
                        alert("Ro'yxatdan o'tish muvaffaqiyatli! Endi tizimga kiring!");
                        window.history.pushState({}, '', '/');
                        loadPage();
                    } else {
                        alert("Ro'yxatdan o'tishda xatolik yuzaga keldi. Iltimos, qaytadan urinib ko'ring!");
                    }
                } catch (error) {
                    alert("Nimadur xato bo'ldi. Iltimos, qaytadan urinib ko'ring!");
                }
            });
        }

        // Password Reset API call
        const passwordResetForm = document.getElementById("password-reset-form");
        if (passwordResetForm) {
            passwordResetForm.addEventListener("submit", async function(e) {
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
        }
    }
}

// Sahifa yuklanganda va URL o'zgarganda
window.addEventListener('popstate', loadPage);
document.addEventListener('DOMContentLoaded', loadPage);