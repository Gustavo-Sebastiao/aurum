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

    // Aplica o sistema para o nosso Título gigante, com um efeito e ângulo agudo forte
    setup3DText(heroTitle, 'rotateY(25deg) rotateX(8deg)', 400);

    // Aplica o mesmo sistema para o parágrafo Description
    // Aplica o mesmo sistema para o parágrafo Description com ângulo dramático
    setup3DText(heroDesc, 'rotateY(30deg) rotateX(-2deg)', 250);

    // Aplica para o subtítulo do topo com ângulo dramático
    setup3DText(heroSubtitle, 'rotateY(35deg) rotateX(-5deg)', 150);

    // Aplica o efeito no botão Adquirir (todo o botão flutua e se liberta)
    setup3DButton(heroBtn, 'rotateY(25deg) rotateX(-2deg)');
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
    
    // --- Lógica do Carrossel de Informações ---
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        
        const updateCarousel = () => {
            const cards = document.querySelectorAll('.carousel-card');
            if (cards.length === 0) return;
            
            // Largura do card + o gap definido no CSS (2rem = 32px)
            const gapPixels = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
            const cardWidth = cards[0].offsetWidth + gapPixels;
            
            // Limites
            const visibleCardsCount = Math.max(1, Math.floor(track.parentElement.offsetWidth / cardWidth));
            const maxIndex = Math.max(0, cards.length - visibleCardsCount);
            
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;
            
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            if (currentIndex === 0) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
            
            if (currentIndex >= maxIndex) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        };

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            const cards = document.querySelectorAll('.carousel-card');
            const gapPixels = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
            const cardWidth = cards[0].offsetWidth + gapPixels;
            const visibleCardsCount = Math.max(1, Math.floor(track.parentElement.offsetWidth / cardWidth));
            const maxIndex = Math.max(0, cards.length - visibleCardsCount);

            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        window.addEventListener('resize', updateCarousel);
        // Inicialização rápida para setar limites e classes disabled no load
        setTimeout(updateCarousel, 100); 
    }
    
    // --- Lógica do Seletor de Cores ---
    const colorBtns = document.querySelectorAll('.color-btn');
    const carImageDisplay = document.getElementById('car-image-display');
    const colorNameDisplay = document.getElementById('color-name-display');
    
    if (colorBtns.length > 0 && carImageDisplay && colorNameDisplay) {
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;
                
                // Remove estado ativo de todos e adiciona no clicado
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Lê propriedades do dataset
                const newImgSrc = btn.getAttribute('data-img');
                const newColorName = btn.getAttribute('data-color');
                
                // Fade out na imagem atual
                carImageDisplay.classList.add('fade-out');
                
                // Reset da Animação do Texto para engatilhar de novo
                colorNameDisplay.style.animation = 'none';
                // Trigger Reflow para forçar redraw do css
                void colorNameDisplay.offsetWidth; 
                
                // Delay perfeito pra quando ela 'sumir'
                setTimeout(() => {
                    // Troca Asset de fato
                    carImageDisplay.src = newImgSrc;
                    colorNameDisplay.textContent = newColorName;
                    
                    // Inicia texto
                    colorNameDisplay.style.animation = 'fadeInColor 0.5s ease forwards';
                    
                    // Tira classe fade-out, o css transition volta o fade in pro 100% natural
                    carImageDisplay.classList.remove('fade-out');
                }, 400); // 400ms do tempo do opacity no css
            });
        });
    }
    
    // --- Lógica do Interativo de Compras (Slider Oferta/Formulário) ---
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

