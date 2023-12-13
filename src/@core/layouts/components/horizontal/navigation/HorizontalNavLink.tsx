// ** React Imports
import { ElementType, Fragment } from 'react'

// ** Next Imports
import { Link, useLocation } from 'react-router-dom'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Third Party Imports
import clsx from 'clsx'

// ** Icon Imports
import CircleOutline from 'mdi-material-ui/CircleOutline'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface Props {
  item: NavLink
  settings: Settings
  hasParent: boolean
}

const ListItem = styled(MuiListItem)<ListItemProps & { component?: ElementType; target?: '_blank' | undefined }>(
  ({ theme }) => ({
    width: 'auto',
    paddingTop: theme.spacing(2.25),
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(2.25),
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&.active, &.active:hover': {
      backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08)
    },
    '&.active .MuiTypography-root, &.active:hover .MuiTypography-root': {
      color: theme.palette.primary.main
    },
    '&.active, &.active .MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  })
)

const HorizontalNavLink = (props: Props) => {
  // ** Props
  const { item, settings, hasParent } = props

  // ** Hook
  const { pathname } = useLocation()

  const IconTag = item.icon ? item.icon : themeConfig.navSubItemIcon

  const Wrapper = !hasParent ? List : Fragment

  const isNavLinkActive = () => {
    if (pathname === item.path) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper {...(!hasParent ? { component: 'div', sx: { py: settings.skin === 'bordered' ? 2.625 : 2.75 } } : {})}>
        <Link to={`${item.path}`}>
          <ListItem
            component={'a'}
            disabled={item.disabled}
            className={clsx({ active: isNavLinkActive() })}
            target={item.openInNewTab ? '_blank' : undefined}
            onClick={e => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            sx={{
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
              ...(!hasParent
                ? {
                    px: 5.5,
                    borderRadius: 3.5,
                    '&.active, &.active:hover': {
                      boxShadow: 3,
                      backgroundImage: theme =>
                        `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`,
                      '& .MuiTypography-root, & .MuiListItemIcon-root, & .MuiSvgIcon-root': {
                        color: 'common.white'
                      }
                    }
                  }
                : { px: 5 })
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
                }}
              >
                <ListItemIcon sx={{ color: 'text.primary', mr: !hasParent ? 2 : 3 }}>
                  <UserIcon
                    icon={IconTag}
                    componentType='horizontal-menu'
                    iconProps={{ sx: IconTag === CircleOutline ? { fontSize: '0.875rem' } : { fontSize: '1.375rem' } }}
                  />
                </ListItemIcon>
                <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>
                  <Translations text={item.title} />
                </Typography>
              </Box>
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    ml: 1.6,
                    height: 20,
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              ) : null}
            </Box>
          </ListItem>
        </Link>
      </Wrapper>
    </CanViewNavLink>
  )
}

export default HorizontalNavLink
