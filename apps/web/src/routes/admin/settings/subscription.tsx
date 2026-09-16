import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/subscription')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/settings/subscription"!</div>
}
