(function () {
  const STORAGE_KEY = '4yeo-bg-mode';
  const MODES = ['particles', 'image', 'plain'];
  const LABELS = {
    particles: 'particle background',
    image: 'graduation image background',
    plain: 'clean background',
  };

  function readMode() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return MODES.includes(stored) ? stored : 'particles';
    } catch (_) {
      return 'particles';
    }
  }

  function saveMode(mode) {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (_) {
      // Private browsing can block localStorage; the UI still works for the session.
    }
  }

  function setMode(mode, button) {
    document.body.classList.remove('bg-mode-particles', 'bg-mode-image', 'bg-mode-plain');
    document.body.classList.add(`bg-mode-${mode}`);
    document.body.classList.toggle('bg-image', mode === 'image');

    if (button) {
      button.dataset.mode = mode;
      button.title = `Background: ${LABELS[mode]}. Click to switch.`;
      button.setAttribute('aria-label', `Switch background. Current mode: ${LABELS[mode]}.`);
    }

    saveMode(mode);
  }

  function init() {
    const button = document.createElement('button');
    button.id = 'bg-switcher';
    button.type = 'button';
    button.innerHTML = '<span class="bg-switcher__glyph" aria-hidden="true"></span>';
    document.body.appendChild(button);

    let currentMode = readMode();
    setMode(currentMode, button);

    button.addEventListener('click', () => {
      const nextIndex = (MODES.indexOf(currentMode) + 1) % MODES.length;
      currentMode = MODES[nextIndex];
      setMode(currentMode, button);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
