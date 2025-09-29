document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DA ANIMAÇÃO DE SCROLL (COM NOVAS FUNÇÕES) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const title = element.querySelector('.slide-title[data-effect=scramble]');

                if (title && !title.classList.contains('has-animated')) {
                    title.classList.add('has-animated');
                    scrambleText(title);
                }
                
                element.classList.add('is-visible');
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.2 });
    animatedElements.forEach(element => { observer.observe(element); });

    // --- FUNÇÃO DA ANIMAÇÃO DE TEXTO SCRAMBLE (AJUSTADA) ---
    function scrambleText(element) {
        if (!element) return;
        const originalText = element.textContent;
        const chars = '!<>-_\\/[]{}—=+*^?#_';
        let frame = 0;
        // --- AJUSTE AQUI: AUMENTADO NOVAMENTE PARA UM EFEITO MAIS LENTO E DRAMÁTICO ---
        const frameRate = 8;
        const totalFrames = originalText.length * (frameRate + 5);
        element.style.opacity = 1;

        const animate = () => {
            let newText = '';
            for (let i = 0; i < originalText.length; i++) {
                const progress = (frame - (i * (frameRate / 2))) / frameRate;
                if (progress < 1 && progress > 0) {
                    newText += chars[Math.floor(Math.random() * chars.length)];
                } else if (progress >= 1) {
                    newText += originalText[i];
                } else {
                    newText += ' ';
                }
            }
            element.textContent = newText;
            frame++;
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText;
            }
        };
        setTimeout(animate, 100);
    }

    // --- FUNÇÃO DO EFEITO 3D INTERATIVO NOS CARDS ---
    const interactiveCards = document.querySelectorAll('.problem-cards .card, .criterion, .tier-card, .flow-step');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = -y / 25;
            const rotateY = x / 25;
            card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            anime({ targets: card, scale: 1, rotateX: 0, rotateY: 0, easing: 'spring(1, 80, 10, 0)' });
        });
    });

    // --- LÓGICA DA ANIMAÇÃO DE FUNDO (NÓS DE DADOS) ---
    const canvas = document.getElementById('background-animation');
    if (canvas) {
        const ctx = canvas.getContext('2d'); let particles = []; const setupCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        class Particle { constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.vx = Math.random() * 0.4 - 0.2; this.vy = Math.random() * 0.4 - 0.2; this.radius = 2; } update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > canvas.width) this.vx *= -1; if (this.y < 0 || this.y > canvas.height) this.vy *= -1; } draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = '#007aff'; ctx.fill(); } }
        const createParticles = () => { particles = []; const particleCount = Math.floor((canvas.width * canvas.height) / 15000); for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); } };
        const connectParticles = () => { for (let a = 0; a < particles.length; a++) { for (let b = a; b < particles.length; b++) { const dx = particles[a].x - particles[b].x; const dy = particles[a].y - particles[b].y; const distance = Math.sqrt(dx * dx + dy * dy); if (distance < 150) { const opacity = 1 - (distance / 150); ctx.strokeStyle = `rgba(0, 122, 255, ${opacity})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke(); } } } };
        const animate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); connectParticles(); requestAnimationFrame(animate); };
        setupCanvas(); createParticles(); animate();
        window.addEventListener('resize', () => { setupCanvas(); createParticles(); });
    }

    // --- LÓGICA DA BARRA DE PROGRESSO DE SCROLL ---
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }
});
