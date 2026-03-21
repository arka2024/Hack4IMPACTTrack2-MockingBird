export function renderDashboardPage() {
  return `
    <div class="dashboard-page">
      <div class="dashboard-header fade-in">
        <h1 style="display: flex; justify-content: space-between; align-items: center;">
          THREAT INTELLIGENCE CENTER
          <div style="font-family: var(--font-mono); font-size: 14px; font-weight: 500; color: var(--safe-green); display: flex; align-items: center; gap: 8px;">
            <div class="indicator" style="width: 8px; height: 8px; border-radius: 50%; background: var(--safe-green); box-shadow: 0 0 8px var(--safe-green); animation: dot-pulse 1.5s infinite;"></div>
            SYSTEM SECURE
          </div>
        </h1>
        <p>Live monitoring of incoming adversarial activity across all protected application layers.</p>
      </div>

      <!-- Live Dashboard Main Grid -->
      <div class="dashboard-main-grid fade-in fade-in-delay-1">
        
        <!-- ATTACKER FINGERPRINT TRACKER (Left Side) -->
        <div class="tracker-panel">
          <div class="tracker-header">
            <span class="tracker-title">
              <span class="blinking-dot"></span>
              ATTACKER PROFILE
            </span>
          </div>
          
          <div class="tracker-body">
            <div class="tracker-label">FINGERPRINT ID:</div>
            <div class="tracker-id" id="tracker-fingerprint">A7F...3B2</div>
            
            <div class="tracker-stats-row">
              <div class="tracker-stat">
                <div class="tracker-label">ATTEMPT COUNT</div>
                <div class="tracker-value" id="tracker-attempts">0</div>
              </div>
              <div class="tracker-stat">
                <div class="tracker-label">TARGET ZONE</div>
                <div class="tracker-value amber">/api/v1/auth</div>
              </div>
            </div>

            <div class="tracker-label">ATTACK VECTORS USED:</div>
            <div class="tracker-badges" id="tracker-vectors">
              <!-- Animated badges will be inserted here -->
            </div>

            <div class="tracker-timestamps">
              <div class="tracker-label">FIRST SEEN: <span id="tracker-first">--:--:--</span></div>
              <div class="tracker-label">LAST SEEN: <span id="tracker-last">--:--:--</span></div>
            </div>

            <div class="tracker-risk">
              <div class="tracker-label" style="display:flex; justify-content: space-between;">
                <span>RISK LEVEL</span>
                <span id="tracker-risk-lbl" class="threat-red">CRITICAL</span>
              </div>
              <div class="risk-bar-container">
                <div class="risk-bar-fill" id="tracker-risk-fill" style="width: 0%;"></div>
              </div>
            </div>

            <div class="tracker-status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              BEING MONITORED
            </div>
          </div>
        </div>

        <!-- LIVE LOG FEED (Right Side) -->
        <div class="log-feed-panel">
          <div class="log-feed-header">
            <div class="panel-title" style="margin: 0;">
              <div class="indicator"></div>
              LIVE SECURITY LOG
            </div>
            <div class="log-counter">
              TOTAL BLOCKED TODAY: <span id="total-blocked-val" class="threat-red" style="font-weight: 700; font-size: 16px;">24,801</span>
            </div>
          </div>

          <div class="log-table-wrapper">
            <table class="live-log-table">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>SOURCE IP / ID</th>
                  <th>ATTACK TYPE</th>
                  <th>ACTION TAKEN</th>
                  <th>FINGERPRINT ID</th>
                  <th style="text-align: right;">RESPONSE TIME</th>
                </tr>
              </thead>
              <tbody id="live-log-body">
                <!-- Rows auto generated -->
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;
}
