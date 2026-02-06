import type { UserProfile, JobCard, Task, DashboardData, Quest, ClassType } from '@/types';

export const mockProfile: UserProfile = {
  id: 1,
  name: '김정비',
  tier: 'C-Class' as ClassType,
  mastery: 350,
  xp: 350, // Legacy alias
  stats: {
    Diagnostic: 45,
    Mechanical: 60,
    Efficiency: 35,
    Quality: 25,
    Communication: 30,
  },
  // New professional stat naming
  stat_diagnostic: 45,
  stat_mechanical: 60,
  stat_efficiency: 35,
  stat_quality: 25,
  stat_communication: 30,
  // Legacy stat naming (for backward compatibility)
  stat_tech: 45,
  stat_hand: 60,
  stat_speed: 35,
  stat_art: 25,
  stat_biz: 30,
  avatar_url: undefined,
  next_tier_mastery: 600,
  next_tier_xp: 600, // Legacy alias
  current_tier_mastery: 300,
  current_tier_xp: 300, // Legacy alias
  unlockedCardIds: ['maint_1', 'body_1', 'tech_1'],
  // Professional profile fields
  currentSalary: 3500,
  currentJobTitle: '경정비 테크니션',
  isVerified: false,
};

export const mockJobCards: JobCard[] = [
  // ========== Track 1: Maintenance (정비) ==========
  {
    id: 'maint_1',
    title: 'Quick-Service Tech',
    koreanTitle: '퀵-서비스 테크니션',
    track: 'Maintenance',
    rank: 1,
    description: '기본적인 정비 업무를 신속하게 처리하는 입문 단계입니다. 오일 교환, 타이어 교체 등 기초 작업을 마스터합니다.',
    requiredStats: { Mechanical: 20 },
    prerequisiteCardIds: [],
    icon: '🔧',
    color: '#3b82f6',
  },
  {
    id: 'maint_2',
    title: 'Chassis Master',
    koreanTitle: '섀시 마스터',
    track: 'Maintenance',
    rank: 2,
    description: '서스펜션, 브레이크, 스티어링 시스템의 전문가. 차량의 뼈대를 완벽하게 이해합니다.',
    requiredStats: { Mechanical: 40, Diagnostic: 30 },
    prerequisiteCardIds: ['maint_1'],
    icon: '🛠️',
    color: '#3b82f6',
  },
  {
    id: 'maint_3',
    title: 'Powertrain Engineer',
    koreanTitle: '파워트레인 엔지니어',
    track: 'Maintenance',
    rank: 3,
    description: '엔진, 변속기, 구동계의 마스터. 차량의 심장을 다루는 최고의 전문가입니다.',
    requiredStats: { Mechanical: 60, Diagnostic: 50 },
    prerequisiteCardIds: ['maint_2'],
    icon: '⚙️',
    color: '#3b82f6',
  },

  // ========== Track 2: Body & Skin (외장) ==========
  {
    id: 'body_1',
    title: 'Car Care Manager',
    koreanTitle: '카 케어 매니저',
    track: 'BodySkin',
    rank: 1,
    description: '세차, 실내 클리닝, 기본 디테일링을 담당합니다. 차량 관리의 첫걸음입니다.',
    requiredStats: { Quality: 20 },
    prerequisiteCardIds: [],
    icon: '🧽',
    color: '#ec4899',
  },
  {
    id: 'body_2',
    title: 'Auto Skin Installer',
    koreanTitle: '오토 스킨 인스톨러',
    track: 'BodySkin',
    rank: 2,
    description: 'PPF, 썬팅, 랩핑 시공의 전문가. 차량 외장을 보호하고 꾸밉니다.',
    requiredStats: { Quality: 40, Mechanical: 30 },
    prerequisiteCardIds: ['body_1'],
    icon: '🎨',
    color: '#ec4899',
  },
  {
    id: 'body_3',
    title: 'Restoration Specialist',
    koreanTitle: '외장 복원 전문가',
    track: 'BodySkin',
    rank: 3,
    description: '판금, 도장, 덴트 복원의 마스터. 어떤 손상도 원상복구합니다.',
    requiredStats: { Quality: 60, Mechanical: 50 },
    prerequisiteCardIds: ['body_2'],
    icon: '✨',
    color: '#ec4899',
  },

  // ========== Track 3: High-Tech (하이테크) ==========
  {
    id: 'tech_1',
    title: 'System Diagnostician',
    koreanTitle: '시스템 진단 평가사',
    track: 'HighTech',
    rank: 1,
    description: 'OBD-II 스캐너를 활용한 기본 진단 능력을 갖춘 테크니션입니다.',
    requiredStats: { Diagnostic: 25 },
    prerequisiteCardIds: [],
    icon: '🔍',
    color: '#10b981',
  },
  {
    id: 'tech_2',
    title: 'Electronic Solution Engineer',
    koreanTitle: '전장 솔루션 엔지니어',
    track: 'HighTech',
    rank: 2,
    description: 'ECU, 센서, 배선 시스템의 전문가. 복잡한 전장 문제를 해결합니다.',
    requiredStats: { Diagnostic: 50 },
    prerequisiteCardIds: ['tech_1'],
    icon: '💡',
    color: '#10b981',
  },
  {
    id: 'tech_3',
    title: 'xEV High-Tech Expert',
    koreanTitle: 'xEV 하이테크 전문가',
    track: 'HighTech',
    rank: 3,
    description: '전기차, 하이브리드 차량의 고전압 시스템 마스터. 미래 모빌리티의 선구자입니다.',
    requiredStats: { Diagnostic: 70 },
    prerequisiteCardIds: ['tech_2'],
    icon: '⚡',
    color: '#10b981',
  },

  // ========== Track 4: Management (경영) ==========
  {
    id: 'mgmt_1',
    title: 'Service Advisor',
    koreanTitle: '서비스 어드바이저',
    track: 'Management',
    rank: 1,
    description: '고객 응대와 상담의 기초를 다집니다. 정비소의 얼굴이 됩니다.',
    requiredStats: { Communication: 20 },
    prerequisiteCardIds: [],
    icon: '🤝',
    color: '#8b5cf6',
  },
  {
    id: 'mgmt_2',
    title: 'Workshop Manager',
    koreanTitle: '워크샵 매니저',
    track: 'Management',
    rank: 2,
    description: '작업장 운영, 일정 관리, 팀 리딩을 담당합니다. 효율의 마스터입니다.',
    requiredStats: { Communication: 45, Efficiency: 30 },
    prerequisiteCardIds: ['mgmt_1'],
    icon: '📋',
    color: '#8b5cf6',
  },
  {
    id: 'mgmt_3',
    title: 'Automotive Director',
    koreanTitle: '오토모티브 디렉터',
    track: 'Management',
    rank: 3,
    description: '정비소 경영의 최고 전문가. 비즈니스 전략과 성장을 이끕니다.',
    requiredStats: { Communication: 65, Efficiency: 40 },
    prerequisiteCardIds: ['mgmt_2'],
    icon: '👔',
    color: '#8b5cf6',
  },

  // ========== Hybrid / Legendary (레전드) ==========
  {
    id: 'legend_flipper',
    title: 'The Flipper',
    koreanTitle: '중고차 연금술사',
    track: 'Hybrid',
    rank: 4,
    description: '폐차 직전의 차량도 새 것처럼 되살려 가치를 극대화하는 전설적인 복원가. "Auction Sniper" 능력 해금.',
    requiredStats: { Mechanical: 50, Quality: 50 },
    prerequisiteCardIds: ['maint_2', 'body_2'],
    isHidden: true,
    icon: '🔄',
    color: '#f59e0b',
  },
  {
    id: 'legend_evtuner',
    title: 'The EV Tuner',
    koreanTitle: '전기차 튜너',
    track: 'Hybrid',
    rank: 4,
    description: '전기차의 퍼포먼스와 외관을 동시에 완성하는 미래형 전문가. 최첨단 기술과 예술의 융합.',
    requiredStats: { Diagnostic: 70, Quality: 50 },
    prerequisiteCardIds: ['tech_3', 'body_2'],
    isHidden: true,
    icon: '⚡',
    color: '#f59e0b',
  },
  {
    id: 'legend_fleet',
    title: 'The Fleet Commander',
    koreanTitle: '플릿 커맨더',
    track: 'Hybrid',
    rank: 4,
    description: '대규모 차량 관리와 운영의 제왕. B2B 시장을 지배하는 전략가.',
    requiredStats: { Communication: 50, Efficiency: 40 },
    prerequisiteCardIds: ['mgmt_2', 'maint_1'],
    isHidden: true,
    icon: '🚛',
    color: '#f59e0b',
  },
];

