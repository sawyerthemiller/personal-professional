// Register service worker for image caching

/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <explanation> */
/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: <explanation> */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => { });
}

// Day name goes into top right pill
const dayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
document.getElementById('dayName').textContent = dayName;

// Project 'store' logic
const projectsLink = document.querySelector('.links a[href="projects.html"]');
const modal = document.getElementById('projectsModal');
const closeBtn = document.getElementById('closeProjects');

projectsLink.addEventListener('click', (e) => {
  e.preventDefault(); // stop going to projects.html like it used to
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// QR code modal logic
const profileImg = document.querySelector('.small-img');
const qrModal = document.getElementById('qrModal');
const closeQR = document.getElementById('closeQR');

profileImg.addEventListener('click', () => {
  qrModal.style.display = 'flex';
});

closeQR.addEventListener('click', () => {
  qrModal.style.display = 'none';
});

qrModal.addEventListener('click', (e) => {
  if (e.target === qrModal) {
    qrModal.style.display = 'none';
  }
});



// Logic to hide profile elements behind modals
const elementsToHide = document.querySelectorAll('.profile-img, .about-name, .about-text');

function hideProfile() {
  elementsToHide.forEach(el => el.style.opacity = '0');
}

function showProfile() {
  elementsToHide.forEach(el => el.style.opacity = '1');
}

projectsLink.addEventListener('click', (e) => {
  hideProfile();
});

profileImg.addEventListener('click', (e) => {
  hideProfile();
});

// Hook into close buttons to restore profile
closeBtn.addEventListener('click', showProfile);
modal.addEventListener('click', (e) => {
  if (e.target === modal) showProfile();
});

closeQR.addEventListener('click', showProfile);
qrModal.addEventListener('click', (e) => {
  if (e.target === qrModal) showProfile();
});

// Page Navigation
const navBtns = document.querySelectorAll('.nav-btn');
const navButtonsContainer = document.querySelector('.nav-buttons');
const navIndicator = document.getElementById('navIndicator');
const homePage = document.querySelector('main');
const portfolioPage = document.getElementById('portfolioPage');

// Glide the light bar to sit under a given nav button.
// Pass animate=false for initial layout / resize so it snaps without a transition.
function positionIndicator(btn, animate = true) {
  if (!btn || !navIndicator || !navButtonsContainer) return;

  const containerRect = navButtonsContainer.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const width = btnRect.width * 0.6;
  const left = btnRect.left - containerRect.left + (btnRect.width - width) / 2;

  if (!animate) {
    navIndicator.style.transition = 'none';
  }
  navIndicator.style.width = `${width}px`;
  navIndicator.style.left = `${left}px`;
  if (!animate) {
    // Force a reflow so the values commit before we restore the transition
    void navIndicator.offsetWidth;
    navIndicator.style.transition = '';
  }
}

// Initial position (snap, don't animate from 0)
const initialActiveBtn = document.querySelector('.nav-btn.active');
positionIndicator(initialActiveBtn, false);

// Re-measure once fonts load so button widths are final
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    const active = document.querySelector('.nav-btn.active');
    positionIndicator(active, false);
  });
}

window.addEventListener('resize', () => {
  const active = document.querySelector('.nav-btn.active');
  positionIndicator(active, false);
});

const pages = { home: homePage, portfolio: portfolioPage };
let currentPage = 'home';

function switchToPage(page) {
  if (!pages[page] || page === currentPage) return;
  const from = pages[currentPage];
  const to = pages[page];

  from.classList.add('page-hidden');
  to.classList.remove('page-hidden');

  currentPage = page;
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;

    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    positionIndicator(btn, true);
    switchToPage(page);
  });
});

// 3D Tilt Effect for cards (home card + post cards, NOT modals)
// Also rotates the glass-edge rim (--rim-angle) so the bright corner of the
// refraction gradient tracks the cursor, giving the illusion of the rim
// "catching light" as the card tilts.
document.querySelectorAll('.post-card, .card').forEach(card => {
  const MAX_TILT = 6; // degrees
  const LEAVE_TRANSITION =
    'transform 0.4s ease-out, box-shadow 0.3s ease, --rim-angle 0.4s ease-out, opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  const REST_TRANSITION =
    'transform 0.15s ease-out, box-shadow 0.3s ease, --rim-angle 0.15s ease-out, opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const rotateY = x * MAX_TILT;
    const rotateX = -y * MAX_TILT;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;

    // Gradient angle such that the 0% stop lands on the corner closest to
    // the cursor: atan2(x, -y) gives the cursor's direction from center in
    // CSS-gradient convention (CW from north); +180° flips to the opposite
    // side so the gradient *points away from* the bright corner.
    const rimAngle = (Math.atan2(x, -y) * 180) / Math.PI + 180;
    card.style.setProperty('--rim-angle', `${rimAngle}deg`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = LEAVE_TRANSITION;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.setProperty('--rim-angle', '135deg');
    setTimeout(() => {
      card.style.transition = REST_TRANSITION;
    }, 400);
  });
});

