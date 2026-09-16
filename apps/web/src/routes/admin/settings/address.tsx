import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/address')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/settings/address"!</div>
}
