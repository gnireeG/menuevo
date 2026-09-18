import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { nameToHex, nameToInitials } from '#/lib/utils'

type PersonRowProps = {
  /** Seeds the avatar colour and initials — a name for members, an email for invitations. */
  seed: string
  title: string
  subtitle: string
  badge?: React.ReactNode
  actions?: React.ReactNode
}

/**
 * One row in a people list: avatar, two lines of text, and trailing slots.
 * Every list that shows people (members, pending invitations) renders through
 * here, so the layout stays in a single place.
 */
export default function PersonRow({ seed, title, subtitle, badge, actions }: PersonRowProps) {
  return (
    <div className="flex gap-2 items-center justify-between not-last-of-type:border-b border-border flex-wrap py-2">
      <div className="flex gap-2 items-center min-w-0">
        <Avatar>
          <AvatarFallback style={{ backgroundColor: nameToHex(seed) }} className="text-white">
            {nameToInitials(seed)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p className="font-semibold truncate">{title}</p>
          <p className="truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {badge}
        {actions}
      </div>
    </div>
  )
}
