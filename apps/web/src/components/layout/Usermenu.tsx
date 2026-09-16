import { Link, useRouteContext, useRouter } from "@tanstack/react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { Button } from "#/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "#/auth/auth-client";
import { CaretUpDownIcon, GearSixIcon, SignOutIcon } from "@phosphor-icons/react";
import { Separator } from "#/components/ui/separator";
import { authQueryKey } from "#/auth/query";
import { m } from "#/paraglide/messages";

export default function UserMenu(){
    const { user } = useRouteContext({from: '__root__'})

    const queryClient = useQueryClient()
    const router = useRouter()

    const [logoutLoading, setLogoutLoading] = useState(false)

    async function handleLogout() {
        setLogoutLoading(true)
        await queryClient.setQueryData(authQueryKey, null)
        await authClient.signOut();
        router.navigate({ to: "/" });
    }

    if(!user){
        return(
            <Link to="/login"><Button variant="primary">{m['auth.login_submit']()}</Button></Link>
        )
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full" asChild>
                <Button size="lg" className="w-full">{user.name}<CaretUpDownIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-4 my-2 min-w-min" align="end">
                <div>
                    <p className="font-heading">{user.name}</p>
                    <p className="text-xs">{user.email}</p>
                </div>
                <Separator />
                <DropdownMenuGroup className="space-y-2">
                    <Link to="/admin"><Button variant="ghost" className="w-full">Restaurants verwalten</Button></Link>
                    <Button variant="ghost" className="w-full"><GearSixIcon />Settings</Button>
                    <Button variant="destructive" className="w-full" onClick={handleLogout} loading={logoutLoading}><SignOutIcon />Sign out</Button>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}