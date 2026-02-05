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
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, User, Target, ChevronDown, ChevronUp, DollarSign, TrendingDown, Trophy, AlertTriangle } from 'lucide-react';
import type { Job, JobStats } from '@/lib/jobDatabase';
import {
  calculateSalary,
  generateDistribution,
  getPercentileRank,
  getSalaryTier,
  createSalaryInfoFromJob,
  projectSalaryGrowth,
} from '@/lib/salaryCalculator';
import { useStore } from '@/store/useStore';

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
  // Global state
  const { currentSalary, setCurrentSalary } = useStore();

  // Local state
  const [years, setYears] = useState(defaultYears);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSalaryInput, setShowSalaryInput] = useState(false);
  const [inputValue, setInputValue] = useState(currentSalary?.toString() || '');
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

      {/* Salary Gap Calculator */}
      <div className="mt-4 pt-3 border-t border-slate-700">
        <button
          onClick={() => setShowSalaryInput(!showSalaryInput)}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <DollarSign className="w-3 h-3" />
          현재 연봉 비교하기
          {showSalaryInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {showSalaryInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-4"
            >
              {/* Salary Input */}
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <input
                  type="number"
                  placeholder="현재 연봉 (만원)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={() => {
                    const val = parseInt(inputValue);
                    if (!isNaN(val) && val > 0) {
                      setCurrentSalary(val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt(inputValue);
                      if (!isNaN(val) && val > 0) {
                        setCurrentSalary(val);
                      }
                    }
                  }}
                  className="flex-1 h-10 px-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-green-400/50 transition-all text-sm"
                />
                <span className="text-slate-400 text-sm">만원</span>
              </div>

              {/* Gap Visualization */}
              {currentSalary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-600"
                >
                  {/* Two Points Display */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Point A: Current */}
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1">Point A: 현재</p>
                      <p className="text-lg font-bold text-slate-300">
                        {currentSalary.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500">만원</span>
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-1 flex items-center justify-center px-2">
                      <div className="w-full h-0.5 bg-gradient-to-r from-slate-500 to-yellow-400 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-yellow-400" />
                      </div>
                    </div>

                    {/* Point B: Market */}
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1">Point B: 시장가치</p>
                      <p className="text-lg font-bold text-yellow-300">
                        {userSalary.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500">만원</span>
                      </p>
                    </div>
                  </div>

                  {/* Gap Display */}
                  {(() => {
                    const gap = userSalary - currentSalary;
                    const gapPercent = ((gap / currentSalary) * 100).toFixed(1);
                    const isUnderpaid = gap > 0;

                    return (
                      <div
                        className={`p-3 rounded-lg ${
                          isUnderpaid
                            ? 'bg-red-500/10 border border-red-500/30'
                            : 'bg-green-500/10 border border-green-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {isUnderpaid ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 font-bold text-sm">
                                📉 시장가치보다 {Math.abs(gap).toLocaleString()}만원 낮습니다!
                              </span>
                            </>
                          ) : gap < 0 ? (
                            <>
                              <Trophy className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-bold text-sm">
                                🏆 시장가치를 {Math.abs(gap).toLocaleString()}만원 상회합니다!
                              </span>
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 font-bold text-sm">
                                ⚖️ 시장가치와 일치합니다!
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {isUnderpaid ? (
                            <>
                              <AlertTriangle className="w-3 h-3 inline mr-1 text-red-400" />
                              역량 대비 <span className="text-red-400 font-medium">{gapPercent}%</span> 저평가 상태입니다.
                              이직 또는 연봉 협상을 고려해보세요.
                            </>
                          ) : gap < 0 ? (
                            <>
                              현재 시장 평균보다 <span className="text-green-400 font-medium">{Math.abs(parseFloat(gapPercent))}%</span> 높은 연봉을 받고 있습니다.
                              훌륭합니다!
                            </>
                          ) : (
                            <>
                              현재 적정 시장가치를 받고 있습니다.
                            </>
                          )}
                        </p>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Market Range Info */}
      <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between text-xs text-slate-500">
        <span>시장 최소: {job.salaryRange.min.toLocaleString()}만원</span>
        <span>시장 최대: {job.salaryRange.max.toLocaleString()}만원</span>
      </div>
    </motion.div>
  );
}
