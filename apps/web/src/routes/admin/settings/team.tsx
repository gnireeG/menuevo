import { activeMemberRoleOptions, invitationsOptions, teamMembersOptions, useAuth, useCancelInvitation, useInviteTeamMember, useRemoveTeamMember, useResendInvitation } from '#/auth/query'
import type { Invitation, TeamMember } from '#/auth/query'
import Breadcrumbs from '#/components/admin/Breadcrumbs'
import PersonRow from '#/components/admin/team/PersonRow'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { ConfirmButton } from '#/components/ui/confirm-button'
import { useAppForm } from '#/hooks/use-form'
import { formatDate } from '#/lib/utils'
import { m } from '#/paraglide/messages'
import { PaperPlaneTiltIcon, TrashIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'

export const Route = createFileRoute('/admin/settings/team')({
  component: RouteComponent,
})

/** True for members who may manage the team. */
function useCanManageTeam() {
  const { data: role } = useQuery(activeMemberRoleOptions())
  return role?.data?.role === 'admin' || role?.data?.role === 'owner'
}

function RouteComponent() {

  const canManage = useCanManageTeam()
  const { data: members } = useQuery(teamMembersOptions())
  const { data: invitations } = useQuery(invitationsOptions())

  // list-invitations returns every status, so accepted, rejected and revoked
  // rows have to be filtered out here — as do the ones that timed out.
  const pendingInvitations = invitations?.filter(
    (invitation) => invitation.status === 'pending' && new Date(invitation.expiresAt) > new Date()
  )

  const { mutateAsync } = useInviteTeamMember()

  const inviteForm = useAppForm({
    defaultValues: {
      email: ''
    },
    onSubmit: async({value, formApi}) => {
      // The mutation rejects when the invite fails and the form would swallow
      // that silently - the toast is the only feedback this form gives.
      try {
        await mutateAsync(value.email)
        toast.success(m['admin.team.invite_sent']({ email: value.email }))
        formApi.reset()
      } catch {
        toast.error(m['admin.team.invite_send_failed']({ email: value.email }))
      }
    },
    validators: {
      onSubmit: z.object({
        email: z.email()
      })
    }
  })

  return(
    <div>
      <Breadcrumbs items={[{label: m['admin.nav.settings'](), to: '/admin/settings'},{label: m['admin.nav.team']()}]} />
      {/* Only admins and owners may invite - the endpoint rejects everyone else,
          so the form is hidden instead of failing on submit. */}
      {canManage && (
        <div className="max-w-lg">
          <h2 className="heading-3">{m['admin.team.invite_member']()}</h2>
          <p>{m['admin.team.invite_member_description']()}</p>
          <div className="mt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              inviteForm.handleSubmit();
            }}>
              <div className="flex gap-2">
                <div className="grow">
                  <inviteForm.AppField name="email">
                    {(field) => <field.TextField type="email" placeholder={m['form_labels.email']()} /> }
                  </inviteForm.AppField>

                </div>
                <inviteForm.AppForm>
                  <inviteForm.SubmitButton>{m['admin.team.send_invite']()}<PaperPlaneTiltIcon /></inviteForm.SubmitButton>
                </inviteForm.AppForm>
              </div>
            </form>
          </div>
        </div>
      )}
      <Card className="mt-4">
        <CardContent>
          <h2 className="heading-3">{m['admin.team.active_members']()}</h2>
          <div>
            {members?.members.map(member =>
              <TeamMember key={member.id} member={member} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardContent>
          <h2 className="heading-3">{m['admin.team.pending_invitations']()}</h2>
          <div>
            {pendingInvitations?.length
              ? pendingInvitations.map(invitation =>
                  <PendingInvitation key={invitation.id} invitation={invitation} />
                )
              : <p className="text-muted-foreground py-2">{m['admin.team.no_pending_invitations']()}</p>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TeamMember({member} : {member: TeamMember}){

  const canManage = useCanManageTeam()
  const { data: session } = useAuth()
  const remove = useRemoveTeamMember()

  // A name is not guaranteed on the user, so the email carries the copy when
  // there is none - "Remove  from the team?" would be the alternative.
  const label = member.user.name || member.user.email

  // The endpoint would let an admin remove their own membership, dropping them
  // out of the organization with no way back in. Leaving is a separate action.
  const isSelf = session?.user.id === member.userId

  return(
    <PersonRow
      seed={member.user.name}
      title={member.user.name}
      subtitle={member.user.email}
      badge={<Badge variant={member.role === 'member' ? 'outline' : 'default'}>{member.role}</Badge>}
      actions={canManage && !isSelf && (
        <ConfirmButton
          disabled={member.role === 'owner'}
          variant="destructive"
          confirmType='delete'
          size="sm"
          shadow={false}
          confirmText={m['admin.team.remove_member_confirm']({ name: label })}
          loading={remove.isPending}
          onClick={() => remove.mutate(member.id, {
            onSuccess: () => toast.success(m['admin.team.member_removed']({ name: label })),
            onError: () => toast.error(m['admin.team.member_remove_failed']({ name: label }))
          })}
        >
          <TrashIcon />{m['general.remove']()}
        </ConfirmButton>
      )}
    />
  )
}

function PendingInvitation({invitation} : {invitation: Invitation}){

  const canManage = useCanManageTeam()
  const resend = useResendInvitation()
  const cancel = useCancelInvitation()

  return(
    <PersonRow
      seed={invitation.email}
      title={invitation.email}
      subtitle={m['admin.team.invitation_expires_on']({ date: formatDate(invitation.expiresAt) })}
      badge={<Badge variant="outline">{invitation.role}</Badge>}
      actions={canManage && (
        <>
          <Button
            variant="outline"
            size="sm"
            shadow={false}
            loading={resend.isPending}
            onClick={() => resend.mutate(invitation, {
              onSuccess: () => toast.success(m['admin.team.invite_resent']({ email: invitation.email })),
              onError: () => toast.error(m['admin.team.invite_resend_failed']({ email: invitation.email }))
            })}
          >
            <PaperPlaneTiltIcon />{m['admin.team.resend_invite']()}
          </Button>
          <ConfirmButton
            variant="destructive"
            confirmType='delete'
            size="sm"
            shadow={false}
            confirmText={m['admin.team.revoke_invite_confirm']({ email: invitation.email })}
            loading={cancel.isPending}
            onClick={() => cancel.mutate(invitation.id, {
              onSuccess: () => toast.success(m['admin.team.invite_revoked']({ email: invitation.email })),
              onError: () => toast.error(m['admin.team.invite_revoke_failed']({ email: invitation.email }))
            })}
          >
            <TrashIcon />{m['admin.team.revoke_invite']()}
          </ConfirmButton>
        </>
      )}
    />
  )
}
