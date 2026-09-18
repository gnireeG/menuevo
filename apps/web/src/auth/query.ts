import { queryOptions, useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { authClient } from "./auth-client";

export const authQueryKey = ['auth']

const getAuthHeaders = createIsomorphicFn()
    .client(() => undefined)
    .server(async () => {
        const { getRequestHeaders } = await import("@tanstack/react-start/server");
        return getRequestHeaders();
    })

export const authQueryOptions = () => {
    return queryOptions({
        queryKey: authQueryKey,
        queryFn: async () => {
            const { data: session } = await authClient.getSession({
                fetchOptions: {
                    headers: await getAuthHeaders(),
                },
            })
            return session
        },
        staleTime: 1000 * 60 * 5
    })
}

export const useAuth = () => useQuery(authQueryOptions())

/**
 * Pulls the session from the server again and waits for the answer.
 *
 * `invalidateQueries` only refetches queries that currently have an observer.
 * Outside of /admin nothing renders `useAuth`, so on the auth pages the session
 * is an inactive query: invalidating it there marks it stale and nothing more,
 * and whoever reads it next decides when - or whether - it is refetched. Every
 * point where the signed-in identity changes (login, verification, accepting an
 * invitation) has to see the new session immediately, so it is forced here.
 */
export const refreshSession = (queryClient: QueryClient) =>
    queryClient.refetchQueries({ queryKey: authQueryKey })

/**
 * Drops the session after signing out. The server has already ended it, so
 * there is nothing to fetch - writing `null` keeps the next route guard from
 * asking for a session that cannot exist any more.
 */
export const clearSession = (queryClient: QueryClient) => {
    queryClient.setQueryData(authQueryKey, null)
}


// Organization / team management

export const teamMembersQueryKey = ['teammembers']

export type TeamMember = typeof authClient.$Infer.Member

export const teamMembersOptions = () => {
    return queryOptions({
        queryKey: teamMembersQueryKey,
        queryFn: async () => {
            const { data: members } = await authClient.organization.listMembers({
                fetchOptions: {
                    headers: await getAuthHeaders()
                }
            })
            return members
        },
        staleTime: 1000 * 60 * 5
    })
}

export const useInviteTeamMember = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (email: string) => {
            const { error } = await authClient.organization.inviteMember({
                email: email,
                role: 'member'
            })
            if (error) throw new Error(error.message ?? 'Could not send the invitation')
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationsQueryKey })
    })
}

export const invitationsQueryKey = ['invitations']

export const invitationsOptions = () => {
    return queryOptions({
        queryKey: invitationsQueryKey,
        queryFn: async () => {
            const { data: invitations } = await authClient.organization.listInvitations({
                fetchOptions: {
                    headers: await getAuthHeaders()
                }
            })
            return invitations
        },
        staleTime: 1000 * 60 * 5
    })
}

export type Invitation = typeof authClient.$Infer.Invitation

/**
 * Re-sends the invitation mail for an address that already has a pending
 * invitation. Better Auth keeps the same row and only pushes `expiresAt`
 * forward, so the displayed expiry date is what visibly moves.
 */
export const useResendInvitation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (invitation: Invitation) => {
            const { error } = await authClient.organization.inviteMember({
                email: invitation.email,
                role: invitation.role,
                resend: true
            })
            if (error) throw new Error(error.message ?? 'Could not resend the invitation')
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationsQueryKey })
    })
}

export const useCancelInvitation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (invitationId: string) => {
            const { error } = await authClient.organization.cancelInvitation({ invitationId })
            if (error) throw new Error(error.message ?? 'Could not revoke the invitation')
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationsQueryKey })
    })
}

// Accepting an invitation

/**
 * What `GET /organization/get-invitation` answers with. `inviterName` is not
 * part of Better Auth's payload - the API merges it in through an after hook,
 * so it stays optional here.
 */
export type InvitationDetails = {
    id: string
    email: string
    role: string
    status: string
    expiresAt: string | Date
    organizationId: string
    organizationName: string
    organizationSlug: string
    inviterId: string
    inviterEmail: string
    inviterName?: string | null
}

/** Error codes `get-invitation` can answer with, mapped to what the page shows. */
export type InvitationError = { code: 'wrong_recipient' | 'unavailable'; message?: string }

export const invitationQueryKey = (invitationId: string) => ['invitation', invitationId]

/**
 * Loads a single invitation. The endpoint requires a session and only answers
 * for the address the invitation was sent to, so the errors carry real meaning
 * for the UI - they are mapped instead of swallowed.
 */
export const invitationOptions = (invitationId: string) => {
    return queryOptions<InvitationDetails, InvitationError>({
        queryKey: invitationQueryKey(invitationId),
        queryFn: async () => {
            const { data, error } = await authClient.organization.getInvitation({
                query: { id: invitationId },
                fetchOptions: {
                    headers: await getAuthHeaders()
                }
            })

            if (error || !data) {
                throw {
                    // Anything else - expired, revoked, already accepted, unknown id -
                    // is deliberately shown as one state, so probing an id tells an
                    // attacker nothing beyond "not usable".
                    code: error?.status === 403 ? 'wrong_recipient' : 'unavailable',
                    message: error?.message
                } satisfies InvitationError
            }

            return data as unknown as InvitationDetails
        },
        // An invitation can be accepted or revoked elsewhere - never serve it from
        // cache, and never retry the deliberate 400/403 answers.
        staleTime: 0,
        retry: false
    })
}

/**
 * Accepting creates the membership and makes the organization active on the
 * server session, so the cached session has to go along with the team lists.
 */
export const useAcceptInvitation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (invitationId: string) => {
            const { data, error } = await authClient.organization.acceptInvitation({ invitationId })
            if (error) throw new Error(error.message ?? 'The invitation could not be accepted')
            return data
        },
        onSuccess: async () => {
            // The membership and the active organization both live on the server
            // session, so it has to be refetched - not just marked stale - before
            // the admin area is entered.
            await refreshSession(queryClient)
            await queryClient.invalidateQueries({ queryKey: teamMembersQueryKey })
            await queryClient.invalidateQueries({ queryKey: invitationsQueryKey })
        }
    })
}

export const useRejectInvitation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (invitationId: string) => {
            const { error } = await authClient.organization.rejectInvitation({ invitationId })
            if (error) throw new Error(error.message ?? 'The invitation could not be rejected')
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationsQueryKey })
    })
}

export const activeMemberRoleQueryKey = ['active_member_role']
export const activeMemberRoleOptions = () =>{
    return queryOptions({
        queryKey: activeMemberRoleQueryKey,
        queryFn: async() => {
            const data = await authClient.organization.getActiveMemberRole({
                fetchOptions: {
                    headers: await getAuthHeaders()
                }
            })
            return data
        }
    })
}