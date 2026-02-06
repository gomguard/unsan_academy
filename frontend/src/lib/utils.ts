import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassType, StatType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============ CLASS SYSTEM (Professional Grading) ============
// Replaces game-like "Tier" with professional "Class" system

export const classColors: Record<ClassType, string> = {
  Trainee: '#6b7280',
  'C-Class': '#a78bfa',
  'B-Class': '#22d3ee',
  'A-Class': '#fbbf24',
  'S-Class': '#f472b6',
  Master: '#c084fc',
};

export const classBgColors: Record<ClassType, string> = {
  Trainee: 'bg-gray-100',
  'C-Class': 'bg-violet-100',
  'B-Class': 'bg-cyan-100',
  'A-Class': 'bg-amber-100',
  'S-Class': 'bg-pink-100',
  Master: 'bg-purple-100',
};

export const classTextColors: Record<ClassType, string> = {
  Trainee: 'text-gray-600',
  'C-Class': 'text-violet-700',
  'B-Class': 'text-cyan-700',
  'A-Class': 'text-amber-700',
  'S-Class': 'text-pink-700',
  Master: 'text-purple-700',
};

// Legacy tier aliases for backward compatibility
export const tierColors = classColors;
export const tierBgColors = classBgColors;
export const tierTextColors = classTextColors;

// ============ STAT SYSTEM (Professional Competencies) ============
// Pentagon Chart: 5 Core Professional Competencies

export const statColors: Record<StatType, string> = {
  Diagnostic: '#3b82f6',    // 진단력 - Blue
  Mechanical: '#ef4444',    // 정비력 - Red
  Efficiency: '#f59e0b',    // 효율성 - Amber
  Quality: '#ec4899',       // 품질력 - Pink
  Communication: '#8b5cf6', // 소통력 - Purple
};

export const statBgColors: Record<StatType, string> = {
  Diagnostic: 'bg-blue-500',
  Mechanical: 'bg-red-500',
  Efficiency: 'bg-amber-500',
  Quality: 'bg-pink-500',
  Communication: 'bg-purple-500',
};

export const statLightBgColors: Record<StatType, string> = {
  Diagnostic: 'bg-blue-50',
  Mechanical: 'bg-red-50',
  Efficiency: 'bg-amber-50',
  Quality: 'bg-pink-50',
  Communication: 'bg-purple-50',
};

export const statIcons: Record<StatType, string> = {
  Diagnostic: '🧠',     // Brain for diagnostic thinking
  Mechanical: '🔧',     // Wrench for hands-on work
  Efficiency: '⏱️',     // Timer for FRT efficiency
  Quality: '✨',        // Sparkle for quality finish
  Communication: '💬',  // Speech for customer service
};

export const statLabels: Record<StatType, { en: string; ko: string; desc: string }> = {
  Diagnostic: { en: 'Diagnostic', ko: '진단력', desc: '데이터 분석 및 문제 진단' },
  Mechanical: { en: 'Mechanical', ko: '정비력', desc: '물리적 수리 속도 및 정밀도' },
  Efficiency: { en: 'Efficiency', ko: '효율성', desc: '표준 시간(FRT) 대비 작업 효율' },
  Quality: { en: 'Quality', ko: '품질력', desc: '마감 품질 및 재작업률' },
  Communication: { en: 'Communication', ko: '소통력', desc: '고객 응대 및 업셀링' },
};

export function getProgressPercentage(current: number, min: number, max: number): number {
  if (max <= min) return 100;
  return Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}
