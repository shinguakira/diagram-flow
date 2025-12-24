/**
 * Pure functions for diagram operations
 * No React dependencies - domain logic only
 */

import type { Diagram, Node, Edge } from './diagramTypes';
import { validateEdge } from './diagramTypes';

/**
 * Add a node to the diagram
 */
export function addNode(diagram: Diagram, node: Node): Diagram {
  const newNodes = new Map(diagram.nodes);
  newNodes.set(node.id, node);
  
  return {
    ...diagram,
    nodes: newNodes,
  };
}

/**
 * Remove a node from the diagram and all related edges
 */
export function removeNode(diagram: Diagram, nodeId: string): Diagram {
  const newNodes = new Map(diagram.nodes);
  newNodes.delete(nodeId);
  
  // Remove all edges connected to this node
  const newEdges = new Map(diagram.edges);
  for (const [edgeId, edge] of diagram.edges.entries()) {
    if (edge.sourceId === nodeId || edge.targetId === nodeId) {
      newEdges.delete(edgeId);
    }
  }
  
  return {
    nodes: newNodes,
    edges: newEdges,
  };
}

/**
 * Update a node in the diagram
 */
export function updateNode(diagram: Diagram, nodeId: string, updates: Partial<Node>): Diagram {
  const node = diagram.nodes.get(nodeId);
  if (!node) {
    return diagram;
  }
  
  const newNodes = new Map(diagram.nodes);
  newNodes.set(nodeId, { ...node, ...updates });
  
  return {
    ...diagram,
    nodes: newNodes,
  };
}

/**
 * Move a node to a new position
 */
export function moveNode(diagram: Diagram, nodeId: string, position: { x: number; y: number }): Diagram {
  return updateNode(diagram, nodeId, { position });
}

/**
 * Add an edge to the diagram
 */
export function addEdge(diagram: Diagram, edge: Edge): Diagram {
  // Validate that the edge connects to existing nodes
  if (!validateEdge(edge, diagram)) {
    return diagram;
  }
  
  const newEdges = new Map(diagram.edges);
  newEdges.set(edge.id, edge);
  
  return {
    ...diagram,
    edges: newEdges,
  };
}

/**
 * Remove an edge from the diagram
 */
export function removeEdge(diagram: Diagram, edgeId: string): Diagram {
  const newEdges = new Map(diagram.edges);
  newEdges.delete(edgeId);
  
  return {
    ...diagram,
    edges: newEdges,
  };
}

/**
 * Update an edge in the diagram
 */
export function updateEdge(diagram: Diagram, edgeId: string, updates: Partial<Edge>): Diagram {
  const edge = diagram.edges.get(edgeId);
  if (!edge) {
    return diagram;
  }
  
  const newEdges = new Map(diagram.edges);
  newEdges.set(edgeId, { ...edge, ...updates });
  
  return {
    ...diagram,
    edges: newEdges,
  };
}

/**
 * Get all edges connected to a node
 */
export function getConnectedEdges(diagram: Diagram, nodeId: string): Edge[] {
  const connectedEdges: Edge[] = [];
  
  for (const edge of diagram.edges.values()) {
    if (edge.sourceId === nodeId || edge.targetId === nodeId) {
      connectedEdges.push(edge);
    }
  }
  
  return connectedEdges;
}
