import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '#/auth/auth-client'
import {
  clearSession,
  invitationOptions,
  invitationQueryKey,
  useAcceptInvitation,
  useRejectInvitation,
} from '#/auth/query'
import PersonRow from '#/components/admin/team/PersonRow'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ConfirmButton } from '#/components/ui/confirm-button'
import { formatDate } from '#/lib/utils'
import { m } from '#/paraglide/messages'

const acceptInvitationSearchSchema = z.object({
  id: z.string().min(1),
})

export const Route = createFileRoute('/_auth/accept-invitation')({
  validateSearch: acceptInvitationSearchSchema,
  beforeLoad: ({ context, search }) => {
    // `get-invitation` needs a session and only answers for the invited
    // address, so an anonymous visitor has to sign in first. The invitation id
    // travels along and brings them straight back here afterwards.
    if (!context.session) {
      throw redirect({ to: '/login', search: { invitation: search.id } })
    }
    if (!context.session.user.emailVerified) {
      throw redirect({
        to: '/verify-email',
        search: { email: context.session.user.email, invitation: search.id },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch()
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: invitation, isPending, error } = useQuery(invitationOptions(id))

  const accept = useAcceptInvitation()
  const reject = useRejectInvitation()
  const [rejected, setRejected] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const handleAccept = async () => {
    setActionError(null)
    try {
      await accept.mutateAsync(id)
      // Accepting makes the organization active on the server session, so the
      // router context has to be rebuilt before entering the admin area.
      await router.invalidate()
      navigate({ to: '/admin' })
    } catch (e) {
      setActionError(e instanceof Error ? e.message : m['auth.accept_invitation.error_generic']())
    }
  }

  const handleReject = async () => {
    setActionError(null)
    try {
      await reject.mutateAsync(id)
      setRejected(true)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : m['auth.accept_invitation.error_generic']())
    }
  }

  const handleSwitchAccount = async () => {
    await authClient.signOut()
    clearSession(queryClient)
    // The invitation belongs to the old session - drop it too, so the next
    // account does not get the previous answer served from the cache.
    queryClient.removeQueries({ queryKey: invitationQueryKey(id) })
    await router.invalidate()
    navigate({ to: '/login', search: { invitation: id } })
  }

  if (rejected) {
    return (
      <Message
        title={m['auth.accept_invitation.rejected_title']()}
        description={m['auth.accept_invitation.rejected_description']()}
      >
        <Button onClick={() => navigate({ to: '/admin' })}>
          {m['auth.accept_invitation.back_to_admin']()}
        </Button>
      </Message>
    )
  }

  if (isPending) {
    return <p className="py-8 text-muted-foreground">{m['auth.accept_invitation.loading']()}</p>
  }

  if (error?.code === 'wrong_recipient') {
    return (
      <Message
        title={m['auth.accept_invitation.wrong_recipient_title']()}
        description={m['auth.accept_invitation.wrong_recipient_description']({
          email: session?.user.email ?? '',
        })}
      >
        <Button onClick={handleSwitchAccount}>
          {m['auth.accept_invitation.switch_account']()}
        </Button>
      </Message>
    )
  }

  if (error || !invitation) {
    return (
      <Message
        title={m['auth.accept_invitation.unavailable_title']()}
        description={m['auth.accept_invitation.unavailable_description']()}
      >
        <Button onClick={() => navigate({ to: '/admin' })}>
          {m['auth.accept_invitation.back_to_admin']()}
        </Button>
      </Message>
    )
  }

  const inviter = invitation.inviterName || invitation.inviterEmail
  const pending = accept.isPending || reject.isPending

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading-1">{m['auth.accept_invitation.title']()}</h1>
        <p>
          {m['auth.accept_invitation.description']({
            inviter,
            restaurant: invitation.organizationName,
          })}
        </p>
      </div>

      <PersonRow
        seed={invitation.organizationName}
        title={invitation.organizationName}
        subtitle={m['auth.accept_invitation.invited_by']({ inviter })}
        badge={<Badge>{invitation.role}</Badge>}
      />

      <p className="text-sm text-muted-foreground">
        {m['auth.accept_invitation.invited_as']({ email: invitation.email })}
        {' · '}
        {m['auth.accept_invitation.expires']({ date: formatDate(invitation.expiresAt) })}
      </p>

      {actionError && <span className="text-sm text-destructive font-semibold">{actionError}</span>}

      <div className="flex gap-2 flex-wrap">
        <Button className="grow" onClick={handleAccept} disabled={pending}>
          {m['auth.accept_invitation.accept']()}
        </Button>
        <ConfirmButton
          variant="ghost"
          disabled={pending}
          confirmText={m['auth.accept_invitation.reject_confirm']({
            restaurant: invitation.organizationName,
          })}
          onClick={handleReject}
        >
          {m['auth.accept_invitation.reject']()}
        </ConfirmButton>
      </div>
    </div>
  )
}

/** Single-message states: nothing to act on but one way forward. */
function Message({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading-1">{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  )
}
