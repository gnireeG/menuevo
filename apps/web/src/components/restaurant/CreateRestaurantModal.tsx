import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Flyout, FlyoutContent, FlyoutHeader, FlyoutTrigger } from "../ui/flyout";
import { m } from "#/paraglide/messages";
import { useAppForm } from "#/hooks/use-form";
import { useRestaurantsControllerCreate } from "shared-types";
import { useState } from "react";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "#/auth/auth-client";
import { authQueryKey } from "#/auth/query";

export default function CreateRestaurantModal(){

    const [open, setOpen] = useState(false)

    const {mutateAsync} = useRestaurantsControllerCreate()

    const queryClient = useQueryClient()
    const router = useRouter()

    const form = useAppForm({
        defaultValues: {
            name: '',
        },
        onSubmit: async ({value}) => {
            await mutateAsync({data: value})
            authClient.$store.notify("$listOrg")
            await queryClient.invalidateQueries({ queryKey: authQueryKey })
            await router.invalidate()
            form.reset();
            setOpen(false);
        },
        validators: {
            onSubmit: z.object({
                name: z.string().min(3)
            })
        }
    })

    return(
        <Flyout open={open} onOpenChange={(e) => setOpen(e)}>
            <FlyoutTrigger asChild>
                <Button className="w-full"><PlusIcon />{m['admin.restaurant.new_restaurant']()}</Button>
            </FlyoutTrigger>
            <FlyoutContent>
                <FlyoutHeader>
                    <h2 className="heading-2">{m['admin.restaurant.new_restaurant']()}</h2>
                </FlyoutHeader>
                <div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}>
                        <form.AppField name="name">
                            {(field) => <field.TextField label={m['form_labels.name']()} />}
                        </form.AppField>
                        <div className="mt-4 flex justify-end">
                            <form.AppForm>
                                <form.SubmitButton>{m['general.create']()}</form.SubmitButton>
                            </form.AppForm>
                        </div>
                    </form>
                </div>
            </FlyoutContent>
        </Flyout>
    )
}