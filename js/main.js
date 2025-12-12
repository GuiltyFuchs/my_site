document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');

  if(toggle && navList){
    // клик по кнопке гамбургера
    toggle.addEventListener('click', (e) => {
      const shown = navList.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(shown));
      e.stopPropagation();
    });

    // закрытие при клике вне меню
    document.addEventListener('click', (e) => {
      if(navList.classList.contains('show') && 
         !navList.contains(e.target) && 
         e.target !== toggle){
        navList.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // закрытие при клике на ссылку внутри меню
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
