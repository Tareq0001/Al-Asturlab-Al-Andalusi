/**
 * Main Application Orchestrator for Al-Asturlab Al-Andalusi
 * Coordinates Astrolabe Canvas, Sky Observatory, Academy Lessons, and Blueprint Exporters
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Engines
  let astrolabe = null;
  let observatory = null;
  let academy = null;
  let exporter = null;

  try {
    astrolabe = new window.AndalusianAstrolabeEngine('astrolabe-master-canvas');
    window.astrolabeApp = astrolabe;
  } catch (err) {
    console.error('Astrolabe Engine Init Error:', err);
  }

  try {
    observatory = new window.SkyObservatory('sky-dome-canvas');
    window.skyApp = observatory;
  } catch (err) {
    console.error('Sky Observatory Init Error:', err);
  }

  try {
    academy = new window.NavigationAcademy();
  } catch (err) {
    console.error('Academy Init Error:', err);
  }

  try {
    exporter = new window.BlueprintExporter();
  } catch (err) {
    console.error('Exporter Init Error:', err);
  }

  // 2. Navigation Tab Switching
  const navTabs = document.querySelectorAll('.nav-pillar-tab');
  const sections = document.querySelectorAll('.pillar-section');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      if (window.AudioSynthesizer) {
        window.AudioSynthesizer.playParchmentFlip();
      }

      // Redraw canvases on tab change
      if (targetId === 'section-simulator' && astrolabe) {
        setTimeout(() => {
          astrolabe.resize();
          astrolabe.render();
        }, 50);
      }
      if (targetId === 'section-observatory' && observatory) {
        setTimeout(() => {
          observatory.resize();
          observatory.render();
        }, 50);
      }
    });
  });

  // 3. Face Toggle Button (وجه / ظهر الأسطرلاب)
  const btnToggleFace = document.getElementById('btn-toggle-face');
  if (btnToggleFace && astrolabe) {
    btnToggleFace.addEventListener('click', () => {
      astrolabe.toggleFace();
      const isFront = astrolabe.currentFace === 'front';
      btnToggleFace.innerHTML = isFront 
        ? '<span>🔄</span> <span>اقلب إلى ظهر الأسطرلاب (العضادة ومربع الظل)</span>' 
        : '<span>🔄</span> <span>اقلب إلى وجه الأسطرلاب (المقنطرات والشبكة)</span>';
      
      const faceBadge = document.getElementById('current-face-badge');
      if (faceBadge) {
        faceBadge.textContent = isFront ? 'الوجه: أم الأسطرلاب والشبكة' : 'الظهر: العضادة ومربع الظل والتقويم';
      }
    });
  }

  // 4. City / Plate Selector
  const citySelect = document.getElementById('city-plate-select');
  if (citySelect && astrolabe) {
    citySelect.addEventListener('change', (e) => {
      astrolabe.setCity(e.target.value);
      if (window.AudioSynthesizer) window.AudioSynthesizer.playClick();
    });
  }

  // 5. Star Quick Select Buttons in Observatory
  const starBtns = document.querySelectorAll('.btn-quick-star');
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      starBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const starId = btn.getAttribute('data-star');
      if (observatory) {
        observatory.selectStar(starId);
      }
    });
  });

  // 6. Listen to Astrolabe Updates
  window.addEventListener('astrolabeUpdate', (e) => {
    const d = e.detail;

    // Update Telemetry Displays
    const elAlt = document.getElementById('readout-altitude');
    const elZodiac = document.getElementById('readout-zodiac');
    const elQibla = document.getElementById('readout-qibla');
    const elShadow = document.getElementById('readout-shadow');
    const elFajr = document.getElementById('time-fajr');
    const elDhuhr = document.getElementById('time-dhuhr');
    const elAsr = document.getElementById('time-asr');
    const elMaghrib = document.getElementById('time-maghrib');
    const elIsha = document.getElementById('time-isha');

    if (elAlt) elAlt.textContent = `${d.alidadeAltitude}°`;
    if (elZodiac) elZodiac.textContent = d.zodiacSign;
    if (elQibla) elQibla.textContent = `${d.qiblaDirection}° شمالاً`;
    if (elShadow) elShadow.textContent = `${d.shadowDigits} أصابع`;

    if (d.prayerTimes) {
      if (elFajr) elFajr.textContent = d.prayerTimes.fajr;
      if (elDhuhr) elDhuhr.textContent = d.prayerTimes.dhuhr;
      if (elAsr) elAsr.textContent = d.prayerTimes.asr;
      if (elMaghrib) elMaghrib.textContent = d.prayerTimes.maghrib;
      if (elIsha) elIsha.textContent = d.prayerTimes.isha;
    }
  });

  // Initial trigger
  if (astrolabe) astrolabe.notifyUpdate();

  // 7. Audio Toggle Button
  const btnAudio = document.getElementById('btn-sound-toggle');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      const isMuted = !window.AudioSynthesizer.toggle();
      btnAudio.textContent = isMuted ? '🔇 الصوت: صامت' : '🔊 الصوت: يعمل';
      btnAudio.style.borderColor = isMuted ? 'var(--gold-shadow)' : 'var(--gold-bright)';
    });
  }

  // 8. Bilingual Language Switcher
  const btnLang = document.getElementById('btn-master-lang');
  let isArabic = true;

  if (btnLang) {
    btnLang.addEventListener('click', () => {
      isArabic = !isArabic;
      document.body.style.direction = isArabic ? 'rtl' : 'ltr';
      btnLang.textContent = isArabic ? 'English Edition' : 'النسخة العربية الملكية';
      applyLanguage(isArabic ? 'ar' : 'en');
      if (window.AudioSynthesizer) window.AudioSynthesizer.playParchmentFlip();
    });
  }

  function applyLanguage(lang) {
    const elHeroSub = document.querySelector('.hero-subtitle');
    const elHeroTitle = document.querySelector('.hero-title');
    const elHeroDesc = document.querySelector('.hero-description');

    if (lang === 'en') {
      if (elHeroSub) elHeroSub.textContent = 'Imperial Andalusian Astrolabe • 11th Century Celestial Computer';
      if (elHeroTitle) elHeroTitle.textContent = 'Al-Asturlab Al-Andalusi';
      if (elHeroDesc) elHeroDesc.textContent = 'The crowning achievement of medieval science: an analog celestial computer capturing the 3D cosmos onto a flat gilded plate through stereographic projection.';
    } else {
      if (elHeroSub) elHeroSub.textContent = 'الأسطرلاب الفلكي الأندلسي الملكي • حاسوب الكون التناظري الخالد';
      if (elHeroTitle) elHeroTitle.textContent = 'الأسطرلاب الأندلسي الملكي';
      if (elHeroDesc) elHeroDesc.textContent = 'أعظم تحفة علمية في تاريخ البشرية: كيف اختزل علماء طليطلة وقرطبة قبة الفضاء اللانهائية في صفيحة برونزية مسطحة تحسب مواقع النجوم ومواقيت الصلاة وسمت القبلة بدقة متناهية.';
    }
  }
});