// Reduced Mode Toggle (accessibility)
const reducedToggle = document.getElementById('reducedMode');

// Restore saved preference
if (localStorage.getItem('reducedMode') === 'true') {
  document.body.classList.add('reduced-mode');
  reducedToggle.checked = true;
}

reducedToggle.addEventListener('change', () => {
  document.body.classList.toggle('reduced-mode', reducedToggle.checked);
  localStorage.setItem('reducedMode', reducedToggle.checked);
});

// ─── Rain Effect ───
// Falls from just below the header. Mouse movement supplies a smoothed
// horizontal "wind" that tilts the drops; when the mouse is idle, wind
// decays back to 0 and rain settles straight down. Hidden + paused in
// reduced mode and when prefers-reduced-motion is set.

const rainCanvas = document.getElementById('rainCanvas');
const rainCtx = rainCanvas ? rainCanvas.getContext('2d') : null;

const RAIN_DROP_COUNT = 130;
const HEADER_HEIGHT = 64;
// Tuned so mouse movement is *noticeable but subtle*.
// - MOUSE_WIND_SCALE: how much raw mouse velocity feeds the wind per event
// - MAX_WIND: max horizontal drop speed in px/frame (caps the tilt)
const MOUSE_WIND_SCALE = 0.3;
const MAX_WIND = 4;

const rainDrops = [];
const rainSplashes = [];
const rainRipples = [];
const MAX_SPLASHES = 600;
const MAX_RIPPLES = 40;
let rainWidth = 0;
let rainHeight = 0;
let rainAnimationId = null;

// Mouse-driven wind: `targetWind` is pushed by mouse velocity and decays
// each frame; `currentWind` eases toward it so the rain's tilt is smooth.
let rainTargetWind = 0;
let rainCurrentWind = 0;
let rainLastMouseX = null;
let rainLastMouseTime = 0;

