document.addEventListener('DOMContentLoaded', function() {
    // 1. Кнопка Telegram (переход в мессенджер)
    document.getElementById('telegramBtn')?.addEventListener('click', function() {
        window.location.href = 'https://t.me/mel0n_mod';
    });

    // 2. Улучшенная подсветка активной страницы
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const linkUrl = new URL(link.href, window.location.href);
        const linkPath = linkUrl.pathname;
        
        // Нормализация путей для сравнения
        const cleanCurrentPath = currentPath.replace(/\/$/, '') || '/index.html';
        const cleanLinkPath = linkPath.replace(/\/$/, '');
        
        // Сравниваем базовые имена файлов
        const currentPage = cleanCurrentPath.split('/').pop();
        const linkPage = cleanLinkPath.split('/').pop();
        
        if (currentPage === linkPage || 
            (currentPage === 'index.html' && cleanLinkPath.endsWith('/')) ||
            (linkPage === 'index.html' && cleanCurrentPath.endsWith('/'))) {
            link.classList.add('active');
        }
    });

    // 3. Универсальные кнопки скачивания (с сохранением исходного текста)
    async function setupDownloadButtons() {
        const buttons = document.querySelectorAll('.download-btn');
        
        for (const button of buttons) {
            const file = button.getAttribute('data-file');
            if (!file) continue;

            // Находим элемент с текстом кнопки (сохраняем оригинальный текст)
            const textElement = button.querySelector('.btn-text') || button;
            const originalText = textElement.textContent;

            // Пытаемся получить размер файла
            let sizeMB = '?'; // Значение по умолчанию, если не удалось определить
            try {
                const response = await fetch(file, { method: 'HEAD' });
                if (response.ok) {
                    const sizeBytes = response.headers.get('content-length');
                    if (sizeBytes) {
                        sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
                    }
                }
            } catch (error) {
                console.error(`Ошибка при получении размера ${file}:`, error);
            }

            // Обновляем текст кнопки (добавляем размер в скобки)
            textElement.textContent = `${originalText} (${sizeMB} МБ)`;

            // Обработчик клика для скачивания
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const link = document.createElement('a');
                link.href = file;
                link.download = file.split('/').pop(); // Имя файла из пути
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Анимация нажатия (опционально)
                this.style.transform = 'translateY(2px)';
                setTimeout(() => this.style.transform = '', 100);
            });
        }
    }

    setupDownloadButtons();
});