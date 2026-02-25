async function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    
    // Загружаем все файлы параллельно для скорости
    const promises = Array.from(elements).map(async (element) => {
        const file = element.getAttribute('data-include');
        if (!file) return;
        
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const html = await response.text();
            
            // Если это header или footer, заменяем содержимое
            if (file.includes('header')) {
                element.innerHTML = html;
                // Активируем текущую страницу в меню
                highlightCurrentPage();
            } else if (file.includes('footer')) {
                element.innerHTML = html;
            } else {
                element.innerHTML = html;
            }
            
        } catch (error) {
            console.error(`Ошибка загрузки ${file}:`, error);
            element.innerHTML = `<div style="color: red; padding: 20px;">
                Ошибка загрузки компонента: ${file}
            </div>`;
        }
    });
    
    await Promise.all(promises);
}

// Подсветка текущей страницы в меню
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('header nav a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.fontWeight = 'bold';
            link.style.textDecoration = 'underline';
        }
    });
}

document.addEventListener('DOMContentLoaded', includeHTML);