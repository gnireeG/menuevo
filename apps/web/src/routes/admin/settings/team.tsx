import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/team')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/settings/team"!</div>
}
