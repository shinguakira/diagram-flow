/**
 * Zustand store for diagram state management with undo/redo support
 */

import { create } from 'zustand';
import type { Diagram, Node, Edge } from '../domain/diagramTypes';
import { createEmptyDiagram } from '../domain/diagramTypes';
import * as ops from '../domain/diagramOps';

interface DiagramHistory {
  past: Diagram[];
  present: Diagram;
  future: Diagram[];
}

interface DiagramStore extends DiagramHistory {
  // Actions
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  moveNode: (nodeId: string, position: { x: number; y: number }) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Utility
  reset: () => void;
  setDiagram: (diagram: Diagram) => void;
}

const MAX_HISTORY = 50;

/**
 * Helper function to add a new state to history
 */
function addToHistory(
  past: Diagram[],
  present: Diagram,
  newPresent: Diagram
): DiagramHistory {
  const newPast = [...past, present].slice(-MAX_HISTORY);
  return {
    past: newPast,
    present: newPresent,
    future: [],
  };
}

export const useDiagramStore = create<DiagramStore>((set, get) => ({
  past: [],
  present: createEmptyDiagram(),
  future: [],

  addNode: (node) =>
    set((state) => {
      const newPresent = ops.addNode(state.present, node);
      return addToHistory(state.past, state.present, newPresent);
    }),

  removeNode: (nodeId) =>
    set((state) => {
      const newPresent = ops.removeNode(state.present, nodeId);
      return addToHistory(state.past, state.present, newPresent);
    }),

  updateNode: (nodeId, updates) =>
    set((state) => {
      const newPresent = ops.updateNode(state.present, nodeId, updates);
      return addToHistory(state.past, state.present, newPresent);
    }),

  moveNode: (nodeId, position) =>
    set((state) => {
      const newPresent = ops.moveNode(state.present, nodeId, position);
      return addToHistory(state.past, state.present, newPresent);
    }),

  addEdge: (edge) =>
    set((state) => {
      const newPresent = ops.addEdge(state.present, edge);
      return addToHistory(state.past, state.present, newPresent);
    }),

  removeEdge: (edgeId) =>
    set((state) => {
      const newPresent = ops.removeEdge(state.present, edgeId);
      return addToHistory(state.past, state.present, newPresent);
    }),

  updateEdge: (edgeId, updates) =>
    set((state) => {
      const newPresent = ops.updateEdge(state.present, edgeId, updates);
      return addToHistory(state.past, state.present, newPresent);
    }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }),

  canUndo: () => get().past.length > 0,

  canRedo: () => get().future.length > 0,

  reset: () =>
    set({
      past: [],
      present: createEmptyDiagram(),
      future: [],
    }),

  setDiagram: (diagram) =>
    set((state) => addToHistory(state.past, state.present, diagram)),
}));
