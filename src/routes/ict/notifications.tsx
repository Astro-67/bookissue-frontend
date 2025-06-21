import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ict/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ict/notifications"!</div>
}
