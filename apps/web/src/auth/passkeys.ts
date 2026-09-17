import { queryOptions } from "@tanstack/react-query"
import { authClient } from "./auth-client"

type ListPasskeysResult = Awaited<ReturnType<typeof authClient.passkey.listUserPasskeys>>
export type Passkey = NonNullable<ListPasskeysResult['data']>[number]

export const passkeysQueryKey = ['passkeys']
export const aaguidQueryKey = ['aaguid']

/**
 * One entry of the community maintained AAGUID lookup table.
 * Source: https://github.com/passkeydeveloper/passkey-authenticator-aaguids
 * The file is vendored into `public/aaguid.json` so we don't depend on GitHub at runtime.
 */
export type AaguidEntry = {
    name: string
    icon_dark?: string
    icon_light?: string
}

export type AaguidMap = Record<string, AaguidEntry>

/** Privacy preserving authenticators (e.g. Apple with attestation "none") report an all-zero AAGUID. */
export const EMPTY_AAGUID = '00000000-0000-0000-0000-000000000000'

export const passkeysQueryOptions = () =>
    queryOptions({
        queryKey: passkeysQueryKey,
        queryFn: async () => {
            const { data, error } = await authClient.passkey.listUserPasskeys()
            if (error) throw new Error(error.message ?? 'Could not load passkeys')
            return data ?? []
        },
    })

export const aaguidQueryOptions = () =>
    queryOptions({
        queryKey: aaguidQueryKey,
        queryFn: async (): Promise<AaguidMap> => {
            const response = await fetch('/aaguid.json')
            if (!response.ok) throw new Error('Could not load authenticator metadata')
            return response.json() as Promise<AaguidMap>
        },
        // Static asset – no need to ever refetch it during a session.
        staleTime: Infinity,
        gcTime: Infinity,
    })

export const resolveAaguid = (
    aaguids: AaguidMap | undefined,
    aaguid: string | undefined | null,
): AaguidEntry | undefined => {
    if (!aaguid || aaguid === EMPTY_AAGUID) return undefined
    return aaguids?.[aaguid.toLowerCase()]
}

/**
 * WebAuthn Signal API – lets the relying party tell the credential provider
 * (Google Password Manager, iCloud Keychain, …) that a credential is gone.
 *
 * Without this a deleted passkey stays visible in the provider's UI and keeps
 * being offered at sign-in, where it then fails because we no longer know it.
 *
 * Only Chromium 132+ implements this today; everywhere else it is a no-op.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/signalUnknownCredential_static
 */
type CredentialSignals = {
    signalUnknownCredential?: (options: { rpId: string; credentialId: string }) => Promise<void>
}

/**
 * Ask the credential provider to forget `credentialId`.
 *
 * Best effort: failures are swallowed, because the passkey is already gone on
 * our side and there is nothing the user could do about it.
 */
export const signalUnknownCredential = async (credentialId: string) => {
    if (typeof window === 'undefined') return

    const signals = window.PublicKeyCredential as unknown as CredentialSignals | undefined
    if (!signals?.signalUnknownCredential) return

    try {
        // The rpID defaults to the hostname the passkey was registered on.
        await signals.signalUnknownCredential({ rpId: window.location.hostname, credentialId })
    } catch {
        // Provider refused or does not know the credential – nothing to do.
    }
}
