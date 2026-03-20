import { animateCounter } from '../animations.js';

export function initDashboardPage() {
  // Animate KPIs
  setTimeout(() => {
    const atk = document.getElementById('kpi-attacks-value');
    const hp = document.getElementById('kpi-honeypot-value');
    const resp = document.getElementById('kpi-response-value');
    const conf = document.getElementById('kpi-confidence-value');

    if (atk) animateCounter(atk, 2847, 2000);
    if (hp) animateCounter(hp, 186, 1800);
    if (resp) animateCounter(resp, 12, 1500);
    if (conf) {
      let val = 0;
      const interval = setInterval(() => {
        val += 1.5;
        if (val >= 99.2) { val = 99.2; clearInterval(interval); }
        conf.textContent = val.toFixed(1) + '%';
      }, 30);
    }
  }, 300);

  // Render line chart
  renderLineChart();

  // Render donut chart
  renderDonutChart();

  // Populate incident log
  populateIncidentLog();

  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterLog(btn.dataset.filter);
    });
  });

  // Live update simulation
  setInterval(() => {
    addLiveIncident();
  }, 5000);
}

function renderLineChart() {
  const canvas = document.getElementById('threat-line-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);
  const W = rect.width;
  const H = rect.height;

  // Generate data points
  const points = [];
  for (let i = 0; i < 24; i++) {
    points.push({
      x: (i / 23) * W,
      y: H - (Math.random() * 60 + 20 + Math.sin(i * 0.5) * 30) / 100 * H
    });
  }

  let animProgress = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    animProgress = Math.min(animProgress + 0.02, 1);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (i / 4) * H;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    for (let i = 0; i < 24; i++) {
      const x = (i / 23) * W;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '10px JetBrains Mono';
    for (let i = 0; i <= 4; i++) {
      ctx.fillText((100 - i * 25) + '', 2, (i / 4) * H + 12);
    }

    // X-axis labels
    for (let i = 0; i < 24; i += 4) {
      ctx.fillText(i + 'h', (i / 23) * W, H - 2);
    }

    // Draw filled area
    const drawPoints = Math.ceil(points.length * animProgress);
    if (drawPoints > 1) {
      // Area fill
      ctx.beginPath();
      ctx.moveTo(points[0].x, H);
      for (let i = 0; i < drawPoints; i++) {
        if (i === 0) {
          ctx.lineTo(points[i].x, points[i].y);
        } else {
          const cx = (points[i - 1].x + points[i].x) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, cx, (points[i - 1].y + points[i].y) / 2);
          if (i === drawPoints - 1) {
            ctx.lineTo(points[i].x, points[i].y);
          }
        }
      }
      ctx.lineTo(points[drawPoints - 1].x, H);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, 0, 0, H);
      gradient.addColorStop(0, 'rgba(255, 45, 45, 0.15)');
      gradient.addColorStop(1, 'rgba(255, 45, 45, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < drawPoints; i++) {
        const cx = (points[i - 1].x + points[i].x) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, cx, (points[i - 1].y + points[i].y) / 2);
      }
      ctx.strokeStyle = '#FF2D2D';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FF2D2D';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Points
      for (let i = 0; i < drawPoints; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FF2D2D';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 45, 45, 0.3)';
        ctx.lineWidth = 6;
        ctx.stroke();
      }
    }

    if (animProgress < 1) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

