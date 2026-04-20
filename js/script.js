// === Splash Screen ===
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden'; // Evita scroll durante o splash inicial
    
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.classList.add('hidden');
            document.body.style.overflow = ''; // Libera o scroll e revela o site
        }
    }, 2000); // 2 segundos, mesmo tempo da animação do círculo
});

// === Efeito 3D Texto Stagger (Nativo + Interatividade) ===
document.addEventListener('DOMContentLoaded', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-description');
    const heroBtn = document.querySelector('.hero-btn');

    // Função que encapsula e constrói o efeito 3D mágico para qualquer elemento de texto
    const setup3DText = (element, permanent3D, atrasoStagger, isDarkText = false) => {
        if (!element) return;
        
        const outlineColorHover = isDarkText ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
        
        element.style.animation = 'none';

        element.parentElement.style.perspective = '1000px';
        element.style.transformStyle = 'preserve-3d';
        element.style.transformOrigin = 'left center'; 

        // Estado pré-carregamento dramático
        element.style.transform = 'rotateY(60deg) translateX(-100px)';
        element.style.opacity = '0';
        element.style.transition = 'transform 2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.5s ease';

        const originalHTML = element.innerHTML;
        const list = originalHTML.split(/(<br>|\s+)/);
        element.innerHTML = '';
        
        const wordElements = [];

        list.forEach(item => {
            if (item.trim() === '') {
                element.appendChild(document.createTextNode(' '));
            } else if (item.toLowerCase() === '<br>') {
                element.appendChild(document.createElement('br'));
            } else {
                const span = document.createElement('span');
                span.innerHTML = item;
                span.style.display = 'inline-block';
                span.style.transform = 'translateZ(6rem)';
                span.style.opacity = '0';
                span.style.outline = `1px dotted ${outlineColorHover}`; 
                
                // Atribui o atraso no CSS em vez de usar setTimeout que pode causar colisões ao arrastar rápido
                const randomDelay = Math.random() * atrasoStagger;
                span.style.transition = `transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${randomDelay}ms, opacity 0.8s ease ${randomDelay}ms, outline-color 1.5s ease ${randomDelay}ms`;
                
                element.appendChild(span);
                wordElements.push(span);
            }
        });

        // Controle de estado 100% livre de bugs via CSS nativo
        const scatterWords = (isHovering) => {
            wordElements.forEach((span) => {
                if (isHovering) {
                    span.style.transform = 'translateZ(6rem) translateY(-0.5rem)';
                    span.style.outlineColor = outlineColorHover;
                    span.style.opacity = '0.7'; 
                } else {
                    span.style.transform = 'translateZ(0rem)';
                    span.style.opacity = '1';
                    span.style.outlineColor = 'transparent'; 
                }
            });
        };

        // Entrada instanciada com delay (agora aguarda o fecho do Splash Screen de 2s)
        setTimeout(() => {
            element.style.transform = permanent3D;
            element.style.opacity = '1';
            scatterWords(false);
        }, 2200);

        // Interatividade: explodir suave quando o mouse passar, recuar ao sair
        element.addEventListener('mouseenter', () => scatterWords(true));
        element.addEventListener('mouseleave', () => scatterWords(false));
    };

    const setup3DButton = (btn, permanent3D) => {
        if (!btn) return;
        
        btn.style.animation = 'none';
        btn.parentElement.style.perspective = '1000px'; 
        btn.style.transformStyle = 'preserve-3d';
        btn.style.transformOrigin = 'left center'; 

        // Estado pré-carregamento idêntico aos textos
        btn.style.transform = 'rotateY(60deg) translateX(-100px)';
        btn.style.opacity = '0';
        btn.style.transition = 'transform 2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.5s ease, box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

        setTimeout(() => {
            btn.style.transform = permanent3D;
            btn.style.opacity = '1';
        }, 2200);

        // Hover effect flutuando toda a estrutura
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = `${permanent3D} translateZ(3rem) translateY(-0.2rem)`;
            btn.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.35)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = permanent3D;
            btn.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.15)';
        });
    };

    const IS_MOBILE = window.innerWidth <= 768;

    if (!IS_MOBILE) {
        // Aplica o sistema para o nosso Título gigante, com um efeito e ângulo agudo forte
        setup3DText(heroTitle, 'rotateY(25deg) rotateX(8deg)', 400);

        // Aplica o mesmo sistema para o parágrafo Description com ângulo dramático
        setup3DText(heroDesc, 'rotateY(30deg) rotateX(-2deg)', 250);

        // Aplica para o subtítulo do topo com ângulo dramático
        setup3DText(heroSubtitle, 'rotateY(35deg) rotateX(-5deg)', 150);

        // Aplica o efeito no botão Adquirir (todo o botão flutua e se liberta)
        setup3DButton(heroBtn, 'rotateY(25deg) rotateX(-2deg)');
    } else {
        // No mobile: garante visibilidade sem transforms 3D
        [heroTitle, heroDesc, heroSubtitle, heroBtn].forEach(el => {
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.animation = 'none';
            }
        });
    }
});

