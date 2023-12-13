// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CardActions from '@mui/material/CardActions'
import AddTicket from '../../../assets/Images/user_Icons/light/add-circle.svg'
import { fieldwithspecl } from 'src/pages/util/validationall'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useFormik } from 'formik'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import TextField from '@mui/material/TextField'
import DatePicker from '@mui/lab/DatePicker'

//import { DatePicker } from '@mui/x-date-pickers/DatePicker'




//import CustomInput from 'src/pages/user/police/PickersCustomInput'
/* import { DateType } from 'src/types/forms/reactDatepickerTypes'
import TextField from '@mui/material/TextField'
import AdapterDateFns from '@mui/lab/AdapterDateFns' */



// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import OutlinedInput from '@mui/material/OutlinedInput'
import * as yup from 'yup'
import OrganisationContext from 'src/context/OrganisationProvider'
import TicketContext from 'src/context/TicketProvider'

/* import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider' */


/* import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer' */

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

/* const minDate = new Date('2020-01-01T00:00:00.000');
const maxDate = new Date('2034-01-01T00:00:00.000');
 */

const AddProperty = ({ getOffenceTicketId }: any) => {
 
  const [show, setShow] = useState<boolean>(false)
  const { setpropertyCount } = React.useContext<any>(OrganisationContext)

  //const [date, setDate] = React.useState<Date | null>(new Date());

  const [year, setYear] = React.useState<Date | null>(new Date());
  const [month, setMonth] = React.useState<Date | null>(new Date());

  /* const [loader, setLoader] = useState(false)
  const [allLocalData, setAllLocalData] = useState<any>([]) */

  const { addpropertyData, setaddpropertyData } = React.useContext<any>(TicketContext)



  //const [year, setYear] = useState<DateType>(new Date()) 


  const schema = yup.object().shape({
    model: fieldwithspecl,
    color: fieldwithspecl,
    lpvin: fieldwithspecl,
    state: fieldwithspecl
  })

  const formik = useFormik({
    initialValues: {
      model: '',
      color: '',
      lpvin: '',
      state: '',
      make:'',
      plate:''
    },
    validationSchema: schema,
    onSubmit: () => {
      {
        handleproperty()
      }
    }
  })

  const handleproperty = async () => {
    const requestData: any = {
      
      model: formik.values.model,
      make: formik.values.make,
      plate: formik.values.plate,
      color: formik.values.color,
      lpvin: formik.values.lpvin,
      state: formik.values.state,
      year: year,
      month: month,
      id: new Date().getTime().toString()
    }
    if (getOffenceTicketId && getOffenceTicketId > 0) {
      if (addpropertyData && addpropertyData.length > 0) {
        setaddpropertyData([...addpropertyData, requestData])
        setpropertyCount(addpropertyData.length + 1)

      }
      else {
        setaddpropertyData([requestData])
        setpropertyCount(1)

      }
    }
    else {
      setaddpropertyData([...addpropertyData, requestData])
      setpropertyCount(addpropertyData.length + 1)
    }
    formik.resetForm()
    setShow(false)
  }

  useEffect(() => {
    handleproperty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('propertyData') || '{}')
    setAllLocalData(localData)
    setLoader(false)
    setEditFlagProperty(false)
  }, [loader, editflagproperty]) */

  return (
    <>
      <Card>
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f6f8f9',
            padding: '0px 20px',
            border: '1px solid lightgray'
          }}
        >
          <Grid item>
            <h3>Property Info</h3>
          </Grid>
          <Grid item>
            <CardActions sx={{ justifyContent: 'end', padding: '0' }}>
              <Button
                variant='contained'
                endIcon={<img src={AddTicket} alt='addticket' style={{ height: '20px', width: '20px' }} />}
                onClick={() => setShow(true)}
              >
                Add
              </Button>
            </CardActions>
          </Grid>
        </Grid>
        <Grid item>
          <TableContainer sx={{ maxHeight: 440, border: '1px solid lightgray' }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>State</TableCell>
{/*                   <TableCell>Year</TableCell>
 */}               
               </TableRow>
              </TableHead>
              <TableBody>
                {console.log(addpropertyData)}
                {addpropertyData.length > 0 ? (
                  addpropertyData.map((item: any, id: any) => {
                    return (
                      <>
                        <TableRow key={id} hover role='checkbox' tabIndex={-1}>
                          <TableCell key={id}>{item.model}</TableCell>
                          <TableCell key={id}>{item.color}</TableCell>
                          <TableCell key={id}>{item.state}</TableCell>
{/*                           <TableCell key={id}>{item.year}</TableCell>
 */}                        </TableRow>
                      </>
                    )
                  })
                ) : (
                  <Typography sx={{ marginLeft: '15px' }}>No record found</Typography>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Dialog
          fullWidth
          open={show}
          maxWidth='md'
          scroll='body'
          onClose={() => setShow(false)}
          TransitionComponent={Transition}
          onBackdropClick={() => setShow(false)}
        >
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
              <IconButton
                size='small'
                onClick={() => setShow(false)}
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
              <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Make</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Make'
                      placeholder='Make'
                      name='make'
                      value={formik.values.make}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.make && formik.touched.make)}
                    />
                  </FormControl>
                </Grid>
                
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Model</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Model'
                      placeholder='Model'
                      name='model'
                      value={formik.values.model}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.model && formik.touched.model)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                      views={['year']}
                      label="Year only"
                      value={year}
                      onChange={(newValue:any) => {
                        setYear(newValue);
                      }}
                      renderInput={(params:any) => <TextField {...params} helperText={null} />}
                    />
                </LocalizationProvider>
                </FormControl>
                 </Grid>

                {/* 
               <Grid item xs={12} md={6}>
               <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label='Date of Report* '
                            disablePast
                            value={year}
                            onChange={newValue => setYear(newValue)}
                            renderInput={params => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                </Grid>  */}

                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Color</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Color'
                      placeholder='Color'
                      name='color'
                      value={formik.values.color}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.color && formik.touched.color)}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>VIN</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='VIN'
                      placeholder='VIN'
                      name='lpvin'
                      value={formik.values.lpvin}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.lpvin && formik.touched.lpvin)}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Plate</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Plate'
                      placeholder='Plate'
                      name='plate'
                      value={formik.values.plate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.plate && formik.touched.plate)}
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
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.state && formik.touched.state)}
                    />
                  </FormControl>
                </Grid>
                 <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label='Year and Month '
                            views={['year', 'month']}
                            disablePast
                            value={month}
                            onChange={newValue => setMonth(newValue)}
                            renderInput={params => <TextField {...params} />}
                          />
                        </LocalizationProvider>
         </FormControl>
                </Grid> 
              </Grid>
              <DialogActions sx={{ /* pb: { xs: 8, sm: 12.5 }, */ justifyContent: 'center', mt: 10 }}>
                <Button variant='contained' sx={{ marginRight: 1 }} type='submit'>
                  Submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
                  Discard
                </Button>
              </DialogActions>
            </DialogContent>
          </form>
        </Dialog>
      </Card>
    </>
  )
}

export default AddProperty
