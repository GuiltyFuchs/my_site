document.addEventListener('DOMContentLoaded', () => {
  // закрытие при клике вне меню
  if(navList.classList.contains('show') &&
  !navList.contains(e.target) &&
  e.target !== toggle){
    navList.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }
  // закрытие при клике на ссылку внутри меню
  link.addEventListener('click', () => {
    navList.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  });
});