// Nav Pill Interaction
document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.querySelector('.main-nav');
    const navPill = document.querySelector('.nav-pill');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (mainNav && navPill && navLinks.length > 0) {
        
        // Função elástica que move e dimensiona a pílula baseada no elemento focado
        const movePill = (element) => {
            if (!element) return;
            // Lê o layout de posicionamento e largura
            navPill.style.width = `${element.offsetWidth}px`;
            navPill.style.left = `${element.offsetLeft}px`;
            navPill.style.opacity = '1';
        };

        // Identifica em qual categoria começou como "active"
        let activeLink = document.querySelector('.main-nav a.active') || navLinks[0];

        // Aguarda frações de segundo para o browser calcular a fonte e renderizar as larguras exatas
        setTimeout(() => movePill(activeLink), 150);

        navLinks.forEach(link => {
            // Quando passar o mouse
            link.addEventListener('mouseenter', (e) => {
                movePill(e.target);
            });

            // Quando clicar numa categoria nova
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                activeLink = e.target;
                movePill(activeLink);
                
                // Tratar a ancoragem Customizada
                const targetId = link.getAttribute('href');
                if (window.aurumNavigation) {
                    window.aurumNavigation(targetId);
                }
            });
        });

        // Quando o mouse sair completamente do menu, a pílula volta voando para a categoria ativa atual
        mainNav.addEventListener('mouseleave', () => {
            movePill(activeLink);
        });
        
        // Prevenir desalinhamentos se o usuário redimensionar a janela
        window.addEventListener('resize', () => {
            movePill(activeLink);
        });

        // Exporta globalmente para o controlador de scroll poder assumir o controle da pílula
        window.updateNavPill = (targetId) => {
            const targetLink = Array.from(navLinks).find(l => l.getAttribute('href') === targetId);
            if (targetLink && targetLink !== activeLink) {
                navLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');
                activeLink = targetLink;
                movePill(activeLink);
            }
        };
    }
});

// === Mobile Hamburger Menu ===
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn     = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose   = document.getElementById('mobile-menu-close');
    const mobileNavLinks    = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuBtn || !mobileMenuOverlay) return;

    const openMenu = () => {
        mobileMenuBtn.classList.add('open');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenuBtn.classList.remove('open');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.contains('active') ? closeMenu() : openMenu();
    });

    mobileMenuClose?.addEventListener('click', closeMenu);

    // Navega ao clicar num link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            closeMenu();
            setTimeout(() => {
                if (window.aurumNavigation) window.aurumNavigation(target);
            }, 320); // aguarda o overlay fechar
        });
    });

    // Fecha ao clicar fora dos links (no fundo do overlay)
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) closeMenu();
    });
});

// Video Control
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero-video');
    const controlBtn = document.getElementById('video-control');
    
    if (video && controlBtn) {
        const pauseIcon = controlBtn.querySelector('.pause-icon');
        const playIcon = controlBtn.querySelector('.play-icon');
        
        controlBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                video.pause();
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'block';
            }
        });
    }
    
    // --- Lógica do Comprar Slider (Form) ---
    const btnShowForm = document.getElementById('btn-show-form');
    const btnHideForm = document.getElementById('btn-hide-form');
    const comprarSliderTrack = document.getElementById('comprar-slider-track');
    
    if (btnShowForm && btnHideForm && comprarSliderTrack) {
        btnShowForm.addEventListener('click', () => {
            comprarSliderTrack.style.transform = 'translateX(-50%)';
        });
        
        btnHideForm.addEventListener('click', () => {
            comprarSliderTrack.style.transform = 'translateX(0)';
        });
    }
});



