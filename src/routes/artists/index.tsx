import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/artists/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/artists/"!</div>
}
