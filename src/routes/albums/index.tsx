import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/albums/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/albums/"!</div>
}
