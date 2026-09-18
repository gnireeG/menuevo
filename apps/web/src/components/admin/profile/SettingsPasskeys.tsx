import { authClient } from "#/auth/auth-client"
import { aaguidQueryOptions, passkeysQueryKey, passkeysQueryOptions, resolveAaguid, signalUnknownCredential, type AaguidEntry, type Passkey } from "#/auth/passkeys"
import { Button } from "#/components/ui/button"
import { Card, CardContent } from "#/components/ui/card"
import { ConfirmButton } from "#/components/ui/confirm-button"
import { formatDate } from "#/lib/utils"
import { m } from "#/paraglide/messages"
import { KeyIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function SettingsPasskeys() {
    const queryClient = useQueryClient()

    const passkeys = useQuery(passkeysQueryOptions())
    const aaguids = useQuery(aaguidQueryOptions())

    const addPasskey = useMutation({
        mutationFn: async () => {
            const result = await authClient.passkey.addPasskey()
            if (result?.error) throw new Error(result.error.message ?? 'Could not add passkey')
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: passkeysQueryKey }),
    })

    const deletePasskey = useMutation({
        mutationFn: async (passkey: Passkey) => {
            const { error } = await authClient.passkey.deletePasskey({ id: passkey.id })
            if (error) throw new Error(error.message ?? 'Could not remove passkey')

            // Deleting the row only removes our half of the passkey. Tell the
            // credential provider too, otherwise it keeps the entry and offers
            // it at sign-in as a passkey that can no longer work.
            await signalUnknownCredential(passkey.credentialID)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: passkeysQueryKey }),
    })

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-heading">{m['profile.settings.passkeys_title']()}</p>
                    <p className="text-xs text-muted-foreground">{m['profile.settings.passkeys_description']()}</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => addPasskey.mutate()}
                    loading={addPasskey.isPending}
                >
                    <PlusIcon />
                    {m['profile.settings.passkeys_add']()}
                </Button>
            </div>

            {addPasskey.error && (
                <p className="text-xs text-destructive">{addPasskey.error.message}</p>
            )}
            {deletePasskey.error && (
                <p className="text-xs text-destructive">{deletePasskey.error.message}</p>
            )}

            {passkeys.isPending && (
                <p className="text-xs text-muted-foreground">{m['profile.settings.passkeys_loading']()}</p>
            )}

            {passkeys.isError && (
                <p className="text-xs text-destructive">{m['profile.settings.passkeys_load_error']()}</p>
            )}

            {passkeys.isSuccess && passkeys.data.length === 0 && (
                <p className="text-xs text-muted-foreground">{m['profile.settings.passkeys_empty']()}</p>
            )}

            <ul className="space-y-2">
                {passkeys.data?.map((passkey) => (
                    <li key={passkey.id}>
                        <PasskeyCard
                            passkey={passkey}
                            authenticator={resolveAaguid(aaguids.data, passkey.aaguid)}
                            onDelete={() => deletePasskey.mutate(passkey)}
                            deleting={deletePasskey.isPending && deletePasskey.variables?.id === passkey.id}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

function PasskeyCard({
    passkey,
    authenticator,
    onDelete,
    deleting,
}: {
    passkey: Passkey
    authenticator: AaguidEntry | undefined
    onDelete: () => void
    deleting: boolean
}) {
    const title = passkey.name || authenticator?.name || m['profile.settings.passkeys_unknown_authenticator']()

    return (
        <Card size="sm">
            <CardContent className="flex items-center gap-3">
                <AuthenticatorIcon authenticator={authenticator} />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">
                        {authenticator && passkey.name ? `${authenticator.name} · ` : ''}
                        {passkey.deviceType === 'multiDevice'
                            ? m['profile.settings.passkeys_synced']()
                            : m['profile.settings.passkeys_device_bound']()}
                        {' · '}
                        {m['profile.settings.passkeys_added']({ date: formatDate(passkey.createdAt) })}
                    </p>
                </div>
                <ConfirmButton
                    variant="destructive"
                    size="icon-sm"
                    aria-label={m['profile.settings.passkeys_delete']()}
                    onClick={onDelete}
                    loading={deleting}
                    confirmType="delete"
                >
                    <TrashIcon />
                </ConfirmButton>
            </CardContent>
        </Card>
    )
}

function AuthenticatorIcon({ authenticator }: { authenticator: AaguidEntry | undefined }) {
    if (!authenticator?.icon_light && !authenticator?.icon_dark) {
        return (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground/10">
                <KeyIcon className="size-4" />
            </div>
        )
    }

    const light = authenticator.icon_light ?? authenticator.icon_dark
    const dark = authenticator.icon_dark ?? authenticator.icon_light

    return (
        <div className="flex size-8 shrink-0 items-center justify-center">
            <img src={light} alt="" aria-hidden className="size-8 object-contain dark:hidden" />
            <img src={dark} alt="" aria-hidden className="hidden size-8 object-contain dark:block" />
        </div>
    )
}
