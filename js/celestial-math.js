/**
 * Celestial Mathematics & Astrolabe Projection Library
 * Accurate Spherical Trigonometry, Coordinate Projections, and Astronomical Calculations
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

const CelestialMath = {
  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,

  // Mecca Coordinates (Kaaba)
  MECCA_LAT: 21.422487,
  MECCA_LNG: 39.826206,

  /**
   * Convert Gregorian Date to Julian Day Number
   */
  getJulianDay(date) {
    const time = date.getTime();
    return (time / 86400000) + 2440587.5;
  },

  /**
   * Calculate Greenwich Mean Sidereal Time (GMST) in degrees
   */
  getGMST(jd) {
    const d = jd - 2451545.0;
    let gmst = 280.46061837 + 360.98564736629 * d;
    gmst = ((gmst % 360) + 360) % 360;
    return gmst;
  },

  /**
   * Calculate Local Sidereal Time (LST) in degrees
   */
  getLST(date, longitude) {
    const jd = this.getJulianDay(date);
    const gmst = this.getGMST(jd);
    let lst = gmst + longitude;
    return ((lst % 360) + 360) % 360;
  },

  /**
   * Calculate Sun's Apparent Coordinates (RA and Dec) for a given Julian Day
   */
  getSunCoordinates(jd) {
    const d = jd - 2451545.0;
    // Mean anomaly of the Sun
    const g = (357.529 + 0.98560028 * d) * this.DEG2RAD;
    // Mean longitude of the Sun
    const q = 280.459 + 0.98564736 * d;
    // Ecliptic longitude of the Sun
    const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * this.DEG2RAD;
    
    // Obliquity of the Ecliptic (ميل فلك البروج)
    const e = (23.439 - 0.00000036 * d) * this.DEG2RAD;

    // Right Ascension (RA) and Declination (Dec)
    const sinL = Math.sin(L);
    const cosL = Math.cos(L);
    const sinE = Math.sin(e);
    const cosE = Math.cos(e);

    const ra = Math.atan2(cosE * sinL, cosL) * this.RAD2DEG;
    const dec = Math.asin(sinE * sinL) * this.RAD2DEG;

    return {
      ra: ((ra % 360) + 360) % 360,
      dec: dec,
      eclipticLongitude: ((L * this.RAD2DEG) % 360 + 360) % 360
    };
  },

  /**
   * Convert Equatorial Coordinates (RA, Dec) to Horizontal (Alt, Az)
   */
  equatorialToHorizontal(ra, dec, lat, lst) {
    const H = (lst - ra) * this.DEG2RAD; // Hour angle
    const phi = lat * this.DEG2RAD;
    const delta = dec * this.DEG2RAD;

    const sinAlt = Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H);
    const alt = Math.asin(sinAlt);

    const cosAz = (Math.sin(delta) - Math.sin(phi) * Math.sin(alt)) / (Math.cos(phi) * Math.cos(alt));
    let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));

    if (Math.sin(H) > 0) {
      az = 2 * Math.PI - az;
    }

    return {
      altitude: alt * this.RAD2DEG,
      azimuth: (az * this.RAD2DEG + 180) % 360 // Measured from North
    };
  },

  /**
   * Stereographic Projection of a celestial point onto the Astrolabe plane
   * Projecting from South Celestial Pole to the Equator plane
   */
  projectStereographic(ra, dec, plateRadius) {
    // Equator radius on plate = R0
    // r = R0 * tan((90 - dec) / 2)
    const r = plateRadius * Math.tan((90 - dec) * 0.5 * this.DEG2RAD);
    const theta = (ra - 90) * this.DEG2RAD;

    return {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta),
      radius: r
    };
  },

  /**
   * Calculate Accurate Qibla Direction (سمت القبلة) from any latitude & longitude
   */
  calculateQibla(lat, lng) {
    const phi1 = lat * this.DEG2RAD;
    const phi2 = this.MECCA_LAT * this.DEG2RAD;
    const deltaLambda = (this.MECCA_LNG - lng) * this.DEG2RAD;

    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
    let qibla = Math.atan2(y, x) * this.RAD2DEG;
    return ((qibla % 360) + 360) % 360;
  },

  /**
   * Calculate Islamic Prayer Times based on Solar Altitude
   */
  calculatePrayerTimes(date, lat, lng, timezoneOffsetHours) {
    const jd = this.getJulianDay(date);
    const sun = this.getSunCoordinates(jd);
    const delta = sun.dec * this.DEG2RAD;
    const phi = lat * this.DEG2RAD;

    // Solar noon (Dhuhr)
    const noonLST = sun.ra;
    const gmstAtNoon = (noonLST - lng + 360) % 360;
    const dhuhrDecimalHours = 12.0 + (gmstAtNoon - 180) / 15.0 + (timezoneOffsetHours || 0);

    // Hour angle helper for a given altitude
    const getHourAngle = (altDeg) => {
      const h = altDeg * this.DEG2RAD;
      const cosH = (Math.sin(h) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));
      if (cosH > 1 || cosH < -1) return null; // Sun never reaches this altitude (polar day/night)
      return Math.acos(cosH) * this.RAD2DEG / 15.0; // hours
    };

    // Sunrise & Sunset: alt = -0.833 degrees
    const hSunrise = getHourAngle(-0.833) || 6.0;
    // Fajr: alt = -18 degrees (Umm al-Qura standard)
    const hFajr = getHourAngle(-18.0) || 7.2;
    // Isha: alt = -18 degrees or 90 mins after Maghrib
    const hIsha = getHourAngle(-18.0) || 7.2;

    // Asr: Shafi'i method: shadow = noon shadow + 1
    const noonAlt = (90 - Math.abs(lat - sun.dec)) * this.DEG2RAD;
    const noonShadow = 1 / Math.tan(noonAlt);
    const asrAlt = Math.atan(1 / (noonShadow + 1)) * this.RAD2DEG;
    const hAsr = getHourAngle(asrAlt) || 3.0;

    const toTimeString = (decimalHours) => {
      let h = Math.floor(decimalHours);
      let m = Math.floor((decimalHours - h) * 60);
      h = ((h % 24) + 24) % 24;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return {
      fajr: toTimeString(dhuhrDecimalHours - hFajr),
      sunrise: toTimeString(dhuhrDecimalHours - hSunrise),
      dhuhr: toTimeString(dhuhrDecimalHours),
      asr: toTimeString(dhuhrDecimalHours + hAsr),
      maghrib: toTimeString(dhuhrDecimalHours + hSunrise),
      isha: toTimeString(dhuhrDecimalHours + hIsha)
    };
  },

  /**
   * Shadow Square calculation (مربع الظل) for the back of the astrolabe
   * Umbra Recta (horizontal shadow, cotangent) & Umbra Versa (vertical shadow, tangent)
   */
  calculateShadow(altitudeDeg) {
    if (altitudeDeg <= 0) return { umbraRecta: 999, umbraVersa: 0 };
    if (altitudeDeg >= 90) return { umbraRecta: 0, umbraVersa: 999 };
    const rad = altitudeDeg * this.DEG2RAD;
    const cot = 1 / Math.tan(rad);
    const tan = Math.tan(rad);

    return {
      // Scaled to 12 digits (الأصابع الاثني عشر)
      umbraRecta: Math.min(12, Math.round(cot * 12 * 10) / 10),
      umbraVersa: Math.min(12, Math.round(tan * 12 * 10) / 10)
    };
  }
};

window.CelestialMath = CelestialMath;
