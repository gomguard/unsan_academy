export type MarketDemand = 'Explosive' | 'High' | 'Stable' | 'Declining';

export type JobGroup =
  | 'Maintenance'      // A: 정비/메카닉
  | 'Body'             // B: 외장/복원
  | 'Film'             // C: 필름/튜닝
  | 'EV_Future'        // D: 전기차/미래
  | 'Management'       // E: 경영/서비스
  | 'Niche'            // F: 특수/니치
  | 'NextGen';         // G: 완전한 미래

export interface JobStats {
  T: number; // Tech (기술/지능)
  H: number; // Hand (손기술/숙련도)
  S: number; // Ops (운영/규정) - 원래 Speed였으나 SOP 준수 능력으로 변경
  A: number; // Art (예술/감각)
  B: number; // Biz (경영/영업)
}

export interface SalaryRange {
  min: number; // 만원 단위
  max: number;
}

export interface Job {
  id: string;
  title: string;
  group: JobGroup;
  salaryRange: SalaryRange;
  marketDemand: MarketDemand;
  requiredStats: JobStats;
  tags: string[];
  description: string;
  hiringCompanies?: string[];
  source?: string;
  prerequisiteJobs?: string[]; // Job IDs that are prerequisites
}

export const groupInfo: Record<JobGroup, { name: string; color: string; icon: string }> = {
  Maintenance: { name: '정비/메카닉', color: '#3b82f6', icon: '🔧' },
  Body: { name: '외장/복원', color: '#ec4899', icon: '🎨' },
  Film: { name: '필름/튜닝', color: '#f59e0b', icon: '🎬' },
  EV_Future: { name: '전기차/미래', color: '#8b5cf6', icon: '⚡' },
  Management: { name: '경영/서비스', color: '#6366f1', icon: '📊' },
  Niche: { name: '특수/니치', color: '#ef4444', icon: '🔬' },
  NextGen: { name: '미래직업', color: '#10b981', icon: '🚀' },
};

export const demandInfo: Record<MarketDemand, { label: string; color: string; icon: string }> = {
  Explosive: { label: '급상승', color: '#ef4444', icon: '🚀' },
  High: { label: '높음', color: '#f59e0b', icon: '📈' },
  Stable: { label: '안정', color: '#10b981', icon: '➡️' },
  Declining: { label: '하락', color: '#6b7280', icon: '📉' },
};

