document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');

  if(toggle && navList){
    // Клик по кнопке гамбургера
    toggle.addEventListener('click', (e) => {
      const shown = navList.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(shown));
      e.stopPropagation(); // чтобы клик по кнопке не закрывал меню сразу
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
      if(navList.classList.contains('show') && 
         !navList.contains(e.target) && 
         e.target !== toggle){
        navList.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Закрытие при клике на ссылку внутри меню
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
