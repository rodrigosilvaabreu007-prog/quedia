// Animação de partículas conectadas e interativas
const canvas = document.getElementById('particles-bg');
const ctx = canvas.getContext('2d');
let width, height;
let mouse = { x: null, y: null };
const PARTICLE_COUNT = 60;
const PARTICLE_RADIUS = 6;
const LINE_DISTANCE = 120;
const PARTICLE_COLOR = getComputedStyle(document.body).getPropertyValue('--cor-principal') || '#fff';

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Adicionar pointer-events: none ao canvas para não interferir com outros elementos
canvas.style.pointerEvents = 'none';

// Partícula
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;
    this.baseX = this.x;
    this.baseY = this.y;
    this.color = PARTICLE_COLOR;
  }
  update() {
    // Movimento contínuo
    this.x += this.vx;
    this.y += this.vy;
    
    // Rebote nas bordas
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    
    // Interação com mouse - afastar do mouse
    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        this.x += (dx / dist) * 2;
        this.y += (dy / dist) * 2;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, PARTICLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

function animate() {
  ctx.clearRect(0, 0, width, height);
  // Desenha linhas entre partículas próximas
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LINE_DISTANCE) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = PARTICLE_COLOR;
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
  // Desenha partículas
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// Capturar eventos de mousemove do documento inteiro, não apenas do canvas
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

document.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

