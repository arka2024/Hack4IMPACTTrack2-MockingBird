export function renderDemoPage() {
  return `
    <div class="demo-page">
      <div class="demo-header fade-in">
        <h1>LIVE <span style="color: var(--threat-red);">INTERCEPTION</span></h1>
        <p>Upload a clean or adversarially perturbed image to see AdversaGuard in action.</p>
        
        <!-- Honeypot Toggle positioned at the top of the demo -->
        <div class="honeypot-toggle" style="margin-top: 24px;">
          <label id="honeypot-label" style="color: var(--warning-amber);">HONEYPOT DECOY: ON</label>
          <label class="toggle-switch">
            <input type="checkbox" id="honeypot-switch" checked />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="demo-panels fade-in fade-in-delay-1" style="margin-bottom: var(--space-2xl);">
        
        <!-- LEFT PANEL: UPLOAD & SCAN -->
        <div class="demo-panel" id="upload-panel">
          <div class="panel-title">
            <div class="indicator"></div>
            INPUT VECTOR
          </div>

          <!-- State 1: Upload UI -->
          <div class="upload-zone" id="upload-zone">
            <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <h3 style="color: var(--text-primary);">Drag & Drop Image Payload</h3>
            <p style="margin-bottom: 24px;">PNG, JPG, or Tensor file format</p>
            
            <div class="scanline-divider" style="margin: 16px 0; opacity: 0.2;"></div>
            
            <button id="inject-demo-btn" class="btn btn-primary" style="width: 100%; border: 1px solid var(--threat-red); background: rgba(255,45,45,0.1);">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 8px;">
                <path d="M8 1v14M1 8h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              INJECT "STOP SIGN" ADVERSARIAL PATCH
            </button>
            
            <input type="file" id="file-input" style="display: none;" accept="image/*" />
          </div>

          <!-- State 2 & 3: Scan Progress & Image Preview -->
          <div class="scan-container" id="scan-container" style="display: none;">
            <div class="preview-box">
              <div class="scanner-line" id="scanner-line"></div>
              <img id="preview-img" src="" alt="Payload Preview" />
            </div>

            <div class="scan-status" id="scan-status">
              <div style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); margin-bottom: 12px; font-size: 14px;">
                Running adversarial detection...
              </div>
              
              <!-- Progress Bar -->
              <div class="scan-progress-bar">
                <div class="scan-fill" id="scan-fill"></div>
              </div>

              <!-- Sub-steps -->
              <div class="scan-steps">
                <div class="scan-step" id="step-1">
                  <span class="step-icon">[ ]</span> Input screening...
                </div>
                <div class="scan-step" id="step-2">
                  <span class="step-icon">[ ]</span> Attack pattern matching...
                </div>
                <div class="scan-step" id="step-3">
                  <span class="step-icon">[ ]</span> Risk scoring...
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: ANALYSIS RESULTS -->
        <div class="demo-panel" id="analysis-panel" style="display: flex; flex-direction: column;">
          <div class="panel-title">
            <div class="indicator" style="background: var(--info-blue); box-shadow: 0 0 6px var(--info-blue);"></div>
            ANALYSIS OUTPUT
          </div>
          
          <div id="results-skeleton" class="skeleton-container" style="flex: 1; display: flex; flex-direction: column; justify-content: center; opacity: 0.5;">
             <div style="text-align: center; font-family: var(--font-mono); font-size: 14px; color: var(--text-muted);">AWAITING PAYLOAD...</div>
          </div>
          
          <div id="results-content" style="display: none; flex: 1; flex-direction: column;">
            
            <div class="score-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;">
              <div>
                <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 4px;">THREAT SCORE</div>
                <div id="threat-score" style="font-family: 'Orbitron', sans-serif; font-size: 64px; font-weight: 700; line-height: 1;">0</div>
              </div>
              <div id="decision-badge" class="badge-status blocked" style="font-size: 16px; padding: 8px 16px; align-self: flex-start;">BLOCKED</div>
            </div>
            
            <div class="detail-row" style="margin-bottom: 24px;">
              <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">DETECTED SIGNATURE</div>
              <div id="attack-type-badge" style="font-family: var(--font-mono); color: white; background: rgba(255,45,45,0.15); border: 1px solid rgba(255,45,45,0.3); padding: 6px 12px; display: inline-block; font-size: 13px; font-weight: 600; text-transform: uppercase;">PHYSICAL ADVERSARIAL PATCH</div>
            </div>

            <div class="confidence-bar" style="margin-top: auto;">
              <div class="bar-header">
                <span class="bar-label">DETECTION CONFIDENCE</span>
                <span class="bar-value" id="confidence-val">99.8%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" id="confidence-fill" style="width: 0%;"></div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <!-- HONEYPOT REVEAL PANEL -->
      <div id="honeypot-reveal-wrapper" style="display: none;" class="fade-in">
        <h3 style="font-family: 'Orbitron', sans-serif; text-align: center; margin-bottom: 24px; font-size: 20px; letter-spacing: 2px;">HONEYPOT DECEPTION PROTOCOL</h3>
        
        <div class="reveal-panel">
          <!-- Left Column: ATTACKER VIEW -->
          <div class="reveal-col attacker-view">
            <div class="reveal-header">
              <span class="reveal-title">ATTACKER VIEW</span>
              <span class="reveal-badge fake-badge">SYSTEM FOOLED</span>
            </div>
            <div class="reveal-body">
              <div class="reveal-icon fake-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="reveal-data">
                <div class="data-label">MODEL CLASSIFICATION:</div>
                <div class="data-value" style="color: var(--safe-green);">Speed Limit 65mph</div>
              </div>
              <div class="reveal-data">
                <div class="data-label">VERIFICATION CONFIDENCE:</div>
                <div class="data-value" style="color: var(--safe-green);">99.2%</div>
              </div>
              <p class="reveal-desc">Target AI returns highly confident, synthetically generated successful response. Attacker assumes their physical patch successfully bypassed vision systems.</p>
            </div>
          </div>

          <div class="reveal-divider"></div>

          <!-- Right Column: REALITY (AdversaGuard) -->
          <div class="reveal-col reality-view">
            <div class="reveal-header">
              <span class="reveal-title">REALITY (ADVERSAGUARD)</span>
              <span class="reveal-badge real-badge">THREAT CONTAINED</span>
            </div>
            <div class="reveal-body">
              <div class="reveal-icon real-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="reveal-data">
                <div class="data-label">ACTION TAKEN:</div>
                <div class="data-value" style="color: var(--threat-red);">Decoy Output Served</div>
              </div>
              <div class="reveal-data">
                <div class="data-label">INTERNAL MODEL:</div>
                <div class="data-value" style="color: white;">Completely Untouched (Stop Sign)</div>
              </div>
              <p class="reveal-desc">Attack intercepted at API edge. Attacker IP and payload signature recorded. Autonomous vehicle network alerted to patched asset at location.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `;
}
