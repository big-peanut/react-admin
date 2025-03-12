import * as React from 'react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className='flex flex-col space-y-2'>
          {teams.map((team) => (
            <SidebarMenuButton
              key={team.name}
              size='lg'
              className={`flex items-center space-x-2 rounded-lg p-2 ${
                activeTeam.name === team.name
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'bg-sidebar-primary text-sidebar-primary-foreground'
              }`}
              onClick={() => setActiveTeam(team)}
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
                <team.logo className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{team.name}</span>
                <span className='truncate text-xs'>{team.plan}</span>
              </div>
            </SidebarMenuButton>
          ))}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
