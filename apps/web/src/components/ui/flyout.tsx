import * as React from "react"
import { XIcon } from "@phosphor-icons/react"
import { Dialog as DialogPrimitive } from "radix-ui"
import clsx from "clsx"

import { cn } from "cn"
import { Button } from "#/components/ui/button"

type FlyoutSide = "top" | "bottom" | "left" | "right"

function Flyout({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="flyout" {...props} />
}

function FlyoutTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="flyout-trigger" {...props} />
}

function FlyoutPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="flyout-portal" {...props} />
}

function FlyoutClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="flyout-close" {...props} />
}

function FlyoutOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="flyout-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function FlyoutContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: FlyoutSide
  showCloseButton?: boolean
}) {
  return (
    <FlyoutPortal>
      <FlyoutOverlay />
      <DialogPrimitive.Content
        data-slot="flyout-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 overflow-y-auto bg-white/60 backdrop-blur-xl p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-200 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 rounded-2xl border-white border shadow-lg shadow-black/30",
          clsx({
            "inset-x-4 top-4 max-h-[80vh] w-[calc(100dvw-2rem)] data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top":
              side === "top",
            "inset-x-4 bottom-4 max-h-[80vh] w-[calc(100dvw-2rem)] data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom":
              side === "bottom",
            "inset-y-4 left-4 h-[calc(100dvh-2rem)] w-md max-w-[calc(100vw-2rem)] data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left":
              side === "left",
            "inset-y-4 right-4 h-[calc(100dvh-2rem)] w-md max-w-[calc(100vw-2rem)] data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right":
              side === "right",
          }),
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="flyout-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </FlyoutPortal>
  )
}

function FlyoutHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="flyout-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function FlyoutFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="flyout-footer"
      className={cn(
        "-mx-4 -mb-4 mt-auto flex flex-col-reverse gap-2 border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function FlyoutTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="flyout-title"
      className={cn(
        "cn-font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function FlyoutDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="flyout-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Flyout,
  FlyoutClose,
  FlyoutContent,
  FlyoutDescription,
  FlyoutFooter,
  FlyoutHeader,
  FlyoutOverlay,
  FlyoutPortal,
  FlyoutTitle,
  FlyoutTrigger,
}
