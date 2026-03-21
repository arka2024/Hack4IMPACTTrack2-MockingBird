// Scroll-based fade-in animations
export function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all fade-in elements
  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }, 100);
}

// Typewriter effect
export function typeWriter(element, text, speed = 40, callback) {
  let i = 0;
  element.textContent = '';
  element.classList.add('cursor-blink');
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      element.classList.remove('cursor-blink');
      if (callback) callback();
    }
  }
  type();
}

// Counter animation
export function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * eased);
    
    element.textContent = prefix + current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}
