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
  e.preventDefault(); // stop going to projects like it used to
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
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navButtons = document.getElementById('navButtons');

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    navButtons.classList.toggle('show');
  });
}

// Glide the selection box to sit under/over a given nav button.
function positionIndicator(btn, animate = true) {
  if (!btn || !navIndicator || !navButtonsContainer) return;

  const containerRect = navButtonsContainer.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const left = btnRect.left - containerRect.left;
  const width = btnRect.width;

  if (!animate) {
    navIndicator.style.transition = 'none';
  }
  navIndicator.style.transform = `translateX(${left}px) scaleX(${width})`;
  if (!animate) {
    void navIndicator.offsetWidth;
    navIndicator.style.transition = '';
  }
}

// Initial position
const initialActiveBtn = document.querySelector('.nav-btn.active');
positionIndicator(initialActiveBtn, false);

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

  if (page === 'home') {
    document.body.classList.add('home-active');
  } else {
    document.body.classList.remove('home-active');
  }
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;

    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (navButtons) {
      navButtons.classList.remove('show');
    }

    positionIndicator(btn, true);
    switchToPage(page);
  });
});
