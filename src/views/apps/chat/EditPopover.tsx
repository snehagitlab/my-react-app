import React, { useState, useEffect } from 'react'
import { Grid, Box, FormControl, MenuItem, Select, InputLabel } from '@mui/material'

import TextField from '@mui/material/TextField'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

// import images
import Closemodal from 'src/assets/Images/user_Icons/light/close_modal.png'

// import 3rd party
import { toast } from 'react-toastify'

// import Polygon from 'src/assets/Images/user_Icons/light/Polygon.png'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION


import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TicketContext from 'src/context/TicketProvider'

function Editpopover({ handleeditClose, getTicketId }: any) {
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [dueDate, setDuedate] = useState<Date | null>()
  const [assingerid, setAssignerId] = useState()
  const { setEditTicket, editTicket, ticketData } = React.useContext<any>(TicketContext)
  const [isUpdate, setIsUpdate] = useState(false)
  const [agentLists, setAgentLists] = useState([])
  const [record, setRecord] = React.useState<any>(10)
  const [createdDate, setCreatedDate] = useState<Date | null>()


  //fetch agent api calling
  const fetchAgent = async () => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/user/pick/list/?pageNumber=1&recordsPerPage=${record}&search={"roleId":[2,3]}&showAll=true`
    )
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
      setAgentLists(result.payload.data)
      setRecord(result.pager.totalRecords)
    }
  }

  useEffect(() => {
    fetchAgent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])


  const handleStatus = (event: any) => {
    setIsUpdate(true)
    setStatus(event.target.value)
  }
  const handlePriority = (event: any) => {
    setIsUpdate(true)
    setPriority(event.target.value)
  }

  const handleAssignerId = (event: any) => {
    setIsUpdate(true)
    setAssignerId(event.target.value)
  }

  const handleDuedate = (date: Date | null) => {
    setIsUpdate(true)
    setDuedate(date)
  }

  const handleClickpopover = async () => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')

    const url = new URL(`${BASE_URL}/v1/ticket/detail?ticketId=${getTicketId}`)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    const result = await response.json()

    setStatus(result.payload.status)
    setPriority(result.payload.priority)
    setDuedate(result.payload.dueDate)
    setAssignerId(result.payload.toUser.userId)
    setCreatedDate(result.payload.createdAt)
  }

  //TICKET UPDATE API
  const handleTicketUpdate = async (id: any) => {
    if (isUpdate === false) {
      toast.error('Please Update Ticket Details')
    } else {
      if(createdDate && dueDate && new Date(createdDate) > new Date(dueDate) )
      {toast.error('Due date is greater than created date')}
      else {
      const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
      const url = new URL(`${BASE_URL}/v1/ticket`)
      const requestData = {}
      Object.assign(requestData, { ticketId: id, status: status, priority: priority, to: assingerid, dueDate: dueDate })
      try {
        const response = await fetch(url.toString(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${UserData.token}`
          },
          body: JSON.stringify(requestData)
        })
        const result = await response.json()
        if (result.status == 200) {
          toast.success('Ticket details updated successfully')
          setEditTicket(result.payload)
          handleeditClose()
          handleClickpopover()
        } else {
          toast.error(result.message)
        }
      } catch (ex: any) {
        toast.error(ex.message)
      }
    }
    }
  }

  const handleReset = () => {
    setStatus(ticketData.status)
    setPriority(ticketData.priority)
    setDuedate(ticketData.dueDate)
    setAssignerId(ticketData.toUser.userId)
  }

  useEffect(() => {
    handleClickpopover()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTicketId, editTicket])

  return (
    <>
      <Box className='pendingTktPopup'>
        <Grid container justifyContent={'space-between'} sx={{ padding: ' 19px 0px 20px 0px', alignItems: 'center' }}>
          <Grid item>
            <Typography sx={{ fontSize: '18px', color: '#2A3A51', fontWeight: '600' }}>Tickets Action</Typography>
          </Grid>
          <Grid item>
            <img
              alt="close-modal"
              src={Closemodal}
              onClick={handleeditClose}
              style={{ width: '32px', height: '32px', cursor: 'pointer' }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={5} justifyContent={'center'}>
          <Grid item sm={6} xs={6} md={6}>
            <FormControl fullWidth sx={{ marginTop: '12px' }}>
              <InputLabel id='demo-simple-select-helper-label'>Change Status</InputLabel>
              <Select
                label='Change Status'
                value={status && status}
                id='demo-simple-select-helper'
                labelId='demo-simple-select-helper-label'
                onChange={e => handleStatus(e)}
              >
                <MenuItem value={1}>Open</MenuItem>
                <MenuItem value={2}>Pending</MenuItem>
                <MenuItem value={3}>Closed</MenuItem>
                <MenuItem value={4}>Waiting On Customer</MenuItem>
                <MenuItem value={5}>Waiting On Third Party</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={6} md={6}>
            <FormControl fullWidth sx={{ marginTop: '12px' }}>
              <InputLabel id='demo-simple-select-helper-label'>Change Priority</InputLabel>
              <Select
                label='Change Priority'
                value={priority && priority}
                id='demo-simple-select-helper'
                labelId='demo-simple-select-helper-label'
                onChange={e => handlePriority(e)}
              >
                <MenuItem value={1}>Urgent</MenuItem>
                <MenuItem value={2}>High</MenuItem>
                <MenuItem value={3}>Medium</MenuItem>
                <MenuItem value={4}>Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={12} xs={12} sx={{ paddingTop: '19px !important' }}>
            <FormControl fullWidth sx={{ marginTop: '12px' }}>
              <InputLabel id='demo-simple-select-helper-label'>Change Assignee</InputLabel>

              {agentLists && assingerid && (
                <Select
                  label='Change Assignee'
                  value={assingerid && assingerid}
                  id='demo-simple-select-helper'
                  labelId='demo-simple-select-helper-label'
                  onChange={(e: any) => handleAssignerId(e)}
                >
                  {agentLists.length === 0 ? (
                    <Typography sx={{ textAlign: 'center' }}>NO RECORD FOUND</Typography>
                  ) : agentLists.map((item: any, id: number) => {
                    return (
                      <MenuItem sx={{ textTransform: 'capitalize' }} key={id} value={item.userId}>
                        {item.fname} {item.lname}
                      </MenuItem>
                    )
                  })}
                </Select>
              )}
            </FormControl>
          </Grid>
          <Grid item sm={12} xs={12} sx={{ paddingTop: '19px !important' }}>
            <FormControl fullWidth sx={{ marginTop: '12px' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label='Due Date'
                  value={dueDate}
                  onChange={(newValue: any) => handleDuedate(newValue)}
                  renderInput={params => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item sm={5} xs={5} sx={{ paddingTop: '25px !important',paddingBottom: '25px !important' }}>
            <Button
              fullWidth
              variant='outlined'
              sx={{
                fontWeight: '500',
                fontSize: '13px',
                borderRadius: '9px',
                filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                p: '13px',
                textTransform: 'capitalize'
              }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Grid>

          <Grid item sm={5} xs={5} sx={{ paddingTop: '25px !important' }}>
            <Button
              fullWidth
              variant='contained'
              sx={{
                fontWeight: '500',
                fontSize: '13px',
                borderRadius: '9px',
                boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)',
                p: '13px',
                textTransform: 'capitalize'
              }}
              onClick={() => handleTicketUpdate(getTicketId)}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}

export default Editpopover
