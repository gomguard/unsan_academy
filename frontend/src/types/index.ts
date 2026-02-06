// ============ PROFESSIONAL STAT SYSTEM ============
// Pentagon Chart: 5 Core Professional Competencies

export type StatType = 'Diagnostic' | 'Mechanical' | 'Efficiency' | 'Quality' | 'Communication';

// Legacy stat mapping for backward compatibility
export const legacyStatMapping: Record<string, StatType> = {
  Tech: 'Diagnostic',
  Hand: 'Mechanical',
  Speed: 'Efficiency',
  Art: 'Quality',
  Biz: 'Communication',
};

export const statInfo: Record<StatType, { name: string; shortName: string; description: string; icon: string }> = {
  Diagnostic: { name: '진단력', shortName: 'D', description: '데이터 분석 및 문제 진단 능력', icon: '🧠' },
  Mechanical: { name: '정비력', shortName: 'M', description: '물리적 수리 속도 및 정밀도', icon: '🔧' },
  Efficiency: { name: '효율성', shortName: 'E', description: '표준 시간(FRT) 대비 작업 효율', icon: '⏱️' },
  Quality: { name: '품질력', shortName: 'Q', description: '마감 품질 및 재작업률', icon: '✨' },
  Communication: { name: '소통력', shortName: 'C', description: '고객 응대 및 업셀링 능력', icon: '💬' },
};

// ============ EDUCATION TYPES ============

export type CourseType = 'Online' | 'Offline' | 'Hybrid';
export type CourseCategory = 'Maintenance' | 'Tuning' | 'EV_Future' | 'Body' | 'Management';

export interface Academy {
  id: string;
  name: string;           // e.g. "한국폴리텍대학", "J's Detailing Academy"
  logo: string;           // Emoji or URL
  description: string;
  location?: string;      // "서울 강남" or "전국" for online
  isPartner: boolean;     // True = Verified Partner Badge (Premium)
  website?: string;
}

export interface Course {
  id: string;
  academyId: string;
  title: string;          // e.g. "전기차 고전압 배터리 진단 실무"
  description: string;
  targetJobIds: string[]; // Links to JobCards (e.g. ['ev_01', 'ev_02'])
  category: CourseCategory;
  type: CourseType;
  duration: string;       // "3일" or "4주"
  price: number;          // In 만원, 0 = Free
  priceNote?: string;     // "국비지원", "내일배움카드 적용"
  tags: string[];         // ["국비지원", "내일배움카드", "주말반", "실습위주"]
  certifications?: string[]; // Certifications you can get
  url: string;            // External registration link
  thumbnail?: string;     // Course image
  rating?: number;        // 1-5 stars
  enrollCount?: number;   // Number of enrollees
}

export const courseCategoryInfo: Record<CourseCategory, { name: string; icon: string; color: string }> = {
  Maintenance: { name: '정비', icon: '🔧', color: '#3b82f6' },
  Body: { name: '외장/복원', icon: '🎨', color: '#ec4899' },
  Tuning: { name: '튜닝/필름', icon: '🎬', color: '#f59e0b' },
  EV_Future: { name: 'EV/미래차', icon: '⚡', color: '#8b5cf6' },
  Management: { name: '경영/서비스', icon: '📊', color: '#6366f1' },
};

export const courseTypeInfo: Record<CourseType, { name: string; icon: string; color: string }> = {
  Online: { name: '온라인', icon: '💻', color: '#3b82f6' },
  Offline: { name: '오프라인', icon: '🏫', color: '#10b981' },
  Hybrid: { name: '블렌디드', icon: '🔄', color: '#8b5cf6' },
};

// Salary Simulator Types
export type JobStatType = 'T' | 'H' | 'S' | 'A' | 'B';

export interface SalaryInfo {
  base: number;       // Entry level salary in 만원 (e.g., 3500)
  cap: number;        // Maximum salary in 만원 (e.g., 8000)
  growthRate: number; // Curve steepness (0.1~0.3)
  keyStat: JobStatType; // The stat that boosts salary
}

// ============ CLASS SYSTEM (Professional Grading) ============
// Replaces game-like "Tier" with professional "Class" system

export type ClassType = 'Trainee' | 'C-Class' | 'B-Class' | 'A-Class' | 'S-Class' | 'Master';

