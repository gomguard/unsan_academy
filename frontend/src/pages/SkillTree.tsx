import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitBranch,
  ChevronRight,
  Lock,
  Unlock,
  Star,
  X,
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

// ============ TYPES ============
interface TreeNode {
  job: Job;
  children: TreeNode[];
  depth: number;
  x: number;
  y: number;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  depth: number;
}

// ============ CONSTANTS ============
const NODE_WIDTH = 160;
const NODE_HEIGHT = 80;
const LEVEL_GAP = 120;
const NODE_GAP = 20;

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
// Get root jobs (jobs with no prerequisites)
function getRootJobs(): Job[] {
  return jobDatabase.filter(
    (job) => !job.prerequisiteJobs || job.prerequisiteJobs.length === 0
  );
}

// Build tree structure for a group
function buildGroupTree(group: JobGroup): TreeNode[] {
  const groupJobs = jobDatabase.filter((j) => j.group === group);
  const roots = groupJobs.filter(
    (j) => !j.prerequisiteJobs || j.prerequisiteJobs.length === 0
  );

  function buildNode(job: Job, depth: number): TreeNode {
    const children = getJobsThatRequire(job.id)
      .filter((j) => j.group === group)
      .map((child) => buildNode(child, depth + 1));

    return {
      job,
      children,
      depth,
      x: 0,
      y: depth * LEVEL_GAP,
    };
  }

  return roots.map((root) => buildNode(root, 0));
}

// Calculate positions for nodes
function calculatePositions(trees: TreeNode[]): NodePosition[] {
  const positions: NodePosition[] = [];
  let currentX = 0;

  function traverse(node: TreeNode, offsetX: number): number {
    const childWidths: number[] = [];
    let totalChildWidth = 0;

    // First, calculate positions for all children
    for (const child of node.children) {
      const width = traverse(child, offsetX + totalChildWidth);
      childWidths.push(width);
      totalChildWidth += width + NODE_GAP;
    }

    if (totalChildWidth > 0) totalChildWidth -= NODE_GAP;

    // Calculate this node's position
    const nodeWidth = Math.max(NODE_WIDTH, totalChildWidth);
    const nodeX = offsetX + nodeWidth / 2 - NODE_WIDTH / 2;

    positions.push({
      id: node.job.id,
      x: nodeX,
      y: node.depth * LEVEL_GAP,
      depth: node.depth,
    });

    node.x = nodeX;

    return nodeWidth;
  }

  for (const tree of trees) {
    const width = traverse(tree, currentX);
    currentX += width + NODE_GAP * 3;
  }

  return positions;
}

// ============ COMPONENTS ============
function JobNode({
  job,
  x,
  y,
  isSelected,
  isLocked,
  onClick,
  scale,
}: {
  job: Job;
  x: number;
  y: number;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
  scale: number;
}) {
  const group = groupInfo[job.group];
  const color = groupColors[job.group];

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {/* Node background */}
      <motion.rect
        x={x}
        y={y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={12}
        fill={isSelected ? color : '#1e293b'}
        stroke={color}
        strokeWidth={isSelected ? 3 : 2}
        whileHover={{ scale: 1.05 }}
        style={{ transformOrigin: `${x + NODE_WIDTH / 2}px ${y + NODE_HEIGHT / 2}px` }}
      />

      {/* Lock icon for locked jobs */}
      {isLocked && (
        <g transform={`translate(${x + NODE_WIDTH - 24}, ${y + 8})`}>
          <circle cx={8} cy={8} r={10} fill="#374151" />
          <Lock x={2} y={2} width={12} height={12} color="#9ca3af" />
        </g>
      )}

      {/* Group icon */}
      <text
        x={x + 12}
        y={y + 28}
        fontSize={scale < 0.7 ? 16 : 20}
        fill="white"
      >
        {group.icon}
      </text>

      {/* Job title */}
      <text
        x={x + 40}
        y={y + 30}
        fontSize={scale < 0.7 ? 9 : 11}
        fill={isSelected ? 'white' : '#e2e8f0'}
        fontWeight="bold"
      >
        {job.title.length > 12 ? job.title.slice(0, 12) + '...' : job.title}
      </text>

      {/* Salary */}
      <text
        x={x + 40}
        y={y + 50}
        fontSize={scale < 0.7 ? 8 : 10}
        fill={isSelected ? 'rgba(255,255,255,0.8)' : '#94a3b8'}
      >
        {job.salaryRange.min / 100}k~{job.salaryRange.max / 100}k
      </text>

      {/* Demand indicator */}
      {job.marketDemand === 'Explosive' && (
        <text x={x + NODE_WIDTH - 24} y={y + NODE_HEIGHT - 8} fontSize={12}>
          🔥
        </text>
      )}
    </motion.g>
  );
}

