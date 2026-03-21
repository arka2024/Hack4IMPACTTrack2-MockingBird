/* ═══════════════════════════════════════
   ADVERSAGUARD AI — SHARED UTILITIES v2
   Cinematic HUD Edition
   ═══════════════════════════════════════ */

// ── Mouse-Reactive Particles ──
export function initParticles(container) {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = (50 + Math.random() * 50) + '%';
    p.style.animationDuration = (3 + Math.random() * 3) + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    p.style.width = (2 + Math.random() * 2) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}

// ── Background Layers ──
export function initBackgroundLayers() {
  if (!document.querySelector('.hex-grid-bg')) {
    document.body.insertAdjacentHTML('afterbegin', '<div class="hex-grid-bg"></div><div class="scan-line"></div>');
  }
  if (!document.querySelector('.floating-particles')) {
    const c = document.createElement('div');
    c.className = 'floating-particles';
    initParticles(c);
    document.body.appendChild(c);
  }
}

// ── Scroll Animations ──
export function initScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains('stagger-children')) {
          Array.from(el.children).forEach((ch, i) => {
            ch.style.transitionDelay = (i * 120) + 'ms';
            ch.classList.add('visible');
          });
        }
        el.classList.add('visible');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.animate-up,.animate-left,.animate-right,.animate-scale,.stagger-children').forEach(el => obs.observe(el));
}

// ── Count-up Animation ──
export function countUp(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const isFloat = String(target).includes('.');
  const ease = t => 1 - Math.pow(1 - t, 3);
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const ep = ease(p);
    let val = target * ep;
    if (isFloat) el.textContent = val.toFixed(2) + suffix;
    else el.textContent = Math.floor(val).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Ticker HTML ──
export function getThreatTickerHTML() {
  const threats = [
    '◆ THREAT DETECTED — FGSM Attack Blocked — 11ms',
    '◆ HONEYPOT ACTIVE — Attacker Fingerprinted — ID#4471',
    '◆ ROLLING SHUTTER — Camera-3 — Neutralised — 8ms',
    '◆ CONFIDENCE 98.2% — All 7 Layers Nominal',
    '◆ PGD Attack Blocked — Fake Response Sent — FP#B219',
    '◆ EM INJECTION ATTEMPT — Signal Layer Defended',
    '◆ LENS INTEGRITY ALERT — Adversarial Sticker Found',
    '◆ TEMPORAL INCONSISTENCY — 5-Frame Check Failed',
  ];
  const items = threats.map(t => `<span class="ticker-item"><span class="ticker-dot"></span>${t}</span>`).join('');
  return `<div class="threat-ticker"><div class="ticker-track">${items}${items}</div></div>`;
}

// ── Shield SVG ──
export function getShieldSVG(size = 24) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 36" fill="none"><path d="M16 2L3 8v8c0 9 5.4 17.3 13 19.5C23.6 33.3 29 25 29 16V8L16 2z" stroke="#FF2D2D" stroke-width="1.5" fill="rgba(255,45,45,0.08)"/><path d="M16 8L8 12v4c0 5.2 3.3 10 8 11.5 4.7-1.5 8-6.3 8-11.5v-4L16 8z" fill="rgba(255,45,45,0.15)"/><circle cx="16" cy="17" r="2.5" fill="#FF2D2D"/></svg>`;
}

