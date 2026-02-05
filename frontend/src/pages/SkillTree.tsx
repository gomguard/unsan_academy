import { useState, useMemo, useCallback, useEffect } from 'react';
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
  Target,
  Navigation,
  XCircle,
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
const LEVEL_GAP = 130;
const NODE_GAP = 40;

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

// Calculate path from any root to target job (for Career GPS)
function calculatePathToTarget(targetId: string): string[] {
  const target = getJobById(targetId);
  if (!target) return [];

  const path: string[] = [];
  const visited = new Set<string>();

  // Recursively collect all prerequisites
  function collectPath(jobId: string) {
    if (visited.has(jobId)) return;
    visited.add(jobId);

    const job = getJobById(jobId);
    if (!job) return;

    // Add all prerequisites first (depth-first)
    if (job.prerequisiteJobs) {
      for (const prereqId of job.prerequisiteJobs) {
        collectPath(prereqId);
      }
    }

    // Then add this job
    path.push(jobId);
  }

  collectPath(targetId);
  return path;
}

// Build tree structure for a group
function buildGroupTree(group: JobGroup): TreeNode[] {
  const groupJobs = jobDatabase.filter((j) => j.group === group);

  // A job is a "root" in this group if:
  // 1. It has no prerequisites at all, OR
  // 2. All its prerequisites are from OTHER groups (cross-group entry point)
  const roots = groupJobs.filter((j) => {
    if (!j.prerequisiteJobs || j.prerequisiteJobs.length === 0) return true;
    // Check if all prerequisites are from other groups
    const hasInGroupPrereq = j.prerequisiteJobs.some((prereqId) => {
      const prereq = getJobById(prereqId);
      return prereq && prereq.group === group;
    });
    return !hasInGroupPrereq;
  });

  // Track which jobs have been added to avoid duplicates
  const addedJobs = new Set<string>();

  function buildNode(job: Job, depth: number): TreeNode {
    addedJobs.add(job.id);

    const children = getJobsThatRequire(job.id)
      .filter((j) => j.group === group && !addedJobs.has(j.id))
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
  isInFocusPath,
  isTarget,
  isFocusModeActive,
  onClick,
  scale,
}: {
  job: Job;
  x: number;
  y: number;
  isSelected: boolean;
  isLocked: boolean;
  isInFocusPath: boolean;
  isTarget: boolean;
  isFocusModeActive: boolean;
  onClick: () => void;
  scale: number;
}) {
  const group = groupInfo[job.group];
  const color = groupColors[job.group];

  // Determine opacity based on focus mode
  const isDimmed = isFocusModeActive && !isInFocusPath;
  const nodeOpacity = isDimmed ? 0.25 : 1;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: nodeOpacity, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {/* Glow effect for target */}
      {isTarget && (
        <motion.rect
          x={x - 4}
          y={y - 4}
          width={NODE_WIDTH + 8}
          height={NODE_HEIGHT + 8}
          rx={16}
          fill="none"
          stroke="#fef08a"
          strokeWidth={3}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: `${x + NODE_WIDTH / 2}px ${y + NODE_HEIGHT / 2}px` }}
        />
      )}

      {/* Node background */}
      <motion.rect
        x={x}
        y={y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={12}
        fill={isTarget ? '#fef08a' : isSelected ? color : isInFocusPath && isFocusModeActive ? '#2d3a4f' : '#1e293b'}
        stroke={isTarget ? '#fef08a' : isInFocusPath && isFocusModeActive ? '#fef08a' : color}
        strokeWidth={isTarget ? 3 : isSelected ? 3 : isInFocusPath && isFocusModeActive ? 2 : 2}
        whileHover={{ scale: 1.05 }}
        style={{ transformOrigin: `${x + NODE_WIDTH / 2}px ${y + NODE_HEIGHT / 2}px` }}
      />

      {/* Target icon */}
      {isTarget && (
        <g transform={`translate(${x + NODE_WIDTH - 28}, ${y + 4})`}>
          <circle cx={12} cy={12} r={12} fill="#1e293b" />
          <Target x={4} y={4} width={16} height={16} color="#fef08a" />
        </g>
      )}

      {/* Lock icon for locked jobs */}
      {isLocked && !isTarget && (
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
        fill={isTarget ? '#1e293b' : 'white'}
      >
        {group.icon}
      </text>

      {/* Job title */}
      <text
        x={x + 40}
        y={y + 30}
        fontSize={scale < 0.7 ? 9 : 11}
        fill={isTarget ? '#1e293b' : isSelected ? 'white' : '#e2e8f0'}
        fontWeight="bold"
      >
        {job.title.length > 12 ? job.title.slice(0, 12) + '...' : job.title}
      </text>

      {/* Salary */}
      <text
        x={x + 40}
        y={y + 50}
        fontSize={scale < 0.7 ? 8 : 10}
        fill={isTarget ? '#374151' : isSelected ? 'rgba(255,255,255,0.8)' : '#94a3b8'}
      >
        {job.salaryRange.min / 100}k~{job.salaryRange.max / 100}k
      </text>

      {/* Demand indicator */}
      {job.marketDemand === 'Explosive' && !isTarget && (
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
  isInFocusPath,
  isFocusModeActive,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  isInFocusPath: boolean;
  isFocusModeActive: boolean;
}) {
  const startX = from.x + NODE_WIDTH / 2;
  const startY = from.y + NODE_HEIGHT;
  const endX = to.x + NODE_WIDTH / 2;
  const endY = to.y;

  // Bezier curve control points
  const midY = (startY + endY) / 2;

  // Determine styling based on focus mode
  const isDimmed = isFocusModeActive && !isInFocusPath;
  const lineColor = isInFocusPath && isFocusModeActive ? '#fef08a' : color;
  const lineOpacity = isDimmed ? 0.1 : isInFocusPath && isFocusModeActive ? 0.9 : 0.5;
  const lineWidth = isInFocusPath && isFocusModeActive ? 3 : 2;

  return (
    <motion.path
      d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
      fill="none"
      stroke={lineColor}
      strokeWidth={lineWidth}
      strokeOpacity={lineOpacity}
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
  const stepsToReach = focusPath.indexOf(job.id) + 1;

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

        {/* Career GPS Button */}
        <button
          onClick={() => onSetTarget(job.id)}
          className={`w-full py-3 rounded-lg font-bold text-sm mb-4 transition-all flex items-center justify-center gap-2 ${
            isTarget
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          {isTarget ? (
            <>
              <Target className="w-4 h-4" />
              현재 목표 직업
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              이 직업을 목표로 설정
            </>
          )}
        </button>

        {/* Focus path info */}
        {isTarget && focusPath.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 font-bold text-sm">Career GPS 활성화</span>
            </div>
            <p className="text-xs text-slate-400">
              목표까지 <span className="text-yellow-300 font-bold">{stepsToReach}단계</span> 경로가 표시됩니다.
            </p>
          </div>
        )}

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
  const [scale, setScale] = useState(0.5);
  const [pan, setPan] = useState({ x: 100, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Career GPS state from store
  const { targetJobId, focusPath, setTargetJobId, setFocusPath, clearFocusMode } = useStore();

  // Calculate focus path when target changes
  useEffect(() => {
    if (targetJobId) {
      const path = calculatePathToTarget(targetJobId);
      setFocusPath(path);
    } else {
      setFocusPath([]);
    }
  }, [targetJobId, setFocusPath]);

  // Check if focus mode is active
  const isFocusModeActive = targetJobId !== null && focusPath.length > 0;

  // Handle setting target job
  const handleSetTarget = useCallback((jobId: string) => {
    if (targetJobId === jobId) {
      // If clicking same target, clear focus mode
      clearFocusMode();
    } else {
      setTargetJobId(jobId);
    }
  }, [targetJobId, setTargetJobId, clearFocusMode]);

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

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.min(1.5, Math.max(0.3, s + delta)));
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
            <div className="flex items-center gap-1">
              <button
                onClick={() => setScale((s) => Math.max(0.3, s - 0.15))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                title="축소"
              >
                <ZoomOut className="w-4 h-4 text-slate-400" />
              </button>
              <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2">
                {[0.5, 0.75, 1].map((z) => (
                  <button
                    key={z}
                    onClick={() => setScale(z)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      Math.abs(scale - z) < 0.1
                        ? 'bg-yellow-400 text-gray-900 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {Math.round(z * 100)}%
                  </button>
                ))}
              </div>
              <button
                onClick={() => setScale((s) => Math.min(1.5, s + 0.15))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                title="확대"
              >
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setScale(0.5);
                  setPan({ x: 100, y: 20 });
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                title="화면 맞춤"
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
        onWheel={handleWheel}
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

              // Check if this connection is in the focus path
              const fromIndex = focusPath.indexOf(from);
              const toIndex = focusPath.indexOf(to);
              const isConnectionInPath = fromIndex !== -1 && toIndex !== -1 && toIndex === fromIndex + 1;

              return (
                <ConnectionLine
                  key={`${from}-${to}`}
                  from={fromPos}
                  to={toPos}
                  color={color}
                  isInFocusPath={isConnectionInPath}
                  isFocusModeActive={isFocusModeActive}
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
              const isInPath = focusPath.includes(id);
              const isTargetNode = id === targetJobId;

              return (
                <JobNode
                  key={id}
                  job={job}
                  x={pos.x}
                  y={pos.y}
                  isSelected={selectedJob?.id === id}
                  isLocked={hasPrereqs || false}
                  isInFocusPath={isInPath}
                  isTarget={isTargetNode}
                  isFocusModeActive={isFocusModeActive}
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
            onSetTarget={handleSetTarget}
            isTarget={selectedJob.id === targetJobId}
            focusPath={focusPath}
          />
        )}
      </AnimatePresence>

      {/* Focus Mode Indicator */}
      <AnimatePresence>
        {isFocusModeActive && targetJobId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-36 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
              <Navigation className="w-4 h-4" />
              <span className="font-bold text-sm">
                Career GPS: {getJobById(targetJobId)?.title}
              </span>
              <span className="text-xs bg-gray-900/20 px-2 py-0.5 rounded-full">
                {focusPath.length}단계
              </span>
              <button
                onClick={clearFocusMode}
                className="p-1 hover:bg-gray-900/20 rounded-full transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
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
          {isFocusModeActive && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 bg-yellow-400/30 border-2 border-yellow-400 rounded" />
              <span className="text-yellow-400">목표 경로</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700">
        <p className="text-xs text-slate-400 font-medium mb-1">조작법</p>
        <div className="space-y-0.5 text-xs text-slate-500">
          <p>🖱️ 드래그: 화면 이동</p>
          <p>🔄 마우스 휠: 확대/축소</p>
          <p>👆 노드 클릭: 상세 정보</p>
        </div>
      </div>
    </div>
  );
}
