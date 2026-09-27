/**
 * Celestial Navigation Academy (أكاديمية الاستدلال الفلكي والأسطرلاب)
 * Step-by-Step Interactive Masterclasses on Classical Astronomy & Space Projection
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

class NavigationAcademy {
  constructor() {
    this.currentLesson = 0;
    this.lessons = [
      {
        id: 'stereographic',
        titleAr: 'كيف "يأتي" الأسطرلاب بالفضاء؟ سر الإسقاط المجسم',
        titleEn: 'How the Astrolabe Captures 3D Space (Stereographic Projection)',
        badge: 'الهندسة الكونية • Géométrie Céleste',
        text: `الأسطرلاب ليس مجرد آلة، بل هو <strong>أول حاسوب تناظري في تاريخ البشرية</strong> يختزل القبة السماوية ثلاثية الأبعاد اللانهائية في صفيحة برونزية مسطحة مليمترية. 
        <br><br>
        <strong>سر العبقرية الأندلسية:</strong> تُؤخذ نقطة إسقاط وهمية من القطب السماوي الجنوبي، وتمرر خطوط بصرية عبر كل نجم ودائرة ارتفاع (المقنطرات) في السماء لتتقاطع مع مستوي خط الاستواء. الميزة الرياضية المعجزة لهذا الإسقاط هي أن <em>جميع الدوائر في الفضاء تظل دوائر تامة على الصفيحة النحاسية</em> دون أي تشوه في الزوايا، مما يسمح بحساب حركة الكواكب والنجوم بالملليمتر!`,
        actionTip: 'جرّب تفعيل "شبكة الإسقاط المجسم" في القبة السماوية لتشاهد كيف تتحول كرات الفضاء إلى خطوط الأسطرلاب.'
      },
      {
        id: 'polaris',
        titleAr: 'الاستدلال بنجم الجدي (Polaris) لمعرفة خط العرض',
        titleEn: 'Determining Latitude via Polaris Sight',
        badge: 'الملاحة بالنجوم • Navigation Stellaire',
        text: `إذا تهت في الصحراء أو وسط المحيط ليلاً، فإن نجم الجدي (نجم الشمال) هو بوصلتك السماوية المطلقة.
        <br><br>
        <strong>القاعدة الذهبية لملاحي الأندلس:</strong>
        <em>«ارتفاع نجم الجدي عن الأفق بالدرجات = خط عرض مدينتك أو موقعك تماماً.»</em>
        <br>
        إذا رفعت الأسطرلاب رأسياً ونظرت عبر ثقبي العضادة نحو الجدي فوجدته عند 37.8°، فأنت تقف فوراً على خط عرض قرطبة أو إشبيلية! وإذا وجدته عند 21.4° فأنت في مكة المكرمة.`,
        actionTip: 'انتقل إلى شاشة "القبة السماوية" واضغط على نجم الجدي لمعرفة كيفية توجيه العضادة إليه.'
      },
      {
        id: 'time_finding',
        titleAr: 'كيف تستخرج الساعة اللحظية من النجوم؟',
        titleEn: 'Calculating Exact Night Hours from Stellar Altitudes',
        badge: 'حساب الزمن • Chronométrie Stellaire',
        text: `السماء ليلاً هي ساعة يد عملاقة تدور فيها عقارب النجوم:
        <br><br>
        1. <strong>الرصد:</strong> ارفع الأسطرلاب من حلقته العلوية، وأدر العضادة في الظهر حتى ترى نجماً لامعاً كـ <em>النسر الواقع (Vega)</em> عبر الثقبين، واقرأ ارتفاعه (مثلاً 45°).
        <br>
        2. <strong>المطابقة:</strong> اقلب الأسطرلاب إلى الوجه، وأدر "الشبكة" حتى تقع شظية النسر الواقع على مقنطرة الارتفاع (45°).
        <br>
        3. <strong>القراءة:</strong> انظر إلى موضع الشمس في فلك البروج لذلك اليوم؛ فتجد أنه يشير مباشرة إلى الساعة والدقيقة اللحظية على طوق الحجرة المحيط!`,
        actionTip: 'أدر شبكة الأسطرلاب ولاحظ كيف يتغير الزمن النجمي وساعات الليل تلقائياً.'
      },
      {
        id: 'qibla_survey',
        titleAr: 'تحديد سمت القبلة وقياس ارتفاع المباني بمربع الظل',
        titleEn: 'Qibla Azimuth & Shadow Square Surveying',
        badge: 'علم المسح والميقات • Topographie & Qibla',
        text: `في ظهر الأسطرلاب الأندلسي يوجد <strong>مربع الظل (Shadow Square)</strong> ودوائر السموت:
        <br><br>
        * <strong>سمت القبلة:</strong> بحساب حساب المثلثات الكروية، نُقشت على الأسطرلاب خطوط سمت مكة المكرمة لكل إقليم أندلسي ومغربي بدقة الزاوية.
        <br>
        * <strong>قياس ارتفاع الجبال والمآذن:</strong> من خلال النظر لقمة البرج عبر العضادة، يشير طرفها إلى رقم في "الظل المبسوط". اضرب هذا الرقم في المسافة بينك وبين البرج لتحصل على ارتفاعه الشاهق دون أن تخطو خطوة واحدة للأعلى!`,
        actionTip: 'انقر على زر "اقلب الأسطرلاب إلى الظهر" لاستكشاف مربع الظل والعضادة.'
      }
    ];

    this.init();
  }

  init() {
    this.renderLesson();
    const btnNext = document.getElementById('btn-next-lesson');
    const btnPrev = document.getElementById('btn-prev-lesson');

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.currentLesson = (this.currentLesson + 1) % this.lessons.length;
        this.renderLesson();
        if (window.AudioSynthesizer) window.AudioSynthesizer.playParchmentFlip();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        this.currentLesson = (this.currentLesson - 1 + this.lessons.length) % this.lessons.length;
        this.renderLesson();
        if (window.AudioSynthesizer) window.AudioSynthesizer.playParchmentFlip();
      });
    }
  }

  renderLesson() {
    const l = this.lessons[this.currentLesson];
    const elTitle = document.getElementById('lesson-title');
    const elBadge = document.getElementById('lesson-badge');
    const elText = document.getElementById('lesson-text');
    const elTip = document.getElementById('lesson-tip');
    const elCount = document.getElementById('lesson-counter');

    if (elTitle) elTitle.textContent = l.titleAr;
    if (elBadge) elBadge.textContent = l.badge;
    if (elText) elText.innerHTML = l.text;
    if (elTip) elTip.innerHTML = `💡 <strong>تطبيق عملي:</strong> ${l.actionTip}`;
    if (elCount) elCount.textContent = `الدرس ${this.currentLesson + 1} من ${this.lessons.length}`;
  }
}

window.NavigationAcademy = NavigationAcademy;
