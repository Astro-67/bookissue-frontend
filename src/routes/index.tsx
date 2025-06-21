import { createFileRoute } from '@tanstack/react-router'
import { Navigate } from '@tanstack/react-router'



export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Navigate to="/login" />
  )
}
