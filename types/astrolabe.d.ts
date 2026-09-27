// TypeScript definitions for Royal Andalusian Astrolabe

export interface StarPoint {
  id: string;
  nameAr: string;
  nameEn: string;
  bayer: string;
  ra: number;
  dec: number;
  mag: number;
  color: string;
  guide?: string;
}

export interface ConstellationDef {
  id: string;
  nameAr: string;
  nameEn: string;
  arabicFolk: string;
  lines: [string, string][];
}

export interface AstrolabePlate {
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
  tz: number;
}

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}
