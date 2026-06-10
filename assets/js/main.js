const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contact-form');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (toggle && menu) {
  const setMenuState = (isOpen) => {
    menu.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  };

  toggle.addEventListener('click', () => {
    setMenuState(!menu.classList.contains('open'));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });

  document.addEventListener('click', (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedToggle = toggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      setMenuState(false);
    }
  });
}

if (navbar) {
  const updateNavbar = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('nombre') || '').trim();
    const company = String(formData.get('empresa') || '').trim();
    const phone = String(formData.get('telefono') || '').trim();
    const email = String(formData.get('correo') || '').trim();
    const service = String(formData.get('servicio') || '').trim();
    const message = String(formData.get('mensaje') || '').trim();

    const whatsappMessage = [
      'Hola Demercom, deseo solicitar información sobre sus servicios.',
      '',
      `Nombre: ${name}`,
      `Empresa: ${company || 'No indicada'}`,
      `Teléfono: ${phone}`,
      `Correo: ${email}`,
      `Servicio de interés: ${service}`,
      `Mensaje: ${message}`
    ].join('\n');

    const whatsappUrl = `https://wa.me/51955481375?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener');
  });
}

const revealItems = document.querySelectorAll(
  '.section-heading, .intro-grid, .mission-vision article, .why-grid article, .services-list article, .projects-grid article, .logos-grid span, .contact-list, .contact-form'
);

if (revealItems.length) {
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 60}ms`;
  });

  const reveal = (entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(reveal);
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
}
