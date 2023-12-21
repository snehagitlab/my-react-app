
import React, { useState, useEffect, useCallback } from 'react'

import {
  Grid,
  Box,
  Typography,
  IconButton,
  Button,
  Badge,
  FormControl,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material'
import { InputAdornment, InputBase } from '@mui/material'

//import component
import SingleTicket from './SingleTicket'

// import images
import Scrolling from '../../../assets/Images/user_Icons/light/scrolling.png'
import Search from 'src/assets/Images/user_Icons/light/search-normal.png'

// third party pagination
import TablePagination from '@mui/material/TablePagination'

//  Config file
import { API_PATHS, SOCKET_TICKET_REFRESH } from 'src/config/api.config'

//import context
import TicketContext from '../context/TicketProvider'
import { socket } from 'src/views/apps/chat/chatContent/SocketConnection'

//env file
const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const API_VERSION = import.meta.env.VITE_APP_API_VERSION

const PendingTickets = () => {
  //  hook
  const { createTicketResponse, editTicket, setLoading, loading, pendingTicketsStyle, handleSliderClose, deleteTicketListing } =
    React.useContext<any>(TicketContext)
  const [allData, setAllData] = useState([])
  const [activeButton, setActiveButton] = useState('1')
  const [searching, setSearching] = useState('')
  const [count, setCount] = useState<any>('')
  const [storeStatusname, setStoreStatusname] = useState('all')
  const [urlStatus, setUrlStatus] = useState<any>()
  const [userRole, setUserRole] = useState<any>()

  // pagination hook
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(4)
  const [record, setRecord] = useState<any>(0)


  //pagination event
  const handleChange = (event: any) => {
    setSearching(event.target.value)
    if (searching) {
      setPage(0)
    }
  }




  const debounce = (func: any) => {
    let timer: any;

    return function (this: any, ...args: any[]) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        func.apply(this, args)
      }, 300);
    }
  }

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

      console.log(response?.data?.to)
      if (loggedInUserId == response?.data?.to) {
        fetchAllTicketsData()
        countTicket()
      }
    }
    if (response?.type == SOCKET_TICKET_REFRESH.NEW_TICKET_UPDATED && response?.data) {

      if (loggedInUserId == response?.data?.to) {
        fetchAllTicketsData()
        countTicket()
      }
      if (loggedInUserId == response?.data?.newTo && response?.data?.to != response?.data?.newTo) {
        fetchAllTicketsData()
        countTicket()
      }
    }
  }, [response])



  //usecallback used in debouncing function
  const optimisedVersion = useCallback(debounce(handleChange), [])

  //filtering onChnage for status
  const handleClick = (e: any) => {
    // const { name } = e.target
    const { id } = e.target
    const { value } = e.target
    setStoreStatusname(value)
    setActiveButton(id)

    if (id === '2') {
      setUrlStatus(',' + `"status": ${id}`)
    }
    if (id === '1') {
      setUrlStatus('')
    }

    setPage(0)
  }

  //filetring onchnage for filtering
  const handleClickdueToday = (e: any) => {
    const { name } = e.target
    const { id } = e.target
    const { value } = e.target
    setStoreStatusname(value)
    setActiveButton(name)
    setPage(0)
    if (id === '2') {
      setUrlStatus(',' + `"filterType": ${id}`)
    }
    if (id === '1') {
      setUrlStatus(',' + `"filterType": ${id}`)
    }
  }

  // ticket listing api call
  const fetchAllTicketsData = async () => {
    if (urlStatus === undefined) {

      setLoading(true)

      const url = new URL(
        `${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}`
      )
      const params: any = { pageNumber: page + 1, recordsPerPage: rowsPerPage, search: JSON.stringify({ "title": searching }) }
      Object.keys(params).forEach((key: any) => url.searchParams.append(key, params[key]))
      const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${UserData.token}`
        }
      })
      if (response.status === 200) {
        setLoading(false)
        const result = await response.json()
        setAllData(result.payload.data)
        setRecord(result?.pager?.totalRecords)
      }

    } else {
      if (rowsPerPage > 0) {
        setLoading(true)
        const url = new URL(
          `${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}`
        )
        const params: any = { pageNumber: page + 1, recordsPerPage: rowsPerPage, search: `{"title":"${searching}"${urlStatus},"categoryId":1}` }
        Object.keys(params).forEach((key: any) => url.searchParams.append(key, params[key]))
        const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${UserData.token}`
          }
        })
        if (response.status === 200) {
          setLoading(false)
          const result = await response.json()
          setAllData(result?.payload?.data)
          setRecord(result?.pager?.totalRecords)
        }
      }
    }
  }

  //fetch ticket counting
  const countTicket = async () => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/status/count`)
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
      if (result.payload.typeWise.length > 0) {
        setCount(result.payload)
      }
      else { setCount({ pending: 0, all: 0, typeWise: [{ "categoryId": 1, "count": 0 }], dueToday: 0, myTicket: 0, onPriority: 0 }) }
    }
  }
  useEffect(() => {
    fetchAllTicketsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, urlStatus, createTicketResponse, userRole, deleteTicketListing, rowsPerPage, page])

  useEffect(() => {
    countTicket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTicketResponse, editTicket, deleteTicketListing])

  useEffect(() => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    setUserRole(UserData.data.userRole[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //style active button
  const activebtn: any = {
    fontFamily: 'Mazzard',
    padding: '30px 10px',
    borderBottom: '2px solid #2D4ACD',
    color: 'rgba(42, 58, 81, 0.87)',
    fontSize: '15px',
    textTransform: 'capitalize',
    borderRadius: '0px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#FFF'
    },
    '&:focus': {
      backgroundColor: '#fff'
    }
  }

  //style desactive button
  const disactivebtn: any = {
    fontFamily: 'Mazzard',
    padding: '30px 10px',
    color: 'rgba(42, 58, 81, 0.87)',
    fontSize: '15px',
    textTransform: 'capitalize',
    borderRadius: '0px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#FFF'
    },
    '&:focus': {
      backgroundColor: '#FFF'
    }
  }
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(Number(newPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }

  const handleChangeDropdown = (e: any) => {
    const value = e.target.value
    setStoreStatusname(value)
  }

  return (
    <>
      <Box className='pendingTickets' sx={pendingTicketsStyle}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{ width: '22%', display: { xs: 'none', sm: 'none', md: 'block' } }}
            onClick={handleSliderClose}
          ></Box>
          <Box
            sx={{
              width: { xs: '100%', sm: '100%', md: '78%' },
              boxShadow: '0 0 60px lightgrey',
              background: '#f6f8f9',
              position: 'relative'
            }}
          >
            <IconButton
              size='small'
              onClick={handleSliderClose}
              sx={{
                color: 'text.secondary',
                position: 'absolute',
                left: { xs: '0px', sm: '0px', md: '-25px' },
                top: '15px'
              }}
            >
              <img src={Scrolling} alt='rightArrow' style={{ width: '41px', height: '41px', marginTop: '3px' }} />
            </IconButton>
            <Grid
              container
              alignItems={'center'}
              justifyContent={'space-evenly'}
              sx={{
                background: 'white',
                borderBottom: '1px solid lightgray'
              }}
            >
              <Grid item md={2} sx={{ textAlign: 'center', display: { md: 'block', sm: 'none', xs: 'none  ' } }}>
                <Button
                  onClick={handleClick}
                  value='pending'
                  name='2'
                  id='2'
                  sx={activeButton === '2' ? activebtn : disactivebtn}
                >
                  Pending
                  <Badge
                    badgeContent={count && count.pending > 0 ? count.pending : '0'}
                    id='2'
                    onClick={handleClick}
                    className='filtering-badge'
                    color='primary'
                  />
                  {/* <span className='btnLabel' id='2' style={btnLabelStyle}>
                    {count && count.pending}
                  </span> */}
                </Button>
              </Grid>
              <Grid item md={2} sx={{ textAlign: 'center', display: { md: 'block', sm: 'none', xs: 'none' } }}>
                <Button
                  onClick={handleClick}
                  name='1'
                  value='all'
                  id='1'
                  sx={activeButton === '1' ? activebtn : disactivebtn}
                >
                  All Tickets
                  <Badge
                    badgeContent={count && count.typeWise[0].count > 0 ? count.typeWise[0].count : '0'}
                    className='filtering-badge'
                    color='primary'
                  />
                </Button>
              </Grid>
              <Grid item md={2} sx={{ textAlign: 'center', display: { md: 'block', sm: 'none', xs: 'none' } }}>
                <Button
                  onClick={handleClickdueToday}
                  value='due Today'
                  name='4'
                  id='2'
                  sx={activeButton === '4' ? activebtn : disactivebtn}
                >
                  Due Today
                  <Badge
                    badgeContent={count && count.dueToday > 0 ? count.dueToday : '0'}
                    className='filtering-badge'
                    color='primary'
                  />
                </Button>
              </Grid>
              <Grid item md={2} sx={{ textAlign: 'center', display: { md: 'block', sm: 'none', xs: 'none' } }}>
                <Button
                  onClick={handleClickdueToday}
                  name='5'
                  value='my'
                  id='1'
                  sx={activeButton === '5' ? activebtn : disactivebtn}
                >
                  My Tickets
                  <Badge
                    badgeContent={count && count.myTicket > 0 ? count.myTicket : '0'}
                    className='filtering-badge'
                    color='primary'
                  ></Badge>
                </Button>
              </Grid>
              {/*  <Grid item md={2} sx={{ textAlign: 'center', display: { md: 'block', sm: 'none', xs: 'none' } }}>
                <Button
                  onClick={handleClick}
                  name='6'
                  value='on priority'
                  id='6'
                  sx={activeButton === '6' ? activebtn : disactivebtn}
                >
                  On Priority
                  <Badge badgeContent={count && count.onPriority > 0 ? count.onPriority : '0'} className='filtering-badge' color='primary'></Badge>
                  
                  {/* <span className='btnLabel' style={btnLabelStyle} id='6'>
                    0
                  </span> 
                </Button>
              </Grid> */}
              <Grid
                item
                sm={6}
                xs={6}
                sx={{
                  paddingTop: '10px !important',
                  paddingBottom: '10px !important',
                  display: { md: 'none', sm: 'block', xs: 'block' }
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>Ticket Type</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Age'
                    onChange={handleChangeDropdown}
                    value={storeStatusname}
                  >
                    <MenuItem value='pending' id='2' onClick={handleClick}>
                      Pending{' '}
                      <Badge
                        badgeContent={count && count.pending > 0 ? count.pending : '0'}
                        id='2'
                        onClick={handleClick}
                        className='filtering-badge'
                        color='primary'
                      />
                    </MenuItem>
                    <MenuItem value='all' id='1' onClick={handleClick}>
                      All Tickets{' '}
                      <Badge
                        badgeContent={count && count.all > 0 ? count.all : '0'}
                        className='filtering-badge'
                        color='primary'
                      />{' '}
                    </MenuItem>
                    {/* <MenuItem value='unresponded' id='3' onClick={handleClick}>
                      Unresponded <Badge badgeContent={'0'} className='filtering-badge' color='primary'></Badge>
                    </MenuItem> */}
                    <MenuItem value='due Today' onClick={handleClickdueToday}>
                      {' '}
                      Due Today{' '}
                      <Badge
                        badgeContent={count && count.dueToday > 0 ? count.dueToday : '0'}
                        className='filtering-badge'
                        color='primary'
                      ></Badge>
                    </MenuItem>
                    <MenuItem value='my tickets' id='1' onClick={handleClickdueToday}>
                      My Tickets{' '}
                      <Badge
                        badgeContent={count && count.myTicket > 0 ? count.myTicket : '0'}
                        className='filtering-badge'
                        color='primary'
                      ></Badge>
                    </MenuItem>

                    {/*  <MenuItem value='on priority' id='6' onClick={handleClickdueToday}>
                      On Priority <Badge badgeContent={count && count.onPriority > 0 ? count.onPriority : '0'} className='filtering-badge' color='primary'></Badge>
                    </MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* {/ {/ {/ TICKETS CONTAINER /} /} /} */}
            <Grid
              container
              justifyContent='space-between'
              sx={{ padding: '23px 20px 23px 32px', alignItems: 'center' }}
            >
              <Grid item>
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 'bold', textTransform: 'capitalize', color: 'rgba(42, 58, 81, 0.87)' }}
                >
                  {activeButton === '1' ? <>All</> : storeStatusname && storeStatusname} tickets
                </Typography>
              </Grid>
              <Grid item md={8}>
                <Grid container justifyContent='end' sx={{ alignItems: 'center' }}>
                  <Grid item>
                    <InputBase
                      size='small'
                      className='searchticket-input'
                      name='search'
                      onChange={optimisedVersion}
                      sx={{
                        background: 'white',
                        borderRadius: '2rem',
                        fontSize: '13px',
                        color: 'rgba(42, 58, 81, 0.87)',
                        padding: '9px 18px 9px',
                        border: '1px solid #DCDCDC'
                      }}
                      placeholder='Search Tickets'
                      startAdornment={
                        <InputAdornment sx={{ mr: '10px' }} position='start'>
                          <img src={Search} alt='search' style={{ width: '17px', height: '17px' }} />
                        </InputAdornment>
                      }
                    />
                  </Grid>
                  <Grid item>
                    <TablePagination
                      className='pendingTicketPagination'
                      rowsPerPageOptions={[1, 2, 3, 4]}
                      component='div'
                      count={record}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{ marginLeft: '10px' }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ height: 'calc(100vh - 181px)', overflowY: 'auto' }}>
              <Grid container spacing={5} justifyContent='center' sx={{ padding: '0px 20px', marginBottom: '15px' }}>
                {loading ? (
                  <>
                    <Box sx={{ paddingLeft: '20px', alignItems: 'center', justifyContent: 'center', display: ' flex', marginTop: '20px' }}>
                      <div className="loading">Loading...</div>
                    </Box>
                  </>
                ) : allData.length === 0 ? (
                  <Typography sx={{ marginTop: '15px', textAlign: 'center' }}>No Record Found</Typography>
                ) : (
                  allData.map((item: any, id: number) => {
                    return <SingleTicket key={id} item={item} />
                  })
                )}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default PendingTickets