export function initDemoPage() {
  // Honeypot toggle
  const toggle = document.getElementById('honeypot-toggle');
  const statusLabel = document.getElementById('honeypot-status-label');
  const badge = document.getElementById('honeypot-badge');
  const badgeText = document.getElementById('honeypot-badge-text');

  if (toggle) {
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        statusLabel.textContent = 'ACTIVE';
        statusLabel.className = 'honeypot-status active';
        badge.className = 'honeypot-badge active';
        badgeText.textContent = 'HONEYPOT ACTIVE';
      } else {
        statusLabel.textContent = 'INACTIVE';
        statusLabel.className = 'honeypot-status inactive';
        badge.className = 'honeypot-badge inactive';
        badgeText.textContent = 'HONEYPOT DISABLED';
      }
    });
  }

  // File upload
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const preview = document.getElementById('upload-preview');

  if (uploadZone) {
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = '#FF2D2D';
      uploadZone.style.background = 'rgba(255,45,45,0.05)';
    });
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = '';
      uploadZone.style.background = '';
    });
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = '';
      uploadZone.style.background = '';
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        handleFile(fileInput.files[0]);
      }
    });
  }

  function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('preview-image').src = e.target.result;
      document.getElementById('file-name').textContent = file.name;
      document.getElementById('file-status').textContent = 'ANALYZING...';
      document.getElementById('file-status').style.color = 'var(--warning-amber)';
      preview.style.display = 'block';
      uploadZone.style.display = 'none';
      document.getElementById('scan-overlay').style.display = 'block';

      // Simulate analysis
      simulateAnalysis();
    };
    reader.readAsDataURL(file);
  }

  function simulateAnalysis() {
    const isAttack = Math.random() > 0.4;
    const threatScore = isAttack ? Math.floor(Math.random() * 40 + 60) : Math.floor(Math.random() * 20);
    const confidence = isAttack ? Math.floor(Math.random() * 15 + 85) : Math.floor(Math.random() * 10 + 90);
    const attacks = ['FGSM', 'PGD', 'CW L2', 'Patch Attack', 'DeepFool'];
    const attackType = attacks[Math.floor(Math.random() * attacks.length)];

    setTimeout(() => {
      // Update gauge
      const circumference = 2 * Math.PI * 60; // r=60
      const offset = circumference - (threatScore / 100) * circumference;
      const gaugeFill = document.getElementById('threat-gauge-fill');
      if (gaugeFill) {
        gaugeFill.style.strokeDashoffset = offset;
        if (threatScore > 50) {
          gaugeFill.style.stroke = '#FF2D2D';
        } else {
          gaugeFill.style.stroke = '#00FF88';
        }
      }

      // Update score text
      animateNumber('threat-score', threatScore);
      
      // Update confidence
      const confFill = document.getElementById('confidence-fill');
      const confValue = document.getElementById('confidence-value');
      if (confFill) confFill.style.width = confidence + '%';
      if (confValue) confValue.textContent = confidence + '%';

      // Update file status
      const fileStatus = document.getElementById('file-status');
      if (isAttack) {
        fileStatus.textContent = `⚠ ${attackType} DETECTED`;
        fileStatus.style.color = 'var(--threat-red)';
      } else {
        fileStatus.textContent = '✓ CLEAN — NO THREAT';
        fileStatus.style.color = 'var(--safe-green)';
      }

      // Hide scan overlay
      document.getElementById('scan-overlay').style.display = 'none';

      // Add log entry
      addLogEntry(isAttack, attackType, threatScore);

    }, 2500);
  }

  function animateNumber(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const step = target / 60;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.floor(current);
    }, 25);
  }

  function addLogEntry(isAttack, attackType, score) {
    const tbody = document.getElementById('log-table-body');
    if (!tbody) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const fingerprint = '0x' + Math.random().toString(16).slice(2, 8).toUpperCase();
    
    const row = document.createElement('tr');
    if (isAttack) row.className = 'attack-row';
    
    row.innerHTML = `
      <td>${timestamp}</td>
      <td>${isAttack ? 'Adversarial' : 'Clean'}</td>
      <td><span class="status-badge ${isAttack ? 'detected' : 'blocked'}">${isAttack ? attackType : 'NONE'}</span></td>
      <td>${isAttack ? 'Quarantined + Logged' : 'Passed'}</td>
      <td style="font-family: var(--font-mono); font-size: 11px;">${isAttack ? fingerprint : '—'}</td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);

    // Update count
    const countEl = document.getElementById('event-count');
    if (countEl) {
      const count = tbody.children.length;
      countEl.textContent = count + ' event' + (count !== 1 ? 's' : '');
    }
  }

  // Auto-populate some initial log entries
  populateInitialLogs();

  function populateInitialLogs() {
    const entries = [
      { isAttack: true, type: 'FGSM', score: 87 },
      { isAttack: false, type: 'NONE', score: 5 },
      { isAttack: true, type: 'PGD', score: 72 },
      { isAttack: true, type: 'Patch Attack', score: 91 },
      { isAttack: false, type: 'NONE', score: 3 },
      { isAttack: true, type: 'CW L2', score: 68 },
      { isAttack: false, type: 'NONE', score: 8 },
      { isAttack: true, type: 'DeepFool', score: 79 },
    ];

    entries.forEach((entry, i) => {
      setTimeout(() => {
        addLogEntry(entry.isAttack, entry.type, entry.score);
      }, i * 300);
    });
  }
}
