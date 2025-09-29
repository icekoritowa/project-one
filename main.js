const KEY = 'theme';
const themeToggle = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function initTheme() {
    if (localStorage.getItem(KEY) === 'dark' || (!localStorage.getItem(KEY) && prefersDark)) {
        document.body.classList.add('theme-dark');
        themeToggle?.setAttribute('aria-pressed', 'true');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');
    themeToggle?.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem(KEY, isDark ? 'dark' : 'light');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('modal--open');
        modal.setAttribute('aria-hidden', 'false');
        const firstFocusable = modal.querySelector('button, input, [tabindex]');
        firstFocusable?.focus();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('modal--open');
        modal.setAttribute('aria-hidden', 'true');
    }
}

function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.site-nav__link');
    navLinks.forEach(link => {
        link.classList.remove('site-nav__link--active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('site-nav__link--active');
        }
    });
}

function initModalCloseHandlers() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('modal--open');
            e.target.setAttribute('aria-hidden', 'true');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal--open');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

function initResponsiveImages() {
    const pictures = document.querySelectorAll('picture');
    pictures.forEach(picture => {
        const img = picture.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}

function initRealEstateModals() {
    const apartmentButtons = document.querySelectorAll('[onclick*="apartment"]');
    apartmentButtons.forEach(btn => {
        const originalOnClick = btn.getAttribute('onclick');
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function() {
            const modalId = originalOnClick.match(/'([^']+)'/)[1];
            openModal(modalId);
        });
    });
}

function handleRealEstateForm(formId, successModalId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!this.checkValidity()) {
            this.reportValidity();
            return;
        }

        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            budget: formData.get('budget'),
            message: formData.get('message')
        };

        console.log('Данные формы:', data);
        openModal(successModalId);
        this.reset();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavigation();
    initModalCloseHandlers();
    initLazyLoading();
    initResponsiveImages();
    initRealEstateModals();
    handleRealEstateForm('contact-form', 'success-modal');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    const modalCloses = document.querySelectorAll('.modal__close, [data-close-modal]');
    modalCloses.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
});