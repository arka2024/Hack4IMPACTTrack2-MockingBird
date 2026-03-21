export function initIntroPage() {
  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Matrix rain effect
  const chars = 'ADVERSAGUARD01SHIELD01THREAT01DEFEND01NEURAL01CRYPTO01';
  const fontSize = 12;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 8, 23, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 45, 45, 0.15)';
    ctx.font = `${fontSize}px JetBrains Mono`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }
  drawMatrix();

  // Loading bar animation
  const fill = document.getElementById('loader-fill');
  const percent = document.getElementById('loader-percent');
  const status = document.getElementById('loader-status');
  
  const statuses = [
    { at: 10, text: 'LOADING THREAT DATABASE' },
    { at: 25, text: 'ESTABLISHING SECURE CHANNEL' },
    { at: 40, text: 'ACTIVATING NEURAL DEFENSE' },
    { at: 55, text: 'DEPLOYING HONEYPOT LAYER' },
    { at: 70, text: 'CALIBRATING SHIELD PERIMETER' },
    { at: 85, text: 'VERIFYING SYSTEM INTEGRITY' },
    { at: 95, text: 'AUTHENTICATION REQUIRED' },
  ];

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 3 + 0.5;
    if (progress > 100) progress = 100;
    
    if (fill) fill.style.width = progress + '%';
    if (percent) percent.textContent = Math.floor(progress) + '%';
    
    const currentStatus = statuses.filter(s => s.at <= progress).pop();
    if (currentStatus && status) status.textContent = currentStatus.text;

    if (progress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        // Fade out intro
        const overlay = document.getElementById('intro-overlay');
        if (overlay) {
          overlay.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          overlay.style.opacity = '0';
          overlay.style.transform = 'scale(1.05)';
          setTimeout(() => {
            window.location.hash = 'login';
          }, 800);
        }
      }, 600);
    }
  }, 60);
}
