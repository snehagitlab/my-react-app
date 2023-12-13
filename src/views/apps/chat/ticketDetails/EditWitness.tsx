import React, { Fragment } from 'react'
import IconButton from '@mui/material/IconButton'
import { Grid, Typography, Button, MenuItem, Select, OutlinedInput, TextField } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import DialogContent from '@mui/material/DialogContent'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

//icon
import Close from 'mdi-material-ui/Close'


//import react-router
import { useParams } from 'react-router-dom'

//import component
import TicketContext from 'src/context/TicketProvider'

//  env file
const BASE_URL = process.env.REACT_APP_BASE_URL

// toast popup
import { toast } from 'react-toastify'

function EditWitness() {
  const { id } = useParams()
  const {
    setEditTicket,
    setEditWitnessDialogue,
    suspectData,
    victimData,
    witnessData,
    propertyData,
    editWitnessValue,
    setEditWitnessValue,
    setBasicPicker,
    basicPicker,
    caseInfo
  } = React.useContext<any>(TicketContext)


  //onchange through get value
  const handleChange = (event: any) => {
    const { name, value } = event.target
    setEditWitnessValue({ ...editWitnessValue, [name]: value })
  }

  //here edit api calling
  const handleEditOffence = async (wid: any) => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(`${BASE_URL}/v1/ticket`)
    const requestData = {}
    Object.assign(requestData, {
      ticketId: id,
      otherFields: {
        witnessData: witnessData.map((item: any) => {
          if (item.id == wid) {
            return {
              ...item,
              id: editWitnessValue.id,
              suspect: editWitnessValue.suspect,
              fname: editWitnessValue.fname,
              lname: editWitnessValue.lname,
              address: editWitnessValue.address,
              city: editWitnessValue.city,
              drivesLicense: editWitnessValue.drivesLicense,
              eyes: editWitnessValue.eyes,
              hair: editWitnessValue.hair,
              height: editWitnessValue.height,
              weight: editWitnessValue.weight,
              phone: editWitnessValue.phone,
              race: editWitnessValue.race,
              sex: editWitnessValue.sex,
              socialSecurity: editWitnessValue.socialSecurity,
              state: editWitnessValue.state,
              zip: editWitnessValue.zip,
              dateofbirth: basicPicker
            }
          } else {
            return item
          }
        }),
        victimData: victimData,
        propertyData: propertyData,
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
        setEditWitnessDialogue(false)
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
          onClick={() => setEditWitnessDialogue(false)}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Close />
        </IconButton>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Witness Information
          </Typography>
        </Box>
        <Grid container spacing={6}>
          {/* <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id='status-select'>Suspect*</InputLabel>
              <Select
                fullWidth
                labelId='status-select'
                label='Suspect*'
                name='suspect'
                id='suspect'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.suspect}
              >
                <MenuItem value='1'>Smith Martinez</MenuItem>
                <MenuItem value='2'>Jhonsan Hernandez</MenuItem>
                <MenuItem value='3'>Willams Thomas</MenuItem>
                <MenuItem value='4'>Lopez Taylor</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>First Name*</InputLabel>
              <OutlinedInput
                fullWidth
                label='fname'
                placeholder='fname'
                name='fname'
                value={editWitnessValue && editWitnessValue.fname}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Last Name*</InputLabel>
              <OutlinedInput
                fullWidth
                label='lname'
                placeholder='lname'
                name='lname'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.lname}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Address*</InputLabel>
              <OutlinedInput
                fullWidth
                label='address*'
                name='address'
                id='address'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.address}
              />
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Phone No*</InputLabel>
              <OutlinedInput
                fullWidth
                label='Phone No*'
                placeholder='Phone No'
                name='phone'
                id='phone'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.phone}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ width: "100%" }}>
              <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Date of Birth '
                  value={basicPicker}
                  onChange={newValue => setBasicPicker(newValue)}
                  renderInput={params => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='status-select'>Race</InputLabel>
              <Select
                fullWidth
                labelId='status-select'
                label='race'
                name='race'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.race}
              >
                <MenuItem value='B'>Black or African American</MenuItem>
                <MenuItem value='A'>Asian</MenuItem>
                <MenuItem value='N'>Native Americans and Alaska Natives</MenuItem>
                <MenuItem value='W'>White</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='status-select'>Sex</InputLabel>
              <Select
                fullWidth
                labelId='status-select'
                label='Status'
                name='sex'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.sex}
              >
                <MenuItem value='M'>Male</MenuItem>
                <MenuItem value='F'>Female</MenuItem>
                <MenuItem value='O'>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='status-select'>Hair</InputLabel>

              <Select
                fullWidth
                labelId='status-select'
                label='Status'
                name='hair'
                id='hair'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.hair}
              >
                <MenuItem value='S'>Straight</MenuItem>
                <MenuItem value='W'>Wavy</MenuItem>
                <MenuItem value='C'>Curly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel id='status-select'>Eyes</InputLabel>
              <Select
                fullWidth
                labelId='status-select'
                label='Status'
                name='eyes'
                id='eyes'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.eyes}
              >
                <MenuItem value='Black'>Black</MenuItem>
                <MenuItem value='Blue'>Blue</MenuItem>
                <MenuItem value='Hazel'>Hazel</MenuItem>
                <MenuItem value='Gray'>Gray</MenuItem>
                <MenuItem value='Violet'>Violet</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>EHT</InputLabel>
              <OutlinedInput
                label='EHT'
                name='eht'
                id='eht'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.eht}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Occupation*</InputLabel>
              <OutlinedInput
                label='Occupation*'
                name='occupation'
                id='occupation'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.occupation}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Employer</InputLabel>
              <OutlinedInput
                label='Employer'
                name='employer'
                id='employer'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.employer}
              />
            </FormControl>
          </Grid> */}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Drivers License</InputLabel>
              <OutlinedInput
                label='drivesLicense'
                name='drivesLicense'
                id='drivesLicense'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.drivesLicense}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Social Security</InputLabel>
              <OutlinedInput
                label='socialSecurity'
                name='socialSecurity'
                id='socialSecurity'
                onChange={handleChange}
                value={editWitnessValue && editWitnessValue.socialSecurity}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Height</InputLabel>
              <OutlinedInput
                label='height'
                name='height'
                id='height'
                value={editWitnessValue && editWitnessValue.height}
                onChange={handleChange}

              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Weight</InputLabel>
              <OutlinedInput
                label='weight'
                name='weight'
                id='weight'
                value={editWitnessValue && editWitnessValue.weight}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <OutlinedInput
                label='city'
                name='city'
                id='city'
                value={editWitnessValue && editWitnessValue.city}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <OutlinedInput
                label='state'
                name='state'
                id='state'
                value={editWitnessValue && editWitnessValue.state}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>ZipCode</InputLabel>
              <OutlinedInput
                label='zip'
                name='zip'
                id='zip'
                value={editWitnessValue && editWitnessValue.zip}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        </Grid>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <Button
            variant='contained'
            sx={{ marginRight: 1 }}
            type='submit'
            onClick={() => handleEditOffence(editWitnessValue.id)}
          >
            Submit
          </Button>
          <Button variant='outlined' color='secondary'>
            Reset
          </Button>
        </DialogActions>
      </DialogContent>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </Fragment>
  )
}

export default EditWitness
