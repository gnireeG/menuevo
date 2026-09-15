import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "./auth-client";

export const authQueryKey = ['auth']

export const authQueryOptions = () => {
    return queryOptions({
        queryKey: authQueryKey,
        queryFn: async () => {
            const { data: session } = await authClient.getSession({
                fetchOptions: {
                    headers: typeof window === 'undefined' ? getRequestHeaders() : undefined,
                },
            })
            return session
        },
        staleTime: 1000 * 60 * 5
    })
}

export const useAuth = () => useQuery(authQueryOptions())