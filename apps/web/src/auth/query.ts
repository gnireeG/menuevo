import { queryOptions, useQuery } from "@tanstack/react-query";
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