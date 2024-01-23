import React, { useState, useEffect } from 'react'

// useRef
import ActiveSupport from './ActiveSupport'

// import mui
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import {
  Box,
  Grid,
  Button,

  //IconButton,
  DialogActions,
  Dialog,
  DialogContent,
  TextField,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputBase,
  InputAdornment,

} from '@mui/material'

// images import
import UserImage from '../../../../assets/Images/user_Icons/light/user_img.png'
import AddTicket1 from '../../../../assets/Images/user_Icons/light/add-circle1.svg'
import FileUpload from '../../../../assets/Images/user_Icons/light/file_upload.svg'
import { API_PATHS } from '../../../../config/api.config'
import Close from 'mdi-material-ui/Close'
import Search from '../../../../assets/Images/user_Icons/light/search-normal.svg'


//env file
const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const API_VERSION = import.meta.env.VITE_APP_API_VERSION


//react -router dom import
import { Link, useNavigate } from 'react-router-dom'
import TicketContext from '../../../../context/TicketProvider'
import ChatContext from '../../../../context/ChatProvider'
import { socket } from '../../../../views/apps/chat/chatContent/SocketConnection'
import { useSettings } from '../../../../@core/hooks/useSettings'

const SidebarLeft = () => {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { setAgent, updateuserProfile, setFilterData } = React.useContext<any>(TicketContext)
  const [userData, setUserData] = useState<any>()
  const { getUserImg, setGetUserImg, handleUserUpdate, setdisplayChatUi } = React.useContext<any>(ChatContext)
  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const userId = user.data.userId
  const { settings } = useSettings()
  const { mode } = settings


  const toggleNewCategoryModal = () => {
    setOpen(true)
  }
  const closeNewCategoryModal = () => {
    setOpen(false)
  }
  const Input = styled('input')({
    display: 'none'
  })

  const handleLogout = () => {
    socket.on("disconnecting", (reason: any) => {
      console.log(reason + "disconnecting");
    });
    setAgent()
    setdisplayChatUi(false)
    setFilterData([])
    localStorage.removeItem('user1Data')
    navigate('/userlogin', { replace: true })
    socket.on("disconnect", (reason: any) => {
      console.log(reason + "connect");
    });
    socket.disconnect();

  }

  // const handleGetUserDetails = async () => {
  //   const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/detail?userId=${userId}`)
  //   const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  //   try {
  //     const response = await fetch(url.toString(), {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //         Authorization: `Bearer ${user.token}`
  //       }
  //     })
  //     const result = await response.json()

  //     if (result.status == 200) {
  //       const data = result.payload.data
  //       setUserData(data)

  //       setGetUserImg(data.profilePicture)
  //     } else {
  //       console.log(result.message)
  //     }
  //   } catch (ex: any) { }
  // }
  // useEffect(() => {
  //   handleGetUserDetails()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [updateuserProfile])



  return (
    <>
      <Box
        sx={{
          width: '32%',
          alignItems: 'start',
          borderRight: '1px solid #e5e5e5',
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Grid
          container
          justifyContent={'space-between'}
          sx={{
            padding: { lg: '13.7px 13.7px 0px 13.7px', md: '13.7px 13.7px 14.7px 10.35px' },
            alignItems: 'center'

          }}
        >
          <Grid item sx={{ width: '100%' }}>
            <Grid container sx={{ alignItems: 'center' }}>
              {/* <Grid item sx={{ mr: { lg: '20px', md: '15px' } }}>
                <MuiAvatar
                  src={getUserImg ? getUserImg : UserImage}
                  alt='jeenal'
                  className='chatwise-userimg'
                  onClick={handleUserUpdate}
                  sx={{
                    width: { lg: '56.41px', md: '40px' },
                    height: { lg: '56.41px', md: '40px' },
                    cursor: 'pointer'
                  }}
                />
              </Grid> */}
              <Typography
                sx={{
                  fontWeight: '500',
                  fontFamily: 'Mazzard',
                  textTransform: 'capitalize',
                  fontSize: '24px',
                  lineHeight: '32.74px',
                  color: mode === 'dark' ? '#ffffff' : '#1B0B2B',
                  ml: 2
                }}
              >
                {/* <Tooltip title={userData ? `${userData.fname} ${userData.lname}` : ''}>
                    <Typography sx={{ fontFamily: 'Mazzard', fontWeight: '500', color: '#444', fontSize: '16px' }}>
                      {userData ? (
                        <>
                          {`${userData.fname} ${userData.lname}`.length > 15
                            ? `${`${userData.fname} ${userData.lname}`.substring(0, 15)}...`
                            : `${`${userData.fname} ${userData.lname}`}`}
                        </>
                      ) : (
                        'Loading...'
                      )}
                    </Typography>
                      </Tooltip> */}
                Message
              </Typography>
              {/* <FormControl sx={{ width: '100%', mt: '7px', px: '5px' }} fullWidth>
                <InputBase
                  sx={{ maxWidth: '100%', p: 1.5, border: '1px solid lightgray', borderRadius: '50px', background: '#fff !important', color: '#323A69' }}
                  placeholder='Search for chats...'
                  name="search"
                  fullWidth
                  // onChange={optimisedVersion}
                  className="slide-right-search"
                  startAdornment={
                    <InputAdornment sx={{ mr: 2, ml: 1 }} position='start'>
                      <img src={Search} alt='search-img' style={{ width: '19px', height: '19px' }} />
                    </InputAdornment>
                  }
                // endAdornment={
                //   <InputAdornment sx={{ mr: 3, cursor: 'pointer' }} position='start'>
                //     <Close fontSize='small' />
                //   </InputAdornment>
                // }
                // onClick={handleHideInputField}

                />
              </FormControl> */}

              {/* <Grid item sx={{ marginLeft: 'auto' }}>
                <IconButton
                  size='small'
                  sx={{
                    color: 'text.secondary', paddingRight: '12px', marginRight: '5px', display: { sm: 'block', xs: 'block', md: 'block' },
                    '&:hover': {
                      backgroundColor: '#fff'
                    }
                  }}
                  onClick={navigateDashboard}

                >
                  <img src={homeImg} alt="Dashboard" />
                </IconButton>

              </Grid> */}
            </Grid>
          </Grid>

          {/*   <Grid item>
            <IconButton size='small' sx={{ color: 'text.secondary' }}>
              <img src={Notification} alt='notificationicon' className='notification-img' />
            </IconButton>
          </Grid> */}
        </Grid>

        {/* start create ticket button component  */}


        <ActiveSupport />
        {/* knowledge base div end */}
        <div style={{ width: '90%', margin: '19px auto', marginBottom: '0', display: 'none' }}>
          <Button
            onClick={toggleNewCategoryModal}
            endIcon={<img src={AddTicket1} alt='addticket' style={{ width: '20px', height: '20px' }} />}
            sx={{
              fontFamily: 'Mazzard',
              fontWeight: '500',
              width: '100%',
              justifyContent: 'space-between',
              p: '17px 22px',
              borderRadius: '12px',
              textTransform: 'capitalize',
              backgroundColor: 'rgba(45, 74, 205, 0.1);',
              border: '0.6px dashed rgba(45, 74, 205, 0.8)',
              fontSize: '16px',
              color: '#2D4ACD'
            }}
          >
            add room
          </Button>
        </div>

        {/* {/ start chatting design /} */}
        <Box sx={{ height: 'calc(66vh - 255px)', overflowY: 'auto', display: 'none' }}>
          {[1, 2, 3, 4].map(item => (
            <ListItem sx={{ borderBottom: ' 1px solid #e5e5e5', paddingBottom: '0' }} key={item}>
              <ListItemButton
                disableRipple
                sx={{
                  p: '15px 4px',
                  width: '100%',
                  borderRadius: 1,
                  alignItems: 'flex-start'
                }}
              >
                <ListItemAvatar sx={{ m: 0 }}>
                  <MuiAvatar
                    src={UserImage}
                    alt='jeenal'
                    sx={{
                      width: 45,
                      height: 45
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    my: 0,
                    ml: 4,
                    mr: 1.5,
                    fontSize: '1rem'
                  }}
                  primary={
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'rgba(27, 11, 43, 0.8)',
                        textTransform: 'capitalize',
                        lineHeight: '25.39px'
                      }}
                    >
                      Excepteur sint
                    </Typography>
                  }
                  secondary={
                    <Typography
                      noWrap
                      variant='body2'
                      sx={{
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: 'rgba(33, 16, 50, 0.44)',
                        fontFamily: 'Mazzard'
                      }}
                    >
                      Hii there!!
                    </Typography>
                  }
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{
                      fontFamily: 'Mazzard',
                      whiteSpace: 'nowrap',
                      color: 'rgba(27, 11, 43, 0.67)',
                      fontSize: ' 11px',
                      fontWeight: '400px',
                      lineHeight: '17.46px'
                    }}
                  >
                    12:00
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </Box>

        {/* {/ dialogue /} */}
        <Box>
          <Dialog
            fullWidth
            open={open}
            maxWidth='xs'
            scroll='body'
            onClose={closeNewCategoryModal}
            onBackdropClick={closeNewCategoryModal}
            className='new-category-modal'
          >
            <DialogContent sx={{ position: 'relative', padding: '35px 35px' }}>
              <Box sx={{ textAlign: '' }}>
                <label htmlFor='contained-button-file'>
                  <Input accept='image/*' id='contained-button-file' multiple type='file' />
                  <Button
                    component='span'
                    sx={{
                      fontFamily: 'Mazzard',
                      fontWeight: '600',
                      width: '100%',
                      p: '23px 5px',
                      borderRadius: '9px',
                      textTransform: 'capitalize',
                      backgroundColor: 'rgba(224, 228, 248, 0.61)',
                      border: ' 0.77013px dashed rgba(45, 74, 205, 0.29)',
                      fontSize: '19px',
                      color: '#2A3A51',
                      marginBottom: '16px',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={FileUpload}
                      alt='file upload'
                      style={{ width: '26px', height: '26px', marginRight: '10px' }}
                    />{' '}
                    New Category
                  </Button>
                </label>

                <Grid item sm={12}>
                  <FormControl fullWidth sx={{ marginTop: '12px' }}>
                    <InputLabel htmlFor='name'>Folder Name</InputLabel>
                    <OutlinedInput
                      autoFocus
                      label='Folder Name'
                      id='date'
                      value=''
                      placeholder='Enter Folder Name'
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={12} sx={{ marginTop: '25px' }}>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    id='textarea-outlined'
                    placeholder='Discription'
                    label='Discription'
                  />
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: '35px' }, justifyContent: 'center' }}>
              <Button
                variant='outlined'
                sx={{
                  mr: 1,
                  fontSize: '16px',
                  borderRadius: '13px',
                  filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                  textTransform: ' capitalize'
                }}
                onClick={closeNewCategoryModal}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                sx={{
                  mr: 1,
                  fontSize: '16px',
                  boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)',
                  textTransform: ' capitalize',
                  borderRadius: '13px'
                }}
                onClick={closeNewCategoryModal}
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        {/* {/ end dialogue /} */}

      </Box >
    </>
  )
}

export default SidebarLeft
