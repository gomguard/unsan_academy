import { create } from 'zustand';
import type { UserProfile, JobCard, Task, TaskCompletion, TierType, StatType } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  statType?: StatType;
  statChange?: number;
}

interface AppState {
  // User data
  profile: UserProfile | null;
  jobCards: JobCard[];
  dailyTasks: Task[];
  todayCompletions: TaskCompletion[];

  // Salary & Career GPS
  currentSalary: number | null; // User's actual current salary (만원)
  focusPath: string[]; // Career GPS: job IDs in the focused path
  targetJobId: string | null; // The target job user wants to reach

  // UI state
  isLoading: boolean;
  toasts: Toast[];
  selectedCardId: string | null;
  highlightedPath: string[];

  // Actions
  setProfile: (profile: UserProfile) => void;
  setJobCards: (cards: JobCard[]) => void;
  setDailyTasks: (tasks: Task[]) => void;
  setTodayCompletions: (completions: TaskCompletion[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedCardId: (cardId: string | null) => void;
  setHighlightedPath: (path: string[]) => void;

  // Salary & Career GPS actions
  setCurrentSalary: (salary: number | null) => void;
  setFocusPath: (path: string[]) => void;
  setTargetJobId: (jobId: string | null) => void;
  clearFocusMode: () => void;

  // Card helpers
  isCardUnlocked: (cardId: string) => boolean;
  getCardById: (cardId: string) => JobCard | undefined;
  getPrerequisitePath: (cardId: string) => string[];

  // Task completion
  completeTask: (
    taskId: number,
    result: {
      stat_type: StatType;
      stat_change: number;
      new_value: number;
      xp_gained: number;
      total_xp: number;
      tier: TierType;
      newly_unlocked_cards: string[];
    }
  ) => void;

  // Card unlock
  unlockCard: (cardId: string) => void;

  // Toasts
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  jobCards: [],
  dailyTasks: [],
  todayCompletions: [],
  currentSalary: null,
  focusPath: [],
  targetJobId: null,
  isLoading: false,
  toasts: [],
  selectedCardId: null,
  highlightedPath: [],

  setProfile: (profile) => set({ profile }),
  setJobCards: (cards) => set({ jobCards: cards }),
  setDailyTasks: (tasks) => set({ dailyTasks: tasks }),
  setTodayCompletions: (completions) => set({ todayCompletions: completions }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSelectedCardId: (cardId) => set({ selectedCardId: cardId }),
  setHighlightedPath: (path) => set({ highlightedPath: path }),

  // Salary & Career GPS
  setCurrentSalary: (salary) => set({ currentSalary: salary }),
  setFocusPath: (path) => set({ focusPath: path }),
  setTargetJobId: (jobId) => set({ targetJobId: jobId }),
  clearFocusMode: () => set({ focusPath: [], targetJobId: null }),

  isCardUnlocked: (cardId) => {
    const { profile } = get();
    return profile?.unlockedCardIds.includes(cardId) ?? false;
  },

  getCardById: (cardId) => {
    const { jobCards } = get();
    return jobCards.find(c => c.id === cardId);
  },

  getPrerequisitePath: (cardId) => {
    const { jobCards } = get();
    const card = jobCards.find(c => c.id === cardId);
    if (!card) return [];

    const path: string[] = [cardId];
    const visited = new Set<string>();

    function collectPrereqs(id: string) {
      if (visited.has(id)) return;
      visited.add(id);

      const c = jobCards.find(x => x.id === id);
      if (!c) return;

      for (const prereqId of c.prerequisiteCardIds) {
        path.push(prereqId);
        collectPrereqs(prereqId);
      }
    }

    collectPrereqs(cardId);
    return path;
  },

  completeTask: (taskId, result) => {
    const { profile, dailyTasks } = get();

    if (!profile) return;

    const updatedProfile = {
      ...profile,
      xp: result.total_xp,
      tier: result.tier,
      stats: {
        ...profile.stats,
        [result.stat_type]: result.new_value,
      },
    };

    const updatedTasks = dailyTasks.map((task) =>
      task.id === taskId ? { ...task, is_completed_today: true } : task
    );

    set({
      profile: updatedProfile,
      dailyTasks: updatedTasks,
    });
  },

  unlockCard: (cardId) => {
    const { profile } = get();
    if (!profile) return;
    if (profile.unlockedCardIds.includes(cardId)) return;

    set({
      profile: {
        ...profile,
        unlockedCardIds: [...profile.unlockedCardIds, cardId],
      },
    });
  },

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
