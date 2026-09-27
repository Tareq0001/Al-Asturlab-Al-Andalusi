/**
 * Sky Observatory & Celestial Sphere Engine (القبة السماوية والملاحة بالنجوم)
 * Interactive Celestial Dome, Real 3D-to-2D Stereographic Overlay & Star Navigation Guidelines
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

class SkyObservatory {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.selectedStarId = 'polaris';
    this.showConstellations = true;
    this.showArabicEtymology = true;
    this.showStereographicGrid = true;

    this.rotation = 0.2; // Sky rotation angle
    this.isPanning = false;
    this.startX = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });

    this.initEvents();
    this.render();
    this.updateInfoPanel();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.cx = this.width / 2;
    this.cy = this.height / 2;
    this.domeRadius = Math.min(this.cx, this.cy) * 0.92;
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isPanning = true;
      this.startX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      const dx = e.clientX - this.startX;
      this.rotation += dx * 0.005;
      this.startX = e.clientX;
      this.render();
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });

    // Star Selection via Click
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let found = null;
      let minDistance = 20;

      window.StarCatalog.stars.forEach(star => {
        const coords = this.getScreenCoords(star);
        const dist = Math.hypot(coords.x - clickX, coords.y - clickY);
        if (dist < minDistance) {
          minDistance = dist;
          found = star;
        }
      });

      if (found) {
        this.selectedStarId = found.id;
        this.render();
        this.updateInfoPanel();
        if (window.AudioSynthesizer) window.AudioSynthesizer.playChimeNote();
      }
    });
  }

  getScreenCoords(star) {
    const starRad = (star.ra * Math.PI) / 180 + this.rotation;
    // Map declination from North Pole (+90) down to equator & south
    const r = ((90 - star.dec) / 130) * this.domeRadius;
    return {
      x: this.cx + Math.cos(starRad) * r,
      y: this.cy + Math.sin(starRad) * r
    };
  }

  selectStar(id) {
    this.selectedStarId = id;
    this.render();
    this.updateInfoPanel();
  }

  updateInfoPanel() {
    const star = window.StarCatalog.getStar(this.selectedStarId);
    if (!star) return;

    const elName = document.getElementById('star-panel-name');
    const elBayer = document.getElementById('star-panel-bayer');
    const elGuide = document.getElementById('star-panel-guide');
    const elCoords = document.getElementById('star-panel-coords');

    if (elName) elName.textContent = `${star.nameAr} (${star.nameEn})`;
    if (elBayer) elBayer.textContent = `التسمية الفلكية: ${star.bayer} • القدر: ${star.mag}`;
    if (elGuide) elGuide.textContent = star.guide || 'نجم ملاحي بارز في السماء العربية الكلاسيكية.';
    if (elCoords) elCoords.textContent = `المطلع المستقيم (RA): ${star.ra.toFixed(1)}° | الميل (Dec): ${star.dec.toFixed(1)}°`;
  }

  render() {
    const { ctx, width, height, cx, cy, domeRadius } = this;
    ctx.clearRect(0, 0, width, height);

    // 1. Deep Midnight Celestial Atmosphere
    const skyGrad = ctx.createRadialGradient(cx, cy, domeRadius * 0.1, cx, cy, domeRadius);
    skyGrad.addColorStop(0, '#0a1024');
    skyGrad.addColorStop(0.7, '#060a16');
    skyGrad.addColorStop(1, '#020408');
    ctx.fillStyle = skyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, domeRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Stereographic Coordinate Projection Grid
    if (this.showStereographicGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(74, 114, 186, 0.18)';
      ctx.lineWidth = 1;

      // Celestial Equator (معدل النهار)
      const eqR = (90 / 130) * domeRadius;
      ctx.beginPath();
      ctx.arc(cx, cy, eqR, 0, Math.PI * 2);
      ctx.stroke();

      // Radiating RA lines
      for (let i = 0; i < 12; i++) {
        const rad = (i * Math.PI) / 6 + this.rotation;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * domeRadius, cy + Math.sin(rad) * domeRadius);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Constellation Lines
    if (this.showConstellations) {
      ctx.save();
      ctx.strokeStyle = 'rgba(201, 154, 62, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);

      window.StarCatalog.constellations.forEach(c => {
        c.lines.forEach(([id1, id2]) => {
          const s1 = window.StarCatalog.getStar(id1);
          const s2 = window.StarCatalog.getStar(id2);
          if (s1 && s2) {
            const p1 = this.getScreenCoords(s1);
            const p2 = this.getScreenCoords(s2);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      ctx.setLineDash([]);
      ctx.restore();
    }

    // 4. Stars & Navigation Etymology
    window.StarCatalog.stars.forEach(star => {
      const p = this.getScreenCoords(star);
      const isSelected = star.id === this.selectedStarId;

      // Star size based on magnitude
      const radius = Math.max(2, 6 - star.mag * 1.2);

      // Star Glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * (isSelected ? 3.5 : 2), 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = isSelected ? 0.6 : 0.25;
      ctx.fill();

      // Sharp Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#ffffff' : star.color;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Selection Ring
      if (isSelected) {
        ctx.strokeStyle = '#e5c158';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Star Label
      if (this.showArabicEtymology || isSelected) {
        ctx.fillStyle = isSelected ? '#fde047' : '#c4b59f';
        ctx.font = isSelected ? 'bold 12px "Amiri", serif' : '10px "Amiri", serif';
        ctx.fillText(star.nameAr.split(' ')[0], p.x + radius + 4, p.y + 3);
      }
      ctx.restore();
    });

    // 5. Compass Cardinal Direction Rim (North, East, South, West)
    ctx.save();
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, domeRadius, 0, Math.PI * 2);
    ctx.stroke();

    const cardinals = [
      { text: 'شمال (N)', angle: -Math.PI / 2 },
      { text: 'شرق (E)', angle: 0 },
      { text: 'جنوب (S)', angle: Math.PI / 2 },
      { text: 'غرب (W)', angle: Math.PI }
    ];

    cardinals.forEach(c => {
      const tx = cx + Math.cos(c.angle) * (domeRadius + 18);
      const ty = cy + Math.sin(c.angle) * (domeRadius + 18);
      ctx.fillStyle = '#e5c158';
      ctx.font = 'bold 12px "Amiri", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.text, tx, ty);
    });

    ctx.restore();
  }
}

window.SkyObservatory = SkyObservatory;
