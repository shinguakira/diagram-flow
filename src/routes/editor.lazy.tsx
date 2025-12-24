import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { DiagramCanvas } from '@/features/diagram/DiagramCanvas'
import { Toolbar } from '@/features/diagram/Toolbar'
import { NodeDialog } from '@/features/diagram/NodeDialog'
import { ToastContainer } from '@/components/ToastContainer'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useDiagramStore } from '@/store/diagramStore'
import { saveDiagram, loadDiagram } from '@/lib/storage'
import { useToast } from '@/hooks/useToast'

export const Route = createLazyFileRoute('/editor')({
  component: Editor,
})

function Editor() {
  const { present, setDiagram, reset } = useDiagramStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  // Load diagram from localStorage on mount
  useEffect(() => {
    const saved = loadDiagram()
    if (saved) {
      setDiagram(saved)
    }
  }, [setDiagram])

  // Auto-save to localStorage when diagram changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveDiagram(present)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [present])

  const handleSave = () => {
    saveDiagram(present)
    showToast('Diagram saved to local storage!', 'success')
  }

  const handleLoad = () => {
    const saved = loadDiagram()
    if (saved) {
      setDiagram(saved)
      showToast('Diagram loaded from local storage!', 'success')
    } else {
      showToast('No saved diagram found', 'info')
    }
  }

  const handleClear = () => {
    setConfirmClearOpen(true)
  }

  const handleConfirmClear = () => {
    reset()
    showToast('Diagram cleared', 'info')
  }

  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar onSave={handleSave} onLoad={handleLoad} onClear={handleClear} />
      <div className="flex-1 overflow-hidden">
        <DiagramCanvas />
      </div>
      <NodeDialog
        nodeId={null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="Clear Diagram"
        message="Are you sure you want to clear the diagram? This action cannot be undone."
        onConfirm={handleConfirmClear}
        confirmText="Clear"
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

