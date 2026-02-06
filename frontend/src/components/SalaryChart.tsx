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
import { TrendingUp, User, Target, ChevronDown, ChevronUp, DollarSign, TrendingDown, Trophy, AlertTriangle, Save, CheckCircle, Shield } from 'lucide-react';
import type { Job, JobStats } from '@/lib/jobDatabase';
import type { CreateSalaryReportData, SalaryReport } from '@/types';
import {
  calculateSalary,
  generateDistribution,
  getPercentileRank,
  getSalaryTier,
  createSalaryInfoFromJob,
  projectSalaryGrowth,
} from '@/lib/salaryCalculator';
import { useStore } from '@/store/useStore';
import { VerificationUploadModal } from './VerificationUploadModal';

const API_BASE = 'http://localhost:8000/api';

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
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="text-gray-500 text-xs mb-1">연봉</p>
      <p className="text-gray-900 font-bold">{data.salary?.toLocaleString()}만원</p>
      {data.isUser > 0 && (
        <p className="text-amber-600 text-xs mt-1 font-medium">
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
      <span className="text-xs text-gray-500 w-8">{label}</span>
      <input
        type="range"
        min="10"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: color,
        }}
      />
      <span className="text-xs font-medium text-gray-900 w-8 text-right">{value}</span>
    </div>
  );
}

