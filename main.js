// Получаем элементы
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

// Функция для показа ошибок валидации
function showValidationErrors() {
    const elements = form.elements;
    
    for (let el of elements) {
        if (el.willValidate) {
            const isValid = el.checkValidity();
            el.setAttribute('aria-invalid', !isValid);
            
            // Показываем кастомные сообщения для определенных ошибок
            if (!isValid) {
                if (el.validity.typeMismatch && el.type === 'email') {
                    el.setCustomValidity('Введите корректный e-mail, например name@example.com');
                } else if (el.validity.patternMismatch && el.id === 'phone') {
                    el.setCustomValidity('Введите телефон в формате: +7 (900) 000-00-00');
                } else if (el.validity.valueMissing) {
                    el.setCustomValidity('Это поле обязательно для заполнения');
                } else {
                    el.setCustomValidity('');
                }
            } else {
                el.setCustomValidity('');
            }
        }
    }
}

// Открытие модалки
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    // Фокусируемся на первом поле формы
    dlg.querySelector('input, select, textarea, button')?.focus();
});

// Закрытие модалки
closeBtn.addEventListener('click', () => {
    dlg.close('cancel');
    form.reset();
    // Сбрасываем состояние ошибок
    const elements = form.elements;
    for (let el of elements) {
        el.removeAttribute('aria-invalid');
        el.setCustomValidity('');
    }
});

// Обработка отправки формы
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Сбрасываем предыдущие ошибки
    const elements = form.elements;
    for (let el of elements) {
        el.setCustomValidity('');
    }
    
    // Проверяем валидность формы
    if (!form.checkValidity()) {
        showValidationErrors();
        form.reportValidity();
        return;
    }
    
    // Если форма валидна - показываем успех и закрываем
    alert('Форма успешно отправлена! Спасибо за обратную связь.');
    dlg.close('success');
    form.reset();
    
    // Сбрасываем состояние ошибок
    for (let el of elements) {
        el.removeAttribute('aria-invalid');
    }
});

// Возвращаем фокус при закрытии модалки
dlg.addEventListener('close', () => {
    lastActive?.focus();
});

// Маска для телефона (дополнительное задание)
const phone = document.getElementById('phone');
phone?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('8')) {
        value = '7' + value.slice(1);
    }
    
    if (value.startsWith('7') && value.length > 1) {
        let formattedValue = '+7 (';
        
        if (value.length > 1) {
            formattedValue += value.slice(1, 4);
        }
        
        if (value.length >= 4) {
            formattedValue += ') ';
        }
        
        if (value.length >= 5) {
            formattedValue += value.slice(4, 7);
        }
        
        if (value.length >= 8) {
            formattedValue += '-' + value.slice(7, 9);
        }
        
        if (value.length >= 10) {
            formattedValue += '-' + value.slice(9, 11);
        }
        
        e.target.value = formattedValue;
    }
});