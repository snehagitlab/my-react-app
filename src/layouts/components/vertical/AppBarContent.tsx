// ** MUI Imports
import { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import { Divider, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// import images

import Toggle from '../../../assets/Images/Icons/dark/toggle.png'

import { Box, Grid } from '@mui/material'

// ** Icons Imports
import MenuIcon from 'mdi-material-ui/Menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { useLocation } from 'react-router-dom'

// import navigation from 'src/navigation/vertical'

// ** Components

// import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

// import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'

import menuItems from 'src/config/menuItems.config'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  setShowBackdrop: (val: boolean) => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // hook
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark' ? true : false

  // const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const { hidden, settings, toggleNavVisibility } = props
  const { pathname } = useLocation()
  const user = JSON.parse(localStorage.getItem('userData') || '{}')
  const userRole = JSON.parse(localStorage.getItem('userRole') || '{}')
  const [title, setTitle] = useState<string>('')

  const getTitle = () => {
    const titleObj: any = menuItems.filter(({ path }) => pathname === path)[0]

    let title = `${user.data.fname} ${user.data.lname}`

    if (titleObj['title'] === 'Dashboard') {
      title = userRole == 1 ?  'Dashboard':`${user.data?.userOrg?.org?.orgName}`
    } else {
      title = titleObj['title']
    }

    setTitle(title)
  }

  useEffect(() => {
    getTitle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <MenuIcon />
          </IconButton>
        ) : null}
        <Grid item sx={{ textAlign: 'center', display: { sm: 'block', xs: 'none', md: 'none' } }}>
          Dashboard
        </Grid>
      </Box>
      <Grid sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: { md: 'space-between', sm: 'space-between', xs: 'center' },
            pr: '32px'
          }}
        >
          <Grid item>
            <Typography
              variant='h4'
              sx={{
                fontSize: '24px !important',
                color: !isDarkMode ? '#000' : '#ffffff',
                paddingLeft: '4px',
                display: { xs: 'none', md: 'block', sm: 'none' },
                textTransform:'capitalize'
              }}
            >
              {title}
            </Typography>
          </Grid>

          <Grid item>
            <Grid item sx={{ textAlign: 'center', display: { sm: 'none', xs: 'block', md: 'none' } }}>
              Dashboard
            </Grid>

            {/* <Grid item sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
              <InputBase
                size='small'
                className='searchticket-input'
                name='search'
                sx={{
                  background: '#F7F7F7',
                  borderRadius: '9px',
                  fontSize: '13px',
                  color: 'rgba(42, 58, 81)',
                  padding: '12px 14px'
                }}
                placeholder='Search'
                startAdornment={
                  <InputAdornment sx={{ mr: '10px' }} position='start'>
                    <img src={Search} alt='search' style={{ width: '17px', height: '17px' }} />
                  </InputAdornment>
                }
              />
            </Grid> */}
          </Grid>
        </Grid>
        <Box>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <img src={Toggle} alt='profile-toggle' className='toggle-img' style={{ width: '46px', height: '46px' }} />
          </IconButton>
        </Box>
        <Box
          className='actions-right'
          sx={{ alignItems: 'center', display: { xs: 'none', md: 'block,flex', sm: 'none' } }}
        >
          <Box sx={{ p: 1 }}>
            <Divider sx={{ height: '100%' }} orientation='vertical' />
          </Box>
          <UserDropdown settings={settings} />
          <Box sx={{ ml: 20 }}>
            <NotificationDropdown settings={settings} />
            {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
            {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
          </Box>
        </Box>
      </Grid>
    </Box>
  )
}

export default AppBarContent
