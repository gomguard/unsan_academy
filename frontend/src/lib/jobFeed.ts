// Mock Real-Time Job Feed Service
// Simulates data from Saramin API, Tesla Careers, etc.
// NOTE: URLs are mock examples - in production, these would be real job posting links

export type JobBadge = 'Official' | 'Exclusive' | 'Hot' | 'New';

export interface JobPosting {
  id: string;
  companyName: string;
  companyLogo?: string; // emoji or image URL
  title: string;
  url: string;
  salary?: string;
  location?: string;
  badge?: JobBadge;
  deadline: string; // e.g., "D-5", "상시", "~3/15"
  source: 'Saramin' | 'JobKorea' | 'Official' | 'LinkedIn' | 'Wanted';
}

// Mock job postings database
// URL patterns follow actual job site formats
const mockJobPostings: Record<string, JobPosting[]> = {
  // EV 고전압 배터리 진단사 (ev_01)
  'ev_01': [
    {
      id: 'post_001',
      companyName: 'Tesla Korea',
      companyLogo: '🚗',
      title: '전기차 고전압 배터리 테크니션 채용',
      url: 'https://www.tesla.com/ko_kr/careers/search/job/service-technician-korea-242891',
      salary: '5,000~7,000만원',
      location: '경기 용인',
      badge: 'Hot',
      deadline: 'D-5',
      source: 'Official',
    },
    {
      id: 'post_002',
      companyName: '현대 블루핸즈',
      companyLogo: '🔵',
      title: 'EV전담반 배터리 진단사 모집',
      url: 'https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=48521234',
      salary: '4,500~6,500만원',
      location: '서울 강남',
      badge: 'Official',
      deadline: '상시',
      source: 'Saramin',
    },
    {
      id: 'post_003',
      companyName: '에코프로',
      companyLogo: '♻️',
      title: '폐배터리 진단/평가사 경력직',
      url: 'https://www.jobkorea.co.kr/Recruit/GI_Read/44125789',
      salary: '4,800~6,000만원',
      location: '충북 청주',
      badge: 'New',
      deadline: 'D-12',
      source: 'JobKorea',
    },
  ],

  // PPF 인스톨러 (film_03)
  'film_03': [
    {
      id: 'post_004',
      companyName: '리코쉴드',
      companyLogo: '🛡️',
      title: 'PPF 인스톨러 (경력 우대)',
      url: 'https://www.jobkorea.co.kr/Recruit/GI_Read/44098765',
      salary: '3,500~8,000만원+인센',
      location: '서울 강서',
      badge: 'Hot',
      deadline: 'D-3',
      source: 'JobKorea',
    },
    {
      id: 'post_005',
      companyName: 'XPEL Korea',
      companyLogo: '✨',
      title: 'PPF 시공 전문가 (공인 교육 제공)',
      url: 'https://www.wanted.co.kr/wd/215847',
      salary: '협의',
      location: '경기 분당',
      badge: 'Exclusive',
      deadline: '상시',
      source: 'Wanted',
    },
  ],

  // 수입차 서비스 어드바이저
  'mgmt_01': [
    {
      id: 'post_006',
      companyName: '코오롱모터스 (BMW)',
      companyLogo: '🚙',
      title: 'BMW 서비스 어드바이저 채용',
      url: 'https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=48456123',
      salary: '4,000~5,500만원',
      location: '서울 서초',
      badge: 'Official',
      deadline: 'D-7',
      source: 'Saramin',
    },
    {
      id: 'post_007',
      companyName: '스타자동차 (Mercedes-Benz)',
      companyLogo: '⭐',
      title: 'SA 경력직 긴급 채용',
      url: 'https://www.wanted.co.kr/wd/198456',
      salary: '4,500~6,000만원',
      location: '서울 강남',
      badge: 'Hot',
      deadline: 'D-2',
      source: 'Wanted',
    },
  ],

  // 중고차 평가사 (mgmt_06)
  'mgmt_06': [
    {
      id: 'post_008',
      companyName: '현대글로비스 (오토벨)',
      companyLogo: '🚐',
      title: '중고차 진단평가사 신입/경력',
      url: 'https://www.jobkorea.co.kr/Recruit/GI_Read/44087654',
      salary: '3,800~5,000만원',
      location: '전국 지점',
      badge: 'Official',
      deadline: '상시',
      source: 'JobKorea',
    },
    {
      id: 'post_009',
      companyName: 'K-Car',
      companyLogo: '🔑',
      title: '차량 진단 전문가 모집',
      url: 'https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=48398765',
      salary: '4,000~5,500만원',
      location: '경기 화성',
      badge: 'New',
      deadline: 'D-10',
      source: 'Saramin',
    },
  ],

  // 테슬라 공인 바디샵 (body_12)
  'body_12': [
    {
      id: 'post_010',
      companyName: 'Tesla Approved Body Shop',
      companyLogo: '🚗',
      title: '테슬라 공인 바디샵 테크니션',
      url: 'https://www.tesla.com/ko_kr/careers/search/job/body-repair-technician-243567',
      salary: '5,000~7,000만원',
      location: '경기 기흥',
      badge: 'Exclusive',
      deadline: 'D-14',
      source: 'Official',
    },
    {
      id: 'post_011',
      companyName: '천우모터스',
      companyLogo: '🔧',
      title: '알루미늄 바디 수리 전문가',
      url: 'https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=48512345',
      salary: '4,500~6,500만원',
      location: '경기 용인',
      badge: 'Hot',
      deadline: 'D-5',
      source: 'Saramin',
    },
  ],

  // ADAS 캘리브레이션 전문가 (ev_03)
  'ev_03': [
    {
      id: 'post_012',
      companyName: '한국자동차튜닝협회',
      companyLogo: '🎯',
      title: 'ADAS 캘리브레이션 기술자 양성',
      url: 'https://www.jobkorea.co.kr/Recruit/GI_Read/44156789',
      salary: '교육 후 취업연계',
      location: '서울 성동',
      badge: 'New',
      deadline: '~3/31',
      source: 'JobKorea',
    },
  ],

  // 자율주행 센서 기술자 (ev_09)
  'ev_09': [
    {
      id: 'post_013',
      companyName: '현대모비스',
      companyLogo: '🔬',
      title: '자율주행 센서 정비 엔지니어',
      url: 'https://www.linkedin.com/jobs/view/3845672190',
      salary: '6,000~8,000만원',
      location: '경기 의왕',
      badge: 'Official',
      deadline: 'D-20',
      source: 'LinkedIn',
    },
  ],

  // EV 모터/감속기 수리사 (ev_02)
  'ev_02': [
    {
      id: 'post_014',
      companyName: '기아 오토큐',
      companyLogo: '🔴',
      title: 'EV 고전압 시스템 정비사',
      url: 'https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=48567890',
      salary: '5,200~7,200만원',
      location: '서울 구로',
      badge: 'Hot',
      deadline: 'D-8',
      source: 'Saramin',
    },
  ],

  // 하이브리드 전문가 (maint_17)
  'maint_17': [
    {
      id: 'post_015',
      companyName: '효성토요타',
      companyLogo: '🚘',
      title: '하이브리드 전문 테크니션',
      url: 'https://www.jobkorea.co.kr/Recruit/GI_Read/44234567',
      salary: '4,200~5,800만원',
      location: '서울 송파',
      badge: 'Official',
      deadline: 'D-15',
      source: 'JobKorea',
    },
  ],
};

// Get job postings for a specific job
export function getJobPostings(jobId: string): JobPosting[] {
  return mockJobPostings[jobId] || [];
}

// Get all active postings count
export function getActivePostingsCount(): number {
  return Object.values(mockJobPostings).flat().length;
}

// Get badge styling
export function getBadgeStyle(badge: JobBadge): { bg: string; text: string } {
  switch (badge) {
    case 'Hot':
      return { bg: 'bg-red-100', text: 'text-red-600' };
    case 'Exclusive':
      return { bg: 'bg-purple-100', text: 'text-purple-600' };
    case 'Official':
      return { bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'New':
      return { bg: 'bg-green-100', text: 'text-green-600' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-600' };
  }
}

// Get source icon
export function getSourceIcon(source: JobPosting['source']): string {
  switch (source) {
    case 'Saramin':
      return '🔍';
    case 'JobKorea':
      return '💼';
    case 'Official':
      return '✅';
    case 'LinkedIn':
      return '🔗';
    case 'Wanted':
      return '💫';
    default:
      return '📋';
  }
}
