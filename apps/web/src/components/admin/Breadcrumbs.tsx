import { authClient } from "#/auth/auth-client"
import { CaretRightIcon, HouseIcon } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import { Link, type LinkProps } from "@tanstack/react-router"
import { cn } from "cn"
import { Fragment } from "react/jsx-runtime"

type BreadcrumbsProps = {
    items: {
        to?: LinkProps['to'],
        label: string,
    }[],
    className?: string
}

export default function Breadcrumbs({items, className} : BreadcrumbsProps){

    const { data } = authClient.useActiveOrganization()

    return(
        <div className={cn('flex gap-0.5 items-center mb-4', className)}>
            <Link to="/admin"><Button variant="ghost" size="sm"><HouseIcon />{data?.name}</Button></Link>
            {items.map(item =>
                <Fragment key={item.label}>
                <CaretRightIcon size={12} />
                    {item.to && (
                        <Link to={item.to}><Button variant="ghost" size="sm">{item.label}</Button></Link>
                    )}
                    {!item.to && (
                        <Button disabled={true} variant="ghost" size="sm">{item.label}</Button>
                    )}
                </Fragment>
            )}
        </div>
    )
}