export const mockTasks: Task[] = [
  {
    id: 1,
    title: '엔진오일 교환 SOP',
    description: '엔진오일 교환 표준 작업 절차를 완료하세요.',
    stat_type: 'Mechanical',
    stat_reward: 2,
    xp_reward: 15,
    requires_photo: true,
    is_daily: true,
    is_completed_today: false,
  },
  {
    id: 2,
    title: '타이어 공기압 점검',
    description: '4개 타이어의 공기압을 점검하고 기록하세요.',
    stat_type: 'Efficiency',
    stat_reward: 1,
    xp_reward: 10,
    requires_photo: false,
    is_daily: true,
    is_completed_today: false,
  },
  {
    id: 3,
    title: 'OBD-II 진단 스캔',
    description: '차량 진단 스캔을 실시하고 결과를 기록하세요.',
    stat_type: 'Diagnostic',
    stat_reward: 3,
    xp_reward: 20,
    requires_photo: true,
    is_daily: true,
    is_completed_today: true,
  },
  {
    id: 4,
    title: '실내 클리닝 서비스',
    description: '차량 실내 청소 및 탈취 작업을 완료하세요.',
    stat_type: 'Quality',
    stat_reward: 2,
    xp_reward: 15,
    requires_photo: true,
    is_daily: true,
    is_completed_today: false,
  },
  {
    id: 5,
    title: '고객 상담 완료',
    description: '고객에게 정비 결과를 설명하고 추가 정비 제안을 하세요.',
    stat_type: 'Communication',
    stat_reward: 2,
    xp_reward: 15,
    requires_photo: false,
    is_daily: true,
    is_completed_today: false,
  },
];

