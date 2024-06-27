"use strict";

function animateTitle(selector, onComplete) {
  var title = document.querySelector(selector);
  if (!title) {
    console.error('Element not found with selector:', selector);
    return;
  }
  var moveDuration = 500; // Длительность перемещения в миллисекундах
  var scaleDuration = 180; // Длительность увеличения в миллисекундах
  var initialTranslateY = -100; // Начальное смещение по Y
  var finalTranslateY = 0; // Конечное положение по Y
  var initialScale = 0.5; // Начальный размер
  var finalScale = 1; // Конечный размер

  var startMove = null;
  var startScale = null;
  function move(timestamp) {
    if (!startMove) startMove = timestamp;
    var progress = timestamp - startMove;
    var percentage = Math.min(progress / moveDuration, 1);

    // Вычисление текущего значения translateY
    var currentTranslateY = initialTranslateY + (finalTranslateY - initialTranslateY) * percentage;
    title.style.transform = "translateY(".concat(currentTranslateY, "px) scale(").concat(initialScale, ")");
    if (progress < moveDuration) {
      requestAnimationFrame(move);
    } else {
      startScale = null;
      requestAnimationFrame(scale);
    }
  }
  function scale(timestamp) {
    if (!startScale) startScale = timestamp;
    var progress = timestamp - startScale;
    var percentage = Math.min(progress / scaleDuration, 1);

    // Вычисление текущего значения scale
    var currentScale = initialScale + (finalScale - initialScale) * percentage;
    title.style.transform = "translateY(".concat(finalTranslateY, "px) scale(").concat(currentScale, ")");
    if (progress < scaleDuration) {
      requestAnimationFrame(scale);
    } else {
      if (typeof onComplete === 'function') {
        onComplete(); // Вызываем колбэк после завершения анимации title
      }
    }
  }
  requestAnimationFrame(move);
}
function animateSubtitle(selector) {
  var subtitle = document.querySelector(selector);
  if (!subtitle) {
    console.error('Element not found with selector:', selector);
    return;
  }
  var moveDuration = 500; // Длительность перемещения в миллисекундах
  var initialTranslateX = -100; // Начальное смещение по X
  var finalTranslateX = 0; // Конечное положение по X

  var startMove = null;
  function move(timestamp) {
    if (!startMove) startMove = timestamp;
    var progress = timestamp - startMove;
    var percentage = Math.min(progress / moveDuration, 1);

    // Вычисление текущего значения translateX
    var currentTranslateX = initialTranslateX + (finalTranslateX - initialTranslateX) * percentage;
    subtitle.style.transform = "translateX(".concat(currentTranslateX, "%)");
    if (progress < moveDuration) {
      requestAnimationFrame(move);
    }
  }
  requestAnimationFrame(move);
}
function rotateAndReset(selector, initialRotation, finalRotation) {
  var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 800;
  var element = document.querySelector(selector);
  if (!element) {
    console.error('Element not found with selector:', selector);
    return;
  }
  var startRotate = null;
  function rotate(timestamp) {
    if (!startRotate) startRotate = timestamp;
    var progress = timestamp - startRotate;
    var percentage = Math.min(progress / duration, 1);

    // Вычисление текущего угла поворота
    var currentRotation;
    if (initialRotation < finalRotation) {
      currentRotation = initialRotation + (finalRotation - initialRotation) * percentage;
    } else {
      currentRotation = initialRotation - (initialRotation - finalRotation) * percentage;
    }
    element.style.transform = "rotate(".concat(currentRotation, "deg)");
    if (progress < duration) {
      requestAnimationFrame(rotate);
    }
  }
  requestAnimationFrame(rotate);
}
function animateBanner() {
  animateTitle('.banner__title', function () {
    animateSubtitle('.banner__subtitle');

    // Анимация первых двух картинок (поворот на -50 градусов)
    rotateAndReset('.banner-images__board', -160, 0);
    rotateAndReset('.banner-images__organic-shapes', 160, 0);

    // Анимация вторых двух картинок (возвращение на исходное положение)
    rotateAndReset('.banner-images__school-elements', 160, 0);
    rotateAndReset('.banner-images__stationery', -160, 0);
  });
}
document.addEventListener('DOMContentLoaded', function () {
  animateBanner(); // Запускаем анимацию при загрузке страницы

  var bannerBtn = document.querySelector('.banner__btn');
  if (bannerBtn) {
    bannerBtn.addEventListener('click', function () {
      // Очищаем стили перед повторной анимацией
      var elementsToClear = ['.banner__title', '.banner__subtitle', '.banner-images__board', '.banner-images__organic-shapes', '.banner-images__school-elements', '.banner-images__stationery'];
      elementsToClear.forEach(function (selector) {
        var element = document.querySelector(selector);
        if (element) {
          element.style.transform = '';
        }
      });

      // Запускаем анимацию заново
      animateBanner();
    });
  }
});