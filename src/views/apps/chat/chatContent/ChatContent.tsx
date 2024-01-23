import React, { useEffect } from 'react'

// **  Imports mui
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'

// ** Custom Components Import
import MuiAvatar from '../../../../@core/components/mui/avatar'

//import context
import TicketContext from '../../../../context/TicketProvider'

//import ChatContext from '../context/ChatProvider'
import { socket } from '../../../../views/apps/chat/chatContent/SocketConnection'
import { DefaultProfilePic } from '../../../../views/apps/chat/chatContent/defaultProfilePic'

function ChatContent() {
  const { agent } = React.useContext<any>(TicketContext)
  const [response, setresponse] = React.useState<any>()
  useEffect(() => {

    socket.on("connection", (socket: any) => {
      setresponse(socket)
    });
  }, []);
  useEffect(() => {
    if (response?.isOnline == 1 || response?.isOnline == 0) {
      agent.isOnline == response?.isOnline
      if (agent.userId == response?.userId) {
        agent.isOnline == response?.isOnline

      }
    }

  }, [response])


  /* const handleClick = () => {
    setShowActiveSupport(true)
  } */


  return (
    <Box
      sx={{
        padding: '13.7px 13.7px 14.7px 13.7px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: { sm: 'none', xs: 'none', md: 'none' },
        borderBottomLeftRadius: '-30px',
        // borderBottomRightRadius: '30px',
        backgroundColor: '#fff',


      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiAvatar
            src={agent != undefined && agent.profilePic != '' ? "https://semilynx.gogtas.com/static/media/user_img.d3c64685c1df07b335a7.png" : "https://semilynx.gogtas.com/static/media/user_img.d3c64685c1df07b335a7.png"}
            alt={agent && agent.fname}
            sx={{ width: { xs: '46px', md: '45px' }, height: { xs: '46px', md: '45px' } }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '12px' }}>
            <Typography
              sx={{
                fontWeight: '500',
                fontSize: { xs: '16px', sm: '17px', md: '18px' },
                color: '#1B0B2B',
                lineHeight: '31.74px',
                fontFamily: 'Mazzard',
                textTransform: 'capitalize'
              }}
            >
              {agent && agent.fname}&nbsp;{agent && agent.lname}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(33, 16, 50, 0.44)',
                fontSize: { xs: '10px', sm: '12px', md: '15px' },
                lineHeight: '14px',

                fontWeight: '400',
                fontFamily: 'Mazzard'
              }}
            >
              <Badge
                overlap='circular'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                sx={{ ml: '5px', mr: '10px', zIndex: '0' }}
                badgeContent={
                  <Box
                    component='span'
                    sx={{
                      width: { xs: '8px', md: '10px' },
                      height: '10px',
                      borderRadius: '50%',
                      color: 'red',
                      border: '1px solid rgba(255, 255, 255, 0.74)',
                      backgroundColor: agent?.isOnline == 0 ? '#A0A0A0' : '#0ea70e'
                    }}
                  />
                }
              ></Badge>
              {agent?.isOnline == 0 ? 'Offline' : 'Active now'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatContent
