import { Button } from "#/components/ui/button";
import { Link, type LinkProps } from "@tanstack/react-router";
import type React from "react";

type NavigationItemProps = {
    to: LinkProps['to'],
    label: string,
    icon: React.ReactNode
}

export default function NavigationItem({to, label, icon} : NavigationItemProps){
    return(
        <Link to={to} activeOptions={{ exact: true }}>
            {({ isActive }) => (
                <Button size="sm" shadow={false} variant={isActive ? 'default' : 'ghost'} className="w-full justify-start">{icon}{label}</Button>
            )}
        </Link>
    )
}