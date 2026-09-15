import { useRouteContext, useRouter } from "@tanstack/react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { Button } from "#/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "#/auth/auth-client";
import { CaretUpDownIcon } from "@phosphor-icons/react";
import { Separator } from "#/components/ui/separator";
import { authQueryKey } from "#/auth/query";

export default function UserMenu(){
    const { user } = useRouteContext({from: '/admin'})

    const queryClient = useQueryClient()
    const router = useRouter()

    const [logoutLoading, setLogoutLoading] = useState(false)

    async function handleLogout() {
        setLogoutLoading(true)
        await queryClient.setQueryData(authQueryKey, null)
        await authClient.signOut();
        router.navigate({ to: "/" });
    }

    return(
        <>
        {user && (
            <DropdownMenu>
                <DropdownMenuTrigger className="w-full" asChild>
                    <Button className="w-full" shadow={false}>{user.name}<CaretUpDownIcon /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-4">
                    <div>
                        <p className="font-heading">{user.name}</p>
                        <p className="text-xs">{user.email}</p>
                    </div>
                    <Separator />
                    <DropdownMenuGroup className="space-y-2">
                        <Button variant="ghost" className="w-full">Settings</Button>
                        <Button variant="destructive" className="w-full" shadow={false} onClick={handleLogout} loading={logoutLoading}>Logout</Button>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )}
        </>
    )
}