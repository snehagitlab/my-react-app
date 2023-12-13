// ** React Imports
import React,{ useState, Fragment, useEffect } from 'react'

// ** Next Import
import { useNavigate as useRouter } from 'react-router-dom'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

//import {   DialogTitle, Grid, IconButton, Tooltip } from '@mui/material'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { API_PATHS } from 'src/config/api.config'
import UserImage from 'src/assets/Images/user_Icons/light/user_img.png'
import OrganisationContext from 'src/context/OrganisationProvider'
import { useNavigate } from 'react-router-dom'

//import { Button } from '@mui/material'
import { USER_ROLE } from 'src/config/api.config'

// ** MUI Imports
//import Dialog from '@mui/material/Dialog'

//import DialogContent from '@mui/material/DialogContent'

//import Slide, { SlideProps } from '@mui/material/Slide'
//import DialogContentText from '@mui/material/DialogContentText'
//import { Close } from 'mdi-material-ui'
//import welcomeDashboardImage from 'src/assets/Images/Icons/light/Welcome_dashboard_Image.svg'
//import { toast } from 'react-toastify'

//import Badge from '@mui/material/Badge';


interface Props {
  settings: Settings
}

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props


  const user: any = JSON.parse(localStorage.getItem('userData') || '{}')
  const { getupdateadmin} = React.useContext<any>(OrganisationContext)
  const navigate = useNavigate()

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
 
 // const [freeTrialCount, setFreeTrialCount] = useState(0)


  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }
  
  const [userId, setUserId] = useState(0)

  const [userRole, setUserRole] = useState(0)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    setUserId(user.data.userId)

   setUserRole(user.data.userRole[0])
   handleGetUserDetails()

  

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [userId,getupdateadmin])

  //Change First name last name and profile picture

  const [userData, setUserData] = useState<any>()
  const [getUserImg, setGetUserImg] = useState<any>()

  const handleGetUserDetails = async () => {
    if(userId > 0) {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/detail?userId=${userId}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
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

        //handleGetFreeTrailCountOrg()
      } else {
        console.log(result.message)
      }
    } catch (ex: any) { }
  }
}

//open upgrade dialog
/* const [openUpgrade, setOpenUpgrade] = useState<boolean>(false)

const handleUpgradeDialog = () => {
  setOpenUpgrade(true)
}
const handleCloseDialog = () => { setOpenUpgrade(false)}

const handleUpgradeOrg = async() => {
  const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}/${API_PATHS.planUpgrade}`)
  const user = JSON.parse(localStorage.getItem('userData') || '{}')
  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })
    const result = await response.json()
    if (result.status == 200) {
      toast.success(result.message)
      handleCloseDialog()
    } else {
      console.log(result.message)
    }
  } catch (ex: any) { console.log(ex) }
} */

//License Count 
/* const handleGetFreeTrailCountOrg = async () => {
  if(userRole === parseInt(USER_ROLE.ORG_ADMIN)){
  if(userId > 0) {
  const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}/${API_PATHS.license}/detail`)
  const user = JSON.parse(localStorage.getItem('userData') || '{}')
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
      const data = result.payload.trialPeriodLeft
      setFreeTrialCount(data)
      } else {
      console.log(result.message)
    }
  } catch (ex: any) { }
}
}
} */

const handlenavigate = () =>
{
  userRole === parseInt(USER_ROLE.ORG_ADMIN) ?
  navigate('/setting/account_settings') :' '
}

  return (
    <>
    <Fragment>
      <Stack direction='row' spacing={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       
         {/*  {userRole === parseInt(USER_ROLE.ORG_ADMIN) ?
          <>
           <Tooltip title={`${freeTrialCount} days remaining of free trial`}>

           <Button
             className='upgradeButtonCircle'
             variant='contained'
           >
            { freeTrialCount ? freeTrialCount : 0 } 
           </Button>
           </Tooltip>
          <Button
          size='large'
          sx={{ mr: 2, textTransform: 'capitalize',backgroundColor:'#FE5452',color: 'white',boxShadow:'#FE5452 10px 6px 20px -8px' ,ml:3}}
          className='upgradeButton'
          onClick={handleUpgradeDialog}
          >
          Upgrade Now
          </Button>
          </>
          :''} */}

          <Box sx={{ borderLeft: theme => `1px solid ${theme.palette.secondary.light}`, height: '50px', mr: 3 ,ml:2}}></Box>
          <Box sx={{ mr: 3 }}>
            <Avatar alt='John Doe' src={getUserImg ? `${getUserImg}` : UserImage} sx={{ width: '2.5rem', height: '2.5rem', cursor:userRole === parseInt(USER_ROLE.ORG_ADMIN) ? 'pointer': '' }} onClick={handlenavigate} />
          </Box>
          <Box sx={{ lineHeight: '10px !important' }}>
            <Typography
              variant='subtitle2'
              sx={{
                fontSize: '17px !important',
                fontWeight: '500 !important',
                padding: '0px !important',
                textTransform:'capitalize'
              }}
            >
            {userData ? `${userData.fname} ${userData.lname}` : ''}
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                fontSize: '14px !important',
                fontWeight: '400 !important',
                padding: '0px !important'
              }}
            >
              {userData ? userData.email  : ' '}
            </Typography>
          </Box>
        </Box>
      </Stack>

      <Divider />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Stack direction='row' spacing={4}>
              <Box>
                <Avatar alt='John Doe' src={user.data?.profilePicture} sx={{ width: '2.5rem', height: '2.5rem' }} />
              </Box>
              <Box>
                <Typography variant='body2'>
                  {user.data.fname} {user.data.lname}
                </Typography>
                <Typography variant='caption'>{user.data.email}</Typography>
              </Box>
            </Stack>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>John Doe</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                Admin
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mt: 0, mb: 1, width: '100%' }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/user/view/12')}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/email')}>
          <Box sx={styles}>
            <EmailOutline sx={{ marginRight: 2 }} />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/chat')}>
          <Box sx={styles}>
            <MessageOutline sx={{ marginRight: 2 }} />
            Chat
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/account-settings')}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/pricing')}>
          <Box sx={styles}>
            <CurrencyUsd sx={{ marginRight: 2 }} />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/faq')}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ marginRight: 2 }} />
            FAQ
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
    <Fragment >

   {/*  <Dialog
    open={openUpgrade}
    keepMounted
    onClose={handleCloseDialog}
    aria-labelledby='alert-dialog-slide-title'
    aria-describedby='alert-dialog-slide-description'
    className='slide-right'
    maxWidth='md'
    
  >
    <DialogTitle onClick={handleCloseDialog} id='alert-dialog-title' sx={{padding:0,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <IconButton
      size='small'
     

      sx={{ position: 'absolute', right: '0.5rem', top: '0.3rem' }}
    >
      <Close />
    </IconButton>
    </DialogTitle>
    <DialogContent sx={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
       <img src={welcomeDashboardImage} style={{margin:'10px'}}/>
          <DialogContentText id='alert-dialog-slide-description'  sx={{maxWidth:'600px'}}>
              <h2 style={{textAlign:'center'}}>Are you looking for account upgrade?</h2>
          </DialogContentText>
          <Grid sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          <Button
            variant='contained'
            size='large'
            onClick={handleUpgradeOrg}
            sx={{ textTransform: 'capitalize' }}
          >
           Yes
          </Button>
          <Button  variant='outlined'
            size='large'
            onClick={handleCloseDialog} 
            sx={{ textTransform: 'capitalize' ,ml:2}} >No</Button>
            </Grid>
        </DialogContent>
  </Dialog> */}

    </Fragment>
    </>
  )
}

export default UserDropdown
