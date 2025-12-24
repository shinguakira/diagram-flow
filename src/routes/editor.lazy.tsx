import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/editor')({
  component: Editor,
})

function Editor() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 bg-muted/20">
        {/* DiagramCanvas will go here */}
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Editor canvas (to be implemented)</p>
        </div>
      </div>
    </div>
  )
}
