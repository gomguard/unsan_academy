// Career Hub Data: Reviews, Success Stories, and Related Community Posts

export interface CareerReview {
  id: string;
  jobId: string;
  authorName: string;
  authorTitle: string; // Current job title
  authorAvatar?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  yearsInRole: number;
  previousJob?: string;
  salaryGrowth?: string; // e.g., "+50%", "2배"
  pros: string[];
  cons: string[];
  advice: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

export interface SuccessStory {
  id: string;
  targetJobId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  summary: string;
  journeySteps: {
    jobId: string;
    jobTitle: string;
    duration: string;
    salary?: string;
  }[];
  totalDuration: string;
  salaryChange: string;
  keyLessons: string[];
  createdAt: string;
}

// ============ REVIEWS DATA ============
export const careerReviews: CareerReview[] = [
  // ========== EV Battery Expert (ev_01) ==========
  {
    id: 'review_ev01_1',
    jobId: 'ev_01',
    authorName: 'Kim_EV_Tech',
    authorTitle: 'EV 배터리 진단사 (3년차)',
    rating: 5,
    title: '힘들지만 확실히 가치 있는 길',
    content: '일반 정비에서 EV로 전환한 지 3년 됐습니다. 처음엔 고전압 공포증이 있었는데, 교육 받고 나니 오히려 더 안전하게 일하게 됐어요. 연봉은 기존 대비 거의 2배 가까이 올랐고, 무엇보다 미래가 확실한 분야라 불안함이 없어요.',
    yearsInRole: 3,
    previousJob: '일반 정비사 (7년)',
    salaryGrowth: '+85%',
    pros: ['연봉 상승폭이 큼', '미래 성장성 확실', '덜 힘든 육체 노동', '전문가 대우'],
    cons: ['초기 교육 비용', '고전압 안전 규정 엄격', '아직 차량 수 제한적'],
    advice: '고전압 안전교육은 필수입니다. 폴리텍에서 무료로 하니까 꼭 이수하세요. 그 다음엔 실무 경험이 가장 중요해요.',
    createdAt: '2024-12-15',
    helpful: 127,
    verified: true,
  },
  {
    id: 'review_ev01_2',
    jobId: 'ev_01',
    authorName: 'Park_Battery',
    authorTitle: 'EV 전문 센터 팀장',
    rating: 4,
    title: '2030년을 준비하는 선택',
    content: '내연기관 정비 15년 하다가 4년 전에 전환했습니다. 솔직히 처음엔 나이 먹고 뭘 배우나 싶었는데, 지금은 팀장으로 후배들 가르치고 있어요. 연봉보다 중요한 건 직업 안정성이에요.',
    yearsInRole: 4,
    previousJob: '엔진 정비 마스터',
    salaryGrowth: '+60%',
    pros: ['직업 안정성', '존경받는 전문가', '깨끗한 작업 환경'],
    cons: ['끊임없이 공부해야 함', '신기술 따라가기 벅참'],
    advice: '나이 먹었다고 포기하지 마세요. 경력자가 EV 배우면 시너지가 엄청납니다.',
    createdAt: '2024-11-20',
    helpful: 89,
    verified: true,
  },
  {
    id: 'review_ev01_3',
    jobId: 'ev_01',
    authorName: 'Lee_Tesla',
    authorTitle: 'Tesla Korea 서비스 테크니션',
    rating: 5,
    title: '테슬라 입사 후기',
    content: '2년 전 테슬라 코리아에 입사했습니다. 면접에서 EV 관련 교육 이수 경력이 크게 작용했어요. 연봉도 좋지만 뭔가 최첨단 기술을 다룬다는 자부심이 있습니다.',
    yearsInRole: 2,
    previousJob: '하이브리드 정비사',
    salaryGrowth: '+70%',
    pros: ['글로벌 기업', '체계적인 교육', '신기술 접근'],
    cons: ['업무 강도 높음', '서울/수도권만 근무지'],
    advice: '테슬라 지원 전에 고전압 안전교육 + 배터리 진단 과정 필수로 이수하세요.',
    createdAt: '2024-10-05',
    helpful: 156,
    verified: true,
  },

  // ========== PPF Installer (film_03) ==========
  {
    id: 'review_film03_1',
    jobId: 'film_03',
    authorName: 'Lee_PPF_Master',
    authorTitle: 'PPF 시공 마스터',
    rating: 5,
    title: '1억 찍었습니다. 실화입니다.',
    content: '작년에 연봉 1억 달성했어요. 물론 인센티브 포함이고 새벽까지 일한 날도 많았지만... 손재주와 끈기만 있으면 진짜 가능합니다. 디테일링 3년 하다가 PPF로 전환했고, PPF만 5년차입니다.',
    yearsInRole: 5,
    previousJob: '디테일링 전문가',
    salaryGrowth: '3배',
    pros: ['성과급 천장 없음', '기술만 좋으면 인정받음', '고급 차량 다루는 재미'],
    cons: ['체력 소모 큼', '실수하면 수백만원 날림', '손목/어깨 직업병'],
    advice: '핸드컷 연습을 미친듯이 하세요. 기계 재단보다 핸드컷 잘하는 사람이 진짜 인정받습니다.',
    createdAt: '2024-12-01',
    helpful: 203,
    verified: true,
  },
  {
    id: 'review_film03_2',
    jobId: 'film_03',
    authorName: 'Choi_Wrap',
    authorTitle: 'PPF/랩핑 시공사',
    rating: 4,
    title: '손기술 있으면 도전해볼 만',
    content: '세차장에서 5년 일하다가 PPF로 왔어요. 처음 6개월은 정말 힘들었는데, 지금은 단독 시공도 합니다. 연봉은 세차 때보다 2배 정도 오른 것 같아요.',
    yearsInRole: 2,
    previousJob: '세차 기술자',
    salaryGrowth: '+100%',
    pros: ['빠른 연봉 상승', '기술 배우는 재미', '손님 반응 좋을 때 뿌듯'],
    cons: ['처음 배울 때 스트레스', '체력적으로 힘듦'],
    advice: '디테일링이나 틴팅 경험 있으면 훨씬 수월해요. 필름 다루는 손 감각이 비슷하거든요.',
    createdAt: '2024-10-15',
    helpful: 156,
    verified: false,
  },
  {
    id: 'review_film03_3',
    jobId: 'film_03',
    authorName: 'XPEL_Pro',
    authorTitle: 'XPEL Korea 공인 시공사',
    rating: 5,
    title: 'XPEL 인증 따고 나서 달라진 점',
    content: 'XPEL 공인 인증 따는 데 시간이 좀 걸렸지만, 인증 후에는 고객들이 먼저 찾아옵니다. 프리미엄 필름 다루니까 단가도 높고, 작업 만족도도 높아요.',
    yearsInRole: 4,
    previousJob: '일반 PPF 시공사',
    salaryGrowth: '+50%',
    pros: ['브랜드 파워', '고단가 작업', '고객 신뢰'],
    cons: ['인증 과정 까다로움', '교육비 투자 필요'],
    advice: '처음엔 일반 필름으로 경험 쌓고, 어느 정도 실력 되면 XPEL이나 STEK 인증 도전하세요.',
    createdAt: '2024-09-20',
    helpful: 134,
    verified: true,
  },

  // ========== ADAS Calibration (ev_03) ==========
  {
    id: 'review_ev03_1',
    jobId: 'ev_03',
    authorName: 'Jung_ADAS',
    authorTitle: 'ADAS 캘리브레이션 전문가',
    rating: 5,
    title: '블루오션은 진짜였다',
    content: '유리 교환하던 기술자였는데, ADAS 캘리브레이션 배우고 인생이 바뀌었어요. 이제 유리 교환 후 캘리브레이션까지 하니까 매출이 2배로 뛰었고, 다른 공업사에서 외주로 의뢰도 들어옵니다.',
    yearsInRole: 2,
    previousJob: '자동차 유리 기술자',
    salaryGrowth: '+120%',
    pros: ['수요 폭발', '경쟁자 적음', '장비만 있으면 어디서든 가능'],
    cons: ['장비 초기 투자 비용', '차종마다 다른 규격'],
    advice: '운산 아카데미 ADAS 과정 강력 추천합니다. 장비 대여도 해주고 차종별 노하우도 알려줘요.',
    createdAt: '2024-11-01',
    helpful: 178,
    verified: true,
  },
  {
    id: 'review_ev03_2',
    jobId: 'ev_03',
    authorName: 'Sensor_King',
    authorTitle: 'ADAS 전문 공업사 대표',
    rating: 5,
    title: '창업 2년차, 월 매출 3천 넘김',
    content: 'ADAS 캘리브레이션 전문으로 창업했습니다. 장비 투자가 좀 컸지만 (약 3천만원), 2년 만에 회수하고도 남았어요. 보험사들이랑 제휴하니까 물량이 계속 들어옵니다.',
    yearsInRole: 2,
    previousJob: '수입차 진단 기술자',
    salaryGrowth: '창업 후 3배',
    pros: ['독립 가능', '높은 수익성', '보험사 연계'],
    cons: ['장비 투자 필요', '신차 나올 때마다 업데이트'],
    advice: '처음엔 중고 장비로 시작해도 됩니다. Autel이나 Hunter 중고 찾아보세요.',
    createdAt: '2024-08-15',
    helpful: 201,
    verified: true,
  },

  // ========== Service Advisor (mgmt_01) ==========
  {
    id: 'review_mgmt01_1',
    jobId: 'mgmt_01',
    authorName: 'Han_SA',
    authorTitle: '수입차 딜러 서비스 어드바이저',
    rating: 4,
    title: '정비 모르면 힘들어요',
    content: '처음엔 고객 응대만 잘하면 되는 줄 알았는데, 정비 지식 없으면 고객한테 설명도 못 하고 정비사한테 무시당해요. 정비 경험 있다가 SA로 오신 분들이 훨씬 잘하더라고요.',
    yearsInRole: 3,
    previousJob: '경정비 테크니션',
    salaryGrowth: '+40%',
    pros: ['깨끗한 근무 환경', '주말 쉼', '인센티브'],
    cons: ['진상 고객 스트레스', '정비 지식 필수'],
    advice: '정비 경험 최소 1-2년은 하고 오세요. 그래야 정비사들이 인정해줍니다.',
    createdAt: '2024-09-20',
    helpful: 92,
    verified: true,
  },
  {
    id: 'review_mgmt01_2',
    jobId: 'mgmt_01',
    authorName: 'BMW_SA',
    authorTitle: 'BMW 코오롱모터스 SA',
    rating: 5,
    title: 'BMW 서비스 어드바이저 5년차 후기',
    content: '정비사 3년 하다가 SA로 전향했습니다. 처음엔 적응하기 힘들었는데, 지금은 고객 관리하는 재미로 일해요. 인센티브 잘 받으면 연봉 6천 이상도 가능합니다.',
    yearsInRole: 5,
    previousJob: '일반 정비사',
    salaryGrowth: '+55%',
    pros: ['정장 입고 출근', '고객 관계 형성', '높은 인센티브'],
    cons: ['실적 압박', '주말 근무 있음'],
    advice: '외국어 능력 있으면 더 좋아요. 외국인 고객 대응할 때 유리합니다.',
    createdAt: '2024-07-10',
    helpful: 78,
    verified: true,
  },

  // ========== Detailing Expert (body_01) ==========
  {
    id: 'review_body01_1',
    jobId: 'body_01',
    authorName: 'Shine_Master',
    authorTitle: '프리미엄 디테일링 전문가',
    rating: 5,
    title: '세차에서 디테일링까지, 연봉 2배 된 이야기',
    content: '동네 손세차장에서 시작해서 지금은 고급 디테일링 샵에서 일합니다. 세라믹 코팅 하나에 100만원 넘게 받기도 해요. 꼼꼼함이 돈이 되는 직업입니다.',
    yearsInRole: 4,
    previousJob: '손세차 기술자',
    salaryGrowth: '+100%',
    pros: ['성취감', '고급차 다루는 재미', '성장 가능성'],
    cons: ['허리/무릎 안 좋아짐', '여름에 덥고 겨울에 추움'],
    advice: '광택 기술 확실히 배우세요. 유튜브로도 많이 배울 수 있어요.',
    createdAt: '2024-11-10',
    helpful: 145,
    verified: true,
  },
  {
    id: 'review_body01_2',
    jobId: 'body_01',
    authorName: 'Detail_Pro',
    authorTitle: '디테일링 샵 대표',
    rating: 4,
    title: '창업 3년차, 현실적인 후기',
    content: '디테일링 기술자로 5년 일하다가 독립했습니다. 처음 1년은 힘들었는데, 인스타그램 마케팅 열심히 하니까 손님이 늘었어요. 지금은 월 1천 이상 벌어요.',
    yearsInRole: 3,
    previousJob: '디테일링 기술자',
    salaryGrowth: '창업 후 2배',
    pros: ['내 사업', '자유로운 시간', '단골 고객'],
    cons: ['초기 투자', '혼자서 다 해야 함'],
    advice: 'SNS 마케팅 무조건 해야 합니다. 비포/애프터 사진이 최고의 광고예요.',
    createdAt: '2024-10-25',
    helpful: 167,
    verified: true,
  },

  // ========== Hybrid Specialist (maint_17) ==========
  {
    id: 'review_maint17_1',
    jobId: 'maint_17',
    authorName: 'Hybrid_Tech',
    authorTitle: '하이브리드 전문 테크니션',
    rating: 4,
    title: 'EV 가기 전 하이브리드 먼저 배워라',
    content: '하이브리드 정비 3년차입니다. EV 바로 가는 것보다 하이브리드 먼저 배우는 게 좋아요. 엔진이랑 모터 둘 다 이해하게 되니까 응용력이 생깁니다.',
    yearsInRole: 3,
    previousJob: '엔진 정비사',
    salaryGrowth: '+45%',
    pros: ['EV 전환 징검다리', '두 기술 모두 습득', '수요 증가'],
    cons: ['복잡한 시스템', '진단 어려움'],
    advice: '프리우스나 아이오닉으로 먼저 연습하세요. 가장 흔한 차종이라 케이스가 많아요.',
    createdAt: '2024-12-01',
    helpful: 112,
    verified: true,
  },

  // ========== ECU Mapper (maint_15) ==========
  {
    id: 'review_maint15_1',
    jobId: 'maint_15',
    authorName: 'ECU_Master',
    authorTitle: 'ECU 튜닝 전문가',
    rating: 5,
    title: '연봉 7천, 퍼포먼스 튜닝의 세계',
    content: '차 좋아하는 사람에게 꿈의 직업입니다. 고객 차량 출력을 올려주고 시승해보면 정말 뿌듯해요. 기술만 있으면 연봉 7천 이상도 가능합니다.',
    yearsInRole: 6,
    previousJob: '수입차 진단 기술자',
    salaryGrowth: '+80%',
    pros: ['최고 연봉', '마니아층 고객', '기술적 성취감'],
    cons: ['고난이도', '지속적인 학습 필요', '책임감 큼'],
    advice: 'WinOLS 툴 다루는 법 배우세요. 그리고 데이터 분석 능력이 핵심입니다.',
    createdAt: '2024-09-15',
    helpful: 189,
    verified: true,
  },

  // ========== Color Wrapper (film_02) ==========
  {
    id: 'review_film02_1',
    jobId: 'film_02',
    authorName: 'Wrap_Artist',
    authorTitle: '컬러 랩핑 아티스트',
    rating: 5,
    title: '예술하는 기분으로 일합니다',
    content: '랩핑은 진짜 예술이에요. 고객이 원하는 색상으로 차를 바꿔주면 감동하는 표정이 보람 있습니다. PPF보다 창의성이 필요하고, 그래서 더 재밌어요.',
    yearsInRole: 4,
    previousJob: '틴터',
    salaryGrowth: '+70%',
    pros: ['창의적인 작업', '다양한 디자인', '고객 반응'],
    cons: ['체력 소모', '까다로운 곡면 작업'],
    advice: '틴팅 경험 있으면 필름 다루는 감각이 있어서 빠르게 배울 수 있어요.',
    createdAt: '2024-11-05',
    helpful: 123,
    verified: true,
  },

  // ========== Tinter (film_01) ==========
  {
    id: 'review_film01_1',
    jobId: 'film_01',
    authorName: 'Tint_Pro',
    authorTitle: '썬팅 전문가 8년차',
    rating: 4,
    title: '입문하기 좋은 필름 작업',
    content: '필름 계열에서 시작하기 가장 좋은 게 틴팅이에요. 배우기 쉽고, 기본기 익히면 PPF나 랩핑으로 확장할 수 있습니다. 저도 틴팅으로 시작해서 지금은 PPF도 합니다.',
    yearsInRole: 8,
    previousJob: '디테일링 보조',
    salaryGrowth: '+60%',
    pros: ['입문 난이도 낮음', '확장성', '안정적 수요'],
    cons: ['단가가 낮은 편', '경쟁 치열'],
    advice: '빠르고 깔끔하게 작업하는 연습을 많이 하세요. 속도가 곧 수익입니다.',
    createdAt: '2024-10-20',
    helpful: 98,
    verified: true,
  },

  // ========== Used Car Appraiser (mgmt_06) ==========
  {
    id: 'review_mgmt06_1',
    jobId: 'mgmt_06',
    authorName: 'Car_Evaluator',
    authorTitle: 'K-Car 중고차 평가사',
    rating: 4,
    title: '정비 경험이 빛을 발하는 직업',
    content: '정비사 경력이 있어서 차량 상태 파악이 빠릅니다. 사고 여부, 침수 여부 등 눈으로 보면 바로 알아요. 안정적이고 연봉도 나쁘지 않아요.',
    yearsInRole: 3,
    previousJob: '일반 정비사 6년',
    salaryGrowth: '+35%',
    pros: ['정비 경력 활용', '안정적 근무', '덜 힘든 노동'],
    cons: ['실적 압박', '이동 많음'],
    advice: '중고차 평가사 자격증 따세요. 시험은 어렵지 않아요.',
    createdAt: '2024-11-15',
    helpful: 87,
    verified: true,
  },

  // ========== Engine Overhaul Master (maint_10) ==========
  {
    id: 'review_maint10_1',
    jobId: 'maint_10',
    authorName: 'Engine_God',
    authorTitle: '엔진 오버홀 마스터 15년차',
    rating: 5,
    title: '사라져가는 장인의 기술',
    content: '엔진 오버홀은 정비의 꽃입니다. EV 시대가 오지만, 클래식카나 고성능 차량은 계속 있을 거예요. 희소가치가 점점 올라가고 있어요.',
    yearsInRole: 15,
    previousJob: '변속기 전문가',
    salaryGrowth: '+40%',
    pros: ['최고 수준의 기술', '희소가치', '장인 대우'],
    cons: ['EV 시대에 수요 감소', '육체적으로 힘듦'],
    advice: '클래식카 쪽으로 방향을 잡으면 오히려 수요가 늘어날 겁니다.',
    createdAt: '2024-08-20',
    helpful: 156,
    verified: true,
  },

  // ========== Camper Builder (film_09) ==========
  {
    id: 'review_film09_1',
    jobId: 'film_09',
    authorName: 'Camper_Builder',
    authorTitle: '캠핑카 빌더 4년차',
    rating: 5,
    title: '취미가 직업이 된 케이스',
    content: '캠핑을 좋아해서 시작했어요. 스타렉스 개조해서 캠핑카 만드는데, 완성하면 진짜 뿌듯합니다. 요즘 캠핑 붐이라 일감도 많아요.',
    yearsInRole: 4,
    previousJob: '인테리어 목수',
    salaryGrowth: '+55%',
    pros: ['취미와 연계', '창의적 작업', '수요 증가'],
    cons: ['작업 공간 필요', '다양한 기술 필요'],
    advice: '목공 기술이 있으면 유리해요. 전기 배선도 기본은 알아야 합니다.',
    createdAt: '2024-10-10',
    helpful: 134,
    verified: true,
  },

  // ========== Charging Infra Maintenance (ev_04) ==========
  {
    id: 'review_ev04_1',
    jobId: 'ev_04',
    authorName: 'Charger_Tech',
    authorTitle: '충전 인프라 유지보수 기사',
    rating: 5,
    title: '숨은 블루오션',
    content: '전기차 충전기 유지보수합니다. 아직 이 분야 인력이 부족해서 일감이 넘쳐요. 출장 많이 다니지만 그만큼 수당도 잘 나옵니다.',
    yearsInRole: 2,
    previousJob: '전기 기사',
    salaryGrowth: '+50%',
    pros: ['블루오션', '출장 수당', '성장 분야'],
    cons: ['출장 많음', '야간 콜도 있음'],
    advice: '전기 관련 자격증 있으면 바로 취업 가능해요. 전기기능사 정도면 충분합니다.',
    createdAt: '2024-12-05',
    helpful: 145,
    verified: true,
  },

  // ========== PDR Technician (body_02) ==========
  {
    id: 'review_body02_1',
    jobId: 'body_02',
    authorName: 'PDR_Master',
    authorTitle: '덴트 복원 전문가',
    rating: 5,
    title: '도색 없이 복원하는 마법',
    content: 'PDR은 도색 없이 찌그러진 부분을 펴는 기술입니다. 보험 처리하면 수익도 좋고, 고객 만족도도 높아요. 손재주 있으면 금방 배울 수 있습니다.',
    yearsInRole: 5,
    previousJob: '판금 기술자',
    salaryGrowth: '+45%',
    pros: ['높은 수익성', '고객 만족', '깨끗한 작업'],
    cons: ['손목 부담', '집중력 필요'],
    advice: '빛 조명을 활용해서 홈을 정확히 보는 연습이 중요해요.',
    createdAt: '2024-09-25',
    helpful: 112,
    verified: true,
  },

  // ========== Wheel Restoration (body_08) ==========
  {
    id: 'review_body08_1',
    jobId: 'body_08',
    authorName: 'Wheel_Doctor',
    authorTitle: '휠 복원 전문가',
    rating: 4,
    title: '틈새시장에서 월 600 버는 법',
    content: '휠 복원은 경쟁자가 적어요. 다이아컷팅 장비 투자가 필요하지만, 투자 대비 수익이 좋습니다. 한 달에 50~60개 작업하면 월 600 정도 벌어요.',
    yearsInRole: 3,
    previousJob: '도장 기술자',
    salaryGrowth: '+60%',
    pros: ['틈새시장', '높은 단가', '경쟁자 적음'],
    cons: ['장비 투자 필요', '분진 발생'],
    advice: '다이아컷팅 장비는 중고로 시작해도 돼요. 점점 업그레이드하면 됩니다.',
    createdAt: '2024-11-20',
    helpful: 98,
    verified: true,
  },

  // ========== Tesla Body Shop (body_12) ==========
  {
    id: 'review_body12_1',
    jobId: 'body_12',
    authorName: 'Tesla_Body',
    authorTitle: 'Tesla 공인 바디샵 기술자',
    rating: 5,
    title: '테슬라 알루미늄 용접 마스터',
    content: '테슬라 공인 바디샵에서 일합니다. 알루미늄 용접 기술이 필수인데, 인증 받으면 대우가 달라요. 테슬라 차량 늘어나면서 일감도 계속 늘어납니다.',
    yearsInRole: 2,
    previousJob: '일반 판금 기술자',
    salaryGrowth: '+70%',
    pros: ['프리미엄 브랜드', '높은 단가', '성장 분야'],
    cons: ['인증 과정 까다로움', '정밀함 요구'],
    advice: '알루미늄 용접 자격증 먼저 따세요. 그 다음 테슬라 인증 받으면 됩니다.',
    createdAt: '2024-10-30',
    helpful: 167,
    verified: true,
  },

  // ========== Autonomous Driving Sensor Tech (ev_09) ==========
  {
    id: 'review_ev09_1',
    jobId: 'ev_09',
    authorName: 'Sensor_Expert',
    authorTitle: '자율주행 센서 기술자',
    rating: 5,
    title: '최첨단 기술의 최전선',
    content: 'ADAS에서 한 단계 더 나아간 자율주행 센서 정비를 합니다. 라이다, 레이더 캘리브레이션은 아직 할 줄 아는 사람이 거의 없어서 몸값이 높습니다.',
    yearsInRole: 1,
    previousJob: 'ADAS 캘리브레이션 전문가',
    salaryGrowth: '+40%',
    pros: ['최고 연봉 수준', '최첨단 기술', '희소가치'],
    cons: ['지속적 학습 필요', '장비 비쌈'],
    advice: 'ADAS 먼저 완벽히 마스터하고 도전하세요. 기본기가 중요합니다.',
    createdAt: '2024-12-10',
    helpful: 178,
    verified: true,
  },

  // ========== Light Maintenance Technician (maint_01) ==========
  {
    id: 'review_maint01_1',
    jobId: 'maint_01',
    authorName: 'First_Step',
    authorTitle: '경정비 테크니션 2년차',
    rating: 4,
    title: '자동차 정비 입문의 정석',
    content: '완전 처음부터 시작했는데, 경정비로 기본기 다지는 게 정말 중요했어요. 오일 교환, 브레이크 패드, 필터 교체 이런 거 하면서 차량 구조를 이해하게 됐습니다.',
    yearsInRole: 2,
    previousJob: '제조업 공장',
    salaryGrowth: '+20%',
    pros: ['빠른 취업', '기본기 습득', '다양한 경험'],
    cons: ['연봉이 낮은 편', '단순 반복 작업'],
    advice: '여기서 멈추지 말고 특화 분야를 정해서 공부하세요. 저는 EV 쪽으로 갈 예정입니다.',
    createdAt: '2024-11-25',
    helpful: 89,
    verified: true,
  },
];

// ============ SUCCESS STORIES ============
export const successStories: SuccessStory[] = [
  {
    id: 'story_01',
    targetJobId: 'ev_01',
    authorName: 'Kim_Journey',
    title: '오일교환에서 EV 전문가까지, 5년의 여정',
    summary: '동네 카센터 오일교환 직원에서 시작해 현대 블루핸즈 EV 전담팀까지. 포기하지 않으면 된다는 걸 증명했습니다.',
    journeySteps: [
      { jobId: 'maint_01', jobTitle: '경정비 테크니션', duration: '2년', salary: '2,800만원' },
      { jobId: 'maint_06', jobTitle: '에어컨/공조 전문가', duration: '1.5년', salary: '3,500만원' },
      { jobId: 'maint_14', jobTitle: '수입차 범용 진단가', duration: '1년', salary: '4,500만원' },
      { jobId: 'maint_17', jobTitle: '하이브리드 전문가', duration: '6개월', salary: '5,000만원' },
      { jobId: 'ev_01', jobTitle: 'EV 배터리 진단사', duration: '현재', salary: '6,500만원' },
    ],
    totalDuration: '5년',
    salaryChange: '2,800 → 6,500만원 (+132%)',
    keyLessons: [
      '자격증보다 실무 경험이 중요했습니다',
      '폴리텍 무료 교육을 적극 활용했어요',
      '하이브리드를 먼저 공부하니 EV가 쉬웠습니다',
    ],
    createdAt: '2024-12-10',
  },
  {
    id: 'story_02',
    targetJobId: 'film_03',
    authorName: 'Park_PPF',
    title: '세차장 알바에서 PPF 1억 달성까지',
    summary: '무일푼으로 시작해서 3년 만에 연봉 1억을 찍은 이야기. 학력도 스펙도 없었지만 손재주 하나로 승부했습니다.',
    journeySteps: [
      { jobId: 'body_01', jobTitle: '디테일링 전문가', duration: '2년', salary: '3,200만원' },
      { jobId: 'film_01', jobTitle: '틴터 (썬팅)', duration: '1년', salary: '3,800만원' },
      { jobId: 'film_03', jobTitle: 'PPF 인스톨러', duration: '현재 3년차', salary: '1억+' },
    ],
    totalDuration: '6년',
    salaryChange: '3,200 → 1억+ (3배+)',
    keyLessons: [
      'PPF는 손재주 + 끈기 싸움입니다',
      '좋은 샵에서 도제 형식으로 배우는 게 최고예요',
      '첫 1년은 돈보다 기술에 집중했습니다',
    ],
    createdAt: '2024-11-25',
  },
  {
    id: 'story_03',
    targetJobId: 'ev_03',
    authorName: 'ADAS_Pioneer',
    title: '유리 교환 기술자에서 ADAS 전문가로',
    summary: '자동차 유리 10년 경력을 살려 ADAS 캘리브레이션 전문가가 된 이야기. 기존 경력이 새로운 기회가 됐습니다.',
    journeySteps: [
      { jobId: 'body_07', jobTitle: '자동차 유리 전문가', duration: '10년', salary: '3,800만원' },
      { jobId: 'maint_14', jobTitle: '수입차 범용 진단가', duration: '1년', salary: '4,200만원' },
      { jobId: 'ev_03', jobTitle: 'ADAS 캘리브레이션 전문가', duration: '현재 2년차', salary: '6,000만원' },
    ],
    totalDuration: '13년 (전환 3년)',
    salaryChange: '3,800 → 6,000만원 (+58%)',
    keyLessons: [
      '유리 교환 후 ADAS 보정이 필수라는 점이 기회였어요',
      '기존 경력 + 신기술 = 최강 조합',
      '운산 아카데미 ADAS 과정이 인생을 바꿨습니다',
    ],
    createdAt: '2024-11-10',
  },
  {
    id: 'story_04',
    targetJobId: 'mgmt_01',
    authorName: 'SA_Success',
    title: '현장 정비사에서 수입차 서비스 어드바이저로',
    summary: '손에 기름 묻히며 일하다가 정장 입고 고객 응대하는 SA로 전환. 정비 경험이 고객 신뢰를 얻는 무기가 됐습니다.',
    journeySteps: [
      { jobId: 'maint_01', jobTitle: '경정비 테크니션', duration: '3년', salary: '3,000만원' },
      { jobId: 'maint_06', jobTitle: '에어컨/공조 전문가', duration: '2년', salary: '3,800만원' },
      { jobId: 'mgmt_01', jobTitle: '서비스 어드바이저', duration: '현재 4년차', salary: '5,500만원' },
    ],
    totalDuration: '9년',
    salaryChange: '3,000 → 5,500만원 (+83%)',
    keyLessons: [
      '정비 경험이 있으니 고객 설명이 설득력 있었어요',
      'SA는 기술 + 서비스 마인드가 함께 필요합니다',
      '주말 쉬고 깨끗한 환경에서 일하는 게 행복해요',
    ],
    createdAt: '2024-10-20',
  },
  {
    id: 'story_05',
    targetJobId: 'film_02',
    authorName: 'Wrap_Star',
    title: '틴팅에서 랩핑 아티스트까지',
    summary: '창의력 있는 사람이라면 랩핑을 추천합니다. 매번 다른 디자인을 구현하는 재미가 있어요.',
    journeySteps: [
      { jobId: 'body_01', jobTitle: '디테일링 전문가', duration: '1년', salary: '3,000만원' },
      { jobId: 'film_01', jobTitle: '틴터 (썬팅)', duration: '2년', salary: '3,500만원' },
      { jobId: 'film_02', jobTitle: '랩핑 인스톨러', duration: '현재 3년차', salary: '5,500만원' },
    ],
    totalDuration: '6년',
    salaryChange: '3,000 → 5,500만원 (+83%)',
    keyLessons: [
      '틴팅으로 필름 다루는 감각을 익혔어요',
      '색상 조합 감각이 중요해서 미술에 관심 가지세요',
      '인스타그램이 최고의 포트폴리오입니다',
    ],
    createdAt: '2024-09-15',
  },
  {
    id: 'story_06',
    targetJobId: 'maint_15',
    authorName: 'Tuner_King',
    title: '수입차 진단에서 ECU 튜너까지',
    summary: '차를 사랑하는 사람이라면 ECU 튜닝이 꿈의 직업일 거예요. 기술적 깊이와 높은 연봉을 모두 잡았습니다.',
    journeySteps: [
      { jobId: 'maint_01', jobTitle: '경정비 테크니션', duration: '2년', salary: '2,800만원' },
      { jobId: 'maint_14', jobTitle: '수입차 범용 진단가', duration: '3년', salary: '4,500만원' },
      { jobId: 'maint_15', jobTitle: 'ECU 맵퍼 (Tuner)', duration: '현재 5년차', salary: '7,000만원' },
    ],
    totalDuration: '10년',
    salaryChange: '2,800 → 7,000만원 (+150%)',
    keyLessons: [
      '진단 실력이 탄탄해야 튜닝도 잘할 수 있어요',
      '데이터 분석 능력이 핵심입니다',
      '튜닝프로 아카데미 ECU 과정이 도움됐습니다',
    ],
    createdAt: '2024-08-30',
  },
  {
    id: 'story_07',
    targetJobId: 'body_12',
    authorName: 'Tesla_Pro',
    title: '일반 판금에서 테슬라 공인 바디샵까지',
    summary: '알루미늄 용접 기술을 익히고 테슬라 공인 인증을 받은 이야기. 프리미엄 브랜드 인증이 연봉을 바꿨습니다.',
    journeySteps: [
      { jobId: 'body_06', jobTitle: '샌딩/마스킹맨', duration: '1년', salary: '2,800만원' },
      { jobId: 'body_03', jobTitle: '판금 기술자', duration: '4년', salary: '4,200만원' },
      { jobId: 'body_12', jobTitle: '테슬라 공인 바디샵', duration: '현재 2년차', salary: '6,500만원' },
    ],
    totalDuration: '7년',
    salaryChange: '2,800 → 6,500만원 (+132%)',
    keyLessons: [
      '알루미늄 용접 자격증이 핵심이었어요',
      '테슬라 인증 교육은 본사에서 진행됩니다',
      'EV 시대에 알루미늄 바디 수요는 계속 늘어날 거예요',
    ],
    createdAt: '2024-10-05',
  },
  {
    id: 'story_08',
    targetJobId: 'film_09',
    authorName: 'Camper_Dream',
    title: '인테리어 목수에서 캠핑카 빌더로',
    summary: '캠핑을 좋아하던 목수가 취미를 직업으로 바꾼 이야기. 나만의 작품을 만드는 행복이 있습니다.',
    journeySteps: [
      { jobId: 'film_05', jobTitle: '실내 커스터마이징', duration: '2년', salary: '3,500만원' },
      { jobId: 'film_09', jobTitle: '캠핑카 빌더', duration: '현재 3년차', salary: '5,500만원' },
    ],
    totalDuration: '5년',
    salaryChange: '3,500 → 5,500만원 (+57%)',
    keyLessons: [
      '목공 기술이 큰 무기가 됐어요',
      '전기 배선 기본은 꼭 배우세요',
      '캠핑 붐이라 일감이 넘칩니다',
    ],
    createdAt: '2024-09-20',
  },
  {
    id: 'story_09',
    targetJobId: 'ev_04',
    authorName: 'Charger_Life',
    title: '전기 기사에서 충전 인프라 전문가로',
    summary: '전기 분야 경력을 EV 충전 인프라로 전환한 이야기. 숨은 블루오션을 발견했습니다.',
    journeySteps: [
      { jobId: 'ev_01', jobTitle: 'EV 배터리 진단사', duration: '1년', salary: '4,500만원' },
      { jobId: 'ev_04', jobTitle: '충전 인프라 유지보수', duration: '현재 2년차', salary: '5,500만원' },
    ],
    totalDuration: '3년',
    salaryChange: '4,500 → 5,500만원 (+22%)',
    keyLessons: [
      '전기 자격증이 큰 도움이 됐어요',
      '출장이 많지만 그만큼 수당도 좋습니다',
      '아직 이 분야 인력이 부족해서 미래가 밝아요',
    ],
    createdAt: '2024-11-05',
  },
  {
    id: 'story_10',
    targetJobId: 'mgmt_06',
    authorName: 'Evaluator_Pro',
    title: '정비사에서 중고차 평가사로',
    summary: '정비 경험을 살려 중고차 평가사로 전직한 이야기. 몸은 편해지고 연봉은 올랐습니다.',
    journeySteps: [
      { jobId: 'maint_01', jobTitle: '경정비 테크니션', duration: '3년', salary: '3,000만원' },
      { jobId: 'maint_14', jobTitle: '수입차 범용 진단가', duration: '3년', salary: '4,500만원' },
      { jobId: 'mgmt_06', jobTitle: '중고차 평가사', duration: '현재 2년차', salary: '5,200만원' },
    ],
    totalDuration: '8년',
    salaryChange: '3,000 → 5,200만원 (+73%)',
    keyLessons: [
      '정비 경험이 차량 상태 파악에 큰 도움이 됩니다',
      '중고차 평가사 자격증은 어렵지 않아요',
      '체력적으로 훨씬 편해졌어요',
    ],
    createdAt: '2024-10-15',
  },
];

// ============ HELPER FUNCTIONS ============

export function getReviewsForJob(jobId: string): CareerReview[] {
  return careerReviews.filter(r => r.jobId === jobId);
}

export function getSuccessStoriesForJob(jobId: string): SuccessStory[] {
  return successStories.filter(s => s.targetJobId === jobId);
}

export function getVerifiedReviews(): CareerReview[] {
  return careerReviews.filter(r => r.verified);
}

export function getTopReviewsForJob(jobId: string, limit: number = 3): CareerReview[] {
  return careerReviews
    .filter(r => r.jobId === jobId)
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, limit);
}

// Get related job IDs from success stories (for "Jobs in this path")
export function getRelatedJobsFromStories(jobId: string): string[] {
  const story = successStories.find(s => s.targetJobId === jobId);
  if (!story) return [];
  return story.journeySteps.map(step => step.jobId);
}

// Get all reviews for jobs in a category
export function getReviewsByCategory(jobIds: string[]): CareerReview[] {
  return careerReviews.filter(r => jobIds.includes(r.jobId));
}

// Get highest rated reviews
export function getHighestRatedReviews(limit: number = 5): CareerReview[] {
  return [...careerReviews]
    .sort((a, b) => b.rating - a.rating || b.helpful - a.helpful)
    .slice(0, limit);
}

// Get reviews with salary growth info
export function getReviewsWithSalaryGrowth(): CareerReview[] {
  return careerReviews.filter(r => r.salaryGrowth);
}
