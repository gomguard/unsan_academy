import { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeProps,
  Handle,
  Position,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Target } from 'lucide-react';
import {
  jobDatabase,
  groupInfo,
  getJobById,
  formatSalaryKorean,
  type Job,
  type JobGroup,
} from '@/lib/jobDatabase';

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

// ============ SIMPLE LAYOUT (No Dagre) ============
function calculateSimpleLayout(jobs: Job[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  // Group jobs by tier (depth)
  const tiers: Map<number, Job[]> = new Map();

  function getJobTier(job: Job, visited = new Set<string>()): number {
    if (visited.has(job.id)) return 0;
    visited.add(job.id);

    if (!job.prerequisiteJobs || job.prerequisiteJobs.length === 0) return 0;

    let maxTier = 0;
    for (const prereqId of job.prerequisiteJobs) {
      const prereq = jobs.find(j => j.id === prereqId);
      if (prereq) {
        maxTier = Math.max(maxTier, getJobTier(prereq, visited) + 1);
      }
    }
    return maxTier;
  }

  jobs.forEach(job => {
    const tier = getJobTier(job);
    if (!tiers.has(tier)) tiers.set(tier, []);
    tiers.get(tier)!.push(job);
  });

  // Position nodes
  const nodeWidth = 200;
  const nodeHeight = 90;
  const horizontalGap = 40;
  const verticalGap = 120;

  tiers.forEach((tierJobs, tier) => {
    const totalWidth = tierJobs.length * nodeWidth + (tierJobs.length - 1) * horizontalGap;
    const startX = -totalWidth / 2;

    tierJobs.forEach((job, index) => {
      positions.set(job.id, {
        x: startX + index * (nodeWidth + horizontalGap),
        y: tier * (nodeHeight + verticalGap),
      });
    });
  });

  return positions;
}

// ============ CUSTOM NODE COMPONENT ============
interface JobNodeData {
  job: Job;
  isSelected: boolean;
  isInPath: boolean;
  isTarget: boolean;
  isDimmed: boolean;
  onClick: (job: Job) => void;
}

function JobNode({ data }: NodeProps<JobNodeData>) {
  const { job, isSelected, isInPath, isTarget, isDimmed, onClick } = data;
  const info = groupInfo[job.group];
  const color = groupColors[job.group];

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'transparent', border: 'none' }}
      />
      <div
        onClick={() => onClick(job)}
        style={{
          width: 180,
          height: 70,
          opacity: isDimmed ? 0.25 : 1,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
            padding: 12,
            border: `2px solid ${isTarget ? '#fef08a' : isInPath ? '#fef08a' : isSelected ? color : '#475569'}`,
            backgroundColor: isTarget ? '#fef08a' : isSelected ? `${color}30` : '#1e293b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>{info.icon}</span>
            {isTarget && <Target style={{ width: 12, height: 12, color: '#1f2937' }} />}
            <span
              style={{
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: `${color}30`,
                color: color,
                fontWeight: 500,
              }}
            >
              {info.name.split('/')[0]}
            </span>
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 12,
              color: isTarget ? '#1f2937' : 'white',
              lineHeight: 1.2,
            }}
          >
            {job.title.length > 14 ? job.title.slice(0, 14) + '...' : job.title}
          </div>
          <div
            style={{
              fontSize: 10,
              marginTop: 2,
              color: isTarget ? '#4b5563' : '#94a3b8',
            }}
          >
            {formatSalaryKorean(job.salaryRange)}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none' }}
      />
    </>
  );
}

const nodeTypes = { jobNode: JobNode };

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
  const isFocusModeActive = targetJobId !== null && focusPath.length > 0;

  const { initialNodes, initialEdges } = useMemo(() => {
    const jobs = selectedGroup === 'all'
      ? jobDatabase
      : jobDatabase.filter(j => j.group === selectedGroup);

    const positions = calculateSimpleLayout(jobs);

    const nodes: Node<JobNodeData>[] = jobs.map(job => {
      const pos = positions.get(job.id) || { x: 0, y: 0 };
      return {
        id: job.id,
        type: 'jobNode',
        position: pos,
        data: {
          job,
          isSelected: selectedJob?.id === job.id,
          isInPath: focusPath.includes(job.id),
          isTarget: job.id === targetJobId,
          isDimmed: isFocusModeActive && !focusPath.includes(job.id),
          onClick: setSelectedJob,
        },
      };
    });

    const edges: Edge[] = [];
    jobs.forEach(job => {
      if (job.prerequisiteJobs) {
        job.prerequisiteJobs.forEach(prereqId => {
          if (jobs.find(j => j.id === prereqId)) {
            const fromIndex = focusPath.indexOf(prereqId);
            const toIndex = focusPath.indexOf(job.id);
            const isEdgeInPath = fromIndex !== -1 && toIndex !== -1 && toIndex === fromIndex + 1;
            const isDimmedEdge = isFocusModeActive && !isEdgeInPath;

            edges.push({
              id: `${prereqId}-${job.id}`,
              source: prereqId,
              target: job.id,
              type: 'smoothstep',
              animated: isEdgeInPath,
              style: {
                stroke: isEdgeInPath ? '#fef08a' : groupColors[job.group],
                strokeWidth: isEdgeInPath ? 3 : 2,
                opacity: isDimmedEdge ? 0.1 : isEdgeInPath ? 1 : 0.5,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: isEdgeInPath ? '#fef08a' : groupColors[job.group],
                width: 15,
                height: 15,
              },
            });
          }
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [selectedGroup, selectedJob, focusPath, targetJobId, isFocusModeActive, setSelectedJob]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const nodeColor = useCallback((node: Node) => {
    const job = node.data?.job as Job | undefined;
    if (!job) return '#374151';
    if (node.data?.isTarget) return '#fef08a';
    if (node.data?.isInPath) return '#fef08a80';
    return groupColors[job.group];
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      minZoom={0.1}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#334155"
      />
      <Controls
        style={{ background: '#1e293b', borderColor: '#334155', borderRadius: 8 }}
        showInteractive={false}
      />
      <MiniMap
        nodeColor={nodeColor}
        maskColor="rgba(15, 23, 42, 0.8)"
        style={{ background: '#1e293b', borderColor: '#334155', borderRadius: 8 }}
        pannable
        zoomable
      />
    </ReactFlow>
  );
}

export function SkillTreeFlow(props: SkillTreeFlowProps) {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 160px)', background: '#0f172a' }}>
      <ReactFlowProvider>
        <SkillTreeFlowInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
