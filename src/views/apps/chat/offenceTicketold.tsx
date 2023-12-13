import { useState } from 'react'
import { FormControl, InputLabel, OutlinedInput, Box } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { ToastContainer } from 'react-toastify'
import Divider from '@mui/material/Divider'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import SuspectTable from 'src/views/apps/chat/suspectTable'
import AddTicket from '../../../assets/Images/user_Icons/light/add-circle.svg'
import Addsuspect from 'src/pages/user/police/addSuspect'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const OffenceTicket = ({ offenceTicketsStyle, handleoffenceSliderClose }: any) => {
  // ** State
  const [basicPicker, setBasicPicker] = useState<Date | null>(new Date())

  return (
    <>
      <Box className='pendingTickets' sx={offenceTicketsStyle}>
        <Box sx={{ overflowY: 'scroll' }}>
          <Card
            sx={{
              maxWidth: 800,
              position: 'absolute',
              left: 'calc(50% - 390px)'
            }}
          >
            <form>
              <CardContent sx={{ pt: 8, pl: 8, pr: 8, mb: 8 }}>
                <ChevronRightIcon
                  onClick={handleoffenceSliderClose}
                  sx={{ fontSize: '2.5rem', border: '1px solid lightgray', borderRadius: '30px' }}
                />
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
                  <Grid item xs={12} md={12}>
                    <SuspectTable />
                  </Grid>
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
                  <Grid item xs={12} md={12}>
                    <SuspectTable />
                  </Grid>

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
                  <Grid item xs={12} md={12}>
                    <SuspectTable />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 5 }} />
                  </Grid>
                </Grid>
              </CardContent>
            </form>
          </Card>
        </Box>
      </Box>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}
export default OffenceTicket