// --- Info Carousel Logic (next/prev + text sync) ---
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('info-prev');
    const nextBtn = document.getElementById('info-next');
    const track = document.getElementById('info-carousel-track');
    const labelEl = document.getElementById('carousel-label');
    const titleEl = document.getElementById('carousel-title');
    const featuresEl = document.getElementById('carousel-features');

    if (!prevBtn || !nextBtn || !track) return;

    const slides = [
        {
            label: '01 — Interna',
            title: 'Design<br>Interno',
            features: [
                { bold: 'Painel Integrado:', text: ' O maior da categoria, com imersão total e tela panorâmica.' },
                { bold: 'Acabamento Premium:', text: ' Couro ecológico de alta qualidade em cada detalhe.' },
                { bold: 'Iluminação Ambiente:', text: ' 64 cores configuráveis para cada momento da viagem.' },
            ]
        },
        {
            label: '02 — Rodas',
            title: 'Rodas<br>Diamantadas',
            features: [
                { bold: 'Design Aerodinâmico:', text: ' Forjadas para máxima eficiência e postura imponente.' },
                { bold: 'Aro 21":', text: ' Perfil esportivo com redução de arrasto sem compromisso visual.' },
                { bold: 'Acabamento Espelhado:', text: ' Polimento diamantado de alta precisão industrial.' },
            ]
        },
        {
            label: '03 — Teto',
            title: 'Visão<br>Dinâmica',
            features: [
                { bold: 'Teto Panorâmico:', text: ' Visão privilegiada de 180° com vidro anti-UV integrado.' },
                { bold: 'Isolamento Total:', text: ' Termoacústico rígido para silêncio absoluto na cabine.' },
                { bold: 'Abertura Elétrica:', text: ' Controle de ventilação com memória de posição.' },
            ]
        },
        {
            label: '04 — Design',
            title: 'Fluxo<br>Contínuo',
            features: [
                { bold: 'Lanterna Interligada:', text: ' Luz traseira em fluxo contínuo de ponta a ponta.' },
                { bold: 'Assinatura Luminosa:', text: ' Identidade visual única e inconfundível no trânsito.' },
                { bold: 'LED Matrix:', text: ' Tecnologia adaptativa que reage ao ambiente em tempo real.' },
            ]
        },
    ];

    let currentSlide = 0;

    const updateFeatures = (index) => {
        if (!featuresEl) return;
        featuresEl.innerHTML = slides[index].features
            .map(f => `<li><strong>${f.bold}</strong>${f.text}</li>`)
            .join('');
    };

    const animateText = (index, direction) => {
        const els = [labelEl, titleEl, featuresEl].filter(Boolean);
        els.forEach(el => {
            el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            el.style.opacity = '0';
            el.style.transform = `translateY(${direction >= 0 ? '-12px' : '12px'})`;
        });
        setTimeout(() => {
            if (labelEl) labelEl.textContent = slides[index].label;
            if (titleEl) titleEl.innerHTML = slides[index].title;
            updateFeatures(index);
            els.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 260);
    };

    const goToSlide = (index) => {
        const direction = index - currentSlide;
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        animateText(index, direction);
    };

    // === Auto-play: avança a cada 7 segundos ===
    let autoPlayTimer = setInterval(() => {
        goToSlide((currentSlide + 1) % slides.length);
    }, 7000);

    const resetAutoPlay = () => {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, 7000);
    };

    prevBtn.addEventListener('click', () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        goToSlide((currentSlide + 1) % slides.length);
        resetAutoPlay();
    });
});


