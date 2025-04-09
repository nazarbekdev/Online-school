document.addEventListener('DOMContentLoaded', () => {
    // Chat sahifasida ekanligimizni tekshirish
    if (window.location.pathname.endsWith('chat.html')) {
        const chatBody = document.getElementById('chat-body');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');

        // Tokenni olish
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // Agar token bo‘lmasa, login sahifasiga yo‘naltirish
        if (!accessToken) {
            window.location.href = 'login.html';
            return;
        }

        // Sanani formatlash funksiyasi (kun-oy-yil)
        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`; // 27.03.2025 formatida qaytarish
        }

        // Chat tarixini yuklash
        async function loadChatHistory() {
            try {
                const response = await fetch(`${config.BASE_URL}/chats/api/chat/history/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.status === 401) {
                    const refreshResponse = await fetch(`${config.BASE_URL}/api/token/refresh/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh: refreshToken }),
                    });

                    const refreshData = await refreshResponse.json();
                    if (refreshResponse.ok) {
                        localStorage.setItem('access_token', refreshData.access);
                        loadChatHistory();
                    } else {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = 'login.html';
                    }
                    return;
                }

                const messages = await response.json();
                if (messages.length > 0) {
                    messages.forEach(msg => {
                        const messageDate = new Date(msg.timestamp);
                        const userTimestamp = messageDate.toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' });
                        const userDate = formatDate(messageDate);
                        addMessage(msg.message, 'user', userTimestamp, userDate);
                        addMessage(msg.reply, 'bot', userTimestamp, userDate);
                    });
                }
            } catch (error) {
                console.error('Chat tarixini yuklashda xato:', error);
                addMessage('Chat tarixini yuklashda xato yuz berdi.', 'bot');
            }
        }

        // Chat xabarini qo‘shish funksiyasi
        function addMessage(content, sender, timestamp = null, date = null) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', sender);
            const messageDate = new Date();
            const messageTimestamp = timestamp || messageDate.toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' });
            const messageFormattedDate = date || formatDate(messageDate);

            // Agar xabar botdan kelayotgan bo‘lsa, Markdown’ni HTML’ga aylantirish
            const formattedContent = sender === 'bot' ? marked.parse(content) : content;

            messageDiv.innerHTML = `
                <div class="message-content">
                    ${formattedContent}
                    <div class="message-timestamp">${messageFormattedDate} | ${messageTimestamp}</div>
                </div>
            `;
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        // Typing animatsiyasini ko‘rsatish
        function showTypingIndicator() {
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('chat-message', 'bot');
            typingIndicator.innerHTML = `
                <div class="message-content">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            chatBody.appendChild(typingIndicator);
            chatBody.scrollTop = chatBody.scrollHeight;
            return typingIndicator;
        }

        // Backend’ga so‘rov yuborish
        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            userInput.value = '';

            const typingIndicator = showTypingIndicator();

            try {
                const response = await fetch(`${config.BASE_URL}/chats/api/chat/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ message }),
                });

                typingIndicator.remove();

                if (response.status === 401) {
                    const refreshResponse = await fetch(`${config.BASE_URL}/api/token/refresh/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh: refreshToken }),
                    });

                    const refreshData = await refreshResponse.json();
                    if (refreshResponse.ok) {
                        localStorage.setItem('access_token', refreshData.access);
                        sendMessage();
                    } else {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = 'login.html';
                    }
                    return;
                }

                const data = await response.json();
                if (response.ok) {
                    addMessage(data.reply, 'bot');
                } else {
                    addMessage('Xatolik yuz berdi: ' + data.error, 'bot');
                }
            } catch (error) {
                typingIndicator.remove();
                console.error('So‘rov yuborishda xato:', error);
                addMessage('Internet ulanmadi yoki server xatosi yuz berdi.', 'bot');
            }
        }

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        loadChatHistory();
    }
});