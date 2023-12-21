import { useEffect, useState } from 'react'

// Config file
import { USER_ROLE } from 'src/config/api.config'

// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import MuiSwipeableDrawer, { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer'
import { List, ListItem, ListItemButton, ListItemIcon, Typography } from '@mui/material'

// import {ListItemText} from '@mui/material'

import { Link, useLocation, useNavigate } from 'react-router-dom'

// ** Type Import
import { Settings } from '../@core/context/settingsContext'
import Logo from '../@core/components/logo'
import { Box } from '@mui/system'

import LogoutDarkIcon from 'src/assets/Images/Icons/dark/logout.svg'
import LogoutLightIcon from 'src/assets/Images/Icons/light/logout.svg'

import DashboardDarkIcon from 'src/assets/Images/Icons/dark/dashboard.svg'
import MastersDarkIcon from 'src/assets/Images/Icons/dark/masters.svg'
import OrganisationTypeDarkIcon from 'src/assets/Images/Icons/dark/organisation_type.svg'
import NotificationDarkIcon from 'src/assets/Images/Icons/dark/notification-status.svg'
import SettingsDarkIcon from 'src/assets/Images/Icons/dark/setting.svg'
import UserAndAgentDarkIcon from 'src/assets/Images/Icons/dark/user.svg'

//import TemplateDarkIcon from 'src/assets/Images/Icons/dark/template.svg'

import DashboardLightIcon from 'src/assets/Images/Icons/light/dashboard.svg'
import MastersLightIcon from 'src/assets/Images/Icons/light/masters.svg'
import OrganisationTypeLightIcon from 'src/assets/Images/Icons/light/organisation_type.svg'
import NotificationLightIcon from 'src/assets/Images/Icons/light/notification-status.svg'
import SettingsLightIcon from 'src/assets/Images/Icons/light/setting.svg'
import UserAndAgentLightIcon from 'src/assets/Images/Icons/light/user.svg'

//import TemplateLightIcon from 'src/assets/Images/Icons/light/template.svg'
import OrganisationLightIcon from 'src/assets/Images/Icons/light/organisation.svg'
import { toast } from 'react-toastify'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import OrganisationDarkIcon from 'src/assets/Images/Icons/dark/organisation.svg'
import LayersDarkIcon from 'src/assets/Images/Icons/dark/ham_icon.svg'
import LayersLightIcon from 'src/assets/Images/Icons/light/ham_icon.svg'

import HelpDarkIcon from 'src/assets/Images/Icons/light/help_light_icon.svg'
import HelpActiveDarkIcon from 'src/assets/Images/Icons/dark/help_icon.svg'
import { API_PATHS, KB_ACCESS } from 'src/config/api.config'


//env file

const REACT_APP_SERVER_BASE_URL = import.meta.env.VITE_APP_SERVER_BASE_URL
const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const API_VERSION = import.meta.env.VITE_APP_API_VERSION

interface Props {
  hidden: boolean
  navWidth: number
  navHover: boolean
  settings: Settings
  navVisible: boolean
  collapsedNavWidth: number
  navigationBorderWidth: number
  setNavHover: (values: boolean) => void
  setNavVisible: (value: boolean) => void
  saveSettings: (values: Settings) => void
}

const SwipeableDrawer = styled(MuiSwipeableDrawer)<SwipeableDrawerProps>({
  overflowX: 'hidden',
  transition: 'width .25s ease-in-out',
  '& ul': {
    listStyle: 'none'
  },
  '& .MuiListItem-gutters': {
    paddingLeft: 4,
    paddingRight: 4
  },
  '& .MuiDrawer-paper': {
    left: 'unset',
    right: 'unset',
    overflowX: 'hidden',
    transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out'
  }
})


