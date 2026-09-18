import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div className="max-w-4xl">
      <Outlet />
    </div>
  )
}