export const mockQuests: Quest[] = [
  // Mechanical stat quests (정비력)
  {
    id: 1,
    title: '엔진오일 교환 인증',
    description: '엔진오일 교환 작업 완료 후 사진을 업로드하세요. 오일 필터와 새 오일이 보이게 촬영해주세요.',
    target_stat: 'Mechanical',
    stat_reward: 2,
    mastery_reward: 20,
    xp_reward: 20, // Legacy alias
    icon: 'Droplets',
    category: 'Daily',
    requires_verification: true,
    requires_photo: true, // Legacy alias
    difficulty: 1,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 12,
  },
  {
    id: 2,
    title: '브레이크 패드 교환',
    description: '브레이크 패드 교환 작업 완료 후 Before/After 사진을 업로드하세요.',
    target_stat: 'Mechanical',
    stat_reward: 3,
    mastery_reward: 30,
    xp_reward: 30,
    icon: 'Disc',
    category: 'Daily',
    requires_verification: true,
    requires_photo: true,
    difficulty: 2,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 5,
  },
  // Diagnostic stat quests (진단력)
  {
    id: 3,
    title: 'OBD 스캐너 진단 완료',
    description: 'OBD-II 스캐너로 차량 진단 후 결과 화면을 캡처하세요. 에러 코드 또는 정상 상태가 보여야 합니다.',
    target_stat: 'Diagnostic',
    stat_reward: 2,
    mastery_reward: 25,
    xp_reward: 25,
    icon: 'Cpu',
    category: 'Daily',
    requires_verification: true,
    requires_photo: true,
    difficulty: 2,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 8,
  },
  {
    id: 4,
    title: '전기 회로 점검',
    description: '멀티미터로 전기 회로 점검 후 측정값이 보이는 사진을 업로드하세요.',
    target_stat: 'Diagnostic',
    stat_reward: 3,
    mastery_reward: 35,
    xp_reward: 35,
    icon: 'Zap',
    category: 'Daily',
    requires_verification: true,
    requires_photo: true,
    difficulty: 3,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 3,
  },
  // Quality stat quests (품질력)
  {
    id: 5,
    title: '거울 마감 광택',
    description: '광택 작업 완료 후 차량 보닛에 비친 반사가 보이는 사진을 업로드하세요.',
    target_stat: 'Quality',
    stat_reward: 3,
    mastery_reward: 30,
    xp_reward: 30,
    icon: 'Sparkles',
    category: 'Daily',
    requires_verification: true,
    requires_photo: true,
    difficulty: 2,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 7,
  },
  {
    id: 6,
    title: '실내 디테일링 완료',
    description: '실내 클리닝 작업 완료 후 깨끗해진 실내 사진을 업로드하세요.',
    target_stat: 'Quality',
    stat_reward: 2,
    mastery_reward: 20,
    xp_reward: 20,
    icon: 'Brush',
    category: 'Daily',
    requires_verification: true,
    requires_photo: true,
    difficulty: 1,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 15,
  },
  // Efficiency stat quests (효율성)
  {
    id: 7,
    title: 'FRT 이내 작업 완료',
    description: '표준 작업 시간(FRT) 이내에 정비 작업을 완료하고 사진을 업로드하세요.',
    target_stat: 'Efficiency',
    stat_reward: 2,
    mastery_reward: 25,
    xp_reward: 25,
    icon: 'Timer',
    category: 'Challenge',
    requires_verification: true,
    requires_photo: true,
    difficulty: 2,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 4,
  },
  {
    id: 8,
    title: '3대 연속 정비',
    description: '3대의 차량을 연속으로 정비 완료 후 마지막 차량 사진을 업로드하세요.',
    target_stat: 'Efficiency',
    stat_reward: 3,
    mastery_reward: 40,
    xp_reward: 40,
    icon: 'Rocket',
    category: 'Challenge',
    requires_verification: true,
    requires_photo: true,
    difficulty: 3,
    cooldown_hours: 24,
    is_available: false,
    last_completed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    total_completions: 2,
  },
  // Communication stat quests (소통력)
  {
    id: 9,
    title: '50만원 이상 정비 완료',
    description: '50만원 이상의 정비 견적서 또는 영수증을 업로드하세요. (개인정보는 가려주세요)',
    target_stat: 'Communication',
    stat_reward: 3,
    mastery_reward: 35,
    xp_reward: 35,
    icon: 'Receipt',
    category: 'Daily',
    requires_verification: true,
    requires_photo: true,
    difficulty: 2,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 6,
  },
  {
    id: 10,
    title: '고객 리뷰 획득',
    description: '고객에게 긍정적인 리뷰를 받고 스크린샷을 업로드하세요.',
    target_stat: 'Communication',
    stat_reward: 2,
    mastery_reward: 25,
    xp_reward: 25,
    icon: 'Star',
    category: 'Daily',
    requires_verification: true,
    requires_photo: true,
    difficulty: 2,
    cooldown_hours: 24,
    is_available: true,
    total_completions: 9,
  },
  // Weekly challenges (주간 과제)
  {
    id: 11,
    title: '주간: 모든 역량 올리기',
    description: '이번 주 동안 5가지 역량을 모두 1회 이상 올리세요.',
    target_stat: 'Diagnostic',
    stat_reward: 5,
    mastery_reward: 100,
    xp_reward: 100,
    icon: 'Trophy',
    category: 'Weekly',
    requires_verification: false,
    requires_photo: false,
    difficulty: 4,
    cooldown_hours: 168,
    is_available: true,
    total_completions: 1,
  },
  {
    id: 12,
    title: '주간: 10개 작업 완료',
    description: '이번 주 동안 10개의 작업 기록을 완료하세요.',
    target_stat: 'Efficiency',
    stat_reward: 5,
    mastery_reward: 100,
    xp_reward: 100,
    icon: 'Target',
    category: 'Weekly',
    requires_verification: false,
    requires_photo: false,
    difficulty: 4,
    cooldown_hours: 168,
    is_available: true,
    total_completions: 0,
  },
];

