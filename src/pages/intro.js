// Intro / Boot Sequence Page
export function renderIntroPage() {
  return `
    <div class="intro-overlay" id="intro-overlay">
      <canvas id="intro-canvas"></canvas>
      
      <div class="intro-content" id="intro-content">
        <!-- Boot sequence lines -->
        <div class="boot-sequence" id="boot-sequence">
          <div class="boot-line" style="animation-delay: 0.2s;">
            <span class="boot-prefix">[SYS]</span> Initializing AdversaGuard Defense Matrix...
          </div>
          <div class="boot-line" style="animation-delay: 0.6s;">
            <span class="boot-prefix">[NET]</span> Establishing encrypted tunnel... <span class="boot-ok">OK</span>
          </div>
          <div class="boot-line" style="animation-delay: 1.0s;">
            <span class="boot-prefix">[SEC]</span> Loading threat signature database... <span class="boot-ok">247,891 signatures</span>
          </div>
          <div class="boot-line" style="animation-delay: 1.4s;">
            <span class="boot-prefix">[AI&nbsp;]</span> Neural defense model v4.2 loaded... <span class="boot-ok">READY</span>
          </div>
          <div class="boot-line" style="animation-delay: 1.8s;">
            <span class="boot-prefix">[HPT]</span> Honeypot decoy layer activated... <span class="boot-ok">ACTIVE</span>
          </div>
          <div class="boot-line" style="animation-delay: 2.2s;">
            <span class="boot-prefix">[SHD]</span> Shield perimeter established... <span class="boot-ok">ONLINE</span>
          </div>
        </div>

        <!-- Main logo reveal -->
        <div class="intro-logo" id="intro-logo">
          <div class="intro-shield-icon">
            <svg viewBox="0 0 80 90" fill="none">
              <path d="M40 4L6 20v20c0 22 14.5 42.5 34 48 19.5-5.5 34-26 34-48V20L40 4z" 
                    stroke="#FF2D2D" stroke-width="2" fill="rgba(255,45,45,0.05)"/>
              <path d="M40 16L16 28v12c0 15.2 10.2 29.4 24 33.2 13.8-3.8 24-18 24-33.2V28L40 16z" 
                    fill="rgba(255,45,45,0.1)" stroke="#FF2D2D" stroke-width="1" opacity="0.8"/>
              <circle cx="40" cy="38" r="6" fill="#FF2D2D" opacity="0.9"/>
              <circle cx="40" cy="38" r="10" stroke="#FF2D2D" stroke-width="0.8" fill="none" opacity="0.5"/>
              <circle cx="40" cy="38" r="15" stroke="#FF2D2D" stroke-width="0.5" fill="none" opacity="0.25"/>
              <line x1="40" y1="24" x2="40" y2="52" stroke="#FF2D2D" stroke-width="1" opacity="0.3"/>
              <line x1="28" y1="38" x2="52" y2="38" stroke="#FF2D2D" stroke-width="1" opacity="0.3"/>
            </svg>
          </div>
          <div class="intro-title">
            <span class="intro-title-adversa">ADVERSA</span><span class="intro-title-guard">GUARD</span>
          </div>
          <div class="intro-tagline">ADVERSARIAL DEFENSE INTELLIGENCE</div>
          <div class="intro-version">v4.2.0 — DEFENSE MATRIX ONLINE</div>
        </div>

        <!-- Loading bar -->
        <div class="intro-loader" id="intro-loader">
          <div class="loader-track">
            <div class="loader-fill" id="loader-fill"></div>
          </div>
          <div class="loader-text">
            <span id="loader-percent">0%</span>
            <span class="loader-status" id="loader-status">INITIALIZING SYSTEMS</span>
          </div>
        </div>
      </div>

      <!-- Corner brackets -->
      <div class="corner-bracket top-left"></div>
      <div class="corner-bracket top-right"></div>
      <div class="corner-bracket bottom-left"></div>
      <div class="corner-bracket bottom-right"></div>
    </div>
  `;
}
