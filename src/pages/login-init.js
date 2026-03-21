export function initLoginPage() {
  // Background canvas animation
  const canvas = document.getElementById('login-bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    function drawBg() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Grid
      ctx.strokeStyle = 'rgba(255, 45, 45, 0.02)';
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 45, 45, ${p.opacity})`;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 45, 45, ${(1 - dist / 120) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawBg);
    }
    drawBg();
  }

  // Google Sign In
  const googleBtn = document.getElementById('google-signin-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      // Animate button
      googleBtn.style.transform = 'scale(0.97)';
      googleBtn.querySelector('span').textContent = 'Authenticating...';
      
      setTimeout(() => {
        googleBtn.style.transform = '';
        
        // Check if Google Identity Services loaded
        if (typeof google !== 'undefined' && google.accounts) {
          google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: handleGoogleResponse,
          });
          google.accounts.id.prompt();
        } else {
          // Fallback: simulate success for demo
          simulateGoogleAuth();
        }
      }, 500);
    });
  }

  // Form submit
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('login-submit');
      const btnText = document.getElementById('login-btn-text');

      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';
      btnText.textContent = 'VERIFYING...';

      setTimeout(() => {
        btnText.textContent = 'ACCESS GRANTED';
        btn.style.background = '#00FF88';
        btn.style.color = '#020817';
        btn.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.6), 0 0 60px rgba(0, 255, 136, 0.2)';
        btn.style.opacity = '1';

        setTimeout(() => {
          transitionToHome();
        }, 800);
      }, 1800);
    });
  }

  // Input focus effects
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('label').style.color = '#FF2D2D';
      input.parentElement.querySelector('label svg').style.stroke = '#FF2D2D';
    });
    input.addEventListener('blur', () => {
      input.parentElement.querySelector('label').style.color = '';
      input.parentElement.querySelector('label svg').style.stroke = '';
    });
  });
}

function handleGoogleResponse(response) {
  if (response.credential) {
    // Decode JWT (just for display)
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('Google user:', payload.name, payload.email);
    simulateGoogleAuth(payload.name);
  }
}

function simulateGoogleAuth(name) {
  const btn = document.getElementById('google-signin-btn');
  if (btn) {
    btn.querySelector('span').textContent = 'Verified — ' + (name || 'Operator');
    btn.style.borderColor = 'rgba(0, 255, 136, 0.5)';
    btn.style.background = 'rgba(0, 255, 136, 0.05)';
    btn.style.color = '#00FF88';
    btn.querySelector('.google-icon').style.display = 'none';
  }

  setTimeout(() => {
    transitionToHome();
  }, 1200);
}

function transitionToHome() {
  const loginPage = document.querySelector('.login-page');
  if (loginPage) {
    loginPage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    loginPage.style.opacity = '0';
    loginPage.style.transform = 'scale(1.03)';
  }
  setTimeout(() => {
    window.location.hash = 'home';
  }, 600);
}

// Make handleGoogleResponse available globally
window.handleGoogleResponse = handleGoogleResponse;
