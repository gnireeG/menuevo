import { authClient } from "#/auth/auth-client"
import { Button } from "#/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "#/components/ui/dropdown-menu"
import { BuildingsIcon, CaretUpDownIcon } from "@phosphor-icons/react"
import { useState } from "react"

export default function OrganizationSelector(){

    const { data: organizations } = authClient.useListOrganizations()
    const { data: activeOrganization } = authClient.useActiveOrganization()

    const [open, setOpen] = useState(false)

    const handleSetOrg = async (id: string) => {
        await authClient.organization.setActive({
            organizationId: id
        })
        setOpen(false)
    }

    if(!activeOrganization) return null

    return(
        <DropdownMenu open={open} onOpenChange={(e) => setOpen(e)}>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" shadow={false} className="w-full"><BuildingsIcon />{activeOrganization.name}<CaretUpDownIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-1.5 flex flex-col gap-2">
                {organizations?.map(org => (
                    <Button variant="ghost" shadow={false} key={org.id} onClick={() => handleSetOrg(org.id)}>{org.name}</Button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}