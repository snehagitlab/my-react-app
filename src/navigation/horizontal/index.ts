// ** Icon imports
import { IconHome, IconSettings, IconNotification, IconUser, IconSmartHome } from '@tabler/icons'

// ** Type import
import { HorizontalNavItemsType } from '../@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: IconHome,
      path: '/admin/dashboard'
    },
    {
      title: 'Master',
      icon: IconSmartHome,
      path: '/admin/dashboard/masters'
    },
    {
      title: 'Organization',
      icon: IconSmartHome,
      path: '/admin/dashboard/organizations'
    },
    {
      title: 'User and Agents',
      icon: IconUser,
      path: '/admin/dashboard/user_agents_list'
    },
    {
      title: 'Notification',
      icon: IconNotification,
      path: '/admin/notification'
    },
    {
      title: 'Settings',
      icon: IconSettings,
      path: '/admin/setting'
    }
  ]
}

export default navigation

