
import { VisualizerMode, LyricsStyle } from '../../types';

export const ko = {
  common: {
    on: '켜짐',
    off: '꺼짐',
    visible: '표시',
    hidden: '숨김',
    active: '활성',
    muted: '음소거',
    beta: '베타'
  },
  tabs: {
    visual: '시각 효과',
    text: '텍스트',
    audio: '오디오',
    ai: 'AI 인식',
    system: '시스템'
  },
  hints: {
    mode: '시각 효과를 생성하기 위한 핵심 수학적 엔진을 선택합니다.',
    theme: '엄선된 색상 팔레트를 장면에 적용합니다.',
    speed: '시간 흐름 배율. 낮은 값은 최면적이고, 높은 값은 에너지가 넘칩니다.',
    glow: '후처리 블룸 효과 활성화. 성능 향상을 위해 비활성화하세요.',
    trails: '픽셀 잔상 제어. 높은 값은 유체나 페인트 같은 움직임을 만듭니다.',
    sensitivity: '오디오 게인 제어. 높은 값은 미세한 소리에도 폭발적인 반응을 보입니다.',
    smoothing: '시간적 감쇠. 높은 값은 액체 같은 움직임, 낮은 값은 날카로운 반응을 보입니다.',
    fftSize: '스펙트럼 해상도. 4096은 정밀한 디테일을 제공하지만 CPU를 더 많이 사용합니다.',
    lyrics: 'AI 기반 노래 식별 및 가사 가져오기 기능을 토글합니다.',
    lyricsStyle: '사용자 정의 가사의 시각적 표현 방식을 사용자 정의합니다.',
    region: 'AI 검색 엔진이 특정 시장의 음악에 중점을 두도록 설정합니다.',
    autoRotate: '다양한 시각 엔진을 자동으로 순환합니다.',
    rotateInterval: '다음 시각 엔진으로 전환하기 전까지의 시간(초)입니다.',
    cycleColors: '시간에 따라 색상 테마를 자동으로 부드럽게 전환합니다.',
    colorInterval: '다음 색상 팔레트로 부드럽게 혼합되기 전까지의 시간(초)입니다.',
    reset: '모든 애플리케이션 설정을 공장 초기값으로 복원합니다.',
    resetVisual: '시각적 요소(속도, 광선, 잔상)만 기본값으로 재설정합니다.',
    randomize: '시각 모드와 색상의 뜻밖의 조합을 생성합니다.',
    fullscreen: '몰입형 전체 화면 모드를 토글합니다.',
    help: '키보드 단축키 및 문서를 확인합니다.',
    mic: '마이크 입력을 활성화하거나 음소거합니다.',
    device: '하드웨어 오디오 입력 소스를 선택합니다.',
    monitor: '오디오 입력을 스피커로 출력합니다 (주의: 하울링 발생 가능). ',
    wakeLock: '비주얼라이저가 활성화된 동안 화면이 꺼지거나 어두워지는 것을 방지합니다.'
  },
  visualizerMode: '비주얼라이저 모드',
  styleTheme: '비주얼 테마',
  settings: '고급 설정',
  sensitivity: '반응 감도',
  speed: '애니메이션 속도',
  glow: '네온 효과',
  trails: '모션 잔상',
  autoRotate: '모드 자동 순환',
  rotateInterval: '간격 (초)',
  cycleColors: '색상 자동 순환',
  colorInterval: '간격 (초)',
  monitorAudio: '오디오 모니터링',
  audioInput: '입력 장치',
  lyrics: '가사',
  showLyrics: 'AI 인식 활성화',
  displaySettings: '표시 설정',
  language: '언어',
  region: '타겟 시장',
  startMic: '오디오 켜기',
  stopMic: '오디오 끄기',
  listening: '작동 중',
  identifying: 'AI 분석 중...',
  startExperience: '경험 시작하기',
  welcomeTitle: 'Aura Vision',
  welcomeText: '오디오를 제너레이티브 아트로 변환합니다. 실시간 음악 식별과 몰입형 시각화를 경험하세요.',
  hideOptions: '접기',
  showOptions: '옵션 펼치기',
  reset: '시스템 초기화',
  resetVisual: '시각 효과 초기화',
  resetText: '텍스트 초기화',
  resetAudio: '오디오 초기화',
  resetAi: 'AI 초기화',
  randomize: '스마트 랜덤',
  help: '지원',
  close: '닫기',
  betaDisclaimer: 'AI 인식 기능은 현재 베타 버전입니다.',
  wrongSong: '노래가 틀린가요?',
  hideCursor: '커서 숨기기',
  customColor: '사용자 지정',
  randomizeTooltip: '모든 시각 설정 무작위화',
  smoothing: '부드러움',
  fftSize: '해상도 (FFT)',
  appInfo: '앱 정보',
  appDescription: '실시간 스펙트럼 분석 및 Gemini AI 인식을 기반으로 한 몰입형 시각화 제품군.',
  version: '빌드',
  defaultMic: '기본 마이크',
  customText: '사용자 지정 텍스트',
  textProperties: '타이포그래피 및 레이아웃',
  customTextPlaceholder: '텍스트 입력',
  showText: '오버레이 표시',
  pulseBeat: '비트 반응',
  textSize: '글꼴 크기',
  textRotation: '회전',
  textFont: '글꼴',
  textOpacity: '투명도',
  quality: '화질',
  qualities: {
    low: '낮음',
    med: '중간',
    high: '높음'
  },
  recognitionSource: 'AI 제공자',
  lyricsPosition: '가사 위치',
  simulatedDemo: '시뮬레이션 (데모)',
  positions: {
      top: '상단',
      center: '중앙',
      bottom: '하단'
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
    accessDenied: '접근이 거부되었습니다. 마이크 권한을 확인해주세요.',
    noDevice: '오디오 입력 장치를 찾을 수 없습니다.',
    deviceBusy: '오디오 장치가 사용 중이거나 유효하지 않습니다.',
    general: '오디오 장치에 접근할 수 없습니다.'
  },
  aiState: {
    active: '인식 활성화됨',
    enable: '인식 활성화'
  },
  regions: {
    global: '글로벌',
    US: '미국 / 서구권',
    CN: '중국',
    JP: '일본',
    KR: '한국',
    EU: '유럽',
    LATAM: '남미'
  },
  modes: {
    [VisualizerMode.PLASMA]: '플라즈마 흐름',
    [VisualizerMode.BARS]: '주파수 바',
    [VisualizerMode.PARTICLES]: '별들의 들판',
    [VisualizerMode.TUNNEL]: '기하학적 터널',
    [VisualizerMode.SHAPES]: '추상적 도형',
    [VisualizerMode.RINGS]: '네온 링',
    [VisualizerMode.NEBULA]: '깊은 성운',
    [VisualizerMode.KALEIDOSCOPE]: '만화경',
    [VisualizerMode.LASERS]: '콘서트 레이저',
    [VisualizerMode.SILK]: '실크 웨이브',
    [VisualizerMode.LIQUID]: '액체 구체',
    [VisualizerMode.TERRAIN]: '로우 폴리 지형'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: '표준',
    [LyricsStyle.KARAOKE]: '노래방',
    [LyricsStyle.MINIMAL]: '미니멀'
  },
  helpModal: {
    title: 'Aura Vision 가이드',
    intro: 'Aura Vision는 고급 스펙트럼 분석을 사용하여 마이크 입력을 반응성 높은 제너레이티브 디지털 아트로 변환합니다.',
    shortcutsTitle: '키보드 단축키',
    shortcutItems: {
      toggleMic: '오디오 입력 토글',
      fullscreen: '전체 화면',
      randomize: '무작위 스타일',
      lyrics: 'AI 정보 토글',
      hideUi: '제어판 토글',
      glow: '네온 효과 토글',
      trails: '잔상 효과 토글',
      changeMode: '모드 변경',
      changeTheme: '테마 변경'
    },
    howItWorksTitle: '시작하기',
    howItWorksSteps: [
      '1. 분석을 시작하려면 마이크 접근을 허용하세요.',
      '2. 센서 근처에서 고음질 오디오를 재생하세요.',
      '3. 시각 효과가 특정 주파수에 실시간으로 반응합니다.',
      '4. 30초마다 AI가 오디오를 캡처하여 메타데이터를 식별합니다.'
    ],
    settingsTitle: '매개변수 가이드',
    settingsDesc: {
      sensitivity: '오디오 반응 요소에 대한 게인 제어.',
      speed: '생성 패턴의 시간적 빈도.',
      glow: '후처리 블룸 강도.',
      trails: '유동적인 움직임을 위한 시간적 축적.',
      smoothing: '주파수 데이터의 시간적 댐핑.',
      fftSize: '스펙트럼 해상도를 위한 서브 밴드 수.'
    },
    projectInfoTitle: '핵심 엔진',
    projectInfoText: 'Google Gemini 3 Flash, React 19 및 하드웨어 가속 WebGL로 구동됩니다.',
    privacyTitle: '개인정보 보호정책',
    privacyText: '오디오는 로컬에서 분석됩니다. 임시 고주파 스냅샷은 식별 목적으로만 Gemini로 전송됩니다.',
    version: '릴리스'
  },
  onboarding: {
    welcome: 'Aura Vision에 오신 것을 환영합니다',
    subtitle: '차세대 AI 음악 시각화 엔진',
    selectLanguage: '언어 선택',
    next: '다음',
    skip: '건너뛰기',
    finish: '시작하기',
    features: {
      title: '핵심 기능',
      visuals: {
        title: '몰입형 비주얼',
        desc: 'Three.js 기반의 8가지 이상의 WebGL 물리 렌더링 엔진.'
      },
      ai: {
        title: 'Gemini AI 지능',
        desc: 'Google Gemini 3로 구동되는 실시간 노래 식별 및 무드 감지.'
      },
      privacy: {
        title: '개인정보 보호 최우선',
        desc: '로컬 스펙트럼 분석. 오디오 데이터는 서버에 저장되지 않습니다.'
      }
    },
    shortcuts: {
      title: '빠른 제어',
      desc: '다음 키로 경험을 마스터하세요.'
    }
  }
};
