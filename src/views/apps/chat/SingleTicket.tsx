import React, { Fragment } from 'react'
import {
  Grid, Card, CardContent, Typography, CardActions,
  Avatar, IconButton, MenuItem, Menu, Box/* Modal,Button */
} from '@mui/material'
import Popover from '@mui/material/Popover'

//import { toast } from 'react-toastify'

//import CircularProgress from '@mui/material/CircularProgress'
import TicketContext from '../context/TicketProvider'
import { useNavigate } from 'react-router-dom'

// import images
import Dots from 'src/assets/Images/user_Icons/light/dots.svg'

//import compoenent
//import deleteTicketIcon from 'src/assets/Images/Icons/light/trash_new.png'
//import { useTheme } from '@mui/material/styles'

import ColorEdit from 'src/assets/Images/Icons/light/colorEdit.png'


//  Config file
import { TICKET_PRIORITY } from 'src/config/api.config'


//const BASE_URL = import.meta.env.VITE_APP_BASE_URL



const SingleTicket = ({ item }: any) => {


  const { /* deleteTicketListing,setDeleteTicketlisting, */setSupportTicketId/* ,setDeleteTicket */, handleoffenceSliderOpen, handleSliderClose, setOpenTicketDetails, setGetTicketId, setOffenceTicketCreate } = React.useContext<any>(TicketContext)
  //const theme = useTheme()
  const [anchorEl1, setAnchorEl1] = React.useState<HTMLButtonElement | null>(null)
  const [anchorElDrop, setAnchorElDrop] = React.useState<HTMLButtonElement | null>(null)

  //const [deleteTicketId, setDeleteTicketId] = React.useState<any>(0)
  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const loggedInUserId = user.data.userId
  const editopen = Boolean(anchorEl1)
  const editid = editopen ? 'simple-popover' : undefined
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const date = new Date(item.createdAt)
  const formatted_date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  const handleDropdownOpen = (event: any) => {
    setAnchorElDrop(event.currentTarget)
  }
  const handleDropdownClose = () => {
    setAnchorElDrop(null)
  }



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

  /* const handleExportPdf = async (id: any) => {

    setMenuItemLoading(true)
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url: any = new URL(`${BASE_URL}/v1/ticket/exports?ticketId=${id}`)
    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
        Authorization: `Bearer ${UserData.token}`
      }
    })
      .then(response => response.blob())
      .then(blob => {
        setMenuItemLoading(false)
        setAnchorElDrop(null)
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `TicketDetails.pdf`)
        document.body.appendChild(link)
        link.click()

        toast.success('PDF Generated Successfully', { toastId: 'pdfSuccess' })
      })
      .catch(() => {
        toast.error('PDF Generated Failed', { toastId: 'pdfFailed' })

      })
  } */

  // const handleClick = async (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
  //   setAnchorEl(event.currentTarget)
  //   setGetTicketId(id)
  // }

  // const handleeditClose = () => {
  //   setAnchorEl(null)
  // }


  /*  const handleClickpopover = (event: React.MouseEvent<HTMLButtonElement>, id: any) => {
     
     setGetTicketId(id)
     setAnchorEl1(event.currentTarget)
   } */

  const handleeditClose = () => {
    setAnchorEl1(null)
  }

  // useEffect(() => {
  //   fetchAllTicketsData()
  // }, [editTicket])

  // TICKET WITHOUT UPDATE RESET CALL
  // const handleReset = () => {
  //   setStatus(item.status)
  //   setPriority(item.priority)
  //   setAssignerId(item.toUser.userId)
  // }

  const navigate = useNavigate()

  /*  const handleDelete = async () => {
     const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
     const url = new URL(`${BASE_URL}/v1/ticket?ticketId=${deleteTicketId}`)
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
       setDeleteTicketlisting(!deleteTicketListing)
       handleCloseTicket()
     }
   } */

  const handleOffencEditId = (id: any) => {
    handleSliderClose()
    setSupportTicketId(id)
    handleoffenceSliderOpen()
    handleDropdownClose()
  }

  const handleDetailsShow = (id: any, categoryId: any) => {

    const cid: number = categoryId == 'Support' ? 1 : 2
    handleSliderClose()
    if (cid === 1) {

      navigate(`/user/dashboard/support/${id}`)
      setOpenTicketDetails(true)
      setGetTicketId(id)
    } else if (cid === 2) {
      navigate(`/user/dashboard/offence/${id}`)
      setOpenTicketDetails(false)
      setOffenceTicketCreate(true)
      setGetTicketId(id)
    }
    document.title = "Ticket Details - Gogtas"

  }


  //dlete ticket modal state
  // const [openTicket, setOpenTicket] = React.useState(false);


  /* const handleCloseTicket = () => {
    setOpenTicket(false)
  }

  const handleOpen = () => {
    setOpenTicket(true);
  };
 */

  return (
    <>
      <Grid className='pendingTktBox' item xs={12} sx={{ position: 'relative' }}>
        <Card sx={{ borderRadius: '12px', boxShadow: 'none' }}>
          <CardContent sx={{ padding: '10px 13px', marginLeft: '2px' }}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justifyContent='space-between' spacing={5} alignItems='center'>
                  <Grid item>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '13px',
                        color: 'rgba(42, 58, 81, 0.53)',
                        lineHeight: '19px'
                      }}
                    >
                      #{item.ticketNumber}
                    </Typography>
                  </Grid>
                  <Grid item>

                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        color: ' rgba(42, 58, 81, 0.53)',
                        lineHeight: '19px',
                        display: { xs: 'none', sm: 'none', md: 'block' }
                      }}
                    >
                      {formatted_date}
                    </Typography>
                    <Grid item sx={{ display: { xs: 'block', md: 'none', sm: 'block' } }}>
                      <Fragment>
                        {item.fromUser.userId == loggedInUserId ?
                          (
                            <>
                              <IconButton size='small' sx={{ color: 'text.secondary' }}>
                                <Avatar src={Dots} sx={{ width: '35px', height: '35px' }} onClick={handleDropdownOpen} />
                              </IconButton>


                              <Menu
                                className=' pdf-export-popover'
                                anchorEl={anchorElDrop}
                                open={Boolean(anchorElDrop)}
                                onClose={() => handleDropdownClose()}
                                sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                              >

                                <MenuItem sx={{ p: 0 }} >
                                  <Box sx={styles} onClick={() => handleOffencEditId(item.ticketId)} >
                                    <img src={ColorEdit} alt='edit-img' style={{ height: '18px', width: '18px', marginRight: '6px' }} />{' '}
                                    Edit</Box>
                                </MenuItem>


                                {/* <MenuItem sx={{ p: 0 }}>
                              <Box sx={styles} onClick={()=>{handleOpen(),setDeleteTicketId(item.ticketId),handleDropdownClose()}}>
                              <img src={deleteTicketIcon} alt='edit-img' style={{ height: '19px', width: '19px', marginRight: '6px',marginBottom:'4px' }} />{' '}

                                Delete
                              </Box>
                            </MenuItem> */}


                              </Menu>   </>) : (' ')

                        }
                        {/*  <MenuItem sx={{ p: 0 }} >
                              {menuItemLoading ? (
                                <>
                                  <CircularProgress color='inherit' className='pdf-export-loader' />
                                </>
                              ) : (
                                <Box sx={styles} onClick={() => handleExportPdf(item.ticketId)} >Export</Box>
                              )}
                            </MenuItem>

                            <MenuItem sx={{ p: 0 }}>
                              <Box sx={styles} onClick={() => window.print()}>
                                Print
                              </Box>
                            </MenuItem>
                            <MenuItem sx={{ p: 0 }}>
                              <Box sx={styles} /*onClick={() => { setArrestReport(true) }} onClick={handleClickOpen} >
                                Arrest Report
                              </Box>
                            </MenuItem> */}



                      </Fragment>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={5} direction='column'>
                  <Grid item>
                    <Typography
                      sx={{
                        color: 'rgba(42, 58, 81, 0.87)',
                        fontWeight: '570',
                        fontSize: { xs: '14px', sm: '14px', md: '17px' },
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        handleDetailsShow(item.ticketId, item.category.category)
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ padding: '10px 0px 0px' }}>
            <Grid
              container
              spacing={0}
              justifyContent='space-between'
              alignItems='center'
              sx={{
                p: '5px 13px',
                borderTop: '1px solid #EBEBEB'
              }}
            >
              <Grid item md={8} sx={{ width: { xs: '100%', md: '0%' } }}>
                <Grid container spacing={0} justifyContent='space-between' alignItems='center'>
                  <Grid item>
                    <Typography

                      /* onClick={(event: any) => handleClickpopover(event, item.ticketId)} */

                      sx={{
                        fontSize: '12px',
                        textTransform: 'capitalize',
                        color:
                          item.status === 1
                            ? '#03B8DB'
                            : item.status === 2
                              ? '#FF8A2B'
                              : item.status === 3
                                ? 'gray'
                                : item.status === 4
                                  ? 'purple'
                                  : 'green',

                        p: '0px 0px 0px 30px',
                        '&:hover': {
                          color:
                            item.status === 1
                              ? '#03B8DB'
                              : item.status === 2
                                ? '#FF8A2B'
                                : item.status === 3
                                  ? 'gray'
                                  : item.status === 4
                                    ? 'purple'
                                    : 'green'
                        }
                      }}
                    >
                      {item.status === 1
                        ? 'Open'
                        : item.status === 2
                          ? 'Pending'
                          : item.status === 3
                            ? 'Closed'
                            : 'Waiting On Customer'}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: { md: 'block', sm: 'none', xs: 'none' },
                      width: '1px',
                      height: '40px',
                      background:
                        item.status === 1
                          ? '#03B8DB'
                          : item.status === 2
                            ? '#FF8A2B'
                            : item.status === 3
                              ? 'gray'
                              : item.status === 4
                                ? 'purple'
                                : 'green'
                    }}
                  ></Grid>
                  <Grid item>
                    <Grid container justifyContent='center' alignItems='center'>
                      {/*  <Grid item sx={{ mr: '10px' }}>
                        <Avatar src={UserImage} />
                      </Grid>  */}
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
                          {item.toUser.fname} {item.toUser.lname}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ width: '1px', height: '40px', background: 'lightgray' /* 'rgba(226, 226, 226, 0.53)' */ }}>
                    {' '}
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

                  {/* <Grid
                    item
                    sx={{
                      display: { md: 'block', sm: 'none', xs: 'none' },
                      width: '1px',
                      height: '40px',
                      background: 'rgba(226, 226, 226, 0.53)'
                    }}
                  >
                    {' '}
                  </Grid> */}
                  <Grid item>
                    <Grid container justifyContent='center' alignItems='center'>
                      {/* <Grid item sx={{ mr: '10px' }}>
                        <Avatar src={UserImage} />
                      </Grid> */}
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
                          {item.fromUser.fname} {item.fromUser.lname}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ width: '1px', height: '40px', background: 'lightgray' }}>
                    {' '}
                  </Grid>
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
                      {item.priority === parseInt(TICKET_PRIORITY.URGENT) ? (
                        <>urgent</>
                      ) : item.priority === parseInt(TICKET_PRIORITY.HIGH) ? (
                        <>high</>
                      ) : item.priority === parseInt(TICKET_PRIORITY.MEDIUM) ? (
                        <>medium</>
                      ) : (
                        <>low</>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ width: '1px', height: '40px', background: 'lightgray' /* 'rgba(226, 226, 226, 0.53)' */ }}>
                    {' '}
                  </Grid>
                  {/*   <Grid item>
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
                        fontSize: { xs: '14px', sm: '14px', md: '16px' },
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      {item.category.category}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      fontFamily: 'Mazzard',
                      width: '1px',
                      height: '40px',
                      background: 'lightgray',
                      display: { xs: 'none', md: 'block' }
                    }}
                  >
                    {' '}
                  </Grid> */}
                </Grid>
              </Grid>

              <Grid item>
                {item.fromUser.userId == loggedInUserId ?
                  (
                    <IconButton
                      size='small'
                      sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block', sm: 'none' } }}
                    >
                      <Avatar src={Dots} onClick={handleDropdownOpen} />
                    </IconButton>) : ''}
              </Grid>
            </Grid>
          </CardActions>
        </Card>
        {/* {/ {/ EDIT POPOVER START HERE /} /} */}
        {/* <Popover
          sx={{ padding: '21px', overflow: 'hidden', width: '100%', top: '30px' }}
          anchorPosition={{ top: 370, left: 710 }}
          className='edit-popover2'
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleeditClose}
        >
          <EditPopover handleeditClose={handleeditClose} getTicketId={getTicketId} />
        </Popover> */}

        <Popover
          id={editid}
          open={editopen}
          anchorEl={anchorEl1}
          sx={{ top: '47px' }}
          onClose={handleeditClose}
          anchorPosition={{ top: 370, left: 710 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          className='edit-popover2'
        >

          {/*  <EditPopover handleeditClose={handleeditClose} getTicketId={getTicketId} /> */}

        </Popover>
        {/* delete ticket modal */}
        {/* <Modal
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
            sx={{ marginRight: 2, mb: 0, background: `${theme.palette.primary.main}`,textTransform: 'capitalize'
          }}
            onClick={handleDelete}
          >
            Ok
          </Button>
          <Button variant='outlined' size='small' sx={{textTransform: 'capitalize'}} onClick={handleCloseTicket}>
            Cancel
          </Button>
        </Box>
      </Modal> */}
      </Grid>
    </>
  )
}

export default SingleTicket
