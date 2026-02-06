import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  GitBranch,
  ChevronRight,
  Lock,
  Unlock,
  X,
  Target,
  Navigation,
  XCircle,
  Train,
  Layers,
  Focus,
  TrendingUp,
} from 'lucide-react';
import {
  jobDatabase,
  groupInfo,
  getJobById,
  getPrerequisiteJobs,
  getJobsThatRequire,
  formatSalaryKorean,
  type Job,
  type JobGroup,
} from '@/lib/jobDatabase';
import { useStore } from '@/store/useStore';
import { SkillTreeFlow } from '@/components/SkillTreeFlow';

// ============ TYPES ============
type ViewMode = 'tree' | 'metro' | 'tier' | 'focus';

const viewModeInfo: Record<ViewMode, { name: string; icon: any; desc: string }> = {
  tree: { name: '트리', icon: GitBranch, desc: '기존 트리 구조' },
  metro: { name: '메트로', icon: Train, desc: '지하철 노선도 스타일' },
  tier: { name: '티어', icon: Layers, desc: '레벨별 가로 배치' },
  focus: { name: '포커스', icon: Focus, desc: '목표 경로 집중' },
};

// ============ CONSTANTS ============
const NODE_WIDTH = 160;
const NODE_HEIGHT = 70;
const LEVEL_GAP = 120;
const NODE_GAP = 25;

const groupColors: Record<JobGroup, string> = {
  Maintenance: '#3b82f6',
  Body: '#ec4899',
  Film: '#f59e0b',
  EV_Future: '#8b5cf6',
  Management: '#6366f1',
  Niche: '#ef4444',
  NextGen: '#10b981',
};

// ============ HELPER FUNCTIONS ============
function calculatePathToTarget(targetId: string): string[] {
  const target = getJobById(targetId);
  if (!target) return [];

  const path: string[] = [];
  const visited = new Set<string>();

  function collectPath(jobId: string) {
    if (visited.has(jobId)) return;
    visited.add(jobId);

    const job = getJobById(jobId);
    if (!job) return;

    if (job.prerequisiteJobs) {
      for (const prereqId of job.prerequisiteJobs) {
        collectPath(prereqId);
      }
    }
    path.push(jobId);
  }

  collectPath(targetId);
  return path;
}

// Get job tier (depth from root)
function getJobTier(job: Job): number {
  if (!job.prerequisiteJobs || job.prerequisiteJobs.length === 0) return 1;

  let maxPrereqTier = 0;
  for (const prereqId of job.prerequisiteJobs) {
    const prereq = getJobById(prereqId);
    if (prereq) {
      maxPrereqTier = Math.max(maxPrereqTier, getJobTier(prereq));
    }
  }
  return maxPrereqTier + 1;
}

