/**
 * DiagramCanvas - SVG-based canvas for rendering nodes and edges
 */

import { useRef, useState, useCallback } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import type { Node as DiagramNode } from '@/domain/diagramTypes';
import { generateId } from '@/domain/diagramTypes';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '@/lib/constants';

interface DiagramCanvasProps {
  className?: string;
}

export function DiagramCanvas({ className = '' }: DiagramCanvasProps) {
  const { present, addNode, moveNode } = useDiagramStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ nodeId: string; offsetX: number; offsetY: number } | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Convert nodes Map to array for rendering
  const nodes = Array.from(present.nodes.values());
  const edges = Array.from(present.edges.values());

  const handleSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (e.target === svgRef.current || (e.target as SVGElement).tagName === 'svg') {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create a new node at click position
        const newNode: DiagramNode = {
          id: generateId('node'),
          type: 'default',
          label: 'New Node',
          position: { x, y },
          width: DEFAULT_NODE_WIDTH,
          height: DEFAULT_NODE_HEIGHT,
        };

        addNode(newNode);
      }
    },
    [addNode]
  );

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, node: DiagramNode) => {
      e.stopPropagation();
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDragging({
        nodeId: node.id,
        offsetX: e.clientX - rect.left - node.position.x,
        offsetY: e.clientY - rect.top - node.position.y,
      });
      setSelectedNodeId(node.id);
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!dragging) return;

      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left - dragging.offsetX;
      const y = e.clientY - rect.top - dragging.offsetY;

      moveNode(dragging.nodeId, { x, y });
    },
    [dragging, moveNode]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'input':
        return 'fill-blue-100 stroke-blue-500';
      case 'output':
        return 'fill-green-100 stroke-green-500';
      case 'process':
        return 'fill-purple-100 stroke-purple-500';
      default:
        return 'fill-gray-100 stroke-gray-500';
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full bg-white cursor-crosshair"
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render edges */}
        {edges.map((edge) => {
          const sourceNode = present.nodes.get(edge.sourceId);
          const targetNode = present.nodes.get(edge.targetId);
          if (!sourceNode || !targetNode) return null;

          const sourceX = sourceNode.position.x + (sourceNode.width || DEFAULT_NODE_WIDTH) / 2;
          const sourceY = sourceNode.position.y + (sourceNode.height || DEFAULT_NODE_HEIGHT) / 2;
          const targetX = targetNode.position.x + (targetNode.width || DEFAULT_NODE_WIDTH) / 2;
          const targetY = targetNode.position.y + (targetNode.height || DEFAULT_NODE_HEIGHT) / 2;

          return (
            <g key={edge.id}>
              <line
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <text
                  x={(sourceX + targetX) / 2}
                  y={(sourceY + targetY) / 2}
                  fill="#475569"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Define arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Render nodes */}
        {nodes.map((node) => {
          const width = node.width || DEFAULT_NODE_WIDTH;
          const height = node.height || DEFAULT_NODE_HEIGHT;
          const isSelected = node.id === selectedNodeId;

          return (
            <g
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              className="cursor-move"
            >
              <rect
                x={node.position.x}
                y={node.position.y}
                width={width}
                height={height}
                className={`${getNodeColor(node.type)} ${
                  isSelected ? 'stroke-[3]' : 'stroke-2'
                }`}
                rx="8"
              />
              <text
                x={node.position.x + width / 2}
                y={node.position.y + height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-800 pointer-events-none select-none"
                fontSize="14"
                fontWeight="500"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Instructions overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">Click anywhere to create a node</p>
            <p className="text-sm">Drag nodes to move them</p>
          </div>
        </div>
      )}
    </div>
  );
}