export const mockDashboardData: DashboardData = {
  profile: mockProfile,
  job_cards: mockJobCards,
  daily_tasks: mockTasks,
  today_completions: [
    {
      id: 1,
      task: 3,
      task_title: 'OBD-II 진단 스캔',
      stat_type: 'Diagnostic',
      stat_reward: 3,
      completed_at: new Date().toISOString(),
    },
  ],
};

// Helper functions
export function isCardUnlockable(card: JobCard, profile: UserProfile): boolean {
  // Check stat requirements
  for (const [stat, required] of Object.entries(card.requiredStats)) {
    if ((profile.stats[stat as keyof typeof profile.stats] || 0) < (required as number)) {
      return false;
    }
  }

  // Check prerequisite cards
  for (const prereqId of card.prerequisiteCardIds) {
    if (!profile.unlockedCardIds.includes(prereqId)) {
      return false;
    }
  }

  return true;
}

export function isCardUnlocked(cardId: string, profile: UserProfile): boolean {
  return profile.unlockedCardIds.includes(cardId);
}

export function getCardsByTrack(cards: JobCard[], track: string): JobCard[] {
  return cards.filter(c => c.track === track).sort((a, b) => a.rank - b.rank);
}

// Simulate API call
export const simulateCompleteTask = (
  taskId: number,
  profile: UserProfile
): Promise<{
  success: boolean;
  stat_updated: string;
  stat_change: number;
  new_value: number;
  mastery_gained: number;
  xp_gained: number; // Legacy alias
  total_mastery: number;
  total_xp: number; // Legacy alias
  class: ClassType;
  tier: ClassType; // Legacy alias
  newly_unlocked_cards: string[];
}> => {
  return new Promise((resolve) => {
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const statField = task.stat_type;
    const currentValue = profile.stats[statField];
    const newValue = Math.min(100, currentValue + task.stat_reward);
    const newMastery = profile.mastery + task.xp_reward;

    // Professional Class progression (based on mastery points)
    let newClass: ClassType = profile.tier;
    if (newMastery >= 10000) newClass = 'Master';
    else if (newMastery >= 5000) newClass = 'S-Class';
    else if (newMastery >= 2000) newClass = 'A-Class';
    else if (newMastery >= 500) newClass = 'B-Class';
    else if (newMastery >= 100) newClass = 'C-Class';
    else newClass = 'Trainee';

    const newlyUnlocked: string[] = [];

    setTimeout(() => {
      resolve({
        success: true,
        stat_updated: task.stat_type,
        stat_change: task.stat_reward,
        new_value: newValue,
        mastery_gained: task.xp_reward,
        xp_gained: task.xp_reward, // Legacy alias
        total_mastery: newMastery,
        total_xp: newMastery, // Legacy alias
        class: newClass,
        tier: newClass, // Legacy alias
        newly_unlocked_cards: newlyUnlocked,
      });
    }, 500);
  });
};
