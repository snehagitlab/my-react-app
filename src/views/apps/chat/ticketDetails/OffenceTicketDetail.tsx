import React, {
  Ref,
  useEffect,
  useState,
  Fragment,
  forwardRef,
  ReactElement,
  useContext,
  useCallback
} from 'react'
import IconButton from '@mui/material/IconButton'
import { Divider, Grid, Typography, CardActions, Avatar, MenuItem, Menu, Button, Modal } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Fade, { FadeProps } from '@mui/material/Fade'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Popover from '@mui/material/Popover'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@mui/material/styles'


//import component
import ChatContext from 'src/context/ChatProvider'
import TicketContext from 'src/context/TicketProvider'
import EditVictim from './EditVictim'
import EditWitness from './EditWitness'
import EditSuspect from './EditSuspect'
import EditProperty from './EditProperty'
import CommonInputField from './CommonInputField'
import DragnDrop from './DragnDrop'


//image viewer
import ImageViewer from 'react-simple-image-viewer'

//import components
import EditPopover from '../EditPopover'

// toast popup
import { toast } from 'react-toastify'

const imagePath = 'https://storage.googleapis.com/'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL

//import images
import VidecallIcon from 'src/assets/Images/user_Icons/light/meeting-icon.png'
import Edit1 from '../../../../assets/Images/user_Icons/light/edit1.png'
import Dots from '../../../../assets/Images/user_Icons/light/dots.svg'
import LeftArrow from '../../../../assets/Images/user_Icons/light/LeftArrow.png'
import file_icon from '../../../../assets/Images/user_Icons/light/file_icon.png'
import Pdf_img from '../../../../assets/Images/user_Icons/light/pdf_img.png'

//import react router dom
import { useParams } from 'react-router-dom'

//edit dialogue
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const styles = {
  py: 2,
  px: 4,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'text.primary',
  textDecoration: 'none',
  '& svg': {
    fontSize: '1.375rem',
    color: 'text.secondary'
  }
}

// delete modal css
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  height: 200,
  bgcolor: 'background.paper',
  boxShadow: 2,
  p: 8
}

