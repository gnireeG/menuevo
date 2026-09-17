import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div className="h-dvh w-full grid place-items-center">
      <Card className="w-full max-w-md">
        <CardContent className="w-full relative">
          <Link to="/" className="absolute top-0 right-4"><Button variant="ghost">Back<img src="/logo-menuevo-icon.svg" className="h-6" /></Button></Link>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
