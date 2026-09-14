import { Card, CardContent } from '#/components/ui/card'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({context}) => {
    if(context.session){
      throw redirect({to: '/admin'})
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div className="h-dvh w-full grid place-items-center">
      <Card>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
