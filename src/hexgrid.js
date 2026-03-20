// Hexagonal Grid Background
export class HexGrid {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.resize();
    this.draw();
    window.addEventListener('resize', () => {
      this.resize();
      this.draw();
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const size = 40;
    const h = size * Math.sqrt(3);
    const cols = Math.ceil(canvas.width / (size * 1.5)) + 2;
    const rows = Math.ceil(canvas.height / h) + 2;

    ctx.strokeStyle = 'rgba(255, 45, 45, 0.15)';
    ctx.lineWidth = 0.5;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * size * 1.5;
        const y = row * h + (col % 2 ? h / 2 : 0);
        this.drawHex(ctx, x, y, size);
      }
    }

    // Add some random bright nodes 
    ctx.fillStyle = 'rgba(255, 45, 45, 0.3)';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawHex(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  }
}
