// Home Page - HUD-style with SVG icons, no emojis
export function renderHomePage() {
  return `
    <section class="hero">
      <!-- Threat level badge -->
      <div class="threat-level-badge fade-in">
        <div class="threat-dot-pulse"></div>
        THREAT LEVEL: CRITICAL
      </div>

      <div class="hero-shield">
        <svg viewBox="0 0 100 110" fill="none">
          <path d="M50 5L10 22v22c0 22 16.7 42.5 40 48 23.3-5.5 40-26 40-48V22L50 5z" 
                stroke="#FF2D2D" stroke-width="2" fill="rgba(255,45,45,0.05)"/>
          <path d="M50 18L22 30v14c0 15.2 11.2 29.4 28 33.2 16.8-3.8 28-18 28-33.2V30L50 18z" 
                fill="rgba(255,45,45,0.12)" stroke="#FF2D2D" stroke-width="1"/>
          <circle cx="50" cy="44" r="7" fill="#FF2D2D" opacity="0.85"/>
          <circle cx="50" cy="44" r="12" stroke="#FF2D2D" stroke-width="0.8" fill="none" opacity="0.4">
            <animateTransform attributeName="transform" type="rotate" values="0 50 44;360 50 44" dur="10s" repeatCount="indefinite"/>
          </circle>
          <circle cx="50" cy="44" r="18" stroke="#FF2D2D" stroke-width="0.5" fill="none" opacity="0.2">
            <animateTransform attributeName="transform" type="rotate" values="360 50 44;0 50 44" dur="15s" repeatCount="indefinite"/>
          </circle>
          <line x1="50" y1="28" x2="50" y2="60" stroke="#FF2D2D" stroke-width="1" opacity="0.25"/>
          <line x1="34" y1="44" x2="66" y2="44" stroke="#FF2D2D" stroke-width="1" opacity="0.25"/>
          <!-- Tick marks on outer ring -->
          <line x1="50" y1="22" x2="50" y2="26" stroke="#FF2D2D" stroke-width="0.8" opacity="0.3"/>
          <line x1="50" y1="62" x2="50" y2="66" stroke="#FF2D2D" stroke-width="0.8" opacity="0.3"/>
          <line x1="28" y1="44" x2="32" y2="44" stroke="#FF2D2D" stroke-width="0.8" opacity="0.3"/>
          <line x1="68" y1="44" x2="72" y2="44" stroke="#FF2D2D" stroke-width="0.8" opacity="0.3"/>
        </svg>
        <div class="shield-pulse"></div>
        <div class="shield-pulse"></div>
        <div class="shield-pulse"></div>
      </div>

      <h1 class="hero-headline glitch" data-text="CYBERNETIC FRONTIER DEFENSE">
        <span class="hero-line-1">CYBERNETIC</span>
        <span class="hero-line-2">FRONTIER <span class="highlight">DEFENSE</span></span>
      </h1>
      
      <p class="hero-sub">
        Proprietary neural risk reduction systems online. Adversarial payloads 
        intercepted. Encrypted threat response protocols across all security layers.
      </p>

      <div class="hero-buttons">
        <a href="#demo" class="btn btn-primary" id="cta-demo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M6 4.5L11 8L6 11.5V4.5Z" fill="currentColor"/>
          </svg>
          ENGAGE DEMO
        </a>
        <a href="#" class="btn btn-ghost" id="cta-docs">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="2" width="10" height="12" rx="1"/>
            <line x1="5.5" y1="5" x2="10.5" y2="5"/>
            <line x1="5.5" y1="7.5" x2="10.5" y2="7.5"/>
            <line x1="5.5" y1="10" x2="8" y2="10"/>
          </svg>
          VIEW LOGS
        </a>
      </div>

      <!-- Live stats bar -->
      <div class="hero-stats-bar fade-in">
        <div class="stat-item" id="stat-attacks">
          <div class="stat-value red" id="stat-attacks-val">0</div>
          <div class="stat-label">ATTACKS BLOCKED</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" id="stat-uptime">
          <div class="stat-value green" id="stat-uptime-val">0%</div>
          <div class="stat-label">UPTIME</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" id="stat-response">
          <div class="stat-value amber" id="stat-response-val">0ms</div>
          <div class="stat-label">AVG RESPONSE</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" id="stat-confidence">
          <div class="stat-value blue" id="stat-confidence-val">0%</div>
          <div class="stat-label">CONFIDENCE</div>
        </div>
      </div>
    </section>

    <div class="scanline-divider"></div>

    <!-- Status Cards (like reference) -->
    <section class="defense-section">
      <div class="status-cards-row fade-in">
        <div class="status-card green-border">
          <div class="status-card-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="#00FF88" stroke-width="1.5" fill="rgba(0,255,136,0.05)"/>
              <path d="M10 16l4 4 8-8" stroke="#00FF88" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="status-card-info">
            <div class="status-card-title">System Health</div>
            <div class="status-card-value green">OPTIMAL</div>
          </div>
          <div class="status-card-badge">LIVE</div>
        </div>

        <div class="status-card green-border">
          <div class="status-card-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="4" y="8" width="24" height="16" rx="2" stroke="#00FF88" stroke-width="1.5" fill="rgba(0,255,136,0.05)"/>
              <path d="M4 14h24" stroke="#00FF88" stroke-width="1"/>
              <circle cx="16" cy="20" r="2" stroke="#00FF88" stroke-width="1" fill="none"/>
              <path d="M8 8V6a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#00FF88" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="status-card-info">
            <div class="status-card-title">Firewall</div>
            <div class="status-card-value green">ACTIVE</div>
          </div>
          <div class="status-card-badge">LIVE</div>
        </div>

        <div class="status-card amber-border">
          <div class="status-card-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 4L4 28h24L16 4z" stroke="#FFB800" stroke-width="1.5" fill="rgba(255,184,0,0.05)"/>
              <circle cx="16" cy="12" r="5" stroke="#FFB800" stroke-width="1" fill="none"/>
              <path d="M13 18h6l-1 6h-4l-1-6z" fill="rgba(255,184,0,0.2)" stroke="#FFB800" stroke-width="0.8"/>
            </svg>
          </div>
          <div class="status-card-info">
            <div class="status-card-title">AI Model</div>
            <div class="status-card-value amber">NEURAL V4.2</div>
          </div>
          <div class="status-card-badge amber">ACTIVE</div>
        </div>
      </div>
    </section>

    <!-- 3D Shield Section -->
    <section class="defense-section">
      <div class="shield-3d-container fade-in" id="shield-3d-mount">
        <canvas id="shield-3d-canvas" width="300" height="300"></canvas>
      </div>
    </section>

    <div class="scanline-divider"></div>

    <!-- Defense Layers -->
    <section class="defense-section">
      <h2 class="section-title fade-in">DEFENSE ARCHITECTURE</h2>
      <p class="section-subtitle fade-in">Five autonomous layers. Zero single points of failure.</p>
      
      <div class="defense-grid">
        <div class="defense-card fade-in fade-in-delay-1" id="defense-input">
          <div class="card-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="13" stroke="#FF2D2D" stroke-width="1.5" fill="rgba(255,45,45,0.05)"/>
              <circle cx="16" cy="16" r="4" fill="#FF2D2D" opacity="0.6"/>
              <line x1="16" y1="3" x2="16" y2="10" stroke="#FF2D2D" stroke-width="1" opacity="0.5"/>
              <line x1="16" y1="22" x2="16" y2="29" stroke="#FF2D2D" stroke-width="1" opacity="0.5"/>
              <line x1="3" y1="16" x2="10" y2="16" stroke="#FF2D2D" stroke-width="1" opacity="0.5"/>
              <line x1="22" y1="16" x2="29" y2="16" stroke="#FF2D2D" stroke-width="1" opacity="0.5"/>
            </svg>
          </div>
          <h3>Input Sanitization</h3>
          <p>Deep-inspects every input for known adversarial perturbation patterns. FGSM, PGD, and CW attacks detected at the gate.</p>
        </div>
        
        <div class="defense-card fade-in fade-in-delay-2" id="defense-honeypot">
          <div class="card-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M8 10C8 6 11.5 3 16 3s8 3 8 7v2" stroke="#FF2D2D" stroke-width="1.5" fill="none"/>
              <rect x="6" y="12" width="20" height="16" rx="3" stroke="#FF2D2D" stroke-width="1.5" fill="rgba(255,45,45,0.05)"/>
              <circle cx="16" cy="20" r="3" stroke="#FF2D2D" stroke-width="1.5" fill="rgba(255,45,45,0.3)"/>
              <line x1="16" y1="23" x2="16" y2="26" stroke="#FF2D2D" stroke-width="1.5"/>
            </svg>
          </div>
          <h3>Honeypot Layer</h3>
          <p>Deploys decoy model outputs to fool attackers. Every interaction is logged and the adversary is fingerprinted.</p>
        </div>
        
        <div class="defense-card safe fade-in fade-in-delay-3" id="defense-validate">
          <div class="card-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 3L4 9v8c0 8 5.3 15.5 12 17.5C22.7 32.5 28 25 28 17V9L16 3z" 
                    stroke="#00FF88" stroke-width="1.5" fill="rgba(0,255,136,0.05)"/>
              <path d="M10 16l4 4 8-8" stroke="#00FF88" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <h3>Output Validation</h3>
          <p>Cross-validates model predictions against clean baselines. Anomalous confidence patterns trigger automatic quarantine.</p>
        </div>
        
        <div class="defense-card fade-in fade-in-delay-4" id="defense-fingerprint">
          <div class="card-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 4c-6.6 0-12 5.4-12 12" stroke="#FF2D2D" stroke-width="1.5" fill="none"/>
              <path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#FF2D2D" stroke-width="1.5" fill="none"/>
              <path d="M13 16c0-1.7 1.3-3 3-3s3 1.3 3 3v6" stroke="#FF2D2D" stroke-width="1.5" fill="none"/>
              <circle cx="16" cy="16" r="1.5" fill="#FF2D2D"/>
              <path d="M16 6c-5.5 0-10 4.5-10 10v6c0 2 1 4 2.5 5.5" stroke="#FF2D2D" stroke-width="1" fill="none" opacity="0.5"/>
              <path d="M22 22v-6c0-1.7-1.3-3-3-3" stroke="#FF2D2D" stroke-width="1" fill="none" opacity="0.5"/>
            </svg>
          </div>
          <h3>Attacker Fingerprinting</h3>
          <p>Builds behavioral profiles of adversarial actors. Identifies repeat attackers using perturbation signatures.</p>
        </div>
        
        <div class="defense-card safe fade-in fade-in-delay-5" id="defense-recovery">
          <div class="card-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M4 16a12 12 0 0121.2-7.7" stroke="#00FF88" stroke-width="1.5" fill="none"/>
              <path d="M28 16a12 12 0 01-21.2 7.7" stroke="#00FF88" stroke-width="1.5" fill="none"/>
              <path d="M25 5v5h-5" stroke="#00FF88" stroke-width="1.5" fill="none"/>
              <path d="M7 27v-5h5" stroke="#00FF88" stroke-width="1.5" fill="none"/>
              <circle cx="16" cy="16" r="3" stroke="#00FF88" stroke-width="1" fill="rgba(0,255,136,0.15)"/>
            </svg>
          </div>
          <h3>Model Recovery</h3>
          <p>Auto-reverts to last-known-good model state if integrity is compromised. Zero downtime with full audit trail.</p>
        </div>
      </div>
    </section>

    <!-- Anomaly Alert Section (like reference bottom panel) -->
    <section class="defense-section">
      <div class="anomaly-panel fade-in">
        <div class="anomaly-header">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L2 18h16L10 2z" stroke="#FF2D2D" stroke-width="1.5" fill="rgba(255,45,45,0.1)"/>
            <line x1="10" y1="8" x2="10" y2="12" stroke="#FF2D2D" stroke-width="1.5"/>
            <circle cx="10" cy="15" r="1" fill="#FF2D2D"/>
          </svg>
          <span class="anomaly-title">ANOMALY DETECTED IN SECTOR 7G</span>
          <span class="anomaly-time">14:32:07.142 — Confidence: 97.3%</span>
        </div>
        <div class="anomaly-body">
          <div class="anomaly-code-block">
            <div class="code-label">LABEL: ADVERSARIAL (FGSM DERIVATIVE: VARIANT #7)</div>
            <div class="code-line"><span class="code-key">LABEL_SCATTER_LIN:</span> 0x82e1.d3f0.c90e.441b.b2f2</div>
          </div>
          <div class="anomaly-stats">
            <div class="anomaly-stat">
              <div class="anomaly-stat-value">0.031<span class="anomaly-stat-unit">epsilon</span></div>
              <div class="anomaly-stat-label">Perturbation Magnitude</div>
            </div>
            <div class="anomaly-stat">
              <div class="anomaly-stat-value">14,204<span class="anomaly-stat-unit">px</span></div>
              <div class="anomaly-stat-label">Affected Region</div>
            </div>
          </div>
          <button class="btn btn-primary" style="width: 100%; margin-top: 16px; text-transform: uppercase; letter-spacing: 2px; font-size: 13px;">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2"/>
              <line x1="7" y1="4" x2="7" y2="8" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="7" cy="10" r="0.8" fill="currentColor"/>
            </svg>
            Execute Countermeasure Protocol
          </button>
        </div>
        <div class="anomaly-footer">
          <button class="anomaly-tab active">ACTIVE FLAGS</button>
          <button class="anomaly-tab">STATUS</button>
        </div>
      </div>
    </section>

    <!-- Trust Section -->
    <section class="defense-section" style="padding-bottom: 100px;">
      <h2 class="section-title fade-in">TRUSTED BY SAFETY-CRITICAL AI</h2>
      <p class="section-subtitle fade-in">From autonomous vehicles to medical imaging — we protect the AI that matters most.</p>
      
      <div class="trust-logos fade-in">
        <div class="trust-logo">MEDISCAN</div>
        <div class="trust-logo">AUTODRIVE</div>
        <div class="trust-logo">SECUREML</div>
        <div class="trust-logo">AIGUARD</div>
        <div class="trust-logo">NEURALOPS</div>
      </div>
    </section>
  `;
}
