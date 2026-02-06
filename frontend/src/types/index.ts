export type StatType = 'Tech' | 'Hand' | 'Speed' | 'Art' | 'Biz';

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

export type TierType = 'Unranked' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export type JobTrack = 'Maintenance' | 'BodySkin' | 'HighTech' | 'Management' | 'Hybrid';

export type JobRank = 1 | 2 | 3 | 4;

export interface Stats {
  Tech: number;
  Hand: number;
  Speed: number;
  Art: number;
  Biz: number;
}

export interface UserProfile {
  id: number;
  name: string;
  tier: TierType;
  xp: number;
  stats: Stats;
  stat_tech: number;
  stat_hand: number;
  stat_speed: number;
  stat_art: number;
  stat_biz: number;
  avatar_url?: string;
  next_tier_xp: number;
  current_tier_xp: number;
  unlockedCardIds: string[];
  // New professional profile fields
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

export const rankInfo: Record<JobRank, { name: string; koreanName: string }> = {
  1: { name: 'Novice', koreanName: '입문' },
  2: { name: 'Pro', koreanName: '전문가' },
  3: { name: 'Master', koreanName: '마스터' },
  4: { name: 'Legend', koreanName: '레전드' },
};

// ============ QUEST/MISSION TYPES ============

export type QuestCategory = 'Daily' | 'Weekly' | 'Challenge' | 'Special';

export const questCategoryInfo: Record<QuestCategory, { name: string; color: string; bgColor: string }> = {
  Daily: { name: '일일 미션', color: '#3b82f6', bgColor: 'bg-blue-500/20' },
  Weekly: { name: '주간 미션', color: '#8b5cf6', bgColor: 'bg-purple-500/20' },
  Challenge: { name: '도전 과제', color: '#f59e0b', bgColor: 'bg-amber-500/20' },
  Special: { name: '특별 미션', color: '#ec4899', bgColor: 'bg-pink-500/20' },
};

export interface Quest {
  id: number;
  title: string;
  description: string;
  target_stat: StatType;
  stat_reward: number;
  xp_reward: number;
  icon: string;
  category: QuestCategory;
  requires_photo: boolean;
  difficulty: number;
  cooldown_hours: number;
  is_available: boolean; // Can be completed now
  last_completed_at?: string;
  total_completions: number;
}

export interface QuestCompletion {
  id: number;
  quest_id: number;
  quest_title: string;
  target_stat: StatType;
  stat_reward: number;
  xp_reward: number;
  proof_image_url?: string;
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
