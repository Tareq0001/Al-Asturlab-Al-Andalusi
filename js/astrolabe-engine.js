/**
 * Royal Andalusian Astrolabe Engine (الأسطرلاب الأندلسي الملكي الكامل)
 * Front Face (Face Avant): Mater, Limb, Tympan (المقنطرات), Rete (الشبكة والبروج), Rule (المسطرة)
 * Back Face (Face Arrière): Alidade (العضادة بالثقوب), Shadow Square (مربع الظل), Sine Quadrant (ربع المجيب), Calendar Scale
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

class AndalusianAstrolabeEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.currentFace = 'front'; // 'front' | 'back'
    this.reteAngle = 0.52; // Rotation of Rete in radians
    this.ruleAngle = 0.52; // Rotation of Front Rule
    this.alidadeAngle = 0.78; // Rotation of Back Alidade (e.g. 45 degrees solar sight)

    this.isDragging = false;
    this.dragTarget = null; // 'rete' | 'rule' | 'alidade'
    this.lastAngle = 0;

    // Cities / Latitude plates
    this.plates = {
      cordoba: { nameAr: 'قرطبة عاصمة الأندلس', nameEn: 'Cordoba, Al-Andalus', lat: 37.88, lng: -4.77, tz: 1 },
      toledo: { nameAr: 'طليطلة مرصد الزرقالي', nameEn: 'Toledo, Spain', lat: 39.86, lng: -4.02, tz: 1 },
      seville: { nameAr: 'إشبيلية مهد الأسطرلاب', nameEn: 'Seville, Spain', lat: 37.38, lng: -5.98, tz: 1 },
      mecca: { nameAr: 'مكة المكرمة أم القرى', nameEn: 'Mecca, Hijaz', lat: 21.42, lng: 39.82, tz: 3 },
      medina: { nameAr: 'المدينة المنورة دار الهجرة', nameEn: 'Medina, Hijaz', lat: 24.46, lng: 39.61, tz: 3 },
      cairo: { nameAr: 'القاهرة ومرصد ابن يونس', nameEn: 'Cairo, Egypt', lat: 30.04, lng: 31.23, tz: 2 },
      damascus: { nameAr: 'دمشق مرصد قاسيون', nameEn: 'Damascus, Syria', lat: 33.51, lng: 36.29, tz: 3 },
      baghdad: { nameAr: 'بغداد دار الحكمة', nameEn: 'Baghdad, Iraq', lat: 33.31, lng: 44.36, tz: 3 },
      paris: { nameAr: 'مرصد باريس الملكي', nameEn: 'Paris, France', lat: 48.85, lng: 2.35, tz: 1 },
      london: { nameAr: 'الجمعية الملكية بلندن', nameEn: 'London, England', lat: 51.50, lng: -0.12, tz: 0 }
    };
    this.selectedCityKey = 'cordoba';

    // Rete Star Pointers (شظايا النجوم على شبكة الأسطرلاب الأندلسي)
    this.reteStars = [
      { id: 'sirius', name: 'الشعرى اليمانية', ra: 101.29, dec: -16.72 },
      { id: 'vega', name: 'النسر الواقع', ra: 279.23, dec: 38.78 },
      { id: 'altair', name: 'النسر الطائر', ra: 297.70, dec: 8.87 },
      { id: 'aldebaran', name: 'الدبران', ra: 68.98, dec: 16.51 },
      { id: 'rigel', name: 'رجل الجوزاء', ra: 78.63, dec: -8.20 },
      { id: 'betelgeuse', name: 'يد الجوزاء', ra: 88.79, dec: 7.41 },
      { id: 'arcturus', name: 'السماك الرامح', ra: 213.92, dec: 19.18 },
      { id: 'spica', name: 'السماك الأعزل', ra: 201.30, dec: -11.16 },
      { id: 'antares', name: 'قلب العقرب', ra: 247.35, dec: -26.43 },
      { id: 'capella', name: 'العيوق', ra: 79.17, dec: 45.99 },
      { id: 'deneb', name: 'ذنب الدجاجة', ra: 310.36, dec: 45.28 },
      { id: 'fomalhaut', name: 'فم الحوت', ra: 344.41, dec: -29.62 },
      { id: 'regulus', name: 'قلب الأسد', ra: 152.09, dec: 11.97 }
    ];

    this.zodiac = [
      'الحمل Aries', 'الثور Taurus', 'الجوزاء Gemini', 'السرطان Cancer',
      'الأسد Leo', 'العذراء Virgo', 'الميزان Libra', 'العقرب Scorpio',
      'القوس Sagittarius', 'الجدي Capricorn', 'الدلو Aquarius', 'الحوت Pisces'
    ];

    this.initEvents();
    this.resize();
    this.render();
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
    this.cy = this.height * 0.52; // slightly offset for the royal Kursi throne
    this.radius = Math.min(this.width, this.height) * 0.44;
  }

  setCity(key) {
    if (this.plates[key]) {
      this.selectedCityKey = key;
      this.render();
      this.notifyUpdate();
    }
  }

  toggleFace() {
    this.currentFace = this.currentFace === 'front' ? 'back' : 'front';
    if (window.AudioSynthesizer) window.AudioSynthesizer.playBrassGong();
    this.render();
    this.notifyUpdate();
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });

    const getAngle = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left - this.cx;
      const y = clientY - rect.top - this.cy;
      return Math.atan2(y, x);
    };

    const getDistance = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left - this.cx;
      const y = clientY - rect.top - this.cy;
      return Math.sqrt(x * x + y * y);
    };

    const onStart = (e) => {
      const dist = getDistance(e);
      if (dist > this.radius * 1.05) return;

      this.isDragging = true;
      this.lastAngle = getAngle(e);

      if (this.currentFace === 'front') {
        // Outer ring rotates rule, inner rotates Rete
        this.dragTarget = dist > this.radius * 0.85 ? 'rule' : 'rete';
      } else {
        this.dragTarget = 'alidade';
      }

      if (window.AudioSynthesizer) window.AudioSynthesizer.playClick();
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      const angle = getAngle(e);
      const delta = angle - this.lastAngle;

      if (this.dragTarget === 'rete') {
        this.reteAngle += delta;
      } else if (this.dragTarget === 'rule') {
        this.ruleAngle += delta;
      } else if (this.dragTarget === 'alidade') {
        this.alidadeAngle += delta;
      }

      this.lastAngle = angle;
      this.render();
      this.notifyUpdate();

      if (Math.abs(delta) > 0.05 && window.AudioSynthesizer) {
        window.AudioSynthesizer.playRatchet();
      }
    };

    const onEnd = () => {
      this.isDragging = false;
      this.dragTarget = null;
    };

    this.canvas.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    this.canvas.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }

  notifyUpdate() {
    const city = this.plates[this.selectedCityKey];
    const alidadeDeg = ((this.alidadeAngle * 180 / Math.PI) % 360 + 360) % 360;
    const reteDeg = ((this.reteAngle * 180 / Math.PI) % 360 + 360) % 360;

    // Compute Solar & Shadow info
    const shadow = window.CelestialMath.calculateShadow(alidadeDeg % 90);
    const qibla = window.CelestialMath.calculateQibla(city.lat, city.lng);
    const prayerTimes = window.CelestialMath.calculatePrayerTimes(new Date(), city.lat, city.lng, city.tz);

    const event = new CustomEvent('astrolabeUpdate', {
      detail: {
        face: this.currentFace,
        city: city,
        alidadeAltitude: Math.round(alidadeDeg % 90),
        reteAngleDeg: Math.round(reteDeg),
        shadowDigits: shadow.umbraRecta,
        qiblaDirection: Math.round(qibla),
        prayerTimes: prayerTimes,
        zodiacSign: this.zodiac[Math.floor(reteDeg / 30) % 12]
      }
    });
    window.dispatchEvent(event);
  }

  render() {
    const { ctx, width, height, cx, cy, radius } = this;
    ctx.clearRect(0, 0, width, height);

    // Draw Imperial Kursi (Throne & Suspension Shackle)
    this.drawKursiThrone(cx, cy, radius);

    if (this.currentFace === 'front') {
      this.renderFrontFace(cx, cy, radius);
    } else {
      this.renderBackFace(cx, cy, radius);
    }

    // Draw Center Brass Pin & Andalusian Horse Wedge (الفرس والمحور)
    this.drawCenterPin(cx, cy);
  }

  /**
   * The Imperial Kursi (الكرسي والعرش والحلقة العلوية للتعليق الرأسي)
   */
  drawKursiThrone(cx, cy, radius) {
    const { ctx } = this;
    ctx.save();
    const kursiTop = cy - radius - 15;

    // Suspension Ring (الحلقة الملكية)
    ctx.beginPath();
    ctx.arc(cx, kursiTop - 35, 26, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#c59b27';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, kursiTop - 35, 26, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#5a420e';
    ctx.stroke();

    // Pierced Arabesque Kursi Throne
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.45, cy - radius + 5);
    ctx.quadraticCurveTo(cx - radius * 0.35, kursiTop, cx - 18, kursiTop - 10);
    ctx.lineTo(cx + 18, kursiTop - 10);
    ctx.quadraticCurveTo(cx + radius * 0.35, kursiTop, cx + radius * 0.45, cy - radius + 5);
    ctx.closePath();

    const brassGrad = ctx.createLinearGradient(cx - radius * 0.45, kursiTop, cx + radius * 0.45, cy - radius);
    brassGrad.addColorStop(0, '#be9440');
    brassGrad.addColorStop(0.5, '#fae19c');
    brassGrad.addColorStop(1, '#85611f');
    ctx.fillStyle = brassGrad;
    ctx.fill();
    ctx.strokeStyle = '#5a420e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Calligraphic Inscription on Kursi: صنع بأمر السلطان بطليطلة
    ctx.fillStyle = '#3a2707';
    ctx.font = 'bold 12px "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText('صُنع بطليطلة المحروسة • مرصد الزرقالي', cx, cy - radius - 6);

    ctx.restore();
  }

  /**
   * Front Face (وجه الأسطرلاب: الطوق، الصفيحة، والشبكة، والمسطرة)
   */
  renderFrontFace(cx, cy, radius) {
    const { ctx } = this;
    const city = this.plates[this.selectedCityKey];

    // 1. Mater & Graduated Limb (الحجرة المحيطة 360 درجة و 24 ساعة)
    this.drawLimb(cx, cy, radius, true);

    // 2. Tympan / Latitude Plate (الصفيحة مع المقنطرات والسموت)
    const plateRadius = radius - 38;
    this.drawTympan(cx, cy, plateRadius, city.lat);

    // 3. The Rete (الشبكة الأندلسية الدوارة مع شظايا النجوم وحلقة البروج)
    this.drawRete(cx, cy, plateRadius);

    // 4. The Front Rule (المسطرة الدوارة ذات التدريج)
    this.drawRule(cx, cy, plateRadius);
  }

  /**
   * Back Face (ظهر الأسطرلاب: التقويم، مربع الظل، ربع الجيب، العضادة)
   */
  renderBackFace(cx, cy, radius) {
    const { ctx } = this;

    // 1. Outer Altitude Limb (أرباع الارتفاع 90°x4)
    this.drawLimb(cx, cy, radius, false);

    const innerRadius = radius - 38;

    // 2. Zodiac and Calendar Scale (حلقة فلك البروج والشهور اليوليانية/الهجرية)
    this.drawCalendarRing(cx, cy, innerRadius);

    // 3. Sine Quadrant (ربع المجيب - الربع العلوي الأيسر)
    this.drawSineQuadrant(cx, cy, innerRadius * 0.72);

    // 4. Shadow Square (مربع الظل المنكوس والمبسوط - النصف السفلي)
    this.drawShadowSquare(cx, cy, innerRadius * 0.65);

    // 5. The Alidade (العضادة باللبتين والثقوب لرصد النجوم والشمس)
    this.drawAlidade(cx, cy, radius - 15);
  }

  drawLimb(cx, cy, radius, isFront) {
    const { ctx } = this;
    ctx.save();

    // Heavy Brass Rim
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    const rimGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius);
    rimGrad.addColorStop(0, '#caa769');
    rimGrad.addColorStop(0.85, '#997328');
    rimGrad.addColorStop(1, '#422f0c');
    ctx.fillStyle = rimGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 24;
    ctx.fill();

    // 360-degree Graduations
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#3d2a09';
    ctx.lineWidth = 1.2;

    for (let deg = 0; deg < 360; deg++) {
      const rad = (deg * Math.PI) / 180;
      const isFive = deg % 5 === 0;
      const isTen = deg % 10 === 0;
      const tickLen = isTen ? 14 : isFive ? 8 : 4;

      const x1 = cx + Math.cos(rad) * (radius - 2);
      const y1 = cy + Math.sin(rad) * (radius - 2);
      const x2 = cx + Math.cos(rad) * (radius - 2 - tickLen);
      const y2 = cy + Math.sin(rad) * (radius - 2 - tickLen);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (isTen && deg % 30 === 0) {
        ctx.fillStyle = '#261b07';
        ctx.font = 'bold 9px "Cinzel Decorative", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const tx = cx + Math.cos(rad) * (radius - 24);
        const ty = cy + Math.sin(rad) * (radius - 24);
        ctx.fillText(deg.toString(), tx, ty);
      }
    }

    ctx.restore();
  }

  drawTympan(cx, cy, plateRadius, latitude) {
    const { ctx } = this;
    ctx.save();

    // Aged Ivory/Parchment Brass Plate
    ctx.beginPath();
    ctx.arc(cx, cy, plateRadius, 0, Math.PI * 2);
    const plateGrad = ctx.createRadialGradient(cx, cy, plateRadius * 0.1, cx, cy, plateRadius);
    plateGrad.addColorStop(0, '#f5e9d0');
    plateGrad.addColorStop(0.8, '#dfc597');
    plateGrad.addColorStop(1, '#be9a5b');
    ctx.fillStyle = plateGrad;
    ctx.fill();
    ctx.strokeStyle = '#5a4214';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Meridian Line (خط الزوال الشمالي-الجنوبي) & Horizon (الأفق)
    ctx.strokeStyle = 'rgba(74, 52, 17, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - plateRadius);
    ctx.lineTo(cx, cy + plateRadius);
    ctx.moveTo(cx - plateRadius, cy);
    ctx.lineTo(cx + plateRadius, cy);
    ctx.stroke();

    // Almucantars (المقنطرات: دوائر الارتفاع من 0 إلى 90 درجة)
    for (let alt = 0; alt <= 85; alt += 5) {
      const isMajor = alt % 15 === 0;
      ctx.strokeStyle = isMajor ? 'rgba(74, 52, 17, 0.75)' : 'rgba(74, 52, 17, 0.35)';
      ctx.lineWidth = isMajor ? 1.5 : 0.8;

      // Stereographic center and radius for this altitude circle
      const radAlt = alt * Math.PI / 180;
      const radLat = latitude * Math.PI / 180;
      const altRadius = plateRadius * (Math.cos(radLat) / (Math.sin(radLat) + Math.sin(radAlt)));
      const offsetY = plateRadius * (Math.cos(radAlt) / (Math.sin(radLat) + Math.sin(radAlt))) - plateRadius * 0.45;

      ctx.beginPath();
      ctx.arc(cx, cy - offsetY, Math.abs(altRadius), 0, Math.PI * 2);
      ctx.stroke();

      if (isMajor && alt > 0) {
        ctx.fillStyle = '#422f0c';
        ctx.font = '8px "Amiri", serif';
        ctx.fillText(`${alt}°`, cx + 6, cy - offsetY - altRadius + 10);
      }
    }

    // Twilight Arc (خط الشفق 18° تحت الأفق)
    ctx.strokeStyle = 'rgba(139, 30, 34, 0.5)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy + plateRadius * 0.18, plateRadius * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plate Inscription
    ctx.fillStyle = '#5a4214';
    ctx.font = 'bold 11px "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`صفيحة عرض ${latitude}° • ${this.plates[this.selectedCityKey].nameAr}`, cx, cy + plateRadius * 0.82);

    ctx.restore();
  }

  drawRete(cx, cy, plateRadius) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.reteAngle);

    // Ecliptic Circle (حلقة البروج الزودياكية المفرغة)
    const eclipticRadius = plateRadius * 0.60;
    const eclipticOffset = plateRadius * 0.23;

    ctx.beginPath();
    ctx.arc(0, eclipticOffset, eclipticRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#5a4014';
    ctx.lineWidth = 18;
    ctx.stroke();

    ctx.strokeStyle = '#fae19c';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Arabesque Filigree Framework (زخارف الهندام النباتية)
    ctx.strokeStyle = '#85611f';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, plateRadius * 0.86, 0.4, Math.PI - 0.4);
    ctx.arc(0, 0, plateRadius * 0.86, Math.PI + 0.4, -0.4);
    ctx.stroke();

    // Draw Star Dagger Pointers (الشظايا المذهبة للنجوم)
    this.reteStars.forEach(star => {
      const starRad = (star.ra * Math.PI) / 180;
      const dist = (plateRadius * 0.46) + ((star.dec + 35) / 80) * (plateRadius * 0.38);
      const sx = Math.cos(starRad) * dist;
      const sy = Math.sin(starRad) * dist;

      // Pierced Dagger Pointer
      ctx.beginPath();
      ctx.moveTo(sx * 0.82, sy * 0.82);
      ctx.lineTo(sx - 3, sy - 3);
      ctx.lineTo(sx, sy);
      ctx.lineTo(sx + 3, sy - 3);
      ctx.closePath();
      ctx.fillStyle = '#b88c30';
      ctx.fill();
      ctx.strokeStyle = '#3a2707';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Glowing Star Core
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff4cc';
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Star Arabic Label
      ctx.fillStyle = '#1c1305';
      ctx.font = 'bold 9px "Amiri", serif';
      ctx.fillText(star.name, sx + 6, sy + 3);
    });

    ctx.restore();
  }

  drawRule(cx, cy, plateRadius) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.ruleAngle);

    // Front Brass Rule
    ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.fillRect(-6, -plateRadius, 12, plateRadius * 2);
    ctx.strokeStyle = '#4a340b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-6, -plateRadius, 12, plateRadius * 2);

    // Rule Division Marks
    for (let r = 20; r < plateRadius; r += 10) {
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(6, -r);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawCalendarRing(cx, cy, innerRadius) {
    const { ctx } = this;
    ctx.save();

    // Calendar Bands
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f2e4c9';
    ctx.fill();
    ctx.strokeStyle = '#5a420e';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius * 0.82, 0, Math.PI * 2);
    ctx.stroke();

    // 12 Zodiac & Months labels
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const midAngle = angle + (Math.PI / 12);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * (innerRadius * 0.82), cy + Math.sin(angle) * (innerRadius * 0.82));
      ctx.lineTo(cx + Math.cos(angle) * innerRadius, cy + Math.sin(angle) * innerRadius);
      ctx.stroke();

      ctx.fillStyle = '#261b07';
      ctx.font = 'bold 9px "Amiri", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const tx = cx + Math.cos(midAngle) * (innerRadius * 0.91);
      const ty = cy + Math.sin(midAngle) * (innerRadius * 0.91);
      ctx.fillText(this.zodiac[i].split(' ')[0], tx, ty);
    }

    ctx.restore();
  }

  drawSineQuadrant(cx, cy, radius) {
    const { ctx } = this;
    ctx.save();
    // Top-Left Quadrant
    const s = radius * 0.65;
    ctx.strokeStyle = 'rgba(74, 52, 17, 0.4)';
    ctx.lineWidth = 0.8;

    for (let i = 0; i <= 10; i++) {
      const x = cx - (i / 10) * s;
      const y = cy - (i / 10) * s;
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x, cy - s);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(cx - s, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#3a2707';
    ctx.font = 'bold 10px "Amiri", serif';
    ctx.fillText('ربع المجيب (Sine Quadrant)', cx - s * 0.5, cy - s - 4);
    ctx.restore();
  }

  drawShadowSquare(cx, cy, size) {
    const { ctx } = this;
    ctx.save();
    // Bottom Half Shadow Square
    const w = size * 0.65;
    const h = size * 0.55;

    ctx.strokeStyle = '#422f0c';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(cx - w, cy + 10, w * 2, h);

    ctx.fillStyle = '#2d1f06';
    ctx.font = 'bold 9px "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText('الظل المبسوط (Umbra Recta 12)', cx - w * 0.5, cy + h + 22);
    ctx.fillText('الظل المنكوس (Umbra Versa 12)', cx + w * 0.5, cy + h + 22);

    ctx.restore();
  }

  drawAlidade(cx, cy, len) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.alidadeAngle);

    // Main Sighting Bar (العضادة)
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-8, -len, 16, len * 2);
    ctx.strokeStyle = '#3a2707';
    ctx.lineWidth = 2;
    ctx.strokeRect(-8, -len, 16, len * 2);

    // Sighting Vanes with Pinholes (اللبتان ذواتا الثقوب للرصد البصري)
    const vanePos = len * 0.65;
    [-vanePos, vanePos].forEach(pos => {
      ctx.fillStyle = '#9e7225';
      ctx.fillRect(-18, pos - 4, 36, 8);
      ctx.strokeRect(-18, pos - 4, 36, 8);

      // Sighting Pinholes (ثقوب الرصد)
      ctx.beginPath();
      ctx.arc(-8, pos, 2.5, 0, Math.PI * 2);
      ctx.arc(8, pos, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#1c150e';
      ctx.fill();
    });

    // Beveled pointers at ends
    ctx.beginPath();
    ctx.moveTo(-8, -len);
    ctx.lineTo(0, -len - 12);
    ctx.lineTo(8, -len);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-8, len);
    ctx.lineTo(0, len + 12);
    ctx.lineTo(8, len);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawCenterPin(cx, cy) {
    const { ctx } = this;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    const pinGrad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 18);
    pinGrad.addColorStop(0, '#fff4cc');
    pinGrad.addColorStop(0.5, '#c59b27');
    pinGrad.addColorStop(1, '#4a340b');
    ctx.fillStyle = pinGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.strokeStyle = '#261b07';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Central rivet / Horse key (الفرس)
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#1c150e';
    ctx.fill();
    ctx.restore();
  }
}

window.AndalusianAstrolabeEngine = AndalusianAstrolabeEngine;