// Legacy tier type for backward compatibility
export type TierType = ClassType;

export const classInfo: Record<ClassType, { name: string; description: string; color: string; minMastery: number }> = {
  Trainee: { name: '수습', description: '교육 이수 중', color: '#6b7280', minMastery: 0 },
  'C-Class': { name: 'C등급', description: '기본 업무 수행 가능', color: '#a78bfa', minMastery: 100 },
  'B-Class': { name: 'B등급', description: '독립 작업 가능', color: '#22d3ee', minMastery: 500 },
  'A-Class': { name: 'A등급', description: '전문가 수준', color: '#fbbf24', minMastery: 2000 },
  'S-Class': { name: 'S등급', description: '마스터 수준', color: '#f472b6', minMastery: 5000 },
  Master: { name: '명장', description: '업계 최고 전문가', color: '#c084fc', minMastery: 10000 },
};

// Legacy tier mapping for backward compatibility
export const legacyTierMapping: Record<string, ClassType> = {
  Unranked: 'Trainee',
  Bronze: 'C-Class',
  Silver: 'C-Class',
  Gold: 'B-Class',
  Platinum: 'A-Class',
  Diamond: 'S-Class',
};

export type JobTrack = 'Maintenance' | 'BodySkin' | 'HighTech' | 'Management' | 'Hybrid';

export type JobRank = 1 | 2 | 3 | 4;

// Professional Competency Stats
export interface Stats {
  Diagnostic: number;    // 진단력 (was Tech)
  Mechanical: number;    // 정비력 (was Hand)
  Efficiency: number;    // 효율성 (was Speed)
  Quality: number;       // 품질력 (was Art)
  Communication: number; // 소통력 (was Biz)
}

// Legacy stats interface for backward compatibility
export interface LegacyStats {
  Tech: number;
  Hand: number;
  Speed: number;
  Art: number;
  Biz: number;
}

export interface UserProfile {
  id: number;
  name: string;
  tier: TierType;              // ClassType (for display: C-Class, B-Class, etc.)
  mastery: number;             // Professional experience points (was xp)
  xp: number;                  // Legacy alias for mastery
  stats: Stats;
  // New professional stat naming
  stat_diagnostic: number;     // was stat_tech
  stat_mechanical: number;     // was stat_hand
  stat_efficiency: number;     // was stat_speed
  stat_quality: number;        // was stat_art
  stat_communication: number;  // was stat_biz
  // Legacy stat naming (for backward compatibility)
  stat_tech: number;
  stat_hand: number;
  stat_speed: number;
  stat_art: number;
  stat_biz: number;
  avatar_url?: string;
  next_tier_mastery: number;   // was next_tier_xp
  next_tier_xp: number;        // Legacy alias
  current_tier_mastery: number; // was current_tier_xp
  current_tier_xp: number;     // Legacy alias
  unlockedCardIds: string[];
  // Professional profile fields
  currentSalary?: number;         // User's current salary in 만원
  currentJobTitle?: string;       // Current job title
  isVerified?: boolean;           // Salary verification status
}

export interface JobCard {
  id: string;
  title: string;
  koreanTitle: string;
  track: JobTrack;
  rank: JobRank;
  description: string;
  requiredStats: Partial<Record<StatType, number>>;
  prerequisiteCardIds: string[];
  isHidden?: boolean;
  icon: string;
  color: string;
}

// ============ SOP (Standard Operating Procedure) ============
// Replaces game-like "Task/Quest" with professional "SOP"

export interface SOP {
  id: number;
  code: string;                   // e.g., "US-M-001" (Unsan-Maintenance-001)
  title: string;                  // e.g., "Engine Oil Replacement (Standard)"
  description: string;            // Technical procedure description
  target_stat: StatType;          // Primary competency developed
  mastery_value: number;          // Mastery points earned (was stat_reward)
  standard_time_minutes: number;  // FRT (Flat Rate Time) in minutes
  certification_required: boolean; // Requires certification to perform
  requires_verification: boolean; // Requires photo/supervisor verification
  category: SOPCategory;
  difficulty_level: 1 | 2 | 3 | 4 | 5; // Technical difficulty
  is_available: boolean;
}

export type SOPCategory = 'Maintenance' | 'Diagnostic' | 'BodyRepair' | 'Electrical' | 'CustomerService';

