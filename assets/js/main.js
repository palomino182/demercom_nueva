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
const navSectionLinks = document.querySelectorAll('.nav-menu a[data-section]');
const trackedSections = document.querySelectorAll('main section[id]');
const backToTopButton = document.querySelector('.back-to-top');
const scrollProgressBar = document.querySelector('.scroll-progress-bar');

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
  let lastScrollY = window.scrollY;

  const updateNavbar = () => {
    const currentScrollY = window.scrollY;
    const isDesktop = window.innerWidth > 900;
    const scrollingDown = currentScrollY > lastScrollY;
    const passedThreshold = currentScrollY > 120;

    navbar.classList.toggle('is-scrolled', currentScrollY > 24);
    navbar.classList.toggle('is-compact', currentScrollY > 80);
    navbar.classList.toggle('is-hidden', isDesktop && scrollingDown && passedThreshold && !menu?.classList.contains('open'));

    lastScrollY = currentScrollY;
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
  window.addEventListener('resize', updateNavbar);
}

if (navSectionLinks.length && trackedSections.length) {
  const setActiveSection = (sectionId) => {
    navSectionLinks.forEach((link) => {
      const isActive = link.dataset.section === sectionId;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  };

  const detectActiveSection = () => {
    const viewportTrigger = window.scrollY + 180;
    let currentSectionId = trackedSections[0].id;

    trackedSections.forEach((section) => {
      if (viewportTrigger >= section.offsetTop) {
        currentSectionId = section.id;
      }
    });

    setActiveSection(currentSectionId);
  };

  detectActiveSection();
  window.addEventListener('scroll', detectActiveSection, { passive: true });
  window.addEventListener('resize', detectActiveSection);
}

if (backToTopButton) {
  const toggleBackToTop = () => {
    backToTopButton.classList.toggle('is-visible', window.scrollY > 520);
  };

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
}

if (scrollProgressBar) {
  const updateScrollProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgressBar.style.transform = `scaleX(${Math.min(Math.max(progress / 100, 0), 1)})`;
  };

  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
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

const revealGroups = [
  {
    selector: '.section-heading, .intro-grid > *, .mission-vision article, .capabilities-cta, .footer-bottom',
    variant: 'reveal-soft',
    stagger: 70
  },
  {
    selector: '.why-grid article, .services-list article, .projects-showcase article, .capabilities-grid .capability-card, .infrastructure-grid article, .civil-grid article, .logos-grid span',
    variant: 'reveal-up',
    stagger: 85
  },
  {
    selector: '.featured-project-media, .contact-list, .footer-brand',
    variant: 'reveal-left',
    stagger: 90
  },
  {
    selector: '.featured-project-content, .contact-form, .footer-links, .footer-contact',
    variant: 'reveal-right',
    stagger: 95
  }
];

const revealItems = [];

revealGroups.forEach(({ selector, variant, stagger }) => {
  document.querySelectorAll(selector).forEach((item, index) => {
    item.classList.add('reveal', variant);
    item.style.transitionDelay = `${Math.min(index, 5) * stagger}ms`;
    revealItems.push(item);
  });
});

if (revealItems.length) {
  const reveal = (entry, observer) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => reveal(entry, observer));
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px'
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
}
