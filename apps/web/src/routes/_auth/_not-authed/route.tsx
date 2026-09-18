import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { z } from 'zod'

/**
 * Read straight from the location: this layout declares no search schema of
 * its own, but its children may carry an invitation id that has to survive the
 * redirect out of here.
 */
const invitationSearchSchema = z.object({
  invitation: z.string().optional(),
})

export const Route = createFileRoute('/_auth/_not-authed')({
  beforeLoad: async ({context, location}) => {
    if(context.session){
      const { invitation } = invitationSearchSchema.catch({}).parse(location.search)

      // Mirrors the guard in /admin so an unverified session lands on the OTP
      // form directly instead of bouncing through /admin first.
      if(!context.session.user.emailVerified){
        throw redirect({to: '/verify-email', search: { email: context.session.user.email, invitation }})
      }
      if(invitation){
        throw redirect({to: '/accept-invitation', search: { id: invitation }})
      }
      throw redirect({to: '/admin'})
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
