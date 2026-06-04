/**
 * Network Background Module
 * Renders the interactive plexus/constellation background
 */

function initNetworkBackground() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, 0.5)`; ctx.fill();
        }
    }

    const init = () => {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 150) {
                    ctx.beginPath(); ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist/150) * 0.2})`;
                    ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    };

    window.onresize = resize;
    resize(); animate();
}