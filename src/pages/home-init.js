import { animateCounter } from '../animations.js';

// 3D Shield rendering on canvas
function render3DShield() {
  const canvas = document.getElementById('shield-3d-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = 300, H = 300;
  canvas.width = W * 2;
  canvas.height = H * 2;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(2, 2);

  let time = 0;
  const cx = W / 2, cy = H / 2;

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    time += 0.015;

    // Rotating orbit rings
    for (let ring = 0; ring < 3; ring++) {
      const radius = 60 + ring * 28;
      const tilt = 0.3 + ring * 0.2;
      const speed = 1 + ring * 0.3;
      
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * tilt, time * speed * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 45, 45, ${0.12 - ring * 0.02})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting dot
      const dotAngle = time * speed;
      const dotX = cx + radius * Math.cos(dotAngle);
      const dotY = cy + radius * tilt * Math.sin(dotAngle);
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = ring === 0 ? '#FF2D2D' : ring === 1 ? '#00FF88' : '#FFB800';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Trail
      for (let t = 1; t <= 5; t++) {
        const trailAngle = dotAngle - t * 0.15;
        const tx = cx + radius * Math.cos(trailAngle);
        const ty = cy + radius * tilt * Math.sin(trailAngle);
        ctx.beginPath();
        ctx.arc(tx, ty, 1.5 - t * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = ring === 0 ? `rgba(255,45,45,${0.3 - t*0.05})` : 
                         ring === 1 ? `rgba(0,255,136,${0.3 - t*0.05})` : 
                         `rgba(255,184,0,${0.3 - t*0.05})`;
        ctx.fill();
      }
    }

    // Center shield
    const pulse = Math.sin(time * 2) * 0.08 + 1;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulse, pulse);
    
    // Shield body
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(32, -24);
    ctx.lineTo(32, 8);
    ctx.quadraticCurveTo(32, 38, 0, 47);
    ctx.quadraticCurveTo(-32, 38, -32, 8);
    ctx.lineTo(-32, -24);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 45, 45, 0.06)';
    ctx.fill();
    ctx.strokeStyle = '#FF2D2D';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#FF2D2D';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner shield
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(20, -14);
    ctx.lineTo(20, 4);
    ctx.quadraticCurveTo(20, 26, 0, 32);
    ctx.quadraticCurveTo(-20, 26, -20, 4);
    ctx.lineTo(-20, -14);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 45, 45, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 45, 45, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Center core
    ctx.beginPath();
    ctx.arc(0, 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FF2D2D';
    ctx.shadowColor = '#FF2D2D';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cross hairs
    ctx.strokeStyle = 'rgba(255, 45, 45, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-16, 2); ctx.lineTo(16, 2); ctx.stroke();

    ctx.restore();

    // Floating data bits
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + time * 0.5;
      const dist = 105 + Math.sin(time * 2 + i * 0.8) * 12;
      const px = cx + dist * Math.cos(angle);
      const py = cy + dist * Math.sin(angle) * 0.4;
      
      ctx.fillStyle = `rgba(255, 45, 45, ${0.15 + Math.sin(time + i) * 0.08})`;
      ctx.fillRect(px - 1, py - 1, 2, 2);
    }

    // Scan line
    const scanY = cy + Math.sin(time * 1.5) * 80;
    ctx.beginPath();
    ctx.moveTo(cx - 100, scanY);
    ctx.lineTo(cx + 100, scanY);
    ctx.strokeStyle = `rgba(255, 45, 45, ${0.08 + Math.sin(time * 3) * 0.04})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    requestAnimationFrame(drawFrame);
  }

  drawFrame();
}

export function initHomePage() {
  // Animate stats
  setTimeout(() => {
    const el1 = document.getElementById('stat-attacks-val');
    const el2 = document.getElementById('stat-uptime-val');
    const el3 = document.getElementById('stat-response-val');
    const el4 = document.getElementById('stat-confidence-val');
    
    if (el1) animateCounter(el1, 24789, 2500);
    if (el2) {
      let v = 0;
      const int = setInterval(() => {
        v += 1.2;
        if (v >= 99.98) { v = 99.98; clearInterval(int); }
        el2.textContent = v.toFixed(2) + '%';
      }, 25);
    }
    if (el3) animateCounter(el3, 14, 1500, '', 'ms');
    if (el4) {
      let v = 0;
      const int = setInterval(() => {
        v += 1.3;
        if (v >= 99.97) { v = 99.97; clearInterval(int); }
        el4.textContent = v.toFixed(2) + '%';
      }, 25);
    }
  }, 400);

  // 3D Shield
  render3DShield();
}
