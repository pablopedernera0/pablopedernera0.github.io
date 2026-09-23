    // Materias filtrables por la barra de navegación: infraestructura, desarrollo, redes.
    // "Inicio" y "Contacto" no filtran, solo hacen scroll (se manejan más abajo).
    const MATERIAS = ['infraestructura', 'desarrollo', 'redes'];

    function mostrarMateria(id) {
        const esMateria = MATERIAS.indexOf(id) !== -1;
        document.querySelectorAll('.course-card').forEach(function (card) {
            card.style.display = (!esMateria || card.id === id) ? '' : 'none';
        });
        const grid = document.querySelector('.courses-grid');
        if (grid) {
            grid.classList.toggle('single-column', esMateria);
        }
        document.querySelectorAll('.nav-links a').forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
    }

    document.querySelectorAll('.nav-links a').forEach(function (a) {
        const id = (a.getAttribute('href') || '').slice(1);
        if (MATERIAS.indexOf(id) === -1) return;
        a.addEventListener('click', function (e) {
            e.preventDefault();
            mostrarMateria(id);
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    document.querySelectorAll('.nav-links a[href="#inicio"]').forEach(function (a) {
        a.addEventListener('click', function () { mostrarMateria('inicio'); });
    });

    // Deep link directo (ej. pablopedernera0.github.io/#infraestructura): filtra al cargar
    // y también si el hash cambia sin recarga completa (URL bar, atrás/adelante).
    function aplicarFiltroDesdeHash() {
        const hash = window.location.hash.slice(1);
        if (MATERIAS.indexOf(hash) !== -1) {
            mostrarMateria(hash);
        }
    }
    aplicarFiltroDesdeHash();
    window.addEventListener('hashchange', aplicarFiltroDesdeHash);

    // Smooth scrolling para el resto de los enlaces de navegación (Inicio, Contacto).
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (MATERIAS.indexOf(href.slice(1)) !== -1) return; // ya se maneja arriba
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efecto de parallax suave en el header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        const rate = scrolled * 0.5;
        header.style.transform = `translateY(${rate}px)`;
    });

    // Animación de aparición de las tarjetas al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar observer a las tarjetas de cursos
    document.querySelectorAll('.course-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });