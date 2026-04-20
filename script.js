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
const homePage = document.querySelector('main');
const portfolioPage = document.getElementById('portfolioPage');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;

    // Update active button
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (page === 'home') {
      homePage.style.display = 'flex';
      portfolioPage.style.display = 'none';
      document.body.style.overflow = 'hidden';
    } else if (page === 'portfolio') {
      homePage.style.display = 'none';
      portfolioPage.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  });
});

// 3D Tilt Effect for cards (home card + post cards, NOT modals)
document.querySelectorAll('.post-card, .card').forEach(card => {
  const MAX_TILT = 6; // degrees

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const rotateY = x * MAX_TILT;
    const rotateX = -y * MAX_TILT;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.4s ease-out, box-shadow 0.3s ease';
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    setTimeout(() => {
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease';
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
