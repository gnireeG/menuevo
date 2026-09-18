import Breadcrumbs from '#/components/admin/Breadcrumbs'
import { m } from '#/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/language-currency')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div>
      <Breadcrumbs items={[{label: m['admin.nav.settings'](), to: '/admin/settings'},{label: m['admin.nav.language_currency']()}]} />
    </div>
  )
}
