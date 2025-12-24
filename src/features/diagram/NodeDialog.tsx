/**
 * NodeDialog - Dialog for editing node properties
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDiagramStore } from '@/store/diagramStore';
import type { NodeType } from '@/domain/diagramTypes';

interface NodeDialogProps {
  nodeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NodeDialog({ nodeId, open, onOpenChange }: NodeDialogProps) {
  const { present, updateNode, removeNode } = useDiagramStore();
  const node = nodeId ? present.nodes.get(nodeId) : null;

  // Use node values directly if available, otherwise use defaults
  const initialLabel = node?.label || '';
  const initialType = node?.type || 'default';
  
  const [label, setLabel] = useState(initialLabel);
  const [type, setType] = useState<NodeType>(initialType);

  // Reset form when dialog closes and reopens
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onOpenChange(false);
    } else if (node) {
      setLabel(node.label);
      setType(node.type);
      onOpenChange(true);
    }
  };

  const handleSave = () => {
    if (!nodeId) return;
    
    updateNode(nodeId, {
      label,
      type,
    });
    
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!nodeId) return;
    
    removeNode(nodeId);
    onOpenChange(false);
  };

  if (!node) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="label" className="text-sm font-medium">
              Label
            </label>
            <input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="Enter node label"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as NodeType)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="default">Default</option>
              <option value="input">Input</option>
              <option value="output">Output</option>
              <option value="process">Process</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Node
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
