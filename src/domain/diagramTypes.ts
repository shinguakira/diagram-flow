/**
 * Domain types for the diagram flow editor
 * No React dependencies - pure domain logic
 */

export type NodeType = 'default' | 'input' | 'output' | 'process';

export interface Position {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: NodeType;
  label: string;
  position: Position;
  width?: number;
  height?: number;
}

export interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface Diagram {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
}

/**
 * Create an empty diagram
 */
export function createEmptyDiagram(): Diagram {
  return {
    nodes: new Map(),
    edges: new Map(),
  };
}

/**
 * Validate that an edge connects to existing nodes
 */
export function validateEdge(edge: Edge, diagram: Diagram): boolean {
  return (
    diagram.nodes.has(edge.sourceId) &&
    diagram.nodes.has(edge.targetId)
  );
}

/**
 * Generate a unique ID for nodes and edges
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