// --- Full-Page Scroll System ---
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const contentWrapper = document.getElementById('content-wrapper');
    const pagesContainer = document.getElementById('pages-container');
    const progressDots = document.querySelectorAll('.page-progress-dot');

    if (!contentWrapper || !header || !pagesContainer) return;

    // Pages: 0 = hero, 1-3 = content pages (informacoes + comprar + avaliacoes)
    const TOTAL_CONTENT_PAGES = 3;
    let currentPageIndex = 0;
    let isAnimating = false;

    // Map content page index to nav section
    const navMap = {
        1: '#informacoes',
        2: '#comprar',
        3: '#avaliacoes',
    };

    const updateProgressDots = (pageIndex) => {
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === pageIndex - 1);
        });
    };

    const navigateTo = (targetIndex) => {
        if (targetIndex < 0 || targetIndex > TOTAL_CONTENT_PAGES) return;
        if (isAnimating || targetIndex === currentPageIndex) return;
        isAnimating = true;

        currentPageIndex = targetIndex;

        if (currentPageIndex === 0) {
            // Go back to Hero
            contentWrapper.classList.remove('active');
            header.classList.remove('header-scrolled');
            document.body.classList.remove('light-scroll');
            // Reset pages position after the content-wrapper slides out
            setTimeout(() => {
                pagesContainer.style.transition = 'none';
                pagesContainer.style.transform = 'translateX(0)';
                setTimeout(() => {
                    pagesContainer.style.transition = 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1)';
                }, 50);
            }, 1000);
            updateProgressDots(0);
            if (window.updateNavPill) window.updateNavPill('#inicio');
        } else {
            // Go to a content page
            contentWrapper.classList.add('active');
            header.classList.add('header-scrolled');
            document.body.classList.add('light-scroll');

            const pagesIndex = currentPageIndex - 1; // 0-based for pages-container
            pagesContainer.style.transform = `translateX(-${pagesIndex * 100}vw)`;

            updateProgressDots(currentPageIndex);
            const navSection = navMap[currentPageIndex] || '#informacoes';
            if (window.updateNavPill) window.updateNavPill(navSection);
        }

        setTimeout(() => { isAnimating = false; }, 950);
    };

    // Export navigation for nav menu
    window.aurumNavigation = (targetId) => {
        if (IS_MOBILE) {
            // Native smooth scroll no mobile
            const valMenu = document.getElementById('mobile-menu');
            const valBtn = document.getElementById('mobile-menu-btn');
            if (valMenu) valMenu.classList.remove('active');
            if (valBtn) valBtn.classList.remove('open');
            document.body.style.overflow = ''; // Release body lock

            const targetSection = targetId === '#inicio' ? document.querySelector('.hero') : document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        // SPA logic pro desktop
        if (targetId === '#inicio') navigateTo(0);
        else if (targetId === '#informacoes') navigateTo(1);
        else if (targetId === '#comprar') navigateTo(2);
        else if (targetId === '#avaliacoes') navigateTo(3);
    };

    // Progress dot clicks
    progressDots.forEach((dot, i) => {
        dot.addEventListener('click', () => navigateTo(i + 1));
    });

    // Hero "Adquirir" button
    const heroBtnAdquirir = document.querySelector('.hero-btn');
    if (heroBtnAdquirir) {
        heroBtnAdquirir.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(2);
        });
    }

    // === Infinite Auto-Scroll: Avaliações chat bubbles ===
    const chatPanel = document.getElementById('chat-bubbles-panel');
    const chatTrack = document.getElementById('chat-bubbles-track');

    if (chatPanel && chatTrack) {
        // Duplica as bolhas para o loop seamless (20 no total = 10 reais + 10 clones)
        const originalBubbles = Array.from(chatTrack.querySelectorAll('.chat-bubble'));
        originalBubbles.forEach(bubble => {
            const clone = bubble.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            chatTrack.appendChild(clone);
        });

        // Pausa ao segurar o botão esquerdo do mouse
        chatPanel.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Apenas botão esquerdo
                chatTrack.classList.add('paused');
            }
        });

        // Retoma ao soltar o botão
        document.addEventListener('mouseup', () => {
            chatTrack.classList.remove('paused');
        });

        // Retoma também ao sair com o mouse do painel (segurança)
        chatPanel.addEventListener('mouseleave', () => {
            chatTrack.classList.remove('paused');
        });
    }

    // Mouse Wheel — navegação normal de páginas (sem interceptação do chat)
    window.addEventListener('wheel', (e) => {
        if (IS_MOBILE) return; // Permite o scroll vertical nativo
        if (isAnimating) { e.preventDefault(); return; }
        e.preventDefault();
        if (e.deltaY > 0) navigateTo(currentPageIndex + 1);
        else if (e.deltaY < 0) navigateTo(currentPageIndex - 1);
    }, { passive: false });


    // Keyboard
    window.addEventListener('keydown', (e) => {
        if (IS_MOBILE) return;
        if (isAnimating) return;
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
            e.preventDefault();
            navigateTo(currentPageIndex + 1);
        } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
            e.preventDefault();
            navigateTo(currentPageIndex - 1);
        }
    });

    // Touch
    let touchStartY = 0;
    let touchMoved = false;
    window.addEventListener('touchstart', (e) => {
        if (IS_MOBILE) return;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (IS_MOBILE) return; // scroll natural entra em cena
        if (isAnimating || touchMoved) return;
        const deltaY = touchStartY - e.touches[0].clientY;
        if (Math.abs(deltaY) > 40) {
            touchMoved = true;
            if (deltaY > 0) navigateTo(currentPageIndex + 1);
            else navigateTo(currentPageIndex - 1);
        }
    }, { passive: true });

    // === Efeito Fade Up Premium pro Mobile ===
    if (IS_MOBILE) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Descomente a linha abaixo para animar apenas uma vez
                    // observer.unobserve(entry.target);
                } else {
                    // Remove visibility out of screen to re-animate on scroll up/down
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.15 }); // Aciona quando 15% estiver na tela

        const fadeEls = document.querySelectorAll('.hero-content, .info-carousel-text, .slide-panel, .avaliacoes-title, .chat-bubbles-panel');
        fadeEls.forEach(el => {
            el.classList.add('fade-up-element');
            observer.observe(el);
        });
    }
});
