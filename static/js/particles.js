// 粒子背景动画
(function () {
  const canvas = document.getElementById('particles-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 60;
  const MAX_DISTANCE = 120;

  // 根据主题模式切换颜色
  function getColors() {
    const isDark = document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return {
      dot: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(100,100,100,0.4)',
      line: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(100,100,100,0.06)',
    };
  }

  function resize() {
    width = window.innerWidth;
    height = document.documentElement.scrollHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class Particle {
    constructor() {
      this.reset();
      // 初始随机分布
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // 边界反弹
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(ctx, color) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  // 初始化粒子
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function draw() {
    const colors = getColors();
    ctx.clearRect(0, 0, width, height);

    // 画连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = colors.line;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // 画粒子
    particles.forEach(p => {
      p.update();
      p.draw(ctx, colors.dot);
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);

  // 监听主题切换（点击主题按钮后重绘）
  const observer = new MutationObserver(() => {
    // 触发重绘，颜色会在下一帧更新
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  draw();
})();
