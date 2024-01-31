import React, { useState, useEffect } from 'react'

// **  Imports mui
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Divider, List, ListItem, ListItemText, Drawer, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

// toast popup
// import { ToastContainer, toast } from 'react-toastify'

// import images

import UserImage from '../../../../assets/Images/user_Icons/light/user_img.png'
import RightArrow from '../../../../assets/Images/user_Icons/light/rightArrow.svg'
import Toggle from '../../../../assets/Images/user_Icons/light/toggle.png'

// ** Custom Components Import
import MuiAvatar from '../../../../@core/components/mui/avatar'

// import chatlog

import ChatLog from '../../../../@core/components/chat-log'
import ChatContent from './ChatContent'

//import UserDashboard from '../dashboard/UserDashboard'
import ResponsiveToggle from '../../../../assets/Images/user_Icons/light/Responsive Toggle.png'
import ChatContext from '../../../../context/ChatProvider'
import TicketContext from '../../../../context/TicketProvider'
import ActiveSupport from '../sidebarLeft/ActiveSupport'
import UserDashboard from '../dashboard/UserDashboard'
import StickySlider from '../stickySlider/StickySlider'
import { useSettings } from '../../../../@core/hooks/useSettings'

// import CreateTicketBtn from '../sidebarLeft/CreateTicketBtn'

const ChatContentIndex = () => {

  const navigate = useNavigate()
  const { setShowActiveSupport, showActiveSupport, getUserImg, handleUserUpdate, displayChat, collapsed, setCollapsed, toggled, setToggled } = React.useContext<any>(ChatContext)
  const { showopenTicket } = React.useContext<any>(TicketContext)

  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  }, [])

  const RenderContent = () => {
    const [open, setOpen] = useState(false)

    const toggleSlider = () => {
      //  setOpen(!open)
      setCollapsed(!collapsed)
      setToggled(!toggled)
    }

    const handleLogout = () => {
      navigate('/userlogin')
      localStorage.removeItem('user1Data')
    }

    const handleShowActiveSupport = () => {
      setShowActiveSupport(true)
      toggleSlider()
    }

    // const handleShowOpenTicket = () => {
    //   setShowopenTicket(true)
    //   setShowActiveSupport(false)
    //   toggleSlider()
    // }

    const { settings } = useSettings()
    const { mode } = settings

    //Responsive sidebar
    const sideList = () => (
      <Box
        sx={{
          width: '70vw',
          background: '#FFFFFF',
          height: '100%',
          display: { xs: 'block', md: 'none', sm: 'block' }
        }}
      >
        <Grid item>
          <Grid
            container
            sx={{ padding: { xs: '15px', sm: '20px' }, display: 'flex', justifyContent: 'space-between' }}
          >
            <Grid sx={{ display: 'flex' }}>
              <Grid item sx={{ mr: '20px' }}>
                <MuiAvatar
                  onClick={() => {
                    handleUserUpdate(), setOpen(false)
                  }}
                  src={getUserImg ? getUserImg : UserImage}
                  alt='jeenal'
                  sx={{ width: '56.41px', height: '57.24px' }}
                />
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '500',
                    fontSize: '20px',
                    lineHeight: '31.74px',
                    color: '#1B0B2B'
                  }}
                >
                  Alex Dvekar
                </Typography>
                <Button
                  onClick={handleLogout}
                  size='small'
                  sx={{
                    fontFamily: 'Mazzard',
                    color: '#2D4ACD',
                    fontSize: '13px',
                    padding: 0,
                    textTransform: 'capitalize',
                    fontWeight: '500',
                    minWidth: '0'
                  }}
                >
                  log out
                </Button>
              </Grid>
            </Grid>
            <Grid>
              <img alt="responsive-toggle" style={{ height: '46.27px' }} src={ResponsiveToggle} onClick={toggleSlider} />
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ margin: 0 }} />
        <StickySlider />
        <List sx={{ paddingTop: 0 }}>
          {/* <ListItem sx={{ padding: { xs: '20px 16px', sm: '27px 23px' } }} onClick={handleShowActiveSupport}>
            <ListItemText className='responsive-toggle' primary='Active Support' />
            <IconButton size='small' sx={{ color: 'text.secondary' }}>
              <img src={RightArrow} alt='rightArrow' style={{ width: '33px', height: '33px' }} />
            </IconButton>
          </ListItem>
          <Divider sx={{ margin: 0 }} /> */}

          {/* <ListItem sx={{ padding: { xs: '20px 16px', sm: '27px 23px' } }}>
            <ListItemText className='responsive-toggle' primary='Add Room' />
            <IconButton size='small' sx={{ color: 'text.secondary' }}>
              <img src={RightArrow} alt='rightArrow' style={{ width: '33px', height: '33px' }} />
            </IconButton>
          </ListItem>
          <Divider sx={{ margin: 0 }} />

          <ListItem sx={{ padding: { xs: '20px 16px', sm: '27px 23px' } }} onClick={handleShowOpenTicket}>
            <ListItemText className='responsive-toggle' primary='Open Tickets' />
            <IconButton size='small' sx={{ color: 'text.secondary' }}>
              <img src={RightArrow} alt='rightArrow' style={{ width: '33px', height: '33px' }} />
            </IconButton>
          </ListItem>
          <Divider sx={{ margin: 0 }} />

          <ListItem sx={{ padding: { xs: '20px 16px', sm: '27px 23px' } }}>
            <ListItemText className='responsive-toggle' primary='Knowledge Base' />
            <IconButton size='small' sx={{ color: 'text.secondary' }}>
              <img src={RightArrow} alt='rightArrow' style={{ width: '33px', height: '33px' }} />
            </IconButton>
          </ListItem>
          <Divider sx={{ margin: 0 }} />
          <ListItem
            sx={{ padding: { xs: '20px 16px', sm: '27px 23px' } }}
            onClick={() => {
              handleSliderOpen(), setOpen(false)
            }}
          >
            <ListItemText className='responsive-toggle' primary='All Tickets' />
            <IconButton size='small' sx={{ color: 'text.secondary' }}>
              <img src={RightArrow} alt='rightArrow' style={{ width: '33px', height: '33px' }} />
            </IconButton>
          </ListItem> */}
          <Divider sx={{ margin: 0 }} />
        </List>
      </Box>
    )

    //ens responsive sidebar

    return (
      <Box
        sx={{
          // backgroundColor: '#F3F5F7',
          flexGrow: 1,
          height: '100%'
        }}
      >
        <Box sx={{ borderBottom: '1px solid lightgray', display: { sm: 'block', xs: 'block', md: 'none' } }}>
          <Grid
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 18px 15px 18px'
            }}
          >
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontWeight: '500',
                  fontFamily: 'Mazzard',
                  textTransform: 'capitalize',
                  fontSize: '19px',
                  lineHeight: '32.74px',
                  color: mode === 'dark' ? '#ffffff' : '#1B0B2B',
                  ml: 2
                }}
              >Message</Typography>
            </Grid>

            <Grid item>
              <Box>
                <img alt="toggle" src={Toggle} onClick={toggleSlider} style={{ width: '46px', height: '46px' }} />

                <Box sx={{ background: 'red', width: '50%' }}>
                  <Drawer open={open} anchor='right' onClose={toggleSlider}>
                    {sideList()}
                  </Drawer>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>


        {showActiveSupport && width < 900 ? (
          <ActiveSupport />
        ) : displayChat ?
          (
            <><ChatContent />
              <ChatLog /></>
          )
          : (<UserDashboard />)

        }

      </Box>
    )
  }

  return RenderContent()
}

export default ChatContentIndex
