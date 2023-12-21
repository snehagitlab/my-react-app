// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports

import { useLocation, Link } from 'react-router-dom'

// ** MUI Imports
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import { useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

// ** Configs Import
import themeConfig from '../configs/themeConfig'

// ** Types
import { NavLink, NavGroup } from '../@core/layouts/types'
import { Settings } from '../@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Utils

interface Props {
  parent?: boolean
  item: NavLink
  navHover?: boolean
  settings: Settings
  navVisible?: boolean
  collapsedNavWidth: number
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  isSubToSub?: NavGroup | undefined
}

const VerticalNavLink = ({ item, parent, navHover, settings, isSubToSub }: Props) => {
  // ** Hooks
  const theme = useTheme()
  const { pathname } = useLocation()

  // ** Vars
  const { navCollapsed } = settings

  const IconTag: ReactNode = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const isNavLinkActive = () => {
    if (pathname === item.path) {
      return true
    } else {
      return false
    }
  }

  const active = isNavLinkActive()

  return (
    <CanViewNavLink navLink={item}>
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{ mt: 5, px: '10px !important' }}
      >
        <Link to={item.path === undefined ? '/' : `${item.path}`}>
          <ListItemButton
            sx={{
              borderRadius: 1,
              backgroundColor: theme => (isNavLinkActive() ? theme.palette.primary.dark : null),
              padding: theme.spacing(3, 3.5),
              transition: 'opacity .25s ease-in-out',
              '&:hover': {
                backgroundColor: theme => (isNavLinkActive() ? theme.palette.primary.dark : theme.palette.primary.light)
              }
            }}
          >
            {isSubToSub ? null : (
              <ListItemIcon
                sx={{
                  color: 'text.primary',
                  transition: 'margin .25s ease-in-out',
                  ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2.5 }),
                  ...(parent ? { ml: 1.25, mr: 3.75 } : {}) // This line should be after (navCollapsed && !navHover) condition for proper styling
                }}
              >
                <UserIcon
                  icon={IconTag}
                  componentType='vertical-menu'
                  iconProps={{
                    sx: {
                      fontSize: '0.875rem',
                      ...(!parent ? { fontSize: '1.5rem' } : {}),
                      ...(parent && item.icon ? { fontSize: '0.875rem' } : {}),
                      color: 'red'
                    }
                  }}
                  active={active}
                />
              </ListItemIcon>
            )}
            <ListItemText
              sx={{ color: theme => theme.palette.primary.dark }}
              primary={
                <Typography variant='body1' sx={{ color: isNavLinkActive() ? 'white' : null }}>
                  {item.title}
                </Typography>
              }
            />
          </ListItemButton>
        </Link>
      </ListItem>
    </CanViewNavLink>
  )
}

export default VerticalNavLink
