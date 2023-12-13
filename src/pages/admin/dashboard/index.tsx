import React, { useState, useEffect } from 'react'

import { Grid, Card, CardContent, Typography, CardHeader, Box, DialogTitle, IconButton } from '@mui/material'
import OrganisationIcon from 'src/assets/Images/Icons/light/organisation_1.png'
import userIcon from 'src/assets/Images/Icons/light/user_1.svg'
import CardBackground from 'src/assets/Images/cardbackground.png'
import { API_PATHS } from 'src/config/api.config'
import TicketListDashboard from './TicketListDashboard'
import welcomeDashboardImage from 'src/assets/Images/Icons/light/Welcome_dashboard_Image.svg'
import { USER_ROLE } from 'src/config/api.config'
import {Helmet} from "react-helmet";


//import { CSSTransition } from 'react-transition-group';

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

// import TagUser from '../../../assets/Images/Icons/light/tag-user.png'

import {/*  forwardRef, */ Fragment /* , ReactElement, Ref */ } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

//import Slide, { SlideProps } from '@mui/material/Slide'
import DialogContentText from '@mui/material/DialogContentText'
import { Close } from 'mdi-material-ui'

//import { toast } from 'react-toastify'


const Dashboard = () => {
  const [allData, setAllData] = useState<Array<any>>([])
  const [totalCount, setTotalCount] = useState<any>([])
  const [page, setPage] = useState(1)
  const ListInnerRef = React.useRef<any>()
  const [record] = useState<any>(5)
  const user = JSON.parse(localStorage.getItem('userData') || '{}')
  const totalCountAgent = totalCount.totalUsers + totalCount.totalAgents
  const [isFirstTime, setIsFirstTime] = useState(0)

  //Fetch All Count
  const fetchAllAdminCount = async () => {
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.dashboard}`)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    if (response.status === 200) {
      const result = await response.json()
      setTotalCount(result.payload.data)
      setIsFirstTime(result.payload.setting?.isFirstTime)
     
    }
  }

  // ticket listing api call

  const fetchAllTicketsData = async () => {
    if (user.data.userRole[0] != 1) {
      const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/?pageNumber=${page}&recordsPerPage=${record}`)
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${UserData.token}`
        }
      })
      if (response.status === 200) {
        const result = await response.json()
        setAllData(olddata => {
          return [...olddata, ...result.payload.data]
        })
      }
    }
  }

  // scrolling through get height
  const handleScroll = () => {
   
    if (ListInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = ListInnerRef.current
      if (scrollTop + clientHeight > scrollHeight - 1) {
        
        setPage(page + 1)
      }
    }
  }

  useEffect(() => {
    fetchAllTicketsData()
    fetchAllAdminCount()
  }, [page])

 // Open Dialog box for demo video

 const [open, setOpen] = useState<boolean>(true)
 const [openVideo, setOpenVideo] = useState<boolean>(false)
 const handleClose = () => {setOpen(false), setOpenVideo(true)}
 const handleCloseVideo = () => { setOpenVideo(false)}


  return (
    <>
    <Helmet>
        <title>Dashboard - Gogtas</title>
        <meta name="description" content="Dashboard" />
    </Helmet>
    
     { user.data.userRole[0] != parseInt(USER_ROLE.SUPPER_ADMIN) ?
    
    isFirstTime === 1 ?
    <>
    <Fragment >
        <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
        className='slide-right'
        maxWidth='md'
        
        
      >
        <DialogTitle onClick={handleClose} id='alert-dialog-title'>
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
              <h2 style={{textAlign:'center'}}>Welcome We have sent you an email with login credentials</h2>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Fragment>
    </>
    : ''
    :''}
    
     { user.data.userRole[0] != parseInt(USER_ROLE.SUPPER_ADMIN) ?
    
    isFirstTime === 1 ?
    <>
    <Fragment >
        <Dialog
        open={openVideo}
        keepMounted
        onClose={handleCloseVideo}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
        className='slide-right'
        maxWidth='md'
        fullWidth
        
      >
        <DialogTitle onClick={handleCloseVideo} id='alert-dialog-title' sx={{padding:0,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{marginTop:'15px',paddingLeft:'20px',fontWeight:'700'}}>Gogtas-Add User and Agent Help Video</h3>
        <IconButton
          size='small'
          sx={{right:0,marginRight:'20px'}}

         // sx={{ position: 'absolute', right: '0.5rem', top: '0.3rem' }}
        >
          <Close />
        </IconButton>
        </DialogTitle>
       <DialogContent >
          <DialogContentText id='alert-dialog-slide-description'  className="iframe-container">
          <iframe src="https://www.youtube.com/embed/7IAUQkQL4-g"  ></iframe>

          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Fragment>
    </>
    : ''
    :''} 

  
  
 
    <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2,
          md: 5
        }}
        md={9}
      >
        <Grid item xs={4} md={4}>
          <Card
            sx={{
              padding: '3',
              backgroundColor: '#307FF4',
              height: { xs: '160px', sm: '230px', md: '280.95px' },
              color: '#FFFFFF',
              position: 'relative',
              backgroundImage: `url(${CardBackground})`,
              borderRadius: '17px'
            }}
          >
            <CardHeader
              sx={{ padding: { xs: '10px', sm: '15px', md: '1.25rem' } }}
              avatar={
                <Box
                  sx={{
                    padding: 3,
                    backgroundColor: '#ffffff47',
                    borderRadius: '100%',
                    width: { sm: '65.65px', md: '86.65px', xs: '47.65px' },
                    height: { sm: '65.65px', md: '86.65px', xs: '47.65px' },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ opacity: '100% !important' }}>
                    {user.data.userRole[0] === 1 ? (
                      <img alt="dashboard-img" src={OrganisationIcon} className='dashboard-img' />
                    ) : (
                      <img alt="user-img" src={userIcon} className='dashboard-img' />
                    )}
                  </Box>
                </Box>
              }
            ></CardHeader>
            <CardContent sx={{ position: 'absolute', bottom: 0 }}>
              <Typography
                sx={{
                  color: theme => theme.palette.primary.contrastText,
                  fontWeight: { xs: '500px', sm: '500px', md: '600px' },
                  fontSize: { xs: '27px', md: '50px', sm: '35px' },
                  fontFamily: 'Mazzard'
                }}
              >
                {user.data.userRole[0] === 1
                  ? totalCount.totalOrganization > 0
                    ? totalCount.totalOrganization
                    : 0
                  : totalCount.totalUsers > 0
                    ? totalCount.totalUsers
                    : 0}
              </Typography>
              <Typography
                sx={{
                  color: theme => theme.palette.primary.contrastText,
                  fontSize: { xs: '12px', sm: '20px', md: '22px' },
                  fontFamily: 'Mazzard',
                  fontWeight: '500'
                }}
              >
                {user.data.userRole[0] === 1 ? 'Organization' : 'User'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4} md={4}>
          <Card
            sx={{
              backgroundColor: '#FF3D88',
              height: { xs: '160px', sm: '230px', md: '280.95px' },
              color: '#FFFFFF',
              position: 'relative',
              backgroundImage: `url(${CardBackground})`,
              borderRadius: '17px'
            }}
          >
            <CardHeader
              sx={{ padding: { xs: '10px', sm: '15px', md: '1.25rem' } }}
              avatar={
                <Box
                  sx={{
                    padding: 3,
                    backgroundColor: '#ffffff47',
                    borderRadius: '100%',
                    width: { sm: '65.65px', md: '86.65px', xs: '47.65px', lg: '86.65px' },
                    height: { sm: '65.65px', md: '86.65px', xs: '47.65px', lg: '86.65px' },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ opacity: '100% !important' }}>
                    <img alt="user-icon" src={userIcon} className='dashboard-img' />
                  </Box>
                </Box>
              }
            ></CardHeader>
            <CardContent sx={{ position: 'absolute', bottom: 0 }}>
              <Typography
                sx={{
                  color: theme => theme.palette.primary.contrastText,
                  fontWeight: { xs: '500px', sm: '500px', md: '600px' },
                  fontSize: { xs: '27px', md: '50px', sm: '35px' },
                  fontFamily: 'Mazzard'
                }}
              >
                {user.data.userRole[0] === 1
                  ? totalCountAgent > 0
                    ? totalCountAgent
                    : 0
                  : totalCount.totalAgents > 0
                    ? totalCount.totalAgents
                    : 0}
              </Typography>
              <Typography
                sx={{
                  color: theme => theme.palette.primary.contrastText,
                  fontSize: { xs: '12px', sm: '20px', md: '22px' },
                  fontFamily: 'Mazzard',
                  fontWeight: '500'
                }}
              >
                {user.data.userRole[0] === 1 ? 'Users and Agents' : 'Agent'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4} md={4}>
          <Card
            sx={{
              backgroundColor: '#C13DFF',
              height: { xs: '160px', sm: '230px', md: '280.95px' },
              color: '#FFFFFF',
              position: 'relative',
              backgroundImage: `url(${CardBackground})`,
              borderRadius: '17px'
            }}
          >
            <CardHeader
              sx={{ padding: { xs: '10px', sm: '15px', md: '1.25rem' } }}
              avatar={
                <Box
                  sx={{
                    padding: 3,
                    backgroundColor: '#ffffff47',
                    borderRadius: '100%',
                    width: { sm: '65.65px', md: '86.65px', xs: '47.65px' },
                    height: { sm: '65.65px', md: '86.65px', xs: '47.65px' },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ opacity: '100% !important' }}>
                    <img alt="organisation-icon" src={OrganisationIcon} className='dashboard-img' />
                  </Box>
                </Box>
              }
            ></CardHeader>
            <CardContent sx={{ position: 'absolute', bottom: 0 }}>
              <Typography
                sx={{
                  color: theme => theme.palette.primary.contrastText,
                  fontWeight: { xs: '500px', sm: '500px', md: '600px' },
                  fontSize: { xs: '27px', md: '50px', sm: '35px' },
                  fontFamily: 'Mazzard'
                }}
              >
                {totalCount.totalTickets > 0 ? totalCount.totalTickets : 0}
              </Typography>
              <Typography
                sx={{
                  color: theme => theme.palette.primary.contrastText,
                  fontSize: { xs: '12px', sm: '20px', md: '22px' },
                  fontFamily: 'Mazzard',
                  fontWeight: '500'
                }}
              >
                Assigned Tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {user.data.userRole[0] === 1 ? (
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ color: 'black', paddingLeft: '20px', fontSize: '23px', fontWeight: '600' }}>
                {user.data.userRole[0] === 1 ? 'Organization' : 'Tickets'}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ paddingLeft: '20px', fontSize: '16px', fontWeight: '500', color: '#2D4ACD' }}
              ></Typography>
            </Box>
          </Grid>
        ) : (
          <>
            {/* TICKETS CONTAINER */}

            <Grid container spacing={5} sx={{ mt: 5 }}>
              <Grid
                item
                xs={12}
                md={12}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography sx={{ color: 'black', paddingLeft: '20px', fontSize: '23px', fontWeight: '600' }}>
                    Tickets
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{ paddingLeft: '20px', fontSize: '16px', fontWeight: '500', color: '#2D4ACD' }}
                  ></Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                sx={{ mt: 5, height: 'calc(100vh - 70px)', overflowY: 'auto', backgrond: 'red' }}
                ref={ListInnerRef}
                onScroll={handleScroll}
              >
                {allData.length <= 0 ? (
                  <Typography sx={{ marginLeft: '30px' }}>Tickets not available</Typography>
                ) : (
                  allData.map((item: any, id: number) => {
                    return <TicketListDashboard key={id} item={item} />
                  })
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2,
          md: 5
        }}
        md={3}
      >
        <Grid item spacing={5} sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}>
{/*           <Typography>work on progress....</Typography>
 */}        </Grid>
      </Grid>
      {/* end ticket conatiner */}
    </Grid>
    </>
  )
}
export default Dashboard
