import React, { useEffect, useState } from 'react'

//import mui
import { Grid, Box, Typography /* , Button, TextareaAutosize */, Tooltip } from '@mui/material'
import Popover from '@mui/material/Popover'

// toast popup
//import { toast } from 'react-toastify'

import { useNavigate } from 'react-router-dom'

//import components
import EditPopover from './EditPopover'

//import config
import { TICKET_STATUS, API_PATHS,SOCKET_TICKET_REFRESH } from 'src/config/api.config'
import TicketContext from 'src/context/TicketProvider'
import { socket } from 'src/views/apps/chat/chatContent/SocketConnection'


//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
interface ITableHeaderProps {
  categoryId: any
}

function TicketListing(props: ITableHeaderProps) {
  const { categoryId } = props
  const navigate = useNavigate()
  const {
    setOpenTicketDetails,
    setGetTicketId,
    createTicketResponse,
    editTicket,
    getTicketId,
    setOffenceTicketCreate,
    deleteTicket,
    setMessageTicket,
    setCommonInputFieldShow,
    CommonInputFieldshow,
    deleteTicketListing
  } = React.useContext<any>(TicketContext)
  const [all1Data, setAll1Data] = useState<Array<any>>([])
  const [record, setRecord] = useState<any>(10)
  const [page] = useState(1)
  const [loading, setLoading] = React.useState(false)
  const [anchorEl1, setAnchorEl1] = React.useState<HTMLButtonElement | null>(null)

  //set date format
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

    // Ticket Refresh using socket when new ticket assign for logged in user
    const [response, setresponse] = React.useState<any>()
  useEffect(() => {
    socket.on("message", (socket: any) => {
      setresponse(socket)
    });
  }, []);
  
  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const loggedInUserId = user.data.userId

  useEffect(() => {
    if (response?.type == SOCKET_TICKET_REFRESH.NEW_TICKET_CREATED && response?.data) {

      if(loggedInUserId == response?.data?.to)
      {
          fetchAllTicketsData()
      }
    }
    if (response?.type == SOCKET_TICKET_REFRESH.NEW_TICKET_UPDATED && response?.data) {

      if(loggedInUserId == response?.data?.to)
      {
          fetchAllTicketsData()
      }
      if(loggedInUserId == response?.data?.newTo && response?.data?.to != response?.data?.newTo)
      {
          fetchAllTicketsData()
      }
    }
  }, [response])

  // ticket listing api call
  const fetchAllTicketsData = async () => {
    setLoading(true)
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/?pageNumber=${page}&recordsPerPage=${record}&search={"categoryId":${categoryId}}`)
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
      setAll1Data(result.payload.data)
      setRecord(result.pager.totalRecords)
      setLoading(false)

    }
  }

  
  useEffect(() => {
    fetchAllTicketsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTicketResponse, page, editTicket, record, deleteTicket,deleteTicketListing])


  const handleDetailsShow = (id: any, categoryId: any) => {
    setMessageTicket('')
    if (categoryId === 1) {
      navigate(`/user/dashboard/support/${id}`)
      setCommonInputFieldShow(!CommonInputFieldshow)
      setOpenTicketDetails(true)
      setGetTicketId(id)
    } else if (categoryId === 2) {
      navigate(`/user/dashboard/offence/${id}`)
      setOpenTicketDetails(false)
      setOffenceTicketCreate(true)
      setGetTicketId(id)
    }
    document.title="Ticket Details - Gogtas"
  }

 
  const handleeditClose = () => {
    setAnchorEl1(null)
  }

  const editopen = Boolean(anchorEl1)
  const editid = editopen ? 'simple-popover' : undefined


  return (
    <Box sx={{ height: '88vh', overflowY: 'auto' }} >
      <Box sx={{ position: 'relative'  }}>
        {loading ? (

          <Box sx={{
            paddingLeft: '20px', alignItems: 'center', justifyContent: 'center', display: ' flex',
            height: "85vh"
          }}>
            <div className="loading">Loading...</div>
          </Box>
        ) : all1Data.length === 0 ? (
          <>
            <Grid sx={{alignItems: 'center', justifyContent: 'center', display: ' flex',
            height: "85vh"}}>
              <Typography >Tickets not available</Typography>
            </Grid>
          </>
        ) : (
          all1Data.map((data: any, index: number) => {
            const date = new Date(data.createdAt)
            const formatted_date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} `

            return (
              <Box
                key={index}
                sx={{ padding: '12px 15px 12px 15px', borderBottom: '1px solid #e5e5e5', cursor: 'pointer' }}
                onClick={() => {
                  handleDetailsShow(data.ticketId, data.category.categoryId)
                }}
              >
                <Grid container justifyContent={'space-between'} alignItems={'center'} sx={{ paddingBottom: '6px' }}>
                  <Grid item>
                    <Grid item sx={{ lineHeight: '1' }}>
                      <Tooltip title={data.title.length > 20 ? data.title : ''}>
                        <Typography sx={{ fontFamily: 'Mazzard', fontWeight: '500', color: '#444', fontSize: '16px' }}>
                          {data.title.length > 20 ? `${data.title.substring(0, 20)}...` : data.title}
                        </Typography>
                      </Tooltip>
                    </Grid>
                   
                  </Grid>
                  <Grid item>
                    <Typography
                      variant='body2'
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: '500',
                        fontSize: '12px',
                        color: 'rgba(42, 58, 81, 0.53)'
                      }}
                    >
                      {formatted_date}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent={'space-between'} sx={{ padding: '' }}>
                  <Grid item sx={{ lineHeight: '1' }}>
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                      <Typography
                        className={data.status}
                        sx={{
                          fontSize: '12px',
                          color:
                            data.status === 1
                              ? '#03B8DB'
                              : data.status === 2
                                ? '#FF8A2B'
                                : data.status === 3
                                  ? 'gray'
                                  : data.status === 4
                                    ? 'purple'
                                    : 'green',

                          textTransform: 'capitalize',
                          '&:hover': {
                            color:
                              data.status === 1
                                ? '#03B8DB'
                                : data.status === 2
                                  ? '#FF8A2B'
                                  : data.status === 3
                                    ? 'gray'
                                    : data.status === 4
                                      ? 'purple'
                                      : 'green'
                          }
                        }}
                      >
                        {data.status === parseInt(TICKET_STATUS.OPEN)
                          ? 'open'
                          : data.status === parseInt(TICKET_STATUS.PENDING)
                            ? 'pending'
                            : data.status === parseInt(TICKET_STATUS.CLOSED)
                              ? 'closed'
                              : data.status === parseInt(TICKET_STATUS.WAITING_ON_CUSTOMER)
                                ? 'Waiting on customer'
                                : 'Waiting on Third party'}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )
          })

        )}
      </Box>
      {/* //edit popover */}
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
        className='viewPopup'
      >
        <EditPopover handleeditClose={handleeditClose} getTicketId={getTicketId} />
      </Popover>
      {/* //end edit popover */}
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </Box>
  )
}

export default TicketListing
