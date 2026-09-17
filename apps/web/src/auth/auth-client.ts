import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { emailOTPClient } from "better-auth/client/plugins"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: 'http://localhost:3001',
    plugins: [
        organizationClient(),
        emailOTPClient(),
        adminClient() 
    ]
})

export const useSession = authClient.useSession