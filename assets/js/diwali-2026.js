/* BKIF Diwali 2026: fireworks over the home page + a small greeting card.
   Loaded from every page; fireworks and card run on the home page only, the
   marigold garland under the header shows on every page.
   Switches itself off after 12 Nov 2026 23:59 IST. Once per visit (tab session).
   Add ?diwali to the home page URL to replay. After Diwali, delete this file
   and the <script src="assets/js/diwali-2026.js"> line from each page. */
(function () {
  var DIWALI_ENDS = new Date('2026-11-12T23:59:59+05:30').getTime();
  if (Date.now() > DIWALI_ENDS) return;

  var HOME_PATH = '/';        // change to '/repo-name/' if the site is served from a GitHub Pages subfolder
  var SEEN_KEY = 'bkif-diwali-2026';
  var FIREWORKS_MS = 5000;    // how long new rockets keep launching (sparks then fade out naturally)
  var CARD_MS = 8000;         // how long the greeting card stays before sliding away
  // Saturated colours so the sparks stay visible on a light page.
  var COLORS = ['#FF8A1F', '#FF5E3A', '#EE0055', '#FFB000', '#E8A317', '#C2185B', '#FF7A00'];

  var CSS =
    '.bkd-canvas{position:fixed;inset:0;width:100%;height:100%;z-index:9998;pointer-events:none;transition:opacity .8s ease}' +
    '.bkd-card{position:fixed;left:50%;bottom:24px;z-index:9999;box-sizing:border-box;width:min(430px,calc(100% - 32px));' +
      'display:flex;align-items:center;gap:14px;padding:14px 44px 14px 16px;border-radius:16px;' +
      'background:linear-gradient(135deg,#3a0d1c 0%,#1c0610 100%);border:1px solid rgba(255,196,107,.35);' +
      'box-shadow:0 14px 40px rgba(28,6,16,.35);color:#fff4dc;font-family:"Urbanist",Helvetica,Arial,sans-serif;' +
      'transform:translateX(-50%);animation:bkdUp .6s cubic-bezier(.2,.8,.2,1) both}' +
    '.bkd-card.bkd-out{animation:bkdDown .5s ease-in forwards}' +
    '.bkd-card *{box-sizing:border-box}' +
    '.bkd-diya{position:relative;flex:0 0 44px;width:44px;margin-top:14px}' +
    '.bkd-lamp{display:block;width:100%;filter:drop-shadow(0 0 8px rgba(255,150,40,.5))}' +
    '.bkd-flame{position:absolute;left:50%;bottom:70%;width:9px;height:16px;margin-left:-4.5px;' +
      'border-radius:50% 50% 50% 50%/65% 65% 35% 35%;' +
      'background:radial-gradient(ellipse at 50% 75%,#fff8d6 0%,#ffd36b 35%,#ff8a1f 70%,transparent 100%);' +
      'box-shadow:0 0 16px 5px rgba(255,170,60,.45);transform-origin:50% 100%;' +
      'animation:bkdFlicker 1.4s ease-in-out infinite alternate}' +
    '.bkd-text{min-width:0}' +
    '.bkd-title{margin:0 0 2px;font-weight:800;font-size:21px;line-height:1.15;' +
      'background:linear-gradient(180deg,#fff1c7 0%,#ffcf5c 50%,#ff9a2e 100%);' +
      '-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.bkd-msg{margin:0;font-size:14px;line-height:1.45;color:rgba(255,240,215,.9)}' +
    '.bkd-sign{margin:4px 0 0;font-size:12.5px;font-weight:600;color:#ffc46b}' +
    '.bkd-x{position:absolute;top:8px;right:8px;width:28px;height:28px;padding:0;border:0;border-radius:50%;' +
      'background:transparent;color:#ffe2a3;font-size:14px;line-height:28px;cursor:pointer}' +
    '.bkd-x:hover{background:rgba(255,211,107,.15)}' +
    '.bkd-toran{position:absolute;top:100%;left:0;right:0;height:26px;z-index:40;pointer-events:none;' +
      'background-repeat:repeat-x;background-size:56px 26px;transform-origin:top center;' +
      'animation:bkdSway 4s ease-in-out infinite alternate;' +
      'background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'56\' height=\'26\' viewBox=\'0 0 56 26\'><path d=\'M0 2 Q28 9 56 2\' stroke=\'%23C8901E\' stroke-width=\'1.2\' fill=\'none\'/><circle cx=\'28\' cy=\'9\' r=\'3.6\' fill=\'%23FF9F1C\'/><circle cx=\'28\' cy=\'15.5\' r=\'3.4\' fill=\'%23FFC233\'/><circle cx=\'28\' cy=\'21.5\' r=\'3\' fill=\'%23FF7A00\'/><path d=\'M4 3 Q0 10 4 16 Q8 10 4 3 Z\' fill=\'%232E8B3A\'/><path d=\'M52 3 Q48 10 52 16 Q56 10 52 3 Z\' fill=\'%232E8B3A\'/></svg>")}' +
    '@keyframes bkdUp{from{opacity:0;transform:translate(-50%,24px)}to{opacity:1;transform:translate(-50%,0)}}' +
    '@keyframes bkdDown{from{opacity:1;transform:translate(-50%,0)}to{opacity:0;transform:translate(-50%,24px)}}' +
    '@keyframes bkdFlicker{0%{transform:scale(1,1) rotate(-2deg);opacity:.95}50%{transform:scale(.92,1.08) rotate(2deg);opacity:1}100%{transform:scale(1.04,.94) rotate(-1deg);opacity:.9}}' +
    '@keyframes bkdSway{from{transform:skewX(-1.5deg)}to{transform:skewX(1.5deg)}}' +
    '@media (max-width:640px){.bkd-card{bottom:16px;padding:12px 40px 12px 14px}.bkd-title{font-size:19px}.bkd-msg{font-size:13.5px}}' +
    '@media (prefers-reduced-motion:reduce){.bkd-card,.bkd-card.bkd-out,.bkd-flame,.bkd-toran{animation:none}.bkd-card.bkd-out{opacity:0}}';

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

    // Marigold garland under the header, on every page where this snippet is pasted.
    var header = document.querySelector('.site-header');
    if (header) {
      var toran = document.createElement('div');
      toran.className = 'bkd-toran';
      toran.setAttribute('aria-hidden', 'true');
      header.appendChild(toran);
    }

    // Fireworks + greeting: home page only, once per visit.
    var path = location.pathname.replace(/index\.html$/, '');
    if (path !== HOME_PATH) return;
    var replay = /[?&]diwali\b/.test(location.search);
    var seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
    if (seen && !replay) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {}

    showCard();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) runFireworks();
  }

  function showCard() {
    var card = document.createElement('div');
    card.className = 'bkd-card';
    card.setAttribute('role', 'status');
    card.setAttribute('aria-live', 'polite');
    card.innerHTML =
      '<div class="bkd-diya" aria-hidden="true"><span class="bkd-flame"></span>' + DIYA_SVG + '</div>' +
      '<div class="bkd-text">' +
        '<p class="bkd-title">Happy Diwali!</p>' +
        '<p class="bkd-msg">Wishing you and your family a joyful, bright and prosperous Diwali.</p>' +
        '<p class="bkd-sign">— Team BankersKlub India Foundation</p>' +
      '</div>' +
      '<button type="button" class="bkd-x" aria-label="Close greeting">✕</button>';
    document.body.appendChild(card);

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      card.classList.add('bkd-out');
      setTimeout(function () { card.remove(); }, 500);
    }
    var timer = setTimeout(close, CARD_MS);
    card.querySelector('.bkd-x').addEventListener('click', close);
  }

  function runFireworks() {
    var canvas = document.createElement('canvas');
    canvas.className = 'bkd-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }

    var small = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    var maxSparks = small ? 450 : 1000;
    var sparksPerBurst = small ? 42 : 72;
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

    var rockets = [], sparks = [];
    function pick() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
    function launch() {
      rockets.push({
        x: width * (0.1 + Math.random() * 0.8), y: height,
        vy: -(height / 75 + Math.random() * 3),
        targetY: height * (0.12 + Math.random() * 0.33), color: pick()
      });
    }
    function burst(x, y, color) {
      var second = Math.random() < 0.4 ? pick() : color;
      for (var i = 0; i < sparksPerBurst && sparks.length < maxSparks; i++) {
        var angle = (Math.PI * 2 * i) / sparksPerBurst + Math.random() * 0.2;
        var speed = 1.5 + Math.random() * (small ? 3 : 4);
        sparks.push({
          x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, decay: 0.012 + Math.random() * 0.012,
          color: i % 3 === 0 ? second : color,
          size: (small ? 1.6 : 2) + Math.random() * 1.4, twinkle: Math.random() < 0.25
        });
      }
    }

    // Opening bursts so something is visible straight away.
    for (var b = 0; b < (small ? 2 : 3); b++) {
      burst(width * (0.15 + Math.random() * 0.7), height * (0.12 + Math.random() * 0.28), pick());
    }

    var startT = performance.now(), frame = 0, nextLaunch = 0, raf = 0;
    ctx.lineCap = 'round';

    function tick(now) {
      // Fully clear each frame (keeps the page underneath clean); trails are drawn as short streaks.
      ctx.clearRect(0, 0, width, height);
      var launching = now - startT < FIREWORKS_MS;

      if (launching && frame >= nextLaunch) {
        launch();
        if (!small && Math.random() < 0.35) launch();
        nextLaunch = frame + (small ? 30 : 22) + Math.random() * 18;
      }

      for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.985;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y - r.vy * 3);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        if (r.y <= r.targetY || r.vy > -1) { burst(r.x, r.y, r.color); rockets.splice(i, 1); }
      }

      for (var j = sparks.length - 1; j >= 0; j--) {
        var s = sparks[j];
        s.vx *= 0.97;
        s.vy = s.vy * 0.97 + 0.045;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(j, 1); continue; }
        ctx.globalAlpha = s.twinkle ? s.life * (0.4 + Math.random() * 0.6) : s.life;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * 2.5, s.y - s.vy * 2.5);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      frame++;

      if (!launching && rockets.length === 0 && sparks.length === 0) {
        window.removeEventListener('resize', resize);
        canvas.style.opacity = '0';
        setTimeout(function () { canvas.remove(); }, 800);
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
