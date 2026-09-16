import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/wifi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/settings/wifi"!</div>
}
