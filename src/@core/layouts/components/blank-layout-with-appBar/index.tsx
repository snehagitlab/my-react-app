// ** Next Import
import { Link } from 'react-router-dom'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

import Logo from 'src/assets/Images/logo.png'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const StyledLink = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const BlankLayoutAppBar = () => {
  // ** Hooks
  const theme = useTheme()

  return (
    <AppBar elevation={3} color='default' position='sticky'>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          padding: theme => `${theme.spacing(0, 6)} !important`,
          minHeight: `${theme.mixins.toolbar.minHeight}px !important`
        }}
      >
        <Link to='/'>
          <StyledLink>
            <img src={Logo} />
          </StyledLink>
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export default BlankLayoutAppBar
