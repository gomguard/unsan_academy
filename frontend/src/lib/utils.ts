import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TierType, StatType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tierColors: Record<TierType, string> = {
  Unranked: '#9ca3af',
  Bronze: '#d97706',
  Silver: '#6b7280',
  Gold: '#eab308',
  Platinum: '#06b6d4',
  Diamond: '#8b5cf6',
};

export const tierBgColors: Record<TierType, string> = {
  Unranked: 'bg-gray-100',
  Bronze: 'bg-amber-100',
  Silver: 'bg-gray-200',
  Gold: 'bg-yellow-100',
  Platinum: 'bg-cyan-100',
  Diamond: 'bg-purple-100',
};

export const tierTextColors: Record<TierType, string> = {
  Unranked: 'text-gray-600',
  Bronze: 'text-amber-700',
  Silver: 'text-gray-700',
  Gold: 'text-yellow-700',
  Platinum: 'text-cyan-700',
  Diamond: 'text-purple-700',
};

export const statColors: Record<StatType, string> = {
  Tech: '#3b82f6',
  Hand: '#ef4444',
  Speed: '#f59e0b',
  Art: '#ec4899',
  Biz: '#8b5cf6',
};

export const statBgColors: Record<StatType, string> = {
  Tech: 'bg-blue-500',
  Hand: 'bg-red-500',
  Speed: 'bg-amber-500',
  Art: 'bg-pink-500',
  Biz: 'bg-purple-500',
};

export const statLightBgColors: Record<StatType, string> = {
  Tech: 'bg-blue-50',
  Hand: 'bg-red-50',
  Speed: 'bg-amber-50',
  Art: 'bg-pink-50',
  Biz: 'bg-purple-50',
};

export const statIcons: Record<StatType, string> = {
  Tech: '🔧',
  Hand: '✋',
  Speed: '⚡',
  Art: '🎨',
  Biz: '💼',
};

export const statLabels: Record<StatType, { en: string; ko: string; desc: string }> = {
  Tech: { en: 'Tech', ko: '기술력', desc: '진단/로직' },
  Hand: { en: 'Hand', ko: '손기술', desc: '정비/수리' },
  Speed: { en: 'Speed', ko: '스피드', desc: '효율성' },
  Art: { en: 'Art', ko: '미학', desc: '디테일링' },
  Biz: { en: 'Biz', ko: '비즈니스', desc: '영업/관리' },
};

export function getProgressPercentage(current: number, min: number, max: number): number {
  if (max <= min) return 100;
  return Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}
