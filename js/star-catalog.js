/**
 * Star Catalog & Constellation Cartography
 * Real Astronomical Coordinates, Ancient Arabic Star Etymology & Navigation Guidelines
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

const StarCatalog = {
  // Major Stars in Classical Arabic & Modern Astronomy
  stars: [
    { id: 'polaris', nameAr: 'الجدي (نجم الشمال)', nameEn: 'Polaris', bayer: 'α UMi', ra: 37.95, dec: 89.26, mag: 1.98, color: '#f8f9fa', guide: 'مفتاح الملاحة: يحدد جهة الشمال الجغرافي مباشرة وارتفاعه عن الأفق يساوي خط عرض موقعك.' },
    { id: 'sirius', nameAr: 'الشعرى اليمانية', nameEn: 'Sirius', bayer: 'α CMa', ra: 101.29, dec: -16.72, mag: -1.46, color: '#e0f2fe', guide: 'ألمع نجم في سماء الأرض قاطبة، استدل به العرب والمصريون القدماء لمواسم النيل ومطالع الفصول.' },
    { id: 'canopus', nameAr: 'سهيل اليماني', nameEn: 'Canopus', bayer: 'α Car', ra: 95.99, dec: -52.70, mag: -0.74, color: '#fffbeb', guide: 'بشير انكسار حدة حر الصيف في الجزيرة العربية، والنجم الجنوبي الأشهر للملاحة البحرية.' },
    { id: 'arcturus', nameAr: 'السماك الرامح', nameEn: 'Arcturus', bayer: 'α Boo', ra: 213.92, dec: 19.18, mag: -0.05, color: '#fef08a', guide: 'عملاق أحمر لامع، يتبع قوس ذيل الدب الأكبر ("Arc to Arcturus") للاستدلال السريع.' },
    { id: 'vega', nameAr: 'النسر الواقع', nameEn: 'Vega', bayer: 'α Lyr', ra: 279.23, dec: 38.78, mag: 0.03, color: '#dbeafe', guide: 'رأس مثلث الصيف الملاحي الشهير، مرجع قياس مقادير لمعان النجوم (القدر الصفري).' },
    { id: 'capella', nameAr: 'العيوق', nameEn: 'Capella', bayer: 'α Aur', ra: 79.17, dec: 45.99, mag: 0.08, color: '#fef9c3', guide: 'نجم أصفر مشرق يلازم الثريا، سماه العرب "العيوق" لأنه يعوق الدبران عن إدراك الثريا.' },
    { id: 'rigel', nameAr: 'رجل الجوزاء', nameEn: 'Rigel', bayer: 'β Ori', ra: 78.63, dec: -8.20, mag: 0.13, color: '#bfdbfe', guide: 'عملاق أزرق فائق يزين قدم كوكبة الجبار الجنوبية، شديد السطوع والأهمية الملاحية.' },
    { id: 'procyon', nameAr: 'الشعرى الشامية', nameEn: 'Procyon', bayer: 'α CMi', ra: 114.83, dec: 5.22, mag: 0.38, color: '#fef3c7', guide: 'تطلع قبل الشعرى اليمانية، وأحد رؤوس مثلث الشتاء الفلكي العظيم.' },
    { id: 'betelgeuse', nameAr: 'إبط الجوزاء (يد الجوزاء)', nameEn: 'Betelgeuse', bayer: 'α Ori', ra: 88.79, dec: 7.41, mag: 0.50, color: '#fca5a5', guide: 'عملاق أحمر هائل يمثل كتف الجبار الشرقي، لونه القرمزي الدافئ يميزه في سماء الشتاء.' },
    { id: 'altair', nameAr: 'النسر الطائر', nameEn: 'Altair', bayer: 'α Aql', ra: 297.70, dec: 8.87, mag: 0.77, color: '#f1f5f9', guide: 'نجم سريع الدوران حول نفسه، يمثل الرأس الجنوبي لمثلث الصيف مع النسر الواقع وذنب الدجاجة.' },
    { id: 'aldebaran', nameAr: 'الدبران', nameEn: 'Aldebaran', bayer: 'α Tau', ra: 68.98, dec: 16.51, mag: 0.86, color: '#fed7aa', guide: 'عين الثور الحمراء المتوقدة، سمي "الدبران" لأنه يدبر (يتبع) عنقود الثريا في مداره بالسماء.' },
    { id: 'spica', nameAr: 'السماك الأعزل', nameEn: 'Spica', bayer: 'α Vir', ra: 201.30, dec: -11.16, mag: 0.98, color: '#bfdbfe', guide: 'سنبلة العذراء، سمي "الأعزل" عند العرب لأنه لا يحمل رمحاً كالسماك الرامح المقابل له.' },
    { id: 'antares', nameAr: 'قلب العقرب', nameEn: 'Antares', bayer: 'α Sco', ra: 247.35, dec: -26.43, mag: 1.06, color: '#f87171', guide: 'أحمر ناري متوهج، يتوسط كوكبة العقرب وينافس كوكب المريخ في حمرته (Anti-Ares).' },
    { id: 'deneb', nameAr: 'ذنب الدجاجة', nameEn: 'Deneb', bayer: 'α Cyg', ra: 310.36, dec: 45.28, mag: 1.25, color: '#e0f2fe', guide: 'ذنب طائر الدجاجة السابح في درب التبانة، أبعد نجوم مثلث الصيف عنا وأعظمها طاقة.' },
    { id: 'fomalhaut', nameAr: 'فم الحوت', nameEn: 'Fomalhaut', bayer: 'α PsA', ra: 344.41, dec: -29.62, mag: 1.16, color: '#e2e8f0', guide: 'ألمع نجوم الخريف الجنوبية، استدل به الملاحون في المحيط الهندي وبحر العرب.' },
    { id: 'regulus', nameAr: 'قلب الأسد (الملكي)', nameEn: 'Regulus', bayer: 'α Leo', ra: 152.09, dec: 11.97, mag: 1.36, color: '#dbeafe', guide: 'النجم الملكي التاريخي، يقع شبه متطابق مع خط فلك البروج الشمسي (مسار الشمس).' },
    
    // Ursa Major & Minor Stars (Pointers to Polaris)
    { id: 'dubhe', nameAr: 'الدب / ظهر الدب الأكبر', nameEn: 'Dubhe', bayer: 'α UMa', ra: 165.93, dec: 61.75, mag: 1.79, color: '#fef08a', guide: 'أحد دليلي الشمال: مد خطاً مستقيماً من المراق إلى الدب يصل مباشرة إلى نجم الجدي.' },
    { id: 'merak', nameAr: 'المراق', nameEn: 'Merak', bayer: 'β UMa', ra: 165.46, dec: 56.38, mag: 2.37, color: '#f8f9fa', guide: 'الدليل الثاني مع الدب في توجيه التائه في الصحراء والبحار نحو الشمال القطبي.' },
    { id: 'phecda', nameAr: 'الفخذ', nameEn: 'Phecda', bayer: 'γ UMa', ra: 178.46, dec: 53.69, mag: 2.44, color: '#f8f9fa' },
    { id: 'megrez', nameAr: 'المغرز', nameEn: 'Megrez', bayer: 'δ UMa', ra: 183.86, dec: 57.03, mag: 3.31, color: '#f8f9fa' },
    { id: 'alioth', nameAr: 'الجون (الإلية)', nameEn: 'Alioth', bayer: 'ε UMa', ra: 193.51, dec: 55.96, mag: 1.76, color: '#f8f9fa' },
    { id: 'mizar', nameAr: 'المئزر', nameEn: 'Mizar', bayer: 'ζ UMa', ra: 200.98, dec: 54.92, mag: 2.23, color: '#f8f9fa', guide: 'النجم المزدوج الشهير مع "السها" (Alcor)، كان العرب يمتحنون به حدة بصر الرماة والمحاربين.' },
    { id: 'alkaid', nameAr: 'القائد (بنات نعش)', nameEn: 'Alkaid', bayer: 'η UMa', ra: 206.89, dec: 49.31, mag: 1.85, color: '#dbeafe' },

    // Cassiopeia
    { id: 'schedar', nameAr: 'الصدر', nameEn: 'Schedar', bayer: 'α Cas', ra: 10.13, dec: 56.54, mag: 2.24, color: '#fed7aa' },
    { id: 'caph', nameAr: 'الكف الخضيب', nameEn: 'Caph', bayer: 'β Cas', ra: 2.29, dec: 59.15, mag: 2.28, color: '#fef08a' }
  ],

  // Constellation Linkages (Star IDs paired for drawing constellation lines)
  constellations: [
    {
      id: 'ursa_major',
      nameAr: 'بنات نعش الكبرى (الدب الأكبر)',
      nameEn: 'Ursa Major',
      arabicFolk: 'النعش وبناته الثلاث، أعظم دليل لملاحي الصحراء والبحار لتحديد القطب الشمالي.',
      lines: [
        ['dubhe', 'merak'],
        ['merak', 'phecda'],
        ['phecda', 'megrez'],
        ['megrez', 'dubhe'],
        ['megrez', 'alioth'],
        ['alioth', 'mizar'],
        ['mizar', 'alkaid']
      ]
    },
    {
      id: 'orion',
      nameAr: 'الجوزاء (الصياد / الجبار)',
      nameEn: 'Orion',
      arabicFolk: 'سيدة سماء الشتاء وتاجها؛ نطاق الجوزاء المكون من ثلاثة كواكب درية يتوسط كبد السماء.',
      lines: [
        ['betelgeuse', 'bellatrix'],
        ['betelgeuse', 'alnitak'],
        ['rigel', 'saiph'],
        ['rigel', 'mintaka']
      ]
    },
    {
      id: 'summer_triangle',
      nameAr: 'مثلث الصيف الملاحي (النسران والدجاجة)',
      nameEn: 'Summer Triangle',
      arabicFolk: 'النسر الواقع، النسر الطائر، وذنب الدجاجة؛ أعظم دليل ملاحي لسماء ليالي الصيف والخريف.',
      lines: [
        ['vega', 'altair'],
        ['altair', 'deneb'],
        ['deneb', 'vega']
      ]
    }
  ],

  /**
   * Find a star by its ID
   */
  getStar(id) {
    return this.stars.find(s => s.id === id);
  }
};

window.StarCatalog = StarCatalog;
