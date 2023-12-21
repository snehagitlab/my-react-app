// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AppBar from '@mui/material/AppBar'
import Backdrop from '@mui/material/Backdrop'
import { styled, useTheme } from '@mui/material/styles'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'
import { ListItem, ListItemButton, ListItemIcon, Typography } from '@mui/material'

import { Link, useLocation } from 'react-router-dom'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Theme Config Import
import themeConfig from '../configs/themeConfig'

// ** Type Import
import { LayoutProps } from '../@core/layouts/types'

// ** Components
import Customizer from '../@core/components/customizer'
import Navigation from './components/horizontal/navigation'
import ScrollToTop from '../@core/components/scroll-to-top'
import AppBarContent from './components/horizontal/app-bar-content'

// ** Util Import
import { hexToRGBA } from '../@core/utils/hex-to-rgba'
import DashboardDarkIcon from 'src/assets/Images/Icons/dark/dashboard.png'
import NotificationDarkIcon from 'src/assets/Images/Icons/dark/notification-status.png'
import SettingsDarkIcon from 'src/assets/Images/Icons/dark/setting.png'
import UserAndAgentDarkIcon from 'src/assets/Images/Icons/dark/user.svg'
import OrganisationDarkIcon from 'src/assets/Images/Icons/dark/organisation.png'

import DashboardLightIcon from 'src/assets/Images/Icons/light/dashboard.png'
import NotificationLightIcon from 'src/assets/Images/Icons/light/notification-status.png'
import SettingsLightIcon from 'src/assets/Images/Icons/light/setting.png'
import UserAndAgentLightIcon from 'src/assets/Images/Icons/light/user.svg'
import OrganisationLightIcon from 'src/assets/Images/Icons/light/organisation.png'

// ** Styled Component
import DatePickerWrapper from '../@core/styles/libs/react-datepicker'

