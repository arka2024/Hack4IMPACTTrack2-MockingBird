/**
 * Dashboard Stats Tracker
 * Maintains real-time threat statistics updated by demo frame analysis
 */

export class DashboardStats {
  constructor() {
    this.stats = {
      total_blocked: 0,
      total_analyzed: 0,
      total_threats_detected: 0,
      honeypot_captures: 0,
      objects_detected: 0,
      non_human_objects: 0,
      avg_detection_time_ms: 0,
      system_confidence: 99.9,
      current_threat_level: "SAFE",
      last_attack_time: null,
      blocked_today: [],
      threat_distribution: {
        BLOCKED: 0,
        EM_STOP: 0,
        TRANSFER: 0,
        DEGRADE: 0,
        RESTRICT: 0,
        MONITOR: 0,
      },
    };
    this.loadFromStorage();
  }

  recordAnalysis(result) {
    this.stats.total_analyzed += 1;

    if (result.action === "BLOCKED") {
      this.stats.total_blocked += 1;
      this.stats.blocked_today.push({
        time: new Date().toISOString(),
        attack: result.attack,
        action: result.action,
        score: result.threat,
      });
    }

    if (result.threat > 20) {
      this.stats.total_threats_detected += 1;
    }

    if (result.action === "HONEYPOT") {
      this.stats.honeypot_captures += 1;
    }
    
    // Track non-human object detection
    if (result.detected_object) {
      this.stats.objects_detected += 1;
      this.stats.non_human_objects += 1;
    }

    if (result.threat_distribution && result.threat_distribution in this.stats.threat_distribution) {
      this.stats.threat_distribution[result.action] += 1;
    }

    this.stats.last_attack_time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Keep only last 50 blocked records
    if (this.stats.blocked_today.length > 50) {
      this.stats.blocked_today = this.stats.blocked_today.slice(-50);
    }

    this.updateUI();
    this.saveToStorage();
  }

  updateUI() {
    // Update KPI cards
    const totalBlockedEl = document.querySelector("[data-kpi='total_blocked']");
    if (totalBlockedEl) {
      totalBlockedEl.textContent = this.stats.total_blocked.toLocaleString();
      this.animateValueChange(totalBlockedEl);
    }

    const totalAnalyzedEl = document.querySelector("[data-kpi='total_analyzed']");
    if (totalAnalyzedEl) {
      totalAnalyzedEl.textContent = this.stats.total_analyzed.toLocaleString();
    }

    const honeypotEl = document.querySelector("[data-kpi='honeypot_captures']");
    if (honeypotEl) {
      honeypotEl.textContent = this.stats.honeypot_captures.toLocaleString();
      this.animateValueChange(honeypotEl);
    }
    
    const objectsEl = document.querySelector("[data-kpi='objects_detected']");
    if (objectsEl) {
      objectsEl.textContent = this.stats.non_human_objects.toLocaleString();
      this.animateValueChange(objectsEl);
    }

    const lastTimeEl = document.querySelector("[data-kpi='last_attack_time']");
    if (lastTimeEl && this.stats.last_attack_time) {
      lastTimeEl.textContent = this.stats.last_attack_time;
      this.animateValueChange(lastTimeEl);
    }

    // Update log table
    this.updateIncidentLog();
  }

  updateIncidentLog() {
    const tbody = document.getElementById("stats-log-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    const recentBlocked = this.stats.blocked_today.slice(-10).reverse();
    if (recentBlocked.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-faint)">No blocked threats yet...</td></tr>`;
      return;
    }

    recentBlocked.forEach((item, idx) => {
      const time = new Date(item.time);
      const timeStr = time.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const row = document.createElement("tr");
      row.style.opacity = "0";
      row.innerHTML = `
        <td>${timeStr}</td>
        <td>CAM-01</td>
        <td><span style="color:var(--threat-red)">${item.attack}</span></td>
        <td><span style="background:#FF2D2D12;color:var(--threat-red);padding:2px 8px;border-radius:2px;font-size:9px">BLOCKED</span></td>
        <td>INC-${Math.random().toString(36).substr(2, 6).toUpperCase()}</td>
        <td style="text-align:right">${(48 + Math.random() * 52).toFixed(1)}ms</td>
      `;
      tbody.appendChild(row);

      setTimeout(() => {
        row.style.transition = "opacity 0.3s ease";
        row.style.opacity = "1";
      }, idx * 50);
    });
  }

  animateValueChange(el) {
    el.style.color = "var(--threat-red)";
    setTimeout(() => {
      el.style.color = "inherit";
    }, 500);
  }

  saveToStorage() {
    try {
      sessionStorage.setItem("dashboard-stats", JSON.stringify(this.stats));
    } catch (e) {
      console.warn("Could not save dashboard stats:", e);
    }
  }

  loadFromStorage() {
    try {
      const saved = sessionStorage.getItem("dashboard-stats");
      if (saved) {
        this.stats = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load dashboard stats:", e);
    }
  }

  resetStats() {
    this.stats = {
      total_blocked: 0,
      total_analyzed: 0,
      total_threats_detected: 0,
      honeypot_captures: 0,
      objects_detected: 0,
      non_human_objects: 0,
      avg_detection_time_ms: 0,
      system_confidence: 99.9,
      current_threat_level: "SAFE",
      last_attack_time: null,
      blocked_today: [],
      threat_distribution: {
        BLOCKED: 0,
        EM_STOP: 0,
        TRANSFER: 0,
        DEGRADE: 0,
        RESTRICT: 0,
        MONITOR: 0,
      },
    };
    this.saveToStorage();
    this.updateUI();
  }

  exportJSON() {
    return JSON.stringify(this.stats, null, 2);
  }
}

export const dashboardStats = new DashboardStats();
