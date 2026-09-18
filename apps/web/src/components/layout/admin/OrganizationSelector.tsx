import { authClient } from "#/auth/auth-client"
import { authQueryKey, useAuth } from "#/auth/query"
import CreateRestaurantModal from "#/components/admin/restaurant/CreateRestaurantModal"
import { Button } from "#/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "#/components/ui/dropdown-menu"
import { BuildingsIcon, CaretUpDownIcon } from "@phosphor-icons/react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export default function OrganizationSelector(){

    const { data: organizations, isPending: listPending } = authClient.useListOrganizations()
    const { data: session } = useAuth()

    const queryClient = useQueryClient()
    const router = useRouter()

    const [open, setOpen] = useState(false)

    const activeOrganization = organizations?.find(org => org.id === session?.session.activeOrganizationId)

    const handleSetOrg = async (id: string) => {
        await authClient.organization.setActive({
            organizationId: id
        })
        await queryClient.invalidateQueries({ queryKey: authQueryKey })
        await router.invalidate()
        setOpen(false)
    }

    useEffect(() => {
        if(organizations?.length === 1 && !activeOrganization){
            handleSetOrg(organizations[0].id)
        }
    }, [organizations, activeOrganization])

    if(listPending) return null

    if(!organizations || organizations.length === 0) return <CreateRestaurantModal />

    return(
        <DropdownMenu open={open} onOpenChange={(e) => setOpen(e)}>
            <DropdownMenuTrigger asChild>
                <Button className="w-full" variant="primary">
                    {activeOrganization && (
                        <><BuildingsIcon />{activeOrganization.name}<CaretUpDownIcon /></>
                    )}
                    {!activeOrganization && (
                        <>
                            <span>Choose Restaurant</span>
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-4 flex flex-col gap-2 mt-2">
                <div className=" max-h-48 overflow-y-auto flex flex-col gap-2">
                    {organizations?.map(org => (
                        <Button variant="ghost" shadow={false} key={org.id} onClick={() => handleSetOrg(org.id)}>{org.name}</Button>
                    ))}
                </div>
                <CreateRestaurantModal />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
