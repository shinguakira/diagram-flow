import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Diagram Flow Editor</h1>
        <p className="text-muted-foreground mb-8">
          Welcome to the diagram flow editor
        </p>
        <a
          href="/editor"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Open Editor
        </a>
      </div>
    </div>
  )
}