function ConnectionLine({
  from,
  to,
  color,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
}) {
  const startX = from.x + NODE_WIDTH / 2;
  const startY = from.y + NODE_HEIGHT;
  const endX = to.x + NODE_WIDTH / 2;
  const endY = to.y;

  // Bezier curve control points
  const midY = (startY + endY) / 2;

  return (
    <motion.path
      d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeOpacity={0.5}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}

function JobDetailPanel({
  job,
  onClose,
  onNavigate,
}: {
  job: Job;
  onClose: () => void;
  onNavigate: (jobId: string) => void;
}) {
  const prerequisites = getPrerequisiteJobs(job.id);
  const unlocks = getJobsThatRequire(job.id);
  const group = groupInfo[job.group];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-4 bottom-4 w-80 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl z-50"
    >
      {/* Header */}
      <div
        className="p-4 border-b border-slate-700"
        style={{ backgroundColor: `${groupColors[job.group]}20` }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{group.icon}</span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <h3 className="text-xl font-bold text-white">{job.title}</h3>
        <p className="text-sm text-slate-400 mt-1">{group.name}</p>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[calc(100%-200px)]">
        {/* Description */}
        <p className="text-slate-300 text-sm mb-4">{job.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500">연봉</p>
            <p className="text-green-400 font-bold">
              {formatSalaryKorean(job.salaryRange)}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500">수요</p>
            <p
              className={`font-bold ${
                job.marketDemand === 'Explosive'
                  ? 'text-red-400'
                  : job.marketDemand === 'High'
                  ? 'text-orange-400'
                  : 'text-slate-400'
              }`}
            >
              {job.marketDemand === 'Explosive'
                ? '🔥 급상승'
                : job.marketDemand === 'High'
                ? '📈 높음'
                : job.marketDemand === 'Stable'
                ? '➡️ 안정'
                : '📉 하락'}
            </p>
          </div>
        </div>

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-bold text-white">선행 직업</h4>
            </div>
            <div className="space-y-2">
              {prerequisites.map((prereq) => (
                <button
                  key={prereq.id}
                  onClick={() => onNavigate(prereq.id)}
                  className="w-full flex items-center gap-2 p-2 bg-slate-900/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                  <span>{groupInfo[prereq.group].icon}</span>
                  <span className="text-sm text-slate-300 flex-1">
                    {prereq.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unlocks */}
        {unlocks.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Unlock className="w-4 h-4 text-green-400" />
              <h4 className="text-sm font-bold text-white">
                해금되는 직업 ({unlocks.length})
              </h4>
            </div>
            <div className="space-y-2">
              {unlocks.map((unlock) => (
                <button
                  key={unlock.id}
                  onClick={() => onNavigate(unlock.id)}
                  className="w-full flex items-center gap-2 p-2 bg-slate-900/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                  <span>{groupInfo[unlock.group].icon}</span>
                  <span className="text-sm text-slate-300 flex-1">
                    {unlock.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============
export function SkillTree() {
  const [selectedGroup, setSelectedGroup] = useState<JobGroup | 'all'>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [scale, setScale] = useState(0.8);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Build tree data
  const treeData = useMemo(() => {
    if (selectedGroup === 'all') {
      // Build trees for all groups
      const allTrees: { group: JobGroup; trees: TreeNode[] }[] = [];
      const groups: JobGroup[] = [
        'Maintenance',
        'Body',
        'Film',
        'EV_Future',
        'Management',
        'Niche',
        'NextGen',
      ];

      for (const group of groups) {
        const trees = buildGroupTree(group);
        if (trees.length > 0) {
          allTrees.push({ group, trees });
        }
      }
      return allTrees;
    } else {
      return [{ group: selectedGroup, trees: buildGroupTree(selectedGroup) }];
    }
  }, [selectedGroup]);

  // Calculate all node positions
  const allPositions = useMemo(() => {
    const positions: Map<string, NodePosition> = new Map();
    let offsetX = 0;

    for (const { trees } of treeData) {
      const treePositions = calculatePositions(trees);

      for (const pos of treePositions) {
        positions.set(pos.id, {
          ...pos,
          x: pos.x + offsetX,
        });
      }

      // Find max x for this group
      const maxX = Math.max(...treePositions.map((p) => p.x)) + NODE_WIDTH;
      offsetX = maxX + NODE_GAP * 5;
    }

    return positions;
  }, [treeData]);

  // Get all connections
  const connections = useMemo(() => {
    const conns: { from: string; to: string; color: string }[] = [];

    for (const job of jobDatabase) {
      if (job.prerequisiteJobs) {
        for (const prereqId of job.prerequisiteJobs) {
          const prereq = getJobById(prereqId);
          if (prereq && allPositions.has(prereqId) && allPositions.has(job.id)) {
            conns.push({
              from: prereqId,
              to: job.id,
              color: groupColors[job.group],
            });
          }
        }
      }
    }

    return conns;
  }, [allPositions]);

  // Calculate SVG dimensions
  const svgDimensions = useMemo(() => {
    if (allPositions.size === 0) return { width: 1000, height: 600 };

    let maxX = 0;
    let maxY = 0;

    allPositions.forEach((pos) => {
      maxX = Math.max(maxX, pos.x + NODE_WIDTH);
      maxY = Math.max(maxY, pos.y + NODE_HEIGHT);
    });

    return { width: maxX + 100, height: maxY + 100 };
  }, [allPositions]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const groups = Object.entries(groupInfo) as [JobGroup, typeof groupInfo[JobGroup]][];

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/jobs"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Job Library</span>
              </Link>

              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-yellow-400" />
                <h1 className="text-xl font-bold text-white">Skill Tree</h1>
              </div>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4 text-slate-400" />
              </button>
              <span className="text-sm text-slate-400 w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setScale(0.8);
                  setPan({ x: 50, y: 50 });
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Maximize2 className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Group filter */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedGroup === 'all'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              전체 ({jobDatabase.length})
            </button>
            {groups.map(([key, info]) => {
              const count = jobDatabase.filter((j) => j.group === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedGroup(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedGroup === key
                      ? 'text-gray-900'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor:
                      selectedGroup === key ? groupColors[key] : undefined,
                  }}
                >
                  <span>{info.icon}</span>
                  {info.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Canvas */}
      <div
        className="pt-32 h-screen overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`${-pan.x} ${-pan.y} ${svgDimensions.width / scale} ${
            svgDimensions.height / scale
          }`}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {/* Connections */}
          <g className="connections">
            {connections.map(({ from, to, color }) => {
              const fromPos = allPositions.get(from);
              const toPos = allPositions.get(to);
              if (!fromPos || !toPos) return null;

              return (
                <ConnectionLine
                  key={`${from}-${to}`}
                  from={fromPos}
                  to={toPos}
                  color={color}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {Array.from(allPositions.entries()).map(([id, pos]) => {
              const job = getJobById(id);
              if (!job) return null;

              const hasPrereqs =
                job.prerequisiteJobs && job.prerequisiteJobs.length > 0;

              return (
                <JobNode
                  key={id}
                  job={job}
                  x={pos.x}
                  y={pos.y}
                  isSelected={selectedJob?.id === id}
                  isLocked={hasPrereqs || false}
                  onClick={() => setSelectedJob(job)}
                  scale={scale}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailPanel
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onNavigate={(jobId) => {
              const job = getJobById(jobId);
              if (job) setSelectedJob(job);
            }}
          />
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="fixed bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 border border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 mb-2">범례</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-slate-700 border-2 border-blue-500 rounded" />
            <span className="text-slate-400">선택 가능</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Lock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">선행 조건 필요</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>🔥</span>
            <span className="text-slate-400">급성장 직업</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-700">
        <p className="text-xs text-slate-500">
          드래그: 이동 | 스크롤: 확대/축소 | 클릭: 상세보기
        </p>
      </div>
    </div>
  );
}
