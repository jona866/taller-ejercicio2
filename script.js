// ========================================
// Variables globales
// ========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');

// ========================================
// Función para el menú hamburguesa (móviles)
// ========================================
hamburger.addEventListener('click', () => {
    // Alternar clase 'active' en el menú
    navMenu.classList.toggle('active');
    
    // Animar las barras del hamburguesa
    hamburger.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ========================================
// Efecto de navegación al hacer scroll
// ========================================
window.addEventListener('scroll', () => {
    // Agregar sombra a la barra de navegación al hacer scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Mostrar/ocultar botón de volver arriba
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    // Activar enlace de navegación según la sección visible
    activarEnlaceNavegacion();
});

// ========================================
// Resaltar enlace de navegación activo
// ========================================
function activarEnlaceNavegacion() {
    const secciones = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100; // Offset para mejor detección
    
    secciones.forEach(seccion => {
        const top = seccion.offsetTop;
        const height = seccion.offsetHeight;
        const id = seccion.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            // Remover clase 'active' de todos los enlaces
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Agregar clase 'active' al enlace correspondiente
            const enlaceActivo = document.querySelector(`.nav-link[href="#${id}"]`);
            if (enlaceActivo) {
                enlaceActivo.classList.add('active');
            }
        }
    });
}

// ========================================
// Función para volver arriba suavemente
// ========================================
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// Animación de elementos al hacer scroll (Intersection Observer)
// ========================================
const observerOptions = {
    threshold: 0.1, // El elemento debe ser visible al menos un 10%
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Agregar clase de animación cuando el elemento es visible
            entry.target.classList.add('fade-in');
            
            // Dejar de observar el elemento después de animar
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar todos los elementos que queremos animar
const elementosAnimables = document.querySelectorAll(
    '.skill-card, .project-card, .about-content, .contact-content, .stat-item'
);

elementosAnimables.forEach(elemento => {
    observer.observe(elemento);
});

// ========================================
// Animación de barras de progreso de habilidades
// ========================================
const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

window.addEventListener('scroll', () => {
    const skillsSection = document.getElementById('habilidades');
    const skillsPosition = skillsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;
    
    // Animar las barras cuando la sección de habilidades es visible
    if (skillsPosition < screenPosition && !skillsAnimated) {
        skillBars.forEach(bar => {
            bar.style.animation = 'fillBar 1.5s ease forwards';
        });
        skillsAnimated = true;
    }
});

// ========================================
// Animación de números en estadísticas
// ========================================
function animarNumeros() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        const duration = 2000; // Duración de la animación en ms
        const increment = finalValue / (duration / 16); // 60 FPS
        let currentValue = 0;
        
        const updateCounter = () => {
            currentValue += increment;
            
            if (currentValue < finalValue) {
                stat.textContent = Math.floor(currentValue) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = finalValue + '+';
            }
        };
        
        updateCounter();
    });
}

// Ejecutar animación de números cuando la sección "Sobre mí" sea visible
const aboutSection = document.getElementById('sobre-mi');
let numbersAnimated = false;

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !numbersAnimated) {
            animarNumeros();
            numbersAnimated = true;
        }
    });
}, observerOptions);

aboutObserver.observe(aboutSection);

// ========================================
// Manejo del formulario de contacto
// ========================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el envío por defecto
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const asunto = document.getElementById('asunto').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validación básica
    if (!nombre || !email || !asunto || !mensaje) {
        mostrarNotificacion('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarNotificacion('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    // Aquí normalmente enviarías el formulario a un servidor
    // Por ahora, solo mostraremos un mensaje de éxito
    console.log('Formulario enviado:', { nombre, email, asunto, mensaje });
    
    // Mostrar notificación de éxito
    mostrarNotificacion('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
    
    // Limpiar el formulario
    contactForm.reset();
});

// ========================================
// Función para validar email
// ========================================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ========================================
// Función para mostrar notificaciones
// ========================================
function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    // Estilos inline para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${tipo === 'success' ? '#50c878' : '#ff6b6b'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.5s ease;
        max-width: 300px;
    `;
    
    // Agregar al body
    document.body.appendChild(notificacion);
    
    // Eliminar después de 4 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 500);
    }, 4000);
}

// ========================================
// Agregar animaciones CSS dinámicamente
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .fade-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    .nav-link.active {
        color: var(--color-primario);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ========================================
// Efecto parallax suave en hero
// ========================================
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
});

// ========================================
// Texto dinámico en hero (efecto escritura)
// ========================================
const heroSubtitle = document.querySelector('.hero-subtitle');
const textos = [
    'Desarrollador Web Full Stack',
    'Diseñador UI/UX',
    'Creador de Experiencias Digitales',
    'Apasionado por la Tecnología'
];
let textoIndex = 0;
let caracterIndex = 0;
let borrando = false;

function escribirTexto() {
    const textoActual = textos[textoIndex];
    
    if (!borrando) {
        // Escribir texto
        heroSubtitle.textContent = textoActual.substring(0, caracterIndex + 1);
        caracterIndex++;
        
        if (caracterIndex === textoActual.length) {
            // Pausar antes de borrar
            borrando = true;
            setTimeout(escribirTexto, 2000);
            return;
        }
    } else {
        // Borrar texto
        heroSubtitle.textContent = textoActual.substring(0, caracterIndex - 1);
        caracterIndex--;
        
        if (caracterIndex === 0) {
            borrando = false;
            textoIndex = (textoIndex + 1) % textos.length;
        }
    }
    
    const velocidad = borrando ? 50 : 100;
    setTimeout(escribirTexto, velocidad);
}

// Iniciar efecto de escritura después de 2 segundos
setTimeout(escribirTexto, 2000);

// ========================================
// Prevenir comportamiento por defecto de enlaces vacíos
// ========================================
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ========================================
// Agregar cursor personalizado (opcional)
// ========================================
const cursor = document.createElement('div');
cursor.className = 'cursor-custom';
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid #4a90e2;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: 0.1s;
    display: none;
`;
document.body.appendChild(cursor);

// Seguir el cursor del mouse
document.addEventListener('mousemove', (e) => {
    cursor.style.display = 'block';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Efecto al hacer hover en enlaces y botones
document.querySelectorAll('a, button').forEach(elemento => {
    elemento.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.backgroundColor = 'rgba(74, 144, 226, 0.2)';
    });
    
    elemento.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.backgroundColor = 'transparent';
    });
});

// ========================================
// Mensaje de bienvenida en consola
// ========================================
console.log('%c¡Hola! 👋', 'font-size: 24px; color: #4a90e2; font-weight: bold;');
console.log('%c¿Interesado en el código? Visita mi GitHub 🚀', 'font-size: 14px; color: #50c878;');
console.log('%cPortafolio desarrollado con ❤️ usando HTML, CSS y JavaScript vanilla', 'font-size: 12px; color: #7f8c8d;');

// ========================================
// Inicialización al cargar la página
// ========================================
window.addEventListener('load', () => {
    console.log('✅ Portafolio cargado correctamente');
    
    // Agregar clase para animaciones iniciales
    document.body.classList.add('loaded');
});
