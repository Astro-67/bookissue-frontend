import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/profile"!</div>
}
