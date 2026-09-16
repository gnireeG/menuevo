import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Flyout, FlyoutContent, FlyoutHeader, FlyoutTrigger } from "../ui/flyout";

export default function CreateRestaurantModal(){
    return(
        <Flyout>
            <FlyoutTrigger asChild>
                <Button className="w-full"><PlusIcon />New restaurant</Button>
            </FlyoutTrigger>
            <FlyoutContent>
                <FlyoutHeader>
                    Hallo
                </FlyoutHeader>
            </FlyoutContent>
        </Flyout>
    )
}