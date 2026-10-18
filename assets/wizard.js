/* The resident wizard. Original procedural character art; no image or sprite assets. */
(function (root) {
  'use strict';
  const TAU = Math.PI * 2;
  function ellipse(c, x, y, rx, ry, fill) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fillStyle = fill; c.fill();
  }
  function shape(c, points, fill, stroke = '#0c1915', width = 3) {
    c.beginPath(); c.moveTo(...points[0]);
    for (const p of points.slice(1)) c.lineTo(...p);
    c.closePath(); c.fillStyle = fill; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function curve(c, points, stroke, width = 2) {
    c.beginPath(); c.moveTo(points[0], points[1]); c.bezierCurveTo(...points.slice(2));
    c.strokeStyle = stroke; c.lineWidth = width; c.lineCap = 'round'; c.stroke();
  }
  function gradient(c, x, y, r, color) {
    const g = c.createRadialGradient(x, y, 1, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, color.slice(0, 7) + '00'); return g;
  }
  function crystal(c, x, y, size, color) {
    c.save(); c.translate(x, y); c.rotate(-.14);
    shape(c, [[-size * .3, 0], [-size * .42, -size * .7], [-size * .12, -size], [size * .16, -size * .9], [size * .35, -size * .18], [size * .16, size * .06]], color, '#233e32', 2);
    shape(c, [[-size * .12, -size], [size * .16, -size * .9], [size * .35, -size * .18], [0, -size * .3]], '#e0f4c64a', null);
    curve(c, [-size * .1, -size * .8, -size * .08, -size * .5, 0, -size * .26, 0, 0], '#e9ffdc55', 1.2);
    c.restore();
  }
  function drawWizard(c, width, height, seconds = 0, gaze = { x: 0, y: 0 }) {
    c.save(); c.clearRect(0, 0, width, height);
    const scale = Math.min(width / 690, height / 640);
    c.translate((width - 690 * scale) / 2, (height - 640 * scale) / 2); c.scale(scale, scale);
    c.lineJoin = 'round'; c.lineCap = 'round';
    const t = seconds, float = Math.sin(t * 1.1) * 3;
    // A ruined grove, a thin stone arch, and drifting spores.
    c.fillStyle = gradient(c, 355, 295, 290, '#b4d48c1e'); c.fillRect(20, 0, 650, 630);
    c.beginPath(); c.ellipse(350, 317, 232, 259, -.12, Math.PI * 1.04, Math.PI * 2.02);
    c.strokeStyle = '#a6c78b13'; c.lineWidth = 1; c.stroke();
    c.beginPath(); c.ellipse(350, 317, 248, 275, -.12, Math.PI * 1.2, Math.PI * 1.95);
    c.strokeStyle = '#a6c78b09'; c.stroke();
    for (let i = 0; i < 44; i++) {
      const a = i * 2.399, r = 160 + (i * 37 % 123), x = 350 + Math.cos(a) * r;
      const y = 306 + Math.sin(a) * r * .9 + Math.sin(t * .35 + i) * 7;
      c.globalAlpha = .12 + (.5 + .5 * Math.sin(t * .6 + i)) * .35;
      ellipse(c, x, y, i % 7 === 0 ? 2 : 1, i % 7 === 0 ? 2 : 1, i % 3 ? '#b4ce8b' : '#efffcf');
    } c.globalAlpha = 1;
    // Ground and root-covered basalt, all made from paths.
    ellipse(c, 346, 589, 243, 29, '#00000036');
    shape(c, [[131, 542], [195, 520], [265, 523], [328, 515], [407, 520], [491, 535], [558, 557], [518, 580], [446, 586], [380, 603], [300, 593], [248, 602], [191, 581], [138, 573]], '#263128', '#101c17', 4);
    shape(c, [[138, 547], [227, 530], [331, 534], [403, 527], [499, 543], [548, 559], [458, 567], [363, 557], [263, 574], [177, 563]], '#414a35', '#1c2a20', 2);
    for (let i = 0; i < 9; i++) {
      const x = 174 + i * 42, y = 550 + Math.sin(i * 5) * 12;
      curve(c, [x, y, x + 12, y + 9, x - 15, y + 19, x + 4, y + 29], '#15241c', 2);
      ellipse(c, x + 2, y + 1, 11 + i % 3 * 3, 3, '#7e975d42');
    }
    crystal(c, 174, 545, 72, '#829783'); crystal(c, 150, 552, 43, '#607561');
    crystal(c, 548, 562, 51, '#7c927d'); crystal(c, 522, 565, 31, '#9db191');
    for (let i = 0; i < 10; i++) {
      const x = 177 + i * 36, y = 558 + Math.sin(i * 2) * 12;
      curve(c, [x, y, x - 10, y - 9, x + 3, y - 15, x - 7, y - 27], '#567b49', 2);
      ellipse(c, x - 6, y - 22, 4, 2, '#6b8c4a');
    }
    // Crooked boots and the ragged robe.
    c.save(); c.translate(0, float);
    shape(c, [[279, 492], [300, 493], [302, 536], [265, 553], [230, 548], [256, 526]], '#3a4234', '#101d17', 4);
    shape(c, [[367, 494], [395, 492], [401, 534], [442, 547], [409, 553], [369, 542]], '#333e32', '#101d17', 4);
    const robe = c.createLinearGradient(250, 330, 417, 540);
    robe.addColorStop(0, '#555b64'); robe.addColorStop(.45, '#424952'); robe.addColorStop(1, '#252f32');
    c.beginPath(); c.moveTo(282, 337); c.bezierCurveTo(271, 390, 246, 465, 221, 521);
    c.lineTo(253, 518); c.lineTo(269, 540); c.lineTo(292, 524); c.lineTo(325, 544);
    c.lineTo(350, 530); c.lineTo(379, 540); c.lineTo(398, 523); c.lineTo(426, 526);
    c.bezierCurveTo(405, 456, 414, 389, 380, 342); c.closePath();
    c.fillStyle = robe; c.fill(); c.strokeStyle = '#11211b'; c.lineWidth = 4; c.stroke();
    curve(c, [290, 366, 304, 424, 263, 484, 277, 520], '#7e87804d', 2);
    curve(c, [359, 372, 352, 433, 383, 475, 379, 519], '#121e2455', 4);
    curve(c, [337, 395, 312, 451, 350, 473, 325, 536], '#b3baa326', 1.5);
    for (let i = 0; i < 28; i++) {
      const x = 261 + i * 47 % 117, y = 382 + i * 23 % 131;
      ellipse(c, x, y, i % 4 + 1, 1, '#afc19a12');
    }
    // Patch, stitches, satchel, and belt. A lived-in sort of wizard.
    shape(c, [[270, 458], [296, 453], [300, 482], [272, 486]], '#5a6854', '#1d3025', 2);
    for (let i = 0; i < 4; i++) curve(c, [270 + i * 7, 454, 271 + i * 7, 458, 272 + i * 7, 459, 272 + i * 7, 462], '#9aa985', 1);
    curve(c, [271, 423, 312, 439, 357, 439, 395, 423], '#6a624a', 8);
    shape(c, [[326, 426], [344, 426], [344, 439], [326, 439]], '#a2a27a', '#273b2b', 2);
    shape(c, [[382, 427], [406, 431], [407, 461], [381, 464], [373, 449]], '#5b6345', '#1a2b1f', 3);
    ellipse(c, 393, 442, 3, 3, '#abb383');
    // Big, drooping sleeves and gnarled hands.
    shape(c, [[283, 349], [247, 364], [208, 429], [237, 451], [279, 402], [302, 384]], '#424e51', '#11211b', 4);
    curve(c, [247, 374, 241, 404, 218, 420, 221, 437], '#a0b49738', 2);
    shape(c, [[386, 347], [418, 363], [467, 337], [485, 370], [420, 407], [392, 389]], '#414d50', '#11211b', 4);
    ellipse(c, 478, 349, 16, 19, '#879b69');
    curve(c, [474, 336, 486, 334, 490, 341, 484, 347], '#203d29', 2);
    curve(c, [469, 346, 480, 342, 491, 345, 486, 351], '#203d29', 2);
    // Staff is a twisted branch, with an eye that would look at home in the lake.
    curve(c, [479, 557, 474, 411, 507, 312, 492, 162], '#14241b', 12);
    curve(c, [479, 557, 474, 411, 507, 312, 492, 162], '#6c7650', 7);
    curve(c, [477, 546, 482, 407, 492, 304, 491, 179], '#a6ac7566', 1.5);
    curve(c, [495, 183, 458, 175, 465, 132, 492, 131], '#5d724a', 8);
    curve(c, [492, 181, 532, 165, 527, 127, 503, 125], '#617b4b', 7);
    const orbY = 143 + Math.sin(t * 1.7) * 2;
    c.fillStyle = gradient(c, 496, orbY, 69, '#d5f7a13f'); c.fillRect(421, 70, 150, 150);
    ellipse(c, 496, orbY, 21, 24, '#d3eca7'); ellipse(c, 496 + gaze.x * 3, orbY + gaze.y * 2, 8, 13, '#203328'); ellipse(c, 491, orbY - 6, 4, 5, '#f2ffd9');
    curve(c, [480, 158, 483, 176, 484, 184, 490, 191], '#94a967', 3);
    // Pointy ears, lumpy face, and unequal, luminous eyes.
    shape(c, [[274, 262], [239, 248], [254, 286], [279, 292]], '#758c5d', '#152c20', 3);
    shape(c, [[383, 261], [410, 241], [401, 280], [379, 296]], '#7f9664', '#152c20', 3);
    const skin = c.createLinearGradient(274, 237, 371, 360);
    skin.addColorStop(0, '#9cb17b'); skin.addColorStop(.5, '#839b68'); skin.addColorStop(1, '#567149');
    c.beginPath(); c.moveTo(279, 231); c.bezierCurveTo(264, 247, 267, 301, 282, 323);
    c.bezierCurveTo(288, 353, 354, 365, 378, 335); c.bezierCurveTo(405, 307, 396, 258, 380, 235); c.closePath();
    c.fillStyle = skin; c.fill(); c.strokeStyle = '#172f21'; c.lineWidth = 4; c.stroke();
    for (let i = 0; i < 16; i++) ellipse(c, 282 + i * 37 % 99, 259 + i * 23 % 78, 2 + i % 3, 1 + i % 2, i % 2 ? '#bdd39b31' : '#334f3330');
    function eye(x, y, rx, ry, iris) {
      const blink = Math.pow(Math.max(0, Math.cos(t * .7 + .3)), 70);
      ellipse(c, x, y, rx + 3, ry + 3, '#3d5b3a'); ellipse(c, x, y, rx, Math.max(2, ry * (1 - blink * .83)), '#d9edaf');
      ellipse(c, x + gaze.x * 3, y + gaze.y * 2, iris, Math.max(1, (ry - 3) * (1 - blink * .83)), '#182b21');
      if (blink < .8) ellipse(c, x - 3 + gaze.x, y - 4, 2.5, 3.5, '#f3ffe0');
    }
    eye(302, 276, 16, 19, 6); eye(361, 271, 20, 24, 8);
    curve(c, [285, 251, 295, 241, 308, 248, 317, 250], '#354c32', 5);
    curve(c, [342, 246, 355, 234, 375, 237, 382, 247], '#354c32', 5);
    // Crooked hooked nose, a snaggle-toothed grin, and moss for a beard.
    c.beginPath(); c.moveTo(331, 273); c.bezierCurveTo(329, 291, 341, 299, 354, 306); c.quadraticCurveTo(346, 319, 327, 310); c.strokeStyle = '#3d5d36'; c.lineWidth = 3; c.stroke();
    c.beginPath(); c.moveTo(287, 315); c.quadraticCurveTo(330, 341, 377, 309); c.quadraticCurveTo(350, 353, 307, 340); c.closePath(); c.fillStyle = '#1b3024'; c.fill();
    for (let i = 0; i < 6; i++) { const x = 298 + i * 11, y = 320 + Math.sin(i / 5 * Math.PI) * 5; shape(c, [[x, y], [x + 4, y + 10 + i % 2 * 3], [x + 8, y + 1]], '#e0e7ad', null); }
    for (let i = 0; i < 8; i++) {
      const x = 285 + i * 13, y = 337 + Math.sin(i / 7 * Math.PI) * 11, sway = Math.sin(t * 1.5 + i) * 3;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 4, y + 24, x + 2 + sway, y + 40 + i % 3 * 9); c.quadraticCurveTo(x + 17, y + 14, x + 10, y - 1); c.fillStyle = i % 2 ? '#7f985c' : '#657f4c'; c.fill();
      curve(c, [x + 3, y + 3, x + 7, y + 13, x + 3, y + 24, x + 4 + sway, y + 31], '#b1c8874c', 1);
    }
    // A severely bent hat with a stitched crescent and a little mushroom.
    const hat = c.createLinearGradient(246, 70, 385, 248); hat.addColorStop(0, '#68766c'); hat.addColorStop(.4, '#465d56'); hat.addColorStop(1, '#2a423b');
    c.beginPath(); c.moveTo(254, 225); c.bezierCurveTo(273, 170, 285, 90, 338, 58);
    c.bezierCurveTo(366, 35, 412, 47, 432, 31); c.quadraticCurveTo(422, 72, 377, 78);
    c.bezierCurveTo(351, 107, 373, 171, 391, 219); c.closePath(); c.fillStyle = hat; c.fill(); c.strokeStyle = '#132b20'; c.lineWidth = 4; c.stroke();
    curve(c, [280, 210, 306, 159, 293, 109, 338, 71], '#a4b58b45', 2);
    curve(c, [342, 83, 327, 127, 354, 168, 363, 213], '#152f2770', 3);
    shape(c, [[261, 209], [386, 202], [392, 222], [254, 230]], '#666c4b', '#223c28', 2);
    shape(c, [[321, 207], [341, 206], [342, 221], [322, 222]], '#b0b485', '#283e2b', 2);
    shape(c, [[326, 211], [336, 210], [337, 217], [327, 218]], '#3a5037', null);
    c.beginPath(); c.moveTo(236, 224); c.bezierCurveTo(273, 208, 349, 207, 399, 216); c.quadraticCurveTo(431, 225, 419, 235); c.bezierCurveTo(359, 250, 266, 252, 226, 239); c.quadraticCurveTo(211, 232, 236, 224); c.fillStyle = '#49634b'; c.fill(); c.strokeStyle = '#152b1c'; c.lineWidth = 4; c.stroke();
    curve(c, [237, 231, 292, 240, 356, 232, 406, 229], '#b2c68d5e', 2);
    ellipse(c, 326, 154, 12, 16, '#b9c995'); ellipse(c, 332, 149, 11, 14, '#40574b');
    for (let i = 0; i < 5; i++) ellipse(c, 311 + i * 12, 188 + Math.sin(i * 4) * 9, 1.6, 1.6, '#a5bc7d77');
    curve(c, [380, 220, 389, 210, 390, 199, 396, 192], '#acb898', 3);
    ellipse(c, 398, 192, 10, 5, '#bda78e'); ellipse(c, 395, 190, 2, 1.3, '#dfe5c6');
    c.restore();
    // Wandering motes lead the eye back toward the wizard's lantern.
    for (let i = 0; i < 6; i++) {
      const x = 480 + Math.sin(t * .25 + i * 2) * 51, y = 107 + i * 29 + Math.cos(t * .4 + i) * 7;
      c.fillStyle = gradient(c, x, y, 10, '#cceba123'); c.fillRect(x - 10, y - 10, 20, 20); ellipse(c, x, y, 1.5, 1.5, '#e4f6bb99');
    }
    c.restore();
  }
  root.ZerginoxArt = { drawWizard };
  if (typeof module !== 'undefined' && module.exports) module.exports = { drawWizard };
})(typeof globalThis !== 'undefined' ? globalThis : this);
