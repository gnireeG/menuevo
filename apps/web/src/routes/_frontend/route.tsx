import Navbar from '#/components/layout/frontend/Navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_frontend')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div className="bg-background">
      <Navbar />
      <Outlet />
    </div>
  )
}
