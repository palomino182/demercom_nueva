const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contact-form');
const parallaxLayer = document.querySelector('.header-parallax');
const parallaxOrbA = document.querySelector('.orb-a');
const parallaxOrbB = document.querySelector('.orb-b');
const parallaxGrid = document.querySelector('.header-grid');
const mobileMoreButtons = document.querySelectorAll('.mobile-more-btn');

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

if (parallaxLayer && parallaxOrbA && parallaxOrbB && parallaxGrid) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateParallax = () => {
    if (prefersReducedMotion || window.innerWidth <= 900) return;

    const scrollOffset = Math.min(window.scrollY, 420);
    parallaxOrbA.style.transform = `translate3d(0, ${scrollOffset * 0.12}px, 0)`;
    parallaxOrbB.style.transform = `translate3d(0, ${scrollOffset * -0.08}px, 0)`;
    parallaxGrid.style.transform = `translate3d(0, ${scrollOffset * 0.06}px, 0)`;
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);
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

if (mobileMoreButtons.length) {
  mobileMoreButtons.forEach((button) => {
    const targetSelector = button.getAttribute('data-target');
    const target = targetSelector ? document.querySelector(targetSelector) : null;

    if (!target) return;

    button.addEventListener('click', () => {
      const isExpanded = target.classList.toggle('is-expanded');
      button.textContent = isExpanded ? 'Ver menos' : button.textContent.replace('Ver menos', '').trim() || 'Ver más';

      if (!isExpanded) {
        if (targetSelector.includes('projects')) button.textContent = 'Ver más proyectos';
        if (targetSelector.includes('capabilities')) button.textContent = 'Ver más capacidades';
        if (targetSelector.includes('infrastructure')) button.textContent = 'Ver más infraestructura';
        if (targetSelector.includes('civil')) button.textContent = 'Ver más obras civiles';
      }

      if (isExpanded) {
        button.textContent = 'Ver menos';
      }
    });
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
