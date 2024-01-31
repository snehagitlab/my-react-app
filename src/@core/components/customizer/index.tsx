// ** React Imports
import { useContext, useState } from 'react'

// ** Third Party Components

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import ChatContext from '../../../context/ChatProvider'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import ThemeCutomizer from './ThemeCutomizer'
import ProfileInfo from '../profile'


const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  left: 0,
  top: '85%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.primary.main,
  borderTopRightRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const Customizer = () => {

  const { drawerOpen, setDrawerOpen, showThemeComponent,
    setShowThemeComponent } = useContext<any>(ChatContext)
  const handleDrawer = () => {
    setDrawerOpen(true)
    setShowThemeComponent(true)
  }

  // ** Vars
  // const {
  //   mode,
  //   skin,
  //   appBar,
  //   footer,
  //   layout,
  //   navHidden,
  //   direction,
  //   appBarBlur,
  //   themeColor,
  //   navCollapsed,
  //   contentWidth,
  //   verticalNavToggleType
  // } = settings



  return (
    <div className='customizer'>
      <Toggler className='customizer-toggler' onClick={() => handleDrawer()}>
        <CogOutline sx={{ height: 20, width: 20, color: 'common.white' }} />
      </Toggler>

      <Drawer open={drawerOpen} hideBackdrop anchor='right' variant='persistent'>
        {
          showThemeComponent ?
            <ThemeCutomizer />
            : <ProfileInfo />
        }
      </Drawer>
    </div>
  )
}

export default Customizer
