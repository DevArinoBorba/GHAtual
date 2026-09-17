/**
 * GRANDE HOMEM - COMPORTAMENTOS, INTERATIVIDADE & ANIMAÇÕES
 * Moda Masculina Plus Size (46 ao 80) & Alfaiataria Sob Medida
 * Desenvolvido sob princípios de Emil Kowalski & Mobile-Native Touch
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initStoreStatus();
  initScrollAnimations();
  initStickyHeader();
  initMobileDrawer();
  initTailoringStudio();
  initSizeExplorer();
  initCollectionFilter();
  initWhatsappTooltip();
  initHeroLookbook();
  initHeroPins();
});

/**
 * 1. BARRA DE PROGRESSO DE LEITURA
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * 2. STATUS EM TEMPO REAL DA LOJA (Fuso horário de Campo Grande - MS: UTC-4)
 */
function initStoreStatus() {
  const badge = document.getElementById('storeStatusBadge');
  const statusText = document.getElementById('storeStatusText');
  if (!badge || !statusText) return;

  function updateStatus() {
    try {
      const now = new Date();
      // Obter dia da semana e horário no fuso America/Campo_Grande
      const cgDateStr = now.toLocaleString('en-US', { timeZone: 'America/Campo_Grande' });
      const cgDate = new Date(cgDateStr);
      const dayOfWeek = cgDate.getDay(); // 0 = Domingo, 1-5 = Seg-Sex, 6 = Sáb
      const hours = cgDate.getHours();
      const minutes = cgDate.getMinutes();
      const currentMin = hours * 60 + minutes;

      let isOpen = false;
      let message = '';

      // Segunda a Sexta: 08:00 às 18:00 (480 a 1080 min)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        if (currentMin >= 480 && currentMin < 1080) {
          isOpen = true;
          message = 'Loja Aberta hoje até as 18:00';
        } else if (currentMin < 480) {
          isOpen = false;
          message = 'Fechado · Abre hoje às 08:00';
        } else {
          isOpen = false;
          message = 'Fechado · Abre amanhã às 08:00';
        }
      }
      // Sábado: 08:00 às 12:30 (480 a 750 min)
      else if (dayOfWeek === 6) {
        if (currentMin >= 480 && currentMin < 750) {
          isOpen = true;
          message = 'Loja Aberta hoje até as 12:30';
        } else if (currentMin < 480) {
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
      } else {
        badge.classList.add('closed');
      }
      statusText.textContent = message;
    } catch (e) {
      statusText.textContent = 'Segunda a Sexta: 08h às 18h · Sáb: 08h às 12h30';
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}

/**
 * 3. ANIMAÇÕES DE ENTRADA AO ROLAR A PÁGINA (SCROLL REVEAL)
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/**
 * 4. STICKY HEADER & EFEITO SCROLLED
 */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 5. MENU MOBILE DRAWER
 */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (!menuBtn || !mobileNav) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', isOpen);
    menuBtn.classList.toggle('active', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', () => toggleMenu());
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

  // Fechar ao clicar nos links internos
  const navLinks = mobileNav.querySelectorAll('.mobile-link, .mobile-nav-footer a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/**
 * 6. STUDIO INTERATIVO DE CONSULTORIA & ALFAIATARIA
 */
function initTailoringStudio() {
  const pieceSelectorGrid = document.getElementById('pieceSelectorGrid');
  const pieceTypeHidden = document.getElementById('pieceType');
  const approxSizeSelect = document.getElementById('approxSize');
  const occasionTypeSelect = document.getElementById('occasionType');
  const clientNameInput = document.getElementById('clientName');
  const previewText = document.getElementById('previewText');
  const sendBtn = document.getElementById('sendTailoringBtn');
  const copyBtn = document.getElementById('copyMessageBtn');
  const copyBtnText = document.getElementById('copyBtnText');

  if (!pieceTypeHidden || !approxSizeSelect || !occasionTypeSelect || !previewText || !sendBtn) return;

  // Interatividade dos botões de seleção de peça
  if (pieceSelectorGrid) {
    const options = pieceSelectorGrid.querySelectorAll('.pill-option');
    options.forEach(btn => {
      btn.addEventListener('click', () => {
        options.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pieceTypeHidden.value = btn.getAttribute('data-value') || '';
        updateMessage();
      });
    });
  }

  function getMessage() {
    const piece = pieceTypeHidden.value || 'Terno / Costume Completo Sob Medida';
    const size = approxSizeSelect.value;
    const occasion = occasionTypeSelect.value;
    const name = clientNameInput ? clientNameInput.value.trim() : '';

    let text = 'Olá, equipe Grande Homem! ';
    if (name) {
      text += `Meu nome é ${name}. `;
    }
    text += `Gostaria de uma consultoria para ${piece} (${size}) para a ocasião: ${occasion}. Vi pelo site oficial e gostaria de mais informações.`;
    return text;
  }

  function updateMessage() {
    const message = getMessage();
    previewText.textContent = `"${message}"`;
  }

  // Ouvintes de atualização
  [approxSizeSelect, occasionTypeSelect].forEach(select => {
    select.addEventListener('change', updateMessage);
  });

  if (clientNameInput) {
    clientNameInput.addEventListener('input', updateMessage);
  }

  // Ação de Envio no WhatsApp
  sendBtn.addEventListener('click', () => {
    const message = getMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/556733824253?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // Copiar mensagem para a área de transferência
  if (copyBtn && copyBtnText) {
    copyBtn.addEventListener('click', async () => {
      const message = getMessage();
      try {
        await navigator.clipboard.writeText(message);
        copyBtnText.textContent = 'Copiado!';
        copyBtn.style.color = '#227327';
        setTimeout(() => {
          copyBtnText.textContent = 'Copiar';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        // Fallback se permissão de clipboard falhar
        copyBtnText.textContent = 'Pronto!';
      }
    });
  }

  updateMessage();
}

/**
 * 7. EXPLORADOR INTERATIVO DA GRADE 46 AO 80
 */
function initSizeExplorer() {
  const container = document.getElementById('sizePillContainer');
  const sizeDisplay = document.getElementById('selectedSizeDisplay');
  const titleDisplay = document.getElementById('sizeTitleDisplay');
  const descDisplay = document.getElementById('sizeDescDisplay');
  const btnNumber = document.getElementById('sizeBtnNumber');
  const queryBtn = document.getElementById('sizeQueryBtn');

  if (!container || !sizeDisplay || !titleDisplay || !descDisplay || !queryBtn) return;

  const sizeData = {
    '46': {
      title: 'Tamanho 46 — Modelagem Slim Plus & Caimento Preciso',
      desc: 'Disponível em camisaria social, polos nobres, calças chino em sarja com elastano e trajes executivos.'
    },
    '48': {
      title: 'Tamanho 48 — Conforto & Alinhamento Estruturado',
      desc: 'Grande variedade em camisas sociais manga longa, bermudas de linho e blazers desestruturados.'
    },
    '50': {
      title: 'Tamanho 50 — Equilíbrio Perfeito entre Torso e Ombros',
      desc: 'Modelos com corte anatômico que valorizam a postura sem repuxar os botões do peitoral.'
    },
    '52': {
      title: 'Tamanho 52 — Linha Executiva & Casual Confort',
      desc: 'Calças com gancho proporcional e cós estruturado, ideais para o cotidiano dinâmico.'
    },
    '54': {
      title: 'Tamanho 54 — Alta Procura & Grande Variedade',
      desc: 'Peças em algodão Pima, polos em malha nobre, ternos sob medida e jeans flexível em estoque.'
    },
    '56': {
      title: 'Tamanho 56 — Linha Especial com Caimento Estruturado',
      desc: 'Camisas sociais, polos, calças de sarja com elastano, bermudas e alfaiataria completa sob medida.'
    },
    '58': {
      title: 'Tamanho 58 — Cortes Especializados para Porte Imponente',
      desc: 'Amplitude nas costas e tórax sem excesso de tecido na cintura, garantindo silhueta elegante.'
    },
    '60': {
      title: 'Tamanho 60 — Conforto Absoluto & Estilo Nobre',
      desc: 'Camisas sociais com colarinho espaçoso, calças com cós anatômico e costumes sob medida.'
    },
    '62': {
      title: 'Tamanho 62 — Alfaiataria Milimétrica para Grandes Ocasiões',
      desc: 'Ternos para padrinhos, formandos e empresários que exigem acabamento refinado.'
    },
    '64': {
      title: 'Tamanho 64 — Moda Completa em Linho e Algodão Puro',
      desc: 'Bermudas, polos, calças em sarja premium com stretch e camisas de linho respirável.'
    },
    '66': {
      title: 'Tamanho 66 — Estrutura e Respiro Visual',
      desc: 'Modelagens desenvolvidas por especialistas que compreendem a distribuição de volume corporal.'
    },
    '68': {
      title: 'Tamanho 68 — Liberdade de Movimentos em Todos os Momentos',
      desc: 'Comprimento de tronco estendido que permanece no lugar ao sentar ou dirigir.'
    },
    '70': {
      title: 'Tamanho 70 — Peças Raras em Lojas Convencionais',
      desc: 'Aqui você encontra araras fartas e variedade de cores elegantes para todos os momentos.'
    },
    '72': {
      title: 'Tamanho 72 — Consultoria Dedicada e Ajuste Sob Medida',
      desc: 'Alfaiates experientes prontos para realizar adequações personalizadas no seu corpo.'
    },
    '74': {
      title: 'Tamanho 74 — Moda Masculina com Respeito e Qualidade',
      desc: 'Tecidos reforçados em pontos de tração, com caimento natural sem sensação de aperto.'
    },
    '76': {
      title: 'Tamanho 76 — Elegância Sem Concessões',
      desc: 'Peças que valorizam a sua presença com dignidade, sofisticação e corte impecável.'
    },
    '78': {
      title: 'Tamanho 78 — Exclusividade Grande Homem',
      desc: 'Acervo e capacidade técnica de alfaiataria única em toda a região de Campo Grande.'
    },
    '80': {
      title: 'Tamanho 80 — O Maior Tamanho Real em Produção Sob Medida',
      desc: 'Cortes exclusivos e modelagens desenhadas sob demanda para que você vista a verdadeira elegância.'
    }
  };

  const pills = container.querySelectorAll('.size-pill');

  function selectSize(size) {
    pills.forEach(p => p.classList.remove('active'));
    const activePill = container.querySelector(`[data-size="${size}"]`);
    if (activePill) activePill.classList.add('active');

    const data = sizeData[size] || {
      title: `Tamanho ${size} — Disponível na Loja`,
      desc: 'Consulte nossa equipe no WhatsApp para verificar modelos e agendar sua prova.'
    };

    sizeDisplay.textContent = size;
    titleDisplay.textContent = data.title;
    descDisplay.textContent = data.desc;
    if (btnNumber) btnNumber.textContent = size;

    const message = encodeURIComponent(`Olá! Gostaria de saber as peças e opções sob medida disponíveis no tamanho ${size}.`);
    queryBtn.href = `https://wa.me/556733824253?text=${message}`;
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const size = pill.getAttribute('data-size');
      if (size) selectSize(size);
    });
  });
}

/**
 * 8. FILTRO DAS COLEÇÕES POR CATEGORIA
 */
function initCollectionFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.collection-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * 9. CONTROLE DO TOOLTIP DO BOTÃO WHATSAPP
 */
function initWhatsappTooltip() {
  const tooltip = document.getElementById('whatsappTooltip');
  const btn = document.getElementById('floatingWhatsappBtn');
  if (!tooltip || !btn) return;

  // Ocultar automaticamente após 8 segundos
  let timeoutId = setTimeout(() => {
    tooltip.style.opacity = '0';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transform = 'scale(0.85)';
  }, 8000);

  btn.addEventListener('mouseenter', () => {
    clearTimeout(timeoutId);
    tooltip.style.opacity = '1';
    tooltip.style.pointerEvents = 'auto';
    tooltip.style.transform = 'scale(1)';
  });

  btn.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transform = 'scale(0.85)';
  });
}

/**
 * 10. HERO LOOKBOOK SEGMENTED CONTROL
 * Alternância dinâmica entre Alfaiataria/Ternos, Casual/Polos e A Loja/Estacionamento
 */
function initHeroLookbook() {
  const segmentBtns = document.querySelectorAll('.hero-segment-btn[data-hero-mode]');
  const mainImg = document.getElementById('heroMainImg');
  const craftImg = document.getElementById('heroCraftImg');
  const craftBadge = document.getElementById('heroCraftBadge');
  const craftTitle = document.getElementById('heroCraftTitle');
  const craftDesc = document.getElementById('heroCraftDesc');
  const craftBtn = document.getElementById('heroCraftBtn');
  const mainBadgeTitle = document.getElementById('heroMainBadgeTitle');
  const mainBadgeSub = document.getElementById('heroMainBadgeSub');
  const conciergeWhatsappBtn = document.getElementById('heroConciergeWhatsappBtn');
  const pins = document.querySelectorAll('.tailoring-hotspot');

  if (!segmentBtns.length) return;

  const modeData = {
    bespoke: {
      mainImgSrc: 'assets/menswear-model.jpg',
      mainImgAlt: 'Homem imponente vestindo terno sob medida Grande Homem',
      craftImgSrc: 'assets/tailoring-art.jpg',
      craftImgAlt: 'Mesa de corte de alfaiataria com tesoura dourada e tecido nobre',
      craftBadge: 'Corte Manual & Precisão',
      craftTitle: 'Ofício Sob Medida',
      craftDesc: 'Trajes desenhados milimetricamente para homens que buscam postura firme em eventos formais, casamentos e reuniões corporativas.',
      craftBtnText: 'Solicitar Consultoria',
      craftBtnHref: '#simulador-alfaiataria',
      mainBadgeTitle: 'Grade Especial: 46 ao 80',
      mainBadgeSub: 'Cortes reais para homens de presença',
      showPins: true,
      whatsappMsg: 'Olá! Estive vendo a alfaiataria sob medida no site da Grande Homem e gostaria de agendar uma consultoria com um alfaiate.'
    },
    casual: {
      mainImgSrc: 'assets/casual-collection.jpg',
      mainImgAlt: 'Coleção casual premium Grande Homem: camisas polo e bermudas',
      craftImgSrc: 'assets/mockup-tag.png',
      craftImgAlt: 'Detalhe nobre de acabamento e etiqueta da marca',
      craftBadge: 'Algodão Nobre & Stretch',
      craftTitle: 'Linha Casual & Fim de Semana',
      craftDesc: 'Camisas polo piquet com toque suave, bermudas estruturadas e calças com elastano calibradas para respirabilidade e mobilidade impecável.',
      craftBtnText: 'Explorar Linha Casual',
      craftBtnHref: '#colecoes',
      mainBadgeTitle: 'Conforto & Elasticidade Nobre',
      mainBadgeSub: 'Tecidos leves e respiráveis até o 80',
      showPins: false,
      whatsappMsg: 'Olá! Gostaria de conhecer os modelos e cores disponíveis na linha Casual e Polos da Grande Homem.'
    },
    store: {
      mainImgSrc: 'assets/fachada-loja.png',
      mainImgAlt: 'Fachada da Grande Homem na Av. Afonso Pena com vagas na porta',
      craftImgSrc: 'assets/maps.png',
      craftImgAlt: 'Mapa de acesso e localização da Grande Homem em Campo Grande',
      craftBadge: 'Av. Afonso Pena, 3536',
      craftTitle: 'Ateliê & Estacionamento Próprio',
      craftDesc: 'Estacione com tranquilidade em nossas vagas privativas na porta e desfrute de provadores climatizados, café expresso e alfaiates no local.',
      craftBtnText: 'Como Chegar à Loja',
      craftBtnHref: '#localizacao',
      mainBadgeTitle: 'Estacionamento Privativo Gratuito',
      mainBadgeSub: 'Vagas exclusivas bem na porta da loja',
      showPins: false,
      whatsappMsg: 'Olá! Gostaria de visitar o ateliê na Av. Afonso Pena. Poderiam me confirmar o melhor horário hoje?'
    }
  };

  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-hero-mode');
      const data = modeData[mode];
      if (!data) return;

      // Atualizar botões ativos
      segmentBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Transição suave de fade
      if (mainImg) mainImg.style.opacity = '0.35';
      if (craftImg) craftImg.style.opacity = '0.35';

      setTimeout(() => {
        // Atualizar Coluna 2 (Retrato Principal)
        if (mainImg) {
          mainImg.src = data.mainImgSrc;
          mainImg.alt = data.mainImgAlt;
          mainImg.style.opacity = '1';
        }
        if (mainBadgeTitle) mainBadgeTitle.textContent = data.mainBadgeTitle;
        if (mainBadgeSub) mainBadgeSub.textContent = data.mainBadgeSub;

        // Mostrar / Ocultar Pins anatômicos
        pins.forEach(pin => {
          pin.style.display = data.showPins ? 'flex' : 'none';
        });

        // Atualizar Coluna 1 (Craft Card)
        if (craftImg) {
          craftImg.src = data.craftImgSrc;
          craftImg.alt = data.craftImgAlt;
          craftImg.style.opacity = '1';
        }
        if (craftBadge) craftBadge.textContent = data.craftBadge;
        if (craftTitle) craftTitle.textContent = data.craftTitle;
        if (craftDesc) craftDesc.textContent = data.craftDesc;
        if (craftBtn) {
          craftBtn.textContent = data.craftBtnText;
          craftBtn.setAttribute('href', data.craftBtnHref);
        }

        // Atualizar Link WhatsApp do Concierge
        if (conciergeWhatsappBtn) {
          conciergeWhatsappBtn.href = `https://wa.me/556733824253?text=${encodeURIComponent(data.whatsappMsg)}`;
        }
      }, 160);
    });
  });
}

/**
 * 11. HOTSPOTS INTERATIVOS DE ALFAIATARIA (TOUCH & CLICK)
 * Exibe popovers com explicações anatômicas ao clicar/tocar
 */
function initHeroPins() {
  const pins = document.querySelectorAll('.tailoring-hotspot');
  if (!pins.length) return;

  pins.forEach(pin => {
    // Clique ou toque mobile
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = pin.classList.contains('active');
      pins.forEach(p => p.classList.remove('active'));
      if (!isActive) {
        pin.classList.add('active');
      }
    });

    // Acessibilidade via teclado (Enter / Espaço)
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isActive = pin.classList.contains('active');
        pins.forEach(p => p.classList.remove('active'));
        if (!isActive) {
          pin.classList.add('active');
        }
      }
    });
  });

  // Fechar popover ao clicar fora
  document.addEventListener('click', () => {
    pins.forEach(p => p.classList.remove('active'));
  });
}

