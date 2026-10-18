'use strict';
(() => {
  const wizard = document.getElementById('wizard');
  const fishCanvas = document.getElementById('fish-preview');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gaze = { x: 0, y: 0 }, lastFrame = 0, visible = true;
  const wizardContext = wizard?.getContext('2d');
  const fishContext = fishCanvas?.getContext('2d');
  function drawFishPreview(c, w, h, t) {
    c.clearRect(0, 0, w, h);
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#142a2d'); g.addColorStop(1, '#0c1920'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 33; i++) {
      const y = 80 + (i * 31 % 295), x = i * 117 % w;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 22, y - 2, x + 55, y); c.strokeStyle = '#bddedb0c'; c.lineWidth = 1; c.stroke();
    }
    MFArt.drawFish(c, MF.FISH.find(f => f.id === 'lanterngoby'), w * .44, h * .55, 380, t);
    MFArt.drawFish(c, MF.FISH.find(f => f.id === 'widowray'), w * .78, h * .35, 145, t + 2);
    for (let i = 0; i < 17; i++) { const x = (i * 137 + 35) % w, y = 50 + (i * 63) % 330; c.beginPath(); c.arc(x, y + Math.sin(t * .4 + i) * 5, i % 4 ? 1 : 2, 0, Math.PI * 2); c.fillStyle = i % 4 ? '#9ccbb83b' : '#d9f7bc55'; c.fill(); }
  }
  function draw(time = 0) {
    const t = reduceMotion ? 0 : time / 1000;
    if (wizardContext && window.ZerginoxArt) ZerginoxArt.drawWizard(wizardContext, wizard.width, wizard.height, t, gaze);
    if (fishContext && window.MFArt) drawFishPreview(fishContext, fishCanvas.width, fishCanvas.height, t);
  }
  function animate(now) {
    if (visible && now - lastFrame >= 1000 / 24) { lastFrame = now; draw(now); }
    if (!reduceMotion) requestAnimationFrame(animate);
  }
  document.addEventListener('pointermove', event => {
    if (!wizard || reduceMotion) return;
    const box = wizard.getBoundingClientRect();
    gaze = { x: Math.max(-1, Math.min(1, (event.clientX - box.left - box.width / 2) / box.width * 2)), y: Math.max(-1, Math.min(1, (event.clientY - box.top - box.height / 2) / box.height * 2)) };
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  draw();
  if (!reduceMotion) requestAnimationFrame(animate);
})();
