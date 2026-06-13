import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/artists/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/artists/$name"!</div>
}
