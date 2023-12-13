import { useState } from 'react'
import { FormControl, InputLabel, OutlinedInput, Box, IconButton } from '@mui/material'

import Grid from '@mui/material/Grid'
// import { ToastContainer } from 'react-toastify'
import Divider from '@mui/material/Divider'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import Addsuspect from 'src/pages/user/police/addSuspect'
import Scrolling from '../../../assets/Images/user_Icons/light/scrolling.svg'

const OffenceTicket = ({ offenceTicketsStyle, handleoffenceSliderClose }: any) => {
  // ** State
  const [basicPicker, setBasicPicker] = useState<Date | null>(new Date())

  return (
    <>
      <Box className='pendingTickets' sx={offenceTicketsStyle}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '22%' }}></Box>
          <Box
            sx={{
              height: 'calc(100vh - 1px)',
              overflowY: 'auto',
              width: '78%',
              boxShadow: '0 0 60px lightgrey',
              background: '#f6f8f9',
              position: 'relative'
            }}
          >
            <IconButton
              size='small'
              onClick={handleoffenceSliderClose}
              sx={{ color: 'text.secondary', position: 'absolute', left: '-1px', top: '15px' }}
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
              <Box sx={{ width: '80%' }}>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={12}>
                    <h3>Case Info</h3>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Case Number*</InputLabel>
                      <OutlinedInput label='Case Number' name='casenumber' id='casenumber' />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label='Date of Report '
                        value={basicPicker}
                        onChange={newValue => setBasicPicker(newValue)}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Offence</InputLabel>
                      <OutlinedInput label='offence' name='offence' id='offence' />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label='Date of Offence '
                        value={basicPicker}
                        onChange={newValue => setBasicPicker(newValue)}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 5 }} />
                  </Grid>
                  {/* VICTIM INFO */}
                  <Grid item xs={12} md={6} sx={{ mb: 10 }}>
                    <h3>Victim Info</h3>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Addsuspect />
                  </Grid>
                  <Grid item xs={12} md={12}></Grid>
                  {/* Suspect INFO */}
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 5 }} />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mb: 10 }}>
                    <h3>Suspect Info</h3>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {/* <Grid item>
                        <CardActions sx={{ justifyContent: 'end', padding: '0' }}>
                        <Button
                        endIcon={<img src={AddTicket} alt='addticket' />}
                            size='large'
                            type='submit'
                            sx={{ mr: 2, ml: 70, textTransform: 'capitalize' }}
                            variant='contained'
                            
                        >
                            Add 
                        </Button>

                        </CardActions>
                        </Grid> */}
                    <Addsuspect />
                  </Grid>
                  <Grid item xs={12} md={12}></Grid>

                  {/* Property Info */}
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 5 }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h3>Property Info</h3>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Addsuspect />
                  </Grid>
                  <Grid item xs={12} md={12}></Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 5 }} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Box>
        </Box>
      </Box>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}
export default OffenceTicket
