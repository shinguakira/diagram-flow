/**
 * Toolbar - Main toolbar with diagram operations
 */

import { Undo2, Redo2, Trash2, Plus, Save, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useDiagramStore } from '@/store/diagramStore';
import { generateId } from '@/domain/diagramTypes';
import type { Node as DiagramNode } from '@/domain/diagramTypes';

interface ToolbarProps {
  onSave?: () => void;
  onLoad?: () => void;
  onAddNode?: () => void;
  onClear?: () => void;
  onConfirmClear?: () => void;
}

export function Toolbar({ onSave, onLoad, onAddNode, onClear }: ToolbarProps) {
  const { undo, redo, canUndo, canRedo, addNode } = useDiagramStore();

  const handleAddNode = () => {
    if (onAddNode) {
      onAddNode();
    } else {
      // Add a node at the center of the viewport
      const newNode: DiagramNode = {
        id: generateId('node'),
        type: 'default',
        label: 'New Node',
        position: { x: 400, y: 300 },
        width: 150,
        height: 80,
      };
      addNode(newNode);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 px-4 py-2 bg-background border-b">
        {/* File operations */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              disabled={!onSave}
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save diagram</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLoad}
              disabled={!onLoad}
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Load diagram</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Edit operations */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => undo()}
              disabled={!canUndo()}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => redo()}
              disabled={!canRedo()}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Node operations */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddNode}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add node</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear diagram</TooltipContent>
        </Tooltip>

        <div className="flex-1" />

        {/* Status info */}
        <div className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">Diagram Flow Editor</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
