import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/super-admin/staff')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/super-admin/staff"!</div>
}
