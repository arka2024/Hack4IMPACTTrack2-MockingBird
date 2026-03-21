export function initDemoPage() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--threat-red)';
      uploadZone.style.background = 'rgba(255, 45, 45, 0.05)';
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
        startScanProcess(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        startScanProcess(e.target.files[0]);
      }
    });

    const injectBtn = document.getElementById('inject-demo-btn');
    if (injectBtn) {
      injectBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent clicking the uploadZone
        startScanProcess('MOCK_STOP_SIGN');
      });
    }
  }

  // Honeypot Toggle Logic
  const honeypotSwitch = document.getElementById('honeypot-switch');
  const honeypotLabel = document.getElementById('honeypot-label');
  const revealWrapper = document.getElementById('honeypot-reveal-wrapper');
  const decisionBadge = document.getElementById('decision-badge');

  if (honeypotSwitch) {
    honeypotSwitch.addEventListener('change', (e) => {
      const isOn = e.target.checked;
      
      if (honeypotLabel) {
        honeypotLabel.textContent = isOn ? 'HONEYPOT DECOY: ON' : 'HONEYPOT DECOY: OFF';
        honeypotLabel.style.color = isOn ? 'var(--warning-amber)' : 'var(--text-secondary)';
      }

      // If we already finished a scan, toggle the panel immediately
      if (document.getElementById('results-content').style.display === 'flex') {
        if (isOn) {
          revealWrapper.style.display = 'block';
          decisionBadge.textContent = 'HONEYPOT';
          decisionBadge.className = 'badge-status pending';
        } else {
          revealWrapper.style.display = 'none';
          decisionBadge.textContent = 'BLOCKED';
          decisionBadge.className = 'badge-status blocked';
        }
      }
    });
  }
}

function startScanProcess(file) {
  const uploadZone = document.getElementById('upload-zone');
  const scanContainer = document.getElementById('scan-container');
  const previewImg = document.getElementById('preview-img');
  
  const resultsSkeleton = document.getElementById('results-skeleton');
  const resultsContent = document.getElementById('results-content');
  const revealWrapper = document.getElementById('honeypot-reveal-wrapper');
  
  const s1 = document.getElementById('step-1');
  const s2 = document.getElementById('step-2');
  const s3 = document.getElementById('step-3');
  const fill = document.getElementById('scan-fill');
  
  // Hide upload, showing scanning UI
  uploadZone.style.display = 'none';
  scanContainer.style.display = 'block';
  resultsSkeleton.style.display = 'flex';
  resultsContent.style.display = 'none';
  revealWrapper.style.display = 'none';
  
  // Reset scan states
  [s1, s2, s3].forEach(el => {
    el.style.opacity = '0.3';
    el.innerHTML = '<span class="step-icon">[ ]</span> ' + el.textContent.substring(4);
  });
  fill.style.transition = 'none';
  fill.style.width = '0%';
  
  // Preview
  if (file === 'MOCK_STOP_SIGN') {
    const svgData = `<svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#FF1E1E" stroke="white" stroke-width="2"/>
      <text x="50" y="56" fill="white" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">STOP</text>
      <rect x="35" y="60" width="12" height="12" fill="yellow" opacity="0.8" />
      <polygon points="50,65 55,75 45,75" fill="black" opacity="0.9"/>
      <circle cx="60" cy="62" r="4" fill="magenta" opacity="0.8"/>
      <rect x="40" y="25" width="20" height="8" fill="cyan" opacity="0.7"/>
    </svg>`;
    previewImg.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Scan Timeline (2.5s total)
  setTimeout(() => {
    fill.style.transition = 'width 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
    fill.style.width = '100%';
  }, 50);

  setTimeout(() => markStep(s1), 600);
  setTimeout(() => markStep(s2), 1400);
  setTimeout(() => markStep(s3), 2200);

  // Complete
  setTimeout(() => {
    showResults();
  }, 2600);
}

function markStep(el) {
  el.style.opacity = '1';
  el.innerHTML = '<span class="step-icon" style="color:var(--threat-red);">[✓]</span> ' + el.textContent.substring(4);
}

function showResults() {
  const resultsSkeleton = document.getElementById('results-skeleton');
  const resultsContent = document.getElementById('results-content');
  const scoreEl = document.getElementById('threat-score');
  const confFill = document.getElementById('confidence-fill');
  const attackType = document.getElementById('attack-type-badge');
  const decisionBadge = document.getElementById('decision-badge');
  
  resultsSkeleton.style.display = 'none';
  resultsContent.style.display = 'flex';
  
  // Is honeypot engaged?
  const honeypotOn = document.getElementById('honeypot-switch').checked;

  // Render score
  const finalScore = 94; // Fixed high threat for demo
  scoreEl.style.color = 'var(--threat-red)';
  scoreEl.style.textShadow = '0 0 20px rgba(255,45,45,0.4)';
  
  // Counter animation
  let val = 0;
  const interval = setInterval(() => {
    val += 3;
    if(val >= finalScore) {
      val = finalScore;
      clearInterval(interval);
    }
    scoreEl.textContent = val;
  }, 16);

  // Confidence bar
  setTimeout(() => {
    confFill.style.width = '98.5%';
  }, 100);
  
  // decision badge
  if (honeypotOn) {
    decisionBadge.textContent = 'HONEYPOT';
    decisionBadge.className = 'badge-status pending';
    
    // Reveal panel
    document.getElementById('honeypot-reveal-wrapper').style.display = 'block';
  } else {
    decisionBadge.textContent = 'BLOCKED';
    decisionBadge.className = 'badge-status blocked';
  }
}
