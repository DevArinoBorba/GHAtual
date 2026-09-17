/**
 * GRANDE HOMEM - COMPORTAMENTOS & ANIMAÇÕES INTERATIVAS
 * Loja de Moda Masculina Plus Size & Alfaiataria Sob Medida
 */

document.addEventListener('DOMContentLoaded', () => {
  initStoreStatus();
  initScrollAnimations();
  initStickyHeader();
  initMobileMenu();
  initTailoringSimulator();
  initWhatsappTooltip();
});

/**
 * 1. STATUS DE FUNCIONAMENTO DA LOJA EM TEMPO REAL
 * Fuso horário de Campo Grande - MS: UTC-4
 */
function initStoreStatus() {
  const badge = document.getElementById('storeStatusBadge');
  const statusText = document.getElementById('storeStatusText');

  if (!badge || !statusText) return;

  function updateStatus() {
    // Obter data no fuso de Campo Grande (America/Campo_Grande)
    const now = new Date();
    const msOptions = { timeZone: 'America/Campo_Grande', hour12: false };
    
    // Obter dia da semana e horas no fuso local
    const dayOfWeek = new Date(now.toLocaleString('en-US', { timeZone: 'America/Campo_Grande' })).getDay();
    const hours = parseInt(now.toLocaleTimeString('pt-BR', { timeZone: 'America/Campo_Grande', hour: '2-digit' }), 10);
    const minutes = parseInt(now.toLocaleTimeString('pt-BR', { timeZone: 'America/Campo_Grande', minute: '2-digit' }), 10);
    const currentTimeInMinutes = hours * 60 + minutes;

    let isOpen = false;
    let message = '';

    // Segunda a Sexta: 08:00 às 18:00 (480 a 1080 minutos)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (currentTimeInMinutes >= 480 && currentTimeInMinutes < 1080) {
        isOpen = true;
        message = 'Loja Aberta hoje até as 18:00';
      } else if (currentTimeInMinutes < 480) {
        isOpen = false;
        message = 'Fechado · Abre hoje às 08:00';
      } else {
        isOpen = false;
        message = 'Fechado · Abre amanhã às 08:00';
      }
    } 
    // Sábado: 08:00 às 12:30 (480 a 750 minutos)
    else if (dayOfWeek === 6) {
      if (currentTimeInMinutes >= 480 && currentTimeInMinutes < 750) {
        isOpen = true;
        message = 'Loja Aberta hoje até as 12:30';
      } else if (currentTimeInMinutes < 480) {
        isOpen = false;
        message = 'Fechado · Abre hoje às 08:00';
      } else {
        isOpen = false;
        message = 'Fechado · Abre Segunda às 08:00';
      }
    } 
    // Domingo: Fechado
    else {
      isOpen = false;
      message = 'Fechado hoje · Abre Segunda às 08:00';
    }

    if (isOpen) {
      badge.classList.remove('closed');
      statusText.textContent = message;
    } else {
      badge.classList.add('closed');
      statusText.textContent = message;
    }
  }

  updateStatus();
  // Atualizar a cada 1 minuto
  setInterval(updateStatus, 60000);
}

/**
 * 2. ANIMAÇÕES DE ENTRADA AO ROLAR A PÁGINA (SCROLL REVEAL)
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Efeito cascata para itens vizinhos
          setTimeout(() => {
            entry.target.classList.add('is-revealed');
          }, 80);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback para navegadores legados
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/**
 * 3. STICKY HEADER & EFEITO DE VIDRO NO SCROLL
 */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 4. MENU MOBILE HAMBÚRGUER
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuBtn.classList.toggle('active', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Fechar menu ao clicar em qualquer link
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 5. SIMULADOR INTERATIVO DE ALFAIATARIA E WHATSAPP
 */
function initTailoringSimulator() {
  const pieceSelect = document.getElementById('pieceType');
  const sizeSelect = document.getElementById('approxSize');
  const occasionSelect = document.getElementById('occasionType');
  const clientNameInput = document.getElementById('clientName');
  const previewText = document.getElementById('previewText');
  const sendBtn = document.getElementById('sendTailoringBtn');

  if (!pieceSelect || !sizeSelect || !occasionSelect || !previewText || !sendBtn) return;

  function generateMessage() {
    const piece = pieceSelect.value;
    const size = sizeSelect.value;
    const occasion = occasionSelect.value;
    const name = clientNameInput ? clientNameInput.value.trim() : '';

    let text = 'Olá, equipe Grande Homem! ';
    if (name) {
      text += `Meu nome é ${name}. `;
    }
    text += `Gostaria de agendar uma consultoria para ${piece} (${size}) para a ocasião: ${occasion}. Vi pelo site oficial e gostaria de mais informações.`;

    previewText.textContent = `"${text}"`;
    return text;
  }

  // Ouvintes de evento para atualização em tempo real
  [pieceSelect, sizeSelect, occasionSelect].forEach(element => {
    element.addEventListener('change', generateMessage);
  });

  if (clientNameInput) {
    clientNameInput.addEventListener('input', generateMessage);
  }

  // Ação ao clicar no botão de envio
  sendBtn.addEventListener('click', () => {
    const finalMessage = generateMessage();
    const encodedText = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/556733824253?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });

  // Inicializar preview na montagem
  generateMessage();
}

/**
 * 6. CONTROLE DO TOOLTIP DO BOTÃO WHATSAPP
 */
function initWhatsappTooltip() {
  const tooltip = document.getElementById('whatsappTooltip');
  if (!tooltip) return;

  // Manter visível por 7 segundos e depois recolher suavemente
  setTimeout(() => {
    tooltip.style.opacity = '0';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transform = 'scale(0.8)';
  }, 7500);

  const btn = document.getElementById('floatingWhatsappBtn');
  if (btn) {
    btn.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
      tooltip.style.pointerEvents = 'auto';
      tooltip.style.transform = 'scale(1)';
    });

    btn.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.transform = 'scale(0.8)';
    });
  }
}
