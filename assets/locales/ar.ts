import { VisualizerMode, LyricsStyle } from '../../core/types';

export const ar = {
  common: {
    on: 'تشغيل',
    off: 'إيقاف',
    visible: 'مرئي',
    hidden: 'مخفي',
    active: 'نشط',
    muted: 'مكتوم',
    beta: 'بيتا'
  },
  tabs: {
    visual: 'بصري',
    text: 'نص',
    audio: 'صوت',
    ai: 'تمييز المسار',
    system: 'نظام'
  },
  hints: {
    mode: 'اختر المحرك الرياضي الأساسي لتوليد المؤثرات البصرية.',
    theme: 'تطبيق لوحة ألوان منسقة على المشهد.',
    speed: 'مضاعف مقياس الوقت. القيم المنخفضة منومة؛ العالية نشطة.',
    glow: 'تمكين توهج المعالجة اللاحقة. قم بالتعطيل لتحسين الأداء.',
    trails: 'التحكم في استمرار البكسل. القيم العالية تخلق حركة انسيابية.',
    sensitivity: 'التحكم في كسب الصوت. القيم العالية تخلق ردود فعل قوية.',
    smoothing: 'التخميد الزمني. القيم العالية تعطي حركة سائلة.',
    fftSize: 'الدقة الطيفية. 4096 يوفر تفاصيل دقيقة ولكنه يستهلك المزيد من المعالج.',
    lyrics: 'تبديل التعرف على الأغاني وجلب الكلمات بواسطة الذكاء الاصطناعي.',
    lyricsStyle: 'تخصيص العرض المرئي للكلمات المتزامنة.',
    region: 'توجيه محرك بحث الذكاء الاصطناعي نحو الموسيقى في هذا السوق المحدد.',
    autoRotate: 'التنقل تلقائيًا عبر محركات بصرية مختلفة.',
    rotateInterval: 'الوقت بالثواني قبل التبديل إلى المحرك التالي.',
    cycleColors: 'الانتقال تلقائيًا وسلاسة بين سمات الألوان.',
    colorInterval: 'الوقت بالثواني قبل الانتقال للوحة الألوان التالية.',
    reset: 'استعادة جميع إعدادات التطبيق إلى وضع المصنع.',
    confirmReset: 'تأكيد إعادة التعيين؟ لا يمكن التراجع عن هذا الإجراء.',
    resetVisual: 'إعادة تعيين الجماليات فقط (السرعة، التوهج، الآثار).',
    randomize: 'توليد مزيج عشوائي من الأوضاع والألوان.',
    fullscreen: 'تبديل وضع ملء الشاشة الغامر.',
    help: 'عرض اختصارات لوحة المفاتيح والوثائق.',
    mic: 'تنشيط أو كتم إدخال الميكروفون.',
    device: 'اختر مصدر إدخال الصوت من الجهاز.',
    monitor: 'توجيه الصوت إلى مكبرات الصوت (تحذير: قد يحدث صدى).',
    wakeLock: 'منع الشاشة من الانطفاء أثناء نشاط المصور.',
    showFps: 'عرض عداد الإطارات في الثانية في الوقت الفعلي.',
    showTooltips: 'عرض تلميحات مفيدة عند تحويم الماوس فوق عناصر التحكم.',
    doubleClickFullscreen: 'تبديل ملء الشاشة بالنقر المزدوج في أي مكان.',
    autoHideUi: 'إخفاء لوحة التحكم تلقائيًا عند عدم الاستخدام.',
    mirrorDisplay: 'عكس العرض أفقيًا (مفيد للكاميرا الأمامية أو العروض الخلفية).'
  },
  visualizerMode: 'وضع المصور',
  styleTheme: 'السمة البصرية',
  settings: 'متقدم',
  sensitivity: 'حساسية الاستجابة',
  speed: 'سرعة التطور',
  glow: 'توهج نيون',
  trails: 'آثار الحركة',
  autoRotate: 'دورة الأنماط',
  rotateInterval: 'الفاصل (ث)',
  cycleColors: 'دورة الألوان',
  colorInterval: 'الفاصل (ث)',
  cycleSpeed: 'مدة الدورة (ث)',
  monitorAudio: 'المراقبة',
  audioInput: 'جهاز الإدخال',
  lyrics: 'تمييز المسار',
  showLyrics: 'تمكين التمييز التلقائي',
  displaySettings: 'إعدادات العرض',
  language: 'لغة النظام',
  region: 'السوق المستهدف',
  startMic: 'بدء الالتقاط',
  stopMic: 'إيقاف الالتقاط',
  listening: 'جار الاستماع',
  identifying: 'الذكاء الاصطناعي يحلل المسار...',
  startExperience: 'بدء التجربة',
  welcomeTitle: 'Aura Vision | صوت الضوء',
  welcomeText: 'حول كل اهتزاز إلى تحفة فنية توليدية. مدعوم بذكاء Gemini للتعرف الفوري – اختبر الرحلة الحسية القصوى.',
  unsupportedTitle: 'المتصفح غير مدعوم',
  unsupportedText: 'يتطلب Aura Vision ميزات Web Audio حديثة. يرجى استخدام أحدث إصدار من Chrome أو Safari.',
  hideOptions: 'طي اللوحة',
  showOptions: 'عرض الخيارات',
  reset: 'إعادة تعيين النظام',
  resetVisual: 'إعادة تعيين الجماليات',
  resetText: 'إعادة تعيين النص',
  resetAudio: 'إعادة تعيين الصوت',
  resetAi: 'إعادة تعيين الذكاء الاصطناعي',
  randomize: 'عشوائي ذكي',
  help: 'المساعدة والدليل',
  close: 'إغلاق',
  betaDisclaimer: 'ميزة تمييز المسار في مرحلة تجريبية.',
  wrongSong: 'أغنية خاطئة؟ أعد المحاولة',
  hideCursor: 'إخفاء المؤشر',
  customColor: 'لون النص',
  randomizeTooltip: 'عشوائية جميع الإعدادات (R)',
  smoothing: 'التنعيم',
  fftSize: 'الدقة (FFT)',
  appInfo: 'عن التطبيق',
  appDescription: 'مجموعة تصور غامرة تعتمد على تحليل الطيف وذكاء Gemini.',
  version: 'الإصدار',
  defaultMic: 'الميكروفون الافتراضي',
  customText: 'نص مخصص',
  textProperties: 'الطباعة والتخطيط',
  customTextPlaceholder: 'أدخل النص',
  showText: 'إظهار التراكب',
  pulseBeat: 'نبض مع الإيقاع',
  textSize: 'حجم الخط',
  textRotation: 'الدوران',
  textFont: 'نوع الخط',
  textOpacity: 'الشفافية',
  textPosition: 'الموضع',
  quality: 'جودة الرندرة',
  qualities: {
    low: 'منخفضة',
    med: 'متوسطة',
    high: 'عالية'
  },
  visualPanel: {
    effects: 'تأثيرات',
    automation: 'أتمتة',
    display: 'عرض'
  },
  audioPanel: {
    info: 'اضبط الحساسية والتنعيم لتخصيص تفاعل المصور مع الصوت. الدقة العالية توفر تفاصيل أكثر لكنها تزيد الحمل على المعالج.'
  },
  systemPanel: {
    interface: 'الواجهة',
    behavior: 'السلوك',
    maintenance: 'الصيانة'
  },
  showFps: 'عرض FPS',
  showTooltips: 'عرض التلميحات',
  doubleClickFullscreen: 'ملء الشاشة بالنقر المزدوج',
  autoHideUi: 'إخفاء الواجهة تلقائياً',
  mirrorDisplay: 'عكس العرض',
  presets: {
    title: 'إعدادات مسبقة ذكية',
    hint: 'تطبيق مزيج جمالي منسق بنقرة واحدة.',
    select: 'اختر مزاجاً...',
    calm: 'منوم وهادئ',
    party: 'حفلة نشطة',
    ambient: 'تركيز محيطي',
    cyberpunk: 'فورة سايبربانك',
    retrowave: 'غروب ريترو',
    vocal: 'تركيز صوتي'
  },
  recognitionSource: 'مزود الذكاء الاصطناعي',
  lyricsPosition: 'الموضع',
  lyricsFont: 'الخط',
  lyricsFontSize: 'الحجم',
  simulatedDemo: 'محاكاة (عرض)',
  positions: {
      top: 'أعلى',
      center: 'وسط',
      bottom: 'أسفل',
      tl: 'أعلى يسار',
      tc: 'أعلى وسط',
      tr: 'أعلى يمين',
      ml: 'وسط يسار',
      mc: 'مركز',
      mr: 'وسط يمين',
      bl: 'أسفل يسار',
      bc: 'أسفل وسط',
      br: 'أسفل يمين'
  },
  wakeLock: 'البقاء مستيقظاً',
  system: {
    shortcuts: {
      mic: 'ميكروفون',
      ui: 'واجهة',
      mode: 'وضع',
      random: 'عشوائي'
    }
  },
  errors: {
    title: 'خطأ صوتي',
    accessDenied: 'تم رفض الوصول. يرجى التحقق من أذونات الميكروفون.',
    noDevice: 'لم يتم العثور على جهاز.',
    deviceBusy: 'الجهاز مشغول أو غير صالح.',
    general: 'تعذر الوصول إلى الصوت.',
    tryDemo: 'تجربة وضع العرض (بدون صوت)'
  },
  aiState: {
    active: 'التمييز نشط',
    enable: 'بدء التمييز بالذكاء الاصطناعي'
  },
  regions: {
    global: 'عالمي',
    US: 'أمريكا / الغرب',
    CN: 'الصين',
    JP: 'اليابان',
    KR: 'كوريا',
    EU: 'أوروبا',
    LATAM: 'أمريكا اللاتينية'
  },
  modes: {
    [VisualizerMode.PLASMA]: 'تدفق البلازما',
    [VisualizerMode.BARS]: 'أشرطة التردد',
    [VisualizerMode.PARTICLES]: 'الملاحة بين النجوم',
    [VisualizerMode.TUNNEL]: 'النفق الهندسي',
    [VisualizerMode.RINGS]: 'حلقات النيون',
    [VisualizerMode.NEBULA]: 'سديم عميق',
    [VisualizerMode.LASERS]: 'مصفوفة الليزر',
    [VisualizerMode.FLUID_CURVES]: 'رقصة الشفق',
    [VisualizerMode.MACRO_BUBBLES]: 'فقاعات ماكرو (DoF)',
    [VisualizerMode.SILK]: 'الحرير العائم (WebGL)',
    [VisualizerMode.LIQUID]: 'الكوكب السائل (WebGL)',
    [VisualizerMode.TERRAIN]: 'التضاريس المضلعة (WebGL)'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: 'تنسيق قياسي',
    [LyricsStyle.KARAOKE]: 'تفاعل ديناميكي',
    [LyricsStyle.MINIMAL]: 'بسيط جداً'
  },
  helpModal: {
    title: 'دليل Aura Vision',
    tabs: {
        guide: 'دليل',
        shortcuts: 'اختصارات',
        about: 'حول'
    },
    intro: 'Aura Vision هو أداة للحس المرافق تحول الصوت إلى فن رقمي رياضي في الوقت الفعلي باستخدام تحليل طيفي عالي الدقة.',
    shortcutsTitle: 'التحكم بلوحة المفاتيح',
    shortcutItems: {
      toggleMic: 'تشغيل/إيقاف الصوت',
      fullscreen: 'تبديل ملء الشاشة',
      randomize: 'عشوائية الجماليات',
      lyrics: 'تبديل معلومات المسار',
      hideUi: 'إظهار/إخفاء اللوحة',
      glow: 'تبديل تأثير التوهج',
      trails: 'تبديل تأثير الآثار',
      changeMode: 'تغيير النمط',
      changeTheme: 'تغيير السمة'
    },
    howItWorksTitle: 'كيفية الاستخدام',
    howItWorksSteps: [
      '1. السماح بالأذونات: انقر على "بدء" واسمح بالوصول إلى الميكروفون.',
      '2. تشغيل الموسيقى: سيبدأ المصور بالتفاعل مع الأصوات القريبة.',
      '3. استكشاف الأنماط: افتح لوحة الإعدادات (H) لتجربة 12+ محركاً.',
      '4. التمييز بالذكاء الاصطناعي: اضغط L لتحليل الأغنية والمزاج الحالي.'
    ],
    settingsTitle: 'دليل المعايير',
    settingsDesc: {
      sensitivity: 'التحكم في كسب رد الفعل للمؤثرات البصرية.',
      speed: 'سرعة التطور الزمني للخوارزميات التوليدية.',
      glow: 'شدة الإضاءة المحيطة لتعزيز الأجواء.',
      trails: 'تراكم البكسل لخلق حركة انسيابية.',
      smoothing: 'تنعيم بيانات التردد لتفادي القفزات المفاجئة.',
      fftSize: 'دقة التحليل الطيفي (عدد العينات).'
    },
    projectInfoTitle: 'حول المشروع',
    aboutDescription: 'تجربة تفاعلية من الجيل التالي. Aura Vision يدمج التحليل الطيفي مع Google Gemini 3 لتحويل الأمواج الصوتية الصامتة إلى ضوء حي. مثالي لمنسقي الأغاني والبث المباشر والديكور.',
    privacyTitle: 'الخصوصية والأمان',
    privacyText: 'التحليل الصوتي محلي بالكامل. يتم إرسال بصمات طيفية مشفرة فقط لتمييز الأغنية؛ لا يتم حفظ أي تسجيلات.',
    version: 'إصدار'
  },
  onboarding: {
    welcome: 'مرحباً بك في Aura Vision',
    subtitle: 'محرك الحس المرافق بالذكاء الاصطناعي',
    selectLanguage: 'يرجى اختيار اللغة',
    next: 'التالي',
    back: 'العودة',
    skip: 'تخطي',
    finish: 'بدء التجربة',
    features: {
      title: 'الميزات الرئيسية',
      visuals: {
        title: 'فنون توليدية',
        desc: '12+ محركاً رياضياً يعتمد على WebGL لتجسيد الصوت.'
      },
      ai: {
        title: 'ذكاء Gemini AI',
        desc: 'تحليل فوري للمسارات والمزاج عبر Google Gemini 3.'
      },
      privacy: {
        title: 'آمن وخاص',
        desc: 'المعالجة محلية. لا يتم تسجيل أو حفظ بياناتك الصوتية أبداً.'
      }
    },
    shortcuts: {
      title: 'تحكم ديناميكي',
      desc: 'كن مايسترو الضوء عبر لوحة المفاتيح.'
    }
  }
};