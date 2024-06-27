"use strict";

window.addEventListener('load', () => {
    const modalThanks = document.querySelector('.modal_thanks'),
        fade = document.querySelector('.fade'),
        modal = document.querySelector('.modal');

    document.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('header__call-link')) {
            event.preventDefault(); // Отменяем действие по умолчанию (переход по ссылке)
            fade.style.display = 'block';
            modal.style.display = 'block';
        }

        // Проверяем, является ли нажатый элемент кнопкой с нужным классом
        if (target.classList.contains('btn-primary') || target.classList.contains('contact-form__btn')) {
            fade.style.display = 'block';
            modalThanks.style.display = 'block';
        }

        // Проверяем, является ли нажатый элемент кнопкой закрытия модального окна
        if (target.classList.contains('modal_thanks-btn')) {
            modalThanks.style.display = 'none';
            fade.style.display = 'none';
        }
    });
});
