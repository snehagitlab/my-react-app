
import DashboardIcon from 'src/assets/Images/Icons/dark/dashboard.png'
import NotificationIcon from 'src/assets/Images/Icons/dark/notification-status.png'
import SettingsIcon from 'src/assets/Images/Icons/dark/setting.png'
import UserAndAgentIcon from 'src/assets/Images/Icons/dark/user.svg'
import OrganisationIcon from 'src/assets/Images/Icons/dark/organisation.png'

const menuItems: Array<any> = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
    showSidebar: true
  },
  {
    id: 'masters',
    title: 'Master',
    icon: OrganisationIcon,
    path: '/master',
    showSidebar: true
  },
  {
    id: 'organisations',
    title: 'Organizations',
    icon: OrganisationIcon,
    path: '/organization',
    showSidebar: true
  },
  {
    id: 'add_organisation',
    title: 'Add Organization',
    icon: OrganisationIcon,
    path: '/organization/add',
    showSidebar: false
  },
  {
    id: 'edit_organisation',
    title: 'Edit Organization',
    icon: OrganisationIcon,
    path: '/organization/edit',
    showSidebar: false
  },
  {
    id: 'view_organisation',
    title: 'View Organization',
    icon: OrganisationIcon,
    path: '/organization/view',
    showSidebar: false
  },
  {
    id: 'user-and-agents',
    title: 'Patients & Team Member',
    icon: UserAndAgentIcon,
    path: '/user_agent',
    showSidebar: true
  },
  {
    id: 'notification',
    title: 'Notification',
    icon: NotificationIcon,
    path: '/notification',
    showSidebar: true
  },
  {
    id: 'knowledge',
    title: 'Knowledge Base',
    icon: NotificationIcon,
    path: '/knowledge',
    showSidebar: true
  },
  {
    id: 'show_knowledge',
    title: 'Folders',
    icon: NotificationIcon,
    path: '/knowledge/category',
    showSidebar: false
  },
  {
    id: 'addArticle_knowledge',
    title: 'Article',
    icon: NotificationIcon,
    path: '/knowledge/addArticle',
    showSidebar: false
  },
  {
    id: 'template_knowledge',
    title: 'Template',
    icon: NotificationIcon,
    path: '/knowledge/template',
    showSidebar: false
  },

  {
    id: 'add_template_knowledge',
    title: ' Add Template',
    icon: NotificationIcon,
    path: '/template/add',
    showSidebar: false
  },
  {
    id: 'view_template_knowledge',
    title: ' View Template',
    icon: NotificationIcon,
    path: '/template/view',
    showSidebar: false
  },
  {
    id: 'edit_template_knowledge',
    title: ' Edit Template',
    icon: NotificationIcon,
    path: '/template/edit',
    showSidebar: false
  },
  {
    id: 'Preview',
    title: 'Preview',
    icon: NotificationIcon,
    path: '/knowledge/article/preview',
    showSidebar: false
  },
  {
    id: 'setting',
    title: 'Settings',
    icon: SettingsIcon,
    path: '/setting',
    showSidebar: true
  },
  {
    id: 'usertype',
    title: 'User Role',
    icon: SettingsIcon,
    path: '/usertype',
    showSidebar: true
  },
  {
    id: 'userrole',
    title: 'Data Feed',
    icon: SettingsIcon,
    path: '/data_feed',
    showSidebar: true
  },
  {
    id: 'masters',
    title: 'Organization Type',
    icon: SettingsIcon,
    path: '/organizationType',
    showSidebar: true
  },
  {
    id: 'userrole',
    title: 'API Data ',
    icon: SettingsIcon,
    path: '/apidata',
    showSidebar: true
  },
  {
    id: 'account_settings',
    title: 'Account Settings',
    icon: SettingsIcon,
    path: '/setting/account_settings',
    showSidebar: true
  },
  {
    id: 'setting',
    title: 'Change Password',
    icon: SettingsIcon,
    path: '/setting/change_password',
    showSidebar: true
  },
  {
    id: 'account_settings',
    title: 'Notifications',
    icon: SettingsIcon,
    path: '/setting/notifications',
    showSidebar: true
  },
  {
    id: 'account_settings',
    title: 'Help',
    icon: SettingsIcon,
    path: '/help',
    showSidebar: true
  },
  {
    id: 'account_settings',
    title: 'Transfer Ownership',
    icon: SettingsIcon,
    path: '/setting/transfer_ownership',
    showSidebar: true
  },
  {
    id: 'organization_information',
    title: 'Organization Information',
    icon: SettingsIcon,
    path: '/setting/organization_information',
    showSidebar: true
  }
]

export default menuItems

