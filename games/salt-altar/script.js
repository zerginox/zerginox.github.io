'use strict';
(() => {
  const progress = window.SaltAltarHost.progress();
  const grid = document.getElementById('levelGrid');
  document.getElementById('progressSummary').textContent = `${Math.min(6, progress - 1)} of 6 rituals completed`;
  for (let level = 1; level <= 13; level++) {
    const available = level <= 6, unlocked = available && level <= progress;
    const button = document.createElement('button'); button.type = 'button';
    button.className = `level-btn ${unlocked ? 'unlocked' : 'locked'}${available ? '' : ' future'}`;
    button.disabled = !unlocked; button.dataset.level = String(level);
    button.innerHTML = `Level ${level}<span class="level-label">${!available ? 'COMING LATER' : level < progress ? 'COMPLETED · PLAY AGAIN' : unlocked ? 'ENTER THE RITUAL ↗' : 'LOCKED'}</span>`;
    if (unlocked) button.addEventListener('click', () => { window.location.href = `level${level}.html`; });
    grid.append(button);
  }
  const audio = document.getElementById('themeMusic'), button = document.getElementById('soundToggle');
  let playing = false;
  button.addEventListener('click', async () => {
    try {
      if (!playing) { audio.muted = false; await audio.play(); playing = true; }
      else { audio.pause(); playing = false; }
      button.textContent = playing ? 'SOUND ON' : 'SOUND OFF'; button.setAttribute('aria-pressed', String(playing));
    } catch (_) { button.textContent = 'SOUND UNAVAILABLE'; }
  });
})();
