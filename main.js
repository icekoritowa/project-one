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
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('site-nav__link--active');
        }
    });
}

function initBreadcrumbs() {
    const currentPage = window.location.pathname.split('/').pop();
    const breadcrumbLinks = document.querySelectorAll('.breadcrumbs__link');
    
    breadcrumbLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

function initModalCloseHandlers() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
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
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

function initRealEstateModals() {
    const apartmentButtons = document.querySelectorAll('[data-apartment]');
    apartmentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-apartment');
            openModal(modalId);
        });
    });

    const consultButtons = document.querySelectorAll('[data-consult]');
    consultButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            openModal('consult-modal');
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
            message: formData.get('message'),
            page: window.location.pathname
        };

        console.log('Форма отправлена:', data);
        
        // Имитация отправки на сервер
        setTimeout(() => {
            openModal(successModalId);
            this.reset();
        }, 1000);
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
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
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            type: formData.get('type')
        };

        console.log('Контактная форма:', data);
        
        setTimeout(() => {
            openModal('success-modal');
            this.reset();
        }, 1000);
    });
}

function initCatalogFilters() {
    const filterForm = document.getElementById('catalog-filters');
    if (!filterForm) return;

    filterForm.addEventListener('change', function() {
        const formData = new FormData(this);
        const filters = {
            type: formData.get('type'),
            price: formData.get('price'),
            rooms: formData.get('rooms')
        };
        
        console.log('Фильтры каталога:', filters);
        // Здесь будет фильтрация карточек
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavigation();
    initBreadcrumbs();
    initModalCloseHandlers();
    initLazyLoading();
    initRealEstateModals();
    initContactForm();
    initCatalogFilters();
    
    // Основная форма на главной
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

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});