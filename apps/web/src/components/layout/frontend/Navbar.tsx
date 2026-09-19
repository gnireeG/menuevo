import { Link } from "@tanstack/react-router";
import UserMenu from "../Usermenu";

export default function Navbar(){
    return(
        <div className="p-4 w-full">
            <div className="mx-auto max-w-7xl shadow-dark bg-sidebar rounded-md p-4 flex justify-between items-center border border-border">
                <div>
                    <Link to="/"><img src="/logo-menuevo.svg" className="h-8" /></Link>
                </div>
                <div>
                    <UserMenu trigger="avatar-only" />
                </div>
            </div>
        </div>
    )
}