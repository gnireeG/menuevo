import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/language-currency')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/settings/language-currency"!</div>
}
