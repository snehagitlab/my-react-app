import React, { useEffect, useState } from 'react'

//import mui
import { Grid, Typography, Box, Avatar, /* IconButton */ Button } from '@mui/material'

//import image
//import Notification from '../../../../assets/Images/user_Icons/light/notification.svg'

import UserImage from '../../../../assets/Images/user_Icons/light/user_img.png'


//import react-router-dom
import { useNavigate } from 'react-router-dom'
import { API_PATHS } from 'src/config/api.config'
import TicketContext from 'src/context/TicketProvider'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

function KnowledgeHeader() {
  const navigate = useNavigate()

  const [userId, setUserId] = useState(0)
  const [userData, setUserData] = useState<any>()
  const [getUserImg, setGetUserImg] = useState<any>()
  const { setFilterData } = React.useContext<any>(TicketContext)


  useEffect(() => {
     const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
    setUserId(user.data.userId)
    handleGetUserDetails()

   

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleGetUserDetails = async () => {
    if(userId > 0) {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/detail?userId=${userId}`)
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
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
        const data = result.payload.data
        setUserData(data)
        setGetUserImg(data.profilePicture)
      } else {
        console.log(result.message)
      }
    } catch (ex: any) { }
  }
  }


  const handleLogout = () => {
    navigate('/userlogin', { replace: true })
    setFilterData([])
    window.location.reload()
    localStorage.removeItem('user1Data')
  }

  return (
    <Grid>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '22%', display: 'flex', borderRight: '1px solid #e5e5e5' }}>
          <Grid
            container
            justifyContent={'space-between'}
            sx={{ padding: '13.7px 13.7px 13.7px 28.35px', borderBottom: ' 1px solid #e5e5e5' }}
          >
            <Grid item>
              <Grid container>
                <Grid item sx={{ mr: '20px' }}>
                <Avatar src={getUserImg ? `${getUserImg}` : UserImage} alt='Profile Image' sx={{ width: '56.41px', height: '57.24px' }} />
                </Grid>
                <Grid item>
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard',
                      fontWeight: '500',
                      fontSize: '20px',
                      color: '#1B0B2B',
                      lineHeight: '31.74px'
                    }}
                  >
                    {userData ? `${userData.fname} ${userData.lname}` : ''}
                  </Typography>
                  <Button
                    onClick={handleLogout}
                    size='small'
                    sx={{
                      fontFamily: 'Mazzard',
                      color: '#2D4ACD',
                      fontSize: '13px',
                      padding: '0rem',
                      textTransform: 'capitalize',
                      fontWeight: '500',
                      minWidth: '0'
                    }}
                  >
                    log out
                  </Button>
                </Grid>
              </Grid>
            </Grid>

          {/*   <Grid item>
              <IconButton size='small' sx={{ color: 'text.secondary' }}>
                <img src={Notification} alt='notificationicon' />
              </IconButton>
            </Grid> */}

          </Grid>
        </Box>
        <Box sx={{ width: '78%', borderBottom: '1px solid #e5e5e5' }}>
          <Grid container justifyContent={'space-between'} alignItems={'center'} sx={{ p: '20px' }}>
            <Grid item>
              <Typography
                sx={{
                  fontWeight: '600',
                  color: '#2A3A51',
                  fontSize: '24px',
                  fontFamily: 'Mazzard-regular'
                }}
              >
                {'Knowledge Base'}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container justifyContent={'end'} alignItems={'center'}>
                {/* <Grid item>
                    <InputBase
                      size='small'
                      className='searchticket-input'
                      name='search'
                      sx={{
                        background: 'white',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: 'rgba(42, 58, 81)',
                        padding: '12px 14px',
                        border: '1px solid #DCDCDC',
                        marginRight: '20px'
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
          </Grid>
        </Box>
      </Box>
    </Grid>
  )
}

export default KnowledgeHeader
