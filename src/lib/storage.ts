/**
 * Local storage utilities for persisting diagram state
 */

import type { Diagram, Node, Edge } from '@/domain/diagramTypes';

const STORAGE_KEY = 'diagram-flow-data';

/**
 * Serialize diagram to JSON-compatible format
 */
function serializeDiagram(diagram: Diagram): { nodes: Node[]; edges: Edge[] } {
  return {
    nodes: Array.from(diagram.nodes.values()),
    edges: Array.from(diagram.edges.values()),
  };
}

/**
 * Deserialize diagram from JSON format
 */
function deserializeDiagram(data: { nodes: Node[]; edges: Edge[] }): Diagram {
  return {
    nodes: new Map(data.nodes.map((node) => [node.id, node])),
    edges: new Map(data.edges.map((edge) => [edge.id, edge])),
  };
}

/**
 * Save diagram to localStorage
 */
export function saveDiagram(diagram: Diagram): void {
  try {
    const serialized = serializeDiagram(diagram);
    const json = JSON.stringify(serialized);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save diagram:', error);
    throw new Error('Failed to save diagram to local storage');
  }
}

/**
 * Load diagram from localStorage
 */
export function loadDiagram(): Diagram | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;

    const data = JSON.parse(json);
    return deserializeDiagram(data);
  } catch (error) {
    console.error('Failed to load diagram:', error);
    return null;
  }
}

/**
 * Clear diagram from localStorage
 */
export function clearDiagram(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear diagram:', error);
  }
}

/**
 * Export diagram as JSON file
 */
export function exportDiagram(diagram: Diagram, filename = 'diagram.json'): void {
  try {
    const serialized = serializeDiagram(diagram);
    const json = JSON.stringify(serialized, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export diagram:', error);
    throw new Error('Failed to export diagram');
  }
}

/**
 * Import diagram from JSON file
 */
export function importDiagram(file: File): Promise<Diagram> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);
        const diagram = deserializeDiagram(data);
        resolve(diagram);
      } catch (error) {
        console.error('Failed to import diagram:', error);
        reject(new Error('Failed to parse diagram file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Auto-save diagram to localStorage with debouncing
 */
export function createAutoSave(
  getDiagram: () => Diagram,
  delay = 1000
): { save: () => void; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const save = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const diagram = getDiagram();
      saveDiagram(diagram);
      timeoutId = null;
    }, delay);
  };

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { save, cancel };
}
