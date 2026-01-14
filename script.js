// Day name goes into top right pill
const dayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
document.getElementById('dayName').textContent = dayName;

// Project 'store' logic
const projectsLink = document.querySelector('.links a[href="projects.html"]');
const modal = document.getElementById('projectsModal');
const closeBtn = document.getElementById('closeProjects');

projectsLink.addEventListener('click', function (e) {
  e.preventDefault(); // stop going to projects.html like it used to
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', function () {
  modal.style.display = 'none';
});

modal.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// QR code modal logic
const profileImg = document.querySelector('.small-img');
const qrModal = document.getElementById('qrModal');
const closeQR = document.getElementById('closeQR');

profileImg.addEventListener('click', function () {
  qrModal.style.display = 'flex';
});

closeQR.addEventListener('click', function () {
  qrModal.style.display = 'none';
});

qrModal.addEventListener('click', function (e) {
  if (e.target === qrModal) {
    qrModal.style.display = 'none';
  }
});

// Liquid GL Integration
// Use 'load' instead of 'DOMContentLoaded' to ensure background images are ready for snapshot
window.addEventListener("load", () => {

  const commonSettings = {
    resolution: Math.max(2, window.devicePixelRatio || 2),
    refraction: 0.20,
    bevelDepth: 0.020,
    bevelWidth: 0.020,
    frost: 0.65,
    shadow: true,
    specular: true,
    tilt: false,
    reveal: "simple",
  };

  // Apply to card directly
  liquidGL(Object.assign({ target: ".card" }, commonSettings));

  // Apply to modal content directly
  liquidGL(Object.assign({ target: ".modal-content" }, commonSettings));
});

// Force refresh when modals align or window resizes
function triggerRefresh() {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 50);
}

// Logic to hide profile elements behind modals
const elementsToHide = document.querySelectorAll('.profile-img, .about-name, .about-text');

function hideProfile() {
  elementsToHide.forEach(el => el.style.opacity = '0');
}

function showProfile() {
  elementsToHide.forEach(el => el.style.opacity = '1');
}

projectsLink.addEventListener('click', (e) => {
  triggerRefresh();
  hideProfile();
});

profileImg.addEventListener('click', (e) => {
  triggerRefresh();
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

// Liquid Glass Warning Animation
window.addEventListener("load", () => {
  const warningModal = document.getElementById("liquidWarningModal");

  // Set initial position: centered horizontally but off-screen to the left
  gsap.set(warningModal, {
    left: "50%",
    xPercent: -50,
    x: -window.innerWidth // start off-screen left relative to center
  });

  const tl = gsap.timeline({ delay: 0.5 });

  tl.to(warningModal, {
    x: 0, // Move to center
    duration: 1.2,
    ease: "power3.out"
  })
    .to(warningModal, {
      x: window.innerWidth, // Slide out to the right
      duration: 1.2,
      ease: "power3.in",
      delay: 3 // Stay for 3 seconds
    });
});