// ── NAVBAR ──
export function getNavbarHTML(activePage = '') {
  return `<nav class="navbar">
    <a href="index.html" class="nav-logo">
      <div class="logo-shield">${getShieldSVG(24)}</div>
      <span class="logo-text">ADVERSA<span class="red">GUARD</span></span>
      <span class="live-badge"><span class="live-dot"></span>LIVE</span>
    </a>
    <div class="nav-links" id="navLinks">
      <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">System</a>
      <a href="demo.html" class="${activePage === 'demo' ? 'active' : ''}">Live Demo</a>
      <a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a>
      <a href="features.html" class="${activePage === 'features' ? 'active' : ''}">Protocols</a>
      <a href="cases.html" class="${activePage === 'cases' ? 'active' : ''}">Intel</a>
      <a href="evidence.html" class="${activePage === 'pitch' ? 'active' : ''}" style="color:var(--red)">The Pitch</a>
    </div>
    <div class="nav-right">
      <div class="nav-bell" onclick="document.getElementById('notifDropdown').classList.toggle('show')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        <span class="badge">3</span>
        <div class="notif-dropdown" id="notifDropdown">
          <div class="nd-header">RECENT ALERTS</div>
          <div class="nd-list">
            <div class="nd-item"><div class="nd-dot" style="background:var(--red)"></div><div class="nd-info"><strong>ATTACK BLOCKED</strong><span>FGSM Patch · CAM-3 · 12ms</span></div></div>
            <div class="nd-item"><div class="nd-dot" style="background:var(--amber)"></div><div class="nd-info"><strong>HONEYPOT TRIGGERED</strong><span>Physical Patch · NODE-1 · 8ms</span></div></div>
            <div class="nd-item"><div class="nd-dot" style="background:var(--purple)"></div><div class="nd-info"><strong>THREAT REVIEW</strong><span>Pixel Perturb · CAM-5 · 14ms</span></div></div>
            <div class="nd-item"><div class="nd-dot" style="background:var(--red)"></div><div class="nd-info"><strong>ATTACK BLOCKED</strong><span>Hardware EM · SENSOR-2 · 11ms</span></div></div>
            <div class="nd-item"><div class="nd-dot" style="background:var(--amber)"></div><div class="nd-info"><strong>HONEYPOT TRIGGERED</strong><span>Lane Injection · CAM-9 · 9ms</span></div></div>
          </div>
          <div class="nd-footer">VIEW ALL LOGS →</div>
        </div>
      </div>
      <a href="login.html" class="btn btn-secondary btn-sm" style="font-size: 11px; height: 32px;">OPERATOR: DELTA-9</a>
    </div>
    <button class="mobile-menu-btn" aria-label="Menu" onclick="document.getElementById('navLinks').classList.toggle('open')"><span></span><span></span><span></span></button>
  </nav>`;
}

// ── FOOTER ──
export function getFooterHTML() {
  return `<footer class="footer">
    <div class="footer-grid">
      <div class="footer-col">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">${getShieldSVG(28)}<span style="font-family:var(--font-display);font-weight:700;font-size:14px;letter-spacing:2px">ADVERSA<span style="color:var(--red)">GUARD</span></span></div>
        <p>The missing defense layer for AI systems that make decisions about human lives.</p>
        <div class="footer-social" style="margin-top:16px">
          <a href="#"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg></a>
          <a href="#"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          <a href="#"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
        </div>
      </div>
      <div class="footer-col"><h4>Systems</h4><a href="demo.html">Live Demo</a><a href="dashboard.html">Dashboard</a><a href="features.html">7 Protocols</a><a href="cases.html">Intel Reports</a><a href="cases.html#tesla">Tesla Case Study</a></div>
      <div class="footer-col"><h4>Compliance</h4><a href="#">EU AI Act Guide</a><a href="#">Audit Reports</a><a href="#">Incident Templates</a><a href="#">API Docs</a><a href="#">Research Papers</a></div>
      <div class="footer-col"><h4>Command</h4><p style="margin-bottom:12px">Ready to protect your AI?</p><form style="display:flex;gap:6px" onsubmit="event.preventDefault()"><input class="input-field" style="flex:1;padding:8px 10px;font-size:11px" placeholder="operator@domain.com"><button class="btn btn-primary btn-sm" type="submit">DEPLOY</button></form></div>
    </div>
    <div class="footer-bottom"><span>© 2025 ADVERSAGUARD AI · DEFENSE SYSTEMS DIVISION</span><span>HACKATHON 2025 · INDIA · AI SAFETY FIRST</span></div>
  </footer>`;
}

// ── HUD Card Mouse Tilt ──
export function initCardTilt() {
  // Stretch/warp-safe mode: keep cards static.
  document.querySelectorAll('.hud-card,.card').forEach(card => {
    card.style.transform = 'none';
  });
}
