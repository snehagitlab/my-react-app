// import { Typography } from '@mui/material'
import LogoImage from 'src/assets/Images/logo.png'
import DarkLogoImage from 'src/assets/Images/Logo_2.png'

import { useTheme } from '@mui/material/styles'

function Logo() {
  // hook
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark' ? true : false

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isDarkMode ? (
        <>
          <img alt="dark-logo" src={DarkLogoImage} style={{ height: '50px' }} />
        </>
      ) : (
        <>
          <img alt="light-img" src={LogoImage} style={{ height: '50px' }} />
        </>
      )}

      {/* <Typography
        variant='h5'
        sx={{
          fontSize: '22px !important',
          fontWeight: '700 !important',
          fontStyle: 'italic',
          ml: 2,
          color: !isDarkMode ? '#000' : '#ffffff'
        }}
      >
        SUPPORT
      </Typography> */}
    </div>
  )
}

export default Logo
