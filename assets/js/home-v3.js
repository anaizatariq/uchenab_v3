/* ==========================================================================
   University of Chenab — Homepage V3 JavaScript
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // --- Header Sticky & Transparency Effect ---
  const header = document.querySelector('.main-header');
  const logoLight = document.querySelector('.logo-light');
  const logoDark = document.querySelector('.logo-dark');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(255,255,255,0.95)';
      header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.05)';
      if (logoLight && logoDark) {
        logoLight.style.display = 'none';
        logoDark.style.display = 'block';
      }
    } else {
      header.style.background = 'rgba(255,255,255,1)';
      header.style.boxShadow = 'none';
    }
  });

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      // Very basic mobile menu toggle for demo
      if (mainNav.style.display === 'flex') {
        mainNav.style.display = 'none';
      } else {
        mainNav.style.display = 'flex';
        mainNav.style.flexDirection = 'column';
        mainNav.style.position = 'absolute';
        mainNav.style.top = '90px';
        mainNav.style.left = '0';
        mainNav.style.width = '100%';
        mainNav.style.background = '#ffffff';
        mainNav.style.padding = '2rem';
        mainNav.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
      }
    });
  }
  
  // --- Hero Slider Dummy Logic ---
  const prevBtn = document.querySelector('.hero-nav-btn.prev');
  const nextBtn = document.querySelector('.hero-nav-btn.next');
  const heroImg = document.querySelector('.hero-bg img');
  
  const images = [
    './assets/img/hero-campus-1.jpg',
    './assets/img/campus/community.jpg',
    './assets/img/campus/auditorium.jpg'
  ];
  let currIdx = 0;

  function switchImage(dir) {
    if (!heroImg) return;
    if (dir === 'next') {
      currIdx = (currIdx + 1) % images.length;
    } else {
      currIdx = (currIdx - 1 + images.length) % images.length;
    }
    // simple fade out / in
    heroImg.style.opacity = 0;
    setTimeout(() => {
      heroImg.src = images[currIdx];
      heroImg.style.opacity = 1;
    }, 300);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => switchImage('next'));
  if (prevBtn) prevBtn.addEventListener('click', () => switchImage('prev'));

});