const TicketDetails = () => {
  const { id } = useParams()
  const theme = useTheme()
  const {
    setOffenceTicketCreate,
    editTicket,
    setVictimData,
    setWitnessData,
    setSuspectData,
    setPropertyData,
    propertyData,
    victimData,
    witnessData,
    suspectData,
    setBasicPicker,
    setEditVictimDialogue,
    editVictimDialogue,
    setOffenceTicketId,
    setEditWitnessDialogue,
    editWitnessDialogue,
    setEditValue,
    setEditWitnessValue,
    setCaseInfo,
    caseInfo,
    setEditSuspectDialogue,
    editSuspectDialogue,
    setEditPropertyDialogue,
    editPropertyDialogue,
    setEditSuspectValue,
    setEditPropertyValue,
    commentreplay,
    setDrop,
    filterData, handlecreateSliderOpen,
    editoffenceticketrefresh,
    setDeleteTicket
  } = useContext<any>(TicketContext)
  const [storeAttachment, setStoreAttachment] = React.useState<any>()
  const storeFileAttachment = storeAttachment && JSON.parse(storeAttachment)
  const { getUserImg } = React.useContext<any>(ChatContext)
  const [menuItemLoading, setMenuItemLoading] = useState<boolean>(false)
  const [printLoading, setPrintLoading] = useState<boolean>(false)


  //get ticket data state
  const [ticketData, setTicketData] = useState<any>([])

  //comments reply state
  const [comments, setComments] = useState<any>([])
  const [commentCount, setCommentCount] = useState<any>()

  //dropdown state
  const [anchorElDrop, setAnchorElDrop] = useState<HTMLButtonElement | null>(null)

  // edited state
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  //image viewer state
  const [currentImage, setCurrentImage] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [viewerImg, setViewerImg] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [createuserId, setcreateuserId] = useState(0)

  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const loggedInUserId = user.data.userId

  //delete ticket modal state
  const [openTicket, setOpenTicket] = React.useState(false);

  const handleOpen = () => {
    setOpenTicket(true);
  };
  const handleCloseTicket = () => {
    setOpenTicket(false)
  }


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

  //edit button click through display in dialogue data
  const handleVitnessEditDialog = (id: any) => {
    setEditVictimDialogue(true)
    const findVictim: any = victimData.filter((item: any) => item.id === id)
    {
      findVictim.map((item: any) => {
        setBasicPicker(item.dateofbirth)

        return setEditValue({
          suspect: item.suspect,
          fname: item.fname,
          lname: item.lname,
          address: item.address,
          phone: item.phone,
          race: item.race,
          sex: item.sex,
          hair: item.hair,
          eyes: item.eyes,
          drivesLicense: item.drivesLicense,
          socialSecurity: item.socialSecurity,
          height: item.height,
          weight: item.weight,
          state: item.state,
          city: item.city,
          zip: item.zip,
          id: item.id

          // // eht: item.eht,
          // // occupation: item.occupation,
          // employer: item.employer,

        })
      })
    }
  }

  //show witness edit dialogue
  const handleWitnessEditDialog = (id: any) => {
    setEditWitnessDialogue(true)
    const findWitness: any = witnessData.filter((item: any) => item.id === id)
    {
      findWitness.map((item: any) => {
        setBasicPicker(item.dateofbirth)

        return setEditWitnessValue({
          suspect: item.suspect,
          fname: item.fname,
          lname: item.lname,
          address: item.address,
          city: item.city,
          state: item.state,
          zip: item.zip,
          phone: item.phone,
          race: item.race,
          sex: item.sex,
          hair: item.hair,
          eyes: item.eyes,
          height: item.height,
          weight: item.weight,
          drivesLicense: item.drivesLicense,
          socialSecurity: item.socialSecurity,
          id: item.id

          // eht: item.eht,
          // occupation: item.occupation,
          // employer: item.employer,

        })
      })
    }
  }

  // show suspect edit dialogue
  const handleSuspectEditDialog = (id: any) => {
    setEditSuspectDialogue(true)
    const findSuspect: any = suspectData.filter((item: any) => item.id === id)
    {
      findSuspect.map((item: any) => {
        setBasicPicker(item.dateofbirth)

        return setEditSuspectValue({
          suspect: item.suspect,
          fname: item.fname,
          lname: item.lname,
          address: item.address,
          city: item.city,
          state: item.state,
          zip: item.zip,
          phone: item.phone,
          race: item.race,
          sex: item.sex,
          hair: item.hair,
          height: item.height,
          weight: item.weight,
          eyes: item.eyes,
          drivesLicense: item.drivesLicense,
          socialSecurity: item.socialSecurity,
          id: item.id

          // eht: item.eht,
          // occupation: item.occupation,
          // employer: item.employer,
        })
      })
    }
  }

  // show property edit dialogue
  const handlePropertyEditDialog = (id: any) => {
    setEditPropertyDialogue(true)
    const findProperty: any = propertyData.filter((item: any) => item.id === id)
    {
      findProperty.map((item: any) => {
        setBasicPicker(item.year)

        return setEditPropertyValue({
          vehical: item.vehical,
          model: item.model,
          color: item.color,
          lpvin: item.lpvin,
          state: item.state,
          id: item.id,
          make: item.make,
          month: item.month,
          plate: item.plate,
          year: item.year,
        })
      })
    }
  }

  //pdf export
  const handleExportPdf = async () => {
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
  }

  //print export
  const handlePrint = async () => {
    setPrintLoading(true)
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url: any = new URL(`${BASE_URL}/v1/ticket/exports?ticketId=${id}`)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/print',
        Authorization: `Bearer ${UserData.token}`
      }
    })
      .then(response => response.blob())
      .then(blob => {
        setPrintLoading(false)
        setAnchorElDrop(null)
        const blobURL = URL.createObjectURL(blob);
        const iframe: any = document.createElement('iframe');
        document.body.appendChild(iframe);

        iframe.style.display = 'none';
        iframe.src = blobURL;
        iframe.onload = function () {
          setTimeout(function () {
            iframe.focus();
            if (iframe.contentWindow != null) {
              iframe.contentWindow.print();
            }
          }, 1);
        };
      })
      .catch(() => {
        toast.error('PDF Generated Failed', { toastId: 'pdfFailed' })
        setPrintLoading(false)
      })
  }

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
    setOffenceTicketCreate(false)
  }

  //for date format
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
  const date = new Date(ticketData?.createdAt)
  const formatted_date = `${date.getDate()} ${months[date.getMonth()]
    } ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

  //offence date
  const formatted_offenceDate = new Date(caseInfo && caseInfo.offencedate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  //report date
  const formatted_reportDate = new Date(caseInfo && caseInfo.reportdate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  //get ticket details
  const handleClick = async () => {
    setLoading(true)
    setVictimData([])
    setWitnessData([])
    setSuspectData([])
    setPropertyData([])
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

      //console.log(result)
      setcreateuserId(result.payload.fromUser.userId)
      setStoreAttachment(result.payload.attachment)
      
      setTicketData(result?.payload)
      setCaseInfo(result?.payload.pivotDetail.otherFields.caseInfo)

      /*  console.log(result.payload.pivotDetail.otherFields.caseInfo)
       console.log(result.payload.pivotDetail.otherFields.caseInfo.narrative) */

      setLoading(false)
      if (result?.payload.pivotDetail.otherFields.victimData.length > 0) {
        // const uniqueData = [
        //   ...result.payload.pivotDetail.otherFields.victimData
        //     .reduce((map: any, obj: any) => map.set(obj.id, obj), new Map())
        //     .values()
        // ]
        setVictimData(result?.payload.pivotDetail.otherFields.victimData)
      }
      if (result?.payload.pivotDetail.otherFields.witnessData.length > 0) {
        // const witnessUniqueData: any = [
        //   ...result.payload.pivotDetail.otherFields.witnessData
        //     .reduce((map: any, obj: any) => map.set(obj?.id, obj), new Map())
        //     .values()
        // ]
        setWitnessData(result?.payload.pivotDetail.otherFields.witnessData)
      }
      if (result?.payload.pivotDetail.otherFields.suspectData.length > 0) {
        // const suspectUniqueData: any = [
        //   ...result.payload.pivotDetail.otherFields.suspectData
        //     .reduce((map: any, obj: any) => map.set(obj.id, obj), new Map())
        //     .values()
        // ]
        setSuspectData(result?.payload.pivotDetail.otherFields.suspectData)
      }
      if (result?.payload.pivotDetail.otherFields.propertyData.length > 0) {
        // const propertyUniqueData: any = [
        //   ...result.payload.pivotDetail.otherFields?.propertyData
        //     .reduce((map: any, obj: any) => map.set(obj.id, obj), new Map())
        //     .values()
        // ]
        setPropertyData(result?.payload.pivotDetail.otherFields.propertyData)
      }
    } else if (result.status === 412) {
      toast.error(result.message)
      setLoading(false)
    }
  }

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
    }
  }


  // const handleScroll = () => {
  //   console.log('Scrolling...')
  //   if (listInnerRef.current) {
  //     const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current
  //     if (scrollTop + clientHeight > scrollHeight - 1) {
  //       console.log('reached bottom')
  //       setPage(page + 1)
  //     }
  //   }
  // }

  //delete ticket api calling
  const handleDelete = async () => {
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
    }
  }



  useEffect(() => {
    handleClick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, editTicket, editoffenceticketrefresh])

  useEffect(() => {
    DisplayComment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentreplay, id, commentCount])

  const handleeditClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const idpopover = open ? 'simple-popover' : undefined

  const handleOffencEditId = (id: any) => {
    setOffenceTicketId(id)

    //setoffenceticketslider(!offenceticketslider)

    handlecreateSliderOpen()
    handleDropdownClose()
  }

  const handleDrop = () => {
    setDrop(true)
  }


  const handleDownloadImg = (imgPath: any) => {
    window.location.href = `${imagePath}${imgPath}`
  }

  const handleFileDownload = (DocimgPath: any) => {
    window.location.href = `${imagePath}${DocimgPath}`
  }

  return (
    <Box
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
        <Box sx={{
          paddingLeft: '20px', alignItems: 'center', justifyContent: 'center', display: ' flex',
          marginTop: '90px'
        }}>
          <div className="loading">Loading...</div>
        </Box>
      ) : (
        <Grid sx={{
          height: filterData.length > 0 ? 'calc(100vh - 242px)' : 'calc(100vh - 162px)', overflowY: 'auto', padding: '18px'
        }}>
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
                    fontSize: '14px',
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
                  sx={{
                    fontFamily: 'Mazzard-regular',
                    fontWeight: '500',
                    fontSize: { sm: '14px', xs: '14px', md: '16px' },
                    color: 'rgba(42, 58, 81, 0.87)',
                    paddingTop: '13px'
                  }}
                >
                  {ticketData && ticketData.title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <CardActions sx={{ padding: '20px 0px 0px' }}>
            <Grid
              container
              spacing={0}
              justifyContent='space-between'
              alignItems='center'
              sx={{ p: { sm: '5px 0px', xs: '5px 0', md: '5px 13px' }, borderTop: ' 1px solid #EBEBEB' }}
            >
              <Grid item md={4}>
                <Grid container spacing={0} justifyContent='space-between' alignItems='center'>
                  <Grid item sx={{ p: { sm: '0 7px', xs: '0 7px' } }}>
                    <Grid container justifyContent='center' alignItems='center'>
                      <Grid item>
                        <Typography
                          sx={{
                            fontFamily: 'Mazzard',
                            fontSize: '12px',
                            color: 'rgba(42, 58, 81, 0.53)'
                          }}
                        >
                          Date of Offence
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'Mazzard',
                            color: 'rgba(42, 58, 81, 0.87)',
                            fontWeight: '500',
                            fontSize: { sm: '12px', xs: '12px', md: '14px' },
                            textTransform: 'capitalize'
                          }}
                        >
                          {formatted_offenceDate && formatted_offenceDate}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ width: '1px', height: '40px', background: 'rgba(226, 226, 226, 0.53)' }}>
                    {' '}
                  </Grid>
                  <Grid item sx={{ p: { sm: '0 7px', xs: '0 7px' } }}>
                    <Grid container justifyContent='center' alignItems='center'>
                      <Grid item>
                        <Typography
                          sx={{
                            fontFamily: 'Mazzard',
                            fontSize: '12px',
                            color: 'rgba(42, 58, 81, 0.53)'
                          }}
                        >
                          Date of Report
                        </Typography>
                        <Typography
                          sx={{
                            color: 'rgba(42, 58, 81, 0.87)',
                            fontFamily: 'Mazzard',
                            fontWeight: '500',
                            fontSize: { sm: '12px', xs: '12px', md: '14px' },
                            textTransform: 'capitalize'
                          }}
                        >
                          {formatted_reportDate && formatted_reportDate}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Fragment>
                  <IconButton size='small' sx={{ color: 'text.secondary' }}>
                    <Avatar alt='setting' onClick={handleDropdownOpen} sx={{ width: 40, height: 40 }} src={Dots} />
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
                    {createuserId == loggedInUserId ?
                      <MenuItem sx={{ p: 0 }}>
                        <Box sx={styles} onClick={() => handleOffencEditId(id)}>
                          Edit
                        </Box>
                      </MenuItem>
                      : ' '}
                    <MenuItem sx={{ p: 0 }} onClick={handleExportPdf}>
                      {menuItemLoading ? (
                        <>
                          <CircularProgress color='inherit' className='pdf-export-loader' /><Box sx={styles}>Export</Box>
                        </>
                      ) : (
                        <Box sx={styles}>Export</Box>
                      )}
                    </MenuItem>

                    <MenuItem sx={{ p: 0 }} onClick={handlePrint} >
                      {printLoading ? (
                        <>
                          <CircularProgress color='inherit' className='pdf-export-loader' /> <Box sx={styles}>Print</Box>
                        </>
                      ) : (
                        <Box sx={styles}>Print</Box>
                      )}
                    </MenuItem>

                    <MenuItem sx={{ p: 0 }}>
                      <Box sx={styles} onClick={handleOpen}>
                        Delete
                      </Box>
                    </MenuItem>
                  </Menu>
                </Fragment>
                {/* <IconButton size='small' sx={{ color: 'text.secondary' }}>
                <Avatar src={Dots} />
              </IconButton> */}
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
                    fontSize: { sm: '13px', xs: '13px', md: '15px' },
                    color: ' #2D4ACD',
                    paddingTop: '11px'
                  }}
                >
                  Title
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard-regular',
                    fontWeight: '500',
                    fontSize: '15px',
                    color: ' rgba(42, 58, 81, 0.87)'
                  }}
                >
                  {ticketData && ticketData.title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={5} direction='column'>
              <Grid item>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '500',
                    fontSize: { sm: '13px', xs: '13px', md: '15px' },
                    color: ' #2D4ACD',
                    paddingTop: '11px'
                  }}
                >
                  Description
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard-regular',
                    fontWeight: '500',
                    fontSize: '14px',
                    color: ' rgba(42, 58, 81, 0.87)'
                  }}
                  dangerouslySetInnerHTML={{ __html: ticketData.description }}
                ></Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={5} direction='column'>
              <Grid item sx={{ padding: '6px', paddingTop: '0 !important' }}>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontWeight: '500',
                    fontSize: { sm: '13px', xs: '13px', md: '15px' },
                    color: ' #2D4ACD',
                    paddingTop: '15px'
                  }}
                >
                  Public Narrative
                </Typography>

                {caseInfo == undefined ? ' ' :
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard-regular',
                      fontWeight: '500',
                      fontSize: '15px',
                      color: ' rgba(42, 58, 81, 0.87)'
                    }}
                    dangerouslySetInnerHTML={{ __html: caseInfo.narrative }}
                  >

                  </Typography>
                }
              </Grid>
            </Grid>
          </Grid>

          <Grid>
            <Divider sx={{ m: '19px 0px 10px 0px' }} />

            <Grid item xs={12}>
              <Grid container spacing={5} direction='column'>
                <Grid item>
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard',
                      fontWeight: '500',
                      fontSize: { sm: '13px', xs: '13px', md: '15px' },
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

            {/* display documents */}
            <Grid item xs={12}>
              <Grid container spacing={5} direction='column'>
                <Grid item sx={{ display: 'flex' }}>
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
                                        style={{ width: '50px', height: '50px', cursor: 'pointer', opacity: "0.3" }}
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
                </Grid>
              </Grid>
            </Grid>


            <Divider sx={{ m: '19px 0px 10px 0px' }} />
            {/* //- */}
            <Grid>
              <Grid item xs={12}>
                <Grid container spacing={5} direction='column'>
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: '500',
                        fontSize: { sm: '13px', xs: '13px', md: '15px' },
                        color: '#2D4ACD'
                      }}
                    >
                      Victim Information{' '}
                      <span style={{ fontSize: '14px' }}>
                        {victimData && victimData.length <= 0 ? '' : `(${victimData.length})`}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {victimData && victimData.length <= 0 ? (
                <Typography sx={{ fontSize: '14px' }}> victim not found</Typography>
              ) : (
                victimData.map((item: any, id: number) => {
                  const finalVictimDate = new Date(item.dateofbirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })

                  return (
                    <>
                      <Grid sx={{ background: 'rgba(211, 211, 211, 0.15)', marginTop: '10px' }} key={id}>
                        <Grid
                          sx={{
                            padding: '9px',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Grid>
                            <Typography
                              sx={{
                                fontSize: { sm: '13px', xs: '13px', md: '15px' },
                                color: '#2A3A51',
                                fontWeight: '600',
                                textTransform: 'capitalize'
                              }}
                            >
                              {id + 1}. {item.fname} {item.lname}
                            </Typography>
                          </Grid>

                          <Grid>
                            <IconButton size='small' sx={{ color: 'text.secondary', padding: 0 }}>
                              <img
                                src={Edit1}
                                alt='edit_info'
                                style={{ height: '20px', width: '20px' }}
                                onClick={() => handleVitnessEditDialog(item.id)}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Grid sx={{ fontSize: '13px' }}>
                          <Grid
                            container
                            sx={{
                              borderRadius: '5px',
                              fontSize: '13px',
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Address :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.address}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Phone :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.phone}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              DOB :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {finalVictimDate && finalVictimDate}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Social Security :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.socialsecurity}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Race :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.race}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Eyes :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.eyes}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              {/* EHT : */}
                              Height
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.height}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              {/* Occupation : */}
                              Weight
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.weight}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              state :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.state}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Driver License :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.drivesLicense}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              city :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.city}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              hair :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.hair}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              sex :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.sex}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              zip :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.zip}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )
                })
              )}
            </Grid>
            {/* end victim info */}

            {/* start winteness */}

            <Grid>
              <Grid item xs={12}>
                <Grid container spacing={5} direction='column'>
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: '500',
                        fontSize: { sm: '13px', xs: '13px', md: '15px' },
                        color: '#2D4ACD',
                        paddingTop: '22px'
                      }}
                    >
                      Witness Information{' '}
                      <span style={{ fontSize: '14px' }}>
                        {witnessData && witnessData.length == 0 ? '' : `(${witnessData.length})`}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {witnessData && witnessData.length == 0 ? (
                <Typography sx={{ fontSize: '14px' }}>witness not found</Typography>
              ) : (
                witnessData.map((item: any, id: number) => {
                  const finalVictimDate = new Date(item.dateofbirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })

                  return (
                    <>
                      <Grid sx={{ background: 'rgba(211, 211, 211, 0.15)', marginTop: '10px' }} key={id}>
                        <Grid
                          sx={{
                            padding: '9px',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Grid>
                            <Typography
                              sx={{
                                fontSize: { sm: '13px', xs: '13px', md: '15px' },
                                color: '#2A3A51',
                                fontWeight: '600',
                                textTransform: 'lowercase'
                              }}
                            >
                              {id + 1}. {item.fname}  {item.lname}
                            </Typography>
                          </Grid>

                          <Grid>
                            <IconButton size='small' sx={{ color: 'text.secondary', padding: 0 }}>
                              <img
                                src={Edit1}
                                alt='edit_info'
                                style={{ height: '20px', width: '20px' }}
                                onClick={() => handleWitnessEditDialog(item.id)}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Grid sx={{ fontSize: '13px' }}>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' },
                              borderRadius: '5px'
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Address :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.address}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Phone :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.phone}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              DOB :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {finalVictimDate && finalVictimDate}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Social Security :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.socialSecurity}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Race :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.race}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Eyes :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.eyes}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Height
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.height}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              weight
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.weight}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              state
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.state}

                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Driver License :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.drivesLicense}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              city :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.city}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              hair :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.hair}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              sex :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.sex}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              zip :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.zip}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )
                })
              )}
            </Grid>

            {/* end  witness info */}

            {/* start suspect */}

            <Grid>
              <Grid item xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: '500',
                        fontSize: { sm: '13px', xs: '13px', md: '15px' },
                        color: '#2D4ACD',
                        paddingTop: '22px'
                      }}
                    >
                      Suspect Information{' '}
                      <span style={{ fontSize: '14px' }}>
                        {suspectData && suspectData.length === 0 ? '' : `(${suspectData.length})`}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {suspectData && suspectData.length === 0 ? (
                <Typography sx={{ fontSize: '14px' }}>suspect not found</Typography>
              ) : (
                suspectData.map((item: any, id: number) => {
                  const finalVictimDate = new Date(item.dateofbirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })

                  return (
                    <>
                      <Grid sx={{ background: 'rgba(211, 211, 211, 0.15)', marginTop: '10px' }} key={id}>
                        <Grid
                          sx={{
                            padding: '9px',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Grid>
                            <Typography
                              sx={{
                                fontSize: { sm: '13px', xs: '13px', md: '15px' },
                                color: '#2A3A51',
                                fontWeight: '600',
                                textTransform: 'lowercase'
                              }}
                            >
                              {id + 1}. {item.fname} {item.lname}
                            </Typography>
                          </Grid>

                          <Grid>
                            <IconButton size='small' sx={{ color: 'text.secondary', padding: 0 }}>
                              <img
                                src={Edit1}
                                alt='edit_info'
                                style={{ height: '20px', width: '20px' }}
                                onClick={() => handleSuspectEditDialog(item.id)}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Grid sx={{ fontSize: '13px' }}>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' },
                              borderRadius: '5px'
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Address :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.address}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Phone :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.phone}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              DOB :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {finalVictimDate && finalVictimDate}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Social Security :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.socialSecurity}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Race :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.race}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Eyes :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.eyes}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Height
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.height}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              weight
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.weight}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              state
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.state}

                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              Driver License :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.drivesLicense}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              city :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.city}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              hair :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.hair}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              sex :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.sex}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              zip :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.zip}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )
                })
              )}
            </Grid>

            {/* end  suspect info */}

            {/* start property */}

            <Grid>
              <Grid item xs={12}>
                <Grid container spacing={5} direction='column'>
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: '500',
                        fontSize: { sm: '13px', xs: '13px', md: '15px' },
                        color: '#2D4ACD',
                        paddingTop: '22px'
                      }}
                    >
                      Property Information{' '}
                      <span style={{ fontSize: '14px' }}>
                        {propertyData && propertyData.length === 0 ? '' : `(${propertyData.length})`}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {propertyData && propertyData.length === 0 ? (
                <Typography sx={{ fontSize: '14px' }}>Property not found</Typography>
              ) : (
                propertyData.map((item: any, id: number) => {
                  const finalPropertyYear = new Date(item.year).toLocaleDateString('en-US', {
                    year: 'numeric',
                  })

                  const finalProperyMonth = new Date(item.year).toLocaleDateString('en-US', {
                    month: 'short',
                  })

                  return (
                    <>
                      <Grid sx={{ background: 'rgba(211, 211, 211, 0.15)', marginTop: '10px' }} key={id}>
                        <Grid
                          sx={{
                            padding: '5px 9px 0px 9px',
                            display: 'flex',
                            justifyContent: 'right'
                          }}
                        >
                          <Grid>
                            <IconButton size='small' sx={{ color: 'text.secondary', padding: 0 }}>
                              <img
                                src={Edit1}
                                alt='edit_info'
                                style={{ height: '20px', width: '20px' }}
                                onClick={() => handlePropertyEditDialog(item.id)}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Grid sx={{ fontSize: '13px' }}>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' },
                              borderRadius: '5px'
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              make
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.make}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              model :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.model}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              color :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.color}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              vin :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.lpvin}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              state :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {item.state}
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              year only :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {finalPropertyYear && finalPropertyYear}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            sx={{
                              padding: { md: '1px 5px 10px 15px', xs: '1px 5px 0px 15px', sm: '1px 5px 0px 15px' }
                            }}
                          >
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              plate :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              plate
                            </Grid>
                            <Grid item xs={4} sm={4} md={2} sx={{ color: 'rgba(42, 58, 81, 0.55)' }}>
                              year and month :
                            </Grid>
                            <Grid item xs={8} sm={8} md={4} sx={{ color: '#2A3A51' }}>
                              {finalPropertyYear} & {finalProperyMonth}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )
                })
              )}
            </Grid>

            {/* end  property info */}

            <Divider sx={{ m: '19px 0px 10px 0px' }} />

            {/* start comment section */}
            <Grid item xs={12}>
              <Grid container spacing={5} direction='column'>
                <Grid item>
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard',
                      fontWeight: '500',
                      fontSize: { sm: '13px', xs: '13px', md: '15px' },
                      color: '#2D4ACD',
                      padding: '12px 0px 0px 0px'
                    }}
                  >
                    Comments
                    <span style={{ fontSize: '14px' }}> {commentCount ? ` (${commentCount})` : ''}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ maxHeight: '32vh', overflowY: 'auto' }}>
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
                    {comments.length === 0 ? (
                      <Typography sx={{ fontSize: '14px' }}>No comments yet</Typography>
                    ) : (
                      comments.map((item: any, index: number) => {
                        const date = new Date(item.createdAt)
                        const comment_date = `${months[date.getMonth()]
                          } ${date.getDate()}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

                        return (
                          <div key={index}>
                            <ListItem sx={{ paddingBottom: 0 }}>
                              <ListItemAvatar sx={{ m: 0 }}>
                                <MuiAvatar
                                  src={getUserImg}
                                  alt='jeenal'
                                  sx={{
                                    width: 35,
                                    height: 35
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
                                        marginRight: '5px'
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
                                      <div className="conatainer">
                                        <div className="main-chatbox">
                                          <div className="chat">
                                            <img className="videcallIcon" src={VidecallIcon} alt="meeting" />
                                            <p className="user-text"
                                              dangerouslySetInnerHTML={{ __html: item.message }}
                                            ></p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : item.messageType == "screenReccordeing" ?
                                      (
                                        <Grid

                                          sx={{
                                            fontFamily: 'Mazzard',
                                            fontWeight: 500,
                                            fontSize: { sm: '14px', xs: '14px', md: '15px' },
                                            lineHeight: '19px',
                                            color: '#787878',
                                            marginTop: '-4px'
                                          }}
                                          dangerouslySetInnerHTML={{ __html: item.message }}

                                        >
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
                                            marginTop: '-4px'
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
                              {item.attachment ? JSON.parse(item.attachment).map((attachmentImg: any, index: any) => {

                                return (
                                  <>
                                    {attachmentImg.split('.').pop() == "png" || attachmentImg.split('.').pop() == "jpeg" || attachmentImg.split('.').pop() == "jpg" ? <>
                                      <Grid sx={{ display: "flex" }} key={index}>
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
                                              width: { sm: '38px', xs: '38px', md: '45px' },
                                              height: { sm: '38px', xs: '38px', md: '45px' },
                                              marginRight: '8px',
                                              backgroundColor: '#EEEEEE'
                                            }}
                                          >
                                            <img
                                              src={`https://storage.googleapis.com/${attachmentImg}`}
                                              alt='img-display'
                                              style={{ width: '38px', height: '38px', cursor: 'pointer' }}
                                            />
                                          </CustomAvatar>
                                        </Grid>
                                      </Grid>
                                    </> :
                                      attachmentImg.split('.').pop() == "pdf" ?
                                        <>
                                          <a href={`${imagePath}${attachmentImg}`} target="_blank" rel="noopener noreferrer">
                                            <Grid sx={{ display: "flex" }} key={index}>
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
                                                    width: { sm: '38px', xs: '38px', md: '45px' },
                                                    height: { sm: '38px', xs: '38px', md: '45px' },
                                                    marginRight: '8px',
                                                    backgroundColor: '#EEEEEE'
                                                  }}
                                                >
                                                  <img
                                                    src={Pdf_img}
                                                    alt='img-display'
                                                    style={{ width: '38px', height: '38px', cursor: 'pointer' }}
                                                  />
                                                </CustomAvatar>
                                              </Grid>
                                            </Grid>
                                          </a>
                                        </> :
                                        attachmentImg.split('.').pop() == "mp4" ?
                                          <>
                                            <video src={`https://storage.googleapis.com/${attachmentImg}`} className="video-recorders" controls />
                                          </>

                                          : <>
                                            <Grid sx={{ display: "flex" }} key={index} onClick={() => handleFileDownload(attachmentImg)} >
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
                                                    width: { sm: '38px', xs: '38px', md: '45px' },
                                                    height: { sm: '38px', xs: '38px', md: '45px' },
                                                    marginRight: '8px',
                                                    backgroundColor: '#EEEEEE'
                                                  }}
                                                >
                                                  <img
                                                    src={file_icon}
                                                    alt='img-display'
                                                    style={{ width: '25px', height: '25px', cursor: 'pointer' }}
                                                  />
                                                </CustomAvatar>
                                              </Grid>
                                            </Grid>
                                          </>}
                                  </>
                                )
                              }) : ""}
                            </Grid>

                          </div>
                        )
                      })
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid >
      )
      }

      <Grid sx={{ padding: '0px 18px', position: 'absolute', left: '0', bottom: '0', width: '100%' }}>
        <Divider sx={{ m: '19px 0px 10px 0px' }} />
        <Grid container justifyContent={'space-between'} sx={{ alignItems: 'center' }}>
          {/* //file attachamen code set here */}
        </Grid>

        {/* //import textfield div */}

        <>
          <CommonInputField />
        </>


      </Grid>



      {/* Victim dialogue box */}
      <Dialog
        fullWidth
        open={editVictimDialogue}
        maxWidth='md'
        scroll='body'
        onClose={() => setEditVictimDialogue(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setEditVictimDialogue(false)}
      >
        <EditVictim />
      </Dialog>

      {/* Witness Dialogue box       */}

      <Dialog
        fullWidth
        open={editWitnessDialogue}
        maxWidth='md'
        scroll='body'
        onClose={() => setEditWitnessDialogue(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setEditWitnessDialogue(false)}
      >
        <EditWitness />
      </Dialog>

      {/* Suspect Dialogue box       */}

      <Dialog
        fullWidth
        open={editSuspectDialogue}
        maxWidth='md'
        scroll='body'
        onClose={() => setEditSuspectDialogue(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setEditSuspectDialogue(false)}
      >
        <EditSuspect />
      </Dialog>

      {/* property Dialogue box       */}

      <Dialog
        fullWidth
        open={editPropertyDialogue}
        maxWidth='md'
        scroll='body'
        onClose={() => setEditPropertyDialogue(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setEditPropertyDialogue(false)}
      >
        <EditProperty />
      </Dialog>

      <Popover
        sx={{ padding: '21px', overflow: 'hidden', width: '100%', top: '30px' }}
        anchorPosition={{ top: 370, left: 800 }}
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
      <Modal
        hideBackdrop
        open={openTicket}
        onClose={handleCloseTicket}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style }}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Delete Template
          </Typography>
          <p id='child-modal-description'>Are you sure you want to delete this Ticket?</p>

          <Button
            variant='contained'
            size='small'
            sx={{ marginRight: 2, mb: 0, background: `${theme.palette.primary.main}` }}
            onClick={handleDelete}
          >
            Ok
          </Button>
          <Button variant='contained' size='small' onClick={handleCloseTicket}>
            Cancel
          </Button>
        </Box>
      </Modal>


    </Box >
  )
}

export default TicketDetails

