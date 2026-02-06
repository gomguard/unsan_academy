import { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  NodeProps,
  Handle,
  Position,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Grid,
  GitBranch,
} from 'lucide-react';
import {
  jobDatabase,
  groupInfo,
  formatSalaryKorean,
  type Job,
  type JobGroup,
} from '@/lib/jobDatabase';

// ============ TYPES ============
type ViewMode = 'overview' | 'category';

// ============ CONSTANTS ============
const groupColors: Record<JobGroup, string> = {
  Maintenance: '#3b82f6',
  Body: '#ec4899',
  Film: '#f59e0b',
  EV_Future: '#8b5cf6',
  Management: '#6366f1',
  Niche: '#ef4444',
  NextGen: '#10b981',
};

const groupDescriptions: Record<JobGroup, string> = {
  Maintenance: '엔진, 섀시, 브레이크 등 핵심 정비',
  Body: '외관 관리, 도장, 복원 전문',
  Film: 'PPF, 틴팅, 랩핑 시공',
  EV_Future: '전기차, 자율주행 미래 기술',
  Management: '서비스 어드바이저, 매니저',
  Niche: '클래식카, 캠핑카, 튜닝',
  NextGen: '진단, 소프트웨어, AI',
};

// ============ CATEGORY OVERVIEW COMPONENT ============
function CategoryOverview({
  onSelectCategory,
  selectedGroup,
}: {
  onSelectCategory: (group: JobGroup) => void;
  selectedGroup: JobGroup | 'all';
}) {
  const groups = Object.entries(groupInfo) as [JobGroup, typeof groupInfo[JobGroup]][];

  // Calculate stats per group
  const groupStats = useMemo(() => {
    const stats: Record<string, {
      count: number;
      avgSalary: number;
      maxSalary: number;
      explosiveCount: number;
      starterCount: number;
    }> = {};

    groups.forEach(([key]) => {
      const jobs = jobDatabase.filter(j => j.group === key);
      const avgSalary = jobs.reduce((sum, j) => sum + (j.salaryRange.min + j.salaryRange.max) / 2, 0) / jobs.length;
      const maxSalary = Math.max(...jobs.map(j => j.salaryRange.max));
      const explosiveCount = jobs.filter(j => j.marketDemand === 'Explosive').length;
      const starterCount = jobs.filter(j => !j.prerequisiteJobs || j.prerequisiteJobs.length === 0).length;

      stats[key] = {
        count: jobs.length,
        avgSalary: Math.round(avgSalary),
        maxSalary,
        explosiveCount,
        starterCount,
      };
    });

    return stats;
  }, [groups]);

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Total Stats Bar */}
        <div className="flex items-center justify-between mb-6 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-slate-400" />
              <span className="text-slate-400">7개 분야</span>
              <span className="text-white font-bold">{jobDatabase.length}개 직업</span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-slate-400">평균 연봉</span>
              <span className="text-green-400 font-bold">
                {Math.round(jobDatabase.reduce((sum, j) => sum + (j.salaryRange.min + j.salaryRange.max) / 2, 0) / jobDatabase.length / 100) * 100}만원
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            분야를 클릭해서 상세 경로 보기 →
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map(([key, info], index) => {
            const stats = groupStats[key];
            const color = groupColors[key];

            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectCategory(key)}
                className="group relative bg-slate-800 border-2 rounded-2xl p-5 text-left transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{
                  borderColor: selectedGroup === key ? color : '#334155',
                  boxShadow: selectedGroup === key ? `0 0 30px ${color}30` : 'none',
                }}
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {info.name.split('/')[0]}
                    </h3>
                    <p className="text-xs text-slate-500">{stats.count}개 직업</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {groupDescriptions[key]}
                </p>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">평균 연봉</span>
                    <span className="text-green-400 font-bold">{stats.avgSalary}만원</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">최고 연봉</span>
                    <span className="text-white font-medium">{stats.maxSalary.toLocaleString()}만원</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mt-4">
                  {stats.explosiveCount > 0 && (
                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      급상승 {stats.explosiveCount}
                    </span>
                  )}
                  {stats.starterCount > 0 && (
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      입문 {stats.starterCount}
                    </span>
                  )}
                </div>

                {/* Hover Arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-6 h-6 text-slate-400" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Filter Legend */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-400" />
            <span>급상승 = 채용 급증</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-400" />
            <span>입문 = 선행 조건 없음</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ CATEGORY DETAIL FLOW ============
interface JobNodeData {
  job: Job;
  isSelected: boolean;
  isInPath: boolean;
  isTarget: boolean;
  level: number;
  onClick: (job: Job) => void;
}

function JobNode({ data }: NodeProps<JobNodeData>) {
  const { job, isSelected, isInPath, isTarget, level, onClick } = data;
  const info = groupInfo[job.group];
  const color = groupColors[job.group];

  const borderColor = isTarget ? '#fef08a' : isInPath ? '#fef08a80' : isSelected ? color : '#475569';
  const bgColor = isTarget ? '#fef08a' : isSelected ? `${color}30` : '#1e293b';

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ background: 'transparent', border: 'none' }} />
      <div
        onClick={() => onClick(job)}
        className="cursor-pointer transition-all hover:scale-105"
        style={{ width: 200, opacity: 1 }}
      >
        <div
          className="rounded-xl p-3"
          style={{
            border: `2px solid ${borderColor}`,
            backgroundColor: bgColor,
            boxShadow: isSelected ? `0 0 20px ${color}40` : 'none',
          }}
        >
          {/* Level indicator */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${color}20`, color }}
            >
              Lv.{level}
            </span>
            {job.marketDemand === 'Explosive' && (
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> HOT
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{info.icon}</span>
            <span
              className="font-bold text-sm"
              style={{ color: isTarget ? '#1f2937' : 'white' }}
            >
              {job.title.length > 12 ? job.title.slice(0, 12) + '...' : job.title}
            </span>
          </div>

          <div className="text-xs text-green-400 font-medium">
            {formatSalaryKorean(job.salaryRange)}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'transparent', border: 'none' }} />
    </>
  );
}

const nodeTypes = { jobNode: JobNode };

function CategoryDetailFlow({
  group,
  onBack,
  selectedJob,
  setSelectedJob,
  focusPath,
  targetJobId,
}: {
  group: JobGroup;
  onBack: () => void;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  focusPath: string[];
  targetJobId: string | null;
}) {
  const reactFlowInstance = useReactFlow();
  const groupJobs = useMemo(() => jobDatabase.filter(j => j.group === group), [group]);
  const info = groupInfo[group];
  const color = groupColors[group];

  // Calculate job levels within this group
  const jobLevels = useMemo(() => {
    const levels = new Map<string, number>();

    const calculateLevel = (jobId: string, visited: Set<string> = new Set()): number => {
      if (visited.has(jobId)) return 0;
      visited.add(jobId);

      const job = groupJobs.find(j => j.id === jobId);
      if (!job) return 0;

      if (!job.prerequisiteJobs || job.prerequisiteJobs.length === 0) {
        levels.set(jobId, 1);
        return 1;
      }

      const prereqLevels = job.prerequisiteJobs
        .filter(pid => groupJobs.some(j => j.id === pid))
        .map(pid => levels.get(pid) ?? calculateLevel(pid, visited));

      const level = Math.max(...prereqLevels, 0) + 1;
      levels.set(jobId, level);
      return level;
    };

    groupJobs.forEach(job => calculateLevel(job.id));
    return levels;
  }, [groupJobs]);

  // Create horizontal layered layout
  const { nodes, edges } = useMemo(() => {
    const maxLevel = Math.max(...Array.from(jobLevels.values()), 1);
    const levelCounts: Record<number, number> = {};
    const levelCurrentIndex: Record<number, number> = {};

    // Count jobs per level
    groupJobs.forEach(job => {
      const level = jobLevels.get(job.id) || 1;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
      levelCurrentIndex[level] = 0;
    });

    const HORIZONTAL_GAP = 280;
    const VERTICAL_GAP = 140;

    const nodeList: Node<JobNodeData>[] = groupJobs.map(job => {
      const level = jobLevels.get(job.id) || 1;
      const countInLevel = levelCounts[level];
      const indexInLevel = levelCurrentIndex[level]++;

      const x = (level - 1) * HORIZONTAL_GAP + 100;
      const totalHeight = (countInLevel - 1) * VERTICAL_GAP;
      const y = (indexInLevel * VERTICAL_GAP) - (totalHeight / 2) + 300;

      return {
        id: job.id,
        type: 'jobNode',
        position: { x, y },
        data: {
          job,
          isSelected: selectedJob?.id === job.id,
          isInPath: focusPath.includes(job.id),
          isTarget: job.id === targetJobId,
          level,
          onClick: setSelectedJob,
        },
      };
    });

    const edgeList: Edge[] = [];
    groupJobs.forEach(job => {
      if (job.prerequisiteJobs) {
        job.prerequisiteJobs.forEach(prereqId => {
          if (groupJobs.find(j => j.id === prereqId)) {
            edgeList.push({
              id: `${prereqId}-${job.id}`,
              source: prereqId,
              target: job.id,
              type: 'smoothstep',
              animated: focusPath.includes(prereqId) && focusPath.includes(job.id),
              style: {
                stroke: color,
                strokeWidth: 2,
                opacity: 0.6,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: color,
                width: 12,
                height: 12,
              },
            });
          }
        });
      }
    });

    return { nodes: nodeList, edges: edgeList };
  }, [groupJobs, jobLevels, selectedJob, focusPath, targetJobId, color, setSelectedJob]);

  const [reactNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  useEffect(() => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 500 });
      }, 100);
    }
  }, [reactFlowInstance, group]);

  const nodeColor = useCallback((node: Node) => {
    if (node.data?.isTarget) return '#fef08a';
    if (node.data?.isInPath) return '#fef08a80';
    return color;
  }, [color]);

  return (
    <div className="h-full relative">
      {/* Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">전체 보기</span>
        </button>

        <div
          className="flex items-center gap-3 px-5 py-2.5 rounded-xl border"
          style={{ backgroundColor: `${color}20`, borderColor: color }}
        >
          <span className="text-2xl">{info.icon}</span>
          <div>
            <h2 className="font-bold text-white">{info.name}</h2>
            <p className="text-xs text-slate-400">{groupJobs.length}개 직업 경로</p>
          </div>
        </div>
      </div>

      {/* Level Legend */}
      <div className="absolute bottom-4 left-4 z-50 bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <p className="text-xs text-slate-400 mb-2">경력 레벨</p>
        <div className="flex items-center gap-3">
          {[1, 2, 3].map(level => (
            <div key={level} className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${color}20`, color }}
              >
                Lv.{level}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
            </div>
          ))}
          <span className="text-xs text-slate-500">전문가</span>
        </div>
      </div>

      <ReactFlow
        nodes={reactNodes}
        edges={reactEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        <Controls style={{ background: '#1e293b', borderColor: '#334155', borderRadius: 8 }} showInteractive={false} />
        <MiniMap
          nodeColor={nodeColor}
          maskColor="rgba(15, 23, 42, 0.8)"
          style={{ background: '#1e293b', borderColor: '#334155', borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}

// ============ MAIN COMPONENT ============
interface SkillTreeFlowProps {
  selectedGroup: JobGroup | 'all';
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  focusPath: string[];
  targetJobId: string | null;
}

function SkillTreeFlowInner({
  selectedGroup,
  selectedJob,
  setSelectedJob,
  focusPath,
  targetJobId,
}: SkillTreeFlowProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(selectedGroup === 'all' ? 'overview' : 'category');
  const [activeCategory, setActiveCategory] = useState<JobGroup | null>(
    selectedGroup === 'all' ? null : selectedGroup
  );

  // Sync with parent's selectedGroup
  useEffect(() => {
    if (selectedGroup === 'all') {
      setViewMode('overview');
      setActiveCategory(null);
    } else {
      setViewMode('category');
      setActiveCategory(selectedGroup);
    }
  }, [selectedGroup]);

  const handleSelectCategory = (group: JobGroup) => {
    setActiveCategory(group);
    setViewMode('category');
  };

  const handleBack = () => {
    setViewMode('overview');
    setActiveCategory(null);
    setSelectedJob(null);
  };

  return (
    <AnimatePresence mode="wait">
      {viewMode === 'overview' ? (
        <motion.div
          key="overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          <CategoryOverview
            onSelectCategory={handleSelectCategory}
            selectedGroup={selectedGroup}
          />
        </motion.div>
      ) : activeCategory ? (
        <motion.div
          key={`category-${activeCategory}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="h-full"
        >
          <ReactFlowProvider>
            <CategoryDetailFlow
              group={activeCategory}
              onBack={handleBack}
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
              focusPath={focusPath}
              targetJobId={targetJobId}
            />
          </ReactFlowProvider>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SkillTreeFlow(props: SkillTreeFlowProps) {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 180px)', background: '#0f172a' }}>
      <SkillTreeFlowInner {...props} />
    </div>
  );
}
