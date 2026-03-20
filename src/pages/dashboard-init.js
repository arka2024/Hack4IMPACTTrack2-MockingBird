export function initDashboardPage() {
  const tableBody = document.getElementById('live-log-body');
  if (!tableBody) return;

  const totalBlockedEl = document.getElementById('total-blocked-val');
  let totalBlocked = 24801;

  // Tracker Elements
  const trackerAttemptsEl = document.getElementById('tracker-attempts');
  const trackerFirstEl = document.getElementById('tracker-first');
  const trackerLastEl = document.getElementById('tracker-last');
  const trackerRiskFill = document.getElementById('tracker-risk-fill');
  const trackerRiskLbl = document.getElementById('tracker-risk-lbl');
  const trackerVectorsEl = document.getElementById('tracker-vectors');
  
  let targetAttackerAttempts = 6;
  let targetAttackerFirstSeen = '16:04:12.804'; // Simulated earlier time
  const targetFingerprint = 'A7F...3B2';
  const targetVectors = new Set(['PGD', 'CW', 'Boundary']);

  const attackTypes = ['FGSM', 'PGD', 'CW', 'DeepFool', 'Patch', 'JSMA', 'Boundary'];
  const actions = [
    { text: 'BLOCKED', color: 'red' },
    { text: 'HONEYPOT', color: 'amber' },
    { text: 'REVIEW', color: 'amber' },
    { text: 'PASSED', color: 'green' }
  ];
  const fingerprints = [targetFingerprint, 'C2B...9A1', 'E9D...4F5', 'B8A...1C3'];
  const sources = ['Cam-NY-01', 'API-Gateway-EU', 'Device-XYZ', 'Cam-LDN-05'];

  function addLogEntry(forceHitTarget = false) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
    
    // Attack type
    const attackIdx = Math.floor(Math.random() * attackTypes.length);
    const attackType = attackTypes[attackIdx];

    // Higher chance (40%) to hit the target attacker
    const isTarget = forceHitTarget || Math.random() < 0.4;
    const fpId = isTarget ? targetFingerprint : fingerprints[Math.floor(Math.random() * fingerprints.length)];
    
    // Action (CLEAN is rare, mostly attacks)
    const isAttack = forceHitTarget || Math.random() < 0.85;
    let action;
    if (isAttack) {
      action = actions[Math.floor(Math.random() * 3)]; // Blocked, honeypot, review
      totalBlocked++;
      if (totalBlockedEl) totalBlockedEl.textContent = totalBlocked.toLocaleString();
    } else {
      action = actions[3]; // Passed
    }

    const source = sources[Math.floor(Math.random() * sources.length)];
    const responseTime = Math.floor(Math.random() * 12) + 4; // 4-15ms

    // Create row
    const tr = document.createElement('tr');
    tr.className = 'log-row log-row-enter';
    if (action.color === 'red') tr.classList.add('border-red');
    else if (action.color === 'amber') tr.classList.add('border-amber');
    else tr.classList.add('border-green');

    tr.innerHTML = `
      <td>${timeStr}</td>
      <td>${source}</td>
      <td><span class="badge ${isAttack ? 'badge-danger' : 'badge-safe'}">${isAttack ? attackType : 'NONE'}</span></td>
      <td style="color: var(--${action.color === 'red' ? 'threat-red' : action.color === 'amber' ? 'warning-amber' : 'safe-green'}); font-weight: 700;">${action.text}</td>
      <td style="color: #94A3B8;">${fpId}</td>
      <td style="text-align: right; color: var(--info-blue);">${responseTime}ms</td>
    `;
    
    tableBody.prepend(tr);

    // Remove older rows (keep 8 max)
    if (tableBody.children.length > 8) {
      const last = tableBody.lastElementChild;
      last.classList.remove('log-row-enter');
      last.classList.add('log-row-exit');
      setTimeout(() => {
        if (last && last.parentNode) last.parentNode.removeChild(last);
      }, 500);
    }

    // Tracker update logic
    if (fpId === targetFingerprint && isAttack) {
      targetAttackerAttempts++;
      if (!targetAttackerFirstSeen) {
        targetAttackerFirstSeen = timeStr;
        if (trackerFirstEl) trackerFirstEl.textContent = targetAttackerFirstSeen;
      }
      
      if (trackerLastEl) trackerLastEl.textContent = timeStr;
      if (trackerAttemptsEl) {
        trackerAttemptsEl.textContent = targetAttackerAttempts;
        // Pulse effect
        trackerAttemptsEl.style.transform = 'scale(1.2)';
        trackerAttemptsEl.style.color = 'var(--threat-red)';
        setTimeout(() => {
          trackerAttemptsEl.style.transform = 'scale(1)';
          trackerAttemptsEl.style.color = 'white';
        }, 300);
      }

      // Add to vectors
      if (!targetVectors.has(attackType)) {
        targetVectors.add(attackType);
        if (trackerVectorsEl) {
          const badge = document.createElement('span');
          badge.className = 'vector-badge fade-in visible';
          badge.textContent = attackType;
          trackerVectorsEl.appendChild(badge);
        }
      }

      // Update Risk Bar
      if (trackerRiskFill && trackerRiskLbl) {
        const riskPercent = Math.min(100, targetAttackerAttempts * 10);
        trackerRiskFill.style.width = riskPercent + '%';
        if (riskPercent < 30) { trackerRiskLbl.textContent = 'LOW'; trackerRiskLbl.className = 'safe-green'; trackerRiskFill.style.background = 'var(--safe-green)'; trackerRiskFill.style.boxShadow = '0 0 10px var(--safe-green)'; }
        else if (riskPercent < 70) { trackerRiskLbl.textContent = 'ELEVATED'; trackerRiskLbl.className = 'warning-amber'; trackerRiskFill.style.background = 'var(--warning-amber)'; trackerRiskFill.style.boxShadow = '0 0 10px var(--warning-amber)'; }
        else { trackerRiskLbl.textContent = 'CRITICAL'; trackerRiskLbl.className = 'threat-red'; trackerRiskFill.style.background = 'var(--threat-red)'; trackerRiskFill.style.boxShadow = '0 0 10px var(--threat-red)'; }
      }
    }
  }

  // Initial tracker render
  if (trackerFirstEl) trackerFirstEl.textContent = targetAttackerFirstSeen;
  if (trackerLastEl) trackerLastEl.textContent = '16:04:12.804'; // mocked
  if (trackerAttemptsEl) trackerAttemptsEl.textContent = targetAttackerAttempts.toString();
  
  if (trackerVectorsEl) {
    trackerVectorsEl.innerHTML = '';
    targetVectors.forEach(v => {
      const badge = document.createElement('span');
      badge.className = 'vector-badge fade-in visible';
      badge.textContent = v;
      trackerVectorsEl.appendChild(badge);
    });
  }

  if (trackerRiskFill && trackerRiskLbl) {
    const riskPercent = Math.min(100, targetAttackerAttempts * 10);
    trackerRiskFill.style.width = riskPercent + '%';
    if (riskPercent < 30) { trackerRiskLbl.textContent = 'LOW'; trackerRiskLbl.className = 'safe-green'; trackerRiskFill.style.background = 'var(--safe-green)'; trackerRiskFill.style.boxShadow = '0 0 10px var(--safe-green)'; }
    else if (riskPercent < 70) { trackerRiskLbl.textContent = 'ELEVATED'; trackerRiskLbl.className = 'warning-amber'; trackerRiskFill.style.background = 'var(--warning-amber)'; trackerRiskFill.style.boxShadow = '0 0 10px var(--warning-amber)'; }
    else { trackerRiskLbl.textContent = 'CRITICAL'; trackerRiskLbl.className = 'threat-red'; trackerRiskFill.style.background = 'var(--threat-red)'; trackerRiskFill.style.boxShadow = '0 0 10px var(--threat-red)'; }
  }

  // Generate initial rows (not forcibly target)
  for (let i = 0; i < 5; i++) {
    addLogEntry(false);
  }

  let ticks = 0;
  // Interval
  let interval = setInterval(() => {
    // Check if we are still on dashboard page, if not, clear interval
    if (!document.getElementById('live-log-body')) {
      clearInterval(interval);
      return;
    }
    
    ticks++;
    // Force hit on tick 1 or every 5th tick to make a great demo loop
    if (ticks === 1 || ticks % 5 === 0) {
      addLogEntry(true);
    } else {
      addLogEntry(false);
    }
  }, 3000);
}
