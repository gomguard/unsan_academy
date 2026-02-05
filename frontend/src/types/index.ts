export type StatType = 'Tech' | 'Hand' | 'Speed' | 'Art' | 'Biz';

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
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  comments?: Comment[];
}
