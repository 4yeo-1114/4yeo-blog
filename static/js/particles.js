(function () {
  const canvas = document.getElementById('particles-bg');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const particles = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let animationFrame = 0;

  function cssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function particleTarget() {
    const area = window.innerWidth * window.innerHeight;
    return Math.max(28, Math.min(62, Math.round(area / 26000)));
  }

  function createParticle() {
    const speed = 0.16 + Math.random() * 0.34;
    const angle = Math.random() * Math.PI * 2;

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 0.9 + Math.random() * 1.4,
      alpha: 0.42 + Math.random() * 0.32,
    };
  }

  function syncParticles() {
    const target = particleTarget();
    while (particles.length < target) particles.push(createParticle());
    while (particles.length > target) particles.pop();
  }

  function resize() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    syncParticles();
  }

  function updateParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;
  }

  function draw() {
    animationFrame = window.requestAnimationFrame(draw);

    if (prefersReducedMotion.matches) {
      context.clearRect(0, 0, width, height);
      return;
    }

    const dotColor = cssVar('--particle-dot', 'rgba(37, 50, 58, 0.32)');
    const lineColor = cssVar('--particle-line', 'rgba(37, 50, 58, 0.055)');
    const maxDistance = Math.min(132, Math.max(92, width / 10));

    context.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      updateParticle(a);

      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.globalAlpha = (1 - distance / maxDistance) * 0.9;
          context.strokeStyle = lineColor;
          context.lineWidth = 0.8;
          context.stroke();
        }
      }
    }

    context.globalAlpha = 1;

    particles.forEach((particle) => {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.globalAlpha = particle.alpha;
      context.fillStyle = dotColor;
      context.fill();
    });

    context.globalAlpha = 1;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();

  window.addEventListener('beforeunload', () => {
    window.cancelAnimationFrame(animationFrame);
  });
})();
