import OrganizationSelector from "./OrganizationSelector";
import UserMenu from "./Usermenu";

export default function Navbar(){
    return(
        <nav className="bg-foreground text-accent p-4 flex flex-col justify-between min-w-48">
            <div>
                <img src="/logo-menuevo-dark.svg" className="h-6" />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <OrganizationSelector />
                <UserMenu />
            </div>
        </nav>
    )
}