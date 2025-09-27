const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    dlg.querySelector('.form__input')?.focus();
});

closeBtn.addEventListener('click', () => {
    dlg.close('cancel');
    form.reset();
    resetFormErrors();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
        showValidationErrors();
        form.reportValidity();
        return;
    }
    
    alert('Форма успешно отправлена! Спасибо за обратную связь.');
    dlg.close('success');
    form.reset();
    resetFormErrors();
});

dlg.addEventListener('close', () => {
    lastActive?.focus();
});

function showValidationErrors() {
    const elements = form.elements;
    
    for (let el of elements) {
        if (el.willValidate) {
            const isValid = el.checkValidity();
            el.setAttribute('aria-invalid', !isValid);
            
            if (!isValid) {
                if (el.validity.typeMismatch && el.type === 'email') {
                    el.setCustomValidity('Введите корректный e-mail, например name@example.com');
                } else if (el.validity.valueMissing) {
                    el.setCustomValidity('Это поле обязательно для заполнения');
                }
            } else {
                el.setCustomValidity('');
            }
        }
    }
}

function resetFormErrors() {
    const elements = form.elements;
    for (let el of elements) {
        el.removeAttribute('aria-invalid');
        el.setCustomValidity('');
    }
}


const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'theme';

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('theme-dark');
        themeToggle?.setAttribute('aria-pressed', 'true');
        themeToggle.textContent = '☀️ Тема';
    }
}

themeToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('theme-dark');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.textContent = isDark ? '☀️ Тема' : '🌙 Тема';
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
});

document.addEventListener('DOMContentLoaded', initTheme);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});