import SettingsPasskeys from '#/components/admin/profile/SettingsPasskeys'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { m } from '#/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/profile/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div>
      <Tabs className="block" defaultValue="general">
        <TabsList className="block mb-4" variant="line">
          <TabsTrigger value="general">{m['profile.settings.general']()}</TabsTrigger>
          <TabsTrigger value="passkeys">{m['profile.settings.passkeys']()}</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          General settings
        </TabsContent>
        <TabsContent value="passkeys">
          <SettingsPasskeys />
        </TabsContent>
      </Tabs>
    </div>
  )
}