// --- Mecânicas de Scroll Horizontal (Hero -> Páginas) ---
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const contentWrapper = document.getElementById('content-wrapper');
    
    if (!contentWrapper || !header) return;

    let isHeroView = true;
    let isAnimating = false;

    const goToContent = () => {
        if (isAnimating || !isHeroView) return;
        isAnimating = true;
        isHeroView = false;
        
        contentWrapper.classList.add('active');
        header.classList.add('header-scrolled');
        document.body.classList.add('light-scroll'); /* Troca o scroll pra cor preta translúcida */
        
        // Aguarda animação
        setTimeout(() => {
            document.body.style.overflowY = 'auto'; // Transição termina, liga scroll vertical normal
            isAnimating = false;
        }, 1000); 
    };

    const goToHero = () => {
        if (isAnimating || isHeroView) return;
        isAnimating = true;
        
        document.body.style.overflowY = 'hidden'; // Bloqueia scroll normal
        contentWrapper.classList.remove('active');
        header.classList.remove('header-scrolled');
        document.body.classList.remove('light-scroll'); /* Retorna o scroll ao default (Branco/Oculto) */
        
        setTimeout(() => {
            isHeroView = true;
            isAnimating = false;
            // Retorna o foco pro Início quando a hero aparecer
            if (window.updateNavPill) {
                window.updateNavPill('#inicio');
            }
        }, 1000);
    };

    // Exporta a função para o Nav Menu Interativo usar
    window.aurumNavigation = (targetId) => {
        if (targetId === '#inicio') {
            goToHero();
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Retorna pro topo se tiver descido mto
        } else {
            const wasInHero = isHeroView;
            if (isHeroView) {
                goToContent();
            }
            // Delay o salto se tiver comutando visual
            setTimeout(() => {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top: offsetTop - 150, behavior: 'smooth' });
                }
            }, wasInHero ? 1050 : 0);
        }
    };

    // Controle por Scroll do Mouse / Trackpad
    window.addEventListener('wheel', (e) => {
        if (isAnimating) {
            e.preventDefault();
            return;
        }
        
        if (isHeroView) {
            if (e.deltaY > 0) { // Indo pra baixo
                e.preventDefault(); 
                goToContent();
            }
        } else {
            if (e.deltaY < 0 && window.scrollY <= 0) { // Indo pra cima E no topo da página
                e.preventDefault();
                goToHero();
            }
        }
    }, { passive: false });

    // Intercepta o Botão Adquirir da Hero para não quebrar a transição via âncora nativa
    const heroBtnAdquirir = document.querySelector('.hero-btn');
    if (heroBtnAdquirir) {
        heroBtnAdquirir.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = heroBtnAdquirir.getAttribute('href');
            if (window.aurumNavigation) {
                window.aurumNavigation(targetId);
            }
        });
    }

    // Controle de Teclado
    window.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        
        if (isHeroView) {
            if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
                e.preventDefault();
                goToContent();
            }
        } else {
            if (['ArrowUp', 'PageUp'].includes(e.key) && window.scrollY <= 0) {
                e.preventDefault();
                goToHero();
            }
        }
    });

    // Controle Touch Screen / Celular swipe
    let startY = 0;
    window.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isAnimating) return;
        let pY = e.touches[0].clientY;
        let deltaY = startY - pY; // se positivo é igual a arrastar a tela pra baixo (queremos subir cont)
        
        if (isHeroView) {
            if (deltaY > 40) { // threshold do swipe
                goToContent();
            }
        } else {
            if (deltaY < -40 && window.scrollY <= 0) {
                goToHero();
            }
        }
    }, { passive: true });

    // Observador Inteligente de Rolagem Vertical (Espião de Seção)
    window.addEventListener('scroll', () => {
        if (isHeroView || isAnimating) return;
        
        let currentSectionId = '';
        const sections = document.querySelectorAll('.content-section');
        
        sections.forEach(sec => {
            // Conta 250px de margem do topo para que o menu reaja um pouco antes da seção preencher o centro
            if (window.scrollY >= sec.offsetTop - 250) { 
                currentSectionId = '#' + sec.getAttribute('id');
            }
        });
        
        if (currentSectionId && window.updateNavPill) {
            window.updateNavPill(currentSectionId);
        }
    });
});
