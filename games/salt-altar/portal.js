'use strict';
(function () {
  let sessionProgress = 1;
  function progress() {
    try { sessionProgress = Math.max(sessionProgress, Math.min(14, Math.max(1, parseInt(localStorage.getItem('saltAltarProgress') || '1', 10) || 1))); } catch (_) {}
    return sessionProgress;
  }
  function advance(next) {
    sessionProgress = Math.max(progress(), Math.min(14, Math.max(1, next)));
    try { localStorage.setItem('saltAltarProgress', String(sessionProgress)); } catch (_) {}
    return sessionProgress;
  }
  window.SaltAltarHost = { progress, advance };
  document.addEventListener('DOMContentLoaded', () => {
    const controls = document.querySelector('.touch-controls');
    if (!controls) return;
    const pressed = new Set();
    const send = (key, down) => window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { key, code: key, bubbles: true, cancelable: true }));
    function releaseAll() { for (const key of pressed) send(key, false); pressed.clear(); controls.querySelectorAll('button').forEach(b => b.classList.remove('pressed')); }
    controls.querySelectorAll('[data-key]').forEach(button => {
      const key = button.dataset.key;
      button.addEventListener('pointerdown', event => {
        event.preventDefault(); button.setPointerCapture(event.pointerId); pressed.add(key); button.classList.add('pressed'); send(key, true);
      });
      function release(event) { event.preventDefault(); pressed.delete(key); button.classList.remove('pressed'); send(key, false); }
      button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
      button.addEventListener('contextmenu', event => event.preventDefault());
    });
    window.addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });
  });
})();
