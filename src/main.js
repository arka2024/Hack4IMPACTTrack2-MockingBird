import './style.css';
import { ParticleSystem } from './particles.js';
import { HexGrid } from './hexgrid.js';
import { renderIntroPage } from './pages/intro.js';
import { renderHomePage } from './pages/home.js';
import { renderLoginPage } from './pages/login.js';
import { renderDemoPage } from './pages/demo.js';
import { renderDashboardPage } from './pages/dashboard.js';
import { initScrollAnimations } from './animations.js';

// Router
class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    window.addEventListener('hashchange', () => this.navigate());
    window.addEventListener('load', () => this.navigate());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate() {
    const hash = window.location.hash.slice(1) || 'intro';
    const handler = this.routes[hash];
    if (handler) {
      this.currentPage = hash;
      handler();
      this.updateNavLinks();
      initScrollAnimations();
    }
  }

  updateNavLinks() {
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href').slice(1);
      if (href === this.currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Initialize app
const app = document.getElementById('app');
const router = new Router();

// Shared Layout (with ticker + navbar)
function renderLayout(pageContent, showTicker = true) {
  app.innerHTML = `
    ${showTicker ? renderTicker() : ''}
    ${renderNavbar()}
    <canvas id="particle-canvas"></canvas>
    <div class="hex-grid-bg" id="hex-grid"></div>
    <main class="page-transition-enter">
      ${pageContent}
    </main>
    ${renderFooter()}
  `;

  // Init particles
  const canvas = document.getElementById('particle-canvas');
  if (canvas) new ParticleSystem(canvas);

  // Init hex grid
  const hexGridEl = document.getElementById('hex-grid');
  if (hexGridEl) new HexGrid(hexGridEl);

  // Nav scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

// Minimal layout for login (no ticker, just particles)
function renderMinimalLayout(pageContent) {
  app.innerHTML = `
    <canvas id="particle-canvas" style="opacity: 0.3;"></canvas>
    <div class="hex-grid-bg" id="hex-grid"></div>
    <main class="page-transition-enter">
      ${pageContent}
    </main>
  `;

  const canvas = document.getElementById('particle-canvas');
  if (canvas) new ParticleSystem(canvas);

  const hexGridEl = document.getElementById('hex-grid');
  if (hexGridEl) new HexGrid(hexGridEl);
}

function renderTicker() {
  const threats = [
    { text: 'THREAT DETECTED — FGSM Attack Blocked — 14ms response — Attacker Fingerprinted', isAttack: true },
    { text: 'Honeypot Triggered — PGD Variant Captured — Layer 3 Active', isAttack: false },
    { text: 'Model Integrity Verified — Confidence: 99.7% — All Layers Nominal', isAttack: false },
    { text: 'Adversarial Patch Detected — Input Sanitized — 8ms response', isAttack: true },
    { text: 'Unknown Attack Vector — Quarantined — Analysis In Progress', isAttack: true },
    { text: 'System Shield Active — 247 attacks blocked today — 0 breaches', isAttack: false },
    { text: 'FGSM L-inf Perturbation Detected — eps=0.031 — Neutralized', isAttack: true },
    { text: 'Attacker Fingerprint: 0xA7F...3B2 — Added to Blocklist', isAttack: true },
  ];

  const tickerItems = threats.map(t => {
    return `<span class="ticker-item"><span class="dot ${t.isAttack ? '' : 'green'}"></span>${t.text}</span>`;
  }).join('');

  return `
    <div class="threat-ticker">
      <div class="ticker-track">${tickerItems}${tickerItems}</div>
    </div>
  `;
}

function renderNavbar() {
  return `
    <nav class="navbar">
      <a href="#home" class="nav-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 32 36" fill="none">
            <path d="M16 2L3 8v8c0 9 5.4 17.3 13 19.5C23.6 33.3 29 25 29 16V8L16 2z" 
                  stroke="#FF2D2D" stroke-width="1.5" fill="rgba(255,45,45,0.08)"/>
            <path d="M16 8L8 12v4c0 5.2 3.3 10 8 11.5 4.7-1.5 8-6.3 8-11.5v-4L16 8z" 
                  fill="rgba(255,45,45,0.15)"/>
            <circle cx="16" cy="17" r="2.5" fill="#FF2D2D"/>
          </svg>
        </div>
        <span class="logo-text">ADVERSA<span class="red">GUARD</span></span>
      </a>
      <ul class="nav-links">
        <li><a href="#home">SYSTEM</a></li>
        <li><a href="#demo">LIVE DEMO</a></li>
        <li><a href="#dashboard">DASHBOARD</a></li>
        <li><a href="#login">ACCESS</a></li>
      </ul>
      <div class="nav-status">
        <span class="status-dot"></span>
        SHIELD ACTIVE
      </div>
      <button class="mobile-menu-btn" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
  `;
}

function renderFooter() {
  return `
    <footer class="footer">
      <p>&copy; 2026 AdversaGuard AI — Adversarial Defense Intelligence Platform</p>
      <div class="footer-links">
        <a href="#">Documentation</a>
        <a href="#">API Reference</a>
        <a href="#">GitHub</a>
        <a href="#">Contact</a>
      </div>
    </footer>
  `;
}

// ROUTES
router.addRoute('intro', () => {
  app.innerHTML = renderIntroPage();
  import('./pages/intro-init.js').then(m => m.initIntroPage());
});

router.addRoute('login', () => {
  renderMinimalLayout(renderLoginPage());
  import('./pages/login-init.js').then(m => m.initLoginPage());
});

router.addRoute('home', () => {
  renderLayout(renderHomePage());
  import('./pages/home-init.js').then(m => m.initHomePage());
});

router.addRoute('demo', () => {
  renderLayout(renderDemoPage());
  import('./pages/demo-init.js').then(m => m.initDemoPage());
});

router.addRoute('dashboard', () => {
  renderLayout(renderDashboardPage());
  import('./pages/dashboard-init.js').then(m => m.initDashboardPage());
});
