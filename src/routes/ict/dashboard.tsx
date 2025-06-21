import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ict/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ict/dashboard"!</div>
}