// ============ METRO VIEW COMPONENT ============
function MetroView({
  selectedGroup,
  selectedJob,
  setSelectedJob,
  focusPath,
  targetJobId,
}: {
  selectedGroup: JobGroup | 'all';
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  focusPath: string[];
  targetJobId: string | null;
}) {
  const groups = selectedGroup === 'all'
    ? (['Maintenance', 'Body', 'Film', 'EV_Future', 'Management', 'Niche', 'NextGen'] as JobGroup[])
    : [selectedGroup];

  const METRO_NODE_SIZE = 24;
  const METRO_LINE_HEIGHT = 50;
  const METRO_NODE_GAP = 120;

  return (
    <div className="p-8 overflow-auto h-full">
      <div className="min-w-[1200px]">
        {groups.map((group, groupIndex) => {
          const jobs = jobDatabase.filter(j => j.group === group);
          const sortedJobs = [...jobs].sort((a, b) => getJobTier(a) - getJobTier(b));
          const info = groupInfo[group];
          const color = groupColors[group];

          return (
            <div key={group} className="mb-8">
              {/* Line label */}
              <div className={`flex items-center gap-3 mb-4 ${groupIndex > 0 ? 'mt-16' : ''}`}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: color }}
                >
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{info.name}</h3>
                  <p className="text-xs text-slate-400">{jobs.length}개 직업</p>
                </div>
              </div>

              {/* Metro line */}
              <div className="relative" style={{ height: METRO_LINE_HEIGHT }}>
                {/* Line background */}
                <div
                  className="absolute top-1/2 left-0 right-0 h-1 rounded-full"
                  style={{ backgroundColor: color, transform: 'translateY(-50%)' }}
                />

                {/* Nodes */}
                <div className="flex items-center h-full">
                  {sortedJobs.map((job, index) => {
                    const isSelected = selectedJob?.id === job.id;
                    const isInPath = focusPath.includes(job.id);
                    const isTarget = job.id === targetJobId;
                    const tier = getJobTier(job);

                    return (
                      <motion.div
                        key={job.id}
                        className="relative flex flex-col items-center cursor-pointer"
                        style={{ marginLeft: index === 0 ? 20 : METRO_NODE_GAP }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedJob(job)}
                      >
                        {/* Station dot */}
                        <motion.div
                          className="rounded-full border-4 flex items-center justify-center"
                          style={{
                            width: isSelected || isTarget ? METRO_NODE_SIZE + 8 : METRO_NODE_SIZE,
                            height: isSelected || isTarget ? METRO_NODE_SIZE + 8 : METRO_NODE_SIZE,
                            backgroundColor: isTarget ? '#fef08a' : isSelected ? color : '#1e293b',
                            borderColor: isInPath ? '#fef08a' : color,
                          }}
                          animate={isTarget ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          {isTarget && <Target className="w-3 h-3 text-gray-900" />}
                        </motion.div>

                        {/* Label with Tier - always below */}
                        <div
                          className="absolute top-full mt-3 whitespace-nowrap text-xs font-medium px-2 py-1 rounded flex flex-col items-center gap-0.5"
                        >
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-400"
                          >
                            Lv.{tier}
                          </span>
                          <span
                            style={{
                              color: isSelected ? color : isInPath ? '#fef08a' : '#94a3b8',
                            }}
                          >
                            {job.title.length > 8 ? job.title.slice(0, 8) + '..' : job.title}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ TIER VIEW COMPONENT ============
function TierView({
  selectedGroup,
  selectedJob,
  setSelectedJob,
  focusPath,
  targetJobId,
}: {
  selectedGroup: JobGroup | 'all';
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  focusPath: string[];
  targetJobId: string | null;
}) {
  const jobs = selectedGroup === 'all'
    ? jobDatabase
    : jobDatabase.filter(j => j.group === selectedGroup);

  // Group by tier
  const tierGroups = useMemo(() => {
    const tiers: Record<number, Job[]> = {};
    jobs.forEach(job => {
      const tier = getJobTier(job);
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier].push(job);
    });
    return tiers;
  }, [jobs]);

  const maxTier = Math.max(...Object.keys(tierGroups).map(Number));
  const tierLabels = ['', '입문', '전문', '마스터', '레전드', '초월'];

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex gap-6 min-w-max">
        {Array.from({ length: maxTier }, (_, i) => i + 1).map(tier => (
          <div key={tier} className="flex-shrink-0" style={{ width: 200 }}>
            {/* Tier header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm pb-4 z-10">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-white">Tier {tier}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tierLabels[tier] || `레벨 ${tier}`}</p>
              </div>
            </div>

            {/* Jobs in this tier */}
            <div className="space-y-3">
              {(tierGroups[tier] || []).map(job => {
                const info = groupInfo[job.group];
                const color = groupColors[job.group];
                const isSelected = selectedJob?.id === job.id;
                const isInPath = focusPath.includes(job.id);
                const isTarget = job.id === targetJobId;

                return (
                  <motion.div
                    key={job.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onClick={() => setSelectedJob(job)}
                    className={`p-3 rounded-xl cursor-pointer border-2 transition-all ${
                      isTarget
                        ? 'bg-yellow-400/20 border-yellow-400'
                        : isSelected
                        ? 'border-opacity-100'
                        : isInPath
                        ? 'bg-slate-800 border-yellow-400/50'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                    style={{
                      borderColor: isTarget ? undefined : isSelected ? color : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{info.icon}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${color}30`, color }}
                      >
                        {info.name}
                      </span>
                    </div>
                    <h4 className={`font-bold text-sm ${isTarget ? 'text-yellow-400' : 'text-white'}`}>
                      {job.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatSalaryKorean(job.salaryRange)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ FOCUS VIEW COMPONENT ============
function FocusView({
  selectedGroup,
  selectedJob,
  setSelectedJob,
  focusPath,
  targetJobId,
  setTargetJobId,
}: {
  selectedGroup: JobGroup | 'all';
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  focusPath: string[];
  targetJobId: string | null;
  setTargetJobId: (id: string | null) => void;
}) {
  const jobs = selectedGroup === 'all'
    ? jobDatabase
    : jobDatabase.filter(j => j.group === selectedGroup);

  const isFocusModeActive = targetJobId !== null;

  return (
    <div className="h-full flex flex-col">
      {/* Fixed header section - flex-shrink-0 prevents it from shrinking */}
      <div className="flex-shrink-0 bg-slate-900 px-6 pt-4 pb-4 border-b border-slate-800">
        {/* Focus mode instruction */}
        {!isFocusModeActive && (
          <div className="text-center py-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <Target className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-bold text-white text-lg mb-1">목표 직업을 선택하세요</h3>
            <p className="text-slate-400 text-sm">직업을 클릭하면 해당 직업까지의 경로가 하이라이트됩니다</p>
          </div>
        )}

        {/* Focus path display */}
        {isFocusModeActive && focusPath.length > 0 && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-white">목표 경로</span>
                <span className="text-slate-400 text-sm">({focusPath.length}단계)</span>
              </div>
              <button
                onClick={() => setTargetJobId(null)}
                className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full transition-colors"
              >
                초기화
              </button>
            </div>

            {/* Path visualization */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {focusPath.map((jobId, index) => {
                const job = getJobById(jobId);
                if (!job) return null;
                const info = groupInfo[job.group];
                const color = groupColors[job.group];
                const isTarget = jobId === targetJobId;

                return (
                  <div key={jobId} className="flex items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedJob(job)}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg cursor-pointer border-2 ${
                        isTarget ? 'bg-yellow-400 border-yellow-400' : 'bg-slate-700 border-slate-600'
                      }`}
                      style={{ borderColor: isTarget ? undefined : color }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{info.icon}</span>
                        <span className={`text-xs font-bold ${isTarget ? 'text-gray-900' : 'text-white'}`}>
                          {job.title.length > 6 ? job.title.slice(0, 6) + '..' : job.title}
                        </span>
                      </div>
                    </motion.div>
                    {index < focusPath.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-yellow-400 mx-0.5 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable job grid - flex-1 and overflow-auto makes this scrollable */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
        {jobs.map(job => {
          const info = groupInfo[job.group];
          const color = groupColors[job.group];
          const isSelected = selectedJob?.id === job.id;
          const isInPath = focusPath.includes(job.id);
          const isTarget = job.id === targetJobId;
          const isDimmed = isFocusModeActive && !isInPath;

          return (
            <motion.div
              key={job.id}
              whileHover={{ scale: 1.03 }}
              onClick={() => setTargetJobId(job.id === targetJobId ? null : job.id)}
              className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                isTarget
                  ? 'bg-yellow-400 border-yellow-400'
                  : isInPath
                  ? 'bg-slate-800 border-yellow-400/50'
                  : 'bg-slate-800/50 border-slate-700'
              } ${isDimmed ? 'opacity-30' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{info.icon}</span>
                {isTarget && <Target className="w-4 h-4 text-gray-900" />}
              </div>
              <h4 className={`font-bold text-sm mb-1 ${isTarget ? 'text-gray-900' : 'text-white'}`}>
                {job.title}
              </h4>
              <p className={`text-xs ${isTarget ? 'text-gray-700' : 'text-slate-500'}`}>
                Tier {getJobTier(job)} · {formatSalaryKorean(job.salaryRange)}
              </p>
              {job.marketDemand === 'Explosive' && (
                <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                  🔥 급성장
                </span>
              )}
            </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

// TreeView is now replaced by SkillTreeFlow component

// ============ JOB DETAIL PANEL ============
function JobDetailPanel({
  job,
  onClose,
  onNavigate,
  onSetTarget,
  isTarget,
  focusPath,
}: {
  job: Job;
  onClose: () => void;
  onNavigate: (jobId: string) => void;
  onSetTarget: (jobId: string) => void;
  isTarget: boolean;
  focusPath: string[];
}) {
  const prerequisites = getPrerequisiteJobs(job.id);
  const unlocks = getJobsThatRequire(job.id);
  const group = groupInfo[job.group];
  const color = groupColors[job.group];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-4 bottom-4 w-80 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl z-50"
    >
      <div className="p-4 border-b border-slate-700" style={{ backgroundColor: `${color}20` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{group.icon}</span>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <h3 className="text-xl font-bold text-white">{job.title}</h3>
        <p className="text-sm text-slate-400 mt-1">{group.name} · Tier {getJobTier(job)}</p>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100%-180px)]">
        <p className="text-slate-300 text-sm mb-4">{job.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500">연봉</p>
            <p className="text-green-400 font-bold">{formatSalaryKorean(job.salaryRange)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500">수요</p>
            <p className={`font-bold ${
              job.marketDemand === 'Explosive' ? 'text-red-400' :
              job.marketDemand === 'High' ? 'text-orange-400' : 'text-slate-400'
            }`}>
              {job.marketDemand === 'Explosive' ? '🔥 급상승' :
               job.marketDemand === 'High' ? '📈 높음' : '➡️ 안정'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onSetTarget(job.id)}
          className={`w-full py-3 rounded-lg font-bold text-sm mb-4 flex items-center justify-center gap-2 ${
            isTarget ? 'bg-yellow-400 text-gray-900' : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          {isTarget ? <><Target className="w-4 h-4" /> 현재 목표</> : <><Navigation className="w-4 h-4" /> 목표로 설정</>}
        </button>

        {prerequisites.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-bold text-white">선행 직업</h4>
            </div>
            <div className="space-y-2">
              {prerequisites.map(prereq => (
                <button
                  key={prereq.id}
                  onClick={() => onNavigate(prereq.id)}
                  className="w-full flex items-center gap-2 p-2 bg-slate-900/50 hover:bg-slate-700 rounded-lg text-left"
                >
                  <span>{groupInfo[prereq.group].icon}</span>
                  <span className="text-sm text-slate-300 flex-1">{prereq.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {unlocks.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Unlock className="w-4 h-4 text-green-400" />
              <h4 className="text-sm font-bold text-white">해금 ({unlocks.length})</h4>
            </div>
            <div className="space-y-2">
              {unlocks.slice(0, 5).map(unlock => (
                <button
                  key={unlock.id}
                  onClick={() => onNavigate(unlock.id)}
                  className="w-full flex items-center gap-2 p-2 bg-slate-900/50 hover:bg-slate-700 rounded-lg text-left"
                >
                  <span>{groupInfo[unlock.group].icon}</span>
                  <span className="text-sm text-slate-300 flex-1">{unlock.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============
export function SkillTree() {
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [selectedGroup, setSelectedGroup] = useState<JobGroup | 'all'>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { targetJobId, focusPath, setTargetJobId, setFocusPath, clearFocusMode } = useStore();

  useEffect(() => {
    if (targetJobId) {
      setFocusPath(calculatePathToTarget(targetJobId));
    } else {
      setFocusPath([]);
    }
  }, [targetJobId, setFocusPath]);

  const handleSetTarget = useCallback((jobId: string) => {
    if (targetJobId === jobId) {
      clearFocusMode();
    } else {
      setTargetJobId(jobId);
    }
  }, [targetJobId, setTargetJobId, clearFocusMode]);

  const groups = Object.entries(groupInfo) as [JobGroup, typeof groupInfo[JobGroup]][];

  return (
    <div className="h-screen bg-slate-900 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Link to="/jobs" className="flex items-center gap-2 text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-yellow-400" />
                <h1 className="text-lg font-bold text-white">Skill Tree</h1>
              </div>
            </div>

            {/* View mode selector */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              {(Object.keys(viewModeInfo) as ViewMode[]).map(mode => {
                const info = viewModeInfo[mode];
                const Icon = info.icon;
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === mode
                        ? 'bg-yellow-400 text-gray-900'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={info.desc}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{info.name}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Group filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedGroup === 'all' ? 'bg-yellow-400 text-gray-900' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              전체 ({jobDatabase.length})
            </button>
            {groups.map(([key, info]) => {
              const count = jobDatabase.filter(j => j.group === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedGroup(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5 ${
                    selectedGroup === key ? 'text-gray-900' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  style={{ backgroundColor: selectedGroup === key ? groupColors[key] : undefined }}
                >
                  <span>{info.icon}</span>
                  {info.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'tree' && (
          <SkillTreeFlow
            selectedGroup={selectedGroup}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            focusPath={focusPath}
            targetJobId={targetJobId}
          />
        )}
        {viewMode === 'metro' && (
          <MetroView
            selectedGroup={selectedGroup}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            focusPath={focusPath}
            targetJobId={targetJobId}
          />
        )}
        {viewMode === 'tier' && (
          <TierView
            selectedGroup={selectedGroup}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            focusPath={focusPath}
            targetJobId={targetJobId}
          />
        )}
        {viewMode === 'focus' && (
          <FocusView
            selectedGroup={selectedGroup}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            focusPath={focusPath}
            targetJobId={targetJobId}
            setTargetJobId={handleSetTarget}
          />
        )}

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedJob && viewMode !== 'focus' && (
            <JobDetailPanel
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onNavigate={(jobId) => {
                const job = getJobById(jobId);
                if (job) setSelectedJob(job);
              }}
              onSetTarget={handleSetTarget}
              isTarget={selectedJob.id === targetJobId}
              focusPath={focusPath}
            />
          )}
        </AnimatePresence>

        {/* Focus Mode Indicator */}
        <AnimatePresence>
          {targetJobId && viewMode === 'tree' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
                <Navigation className="w-4 h-4" />
                <span className="font-bold text-sm">GPS: {getJobById(targetJobId)?.title}</span>
                <span className="text-xs bg-gray-900/20 px-2 py-0.5 rounded-full">{focusPath.length}단계</span>
                <button onClick={clearFocusMode} className="p-1 hover:bg-gray-900/20 rounded-full">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