function resizeRainCanvas() {
  if (!rainCanvas || !rainCtx) return;
  const dpr = window.devicePixelRatio || 1;
  rainWidth = window.innerWidth;
  rainHeight = Math.max(0, window.innerHeight - HEADER_HEIGHT);
  rainCanvas.width = Math.round(rainWidth * dpr);
  rainCanvas.height = Math.round(rainHeight * dpr);
  rainCanvas.style.width = `${rainWidth}px`;
  rainCanvas.style.height = `${rainHeight}px`;
  rainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function seedRainDrops() {
  rainDrops.length = 0;
  for (let i = 0; i < RAIN_DROP_COUNT; i++) {
    rainDrops.push({
      x: Math.random() * rainWidth,
      // spread initial y across the whole canvas so rain is visible immediately
      y: Math.random() * rainHeight,
      length: 10 + Math.random() * 14,
      speed: 4 + Math.random() * 5,
      opacity: 0.18 + Math.random() * 0.32
    });
  }
}

// baseAngle points *inward* from the surface the drop just hit:
//   bottom impact  -> -π/2  (particles fly up)
//   left  impact   ->  0    (particles fly right)
//   right impact   ->  π    (particles fly left)
function spawnSplash(x, y, baseAngle = -Math.PI / 2) {
  if (rainSplashes.length >= MAX_SPLASHES) return;
  const count = 5 + Math.floor(Math.random() * 4); // 5-8 particles
  const spread = Math.PI * 0.75; // ~135° of fan around the base angle

  for (let i = 0; i < count; i++) {
    const angle = baseAngle + (Math.random() - 0.5) * spread;
    // Roughly half are bigger/faster "droplets", the rest are finer "spray".
    const isDroplet = i < count / 2;
    const speed = isDroplet ? 2 + Math.random() * 2.5 : 1 + Math.random() * 1.4;
    const radius = isDroplet ? 1.4 + Math.random() * 1.2 : 0.7 + Math.random() * 0.5;

    rainSplashes.push({
      x,
      y,
      // Splashes inherit a *tiny* bit of the current wind so they feel
      // consistent with the drops that caused them, but not enough to
      // fight the base angle.
      vx: Math.cos(angle) * speed + rainCurrentWind * 0.15,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.025 + Math.random() * 0.02, // slower fade than before
      radius
    });
  }
}

// Quick expanding "ring" on ground impact for extra drama.
function spawnRipple(x, y) {
  if (rainRipples.length >= MAX_RIPPLES) return;
  rainRipples.push({
    x,
    y,
    radius: 1.5,
    maxRadius: 9 + Math.random() * 7,
    life: 1,
    decay: 0.05 + Math.random() * 0.02
  });
}

function drawRainFrame() {
  if (!rainCtx) return;

  rainCtx.clearRect(0, 0, rainWidth, rainHeight);
  rainCtx.strokeStyle = 'rgb(210, 225, 255)';
  rainCtx.fillStyle = 'rgb(210, 225, 255)';
  rainCtx.lineWidth = 1;
  rainCtx.lineCap = 'round';

  // Smoothly follow the target wind, and let it decay back to 0.
  rainCurrentWind += (rainTargetWind - rainCurrentWind) * 0.08;
  rainTargetWind *= 0.95;

  for (let i = 0; i < rainDrops.length; i++) {
    const drop = rainDrops[i];
    drop.y += drop.speed;
    drop.x += rainCurrentWind;

    // Head hit the bottom: splash + ripple and recycle.
    if (drop.y >= rainHeight) {
      spawnSplash(drop.x, rainHeight);
      spawnRipple(drop.x, rainHeight);
      drop.y = -drop.length;
      drop.x = Math.random() * rainWidth;
    }
    // Wind pushed the drop off the left wall: splash back inward (rightward).
    else if (drop.x < 0) {
      spawnSplash(0, drop.y, 0);
      drop.y = -drop.length;
      drop.x = Math.random() * rainWidth;
    }
    // Wind pushed the drop off the right wall: splash back inward (leftward).
    else if (drop.x > rainWidth) {
      spawnSplash(rainWidth, drop.y, Math.PI);
      drop.y = -drop.length;
      drop.x = Math.random() * rainWidth;
    }

    // Tail direction matches the drop's velocity vector, so horizontal
    // wind visibly tilts the streak, not just its path.
    const vx = rainCurrentWind;
    const vy = drop.speed;
    const vMag = Math.sqrt(vx * vx + vy * vy) || 1;
    const k = drop.length / vMag;

    rainCtx.globalAlpha = drop.opacity;
    rainCtx.beginPath();
    rainCtx.moveTo(drop.x, drop.y);
    rainCtx.lineTo(drop.x - vx * k, drop.y - vy * k);
    rainCtx.stroke();
  }

  // Ripple rings: ease outward and fade. Drawn before splash particles so
  // the particles pop in front of the ring.
  rainCtx.lineWidth = 1;
  for (let i = rainRipples.length - 1; i >= 0; i--) {
    const r = rainRipples[i];
    r.radius += (r.maxRadius - r.radius) * 0.15;
    r.life -= r.decay;

    if (r.life <= 0) {
      rainRipples.splice(i, 1);
      continue;
    }

    rainCtx.globalAlpha = r.life * 0.4;
    rainCtx.beginPath();
    // Flat ellipse so it reads like a ring on the ground, not a bubble.
    rainCtx.ellipse(r.x, r.y, r.radius, r.radius * 0.45, 0, 0, Math.PI * 2);
    rainCtx.stroke();
  }

  // Splash particles: update + draw, remove when faded or far off-canvas.
  for (let i = rainSplashes.length - 1; i >= 0; i--) {
    const p = rainSplashes[i];
    p.vy += 0.15; // gravity
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;

    if (
      p.life <= 0 ||
      p.y > rainHeight + 6 ||
      p.x < -6 ||
      p.x > rainWidth + 6
    ) {
      rainSplashes.splice(i, 1);
      continue;
    }

    rainCtx.globalAlpha = p.life * 0.65;
    rainCtx.beginPath();
    rainCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    rainCtx.fill();
  }

  rainCtx.globalAlpha = 1;
  rainAnimationId = requestAnimationFrame(drawRainFrame);
}

function startRain() {
  if (!rainCanvas || !rainCtx || rainAnimationId !== null) return;
  resizeRainCanvas();
  seedRainDrops();
  rainSplashes.length = 0;
  rainRipples.length = 0;
  rainAnimationId = requestAnimationFrame(drawRainFrame);
}

function stopRain() {
  if (rainAnimationId === null) return;
  cancelAnimationFrame(rainAnimationId);
  rainAnimationId = null;
  if (rainCtx) rainCtx.clearRect(0, 0, rainWidth, rainHeight);
  rainTargetWind = 0;
  rainCurrentWind = 0;
  rainSplashes.length = 0;
  rainRipples.length = 0;
}

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateRainState() {
  const reduced = document.body.classList.contains('reduced-mode') || reducedMotionQuery.matches;
  if (reduced) {
    stopRain();
  } else {
    startRain();
  }
}

document.addEventListener('mousemove', (e) => {
  if (rainAnimationId === null) return;
  const now = performance.now();
  if (rainLastMouseX !== null) {
    const dt = now - rainLastMouseTime;
    if (dt > 0 && dt < 100) {
      const dx = e.clientX - rainLastMouseX;
      rainTargetWind += (dx / dt) * MOUSE_WIND_SCALE;
      if (rainTargetWind > MAX_WIND) rainTargetWind = MAX_WIND;
      else if (rainTargetWind < -MAX_WIND) rainTargetWind = -MAX_WIND;
    }
  }
  rainLastMouseX = e.clientX;
  rainLastMouseTime = now;
});

window.addEventListener('resize', () => {
  if (rainAnimationId !== null) {
    resizeRainCanvas();
  }
});

reducedToggle.addEventListener('change', updateRainState);

if (reducedMotionQuery.addEventListener) {
  reducedMotionQuery.addEventListener('change', updateRainState);
} else if (reducedMotionQuery.addListener) {
  reducedMotionQuery.addListener(updateRainState);
}

updateRainState();