export const jobDatabase: Job[] = [
  // ========== Group A: Maintenance (정비/메카닉) - 17 jobs ==========
  {
    id: 'maint_01',
    title: '경정비 테크니션',
    group: 'Maintenance',
    salaryRange: { min: 2800, max: 3500 },
    marketDemand: 'Stable',
    requiredStats: { T: 30, H: 55, S: 40, A: 20, B: 30 },
    tags: ['입문추천', '빠른취업'],
    description: '엔진오일/패드/필터/배터리/블랙박스 등 단순 교환 및 장착',
  },
  {
    id: 'maint_02',
    title: '타이어 전문가',
    group: 'Maintenance',
    salaryRange: { min: 2800, max: 3800 },
    marketDemand: 'Stable',
    requiredStats: { T: 40, H: 60, S: 35, A: 20, B: 40 },
    tags: ['입문추천', '빠른취업'],
    description: '타이어 탈부착/밸런스/펑크 수리',
    prerequisiteJobs: ['maint_01'], // 경정비 -> 타이어
  },
  {
    id: 'maint_03',
    title: '휠 얼라인먼트 테크니션',
    group: 'Maintenance',
    salaryRange: { min: 3200, max: 4200 },
    marketDemand: 'Stable',
    requiredStats: { T: 60, H: 55, S: 40, A: 25, B: 25 },
    tags: ['기술집약'],
    description: '하체 기하학 수정 및 쏠림 교정',
    prerequisiteJobs: ['maint_02'], // 타이어 -> 얼라인먼트
  },
  {
    id: 'maint_04',
    title: '브레이크 튜너',
    group: 'Maintenance',
    salaryRange: { min: 3300, max: 4500 },
    marketDemand: 'Stable',
    requiredStats: { T: 50, H: 70, S: 45, A: 25, B: 25 },
    tags: ['안전필수'],
    description: '캘리퍼/디스크 확장 및 오일 라인 튜닝',
    prerequisiteJobs: ['maint_01'], // 경정비 -> 브레이크
  },
  {
    id: 'maint_05',
    title: '서스펜션 전문가',
    group: 'Maintenance',
    salaryRange: { min: 3500, max: 4800 },
    marketDemand: 'Stable',
    requiredStats: { T: 55, H: 70, S: 40, A: 35, B: 25 },
    tags: ['기술집약', '하체'],
    description: '쇼크업소버, 로워암 교환 및 하체 소음 잡기',
    prerequisiteJobs: ['maint_03'], // 얼라인먼트 -> 서스펜션
  },
  {
    id: 'maint_06',
    title: '에어컨/공조 전문가',
    group: 'Maintenance',
    salaryRange: { min: 3000, max: 4000 },
    marketDemand: 'Stable',
    requiredStats: { T: 65, H: 55, S: 45, A: 20, B: 30 },
    tags: ['계절수요'],
    description: '냉매 가스 주입, 에바 클리닝, 컴프레서 수리',
    prerequisiteJobs: ['maint_01'], // 경정비 -> 에어컨
  },
  {
    id: 'maint_07',
    title: '디젤 흡기/배기 클리닝 전문가',
    group: 'Maintenance',
    salaryRange: { min: 3200, max: 4200 },
    marketDemand: 'Declining',
    requiredStats: { T: 50, H: 60, S: 40, A: 20, B: 25 },
    tags: ['디젤', '내연기관'],
    description: '카본 퇴적물 제거',
    prerequisiteJobs: ['maint_01'], // 경정비 -> 디젤 클리닝
  },
  {
    id: 'maint_08',
    title: '디젤 스페셜리스트',
    group: 'Maintenance',
    salaryRange: { min: 4000, max: 5500 },
    marketDemand: 'Declining',
    requiredStats: { T: 75, H: 80, S: 45, A: 20, B: 25 },
    tags: ['고연봉', '기술집약', '디젤'],
    description: '인젝터/고압펌프 리빌드, 터보차저 수리',
    prerequisiteJobs: ['maint_07'], // 디젤 클리닝 -> 디젤 스페셜리스트
  },
  {
    id: 'maint_09',
    title: '변속기 전문가',
    group: 'Maintenance',
    salaryRange: { min: 4000, max: 5500 },
    marketDemand: 'Stable',
    requiredStats: { T: 75, H: 85, S: 40, A: 15, B: 20 },
    tags: ['고연봉', '희소가치'],
    description: '자동/수동 변속기 오버홀, 클러치 교환',
    prerequisiteJobs: ['maint_01'], // 경정비 -> 변속기
  },
  {
    id: 'maint_10',
    title: '엔진 오버홀 마스터',
    group: 'Maintenance',
    salaryRange: { min: 4500, max: 6000 },
    marketDemand: 'Stable',
    requiredStats: { T: 80, H: 85, S: 40, A: 20, B: 20 },
    tags: ['고연봉', '장인', '희소가치'],
    description: '엔진 헤드/블록 가공, 피스톤 교환, 타이밍 정렬',
    prerequisiteJobs: ['maint_09'], // 변속기 -> 엔진 오버홀
  },
  {
    id: 'maint_11',
    title: '자동차 검사원',
    group: 'Maintenance',
    salaryRange: { min: 3200, max: 4200 },
    marketDemand: 'Stable',
    requiredStats: { T: 55, H: 40, S: 75, A: 25, B: 40 },
    tags: ['자격증필수', '안정적'],
    description: '정기/종합 검사 수행 (국가 자격)',
    prerequisiteJobs: ['maint_01'], // 경정비 -> 검사원
  },
  {
    id: 'maint_12',
    title: '구조변경 승인 담당자',
    group: 'Maintenance',
    salaryRange: { min: 3500, max: 4800 },
    marketDemand: 'Stable',
    requiredStats: { T: 60, H: 30, S: 80, A: 25, B: 45 },
    tags: ['행정', '튜닝'],
    description: '튜닝카 합법화 서류 대행',
    prerequisiteJobs: ['maint_11'], // 검사원 -> 구조변경
  },
  {
    id: 'maint_13',
    title: 'LPG 개조/수리 기사',
    group: 'Maintenance',
    salaryRange: { min: 3500, max: 4500 },
    marketDemand: 'Declining',
    requiredStats: { T: 65, H: 60, S: 70, A: 20, B: 30 },
    tags: ['자격증필수', 'LPG'],
    description: '가스 봄베 관리 및 기화기 수리',
    prerequisiteJobs: ['maint_01'], // 경정비 -> LPG
  },
  {
    id: 'maint_14',
    title: '수입차 범용 진단가',
    group: 'Maintenance',
    salaryRange: { min: 4200, max: 6000 },
    marketDemand: 'High',
    requiredStats: { T: 80, H: 50, S: 50, A: 25, B: 40 },
    tags: ['고연봉', '프리미엄', '진단'],
    description: '벤츠/BMW 등 전용 진단기 운용',
    prerequisiteJobs: ['maint_06', 'maint_09'], // 에어컨 or 변속기 -> 진단가
  },
  {
    id: 'maint_15',
    title: 'ECU 맵퍼 (Tuner)',
    group: 'Maintenance',
    salaryRange: { min: 4500, max: 7000 },
    marketDemand: 'Stable',
    requiredStats: { T: 90, H: 40, S: 45, A: 30, B: 45 },
    tags: ['고연봉', '퍼포먼스', '전문성'],
    description: '출력 향상을 위한 데이터 매핑',
    prerequisiteJobs: ['maint_14'], // 진단가 -> ECU 맵퍼
  },
  {
    id: 'maint_16',
    title: '배기 튜너 (머플러)',
    group: 'Maintenance',
    salaryRange: { min: 3500, max: 5000 },
    marketDemand: 'Stable',
    requiredStats: { T: 50, H: 70, S: 40, A: 55, B: 35 },
    tags: ['사운드', '용접'],
    description: '커스텀 배기 라인 용접 및 사운드 튜닝',
    prerequisiteJobs: ['maint_01'], // 경정비 -> 배기 튜너
  },
  {
    id: 'maint_17',
    title: '하이브리드 전문가',
    group: 'Maintenance',
    salaryRange: { min: 4000, max: 5500 },
    marketDemand: 'High',
    requiredStats: { T: 75, H: 65, S: 55, A: 20, B: 30 },
    tags: ['미래유망', '고연봉'],
    description: '하이브리드 시스템 진단 및 배터리 관리',
    prerequisiteJobs: ['maint_14'], // 진단가 -> 하이브리드
  },

  // ========== Group B: Body & Restoration (외장/복원) - 12 jobs ==========
  {
    id: 'body_01',
    title: '디테일링 전문가',
    group: 'Body',
    salaryRange: { min: 3000, max: 6000 },
    marketDemand: 'High',
    requiredStats: { T: 45, H: 70, S: 45, A: 85, B: 45 },
    tags: ['예술성', '고부가가치'],
    description: '프리미엄 세차, 광택, 유리막/세라믹 코팅, 헤드라이트 복원',
  },
  {
    id: 'body_02',
    title: '덴트 기술자 (PDR)',
    group: 'Body',
    salaryRange: { min: 3500, max: 5500 },
    marketDemand: 'High',
    requiredStats: { T: 50, H: 85, S: 50, A: 60, B: 35 },
    tags: ['무도장', '기술집약'],
    description: '도색 없이 찌그러짐 펴기 (로드/글루)',
    prerequisiteJobs: ['body_04'], // 도장 -> 덴트 (고급 스킬)
  },
  {
    id: 'body_03',
    title: '판금 기술자',
    group: 'Body',
    salaryRange: { min: 3500, max: 5000 },
    marketDemand: 'Stable',
    requiredStats: { T: 50, H: 85, S: 45, A: 55, B: 25 },
    tags: ['기술집약', '장인'],
    description: '차체 프레임 교정 및 용접',
    prerequisiteJobs: ['body_06'], // 샌딩/마스킹 -> 판금
  },
  {
    id: 'body_04',
    title: '도장 기술자 (Painter)',
    group: 'Body',
    salaryRange: { min: 3500, max: 5200 },
    marketDemand: 'Stable',
    requiredStats: { T: 45, H: 75, S: 50, A: 80, B: 25 },
    tags: ['예술성', '장인'],
    description: '스프레이 건 운용 및 열처리',
    prerequisiteJobs: ['body_01'], // 디테일링 -> 도장
  },
  {
    id: 'body_05',
    title: '조색사 (Color Matcher)',
    group: 'Body',
    salaryRange: { min: 3800, max: 5500 },
    marketDemand: 'Stable',
    requiredStats: { T: 55, H: 50, S: 45, A: 90, B: 30 },
    tags: ['예술성', '희소가치'],
    description: '페인트 색상 배합 (미색 맞추기)',
    prerequisiteJobs: ['body_04'], // 도장 -> 조색사
  },
  {
    id: 'body_06',
    title: '샌딩/마스킹맨',
    group: 'Body',
    salaryRange: { min: 2500, max: 3200 },
    marketDemand: 'Stable',
    requiredStats: { T: 30, H: 60, S: 50, A: 40, B: 20 },
    tags: ['입문추천', '도장전처리'],
    description: '도장 전처리 작업자 (초급)',
  },
  {
    id: 'body_07',
    title: '자동차 유리 전문가',
    group: 'Body',
    salaryRange: { min: 3000, max: 4200 },
    marketDemand: 'Stable',
    requiredStats: { T: 45, H: 65, S: 50, A: 40, B: 40 },
    tags: ['틈새시장'],
    description: '돌빵 복원, 전면/측후면 유리 교환, 썬팅 연계',
    prerequisiteJobs: ['body_01'], // 디테일링 -> 유리
  },
  {
    id: 'body_08',
    title: '휠 복원/도색 전문가',
    group: 'Body',
    salaryRange: { min: 3500, max: 5000 },
    marketDemand: 'High',
    requiredStats: { T: 50, H: 75, S: 50, A: 70, B: 35 },
    tags: ['틈새시장', '기술집약'],
    description: '다이아컷팅, 휠 굴절 수리, 휠 도색',
    prerequisiteJobs: ['body_04'], // 도장 -> 휠 복원
  },
  {
    id: 'body_09',
    title: '실내 복원 전문가',
    group: 'Body',
    salaryRange: { min: 3200, max: 4500 },
    marketDemand: 'High',
    requiredStats: { T: 45, H: 65, S: 45, A: 75, B: 40 },
    tags: ['디테일링'],
    description: '가죽/직물 시트 복원, 플라스틱 대시보드/버튼 복원',
    prerequisiteJobs: ['body_01'], // 디테일링 -> 실내 복원
  },
  {
    id: 'body_10',
    title: '소프트탑(오픈카) 관리사',
    group: 'Body',
    salaryRange: { min: 3500, max: 4800 },
    marketDemand: 'Stable',
    requiredStats: { T: 55, H: 60, S: 50, A: 65, B: 40 },
    tags: ['틈새시장', '프리미엄'],
    description: '컨버터블 탑 발수 코팅 및 수리',
    prerequisiteJobs: ['body_09'], // 실내 복원 -> 소프트탑
  },
  {
    id: 'body_11',
    title: '올드카 리스토어 디렉터',
    group: 'Body',
    salaryRange: { min: 5000, max: 8000 },
    marketDemand: 'Stable',
    requiredStats: { T: 70, H: 60, S: 40, A: 80, B: 70 },
    tags: ['고연봉', '희소가치', '장인'],
    description: '클래식카 부품 직구 + 복원 총괄 기획',
    prerequisiteJobs: ['body_03', 'body_05'], // 판금 + 조색사 -> 올드카 디렉터
  },
  {
    id: 'body_12',
    title: '테슬라 공인 바디샵',
    group: 'Body',
    salaryRange: { min: 4000, max: 7000 },
    marketDemand: 'Explosive',
    requiredStats: { T: 70, H: 85, S: 55, A: 60, B: 40 },
    tags: ['테슬라', '고연봉', '공인인증', '알루미늄'],
    description: '알루미늄 바디 용접 및 특수 접합',
    hiringCompanies: ['천우모터스(기흥)', '1급 공업사(Tesla Approved)', '삼성화재 공업사'],
    source: 'Tesla 공식 바디샵 채용 공고 2025',
    prerequisiteJobs: ['body_03'],
  },

  // ========== Group C: Film & Styling (필름/튜닝) - 10 jobs ==========
  {
    id: 'film_01',
    title: '틴터 (썬팅 기술자)',
    group: 'Film',
    salaryRange: { min: 3200, max: 4500 },
    marketDemand: 'Stable',
    requiredStats: { T: 35, H: 75, S: 50, A: 65, B: 40 },
    tags: ['입문추천'],
    description: '윈도우 필름 열성형 및 부착',
    prerequisiteJobs: ['body_01'], // 디테일링 -> 틴터
  },
  {
    id: 'film_02',
    title: '랩핑 인스톨러 (Color)',
    group: 'Film',
    salaryRange: { min: 4000, max: 6500 },
    marketDemand: 'High',
    requiredStats: { T: 40, H: 85, S: 45, A: 80, B: 45 },
    tags: ['예술성', '트렌디', '고연봉'],
    description: '전체 랩핑, 부분 랩핑(크롬 죽이기)',
    prerequisiteJobs: ['film_01'], // 틴터 -> 랩핑
  },
  {
    id: 'film_03',
    title: 'PPF 인스톨러 (Protection)',
    group: 'Film',
    salaryRange: { min: 3500, max: 10000 },
    marketDemand: 'Explosive',
    requiredStats: { T: 45, H: 90, S: 50, A: 75, B: 50 },
    tags: ['급성장', '고연봉', '블루오션', '인센티브'],
    description: '도장 보호 필름 시공 (재단/핸드컷)',
    hiringCompanies: ['리코쉴드', '스타일매니아', 'J&J', 'XPEL Korea'],
    source: '현직자 커뮤니티/유튜브 (성과급제 기준)',
    prerequisiteJobs: ['film_01'],
  },
  {
    id: 'film_04',
    title: '데칼/스티커 디자이너',
    group: 'Film',
    salaryRange: { min: 3000, max: 4500 },
    marketDemand: 'Stable',
    requiredStats: { T: 45, H: 55, S: 40, A: 85, B: 50 },
    tags: ['디자인', '창의성'],
    description: '홍보용 차량 스티커 디자인 및 시공',
    prerequisiteJobs: ['film_01'], // 틴터 -> 데칼
  },
  {
    id: 'film_05',
    title: '실내 커스터마이징 전문가',
    group: 'Film',
    salaryRange: { min: 3500, max: 5000 },
    marketDemand: 'Stable',
    requiredStats: { T: 45, H: 70, S: 45, A: 80, B: 40 },
    tags: ['예술성', '커스텀'],
    description: '실내 랩핑, 천장 엠보싱, 트림 튜닝',
    prerequisiteJobs: ['film_02', 'body_09'], // 랩핑 or 실내복원 -> 실내 커스텀
  },
  {
    id: 'film_06',
    title: '엠비언트 라이트 시공자',
    group: 'Film',
    salaryRange: { min: 3200, max: 4500 },
    marketDemand: 'High',
    requiredStats: { T: 55, H: 65, S: 45, A: 70, B: 40 },
    tags: ['트렌디', 'LED'],
    description: '실내 무드등 LED 매립 및 배선',
    prerequisiteJobs: ['film_05'], // 실내 커스텀 -> 엠비언트
  },
  {
    id: 'film_07',
    title: '사운드 시스템 전문가',
    group: 'Film',
    salaryRange: { min: 3500, max: 5500 },
    marketDemand: 'Stable',
    requiredStats: { T: 65, H: 70, S: 45, A: 70, B: 45 },
    tags: ['카오디오', '취미연계'],
    description: '스피커/앰프/우퍼 설치 및 방음/방진 시공',
    prerequisiteJobs: ['film_06'], // 엠비언트 -> 사운드
  },
  {
    id: 'film_08',
    title: '레트로핏 튜너',
    group: 'Film',
    salaryRange: { min: 4000, max: 5500 },
    marketDemand: 'Stable',
    requiredStats: { T: 75, H: 70, S: 50, A: 45, B: 40 },
    tags: ['기술집약', '순정옵션'],
    description: '구형 차에 신형 순정 옵션 이식',
    prerequisiteJobs: ['film_07', 'maint_14'], // 사운드 + 진단가 -> 레트로핏
  },
  {
    id: 'film_09',
    title: '캠핑카 빌더',
    group: 'Film',
    salaryRange: { min: 4000, max: 6500 },
    marketDemand: 'High',
    requiredStats: { T: 65, H: 80, S: 50, A: 65, B: 50 },
    tags: ['캠핑', '라이프스타일', '성장'],
    description: '스타렉스/카니발 개조, 가구 제작, 전기 시스템 설치',
    prerequisiteJobs: ['film_05'], // 실내 커스텀 -> 캠핑카
  },
  {
    id: 'film_10',
    title: '트레일러/견인장치 장착사',
    group: 'Film',
    salaryRange: { min: 3500, max: 4500 },
    marketDemand: 'Stable',
    requiredStats: { T: 55, H: 70, S: 65, A: 30, B: 40 },
    tags: ['견인', '구조변경'],
    description: '견인 고리 장착 및 구조변경',
    prerequisiteJobs: ['maint_12'], // 구조변경 승인 -> 트레일러
  },

  // ========== Group D: Future & EV (전기차/미래) - 10 jobs ==========
  {
    id: 'ev_01',
    title: 'EV 고전압 배터리 진단사',
    group: 'EV_Future',
    salaryRange: { min: 4500, max: 8000 },
    marketDemand: 'Explosive',
    requiredStats: { T: 85, H: 55, S: 70, A: 20, B: 35 },
    tags: ['급성장', '고연봉', '블루오션', '미래필수'],
    description: '배터리 셀 밸런싱, SOH 정밀 진단',
    hiringCompanies: ['Tesla Korea', '현대 블루핸즈(EV전담)', '벤츠 한성자동차', '에코프로(폐배터리)'],
    source: '잡코리아 전기차 정비 통계 2024',
    prerequisiteJobs: ['maint_17'], // 하이브리드 전문가 -> EV 배터리
  },
  {
    id: 'ev_02',
    title: 'EV 모터/감속기 수리사',
    group: 'EV_Future',
    salaryRange: { min: 4200, max: 6000 },
    marketDemand: 'High',
    requiredStats: { T: 80, H: 75, S: 55, A: 20, B: 30 },
    tags: ['미래유망', '기술집약'],
    description: '전기차 구동계 오버홀',
    prerequisiteJobs: ['ev_01'], // EV 배터리 -> 모터 수리
  },
  {
    id: 'ev_03',
    title: 'ADAS 캘리브레이션 전문가',
    group: 'EV_Future',
    salaryRange: { min: 4500, max: 6500 },
    marketDemand: 'Explosive',
    requiredStats: { T: 85, H: 55, S: 70, A: 25, B: 35 },
    tags: ['급성장', '고연봉', '블루오션'],
    description: '레이더/카메라 센서 보정 (유리 교환 후)',
    prerequisiteJobs: ['maint_14', 'body_07'], // 진단가 + 유리 -> ADAS
  },
  {
    id: 'ev_04',
    title: '충전 인프라 유지보수 기사',
    group: 'EV_Future',
    salaryRange: { min: 4000, max: 6000 },
    marketDemand: 'Explosive',
    requiredStats: { T: 70, H: 65, S: 60, A: 20, B: 40 },
    tags: ['급성장', '인프라', '블루오션'],
    description: '급속/완속 충전기 수리 및 설치',
    prerequisiteJobs: ['ev_01'], // EV 배터리 -> 충전 인프라
  },
  {
    id: 'ev_05',
    title: '폐배터리 진단/평가사',
    group: 'EV_Future',
    salaryRange: { min: 4000, max: 6000 },
    marketDemand: 'Explosive',
    requiredStats: { T: 80, H: 50, S: 55, A: 20, B: 45 },
    tags: ['친환경', '순환경제', '블루오션'],
    description: '폐차된 EV 배터리의 재사용(ESS) 등급 판정',
    prerequisiteJobs: ['ev_01'], // EV 배터리 -> 폐배터리
  },
  {
    id: 'ev_06',
    title: '전기차 화재 안전 관리자',
    group: 'EV_Future',
    salaryRange: { min: 4000, max: 5500 },
    marketDemand: 'High',
    requiredStats: { T: 65, H: 50, S: 85, A: 20, B: 45 },
    tags: ['안전', '특수'],
    description: 'EV 전용 소화 장비 및 격리 구역 관리',
    prerequisiteJobs: ['ev_01'], // EV 배터리 -> 화재 안전
  },
  {
    id: 'ev_07',
    title: 'OTA 소프트웨어 매니저',
    group: 'EV_Future',
    salaryRange: { min: 4500, max: 6500 },
    marketDemand: 'High',
    requiredStats: { T: 90, H: 30, S: 55, A: 25, B: 45 },
    tags: ['소프트웨어', 'IT융합'],
    description: '차량 OS 업데이트 및 소프트웨어 오류 해결',
    prerequisiteJobs: ['maint_15'], // ECU 맵퍼 -> OTA
  },
  {
    id: 'ev_08',
    title: '전장 회로 수리사 (PCB)',
    group: 'EV_Future',
    salaryRange: { min: 4000, max: 5500 },
    marketDemand: 'High',
    requiredStats: { T: 85, H: 80, S: 50, A: 30, B: 25 },
    tags: ['기술집약', '전문성'],
    description: 'ECU 기판 납땜 및 칩셋 수리',
    prerequisiteJobs: ['maint_15'], // ECU 맵퍼 -> PCB 수리
  },
  {
    id: 'ev_09',
    title: '자율주행 센서 기술자',
    group: 'EV_Future',
    salaryRange: { min: 5000, max: 8000 },
    marketDemand: 'Explosive',
    requiredStats: { T: 90, H: 55, S: 70, A: 25, B: 35 },
    tags: ['급성장', '최고연봉', '최첨단'],
    description: '라이다/레이더/카메라 센서 정비 및 교정',
    prerequisiteJobs: ['ev_03'], // ADAS -> 자율주행 센서
  },
  {
    id: 'ev_10',
    title: 'V2G 컨설턴트',
    group: 'EV_Future',
    salaryRange: { min: 4500, max: 7000 },
    marketDemand: 'High',
    requiredStats: { T: 75, H: 30, S: 55, A: 30, B: 80 },
    tags: ['신기술', '에너지', '컨설팅'],
    description: '전기차 전력을 전력망에 파는 수익 모델 설계',
    prerequisiteJobs: ['ev_04', 'ev_05'], // 충전 인프라 + 폐배터리 -> V2G
  },

  // ========== Group E: Management & Biz (경영/서비스) - 14 jobs ==========
  {
    id: 'mgmt_01',
    title: '서비스 어드바이저 (SA)',
    group: 'Management',
    salaryRange: { min: 3500, max: 6500 },
    marketDemand: 'High',
    requiredStats: { T: 50, H: 25, S: 55, A: 40, B: 85 },
    tags: ['고객응대', '프리미엄'],
    description: '접수, 상담, 견적 발행, 출고',
    hiringCompanies: ['코오롱모터스(BMW)', '위본모터스(Audi)', '효성토요타', '스타자동차(MB)'],
    source: '사람인 어드바이저 연봉 데이터 2024',
  },
  {
    id: 'mgmt_02',
    title: '정비샵 점장 (Manager)',
    group: 'Management',
    salaryRange: { min: 4500, max: 6500 },
    marketDemand: 'Stable',
    requiredStats: { T: 55, H: 35, S: 70, A: 35, B: 85 },
    tags: ['관리직', '고연봉'],
    description: '매장 손익 관리, 직원 채용, 근태 관리',
    prerequisiteJobs: ['mgmt_01'], // 어드바이저 -> 점장
  },
  {
    id: 'mgmt_03',
    title: '부품 관리자 (Parts Manager)',
    group: 'Management',
    salaryRange: { min: 3500, max: 5000 },
    marketDemand: 'Stable',
    requiredStats: { T: 50, H: 30, S: 75, A: 25, B: 65 },
    tags: ['재고관리', '물류'],
    description: '순정/비순정 부품 수급 및 재고 관리',
    prerequisiteJobs: ['mgmt_01'], // 어드바이저 -> 부품
  },
  {
    id: 'mgmt_04',
    title: '보증 수리(Warranty) 청구 담당',
    group: 'Management',
    salaryRange: { min: 3500, max: 4800 },
    marketDemand: 'Stable',
    requiredStats: { T: 55, H: 25, S: 80, A: 25, B: 60 },
    tags: ['딜러십', '서류업무'],
    description: '제조사/보험사에 수리비 청구 행정',
    prerequisiteJobs: ['mgmt_01'], // 어드바이저 -> 보증수리
  },
  {
    id: 'mgmt_05',
    title: '자동차 손해사정사',
    group: 'Management',
    salaryRange: { min: 4500, max: 6500 },
    marketDemand: 'Stable',
    requiredStats: { T: 70, H: 40, S: 65, A: 30, B: 70 },
    tags: ['자격증필수', '고연봉'],
    description: '사고 과실 비율 및 수리 범위 산정',
    prerequisiteJobs: ['mgmt_04'], // 보증수리 -> 손해사정사
  },
  {
    id: 'mgmt_06',
    title: '중고차 평가사',
    group: 'Management',
    salaryRange: { min: 3600, max: 5500 },
    marketDemand: 'High',
    requiredStats: { T: 75, H: 45, S: 60, A: 35, B: 65 },
    tags: ['시장성장', '자격증우대'],
    description: '차량 매입 시 상태 점검 및 가격 책정',
    hiringCompanies: ['현대글로비스(오토벨)', 'K-Car', 'KB차차차', '헤이딜러'],
    source: '오토벨 채용 공고 2025',
  },
  {
    id: 'mgmt_07',
    title: '중고차 딜러',
    group: 'Management',
    salaryRange: { min: 3500, max: 10000 },
    marketDemand: 'Stable',
    requiredStats: { T: 50, H: 25, S: 50, A: 45, B: 90 },
    tags: ['영업', '성과급', '고연봉'],
    description: '매입/알선 판매',
    prerequisiteJobs: ['mgmt_06'], // 평가사 -> 딜러
  },
  {
    id: 'mgmt_08',
    title: '장기렌트/리스 에이전트',
    group: 'Management',
    salaryRange: { min: 3500, max: 8000 },
    marketDemand: 'High',
    requiredStats: { T: 45, H: 20, S: 55, A: 40, B: 90 },
    tags: ['금융', '영업', '성과급'],
    description: '신차 금융 상품 판매',
    prerequisiteJobs: ['mgmt_01'], // 어드바이저 -> 리스
  },
  {
    id: 'mgmt_09',
    title: '자동차 경매 대행사',
    group: 'Management',
    salaryRange: { min: 4000, max: 7000 },
    marketDemand: 'Stable',
    requiredStats: { T: 65, H: 30, S: 55, A: 40, B: 80 },
    tags: ['경매', '네트워크'],
    description: '경매장 낙찰 대행 및 탁송',
    prerequisiteJobs: ['mgmt_07'], // 딜러 -> 경매
  },
  {
    id: 'mgmt_10',
    title: '폐차 지도사',
    group: 'Management',
    salaryRange: { min: 3000, max: 4500 },
    marketDemand: 'Stable',
    requiredStats: { T: 50, H: 35, S: 70, A: 25, B: 65 },
    tags: ['행정', '환경'],
    description: '폐차 절차 대행 및 고철/부품 값 산정',
    prerequisiteJobs: ['mgmt_06'], // 평가사 -> 폐차
  },
  {
    id: 'mgmt_11',
    title: '자동차 유튜버/인플루언서',
    group: 'Management',
    salaryRange: { min: 2000, max: 20000 },
    marketDemand: 'High',
    requiredStats: { T: 60, H: 35, S: 40, A: 75, B: 80 },
    tags: ['크리에이터', '콘텐츠', '무한성장'],
    description: '리뷰, 정비 팁 콘텐츠 제작',
    // 루트 직업 - 선행 조건 없음 (콘텐츠 크리에이터 트랙)
  },
  {
    id: 'mgmt_12',
    title: '자동차 동호회 운영자',
    group: 'Management',
    salaryRange: { min: 2500, max: 5000 },
    marketDemand: 'Stable',
    requiredStats: { T: 45, H: 25, S: 50, A: 50, B: 85 },
    tags: ['커뮤니티', '네트워크'],
    description: '공동구매 진행 및 커뮤니티 관리',
    // 루트 직업 - 선행 조건 없음 (커뮤니티 트랙)
  },
  {
    id: 'mgmt_13',
    title: '정비 창업 컨설턴트',
    group: 'Management',
    salaryRange: { min: 5000, max: 10000 },
    marketDemand: 'Stable',
    requiredStats: { T: 70, H: 35, S: 60, A: 45, B: 90 },
    tags: ['창업', '컨설팅', '고연봉'],
    description: '매장 입지 선정, 장비 세팅 자문',
    prerequisiteJobs: ['mgmt_02'], // 점장 -> 창업 컨설턴트
  },
  {
    id: 'mgmt_14',
    title: '모빌리티 구독 매니저',
    group: 'Management',
    salaryRange: { min: 4000, max: 6000 },
    marketDemand: 'High',
    requiredStats: { T: 55, H: 20, S: 60, A: 50, B: 85 },
    tags: ['신사업', '구독경제'],
    description: '고객 라이프스타일에 맞춘 차량 구독 플랜 설계',
    prerequisiteJobs: ['mgmt_08'], // 리스 에이전트 -> 구독 매니저
  },

  // ========== Group F: Niche & Special (특수/니치) - 12 jobs ==========
  {
    id: 'niche_01',
    title: '레이싱 미케닉',
    group: 'Niche',
    salaryRange: { min: 4000, max: 6500 },
    marketDemand: 'Stable',
    requiredStats: { T: 80, H: 85, S: 60, A: 35, B: 35 },
    tags: ['모터스포츠', '열정'],
    description: '서킷 경기용 차량 셋업 및 현장 정비',
    prerequisiteJobs: ['maint_05', 'maint_04'], // 서스펜션 + 브레이크 -> 레이싱
  },
  {
    id: 'niche_02',
    title: '바이크(오토바이) 정비사',
    group: 'Niche',
    salaryRange: { min: 3000, max: 4200 },
    marketDemand: 'Stable',
    requiredStats: { T: 55, H: 70, S: 50, A: 35, B: 35 },
    tags: ['이륜차', '취미연계'],
    description: '이륜차 엔진/구동계 수리',
    prerequisiteJobs: ['maint_01'], // 경정비 -> 바이크
  },
  {
    id: 'niche_03',
    title: '대형 트럭/버스 정비사',
    group: 'Niche',
    salaryRange: { min: 3800, max: 5200 },
    marketDemand: 'Stable',
    requiredStats: { T: 65, H: 80, S: 55, A: 15, B: 30 },
    tags: ['상용차', '고연봉', '고강도'],
    description: '상용차 정비 (고소득, 고강도)',
    prerequisiteJobs: ['maint_09'], // 변속기 -> 대형차
  },
  {
    id: 'niche_04',
    title: '건설기계/지게차 정비사',
    group: 'Niche',
    salaryRange: { min: 4000, max: 5500 },
    marketDemand: 'Stable',
    requiredStats: { T: 70, H: 80, S: 55, A: 15, B: 30 },
    tags: ['건설', '유압', '고연봉'],
    description: '유압 시스템 전문',
    prerequisiteJobs: ['niche_03'], // 대형차 -> 건설기계
  },
  {
    id: 'niche_05',
    title: '농기계 수리사',
    group: 'Niche',
    salaryRange: { min: 3500, max: 4800 },
    marketDemand: 'Stable',
    requiredStats: { T: 60, H: 75, S: 50, A: 15, B: 35 },
    tags: ['농촌', '출장'],
    description: '트랙터, 콤바인 출장 수리',
    prerequisiteJobs: ['niche_03'], // 대형차 -> 농기계
  },
  {
    id: 'niche_06',
    title: '슈퍼카 전문 정비사',
    group: 'Niche',
    salaryRange: { min: 5000, max: 8000 },
    marketDemand: 'Stable',
    requiredStats: { T: 85, H: 80, S: 55, A: 50, B: 45 },
    tags: ['프리미엄', '고연봉', '희소가치'],
    description: '페라리/람보르기니 등 전용 매뉴얼 숙지',
    prerequisiteJobs: ['maint_14', 'maint_10'], // 진단가 + 엔진 오버홀 -> 슈퍼카
  },
  {
    id: 'niche_07',
    title: '자동차 시트커버 제작자',
    group: 'Niche',
    salaryRange: { min: 3200, max: 4500 },
    marketDemand: 'Stable',
    requiredStats: { T: 40, H: 75, S: 45, A: 70, B: 40 },
    tags: ['봉제', '커스텀'],
    description: '직물 재단 및 봉제 (미싱)',
    prerequisiteJobs: ['body_09'], // 실내 복원 -> 시트커버
  },
  {
    id: 'niche_08',
    title: '카오디오 목공사',
    group: 'Niche',
    salaryRange: { min: 3500, max: 5000 },
    marketDemand: 'Stable',
    requiredStats: { T: 45, H: 80, S: 45, A: 75, B: 40 },
    tags: ['목공', '우퍼', '커스텀'],
    description: '우퍼 박스, 트렁크 디자인 제작',
    prerequisiteJobs: ['film_07'], // 사운드 시스템 -> 카오디오 목공
  },
  {
    id: 'niche_09',
    title: '자동차 키(Key) 제작자',
    group: 'Niche',
    salaryRange: { min: 3500, max: 5500 },
    marketDemand: 'Stable',
    requiredStats: { T: 75, H: 60, S: 50, A: 25, B: 50 },
    tags: ['틈새시장', '기술집약'],
    description: '이모빌라이저 복사 및 분실 키 제작',
    prerequisiteJobs: ['maint_14'], // 진단가 -> 키 제작
  },
  {
    id: 'niche_10',
    title: '출장 서비스 전문가',
    group: 'Niche',
    salaryRange: { min: 3000, max: 5000 },
    marketDemand: 'High',
    requiredStats: { T: 55, H: 65, S: 55, A: 30, B: 65 },
    tags: ['출장', '기동성', '자유로움'],
    description: '무점포 이동식 세차, 경정비(오일/배터리)',
    prerequisiteJobs: ['maint_01', 'body_01'], // 경정비 or 디테일링 -> 출장
  },
  {
    id: 'niche_11',
    title: '자동차 수출 딜러',
    group: 'Niche',
    salaryRange: { min: 4000, max: 10000 },
    marketDemand: 'Stable',
    requiredStats: { T: 50, H: 25, S: 60, A: 35, B: 90 },
    tags: ['수출', '무역', '고연봉'],
    description: '중동/아프리카 등으로 중고차 수출',
    prerequisiteJobs: ['mgmt_07'], // 중고차 딜러 -> 수출 딜러
  },
  {
    id: 'niche_12',
    title: '수입차 인증 대행사',
    group: 'Niche',
    salaryRange: { min: 4000, max: 6000 },
    marketDemand: 'Stable',
    requiredStats: { T: 60, H: 25, S: 85, A: 25, B: 60 },
    tags: ['행정', '직수입'],
    description: '직수입 차량 배기가스/소음 인증 대행',
    prerequisiteJobs: ['maint_12'], // 구조변경 승인 -> 수입차 인증
  },

  // ========== Group G: Next-Gen (완전한 미래) - 13 jobs ==========
  {
    id: 'next_01',
    title: '자율주행 데이터 라벨러',
    group: 'NextGen',
    salaryRange: { min: 3000, max: 4500 },
    marketDemand: 'Explosive',
    requiredStats: { T: 70, H: 30, S: 60, A: 35, B: 30 },
    tags: ['AI', '입문추천', '재택가능'],
    description: 'AI 학습용 주행 영상 분석',
    // 루트 직업 - 선행 조건 없음 (NextGen 입문)
  },
  {
    id: 'next_02',
    title: '로보택시 유지보수원',
    group: 'NextGen',
    salaryRange: { min: 3500, max: 5000 },
    marketDemand: 'High',
    requiredStats: { T: 55, H: 50, S: 75, A: 40, B: 35 },
    tags: ['자율주행', '미래직업'],
    description: '무인 택시 청결 및 센서 관리',
    prerequisiteJobs: ['next_01', 'ev_09'], // 데이터 라벨러 or 자율주행 센서 -> 로보택시
  },
  {
    id: 'next_03',
    title: 'PBV 인테리어 디자이너',
    group: 'NextGen',
    salaryRange: { min: 4500, max: 7000 },
    marketDemand: 'High',
    requiredStats: { T: 65, H: 55, S: 45, A: 85, B: 50 },
    tags: ['디자인', 'PBV', '목적기반차량'],
    description: '목적기반차량(이동형 사무실/병원) 개조 설계',
    prerequisiteJobs: ['film_09'], // 캠핑카 빌더 -> PBV
  },
  {
    id: 'next_04',
    title: '차량용 AI 비서 큐레이터',
    group: 'NextGen',
    salaryRange: { min: 4000, max: 6000 },
    marketDemand: 'High',
    requiredStats: { T: 70, H: 25, S: 50, A: 60, B: 70 },
    tags: ['AI', '개인화', 'UX'],
    description: '인포테인먼트 시스템 개인화 세팅',
    prerequisiteJobs: ['ev_07'], // OTA 매니저 -> AI 비서
  },
  {
    id: 'next_05',
    title: '플라잉카(UAM) 정비사',
    group: 'NextGen',
    salaryRange: { min: 6000, max: 10000 },
    marketDemand: 'Explosive',
    requiredStats: { T: 90, H: 75, S: 70, A: 30, B: 35 },
    tags: ['최고연봉', '항공', '미래직업'],
    description: '드론/항공 모빌리티 정비',
    prerequisiteJobs: ['ev_09', 'ev_02'], // 자율주행 센서 + 모터 수리 -> UAM
  },
  {
    id: 'next_06',
    title: '가상 쇼룸 디자이너',
    group: 'NextGen',
    salaryRange: { min: 4000, max: 6500 },
    marketDemand: 'High',
    requiredStats: { T: 70, H: 35, S: 45, A: 90, B: 55 },
    tags: ['메타버스', '3D', '디자인'],
    description: '메타버스 내 자동차 전시장 구축',
    prerequisiteJobs: ['mgmt_11'], // 유튜버 -> 가상 쇼룸 (콘텐츠 확장)
  },
  {
    id: 'next_07',
    title: '전기차 충전 로봇 관리자',
    group: 'NextGen',
    salaryRange: { min: 4500, max: 6500 },
    marketDemand: 'High',
    requiredStats: { T: 80, H: 60, S: 65, A: 25, B: 40 },
    tags: ['로봇', '자동화'],
    description: '자동 충전 로봇팔 수리',
    prerequisiteJobs: ['ev_04'], // 충전 인프라 -> 충전 로봇
  },
  {
    id: 'next_08',
    title: '3D 프린팅 파츠 제작자',
    group: 'NextGen',
    salaryRange: { min: 3500, max: 5500 },
    marketDemand: 'High',
    requiredStats: { T: 75, H: 65, S: 50, A: 55, B: 45 },
    tags: ['3D프린팅', '단종부품'],
    description: '단종된 부품 3D 프린터로 출력',
    prerequisiteJobs: ['body_11'], // 올드카 리스토어 -> 3D 프린팅
  },
  {
    id: 'next_09',
    title: '사이버 보안관',
    group: 'NextGen',
    salaryRange: { min: 6000, max: 10000 },
    marketDemand: 'Explosive',
    requiredStats: { T: 95, H: 25, S: 70, A: 20, B: 45 },
    tags: ['보안', 'IT융합', '최고연봉'],
    description: '자동차 해킹 방어 및 보안 패치',
    prerequisiteJobs: ['ev_07', 'ev_08'], // OTA + PCB 수리 -> 보안관
  },
  {
    id: 'next_10',
    title: '디지털 트윈 검사원',
    group: 'NextGen',
    salaryRange: { min: 5000, max: 7500 },
    marketDemand: 'High',
    requiredStats: { T: 90, H: 30, S: 60, A: 40, B: 45 },
    tags: ['디지털트윈', '시뮬레이션'],
    description: '가상 공간에서 차량 상태 시뮬레이션 진단',
    prerequisiteJobs: ['maint_14', 'ev_07'], // 진단가 + OTA -> 디지털 트윈
  },
  {
    id: 'next_11',
    title: '탄소 배출권 거래사',
    group: 'NextGen',
    salaryRange: { min: 5000, max: 8000 },
    marketDemand: 'High',
    requiredStats: { T: 65, H: 20, S: 75, A: 30, B: 85 },
    tags: ['친환경', '금융', 'ESG'],
    description: '정비소/폐차장의 친환경 등급 관리 및 거래',
    prerequisiteJobs: ['ev_10', 'mgmt_13'], // V2G + 창업 컨설턴트 -> 탄소 배출권
  },
  {
    id: 'next_12',
    title: '라스트마일 배송 로봇 수리공',
    group: 'NextGen',
    salaryRange: { min: 3500, max: 5000 },
    marketDemand: 'High',
    requiredStats: { T: 70, H: 70, S: 55, A: 25, B: 35 },
    tags: ['로봇', '물류'],
    description: '배달 로봇 바퀴/센서 정비',
    prerequisiteJobs: ['ev_09'], // 자율주행 센서 -> 배송 로봇
  },
  {
    id: 'next_13',
    title: '운산 아카데미 트레이너',
    group: 'NextGen',
    salaryRange: { min: 5000, max: 10000 },
    marketDemand: 'High',
    requiredStats: { T: 80, H: 70, S: 70, A: 60, B: 80 },
    tags: ['교육', '올라운더', '고연봉'],
    description: '이 모든 것을 가르치는 강사',
    prerequisiteJobs: ['mgmt_13', 'niche_06'], // 창업 컨설턴트 + 슈퍼카 정비 -> 트레이너 (최종 직업)
  },
];

