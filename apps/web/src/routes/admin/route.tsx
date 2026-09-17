import Navbar from '#/components/layout/admin/Navbar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({context}) =>{
    if(!context.session){
      throw redirect({to: '/login'})
    }
    if(!context.session.user.emailVerified){
      throw redirect({to: '/verify-email', search: { email: context.session.user.email }})
    }
    const user = context.session.user
    return { user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-dvh overflow-x-hidden">
      <Navbar />
      <main className="p-2 sm:p-4"><Outlet /></main>
    </div>
  )
}
