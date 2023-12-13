// ** MUI Imports
import { useTheme } from '@mui/material/styles'

import { List, ListItemButton, Typography, ListItemIcon } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import ChangePasswordDarkIcon from 'src/assets/Images/Icons/dark/change_password.svg'
import ChangePasswordActiveDarkIcon from 'src/assets/Images/Icons/dark/change_password_active.svg'

import AccountDarkIcon from 'src/assets/Images/Icons/dark/account.svg'
import AccountActiveDarkIcon from 'src/assets/Images/Icons/dark/account_active.svg'

/* import NotificationDarkIcon from 'src/assets/Images/Icons/dark/notification.svg'
import NotificationActiveDarkIcon from 'src/assets/Images/Icons/dark/notification_active.svg'
  */
/*import HelpDarkIcon from 'src/assets/Images/Icons/dark/help.svg'
import HelpActiveDarkIcon from 'src/assets//Images/Icons/dark/help_active.svg' */

/*  import TransferOwnwershipLight from 'src/assets/Images/Icons/dark/transferOwnwershiplight.svg'
import TransferOwnwershipDark from 'src/assets/Images/Icons/dark/transferOwnwershipDark.svg' */

import OrgInfoLight from 'src/assets/Images/Icons/dark/orgInfoLight.svg'
import OrgInfoDark from 'src/assets/Images/Icons/dark/orgInfoDark.svg'

//import {USER_ROLE} from 'src/config/api.config'
//import { useEffect, useState } from 'react'

const Setting = () => {
  // ** Hook
  const theme = useTheme()
  const { pathname } = useLocation()

  const isDarkMode = theme.palette.mode === 'dark' ? true : false

  const path = pathname

  const menuItems: Array<any> = [
    {
      id: 'orgInfo',
      title: 'Organization',
      icon: !isDarkMode ? OrgInfoLight : OrgInfoLight,
      selectedIcon: OrgInfoDark,
      isActive: true,
      path: '/setting/organization_information'
    },
    {
      id: 'account',
      title: 'Profile',
      icon: !isDarkMode ? AccountDarkIcon : AccountDarkIcon,
      selectedIcon: AccountActiveDarkIcon,
      isActive: true,
      path: '/setting/account_settings'
    },
    {
      id: 'password',
      title: 'Change Password',
      icon: !isDarkMode ? ChangePasswordDarkIcon : ChangePasswordDarkIcon,
      selectedIcon: ChangePasswordActiveDarkIcon,
      isActive: true,
      path: '/setting/change_password'
    },
    
    
    /* , 
    {
      id: 'notification',
      title: 'Notification',
      icon: !isDarkMode ? NotificationDarkIcon : NotificationDarkIcon,
      selectedIcon: NotificationActiveDarkIcon,
      isActive: true,
      path: '/setting/notifications'
    } */

 /*    {
      id: 'help',
      title: 'Help',
      icon: !isDarkMode ? HelpDarkIcon : HelpDarkIcon,
      selectedIcon: HelpActiveDarkIcon,
      isActive: true,
      path: '/setting/help'
    }, */

    /*  {
      id: 'ownership',
      title: 'Transfer Ownership',
      icon: !isDarkMode ? TransferOwnwershipLight : TransferOwnwershipLight,
      selectedIcon: TransferOwnwershipDark,
      isActive: true,
      path: '/setting/transfer_ownership'
    }, */

   
  ]

  /* const[role,setRole]= useState(0)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    setRole(userData.data.userRole[0])
  },[])

  useEffect(() => {
    alert('1'+role)
  if (role === parseInt(USER_ROLE.SUPPER_ADMIN)) {
    alert('2')
    for (let i = 0; i < menuItems.length; i++) {
      alert('3='+i)
      if (menuItems[i].id === 'orgInfo') {
        alert('4='+i)
        menuItems.splice(i, 1)
      }
    }
  }
},[role]) */

  return (
    <>
      <div className='side-menu'>
        {menuItems.map((item: any) => (
          <List key={item.id}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                p: 3,
                lineHeight: '28.57px !important',
                fontSize: '18px !important',
                borderRadius: '9px 0px 0px 9px',
                transition: 'opacity .25s ease-in-out'
              }}
            >
              <ListItemIcon color='white'>
                <img alt='select_img' src={path === item.path ? item.selectedIcon : item.icon} />
              </ListItemIcon>
              <Typography>{item.title}</Typography>
            </ListItemButton>
          </List>
        ))}
      </div>
    </>
  )
}
export default Setting
