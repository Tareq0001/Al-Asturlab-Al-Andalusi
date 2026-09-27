/**
 * Astrolabe Engineering Blueprint & Museum Certificate Exporter
 * Generates technical CAD/Horological specifications and illuminated certificates for institutions
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

class BlueprintExporter {
  constructor() {
    this.btnExportBlueprint = document.getElementById('btn-export-blueprint');
    this.btnExportJSON = document.getElementById('btn-export-json');
    this.init();
  }

  init() {
    if (this.btnExportBlueprint) {
      this.btnExportBlueprint.addEventListener('click', () => {
        window.print();
      });
    }

    if (this.btnExportJSON) {
      this.btnExportJSON.addEventListener('click', () => {
        this.downloadTechnicalJSON();
      });
    }
  }

  downloadTechnicalJSON() {
    const specs = {
      instrument: 'Royal Andalusian Astrolabe (الأسطرلاب الأندلسي الملكي)',
      curator: 'أ. طارق ابوعشي (Tareq Abuashi)',
      dateOfCreation: 'Toledo / Cordoba Astronomical Edition (1067 - 2026)',
      dimensions: {
        materDiameterMm: 215.0,
        tympanDiameterMm: 192.5,
        thicknessMm: 6.2,
        material: 'High-Purity Gilded Brass (CuZn37 / Cuivre Jaune Royal)'
      },
      stereographicProjection: {
        projectionPole: 'South Celestial Pole (القطب السماوي الجنوبي)',
        eclipticObliquityDeg: 23.44,
        tropicOfCancerRadiusMm: 65.4,
        equatorRadiusMm: 96.25,
        tropicOfCapricornRadiusMm: 141.8
      },
      starsCatalog: window.StarCatalog.stars.map(s => ({
        id: s.id,
        nameArabic: s.nameAr,
        nameEnglish: s.nameEn,
        bayer: s.bayer,
        rightAscensionDeg: s.ra,
        declinationDeg: s.dec,
        magnitude: s.mag
      })),
      supportedPlates: Object.entries(window.astrolabeApp.plates).map(([k, v]) => ({
        key: k,
        cityArabic: v.nameAr,
        cityEnglish: v.nameEn,
        latitudeDeg: v.lat,
        longitudeDeg: v.lng
      }))
    };

    const blob = new Blob([JSON.stringify(specs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Andalusian_Astrolabe_Engineering_Blueprint.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.AudioSynthesizer) window.AudioSynthesizer.playClick();
  }
}

window.BlueprintExporter = BlueprintExporter;
