import { nameToHex, nameToInitials } from "#/lib/utils";
import { useRouteContext } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserIcon } from "@phosphor-icons/react";

export default function({size = 'default'} : {size?: "default" | "sm" | "lg"}){

    const { user } = useRouteContext({from: '__root__'})

    return(
        <Avatar size={size}>
            {user && (
                <>
                    {user.image ? (
                        <AvatarImage src={user.image} />
                    ) : (
                        <AvatarFallback style={{ backgroundColor: nameToHex(user.name) }} className="text-white">
                            {nameToInitials(user.name)}
                        </AvatarFallback>
                    )}
                </>
            )}
            {!user && (
                <AvatarFallback>
                    <UserIcon />
                </AvatarFallback>
            )}
        </Avatar>
    )
}