export const sopCategoryInfo: Record<SOPCategory, { name: string; color: string; icon: string }> = {
  Maintenance: { name: '정비', color: '#3b82f6', icon: '🔧' },
  Diagnostic: { name: '진단', color: '#8b5cf6', icon: '🔍' },
  BodyRepair: { name: '바디', color: '#ec4899', icon: '🎨' },
  Electrical: { name: '전장', color: '#f59e0b', icon: '⚡' },
  CustomerService: { name: '서비스', color: '#10b981', icon: '💬' },
};

// ============ WORK LOG ============
// Replaces game-like "Mission/TaskCompletion" with professional "WorkLog"

export interface WorkLog {
  id: number;
  sop_id: number;
  sop_code: string;
  sop_title: string;
  target_stat: StatType;
  mastery_earned: number;         // was stat_reward
  actual_time_minutes: number;    // Actual time taken
  standard_time_minutes: number;  // Expected FRT
  efficiency_rating: number;      // actual/standard ratio
  verification_image_url?: string; // was photo_url
  supervisor_verified: boolean;
  completed_at: string;
  notes?: string;                 // Work notes
}

// Legacy Task interface for backward compatibility
export interface Task {
  id: number;
  title: string;
  description: string;
  stat_type: StatType;
  stat_reward: number;
  xp_reward: number;
  requires_photo: boolean;
  is_daily: boolean;
  is_completed_today: boolean;
}

export interface TaskCompletion {
  id: number;
  task: number;
  task_title: string;
  stat_type: StatType;
  stat_reward: number;
  photo_url?: string;
  completed_at: string;
}

export interface DashboardData {
  profile: UserProfile;
  job_cards: JobCard[];
  daily_tasks: Task[];
  today_completions: TaskCompletion[];
}

export interface CompleteTaskResponse {
  success: boolean;
  stat_updated: StatType;
  stat_change: number;
  new_value: number;
  xp_gained: number;
  total_xp: number;
  tier: TierType;
  newly_unlocked_cards: string[];
}

// Track metadata
export const trackInfo: Record<JobTrack, { name: string; color: string; bgColor: string; icon: string }> = {
  Maintenance: { name: '정비', color: '#3b82f6', bgColor: 'bg-blue-50', icon: '🔧' },
  BodySkin: { name: '외장', color: '#ec4899', bgColor: 'bg-pink-50', icon: '🎨' },
  HighTech: { name: '하이테크', color: '#10b981', bgColor: 'bg-emerald-50', icon: '💻' },
  Management: { name: '경영', color: '#8b5cf6', bgColor: 'bg-purple-50', icon: '📊' },
  Hybrid: { name: '레전드', color: '#f59e0b', bgColor: 'bg-amber-50', icon: '⭐' },
};

// Professional Job Classification
export const rankInfo: Record<JobRank, { name: string; koreanName: string; classRequired: ClassType }> = {
  1: { name: 'Entry', koreanName: '입문', classRequired: 'Trainee' },
  2: { name: 'Skilled', koreanName: '숙련', classRequired: 'C-Class' },
  3: { name: 'Expert', koreanName: '전문', classRequired: 'B-Class' },
  4: { name: 'Specialist', koreanName: '특급', classRequired: 'A-Class' },
};

// ============ WORK LOG CATEGORIES ============
// Professional work tracking (replaces Quest/Mission)

export type WorkLogCategory = 'Routine' | 'Scheduled' | 'Certification' | 'Special';

export const workLogCategoryInfo: Record<WorkLogCategory, { name: string; color: string; bgColor: string }> = {
  Routine: { name: '정기 작업', color: '#3b82f6', bgColor: 'bg-blue-500/20' },
  Scheduled: { name: '예정 작업', color: '#8b5cf6', bgColor: 'bg-purple-500/20' },
  Certification: { name: '인증 작업', color: '#f59e0b', bgColor: 'bg-amber-500/20' },
  Special: { name: '특수 작업', color: '#ec4899', bgColor: 'bg-pink-500/20' },
};

// Legacy Quest types for backward compatibility
export type QuestCategory = 'Daily' | 'Weekly' | 'Challenge' | 'Special';

