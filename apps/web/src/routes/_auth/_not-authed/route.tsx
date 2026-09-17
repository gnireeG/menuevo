import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_not-authed')({
  beforeLoad: async ({context}) => {
    if(context.session){
      // Mirrors the guard in /admin so an unverified session lands on the OTP
      // form directly instead of bouncing through /admin first.
      if(!context.session.user.emailVerified){
        throw redirect({to: '/verify-email', search: { email: context.session.user.email }})
      }
      throw redirect({to: '/admin'})
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
