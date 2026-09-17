import OrganizationSelector from "./OrganizationSelector";
import UserMenu from "#/components/layout/Usermenu";
import NavigationGroup from "./NavigationGroup";
import { m } from "#/paraglide/messages";
import NavigationItem from "./NavigationItem";
import { CreditCardIcon, GearIcon, MapPinAreaIcon, TranslateIcon, UsersIcon, WifiHighIcon } from "@phosphor-icons/react";

export default function Navbar(){
    return(
        <nav className="bg-sidebar-accent p-4 flex flex-col justify-between w-64 shadow-dark rounded-r-md border border-border shrink-0">
            <div className="flex flex-col gap-4 items-start">
                <img src="/logo-menuevo.svg" className="h-6" />
                <OrganizationSelector />
                <NavigationGroup label={m['admin.nav.settings']()}>
                    <NavigationItem to="/admin/settings" label={m['admin.nav.general']()} icon={<GearIcon />} />
                    <NavigationItem to="/admin/settings/address" label={m['admin.nav.address']()} icon={<MapPinAreaIcon />} />
                    <NavigationItem to="/admin/settings/language-currency" label={m['admin.nav.language_currency']()} icon={<TranslateIcon />} />
                    <NavigationItem to="/admin/settings/wifi" label={m['admin.nav.wifi']()} icon={<WifiHighIcon />} />
                    <NavigationItem to="/admin/settings/team" label={m['admin.nav.team']()} icon={<UsersIcon />} />
                    <NavigationItem to="/admin/settings/subscription" label={m['admin.nav.subscription']()} icon={<CreditCardIcon />} />
                </NavigationGroup>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <UserMenu />
            </div>
        </nav>
    )
}