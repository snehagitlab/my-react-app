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
import VictimTable from 'src/pages/user/police/victimTable'
import AddTicket from '../../../assets/Images/user_Icons/light/add-circle.svg'
import Addsuspect from 'src/pages/user/police/addSuspect'

const OffenseReportModal = () => {
  // ** State
  const [basicPicker, setBasicPicker] = useState<Date | null>(new Date())

  return (
    <>
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
              <Grid container spacing={6}>
                <Grid item xs={12} md={12}>
                  <h3 style={{ marginBottom: 0 }}>Case Info</h3>
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
                  <Grid item>
                    <CardActions sx={{ justifyContent: 'center', padding: '20' }}>
                      <Button
                        fullWidth
                        endIcon={<img src={AddTicket} alt='addticket' />}
                        size='large'
                        type='submit'
                        sx={{ mr: 2, ml: 70, textTransform: 'capitalize' }}
                        variant='contained'
                      >
                        Add
                      </Button>
                    </CardActions>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <VictimTable />
                </Grid>
                {/* Suspect INFO */}
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
                  {/*  <Grid item>
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
                <Grid item xs={12}>
                  <Divider sx={{ margin: 0, marginTop: 5 }} />
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Box>
      <ToastContainer autoClose={3000} position='bottom-right' />
    </>
  )
}
export default OffenseReportModal
