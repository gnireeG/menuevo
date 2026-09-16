import { authClient } from "#/auth/auth-client"
import CreateRestaurantModal from "#/components/restaurant/CreateRestaurantModal"
import { Button } from "#/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "#/components/ui/dropdown-menu"
import { BuildingsIcon, CaretUpDownIcon } from "@phosphor-icons/react"
import { useState } from "react"

export default function OrganizationSelector(){

    const { data: organizations, isPending: listPending } = authClient.useListOrganizations()
    const { data: activeOrganization, isPending: activePending } = authClient.useActiveOrganization()

    const [open, setOpen] = useState(false)

    const handleSetOrg = async (id: string) => {
        await authClient.organization.setActive({
            organizationId: id
        })
        setOpen(false)
    }

    if(listPending || activePending) return null

    if(!organizations || organizations.length === 0) return <CreateRestaurantModal />

    if(organizations.length === 1 && !activeOrganization){
        authClient.organization.setActive({
            organizationId: organizations[0].id
        })
    }

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
                {organizations?.map(org => (
                    <Button variant="ghost" shadow={false} key={org.id} onClick={() => handleSetOrg(org.id)}>{org.name}</Button>
                ))}
                <CreateRestaurantModal />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}