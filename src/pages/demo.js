// Demo Page
export function renderDemoPage() {
  return `
    <div class="demo-page">
      <div class="demo-header">
        <h1>See The Shield <span style="color: var(--threat-red);">In Action</span></h1>
        <p>Upload any image. Watch AdversaGuard detect, deceive, and document the attack.</p>
      </div>

      <!-- Honeypot Toggle -->
      <div class="honeypot-toggle">
        <label>Honeypot Mode</label>
        <label class="toggle-switch">
          <input type="checkbox" id="honeypot-toggle" checked />
          <span class="toggle-slider"></span>
        </label>
        <span class="honeypot-status active" id="honeypot-status-label">ACTIVE</span>
      </div>

      <!-- Split Panels -->
      <div class="demo-panels">
        <!-- Upload Panel -->
        <div class="demo-panel">
          <div class="panel-title">
            <span class="indicator"></span>
            Input Upload — Clean or Adversarial
          </div>
          <div class="upload-zone" id="upload-zone">
            <div class="upload-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="8" width="32" height="32" rx="4" stroke="#FF2D2D" stroke-width="2" fill="none" opacity="0.5"/>
                <circle cx="18" cy="20" r="3" stroke="#FF2D2D" stroke-width="1.5" fill="none"/>
                <path d="M8 32l8-8 6 6 8-10 10 12" stroke="#FF2D2D" stroke-width="1.5" fill="none"/>
                <path d="M24 4v10M19 9l5-5 5 5" stroke="#FF2D2D" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <h3>Drop Image Here</h3>
            <p>or click to browse • PNG, JPG, BMP</p>
            <input type="file" id="file-input" accept="image/*" style="display:none;" />
          </div>
          
          <!-- Uploaded preview -->
          <div id="upload-preview" style="display:none; margin-top: 16px;">
            <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; border: 1px solid rgba(255,45,45,0.2);">
              <img id="preview-image" style="width: 100%; height: 200px; object-fit: cover;" />
              <div id="scan-overlay" style="position:absolute; top:0; left:0; right:0; bottom:0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,45,45,0.05) 2px, rgba(255,45,45,0.05) 4px); display:none;">
                <div style="position:absolute; left:0; right:0; height:3px; background:var(--threat-red); box-shadow: 0 0 15px var(--threat-red); animation: scan-sweep 1.5s ease-in-out infinite;"></div>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:8px; font-family:var(--font-mono); font-size:11px; color:var(--text-muted);">
              <span id="file-name">image.png</span>
              <span id="file-status" style="color: var(--warning-amber);">ANALYZING...</span>
            </div>
          </div>
        </div>

        <!-- Analysis Panel -->
        <div class="demo-panel">
          <div class="panel-title">
            <span class="indicator" style="background: var(--safe-green); box-shadow: 0 0 6px var(--safe-green);"></span>
            Real-Time Analysis
          </div>
          
          <div class="threat-gauge-container">
            <!-- Threat Score Gauge -->
            <div class="threat-gauge">
              <svg viewBox="0 0 140 140">
                <circle class="gauge-bg" cx="70" cy="70" r="60" />
                <circle class="gauge-fill" id="threat-gauge-fill" cx="70" cy="70" r="60" />
              </svg>
              <div class="gauge-value">
                <div class="number" id="threat-score">0</div>
                <div class="label">Threat Score</div>
              </div>
            </div>

            <!-- Confidence Bar -->
            <div class="confidence-bar">
              <div class="bar-header">
                <span class="bar-label">Confidence Level</span>
                <span class="bar-value" id="confidence-value">0%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" id="confidence-fill"></div>
              </div>
            </div>

            <!-- Honeypot Badge -->
            <div class="honeypot-badge active" id="honeypot-badge">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L2 3.5v3.5c0 3.57 2.13 6.91 5 7.75 2.87-.84 5-4.18 5-7.75V3.5L7 1z" stroke="currentColor" stroke-width="1.2" fill="rgba(0,255,136,0.1)"/>
              </svg>
              <span id="honeypot-badge-text">HONEYPOT ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Log -->
      <div class="event-log">
        <div class="event-log-header">
          <h3>
            <span class="live-indicator"></span>
            Live Event Log
          </h3>
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);" id="event-count">0 events</span>
        </div>
        <div style="overflow-x: auto;">
          <table class="log-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Input Type</th>
                <th>Attack Detected</th>
                <th>Action Taken</th>
                <th>Attacker Fingerprint</th>
              </tr>
            </thead>
            <tbody id="log-table-body">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