export const questCategoryInfo: Record<QuestCategory, { name: string; color: string; bgColor: string }> = {
  Daily: { name: '정기 작업', color: '#3b82f6', bgColor: 'bg-blue-500/20' },
  Weekly: { name: '주간 점검', color: '#8b5cf6', bgColor: 'bg-purple-500/20' },
  Challenge: { name: '인증 과제', color: '#f59e0b', bgColor: 'bg-amber-500/20' },
  Special: { name: '특수 작업', color: '#ec4899', bgColor: 'bg-pink-500/20' },
};

export interface Quest {
  id: number;
  title: string;
  description: string;
  target_stat: StatType;
  stat_reward: number;
  mastery_reward: number;        // was xp_reward
  xp_reward: number;             // Legacy alias
  icon: string;
  category: QuestCategory;
  requires_verification: boolean; // was requires_photo
  requires_photo: boolean;       // Legacy alias
  difficulty: number;
  cooldown_hours: number;
  is_available: boolean;
  last_completed_at?: string;
  total_completions: number;
}

export interface QuestCompletion {
  id: number;
  quest_id: number;
  quest_title: string;
  target_stat: StatType;
  stat_reward: number;
  mastery_reward: number;        // was xp_reward
  xp_reward: number;             // Legacy alias
  verification_image_url?: string; // was proof_image_url
  proof_image_url?: string;      // Legacy alias
  completed_at: string;
}

// ============ COMMUNITY TYPES ============

export type PostCategory = 'Free' | 'Tech' | 'Salary' | 'Career';

export const postCategoryInfo: Record<PostCategory, { name: string; icon: string; color: string }> = {
  Free: { name: '자유게시판', icon: '🗣️', color: '#6366f1' },
  Tech: { name: '기술 Q&A', icon: '🔧', color: '#3b82f6' },
  Salary: { name: '연봉 대나무숲', icon: '💸', color: '#10b981' },
  Career: { name: '이직/커리어', icon: '🚀', color: '#f59e0b' },
};

export interface PostAuthor {
  id: number;
  name: string;
  tier: TierType;
  avatar_url?: string;
  stats: Stats;
  stat_tech: number;
  stat_hand: number;
  stat_speed: number;
  stat_art: number;
  stat_biz: number;
  // Salary verification
  current_salary?: number;
  salary_verification_status?: VerificationStatus;
}

export interface Comment {
  id: number;
  post: number;
  author: PostAuthor;
  content: string;
  likes: number;
  is_mine: boolean;
  created_at: string;
}

export interface SalaryGapData {
  currentSalary: number;
  marketValue: number;
  gap: number;
  percentile: number;
  jobTitle: string;
  years: number;
}

// ============ SALARY REPORT TYPES ============

export type VerificationStatus = 'None' | 'Pending' | 'Verified' | 'Rejected';

export interface SalaryReport {
  id: number;
  user: number;
  user_name?: string;
  user_tier?: TierType;
  target_job_id: string;
  target_job_title: string;
  current_salary: number;
  estimated_salary: number;
  market_min: number;
  market_max: number;
  percentile: number;
  years_experience: number;
  user_stats: {
    T: number;
    H: number;
    S: number;
    A: number;
    B: number;
  };
  salary_gap: number;
  gap_percent: number;
  proof_image: string | null;
  status: VerificationStatus;
  status_display: string;
  verified_at: string | null;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSalaryReportData {
  target_job_id: string;
  target_job_title: string;
  current_salary: number;
  estimated_salary: number;
  market_min: number;
  market_max: number;
  percentile: number;
  years_experience: number;
  user_stats: {
    T: number;
    H: number;
    S: number;
    A: number;
    B: number;
  };
}

export const verificationStatusInfo: Record<VerificationStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  None: { label: '미인증', color: '#6b7280', bgColor: 'bg-slate-500/20' },
  Pending: { label: '심사 중', color: '#f59e0b', bgColor: 'bg-yellow-500/20' },
  Verified: { label: '인증 완료', color: '#22c55e', bgColor: 'bg-green-500/20' },
  Rejected: { label: '반려됨', color: '#ef4444', bgColor: 'bg-red-500/20' },
};

export interface Post {
  id: number;
  author: PostAuthor;
  category: PostCategory;
  category_display: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  comment_count: number;
  is_liked: boolean;
  is_mine: boolean;
  verified_card?: number;
  verified_card_title?: string;
  attached_salary_data?: SalaryGapData;
  show_verified_salary?: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  comments?: Comment[];
}