const HorizontalLayoutWrapper = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  ...(themeConfig.horizontalMenuAnimation && { overflow: 'clip' })
})

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(0, 6)} !important`,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4)
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}))

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const HorizontalLayout = (props: LayoutProps) => {
  // ** Props
  const {
    hidden,
    children,
    settings,
    scrollToTop,
    saveSettings,
    horizontalNavMenuContent: userHorizontalNavMenuContent
  } = props

  // ** States
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false)

  // ** Vars
  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings

  const theme = useTheme()
  const { pathname } = useLocation()

  const isDarkMode = theme.palette.mode === 'dark' ? true : false

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
      id: 'organisations',
      title: 'Organizations',
      icon: !isDarkMode ? OrganisationDarkIcon : OrganisationLightIcon,
      selectedIcon: OrganisationLightIcon,
      path: '/organization',
      showSidebar: true
    },
    {
      id: 'user-and-agents',
      title: 'Patients & Team Member',
      icon: !isDarkMode ? UserAndAgentDarkIcon : UserAndAgentLightIcon,
      selectedIcon: UserAndAgentLightIcon,
      path: '/user_agent',
      showSidebar: true
    },
    {
      id: 'notification',
      title: 'Notification',
      icon: !isDarkMode ? NotificationDarkIcon : NotificationLightIcon,
      selectedIcon: NotificationLightIcon,
      path: '/notification',
      showSidebar: true
    },
    {
      id: 'knowledge',
      title: 'knowledge',
      icon: !isDarkMode ? NotificationDarkIcon : NotificationLightIcon,
      selectedIcon: NotificationLightIcon,
      path: '/knowledge',
      showSidebar: true
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: !isDarkMode ? SettingsDarkIcon : SettingsLightIcon,
      selectedIcon: SettingsLightIcon,
      path: '/setting',
      showSidebar: true
    }
  ]

  return (
    <HorizontalLayoutWrapper className='layout-wrapper'>
      {/* {/ Navbar (or AppBar) and Navigation Menu Wrapper /} */}
      <AppBar
        color='default'
        elevation={skin === 'bordered' ? 0 : 3}
        className='layout-navbar-and-nav-container'
        position={appBar === 'fixed' ? 'sticky' : 'static'}
        sx={{
          alignItems: 'center',
          color: 'text.primary',
          justifyContent: 'center',
          ...(appBar === 'static' && { zIndex: 13 }),
          backgroundColor: theme => theme.palette.background.paper,
          ...(skin === 'bordered' && { borderBottom: theme => `1px solid ${theme.palette.divider}` }),
          ...(!showBackdrop && skin === 'bordered' && { borderBottom: theme => `1px solid ${theme.palette.divider}` }),
          transition:
            'border-bottom 0.2s ease-in-out, backdrop-filter .25s ease-in-out, background-color .25s ease-in-out',
          ...(appBar === 'fixed'
            ? appBarBlur && {
              backdropFilter: 'blur(8px)',
              backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.85)
            }
            : {})
        }}
      >
        {/* {/ Navbar / AppBar /} */}
        <Box
          className='layout-navbar'
          sx={{
            width: '100%',
            ...(navHidden ? {} : { borderBottom: theme => `1px solid ${theme.palette.divider}` })
          }}
        >
          <Toolbar
            className='navbar-content-container'
            sx={{
              mx: 'auto',
              ...(contentWidth === 'boxed' && { '@media (min-width:1440px)': { maxWidth: 1440 } }),
              minHeight: theme => `${(theme.mixins.toolbar.minHeight as number) - 1}px !important`
            }}
          >
            <AppBarContent
              {...props}
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              setShowBackdrop={setShowBackdrop}
            />
          </Toolbar>
        </Box>

        {/* {/ Navigation Menu /} */}
        {navHidden ? null : (
          <Box className='layout-horizontal-nav' sx={{ width: '100%', position: 'relative' }}>
            <Toolbar
              className='horizontal-nav-content-container'
              sx={{
                mx: 'auto',
                ...(contentWidth === 'boxed' && { '@media (min-width:1440px)': { maxWidth: 1440 } }),
                minHeight: theme =>
                  `${(theme.mixins.toolbar.minHeight as number) - (skin === 'bordered' ? 1 : 0)}px !important`
              }}
            >
              {(userHorizontalNavMenuContent && userHorizontalNavMenuContent(props)) || <Navigation {...props} />}
              {menuItems.map(
                item =>
                  item.showSidebar && (
                    <ListItem key={item.id} disablePadding className='nav-link' sx={{ mt: 3, px: '20px !important' }}>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        sx={{
                          p: 3,
                          lineHeight: '28.57px !important',
                          fontSize: '18px !important',
                          borderRadius: '9px',
                          width: 100,
                          marginBottom: '10px',
                          boxShadow: theme =>
                            pathname === item.path ? `10px 6px 20px -8px ${theme.palette.primary.main}` : null,
                          backgroundColor: theme => (pathname === item.path ? theme.palette.primary.main : null),
                          transition: 'opacity .25s ease-in-out',
                          '&:hover': {
                            backgroundColor: item.path === pathname ? theme.palette.primary.main : null
                          }
                        }}
                      >
                        <ListItemIcon color='white'>
                          <img alt="select-icon" src={item.path === pathname ? item.selectedIcon : item.icon} />
                        </ListItemIcon>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            color:
                              pathname === item.path
                                ? theme.palette.common.white
                                : isDarkMode
                                  ? theme.palette.common.white
                                  : theme.palette.common.black
                          }}
                        >
                          {item.title}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  )
              )}
            </Toolbar>
          </Box>
        )}
        <Backdrop
          open={showBackdrop}
          onClick={() => setShowBackdrop(false)}
          sx={{ position: appBar === 'static' ? 'fixed' : 'absolute' }}
        />
      </AppBar>

      {/* {/ Content /} */}
      <ContentWrapper
        className='layout-page-content'
        sx={{
          ...(contentWidth === 'boxed' && {
            mx: 'auto',
            '@media (min-width:1440px)': { maxWidth: 1440 },
            '@media (min-width:1200px)': { maxWidth: '100%' }
          })
        }}
      >
        {children}
      </ContentWrapper>

      {/* {/ Portal for React Datepicker /} */}
      <DatePickerWrapper sx={{ zIndex: 11 }}>
        <Box id='react-datepicker-portal'></Box>
      </DatePickerWrapper>

      {/* {/ Customizer /} */}
      {themeConfig.disableCustomizer || hidden ? null : <Customizer />}

      {/* {/ Scroll to top button /} */}
      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <ArrowUp />
          </Fab>
        </ScrollToTop>
      )}

      {/* Backdrop  */}

      {appBar === 'static' ? null : (
        <Backdrop open={showBackdrop} onClick={() => setShowBackdrop(false)} sx={{ zIndex: 12 }} />
      )}
    </HorizontalLayoutWrapper>
  )
}

export default HorizontalLayout
