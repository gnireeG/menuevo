import { useState } from "react";
import { Button } from "#/components/ui/button";
import type { ButtonProps } from "#/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { m } from "#/paraglide/messages";
import { TrashIcon } from "@phosphor-icons/react";

type ConfirmType = 'default' | 'delete';

type ConfirmButtonProps = ButtonProps & {
    confirmType?: ConfirmType;
    confirmText?: string;
}

const confirmTypeConfig: Record<ConfirmType, {
    variant: ButtonProps["variant"];
    icon?: React.ReactNode;
    title: () => string;
    verb: () => string;
    text: () => string;
}> = {
    default: {
        variant: 'default',
        title: () => m['common.confirm'](),
        verb: () => m['common.confirm'](),
        text: () => m['common.confirm_text'](),
    },
    delete: {
        variant: 'destructive',
        icon: <TrashIcon />,
        title: () => m['common.confirm_title_delete'](),
        verb: () => m['common.delete'](),
        text: () => m['common.confirm_text_delete'](),
    },
}

function ConfirmButton({ onClick, confirmType = 'default', confirmText, ...props }: ConfirmButtonProps) {

    const [showConfirm, setShowConfirm] = useState(false)
    const { variant, icon, title, verb, text } = confirmTypeConfig[confirmType]

    const handleOnConfirmClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        setShowConfirm(false)
    }

    return (
        <>
            <Button {...props} onClick={() => setShowConfirm(true)} />
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title()}</DialogTitle>
                        <DialogDescription>{confirmText ?? text()}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">{m['common.cancel']()}</Button>
                        </DialogClose>
                        <Button onClick={handleOnConfirmClick} variant={variant}>
                            {icon}
                            {verb()}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export { ConfirmButton }
export type { ConfirmButtonProps }
