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
