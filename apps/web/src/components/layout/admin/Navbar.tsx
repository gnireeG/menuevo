import OrganizationSelector from "./OrganizationSelector";
import UserMenu from "./Usermenu";

export default function Navbar(){
    return(
        <nav className="bg-sidebar-accent p-4 flex flex-col justify-between min-w-56 shadow-dark rounded-r-md border border-border">
            <div className="flex flex-col gap-4 items-start">
                <img src="/logo-menuevo.svg" className="h-6" />
                <OrganizationSelector />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <UserMenu />
            </div>
        </nav>
    )
}