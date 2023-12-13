import React, { useEffect, useState, Fragment, useCallback,useRef } from 'react'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Divider, Grid, Typography, CardActions, Avatar, MenuItem, Menu/* , Button, Modal */ } from '@mui/material'
import Popover from '@mui/material/Popover'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

//import CircularProgress from '@mui/material/CircularProgress'
//import { useTheme } from '@mui/material/styles'


//import component
import TicketContext from 'src/context/TicketProvider'

//import ChatContext from 'src/context/ChatProvider'
import CommonInputField from './CommonInputField'
import EditPopover from '../EditPopover'
import DragnDrop from './DragnDrop'

// toast popup
import { toast } from 'react-toastify'

//import react-router-dom
import { useParams, useNavigate } from 'react-router-dom'

//  Config file
import { TICKET_STATUS, TICKET_PRIORITY,SOCKET_TICKET_REFRESH } from 'src/config/api.config'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL

// import images
import Dots from '../../../../assets/Images/user_Icons/light/dots.png'
import LeftArrow from '../../../../assets/Images/user_Icons/light/LeftArrow.png'
import VidecallIcon from 'src/assets/Images/user_Icons/light/meeting-icon.png'
import file_icon from '../../../../assets/Images/user_Icons/light/file_icon.png'
import Pdf_img from '../../../../assets/Images/user_Icons/light/pdf_img.png'

import ColorEdit from '../../../../assets/Images/Icons/light/colorEdit.png'

//import deleteTicketIcon from 'src/assets/Images/Icons/light/trash_new.png'

//document display
const imagePath = 'https://storage.googleapis.com/'

//image viewer
import ImageViewer from 'react-simple-image-viewer'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Close from 'mdi-material-ui/Close'
import {DefaultProfilePic} from 'src/views/apps/chat/chatContent/defaultProfilePic'
import {Helmet} from 'react-helmet'
import { socket } from 'src/views/apps/chat/chatContent/SocketConnection'
import moment from 'moment';


//import style
const styles = {
  py: 2,
  px: 4,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'text.primary',
  textDecoration: 'none',
  '& svg': {
    fontSize: '1.375rem',
    color: 'text.secondary'
  }
}

// delete modal css
/* const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: '5px 7px 20px rgb(0 0 0 / 25%) !important',
  bgcolor: 'background.paper',
  borderRadius: '25px',
  p: 8
} */

