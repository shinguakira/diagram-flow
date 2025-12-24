import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { DiagramCanvas } from '@/features/diagram/DiagramCanvas'
import { Toolbar } from '@/features/diagram/Toolbar'
import { NodeDialog } from '@/features/diagram/NodeDialog'
import { useDiagramStore } from '@/store/diagramStore'
import { saveDiagram, loadDiagram } from '@/lib/storage'

export const Route = createLazyFileRoute('/editor')({
  component: Editor,
})

function Editor() {
  const { present, setDiagram } = useDiagramStore()
  const [dialogOpen, setDialogOpen] = useState(false)

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
    alert('Diagram saved to local storage!')
  }

  const handleLoad = () => {
    const saved = loadDiagram()
    if (saved) {
      setDiagram(saved)
      alert('Diagram loaded from local storage!')
    } else {
      alert('No saved diagram found')
    }
  }

  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar onSave={handleSave} onLoad={handleLoad} />
      <div className="flex-1 overflow-hidden">
        <DiagramCanvas />
      </div>
      <NodeDialog
        nodeId={null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

