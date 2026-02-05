import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, User, Target, ChevronDown, ChevronUp } from 'lucide-react';
import type { Job, JobStats } from '@/lib/jobDatabase';
import {
  calculateSalary,
  generateDistribution,
  getPercentileRank,
  getSalaryTier,
  createSalaryInfoFromJob,
  projectSalaryGrowth,
} from '@/lib/salaryCalculator';

interface SalaryChartProps {
  job: Job;
  userStats?: JobStats;
  defaultYears?: number;
}

// Custom Tooltip Component
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">연봉</p>
      <p className="text-white font-bold">{data.salary?.toLocaleString()}만원</p>
      {data.isUser > 0 && (
        <p className="text-yellow-300 text-xs mt-1 font-medium">
          내 예상 연봉
        </p>
      )}
    </div>
  );
}

// Stat Slider Component
function StatSlider({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-8">{label}</span>
      <input
        type="range"
        min="10"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: color,
        }}
      />
      <span className="text-xs font-medium text-white w-8 text-right">{value}</span>
    </div>
  );
}

export function SalaryChart({ job, userStats, defaultYears = 3 }: SalaryChartProps) {
  // State for adjustable parameters
  const [years, setYears] = useState(defaultYears);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customStats, setCustomStats] = useState<JobStats>(
    userStats || { T: 50, H: 50, S: 50, A: 50, B: 50 }
  );

  // Get salary info from job
  const salaryInfo = useMemo(() => createSalaryInfoFromJob(job), [job]);

  // Calculate user's estimated salary
  const userSalary = useMemo(
    () => calculateSalary(salaryInfo, customStats, years),
    [salaryInfo, customStats, years]
  );

  // Generate distribution data
  const distributionData = useMemo(
    () => generateDistribution(job.salaryRange.min, job.salaryRange.max, userSalary),
    [job.salaryRange, userSalary]
  );

  // Calculate percentile
  const percentile = useMemo(
    () => getPercentileRank(userSalary, job.salaryRange.min, job.salaryRange.max),
    [userSalary, job.salaryRange]
  );

  // Get tier info
  const tierInfo = useMemo(() => getSalaryTier(percentile), [percentile]);

  // Get salary growth projection
  const growthData = useMemo(
    () => projectSalaryGrowth(salaryInfo, customStats, 10),
    [salaryInfo, customStats]
  );

  const statColors: Record<string, string> = {
    T: '#22d3ee',
    H: '#f472b6',
    S: '#a3e635',
    A: '#c084fc',
    B: '#fef08a',
  };

  const statLabels: Record<string, string> = {
    T: '기술',
    H: '손기술',
    S: '운영',
    A: '미학',
    B: '비즈',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <h3 className="font-bold text-white text-sm">연봉 시뮬레이터</h3>
        </div>
        <span
          className="px-2 py-0.5 rounded text-xs font-bold"
          style={{ backgroundColor: `${tierInfo.color}20`, color: tierInfo.color }}
        >
          {tierInfo.tier}
        </span>
      </div>

      {/* Main Result */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-900/50 rounded-lg">
        <div>
          <p className="text-slate-400 text-xs">내 예상 연봉 ({years}년차)</p>
          <p className="text-2xl font-black text-yellow-300">
            {userSalary.toLocaleString()}
            <span className="text-sm font-normal text-slate-400">만원</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs">시장 내 위치</p>
          <p className="text-lg font-bold" style={{ color: tierInfo.color }}>
            상위 {100 - percentile}%
          </p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="salary"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            {/* Market Distribution Area */}
            <Area
              type="monotone"
              dataKey="density"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#areaGradient)"
              name="시장 분포"
            />
            {/* User Position Bar */}
            <Bar
              dataKey="isUser"
              fill="#fef08a"
              radius={[4, 4, 0, 0]}
              name="내 위치"
            />
            {/* Reference Lines */}
            <ReferenceLine
              x={job.salaryRange.min}
              stroke="#64748b"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              x={job.salaryRange.max}
              stroke="#64748b"
              strokeDasharray="3 3"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500/50" />
          <span className="text-slate-400">시장 분포</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-300" />
          <span className="text-slate-400">내 예상 연봉</span>
        </div>
      </div>

      {/* Years Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">경력 연차</span>
          <span className="text-sm font-bold text-white">{years}년</span>
        </div>
        <input
          type="range"
          min="0"
          max="15"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#22d3ee' }}
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>신입</span>
          <span>5년</span>
          <span>10년</span>
          <span>15년+</span>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <User className="w-3 h-3" />
        내 스탯 조정하기
        {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Advanced Stats Panel */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-3 bg-slate-900/50 rounded-lg space-y-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3 h-3 text-cyan-400" />
            <span className="text-xs text-slate-400">
              핵심 스탯: <span className="text-cyan-400 font-medium">{statLabels[salaryInfo.keyStat]}</span>
            </span>
          </div>
          {(Object.keys(customStats) as Array<keyof JobStats>).map((key) => (
            <StatSlider
              key={key}
              label={statLabels[key]}
              value={customStats[key]}
              onChange={(v) => setCustomStats({ ...customStats, [key]: v })}
              color={key === salaryInfo.keyStat ? statColors[key] : '#64748b'}
            />
          ))}
        </motion.div>
      )}

      {/* Market Range Info */}
      <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between text-xs text-slate-500">
        <span>시장 최소: {job.salaryRange.min.toLocaleString()}만원</span>
        <span>시장 최대: {job.salaryRange.max.toLocaleString()}만원</span>
      </div>
    </motion.div>
  );
}