function renderDonutChart() {
  const svg = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');
  const totalEl = document.getElementById('donut-total');
  if (!svg || !legend) return;

  const data = [
    { label: 'FGSM', value: 42, color: '#FF2D2D' },
    { label: 'PGD', value: 28, color: '#FF6B35' },
    { label: 'Patch Attack', value: 18, color: '#FFB800' },
    { label: 'Unknown', value: 12, color: '#3B82F6' },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);
  const circumference = 2 * Math.PI * 55;
  let currentOffset = 0;

  // Animate total
  if (totalEl) animateCounter(totalEl, total, 1500);

  data.forEach((d, i) => {
    const segmentLength = (d.value / total) * circumference;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '70');
    circle.setAttribute('cy', '70');
    circle.setAttribute('r', '55');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', d.color);
    circle.setAttribute('stroke-width', '20');
    circle.setAttribute('stroke-dasharray', `${segmentLength} ${circumference - segmentLength}`);
    circle.setAttribute('stroke-dashoffset', `${-currentOffset}`);
    circle.setAttribute('transform', 'rotate(-90 70 70)');
    circle.style.transition = `stroke-dasharray 1s ease ${i * 0.2}s`;
    circle.style.filter = `drop-shadow(0 0 4px ${d.color})`;
    svg.appendChild(circle);

    currentOffset += segmentLength;

    // Legend
    legend.innerHTML += `
      <div class="legend-item">
        <span class="legend-color" style="background: ${d.color};"></span>
        <span class="legend-label">${d.label}</span>
        <span class="legend-value">${d.value}%</span>
      </div>
    `;
  });
}

function populateIncidentLog() {
  const tbody = document.getElementById('dashboard-log-body');
  if (!tbody) return;

  const incidents = generateIncidents(15);
  incidents.forEach(inc => {
    tbody.appendChild(createIncidentRow(inc));
  });
}

function generateIncidents(count) {
  const types = ['FGSM', 'PGD', 'Patch Attack', 'CW L2', 'DeepFool', 'Unknown'];
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const statuses = ['Blocked', 'Quarantined', 'Analyzing', 'Mitigated'];
  const sources = ['External API', 'Model Input', 'Batch Pipeline', 'Edge Sensor', 'Direct Upload'];
  
  const incidents = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const time = new Date(now - i * 180000 - Math.random() * 60000);
    incidents.push({
      timestamp: time.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(time.getMilliseconds()).padStart(3, '0'),
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      fingerprint: '0x' + Math.random().toString(16).slice(2, 10).toUpperCase(),
    });
  }
  return incidents;
}

function createIncidentRow(inc) {
  const row = document.createElement('tr');
  
  const isAttack = inc.severity === 'Critical' || inc.severity === 'High';
  if (isAttack) row.className = 'attack-row';

  const severityColors = {
    'Critical': 'detected',
    'High': 'detected',
    'Medium': 'pending',
    'Low': 'blocked'
  };

  const statusColors = {
    'Blocked': 'blocked',
    'Quarantined': 'detected',
    'Analyzing': 'pending',
    'Mitigated': 'blocked'
  };

  row.innerHTML = `
    <td>${inc.timestamp}</td>
    <td>${inc.type}</td>
    <td><span class="status-badge ${severityColors[inc.severity]}">${inc.severity}</span></td>
    <td><span class="status-badge ${statusColors[inc.status]}">${inc.status}</span></td>
    <td>${inc.source}</td>
    <td style="font-family: var(--font-mono); font-size: 11px;">${inc.fingerprint}</td>
  `;
  
  row.dataset.type = inc.type.toLowerCase().replace(' ', '-');
  return row;
}

function addLiveIncident() {
  const tbody = document.getElementById('dashboard-log-body');
  if (!tbody) return;

  const incidents = generateIncidents(1);
  const row = createIncidentRow(incidents[0]);
  row.style.animation = 'row-flash 2s ease';
  tbody.insertBefore(row, tbody.firstChild);

  // Keep max 20 rows
  while (tbody.children.length > 20) {
    tbody.removeChild(tbody.lastChild);
  }

  // Update attacks counter
  const atkVal = document.getElementById('kpi-attacks-value');
  if (atkVal) {
    const current = parseInt(atkVal.textContent.replace(/,/g, '')) || 2847;
    atkVal.textContent = (current + 1).toLocaleString();
  }
}

function filterLog(filter) {
  const rows = document.querySelectorAll('#dashboard-log-body tr');
  rows.forEach(row => {
    if (filter === 'all') {
      row.style.display = '';
    } else {
      const type = row.dataset.type || '';
      if (type.includes(filter)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
}