function TicketDetails() {
  const { id } = useParams()
  
 // const theme = useTheme()
  const navigate = useNavigate()
  const {
    setGetTicketId,
    editTicket,
    setTicketData,
    ticketData,
    setOpenTicketDetails,
    commentreplay,
    setDrop,
    filterData,
    setSupportTicketId,
    handleoffenceSliderOpen,
    editoffenceticketrefresh,

   /*  setDeleteTicket,
    setDeleteTicketlisting,
    deleteTicketListing, */

    setAgentDetails
  } = React.useContext<any>(TicketContext)


  const [storeAttachment, setStoreAttachment] = React.useState<any>()
  const [touser, setTouser] = React.useState<any>([])
  const [fromuser, setFromuser] = React.useState<any>([])
  const [comments, setComments] = useState<any>([])
  const [commentCount, setCommentCount] = useState<any>()
  const ref = React.createRef()
  const storeFileAttachment = storeAttachment && JSON.parse(storeAttachment)

  //const { getUserImg } = React.useContext<any>(ChatContext)

  //const [menuItemLoading, setMenuItemLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  //image viewer state
  const [currentImage, setCurrentImage] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [viewerImg, setViewerImg] = useState<any>([])
  const [createuserId, setcreateuserId] = useState(0)

  //dlete ticket modal state
  //const [openTicket, setOpenTicket] = React.useState(false);

  //view comment images
  const [viewImg, setviewImg] = React.useState<any>(false)
  const [imgUrlpopup, setImgUrlPopup] = React.useState<any>()
  const [response, setresponse] = useState<any>()

  const messagesEndRef = useRef<any>(null)

  const handleViewImgClose = () => {
    setviewImg(false)
    setImgUrlPopup('')
  }

  const openViewImgModal = (imgUrl: any) => {
    console.log('imgUrl', imgUrl)
    setImgUrlPopup(`${imagePath}${imgUrl}`)
    setviewImg(true)
  }

 /*  const handleCloseTicket = () => {
    setOpenTicket(false)
  } */

/*   const handleOpen = () => {
    setOpenTicket(true);
  }; */

  // display Comment using socket
  useEffect(() => {
    socket.on("message", (socket: any) => {
      setresponse(socket)
    });
  }, []);

  useEffect(() => {
    if (response?.type == SOCKET_TICKET_REFRESH.COMMENT_ON_TICKET && response?.data) {
      if(id == response?.data.ticketId)
      {
        DisplayComment()
      }
     
    }
  }, [response])
  
  useEffect(() => {
    if (response?.type == SOCKET_TICKET_REFRESH.NEW_TICKET_CREATED && response?.data) {
      if(id != response?.data.ticketId)
      {
        navigate('/user/dashboard')
      }
    }
    if (response?.type == SOCKET_TICKET_REFRESH.NEW_TICKET_UPDATED && response?.data) {
      if(loggedInUserId == response?.data?.to)
      {     
        if(id == response?.data.ticketId && response?.data?.to == response?.data?.newTo)
        {
          navigate('/user/dashboard')
        }
        else
        {
          handleClick()
        }
      }
     
    }
  }, [response])

  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const loggedInUserId = user.data.userId

  //image viewer get array of images
  useEffect(() => {
    const imageData: any = []
    storeFileAttachment &&
      storeFileAttachment.length > 0 &&
      storeFileAttachment.map((item: any) => {
        imageData.push(`${imagePath}${item}`)
      })

    if (imageData.length > 0) {
      setViewerImg(imageData && imageData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketData])

  //image viewer function
  const openImageViewer = useCallback((index: any) => {
    setCurrentImage(index)
    setIsViewerOpen(true)
  }, [])

  const closeImageViewer = () => {
    setCurrentImage(0)
    setIsViewerOpen(false)
  }

  //dropdown state
  const [anchorElDrop, setAnchorElDrop] = React.useState<HTMLButtonElement | null>(null)

  // edited state
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  //import dropdown close
  const handleDropdownClose = () => {
    setAnchorElDrop(null)
  }

  //open dropdown
  const handleDropdownOpen = (event: any) => {
    setAnchorElDrop(event.currentTarget)
  }

  //for responsive
  const handleBackTicketClick = () => {
    navigate('/user/dashboard')
    setOpenTicketDetails(false)
  }


  //delete ticket api calling
/*   const handleDelete = async () => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(`${BASE_URL}/v1/ticket?ticketId=${id}`)
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    const result = await response.json()
    if (result.status === 200) {
      setAnchorElDrop(null)
      setDeleteTicket(result)
      toast.success(result.message)
      navigate("/user/dashboard/", { replace: true })

      handleCloseTicket()
      setDeleteTicketlisting(!deleteTicketListing)
       }
  } */

 

  const formatted_date = moment(ticketData.createdAt).format('DD MMM  YYYY hh:mm A');

  
  //get ticket details api calling
  const handleClick = async () => {
    setLoading(true)
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')

    const url = new URL(`${BASE_URL}/v1/ticket/detail?ticketId=${id}`)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    const result = await response.json()
    if (result.status === 200) {
      setLoading(false)
      setStoreAttachment(result.payload.attachment)
      setcreateuserId(result.payload.fromUser.userId)
      setTicketData(result.payload)
      setTouser(result.payload.toUser)
      setAgentDetails(result.payload.toUser)
      setFromuser(result.payload.fromUser)
    } else if (result.status === 412) {
      navigate('/user/dashboard')

      //toast.error(result.message)
      setLoading(false)
    } else {
      toast.error(result.message, { toastId: 'ticketFailed' })
      setLoading(false)
    }
  }

  useEffect(() => {
    handleClick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, editTicket, editoffenceticketrefresh])

  useEffect(() => {
    DisplayComment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentreplay, commentCount, id])


  //display Comment api
  const DisplayComment = async () => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')

    const url = new URL(`${BASE_URL}/v1/ticket/reply?ticketId=${id}&recordsPerPage=${commentCount}&pageNumber=1`)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    const result = await response.json()
    if (result.status === 200) {
      setCommentCount(result.pager.totalRecords)
      setComments(result.payload.data)
      if(commentCount > 4)
      {
      messagesEndRef?.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  const handlepopoveropen = async (event: React.MouseEvent<HTMLButtonElement>, myid: any) => {
    setGetTicketId(myid)
    setAnchorEl(event.currentTarget)
  }

  const handleeditClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const idpopover = open ? 'simple-popover' : undefined

  const handleDrop = () => {
    setDrop(true)
  }
  const handleSupportEditId = (id: any) => {
    setSupportTicketId(id)
    handleoffenceSliderOpen()
    handleDropdownClose()
  }


  const handleDownloadImg = (imgPath: any) => {
    window.location.href = `${imagePath}${imgPath}`
  }

  const handleFileDownload = (DocimgPath: any) => {
    window.location.href = `${imagePath}${DocimgPath}`
  }


  return (
    <>
      <Helmet>
        <title>Ticket Details - Gogtas</title>
        <meta name="description" content="Ticket Details" />
    </Helmet>
    <Box
      ref={ref}
      sx={{
        backgroundColor: '#ffffff',
        flexGrow: 1,
        height: '100%',
        width: { md: '56vw', sm: '100%', xs: '100%' },
        position: 'relative'
      }}
      onDragEnter={handleDrop}
    >

      {/* drag n drop components */}
      <DragnDrop />


      {isViewerOpen && (
        <ImageViewer
          src={viewerImg}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.9)'
          }}
        />
      )}

      {loading ? (

        /*  <Loader /> */

        <Box sx={{
          paddingLeft: '20px', alignItems: 'center', justifyContent: 'center', display: ' flex',
          marginTop: '90px'
        }}>
          <div className="loading">Loading...</div>
        </Box>
      ) : (
        <Grid sx={{ height: 'calc(100vh - 162px)', overflowY: 'auto', padding: '18px 18px 0px 18px' }}>
          <Grid item xs={12}>
            <Grid container justifyContent='space-between' spacing={5} alignItems='center'>
              <Grid item>
                <Box sx={{ display: { sm: 'block', xs: 'block', md: 'none' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size='small'
                      sx={{
                        color: 'text.secondary',
                        paddingRight: '12px',
                        display: { sm: 'block', xs: 'block', md: 'none' }
                      }}
                      onClick={handleBackTicketClick}
                    >
                      <img src={LeftArrow} alt='LeftArrow' style={{ width: '33px', height: '33px' }} />
                    </IconButton>
                    <Typography
                      variant='body2'
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '  rgba(42, 58, 81, 0.53)'
                      }}
                    >
                      #{ticketData && ticketData.ticketNumber}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant='body2'
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '500',
                    fontSize: { sm: '12px', xs: '12px', md: '14px' },
                    color: '  rgba(42, 58, 81, 0.53)',
                    display: { sm: 'none', xs: 'none', md: 'block' }
                  }}
                >
                  #{ticketData && ticketData.ticketNumber}
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  variant='body2'
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '500',
                    fontSize: { sm: '12px', xs: '12px', md: '14px' },
                    color: ' rgba(42, 58, 81, 0.53)'
                  }}
                >
                  {formatted_date && formatted_date}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={5} direction='column'>
              <Grid item>
                <Typography
                  variant='h6'
                  sx={{
                     fontFamily: 'Mazzard',
                     fontWeight: '500',
                     fontSize: '14px',
                     color: '#444444',
                     wordBreak: 'break-all'


                    // ml: '20px'
                  }}
                >
                  {ticketData && ticketData.title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <CardActions sx={{ padding: '10px 0px 0px' }}>
            <Grid
              container
              spacing={0}
              justifyContent='space-between'
              alignItems='center'
              sx={{ p: '8px 13px', borderTop: '1px solid #EBEBEB' }}
            >
              <Grid item>
                <Typography
                  onClick={(event: any) => handlepopoveropen(event, ticketData.ticketId)}
                  sx={{
                    fontSize: '14px',
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    color:
                      ticketData.status === 1
                        ? '#03B8DB'
                        : ticketData.status === 2
                          ? '#FF8A2B'
                          : ticketData.status === 3
                            ? 'gray'
                            : ticketData.status === 4
                              ? 'purple'
                              : 'green',

                    '&:hover': {
                      color:
                        ticketData.status === 1
                          ? '#03B8DB'
                          : ticketData.status === 2
                            ? '#FF8A2B'
                            : ticketData.status === 3
                              ? 'gray'
                              : ticketData.status === 4
                                ? 'purple'
                                : 'green'
                    }
                  }}
                >
                  {ticketData && ticketData.status === parseInt(TICKET_STATUS.OPEN)
                    ? 'open'
                    : ticketData.status === parseInt(TICKET_STATUS.PENDING)
                      ? 'pending'
                      : ticketData.status === parseInt(TICKET_STATUS.CLOSED)
                        ? 'closed'
                        : ticketData.status === parseInt(TICKET_STATUS.WAITING_ON_CUSTOMER)
                          ? 'Waiting on customer'
                          : 'Waiting on Third party'}
                </Typography>
              </Grid>
              <Grid
                item
                sx={{
                  display: { md: 'block', sm: 'none', xs: 'none' },
                  width: '1px',
                  height: '40px',
                  background:
                    ticketData.status === 1
                      ? '#03B8DB'
                      : ticketData.status === 2
                        ? '#FF8A2B'
                        : ticketData.status === 3
                          ? 'gray'
                          : ticketData.status === 4
                            ? 'purple'
                            : 'green'
                }}
              ></Grid>
              <Grid item>
                <Grid container justifyContent='center' alignItems='center'>
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        fontSize: '12px',
                        color: 'rgba(42, 58, 81, 0.53)'
                      }}
                    >
                      Assignee
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        color: 'rgba(42, 58, 81, 0.87)',
                        fontWeight: '500',
                        fontSize: { xs: '14px', sm: '14px', md: '16px' },
                        textTransform: 'capitalize'
                      }}
                    >
                      {touser && touser.fname}{' '}
                      {touser && touser.lname}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                sx={{
                  width: '100%',
                  height: '1px',
                  background: '#EBEBEB',
                  margin: '10px 0',
                  display: { lg: 'none', md: 'none', sm: 'block' }
                }}
              >
                {' '}
              </Grid>

              <Grid
                item
                sx={{
                  display: { md: 'block', sm: 'none', xs: 'none' },
                  width: '1px',
                  height: '40px',
                  background: 'rgba(226, 226, 226, 0.53)'
                }}
              >
                {' '}
              </Grid>
              <Grid item>
                <Grid container justifyContent='center' alignItems='center'>
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        fontSize: '12px',
                        color: 'rgba(42, 58, 81, 0.53)'
                      }}
                    >
                      Raised By
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        color: 'rgba(42, 58, 81, 0.87)',
                        fontWeight: '500',
                        fontSize: { xs: '14px', sm: '14px', md: '16px' },
                        textTransform: 'capitalize'
                      }}
                    >
                      {fromuser && fromuser.fname}{" "}{fromuser && fromuser.lname}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ width: '1px', height: '40px', background: 'rgba(226, 226, 226, 0.53)' }}>
                {' '}
              </Grid>
              <Grid item>
                <Grid item>
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard',
                      fontSize: '12px',
                      color: 'rgba(42, 58, 81, 0.53)'
                    }}
                  >
                    Priority
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard',
                      color: 'rgba(42, 58, 81, 0.87)',
                      fontWeight: '500',
                      fontSize: { xs: '14px', sm: '14px', md: '16px' },
                      textTransform: 'capitalize'
                    }}
                  >
                    {ticketData && ticketData.priority === parseInt(TICKET_PRIORITY.URGENT) ? (
                      <>urgent</>
                    ) : ticketData && ticketData.priority === parseInt(TICKET_PRIORITY.HIGH) ? (
                      <>high</>
                    ) : ticketData && ticketData.priority === parseInt(TICKET_PRIORITY.MEDIUM) ? (
                      <>medium</>
                    ) : (
                      <>low</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item sx={{ width: '1px', height: '40px', background: 'rgba(226, 226, 226, 0.53)' }}>
                {' '}
              </Grid>
              {/* <Grid item>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontSize: '12px',
                    color: 'rgba(42, 58, 81, 0.53)'
                  }}
                >
                  category
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    color: 'rgba(42, 58, 81, 0.87)',
                    fontWeight: '500',
                    fontSize: '16px',
                    textTransform: 'capitalize'
                  }}
                >
                  {category && category.category}
                </Typography>
              </Grid> */}

              <Grid item>
                <Fragment>
                {createuserId == loggedInUserId ?
                              (
                  <IconButton size='small' sx={{ color: 'text.secondary' }}>
                    <Avatar alt='setting' onClick={handleDropdownOpen} sx={{ width: 40, height: 40 }} src={Dots} />
                  </IconButton>
                              ): '' }

                 {/*  <Menu
                    className=' pdf-export-popover'
                    anchorEl={anchorElDrop}
                    open={Boolean(anchorElDrop)}
                    onClose={() => handleDropdownClose()}
                    sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    {category.category == 'Support' ? (
                      <>
                        {createuserId == loggedInUserId ?
                        <>
                          <MenuItem sx={{ p: 0 }}>
                            <Box sx={styles} onClick={(() => handleSupportEditId(id))}>
                            <img src={ColorEdit} alt='edit-img' style={{ height: '18px', width: '18px', marginRight: '6px' }} />{' '}

                              Edit</Box>
                          </MenuItem>
                          

                        <MenuItem sx={{ p: 0 }}>
                          <Box sx={styles} onClick={()=>{handleOpen(),handleDropdownClose()}}>
                          <img src={deleteTicketIcon} alt='edit-img' style={{ height: '18px', width: '18px', marginRight: '6px' }} />{' '}

                            Delete
                          </Box>
                        </MenuItem>
                        </>
                        : ' '}
                      </>
                    ) :  (
                      <>
                        <MenuItem sx={{ p: 0 }} onClick={handleExportPdf}>
                          {menuItemLoading ? (
                            <>
                              <CircularProgress color='inherit' className='pdf-export-loader' />
                            </>
                          ) : (
                            <Box sx={styles}>Export</Box>
                          )}
                        </MenuIt}em>

                        <MenuItem sx={{ p: 0 }}>
                          <Box sx={styles} onClick={handlePrint}>
                            Print
                          </Box>
                          </MenuItem> </>) */}
                           {createuserId == loggedInUserId ?
                              (
                                <>
                          <Menu
                            className=' pdf-export-popover'
                            anchorEl={anchorElDrop}
                            open={Boolean(anchorElDrop)}
                            onClose={() => handleDropdownClose()}
                            sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          >
                           
                           <MenuItem sx={{ p: 0 }}>
                            <Box sx={styles} onClick={(() => handleSupportEditId(id))}>
                            <img src={ColorEdit} alt='edit-img' style={{ height: '18px', width: '18px', marginRight: '6px' }} />{' '}

                              Edit</Box>
                          </MenuItem>
                          
{/* 
                        <MenuItem sx={{ p: 0 }}>
                          <Box sx={styles} onClick={()=>{handleOpen(),handleDropdownClose()}}>
                          <img src={deleteTicketIcon} alt='edit-img' style={{ height: '19px', width: '19px', marginRight: '6px',marginBottom:'4px' }} />{' '}

                            Delete
                          </Box>
                        </MenuItem> */}
                            
                         
                         </Menu>   </> ) : (' ')
                       
                         }
                  

                </Fragment>
              </Grid>
            </Grid>
          </CardActions>

          <Divider sx={{ m: 0 }} />
          <Grid item xs={12}>
            <Grid container spacing={5} direction='column'>
              <Grid item>
              <Typography
                           sx={{
                            fontFamily: 'Mazzard',
                            fontWeight: '500',
                            fontSize: { sm: '15px', xs: '15px', md: '17px' },
                            color: '#2D4ACD',
                            paddingTop: '10px'
                          }}
                        >
                           Description
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '500',
                    fontSize: { sm: '13px', xs: '13px', md: '15px' },
                    color: ' rgba(42, 58, 81, 0.87)',
                    paddingTop: '3px'
                  }}
                  dangerouslySetInnerHTML={{ __html: ticketData.description }}
                ></Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ m: '0px 0px 10px 0px' }} />
          <Grid item xs={12}>
            <Grid container spacing={5} direction='column'>
              <Grid item>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '500',
                    fontSize: { sm: '15px', xs: '15px', md: '17px' },
                    color: '#2D4ACD'
                  }}
                >
                  Documents{' '}
                  <span style={{ fontSize: '14px' }}>
                    {storeFileAttachment === undefined || storeFileAttachment === null ? ' ' : `(${storeFileAttachment.length})`}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
       {/*    <Grid xs={12} md={12} sx={{ marginLeft: '25px' }}>
                  <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Grid> */}
                      <Grid sx={{ width: '100%', height: 'auto', padding: '10px 0px' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: "end" }}>
                {/* display images */}

                {storeFileAttachment === undefined || storeFileAttachment === null ? (
                  <Typography sx={{ fontSize: '14px' }}>Attachments not found</Typography>
                ) : (
                  storeFileAttachment.map((img: any, id: number) => {

                    return (
                      <>
                        {img.split('.').pop() === "png" || img.split('.').pop() === "jpg" || img.split('.').pop() === "jpeg" ? <>
                          <Grid
                            spacing={3}
                            key={id}
                            sx={{
                              fontFamily: 'Mazzard',
                              fontWeight: '500',
                              fontSize: '19px',
                              color: '#2D4ACD',
                              paddingTop: '8px',
                              display: 'flex'
                            }}
                          >
                            <CustomAvatar
                              variant='square'
                              sx={{
                                width: { sm: '55px', xs: '55px', md: '64px' },
                                height: { sm: '55px', xs: '55px', md: '64px' },
                                marginRight: '14px',
                                backgroundColor: '#EEEEEE'
                              }}
                            >

                              <img
                                src={`${imagePath}${img}`}
                                alt='doc-img'
                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                onClick={() => openImageViewer(id)}
                              />
                            </CustomAvatar>
                          </Grid>
                        </> :
                          img.split('.').pop() === "pdf" ?
                            <>
                              <a href={`${imagePath}${img}`} target="_blank" rel="noopener noreferrer">
                                <Grid
                                  spacing={3}
                                  key={id}
                                  sx={{
                                    fontFamily: 'Mazzard',
                                    fontWeight: '500',
                                    fontSize: '19px',
                                    color: '#2D4ACD',
                                    paddingTop: '8px',
                                    display: 'flex'
                                  }}
                                >
                                  <CustomAvatar
                                    variant='square'
                                    sx={{
                                      width: { sm: '55px', xs: '55px', md: '64px' },
                                      height: { sm: '55px', xs: '55px', md: '64px' },
                                      marginRight: '14px',
                                      backgroundColor: '#EEEEEE'
                                    }}
                                  >
                                    <img
                                      src={Pdf_img}
                                      alt='file'
                                      style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                    />
                                  </CustomAvatar>
                                </Grid>
                              </a>
                            </> : <>
                              <Grid
                                onClick={() => handleDownloadImg(img)}
                                spacing={3}
                                key={id}
                                sx={{
                                  fontFamily: 'Mazzard',
                                  fontWeight: '500',
                                  fontSize: '19px',
                                  color: '#2D4ACD',
                                  paddingTop: '8px',
                                  display: 'flex'
                                }}
                              >
                                <CustomAvatar
                                  variant='square'
                                  sx={{
                                    width: { sm: '55px', xs: '55px', md: '64px' },
                                    height: { sm: '55px', xs: '55px', md: '64px' },
                                    marginRight: '14px',
                                    backgroundColor: '#EEEEEE'
                                  }}
                                >

                                  <img
                                    src={file_icon}
                                    alt='file'
                                    style={{ width: '50px', height: '50px', cursor: 'pointer', opacity: "0.3" }}


                                  />

                                </CustomAvatar>
                              </Grid>
                            </>}
                      </>
                    )
                  })
                )}
               </Box>
                      </Grid>
                    {/* </Grid>


                  </Grid>
                </Grid> */}
          <Grid item xs={12}>
            <Grid container spacing={5} direction='column'>
              <Grid item>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '500',
                    fontSize: { sm: '15px', xs: '15px', md: '17px' },
                    color: '#2D4ACD',
                    paddingTop: '18px'
                  }}
                >
                  Comments
                  <span style={{ fontSize: '14px' }}>
                  {commentCount ? ` (${commentCount})` : ''}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ maxHeight: filterData.length > 0 ? "32vh" : '40vh', overflowY: 'auto' }}>
            <Grid container spacing={5} direction='column'>
              <Grid item>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '400',
                    fontSize: { sm: '12px', xs: '12px', md: '14px' },
                    color: '  #787878ba'
                  }}
                >
                  {comments.length === 0
                    ? 'No comments yet'
                    : comments.map((item: any, index: number) => {


                      //const date = new Date(item.createdAt)
                      const comment_date = moment(item.createdAt).format('DD MMM  YYYY hh:mm A')
                     
                      //`${months[date.getMonth()] } ${date.getDate()}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes()  : date.getMinutes()}`

                        let MsgBody:any
                        item.messageType == 'meeting' ?  MsgBody=JSON.parse(item.message) : ''
                        const meetBody = MsgBody?.meetingDetail?.meetingBody
                        const joinUrl = MsgBody?.meetingDetail?.joinUrl
                        const startUrl = MsgBody?.meetingDetail?.startUrl
                        const meet_url =  loggedInUserId == touser.userId  ? startUrl : joinUrl
                      
                      return (
                        <div key={index} ref={messagesEndRef}>
                          <ListItem>
                            <ListItemAvatar sx={{ mt : 0 }}>
                              <MuiAvatar
                                src={item.creator.profilePicture ? item.creator.profilePicture : DefaultProfilePic}
                                alt='Commenter'
                                sx={{
                                  width: 40,
                                  height: 40
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
                                <Box sx={{ display: 'flex' }}>
                                  <Typography
                                    noWrap
                                    sx={{
                                      fontFamily: 'Mazzard-regular',
                                      fontWeight: 600,
                                      fontSize: { sm: '14px', xs: '14px', md: '16px' },
                                      color: 'rgba(27, 11, 43, 0.8)',
                                      textTransform: 'capitalize',
                                      lineHeight: '25.39px',
                                      marginRight: '5px',
                                    }}
                                  >
                                    {item.creator.fname} {item.creator.lname}
                                  </Typography>
                                  <Typography
                                    noWrap
                                    sx={{
                                      fontFamily: 'Mazzard',
                                      fontWeight: 600,
                                      fontSize: { sm: '10px', xs: '10px', md: '12px' },
                                      textTransform: 'capitalize',
                                      lineHeight: '25.39px',
                                      color: 'rgba(33, 16, 50, 0.44)'
                                    }}
                                  >
                                    - {comment_date}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                               
                                item.messageType == 'meeting' ?
                                  (
                                    <Box sx={{marginTop:'10px'}}>
                                     <div className="conatainer" >
                                      <div className="main-chatbox">
                                        <div className="chat">
                                          <img className="videcallIcon" src={VidecallIcon} alt="meeting" />
                                          <p className="user-text">{meetBody}
                                          <a href={meet_url} target="_blank" rel="noreferrer">{meet_url.length > 60 ? meet_url.substring(0, 55)+'...' : meet_url}</a>
                                          </p>
                                        </div>
                                      </div>
                                    </div> 
                                    </Box>
                                  ) : item.messageType == "screenReccordeing" ?
                                    (
                                      <Grid

                                        sx={{
                                          fontFamily: 'Mazzard',
                                          fontWeight: 500,
                                          fontSize: { sm: '14px', xs: '14px', md: '15px' },
                                          lineHeight: '19px',
                                          color: '#787878',
                                          marginTop: '-14px !important'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: item.message }}

                                      >
                                        {/* {item.message} */}
                                      </Grid>

                                    ) :
                                    (
                                      <Grid

                                        sx={{
                                          fontFamily: 'Mazzard',
                                          fontWeight: 500,
                                          fontSize: { sm: '14px', xs: '14px', md: '15px' },
                                          lineHeight: '19px',
                                          color: '#787878',
                                          marginTop: '0px'
                                        }}

                                      >
                                        {item.message}
                                      </Grid>
                                    )
                              }

                            />
                          </ListItem>
                          <Grid md={12} sx={{ display: "flex" }}>
                            <Grid md={1}>
                            </Grid>
                            <Grid sx={{ width: '100%', height: 'auto', padding: '10px 0px' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: "end" }}>
                            {item.attachment ? JSON.parse(item.attachment).map((attachmentImg: any, index: any) => {


                              return (
                                <>
                                <Grid sx={{marginLeft:'20px',marginBottom:'10px'}}>
                                  {attachmentImg.split('.').pop() == "png" || attachmentImg.split('.').pop() == "jpeg" || attachmentImg.split('.').pop() == "jpg" ? <>
                                    <Grid sx={{ display: "flex",marginTop:'-10px' }}  key={index}>
                                      <Grid
                                        key={index}
                                        sx={{
                                          fontFamily: 'Mazzard',
                                          fontWeight: '500',
                                          fontSize: '19px',
                                          color: '#2D4ACD',
                                          paddingTop: '0px',
                                          display: 'flex'
                                        }}
                                      >
                                        <CustomAvatar
                                          variant='square'
                                          sx={{
                                            width: { sm: '38px', xs: '38px', md: '80px' },
                                            height: { sm: '38px', xs: '38px', md: '80px' },
                                            marginTop: '8px',
                                            backgroundColor: '#EEEEEE'
                                          }}
                                        >
                                          <img
                                            src={`https://storage.googleapis.com/${attachmentImg}`}
                                            alt='img-display'
                                            style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                            onClick={() => openViewImgModal(attachmentImg)}

                                          />
                                        </CustomAvatar>
                                      </Grid>
                                    </Grid>
                                  </> :
                                    attachmentImg.split('.').pop() == "pdf" ?
                                      <>
                                        <a href={`${imagePath}${attachmentImg}`} target="_blank" rel="noopener noreferrer">
                                          <Grid sx={{ display: "flex",marginTop:'-10px'}} key={index}>
                                            <Grid
                                              key={index}
                                              sx={{
                                                fontFamily: 'Mazzard',
                                                fontWeight: '500',
                                                fontSize: '19px',
                                                color: '#2D4ACD',
                                                paddingTop: '0px',
                                                display: 'flex'
                                              }}
                                            >
                                              <CustomAvatar
                                                variant='square'
                                                sx={{
                                                  width: { sm: '38px', xs: '38px', md: '80px' },
                                                  height: { sm: '38px', xs: '38px', md: '80px' },
                                                  marginTop: '8px',
                                                  backgroundColor: '#EEEEEE'
                                                }}
                                              >
                                                <img
                                                  src={Pdf_img}
                                                  alt='img-display'
                                                  style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                />
                                              </CustomAvatar>
                                            </Grid>
                                          </Grid>
                                        </a>
                                      </> :
                                      attachmentImg.split('.').pop() == "mp4" ?

                                        <>
                                  <video width="100px" height="100px" style={{marginTop:'-10px'}} src={`https://storage.googleapis.com/${attachmentImg}`}   className="video-recorders"  controls />
                              
      
      </>

                                        : <>
                                          <Grid sx={{ display: "flex" ,marginTop:'-10px'}} key={index} onClick={() => handleFileDownload(attachmentImg)} >
                                            <Grid
                                              key={index}
                                              sx={{
                                                fontFamily: 'Mazzard',
                                                fontWeight: '500',
                                                fontSize: '19px',
                                                color: '#2D4ACD',
                                                paddingTop: '8px',
                                                display: 'flex'
                                              }}
                                            >
                                              <CustomAvatar
                                                variant='square'
                                                sx={{
                                                  width: { sm: '38px', xs: '38px', md: '80px' },
                                                  height: { sm: '38px', xs: '38px', md: '80px' },
                                                  backgroundColor: '#EEEEEE'
                                                }}
                                              >
                                                <img
                                                  src={file_icon}
                                                  alt='img-display'
                                                  style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                />
                                              </CustomAvatar>
                                            </Grid>
                                          </Grid>
                                        </>}
                                        </Grid>
                                </>
                              )
                            }) : ""}
                            </Box>
                            </Grid>
                          </Grid>
                        </div>
                      )
                    })}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid >
      )
      }

      <Grid sx={{ padding: '0px 18px', position: 'absolute', left: '0', bottom: '0', width: '100%' }}>
        <Grid container justifyContent={'space-between'} sx={{ alignItems: 'center' }}>

        </Grid>
        <Grid item sm={12}>
          {/* //import textfield div */}
          <>
            <CommonInputField />
          </>
        </Grid>
      </Grid>

      <Popover
        sx={{ padding: '21px', overflow: 'hidden', width: '100%', top: '30px' }}
        anchorPosition={{ top: 370, left: 710 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        id={idpopover}
        open={open}
        anchorEl={anchorEl}
        onClose={handleeditClose}
      >
        <EditPopover handleeditClose={handleeditClose} getTicketId={id} />
      </Popover>

      {/* delete ticket modal */}
   {/*    <Modal
        hideBackdrop
        open={openTicket}
        onClose={handleCloseTicket}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
        sx={{ backgroundColor: '#00000075' }}

      >
        <Box sx={{ ...style }}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
          Delete Ticket
          </Typography>
          <p id='child-modal-description'>Are you sure you want to delete this Ticket?</p>

          <Button
            variant='contained'
            size='small'
            sx={{ marginRight: 2, mb: 0, background: `${theme.palette.primary.main}`,textTransform: 'capitalize' }}
            onClick={handleDelete}
          >
            Ok
          </Button>
          <Button variant='outlined' size='small' sx={{textTransform: 'capitalize'}} onClick={handleCloseTicket}>
            Cancel
          </Button>
        </Box>
      </Modal> */}

      {/* //display Comments images */}
      <Dialog
        open={viewImg}
        onClose={handleViewImgClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
       
        <DialogTitle onClick={handleViewImgClose} id='alert-dialog-title'>
          <IconButton
            size='small'
            sx={{ position: 'absolute', right: '1rem', top: '0.3rem' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: '500px', width: '500px' }} className="image-preview">
          <img
            src={imgUrlpopup ? imgUrlpopup : ''}
            alt='img-popup'
            style={{ width: '100%', height: '100%' }}
          />
        </DialogContent>

        {/* <DialogActions>
          <Button onClick={handleViewImgClose}>Disagree</Button>
          <Button onClick={handleViewImgClose} autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>

    </Box >
    </>
  )
}

export default TicketDetails

