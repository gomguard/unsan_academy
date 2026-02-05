import type { Job, JobStats } from './jobDatabase';
import type { SalaryInfo, JobStatType } from '@/types';

export interface SalarySimulatorInput {
  base: number;
  cap: number;
  growthRate: number;
  keyStat: JobStatType;
}

/**
 * Calculate estimated salary based on job, user stats, and years of experience
 * Uses logarithmic growth: fast early, slows down later
 */
export function calculateSalary(
  salaryInfo: SalarySimulatorInput,
  userStats: JobStats,
  years: number = 3
): number {
  const { base, cap, growthRate, keyStat } = salaryInfo;

  // Logarithmic growth factor (fast early, slow later)
  const expFactor = Math.log(years + 1) * (growthRate * 4);

  // Stat bonus: 10만원 per point over 50 in key stat
  const userStatValue = userStats[keyStat] || 50;
  const statBonus = Math.max(0, (userStatValue - 50) * 10);

  // Calculate total salary
  const total = base + (base * expFactor) + statBonus;

  // Cap at maximum
  return Math.min(Math.round(total), cap);
}

/**
 * Generate Bell Curve (Normal Distribution) data for Recharts
 * Returns array of data points for the salary distribution chart
 */
export function generateDistribution(
  min: number,
  max: number,
  userSalary: number
): Array<{
  salary: number;
  density: number;
  isUser: number;
  label: string;
}> {
  const mean = (min + max) / 2;
  const stdDev = (max - min) / 6; // 99.7% falls within min-max
  const data: Array<{
    salary: number;
    density: number;
    isUser: number;
    label: string;
  }> = [];

  const rangeMin = min * 0.8;
  const rangeMax = max * 1.2;
  const step = (rangeMax - rangeMin) / 30;

  for (let i = rangeMin; i <= rangeMax; i += step) {
    const x = Math.round(i);

    // Gaussian (Normal Distribution) Function
    const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);

    // Scale density for better visualization
    const density = y * 10000;

    // Mark user position (if within threshold)
    const threshold = (max - min) / 30;
    const isUser = Math.abs(x - userSalary) < threshold ? density : 0;

    data.push({
      salary: x,
      density: Math.round(density * 100) / 100,
      isUser: Math.round(isUser * 100) / 100,
      label: `${x.toLocaleString()}만원`,
    });
  }

  return data;
}

/**
 * Get percentile rank of user salary within the distribution
 */
export function getPercentileRank(
  userSalary: number,
  min: number,
  max: number
): number {
  const mean = (min + max) / 2;
  const stdDev = (max - min) / 6;

  // Z-score
  const z = (userSalary - mean) / stdDev;

  // Approximate CDF using error function approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  const percentile = z > 0 ? (1 - p) * 100 : p * 100;

  return Math.round(percentile);
}

/**
 * Get salary tier description based on percentile
 */
export function getSalaryTier(percentile: number): {
  tier: string;
  color: string;
  description: string;
} {
  if (percentile >= 90) {
    return { tier: 'TOP 10%', color: '#f59e0b', description: '시장 최상위' };
  } else if (percentile >= 75) {
    return { tier: 'TOP 25%', color: '#22c55e', description: '상위권' };
  } else if (percentile >= 50) {
    return { tier: 'TOP 50%', color: '#3b82f6', description: '평균 이상' };
  } else if (percentile >= 25) {
    return { tier: '하위 50%', color: '#f97316', description: '평균 이하' };
  } else {
    return { tier: '하위 25%', color: '#ef4444', description: '입문 단계' };
  }
}

/**
 * Calculate salary growth projection over years
 */
export function projectSalaryGrowth(
  salaryInfo: SalarySimulatorInput,
  userStats: JobStats,
  maxYears: number = 10
): Array<{ year: number; salary: number }> {
  const projections: Array<{ year: number; salary: number }> = [];

  for (let year = 0; year <= maxYears; year++) {
    projections.push({
      year,
      salary: calculateSalary(salaryInfo, userStats, year),
    });
  }

  return projections;
}

/**
 * Default salary info generator from job's salary range
 */
export function createSalaryInfoFromJob(job: Job): SalarySimulatorInput {
  const { min, max } = job.salaryRange;

  // Determine key stat based on highest required stat
  const stats = job.requiredStats;
  const statEntries = Object.entries(stats) as [JobStatType, number][];
  const [keyStat] = statEntries.reduce((a, b) => a[1] > b[1] ? a : b);

  // Growth rate based on salary range spread
  const spread = max - min;
  const growthRate = Math.min(0.3, Math.max(0.1, spread / 20000));

  return {
    base: min,
    cap: max,
    growthRate,
    keyStat,
  };
}