// Helper functions
export function getJobsByGroup(group: JobGroup): Job[] {
  return jobDatabase.filter(job => job.group === group);
}

export function getJobsByDemand(demand: MarketDemand): Job[] {
  return jobDatabase.filter(job => job.marketDemand === demand);
}

export function getTopSalaryJobs(limit: number = 5): Job[] {
  return [...jobDatabase]
    .sort((a, b) => b.salaryRange.max - a.salaryRange.max)
    .slice(0, limit);
}

export function getHotTrendJobs(limit: number = 5): Job[] {
  return jobDatabase
    .filter(job => job.marketDemand === 'Explosive')
    .sort((a, b) => b.salaryRange.max - a.salaryRange.max)
    .slice(0, limit);
}

export function getBestStarterJobs(limit: number = 5): Job[] {
  return [...jobDatabase]
    .filter(job => job.tags.includes('입문추천') || job.tags.includes('빠른취업'))
    .sort((a, b) => {
      const aTotal = Object.values(a.requiredStats).reduce((sum, v) => sum + v, 0);
      const bTotal = Object.values(b.requiredStats).reduce((sum, v) => sum + v, 0);
      return aTotal - bTotal;
    })
    .slice(0, limit);
}

export function searchJobs(query: string): Job[] {
  const lowerQuery = query.toLowerCase();
  return jobDatabase.filter(job =>
    job.title.toLowerCase().includes(lowerQuery) ||
    job.description.toLowerCase().includes(lowerQuery) ||
    job.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterJobsByStats(stats: Partial<JobStats>, tolerance: number = 20): Job[] {
  return jobDatabase.filter(job => {
    for (const [key, value] of Object.entries(stats)) {
      if (value === undefined) continue;
      const required = job.requiredStats[key as keyof JobStats];
      if (Math.abs(required - value) > tolerance) {
        return false;
      }
    }
    return true;
  });
}

// Format salary in Korean format (e.g., "4,500~8,000만원")
export function formatSalaryKorean(salary: SalaryRange): string {
  const formatNum = (n: number) => n.toLocaleString('ko-KR');
  return `${formatNum(salary.min)}~${formatNum(salary.max)}만원`;
}

// Get job by ID
export function getJobById(id: string): Job | undefined {
  return jobDatabase.find(job => job.id === id);
}

// Get prerequisite jobs for a given job (career path tracing)
export function getPrerequisiteJobs(jobId: string): Job[] {
  const job = getJobById(jobId);
  if (!job || !job.prerequisiteJobs) return [];

  return job.prerequisiteJobs
    .map(id => getJobById(id))
    .filter((j): j is Job => j !== undefined);
}

// Get full career path (recursive) - returns jobs from entry level to target
export function getCareerPath(targetJobId: string): Job[] {
  const visited = new Set<string>();
  const path: Job[] = [];

  function trace(jobId: string): void {
    if (visited.has(jobId)) return;
    visited.add(jobId);

    const job = getJobById(jobId);
    if (!job) return;

    // First, trace prerequisites
    if (job.prerequisiteJobs) {
      for (const prereqId of job.prerequisiteJobs) {
        trace(prereqId);
      }
    }

    // Then add this job
    path.push(job);
  }

  trace(targetJobId);
  return path;
}

// Get jobs that require a given job as prerequisite
export function getJobsThatRequire(jobId: string): Job[] {
  return jobDatabase.filter(job =>
    job.prerequisiteJobs?.includes(jobId)
  );
}

// ========== FILTER HELPERS ==========

// Blue Ocean jobs: High salary + High/Explosive demand
export function isBlueOceanJob(job: Job): boolean {
  const highSalary = job.salaryRange.max >= 6000;
  const highDemand = job.marketDemand === 'Explosive' || job.marketDemand === 'High';
  return highSalary && highDemand;
}

export function getBlueOceanJobs(): Job[] {
  return jobDatabase.filter(isBlueOceanJob);
}

// Starter jobs: No prerequisites (entry-level)
export function isStarterJob(job: Job): boolean {
  return !job.prerequisiteJobs || job.prerequisiteJobs.length === 0;
}

export function getStarterJobs(): Job[] {
  return jobDatabase.filter(isStarterJob);
}

// EV Transition jobs: Jobs in EV_Future group or related to EV
export function isEVTransitionJob(job: Job): boolean {
  if (job.group === 'EV_Future') return true;
  // Also include hybrid specialist and related jobs
  const evRelatedIds = ['maint_17', 'ev_01', 'ev_02', 'ev_03', 'ev_04', 'ev_05', 'ev_06', 'ev_07', 'ev_08', 'ev_09', 'ev_10'];
  return evRelatedIds.includes(job.id);
}

export function getEVTransitionJobs(): Job[] {
  return jobDatabase.filter(isEVTransitionJob);
}

// Get IC Engine to EV transition path
export function getEVTransitionPath(): string[] {
  // Key path: maint_01 -> maint_14 -> maint_17 -> ev_01 -> ev_02 (Engine mechanic to EV specialist)
  return ['maint_01', 'maint_06', 'maint_09', 'maint_14', 'maint_17', 'ev_01', 'ev_02', 'ev_03', 'ev_09'];
}