const Drawer = (props: Props) => {
  const [role, setRole] = useState<number>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  /* 
    const handleClick = () => {
      setOpen(prev => !prev)
    } */

  let path = pathname

  if (path === '/organization/add') {
    path = '/organization'
  } else if (path === '/organization/view') {
    path = '/organization'
  } else if (path === '/organization/edit') {
    path = '/organization'
  } else if (path === '/knowledge/category') {
    path = '/knowledge'
  } else if (path === 'knowledge/addArticle') {
    path = '/knowledge'
  } else if (path === 'knowledge/template') {
    path = '/knowledge'
  } else if (path === 'template/add') {
    path = '/knowledge'
  } else if (path === 'template/view') {
    path = '/knowledge'
  } else if (path === 'template/edit') {
    path = '/knowledge'
  } else if (path === 'knowledge/article/preview') {
    path = '/knowledge'
  } else if (path === 'setting/change_password') {
    path = '/setting'
  } else if (path === 'setting/account_settings') {
    path = '/setting'
  } else if (path === 'setting/notifications') {
    path = '/setting'
  } else if (path === 'setting/help') {
    path = '/setting'
  } else if (path === 'setting/transfer_ownership') {
    path = '/setting'
  } else if (path === 'setting/organization_information') {
    path = '/setting'
  }


  const {
    hidden,
    navHover,
    navWidth,
    settings,
    navVisible,
    setNavHover,
    saveSettings,
    setNavVisible,
    collapsedNavWidth,
    navigationBorderWidth
  } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const { navCollapsed } = settings

  const isDarkMode = theme.palette.mode === 'dark' ? true : false

  // fetch role api
  const fetchData = async () => {
    const url = `${REACT_APP_SERVER_BASE_URL}/${API_VERSION}/user/module/`
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })

    const result = await response.json()
    if (result.status === 200) {
      setRole(result?.payload.roleId)
    } else {
      toast.error(result.message)
    }
  }

  const [KbAccess, setKbAccess] = useState('')

  //KB Access or not using license API
  const handleGetFreeTrailCountOrg = async () => {

    if (role === parseInt(USER_ROLE.ORG_ADMIN)) {

      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}/${API_PATHS.license}/detail`)
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        })
        const result = await response.json()

        if (result.status == 200) {
          const data = result.payload.knowBaseAccess
          setKbAccess(data)
        } else {
          const data = result.payload.knowBaseAccess
          setKbAccess(data)
        }
      } catch (ex: any) { }
    }

  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    handleGetFreeTrailCountOrg()
  }, [role])

  useEffect(() => {
    if (navCollapsed && hidden) {
      saveSettings({ ...settings, navCollapsed: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden])

  const drawerBgColor = () => {
    if (theme.palette.mode === 'light') {
      return {
        //  backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.black
      }
    } else if (theme.palette.mode === 'dark') {
      return {
        // backgroundColor: theme.palette.customColors.darkBg,
        color: theme.palette.common.white
      }
    } else {
      return {
        // backgroundColor: theme.palette.primary.light
      }
    }
  }

  // Drawer Props for Mobile & Tablet screens
  const MobileDrawerProps = {
    open: navVisible,
    onOpen: () => setNavVisible(true),
    onClose: () => setNavVisible(false),
    ModalProps: {
      keepMounted: true // Better open performance on mobile.
    }
  }

  // Drawer Props for Desktop screens
  const DesktopDrawerProps = {
    open: true,
    onOpen: () => null,
    onClose: () => null,
    onMouseEnter: () => {
      setNavHover(true)
    },
    onMouseLeave: () => {
      setNavHover(false)
    }
  }
  const handleLogout = () => {
    navigate('/', { replace: true })
    localStorage.removeItem('userData')
  }
  const menuItems: Array<any> = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: !isDarkMode ? DashboardDarkIcon : DashboardLightIcon,
      selectedIcon: DashboardLightIcon,
      path: '/dashboard',
      showSidebar: true
    },
    {
      id: 'masters',
      title: 'Masters',
      icon: !isDarkMode ? MastersDarkIcon : MastersLightIcon,
      selectedIcon: MastersLightIcon,
      path: '#',
      showSidebar: true,
      items: [
        {
          id: 'masters',
          title: 'Organization Type',
          icon: !isDarkMode ? OrganisationTypeDarkIcon : OrganisationTypeLightIcon,
          selectedIcon: OrganisationTypeLightIcon,
          path: '/organizationType',
          showSidebar: true
        }
      ]
    },
    {
      id: 'organisations',
      title: 'Organizations',
      icon: !isDarkMode ? OrganisationDarkIcon : OrganisationLightIcon,
      selectedIcon: OrganisationLightIcon,
      path: '/organization',
      showSidebar: true
    },
    {
      id: 'user-and-agents',
      title: 'Patients & Team ',
      icon: !isDarkMode ? UserAndAgentDarkIcon : UserAndAgentLightIcon,
      selectedIcon: UserAndAgentLightIcon,
      path: '/user_agent',
      showSidebar: true
    },
    {
      id: 'knowledge',
      title: 'Knowledge Base',
      icon: !isDarkMode ? NotificationDarkIcon : NotificationLightIcon,
      selectedIcon: NotificationLightIcon,
      path: '/knowledge',
      showSidebar: true
    },
    {
      id: 'userrole',
      title: 'Master',
      icon: !isDarkMode ? OrganisationDarkIcon : OrganisationLightIcon,
      selectedIcon: OrganisationLightIcon,
      path: '#',
      showSidebar: true,
      items: [

        /*   {
          id: 'userrole',
          title: 'Data Feed',
          icon: !isDarkMode ? LayersDarkIcon : LayersLightIcon,
          selectedIcon: LayersLightIcon,
          path: '/data_feed',
          showSidebar: true
        }, */

        {
          id: 'usertype',
          title: 'User Role',
          icon: !isDarkMode ? LayersDarkIcon : LayersLightIcon,
          selectedIcon: LayersLightIcon,
          path: '/usertype',
          showSidebar: true
        }
      ]
    },

    /*  {
       id: 'template',
       title: 'Template',
       icon: !isDarkMode ? TemplateDarkIcon : TemplateLightIcon,
       selectedIcon: TemplateLightIcon,
       path: '/knowledge/template',
       showSidebar: true
     }, */

    /* {
      id: 'notification',
      title: 'Notification',
      icon: !isDarkMode ? NotificationDarkIcon : NotificationLightIcon,
      selectedIcon: NotificationLightIcon,
      path: '/notification',
      showSidebar: true
    }, */
    {
      id: 'settings',
      title: 'Settings',
      icon: !isDarkMode ? SettingsDarkIcon : SettingsLightIcon,
      selectedIcon: SettingsLightIcon,
      path: '/setting',
      showSidebar: true
    },
    {
      id: 'help',
      title: 'Help',
      icon: !isDarkMode ? HelpDarkIcon : HelpDarkIcon,
      selectedIcon: HelpActiveDarkIcon,
      path: '/help',
      showSidebar: true
    }
  ]

  if (role === parseInt(USER_ROLE.SUPPER_ADMIN)) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].id === 'user-and-agents') {
        menuItems.splice(i, 1)
      } else if (menuItems[i].id === 'usertype') {
        menuItems.splice(i, 1)
      } else if (menuItems[i].id === 'data_feed') {
        menuItems.splice(i, 1)
      } else if (menuItems[i].id === 'userrole') {
        menuItems.splice(i, 1)
      } else if (menuItems[i].id === 'settings') {
        menuItems.splice(i, 1)
      }
    }
  }
  if (role === parseInt(USER_ROLE.SUPPER_ADMIN)) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].id === 'help') {
        menuItems.splice(i, 1)
      }
    }
  }
  if (role === parseInt(USER_ROLE.SUPPER_ADMIN)) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].id === 'settings') {
        menuItems.splice(i, 1)
      }
    }
  }



  else if (role === parseInt(USER_ROLE.ORG_ADMIN)) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].id === 'masters') {
        menuItems.splice(i, 2)
      } else if (menuItems[i].id === 'organisations') {
        menuItems.splice(i, 1)
      } else if (menuItems[i].id === 'template') {
        menuItems.splice(i, 1)
      }
    }
  }

  if (role === parseInt(USER_ROLE.ORG_ADMIN) && (KbAccess == KB_ACCESS.NOACCESS)) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].id === 'knowledge') {
        menuItems.splice(i, 1)
      }
    }
  }



  return (
    <SwipeableDrawer
      className='layout-vertical-nav'
      variant={hidden ? 'temporary' : 'permanent'}
      {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
      PaperProps={{ sx: { width: navCollapsed && !navHover ? collapsedNavWidth : navWidth } }}
      sx={{
        width: navCollapsed ? collapsedNavWidth : navWidth,
        '& .MuiDrawer-paper': {
          ...drawerBgColor(),
          ...(!hidden && navCollapsed && navHover ? { boxShadow: 9 } : {}),
          borderRight: navigationBorderWidth === 0 ? 0 : `${navigationBorderWidth}px solid ${theme.palette.divider}`
        }
      }}
    >
      <Box sx={{ m: 5 }}>
        <Logo />
      </Box>

      {menuItems.map(
        (item: any, index: number) =>
          item.showSidebar && (
            <List
              key={item.id}
              disablePadding
              className='nav-link'
              sx={{ width: '100%', paddingTop: 0, mt: 3, px: '20px !important' }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  p: 3,
                  lineHeight: '22px !important',
                  fontSize: '16px !important',
                  borderRadius: '9px',
                  boxShadow: theme => (path === item.path ? `10px 6px 20px -8px ${theme.palette.primary.main}` : null),
                  backgroundColor: theme => (path === item.path ? theme.palette.primary.main : null),
                  transition: 'opacity .25s ease-in-out',
                  '&:hover': {
                    backgroundColor: item.path === path ? theme.palette.primary.main : null
                  }
                }}
                onClick={() => {
                  if (item.items) {
                    setOpen(!open)
                  } else {
                    setOpen(false)
                  }
                }}
              >
                <ListItemIcon color='white'>
                  <img alt='select_img' src={item.path === path ? item.selectedIcon : item.icon} />
                </ListItemIcon>
                <Typography
                  variant='subtitle2'
                  sx={{
                    color:
                      path === item.path
                        ? theme.palette.common.white
                        : isDarkMode
                          ? theme.palette.common.white
                          : theme.palette.common.black
                  }}
                >
                  {item.title}
                </Typography>
                {item.items && item.items.length > 0 && (
                  <>{open ? <ExpandLess sx={{ marginLeft: '4px' }} /> : <ExpandMore sx={{ marginLeft: '4px' }} />}</>
                )}
              </ListItemButton>
              {item.items && item.items.length > 0 && (
                <Collapse
                  sx={{ paddingLeft: '10px', paddingTop: '5px' }}
                  in={open}
                  timeout='auto'
                  unmountOnExit
                  key={index}

                // onClick={() => openFolderArticle(items.folderId)}
                >
                  <List
                    component='div'
                    disablePadding
                    onClick={() => {
                      setOpen(true)
                    }}
                  >
                    {item?.items.map((child: any, key: number) => (
                      <ListItemButton
                        component={Link}
                        to={child.path}
                        key={key}
                        sx={{
                          p: 3,
                          lineHeight: '22px !important',
                          fontSize: '16px !important',
                          borderRadius: '9px',

                          boxShadow: theme =>
                            path === child.path ? `10px 6px 20px -8px ${theme.palette.primary.main}` : null,
                          backgroundColor: theme => (path === child.path ? theme.palette.primary.main : null),
                          transition: 'opacity .25s ease-in-out',
                          '&:hover': {
                            backgroundColor: child.path === path ? theme.palette.primary.main : null
                          }
                        }}
                      >
                        <ListItemIcon color='white'>
                          <img
                            alt='folder_img'
                            style={{ width: '19px', height: '19px' }}
                            src={child.path === path ? child.selectedIcon : child.icon}
                          />
                        </ListItemIcon>

                        <Typography
                          sx={{
                            color:
                              path === child.path
                                ? theme.palette.common.white
                                : isDarkMode
                                  ? theme.palette.common.white
                                  : theme.palette.common.black,
                            width: '100%',
                            fontSize: '16px',
                            fontFamily: 'Mazzard'
                          }}
                        >
                          {child.title}
                        </Typography>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </List>
          )
      )}

      <ListItem
        disablePadding
        className='nav-link'
        sx={{
          position: 'absolute',
          bottom: 0,
          mb: 10,
          mt: 5,
          px: '20px !important'
        }}
      >
        <ListItemButton
          onClick={handleLogout}
          component={Link}
          to='/login'
          sx={{
            border: theme => `1px solid ${theme.palette.primary.main}`,
            backgroundColor: theme =>
              theme.palette.mode === 'light' ? theme.palette.secondary.light : theme.palette.primary.dark,
            padding: theme.spacing(2),
            transition: 'opacity .25s ease-in-out',
            borderRadius: 1,
            ml: 2,
            mr: 3,
            maxWidth: '90%',
            position: 'fixed',
            width: '12rem'
          }}
        >
          <ListItemIcon>
            <img alt='select_img' src={isDarkMode ? LogoutLightIcon : LogoutDarkIcon} />
          </ListItemIcon>
          <Typography sx={{ color: theme => (isDarkMode ? theme.palette.common.white : theme.palette.primary.main) }}>
            Log Out
          </Typography>
        </ListItemButton>
      </ListItem>
    </SwipeableDrawer>
  )
}

export default Drawer
