document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');

  if (!toggle || !navList) return;

  toggle.addEventListener('click', (e) => {
    const shown = navList.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(shown));
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (
      navList.classList.contains('show') &&
      !navList.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      navList.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});
