import dagreLib from 'dagre';
import { Position, Node, Edge } from 'reactflow';

// Handle both ESM and CJS imports
const dagre = (dagreLib as any).default || dagreLib;

const nodeWidth = 200;
const nodeHeight = 80;

export interface LayoutOptions {
  direction: 'TB' | 'LR' | 'BT' | 'RL';
  nodeSpacing?: number;
  rankSpacing?: number;
}

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = { direction: 'TB' }
) => {
  const { direction, nodeSpacing = 50, rankSpacing = 100 } = options;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width || nodeWidth,
      height: node.height || nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.width || nodeWidth;
    const height = node.height || nodeHeight;

    // Determine handle positions based on direction
    let targetPosition: Position;
    let sourcePosition: Position;

    switch (direction) {
      case 'LR':
        targetPosition = Position.Left;
        sourcePosition = Position.Right;
        break;
      case 'RL':
        targetPosition = Position.Right;
        sourcePosition = Position.Left;
        break;
      case 'BT':
        targetPosition = Position.Bottom;
        sourcePosition = Position.Top;
        break;
      case 'TB':
      default:
        targetPosition = Position.Top;
        sourcePosition = Position.Bottom;
        break;
    }

    return {
      ...node,
      targetPosition,
      sourcePosition,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Get graph bounds for fitView
export const getGraphBounds = (nodes: Node[]) => {
  if (nodes.length === 0) return { x: 0, y: 0, width: 1000, height: 600 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    const width = node.width || nodeWidth;
    const height = node.height || nodeHeight;
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + width);
    maxY = Math.max(maxY, node.position.y + height);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};
