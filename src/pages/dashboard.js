// Dashboard Page
export function renderDashboardPage() {
  return `
    <div class="dashboard-page">
      <div class="dashboard-header">
        <h1>Threat Intelligence Center</h1>
        <p>Every attack attempt. Every blocked input. Every attacker fingerprint. All in one place.</p>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card red pulsing" id="kpi-attacks">
          <div class="kpi-label">Total Attacks Blocked</div>
          <div class="kpi-value" id="kpi-attacks-value">0</div>
          <div class="kpi-change up">↑ 12% from last hour</div>
        </div>
        <div class="kpi-card green" id="kpi-honeypot">
          <div class="kpi-label">Honeypot Captures</div>
          <div class="kpi-value" id="kpi-honeypot-value">0</div>
          <div class="kpi-change up">↑ 8 new today</div>
        </div>
        <div class="kpi-card amber" id="kpi-response">
          <div class="kpi-label">Avg Detection (ms)</div>
          <div class="kpi-value" id="kpi-response-value">0</div>
          <div class="kpi-change down">↓ 3ms improvement</div>
        </div>
        <div class="kpi-card blue" id="kpi-confidence">
          <div class="kpi-label">System Confidence</div>
          <div class="kpi-value" id="kpi-confidence-value">0%</div>
          <div class="kpi-change down" style="color: var(--safe-green);">● Optimal</div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <!-- Line Chart -->
        <div class="chart-card">
          <h3>Threat Score Over Time</h3>
          <div class="chart-area">
            <canvas id="threat-line-chart"></canvas>
          </div>
        </div>
        
        <!-- Donut Chart -->
        <div class="chart-card">
          <h3>Attack Type Breakdown</h3>
          <div class="donut-container">
            <div class="donut-chart">
              <svg viewBox="0 0 140 140" id="donut-svg">
                <circle cx="70" cy="70" r="55" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="20"/>
              </svg>
              <div class="donut-center">
                <div class="total" id="donut-total">0</div>
                <div class="total-label">Total</div>
              </div>
            </div>
            <div class="donut-legend" id="donut-legend"></div>
          </div>
        </div>
      </div>

      <!-- Incident Log -->
      <div style="max-width: 1200px;">
        <h3 style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--safe-green); box-shadow: 0 0 8px var(--safe-green); animation: dot-pulse 1.5s ease infinite;"></span>
          Incident Log
        </h3>
        
        <div class="log-filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="fgsm">FGSM</button>
          <button class="filter-btn" data-filter="pgd">PGD</button>
          <button class="filter-btn" data-filter="patch">Patch</button>
          <button class="filter-btn" data-filter="unknown">Unknown</button>
        </div>

        <div class="event-log" style="margin-top: 0;">
          <div style="overflow-x: auto;">
            <table class="log-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Attack Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Fingerprint</th>
                </tr>
              </thead>
              <tbody id="dashboard-log-body">
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}
