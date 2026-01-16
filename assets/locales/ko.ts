import { VisualizerMode, LyricsStyle } from '../../core/types';

export const ko = {
  common: {
    on: 'ON',
    off: 'OFF',
    visible: '표시',
    hidden: '숨김',
    active: '활성화',
    muted: '음소거',
    beta: 'BETA'
  },
  tabs: {
    visual: '시각 효과',
    text: '텍스트',
    audio: '오디오',
    ai: '트랙 인식',
    system: '시스템'
  },
  hints: {
    mode: '시각 효과 생성을 위한 핵심 수리 렌더링 엔진을 선택합니다.',
    theme: '장면에 최적화된 컬러 팔레트를 적용합니다.',
    speed: '시간의 흐름 배율입니다. 낮은 값은 최면적이고 높은 값은 역동적입니다.',
    glow: '포스트 프로세싱 글로우 효과입니다. 성능을 높이려면 비활성화하세요.',
    trails: '픽셀 잔상 강도입니다. 높은 값은 유체와 같은 부드러운 움직임을 만듭니다.',
    sensitivity: '오디오 게인 제어입니다. 높은 값은 미세한 소리에도 폭발적인 반응을 유도합니다.',
    smoothing: '시계열 댐핑 계수입니다. 높은 값은 액체처럼 부드럽게, 낮은 값은 날카롭게 반응합니다.',
    fftSize: '주파수 분석 해상도입니다. 4096은 정밀한 디테일을 제공하나 CPU 부하가 증가합니다.',
    lyrics: 'AI 기반 트랙 식별 및 가사 표시 기능을 토글합니다.',
    lyricsStyle: '식별된 정보 및 가사의 레이아웃 스타일을 변경합니다.',
    region: 'AI 검색 엔진의 가중치를 특정 지역의 음악 시장에 맞게 최적화합니다.',
    autoRotate: '다양한 시각 효과 엔진을 일정 시간마다 자동으로 순환시킵니다.',
    rotateInterval: '다음 엔진으로 전환되기 전까지의 대기 시간(초)입니다.',
    cycleColors: '시간 경과에 따라 컬러 테마를 자동으로 부드럽게 전환합니다.',
    colorInterval: '다음 컬러 팔레트로 블렌딩되는 시간(초)입니다.',
    reset: '모든 설정, 언어 및 오디오 옵션을 공장 초기 상태로 되돌립니다.',
    confirmReset: '초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    resetVisual: '시각적 매개변수(속도, 광채, 잔상)만 초기화합니다.',
    randomize: '시각 모드와 색상의 독창적인 조합을 무작위로 생성합니다.',
    fullscreen: '몰입형 전체 화면 모드로 전환합니다.',
    help: '단축키 가이드 및 프로젝트 문서를 확인합니다.',
    mic: '마이크 입력을 활성화하거나 음소거합니다.',
    device: '사용할 하드웨어 오디오 입력 장치를 선택합니다.',
    monitor: '입력 신호를 스피커로 출력합니다(피드백 하울링에 주의하세요).',
    wakeLock: '시각화가 활성화된 동안 화면 절전 모드를 방지합니다.',
    showFps: '화면 상단에 실시간 프레임 레이트(FPS)를 표시합니다.',
    showTooltips: '컨트롤 위에 마우스를 올리면 도움말 힌트를 표시합니다.',
    doubleClickFullscreen: '화면 아무 곳이나 더블 클릭하여 전체 화면을 토글합니다.',
    autoHideUi: '조작이 없을 때 제어 패널을 자동으로 숨깁니다.',
    mirrorDisplay: '화면을 좌우 반전시킵니다(후면 투사나 웹캠 모드에 유용).'
  },
  visualizerMode: '시각화 모드',
  styleTheme: '비주얼 테마',
  settings: '고급 설정',
  sensitivity: '반응 감도',
  speed: '진화 속도',
  glow: '네온 글로우',
  trails: '모션 잔상',
  autoRotate: '엔진 자동 순환',
  rotateInterval: '간격 (초)',
  cycleColors: '컬러 자동 순환',
  colorInterval: '간격 (초)',
  cycleSpeed: '사이클 주기 (초)',
  monitorAudio: '오디오 모니터',
  audioInput: '입력 장치 선택',
  lyrics: 'AI 트랙 인식',
  showLyrics: '자동 인식 활성화',
  displaySettings: '표시 설정',
  language: '표시 언어',
  region: '타겟 시장',
  startMic: '오디오 캡처 시작',
  stopMic: '오디오 캡처 중지',
  listening: '감지 중',
  identifying: 'AI가 트랙 분석 중...',
  startExperience: '시각 체험 시작',
  welcomeTitle: 'Aura Vision | 빛의 선율',
  welcomeText: '선율을 오로라로, 리듬을 예술로 승화시키세요. Gemini AI 기반 실시간 인식을 통해 궁극의 공감각적 여정을 경험하세요.',
  unsupportedTitle: '지원되지 않는 브라우저',
  unsupportedText: 'Aura Vision은 최신 Web Audio 기능이 필요합니다. 최신 버전의 Chrome, Edge 또는 Safari를 사용해 주세요.',
  hideOptions: '패널 접기',
  showOptions: '옵션 표시',
  reset: '시스템 전체 초기화',
  resetVisual: '미학 설정 초기화',
  resetText: '텍스트 설정 초기화',
  resetAudio: '오디오 설정 초기화',
  resetAi: 'AI 설정 초기화',
  randomize: '스마트 무작위 조합',
  help: '도움말 및 가이드',
  close: '닫기',
  betaDisclaimer: 'AI 인식은 베타 기능이며 지속적으로 최적화 중입니다.',
  wrongSong: '인식이 잘못되었나요? 재시도',
  hideCursor: '마우스 커서 숨김',
  customColor: '텍스트 색상',
  randomizeTooltip: '모든 시각 설정 무작위화 (R)',
  smoothing: '동적 평활도',
  fftSize: '주파수 해상도 (FFT)',
  appInfo: '앱 정보',
  appDescription: '실시간 스펙트럼 분석과 Gemini AI 인식을 결합한 몰입형 음악 시각화 도구.',
  version: '빌드',
  defaultMic: '시스템 기본 마이크',
  customText: '사용자 정의 텍스트',
  textProperties: '타이포그래피 및 레이아웃',
  customTextPlaceholder: '텍스트 입력',
  showText: '오버레이 표시',
  pulseBeat: '비트에 맞춰 고동',
  textSize: '폰트 크기',
  textRotation: '회전 각도',
  textFont: '폰트 스타일',
  textOpacity: '불투명도',
  textPosition: '표시 위치',
  quality: '렌더링 품질',
  qualities: {
    low: '낮음',
    med: '중간',
    high: '높음'
  },
  visualPanel: {
    effects: '효과',
    automation: '자동화',
    display: '화면'
  },
  audioPanel: {
    info: '감도와 평활도를 조절하여 시각화의 반응성을 최적화하세요. 높은 FFT 해상도는 정밀한 디테일을 제공하지만 CPU 사용량이 증가합니다.'
  },
  systemPanel: {
    interface: '인터페이스',
    behavior: '시스템 동작',
    maintenance: '유지 관리'
  },
  showFps: 'FPS 표시',
  showTooltips: '툴팁 표시',
  doubleClickFullscreen: '더블 클릭 전체 화면',
  autoHideUi: 'UI 자동 숨김',
  mirrorDisplay: '화면 미러링',
  presets: {
    title: '스마트 프리셋',
    hint: '전문가가 튜닝한 시각적 조합을 한 번의 클릭으로 적용합니다.',
    select: '무드 선택...',
    calm: '최면 및 평온',
    party: '역동적인 파티',
    ambient: '앰비언트 포커스',
    cyberpunk: '사이버펑크',
    retrowave: '레트로 웨이브',
    vocal: '보컬 강조'
  },
  recognitionSource: 'AI 프로바이더',
  lyricsPosition: '가사 위치',
  lyricsFont: '폰트 스타일',
  lyricsFontSize: '폰트 크기',
  simulatedDemo: '데모 모드 (Simulated)',
  positions: {
      top: '상단',
      center: '중앙',
      bottom: '하단',
      tl: '왼쪽 상단',
      tc: '중앙 상단',
      tr: '오른쪽 상단',
      ml: '왼쪽 중앙',
      mc: '정중앙',
      mr: '오른쪽 중앙',
      bl: '왼쪽 하단',
      bc: '중앙 하단',
      br: '오른쪽 하단'
  },
  wakeLock: '화면 꺼짐 방지',
  system: {
    shortcuts: {
      mic: '마이크',
      ui: 'UI',
      mode: '모드',
      random: '랜덤'
    }
  },
  errors: {
    title: '오디오 오류',
    accessDenied: '마이크 접근이 거부되었습니다. 브라우저 권한 설정을 확인하세요.',
    noDevice: '입력 장치를 찾을 수 없습니다.',
    deviceBusy: '장치가 사용 중이거나 유효하지 않습니다.',
    general: '오디오 장치에 접근할 수 없습니다.',
    tryDemo: '데모 모드 시도 (오디오 없음)'
  },
  aiState: {
    active: '인식 기능 활성화됨',
    enable: 'AI 인식 시작'
  },
  regions: {
    global: '글로벌',
    US: '북미 / 서구권',
    CN: '중국',
    JP: '일본',
    KR: '대한민국',
    EU: '유럽',
    LATAM: '남미'
  },
  modes: {
    [VisualizerMode.PLASMA]: '플라즈마 플로우',
    [VisualizerMode.BARS]: '스펙트럼 분석기',
    [VisualizerMode.PARTICLES]: '성간 항해',
    [VisualizerMode.TUNNEL]: '기하학적 터널',
    [VisualizerMode.RINGS]: '공명 네온 링',
    [VisualizerMode.NEBULA]: '심우주 성운',
    [VisualizerMode.LASERS]: '레이저 매트릭스',
    [VisualizerMode.FLUID_CURVES]: '오로라의 춤',
    [VisualizerMode.MACRO_BUBBLES]: '마이크로 버블 (DoF)',
    [VisualizerMode.SILK]: '유광 실크 (WebGL)',
    [VisualizerMode.LIQUID]: '유체 행성 (WebGL)',
    [VisualizerMode.TERRAIN]: '폴리곤 산맥 (WebGL)'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: '표준 레이아웃',
    [LyricsStyle.KARAOKE]: '동적 반응',
    [LyricsStyle.MINIMAL]: '미니멀리즘'
  },
  helpModal: {
    title: 'Aura Vision 가이드',
    tabs: {
        guide: '가이드',
        shortcuts: '단축키',
        about: '정보'
    },
    intro: 'Aura Vision은 고정밀 오디오 샘플링을 기반으로 소리를 실시간 수리적 디지털 아트로 변환하는 공감각 도구입니다.',
    shortcutsTitle: '키보드 상호작용',
    shortcutItems: {
      toggleMic: '오디오 입력 전환',
      fullscreen: '전체 화면 전환',
      randomize: '미학 요소 랜덤화',
      lyrics: 'AI 트랙 정보 전환',
      hideUi: '제어 패널 표시/숨김',
      glow: '글로우 효과 전환',
      trails: '잔상 효과 전환',
      changeMode: '모드 순환',
      changeTheme: '테마 순환'
    },
    howItWorksTitle: '사용 방법',
    howItWorksSteps: [
      '1. 권한 허용: "시작"을 클릭하고 마이크 접근을 승인하세요.',
      '2. 음악 재생: 장치 근처에서 소리가 들리면 시각 효과가 실시간으로 반응합니다.',
      '3. 모드 탐색: 설정 패널(H)을 열어 12종 이상의 엔진을 시도해보세요.',
      '4. AI 인식: L키를 눌러 현재 곡의 메타데이터와 분위기를 분석합니다.'
    ],
    settingsTitle: '주요 매개변수 가이드',
    settingsDesc: {
      sensitivity: '음향 신호에 대한 반응 강도를 조절합니다.',
      speed: '생성 알고리즘의 시간적 진화 속도를 제어합니다.',
      glow: '공간감을 더해주는 포스트 프로세싱 광채 강도입니다.',
      trails: '픽셀의 화면 잔류 시간을 제어하여 부드러운 움직임을 만듭니다.',
      smoothing: '오디오 데이터의 평활화 계수입니다. 높을수록 부드러워집니다.',
      fftSize: '주파수 분석의 정밀도(샘플 수)를 결정합니다.'
    },
    projectInfoTitle: '프로젝트 소개',
    aboutDescription: '차세대 공감각적 상호작용 체험. Aura Vision은 고정밀 실시간 스펙트럼 분석과 Google Gemini 3 AI를 융합하여 무형의 음파를 살아있는 빛으로 변환합니다. VJ, 스트리밍, 공간 연출에 최적화되어 있습니다.',
    privacyTitle: '개인정보 및 보안',
    privacyText: '오디오 분석은 로컬에서만 수행됩니다. 인식 시에만 암호화된 특징점을 임시 전송하며, 실제 녹음 데이터는 저장되지 않습니다.',
    version: '릴리스'
  },
  onboarding: {
    welcome: 'Aura Vision에 오신 것을 환영합니다',
    subtitle: '차세대 AI 음악 공감각 엔진',
    selectLanguage: '언어를 선택해 주세요',
    next: '계속하기',
    back: '이전',
    skip: '건너뛰기',
    finish: '앱 시작',
    features: {
      title: '핵심 기능',
      visuals: {
        title: '제너레이티브 아트',
        desc: 'WebGL 기반의 12종 이상의 수리 엔진이 음파를 형상화합니다.'
      },
      ai: {
        title: 'Gemini AI 인텔리전스',
        desc: 'Google Gemini 3를 통해 트랙 메타데이터와 시각적 무드를 실시간 인식합니다.'
      },
      privacy: {
        title: '안전 및 프라이버시',
        desc: '분석은 로컬에서 이루어집니다. 개인의 오디오 데이터를 기록하거나 저장하지 않습니다.'
      }
    },
    shortcuts: {
      title: '다이내믹 컨트롤',
      desc: '단축키를 통해 빛의 지휘자가 되어보세요.'
    }
  }
};