export function SalaryChart({ job, userStats, defaultYears = 3 }: SalaryChartProps) {
  // Global state
  const { currentSalary, setCurrentSalary, profile, addSalaryReport, updateSalaryReport, addToast } = useStore();

  // Local state
  const [years, setYears] = useState(defaultYears);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSalaryInput, setShowSalaryInput] = useState(false);
  const [inputValue, setInputValue] = useState(currentSalary?.toString() || '');
  const [customStats, setCustomStats] = useState<JobStats>(
    userStats || { T: 50, H: 50, S: 50, A: 50, B: 50 }
  );

  // Save report state
  const [isSaving, setIsSaving] = useState(false);
  const [savedReport, setSavedReport] = useState<SalaryReport | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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

  // Save Report Handler
  const handleSaveReport = async () => {
    if (!currentSalary || !profile) {
      addToast({ message: '현재 연봉을 먼저 입력해주세요', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      const reportData: CreateSalaryReportData = {
        target_job_id: job.id,
        target_job_title: job.title,
        current_salary: currentSalary,
        estimated_salary: userSalary,
        market_min: job.salaryRange.min,
        market_max: job.salaryRange.max,
        percentile: percentile,
        years_experience: years,
        user_stats: customStats as unknown as Record<string, number>,
      };

      const response = await fetch(`${API_BASE}/reports/?profile_id=${profile.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reportData, profile_id: profile.id }),
      });

      if (!response.ok) throw new Error('Failed to save report');

      const saved = await response.json();
      setSavedReport(saved);
      addSalaryReport(saved);
      addToast({ message: '리포트가 저장되었습니다!', type: 'success' });
    } catch {
      addToast({ message: '저장에 실패했습니다', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Proof Handler
  const handleUploadProof = async (file: File) => {
    if (!savedReport || !profile) return;

    const formData = new FormData();
    formData.append('proof_image', file);
    formData.append('profile_id', profile.id.toString());

    const response = await fetch(`${API_BASE}/reports/${savedReport.id}/upload_proof/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload');

    const updated = await response.json();
    setSavedReport(updated);
    updateSalaryReport(updated);
    addToast({ message: '인증 요청이 제출되었습니다!', type: 'success' });
  };

  const statColors: Record<string, string> = {
    T: '#0891b2',
    H: '#ec4899',
    S: '#84cc16',
    A: '#a855f7',
    B: '#f59e0b',
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
      className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-black/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <h3 className="font-bold text-gray-900 text-sm">연봉 시뮬레이터</h3>
        </div>
        <span
          className="px-2 py-0.5 rounded text-xs font-bold"
          style={{ backgroundColor: `${tierInfo.color}20`, color: tierInfo.color }}
        >
          {tierInfo.tier}
        </span>
      </div>

      {/* Main Result */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-gray-500 text-xs">내 예상 연봉 ({years}년차)</p>
          <p className="text-2xl font-black text-amber-600">
            {userSalary.toLocaleString()}
            <span className="text-sm font-normal text-gray-500">만원</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs">시장 내 위치</p>
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
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              axisLine={{ stroke: '#e5e7eb' }}
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
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              name="내 위치"
            />
            {/* Reference Lines */}
            <ReferenceLine
              x={job.salaryRange.min}
              stroke="#9ca3af"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              x={job.salaryRange.max}
              stroke="#9ca3af"
              strokeDasharray="3 3"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500/50" />
          <span className="text-gray-500">시장 분포</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span className="text-gray-500">내 예상 연봉</span>
        </div>
      </div>

      {/* Years Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">경력 연차</span>
          <span className="text-sm font-bold text-gray-900">{years}년</span>
        </div>
        <input
          type="range"
          min="0"
          max="15"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#0891b2' }}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>신입</span>
          <span>5년</span>
          <span>10년</span>
          <span>15년+</span>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-gray-500 hover:text-gray-900 transition-colors"
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
          className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3 h-3 text-cyan-600" />
            <span className="text-xs text-gray-500">
              핵심 스탯: <span className="text-cyan-600 font-medium">{statLabels[salaryInfo.keyStat]}</span>
            </span>
          </div>
          {(Object.keys(customStats) as Array<keyof JobStats>).map((key) => (
            <StatSlider
              key={key}
              label={statLabels[key]}
              value={customStats[key]}
              onChange={(v) => setCustomStats({ ...customStats, [key]: v })}
              color={key === salaryInfo.keyStat ? statColors[key] : '#9ca3af'}
            />
          ))}
        </motion.div>
      )}

      {/* Salary Gap Calculator */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={() => setShowSalaryInput(!showSalaryInput)}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-gray-900 transition-colors"
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
                <DollarSign className="w-4 h-4 text-green-500" />
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
                  className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 transition-all text-sm"
                />
                <span className="text-gray-500 text-sm">만원</span>
              </div>

              {/* Gap Visualization */}
              {currentSalary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200"
                >
                  {/* Two Points Display */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Point A: Current */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Point A: 현재</p>
                      <p className="text-lg font-bold text-gray-700">
                        {currentSalary.toLocaleString()}
                        <span className="text-xs font-normal text-gray-400">만원</span>
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-1 flex items-center justify-center px-2">
                      <div className="w-full h-0.5 bg-gradient-to-r from-gray-400 to-amber-500 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-amber-500" />
                      </div>
                    </div>

                    {/* Point B: Market */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Point B: 시장가치</p>
                      <p className="text-lg font-bold text-amber-600">
                        {userSalary.toLocaleString()}
                        <span className="text-xs font-normal text-gray-400">만원</span>
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
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-green-50 border border-green-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {isUnderpaid ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 font-bold text-sm">
                                📉 시장가치보다 {Math.abs(gap).toLocaleString()}만원 낮습니다!
                              </span>
                            </>
                          ) : gap < 0 ? (
                            <>
                              <Trophy className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 font-bold text-sm">
                                🏆 시장가치를 {Math.abs(gap).toLocaleString()}만원 상회합니다!
                              </span>
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 text-amber-500" />
                              <span className="text-amber-600 font-bold text-sm">
                                ⚖️ 시장가치와 일치합니다!
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {isUnderpaid ? (
                            <>
                              <AlertTriangle className="w-3 h-3 inline mr-1 text-red-500" />
                              역량 대비 <span className="text-red-600 font-medium">{gapPercent}%</span> 저평가 상태입니다.
                              이직 또는 연봉 협상을 고려해보세요.
                            </>
                          ) : gap < 0 ? (
                            <>
                              현재 시장 평균보다 <span className="text-green-600 font-medium">{Math.abs(parseFloat(gapPercent))}%</span> 높은 연봉을 받고 있습니다.
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

                  {/* Save Report Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveReport}
                    disabled={isSaving || savedReport !== null}
                    className={`w-full mt-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                      savedReport
                        ? 'bg-green-100 text-green-600 cursor-default'
                        : 'bg-amber-400 text-gray-900 hover:bg-amber-500'
                    }`}
                  >
                    {savedReport ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        리포트 저장됨
                      </>
                    ) : isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        연봉 리포트 저장하기
                      </>
                    )}
                  </motion.button>

                  {/* Verification Button */}
                  {savedReport && savedReport.status === 'None' && (
                    <button
                      onClick={() => setShowVerificationModal(true)}
                      className="w-full mt-2 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      인증하고 뱃지 받기
                    </button>
                  )}

                  {savedReport && savedReport.status === 'Pending' && (
                    <div className="w-full mt-2 py-2 px-3 rounded-lg text-xs text-center bg-amber-50 text-amber-700 border border-amber-200">
                      인증 심사 중입니다
                    </div>
                  )}

                  {savedReport && savedReport.status === 'Verified' && (
                    <div className="w-full mt-2 py-2 px-3 rounded-lg text-xs text-center bg-green-50 text-green-700 border border-green-200 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      인증 완료됨
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Verification Upload Modal */}
      {savedReport && (
        <VerificationUploadModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          report={savedReport}
          onUpload={handleUploadProof}
        />
      )}

      {/* Market Range Info */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>시장 최소: {job.salaryRange.min.toLocaleString()}만원</span>
        <span>시장 최대: {job.salaryRange.max.toLocaleString()}만원</span>
      </div>
    </motion.div>
  );
}
