// 背景模式管理器
(function () {
  const STORAGE_KEY = '4yeo-bg-mode';
  const MODES = ['particles', 'plain', 'image'];
  const MODE_LABELS = { particles: '粒子', plain: '纯色', image: '图片' };
  const MODE_ICONS = { particles: '✦', plain: '◻', image: '🖼' };

  let currentMode = localStorage.getItem(STORAGE_KEY) || 'particles';

  // 创建切换按钮
  const btn = document.createElement('button');
  btn.id = 'bg-switcher';
  btn.title = '切换背景';
  btn.innerHTML = MODE_ICONS[currentMode];
  btn.setAttribute('aria-label', '切换背景模式');
  document.body.appendChild(btn);

  // 更新粒子可见性
  function updateParticles(show) {
    const canvas = document.getElementById('particles-bg');
    if (canvas) {
      canvas.style.display = show ? 'block' : 'none';
    }
  }

  // 更新图片背景
  function updateImageBg(show) {
    if (show) {
      document.body.classList.add('bg-image');
    } else {
      document.body.classList.remove('bg-image');
    }
  }

  // 应用模式
  function applyMode(mode) {
    currentMode = mode;
    localStorage.setItem(STORAGE_KEY, mode);
    btn.innerHTML = MODE_ICONS[mode];
    btn.title = '背景：' + MODE_LABELS[mode] + '（点击切换）';

    updateParticles(mode === 'particles');
    updateImageBg(mode === 'image');
  }

  // 点击切换
  btn.addEventListener('click', () => {
    const idx = MODES.indexOf(currentMode);
    const next = MODES[(idx + 1) % MODES.length];
    applyMode(next);
  });

  // 初始应用
  applyMode(currentMode);
})();
