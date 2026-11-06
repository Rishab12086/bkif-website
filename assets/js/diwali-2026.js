/* BKIF Diwali 2026: fireworks greeting on the home page.
   A dark see-through layer dims the page, big fireworks burst on top of it and
   "Happy Diwali" is written in the middle of the screen. It fades away on its
   own after a few seconds; a click, the ✕ or Esc closes it sooner.
   The marigold garland under the header shows on every page.
   Switches itself off after 12 Nov 2026 23:59 IST. Once per visit (tab session).
   Add ?diwali to the home page URL to replay. After Diwali, delete this file
   and the <script src="assets/js/diwali-2026.js"> line from each page. */
(function () {
  var DIWALI_ENDS = new Date('2026-11-12T23:59:59+05:30').getTime();
  if (Date.now() > DIWALI_ENDS) return;

  var HOME_PATH = '/';
  var SEEN_KEY = 'bkif-diwali-2026';
  var SHOW_MS = 7500;        // how long the greeting stays before fading out
  var COLORS = ['#FFD36B', '#FFB33F', '#FF8A1F', '#FF5E3A', '#EE0055', '#FF4FA3', '#FFF4D6', '#7CF2FF'];

  var CSS =
    '.bkd-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;' +
      'background:radial-gradient(ellipse at 50% 115%,rgba(255,138,31,.3),transparent 55%),rgba(12,3,8,.8);' +
      '-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);' +
      'animation:bkdFadeIn .5s ease-out both}' +
    '.bkd-overlay.bkd-out{animation:bkdFadeOut .7s ease-in forwards}' +
    '.bkd-overlay *{box-sizing:border-box}' +
    '.bkd-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}' +
    '.bkd-content{position:relative;z-index:2;max-width:640px;padding:0 22px;text-align:center;color:#fff4dc;' +
      'font-family:"Urbanist",Helvetica,Arial,sans-serif;pointer-events:none;' +
      'animation:bkdRise .9s .25s cubic-bezier(.2,.8,.2,1) both}' +
    '.bkd-kicker{margin:0 0 6px;font-size:14px;font-weight:700;letter-spacing:.34em;text-transform:uppercase;color:#ffc46b;text-shadow:0 2px 12px rgba(0,0,0,.6)}' +
    '.bkd-title{margin:0 0 16px;font-weight:800;font-size:clamp(52px,11vw,104px);line-height:1.02;' +
      'background:linear-gradient(180deg,#fff6d8 0%,#ffd36b 45%,#ff9a2e 100%);-webkit-background-clip:text;background-clip:text;color:transparent;' +
      'filter:drop-shadow(0 4px 24px rgba(255,150,40,.45))}' +
    '.bkd-msg{margin:0 auto;max-width:520px;font-size:clamp(16px,2.4vw,20px);line-height:1.55;color:rgba(255,242,220,.95);text-shadow:0 2px 14px rgba(0,0,0,.7)}' +
    '.bkd-sign{margin:14px 0 0;font-size:clamp(14px,1.8vw,16px);font-weight:700;color:#ffc46b;text-shadow:0 2px 12px rgba(0,0,0,.6)}' +
    '.bkd-diyas{display:flex;justify-content:center;gap:clamp(16px,4vw,34px);margin-top:26px}' +
    '.bkd-diya{position:relative;width:48px;margin-top:16px}' +
    '.bkd-lamp{display:block;width:100%;filter:drop-shadow(0 0 10px rgba(255,150,40,.55))}' +
    '.bkd-flame{position:absolute;left:50%;bottom:70%;width:10px;height:18px;margin-left:-5px;' +
      'border-radius:50% 50% 50% 50%/65% 65% 35% 35%;' +
      'background:radial-gradient(ellipse at 50% 75%,#fff8d6 0%,#ffd36b 35%,#ff8a1f 70%,transparent 100%);' +
      'box-shadow:0 0 18px 6px rgba(255,170,60,.5);transform-origin:50% 100%;' +
      'animation:bkdFlicker 1.4s ease-in-out infinite alternate}' +
    '.bkd-close{position:absolute;top:18px;right:18px;z-index:3;width:40px;height:40px;padding:0;border-radius:50%;' +
      'border:1px solid rgba(255,211,107,.45);background:rgba(0,0,0,.3);color:#ffe2a3;font-size:17px;line-height:38px;cursor:pointer}' +
    '.bkd-close:hover{background:rgba(255,211,107,.18)}' +
    '.bkd-toran{position:absolute;top:100%;left:0;right:0;height:26px;z-index:40;pointer-events:none;' +
      'background-repeat:repeat-x;background-size:56px 26px;transform-origin:top center;' +
      'animation:bkdSway 4s ease-in-out infinite alternate;' +
      'background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'56\' height=\'26\' viewBox=\'0 0 56 26\'><path d=\'M0 2 Q28 9 56 2\' stroke=\'%23C8901E\' stroke-width=\'1.2\' fill=\'none\'/><circle cx=\'28\' cy=\'9\' r=\'3.6\' fill=\'%23FF9F1C\'/><circle cx=\'28\' cy=\'15.5\' r=\'3.4\' fill=\'%23FFC233\'/><circle cx=\'28\' cy=\'21.5\' r=\'3\' fill=\'%23FF7A00\'/><path d=\'M4 3 Q0 10 4 16 Q8 10 4 3 Z\' fill=\'%232E8B3A\'/><path d=\'M52 3 Q48 10 52 16 Q56 10 52 3 Z\' fill=\'%232E8B3A\'/></svg>")}' +
    '@keyframes bkdFadeIn{from{opacity:0}to{opacity:1}}' +
    '@keyframes bkdFadeOut{from{opacity:1}to{opacity:0;visibility:hidden}}' +
    '@keyframes bkdRise{from{opacity:0;transform:translateY(26px) scale(.96)}to{opacity:1;transform:none}}' +
    '@keyframes bkdFlicker{0%{transform:scale(1,1) rotate(-2deg);opacity:.95}50%{transform:scale(.92,1.08) rotate(2deg);opacity:1}100%{transform:scale(1.04,.94) rotate(-1deg);opacity:.9}}' +
    '@keyframes bkdSway{from{transform:skewX(-1.5deg)}to{transform:skewX(1.5deg)}}' +
    '@media (max-width:640px){.bkd-diya{width:40px}.bkd-kicker{font-size:12px}}' +
    '@media (prefers-reduced-motion:reduce){.bkd-overlay,.bkd-content,.bkd-flame,.bkd-toran{animation:none}.bkd-overlay.bkd-out{opacity:0}}';

  var DIYA_SVG =
    '<svg viewBox="0 0 64 28" class="bkd-lamp" aria-hidden="true"><defs>' +
    '<linearGradient id="bkd-clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0782F"/><stop offset="1" stop-color="#8A3412"/></linearGradient></defs>' +
    '<path d="M2 6 Q32 34 62 6 Q46 2 32 2 Q18 2 2 6 Z" fill="url(#bkd-clay)"/>' +
    '<path d="M6 7 Q32 12 58 7" stroke="#FFC46B" stroke-width="1.5" fill="none"/>' +
    '<circle cx="20" cy="14" r="1.6" fill="#FFD36B"/><circle cx="32" cy="17" r="1.6" fill="#FFD36B"/><circle cx="44" cy="14" r="1.6" fill="#FFD36B"/></svg>';

  function start() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Marigold garland under the header, on every page.
    var header = document.querySelector('.site-header');
    if (header) {
      var toran = document.createElement('div');
      toran.className = 'bkd-toran';
      toran.setAttribute('aria-hidden', 'true');
      header.appendChild(toran);
    }

    // Greeting: home page only, once per visit.
    var path = location.pathname.replace(/index\.html$/, '');
    if (path !== HOME_PATH) return;
    var replay = /[?&]diwali\b/.test(location.search);
    var seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
    if (seen && !replay) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {}

    showGreeting();
  }

  function showGreeting() {
    var overlay = document.createElement('div');
    overlay.className = 'bkd-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Happy Diwali from BankersKlub India Foundation');

    var diyas = '';
    for (var i = 0; i < 5; i++) {
      diyas += '<div class="bkd-diya"><span class="bkd-flame" style="animation-delay:' + (i * 0.2).toFixed(1) + 's"></span>' + DIYA_SVG + '</div>';
    }
    overlay.innerHTML =
      '<canvas class="bkd-canvas" aria-hidden="true"></canvas>' +
      '<button type="button" class="bkd-close" aria-label="Close">✕</button>' +
      '<div class="bkd-content">' +
        '<p class="bkd-kicker">Shubh Deepavali</p>' +
        '<p class="bkd-title">Happy Diwali</p>' +
        '<p class="bkd-msg">Wishing you and your family a joyful, bright and prosperous Diwali.</p>' +
        '<p class="bkd-sign">— Team BankersKlub India Foundation</p>' +
        '<div class="bkd-diyas" aria-hidden="true">' + diyas + '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var stopFireworks = null;
    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      overlay.classList.add('bkd-out');
      setTimeout(function () {
        if (stopFireworks) stopFireworks();
        overlay.remove();
      }, 700);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    var timer = setTimeout(close, SHOW_MS);
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', close);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stopFireworks = runFireworks(overlay.querySelector('.bkd-canvas'));
    }
  }

  function runFireworks(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var small = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    var maxSparks = small ? 1100 : 2600;
    var sparksPerBurst = small ? 80 : 130;
    var width = 0, height = 0;
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var rockets = [], sparks = [], flashes = [];
    var scale = Math.max(0.75, Math.min(1.4, Math.min(width, height) / 700));
    function pick() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
    function launch() {
      rockets.push({
        x: width * (0.08 + Math.random() * 0.84), y: height,
        vy: -(height / 62 + Math.random() * 4),
        targetY: height * (0.1 + Math.random() * 0.4), color: pick()
      });
    }
    function burst(x, y, color) {
      var second = Math.random() < 0.5 ? pick() : color;
      var ring = Math.random() < 0.3;   // some bursts are clean rings, the rest full peonies
      var power = (small ? 4.2 : 6.2) * scale;
      flashes.push({ x: x, y: y, r: 70 * scale, life: 1 });
      for (var i = 0; i < sparksPerBurst && sparks.length < maxSparks; i++) {
        var angle = (Math.PI * 2 * i) / sparksPerBurst + Math.random() * 0.15;
        var speed = ring ? power * (0.9 + Math.random() * 0.15) : 1.2 + Math.random() * power;
        sparks.push({
          x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, decay: 0.0075 + Math.random() * 0.009,
          color: i % 3 === 0 ? second : color,
          size: (small ? 1.8 : 2.4) + Math.random() * 1.8, twinkle: Math.random() < 0.3
        });
      }
    }

    // Opening salvo so the screen lights up straight away.
    for (var b = 0; b < (small ? 3 : 5); b++) {
      burst(width * (0.12 + Math.random() * 0.76), height * (0.12 + Math.random() * 0.32), pick());
    }

    var frame = 0, nextLaunch = 8, raf = 0;
    ctx.lineCap = 'round';

    function tick() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';   // overlapping sparks glow brighter

      if (frame >= nextLaunch) {
        launch();
        if (Math.random() < (small ? 0.35 : 0.55)) launch();
        nextLaunch = frame + (small ? 20 : 14) + Math.random() * 14;
      }

      for (var f = flashes.length - 1; f >= 0; f--) {
        var fl = flashes[f];
        var g = ctx.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, fl.r);
        g.addColorStop(0, 'rgba(255,240,200,' + (0.55 * fl.life).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,160,60,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
        ctx.fill();
        fl.life -= 0.08;
        if (fl.life <= 0) flashes.splice(f, 1);
      }

      for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.985;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y - r.vy * 4);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        if (r.y <= r.targetY || r.vy > -1.2) { burst(r.x, r.y, r.color); rockets.splice(i, 1); }
      }

      for (var j = sparks.length - 1; j >= 0; j--) {
        var s = sparks[j];
        s.vx *= 0.972;
        s.vy = s.vy * 0.972 + 0.05;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(j, 1); continue; }
        ctx.globalAlpha = s.twinkle ? s.life * (0.35 + Math.random() * 0.65) : s.life;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * 3.5, s.y - s.vy * 3.5);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      frame++;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return function () {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
