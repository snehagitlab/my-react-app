import React, { Fragment } from 'react'
import IconButton from '@mui/material/IconButton'
import { Grid, Typography, Button, OutlinedInput, TextField } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import DialogContent from '@mui/material/DialogContent'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

//import react-router-dom
import { useParams } from 'react-router-dom'

//icon
import Close from 'mdi-material-ui/Close'

//import component
import TicketContext from 'src/context/TicketProvider'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL

// toast popup
import { toast } from 'react-toastify'

function EditProperty() {
  const { id } = useParams()
  const {
    setEditTicket,
    setEditPropertyDialogue,
    suspectData,
    victimData,
    witnessData,
    propertyData,
    setEditPropertyValue,
    editPropertyValue,
    caseInfo,
    basicPicker,
    setBasicPicker
  } = React.useContext<any>(TicketContext)


  //onchange through get value
  const handleChange = (event: any) => {
    const { name, value } = event.target
    setEditPropertyValue({ ...editPropertyValue, [name]: value })
  }


  //here edit api calling
  const handleProperty = async (pid: any) => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(`${BASE_URL}/v1/ticket`)
    const requestData = {}
    Object.assign(requestData, {
      ticketId: id,
      otherFields: {
        propertyData: propertyData.map((item: any) => {
          if (item.id == pid) {
            return {
              ...item,
              id: editPropertyValue.id,
              vehical: editPropertyValue.vehical,
              model: editPropertyValue.model,
              color: editPropertyValue.color,
              lpvin: editPropertyValue.lpvin,
              state: editPropertyValue.state,
              make: editPropertyValue.make,
              month: editPropertyValue.month,
              plate: editPropertyValue.plate,
              year: basicPicker,
            }
          } else {
            return item
          }
        }),
        witnessData: witnessData,
        victimData: victimData,
        suspectData: suspectData,
        caseInfo: caseInfo
      }
    })
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
        setEditPropertyDialogue(false)
        setEditTicket(result)
      } else {
        toast.error(result.message)
      }
    } catch (ex: any) {
      toast.error(ex.message)
    }
  }

  // end edit api calling

  return (
    <Fragment>
      {/* imprt edit dialogue */}

      <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
        <IconButton
          size='small'
          onClick={() => setEditPropertyDialogue(false)}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Close />
        </IconButton>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Property Information
          </Typography>
        </Box>
        <Grid container spacing={6}>
          {/* <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Vehical</InputLabel>
              <OutlinedInput
                fullWidth
                label='Vehical'
                placeholder='Vehical'
                name='vehical'
                type='text'
                value={editPropertyValue && editPropertyValue.vehical}
                onChange={handleChange}
              />
            </FormControl>
          </Grid> */}
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <OutlinedInput
                fullWidth
                label='Model'
                placeholder='Model'
                name='model'
                type='text'
                value={editPropertyValue && editPropertyValue.model}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <OutlinedInput
                fullWidth
                label='Color'
                placeholder='color'
                name='color'
                type='text'
                value={editPropertyValue && editPropertyValue.color}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>VIN</InputLabel>
              <OutlinedInput
                fullWidth
                label='LP/VIN'
                placeholder='LP/VIN'
                name='lpvin'
                value={editPropertyValue && editPropertyValue.lpvin}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <OutlinedInput
                fullWidth
                label='State'
                placeholder='State'
                name='state'
                value={editPropertyValue && editPropertyValue.state}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Make</InputLabel>
              <OutlinedInput
                fullWidth
                label='make'
                placeholder='make'
                name='make'
                value={editPropertyValue && editPropertyValue.make}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          {/* <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Year only</InputLabel>
              <OutlinedInput
                fullWidth
                label='State'
                placeholder='State'
                name='state'
              />
            </FormControl>
          </Grid> */}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ width: "100%" }}>
              <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Date'
                  value={basicPicker}
                  onChange={newValue => setBasicPicker(newValue)}
                  renderInput={params => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Plate</InputLabel>
              <OutlinedInput
                fullWidth
                label='State'
                placeholder='State'
                name='state'
                value={editPropertyValue && editPropertyValue.state}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          {/* <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Year and Month</InputLabel>
              <OutlinedInput
                fullWidth
                label='State'
                placeholder='State'
                name='state'
              />
            </FormControl>
          </Grid> */}
        </Grid>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center', mt: 10 }}>
          <Button
            variant='contained'
            sx={{ marginRight: 1 }}
            type='submit'
            onClick={() => handleProperty(editPropertyValue.id)}
          >
            Submit
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => setEditPropertyDialogue(false)}>
            Discard
          </Button>
        </DialogActions>
      </DialogContent>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </Fragment>
  )
}

export default EditProperty
