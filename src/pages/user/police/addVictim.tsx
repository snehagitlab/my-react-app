// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, useEffect, useMemo } from 'react'

// ** MUI Imports
import {
  InputLabel,
  ListSubheader,

  InputAdornment, Box
} from '@mui/material'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CardActions from '@mui/material/CardActions'
import AddTicket from '../../../assets/Images/user_Icons/light/add-circle.svg'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import Select from '@mui/material/Select'
import SearchIcon from "@mui/icons-material/Search";

import { useFormik } from 'formik'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import OutlinedInput from '@mui/material/OutlinedInput'

import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

//import { nameval,fieldwithspecl,noreq} from 'src/pages/util/validationall'

import * as yup from 'yup'

import OffenceJson from './offence.json'
import OrganisationContext from 'src/context/OrganisationProvider'
import TicketContext from 'src/context/TicketProvider'

//import {Tooltip } from '@mui/material'

//import OffenceJson from './offence.json'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const containsText = (text: any, searchText: any) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const AddVictim = ({ getOffenceTicketId }: any) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [basicPicker, setBasicPicker] = useState<Date | null>(new Date())
  const [searchText, setSearchText] = useState("")

  //const [subMenuId, setSubMenuId] = useState(0)

  const { setvictimCount } = React.useContext<any>(OrganisationContext)
  const { addvictimData, setaddvictimData } = React.useContext<any>(TicketContext)
  const allOptions = ["Smith Martinez", "Jhonsan Hernandez", "Willams Thomas", "Lopez Taylor"];

  //console.log(JSON.stringify(OffenceJson))

  const displayedOptions = useMemo(
    () => allOptions.filter((option) => containsText(option, searchText)),

    [searchText]
  );
  const schema = yup.object().shape({
    suspect: yup.string().required()

    /* 
      name: nameval,
    address:fieldwithspecl,
    phone: yup.string(),
    raes: fieldwithspecl,
    sex: noreq,
    hair: noreq,
    eyes: noreq,
    eht: noreq,
    occupation:fieldwithspecl,
    employer: fieldwithspecl */
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      suspect: '',
      address: '',
      phone: '',
      raes: '',
      sex: '',
      hair: '',
      eyes: '',
      eht: '',
      occupation: '',
      employer: '',
      driverselic: '',
      socialsecurity: ''
    },

    validationSchema: schema,

    onSubmit: () => {
      {
        handleCreateTicket()
      }
    }
  })
  const roleid = formik.values.suspect

  //console.log(roleid)

  const handleCreateTicket = async () => {
    const requestData: any = {
      name: formik.values.name,
      suspect: formik.values.suspect,
      occupation: formik.values.occupation,
      phone: formik.values.phone,
      raes: formik.values.raes,
      address: formik.values.address,
      sex: formik.values.sex,
      hair: formik.values.hair,
      eyes: formik.values.eyes,
      eht: formik.values.eht,
      employer: formik.values.employer,
      driverselic: formik.values.driverselic,
      socialsecurity: formik.values.socialsecurity,
      dateofbirth: basicPicker,
      id: new Date().getTime().toString()
    }

    if (getOffenceTicketId && getOffenceTicketId > 0) {
      if (addvictimData && addvictimData.length > 0) {
        setaddvictimData([...addvictimData, requestData])
        setvictimCount(addvictimData.length + 1)
      } else {
        setaddvictimData([requestData])
        setvictimCount(1)
      }
    } else {
      setaddvictimData([...addvictimData, requestData])
      setvictimCount(addvictimData.length + 1)
    }
    formik.resetForm()
    setShow(false)
  }

  /* const fetchAllRecordlocal = () => {
    const victimData = JSON.parse(localStorage.getItem('victimData') || '{}')
  } */

  const fetchAllJsonData = async (roleid: any) => {
    const data = OffenceJson.find((d: any) => d.id == roleid)

    if (data) {
      formik.setFieldValue('address', data.address)
      formik.setFieldValue('phone', data.phone)
      formik.setFieldValue('name', data.name)
      formik.setFieldValue('dateofbirth', data.dateofbirth)
      formik.setFieldValue('raes', data.race)
      formik.setFieldValue('sex', data.sex)
      formik.setFieldValue('hair', data.hair)
      formik.setFieldValue('eyes', data.eyes)
      formik.setFieldValue('eht', data.eht)
      formik.setFieldValue('occupation', data.occupation)
      formik.setFieldValue('employer', data.employer)
      formik.setFieldValue('driverselic', data.driverselic)
      formik.setFieldValue('socialsecurity', data.socialsecurity)
    }
  }

  useEffect(() => {
    handleCreateTicket
    fetchAllJsonData(roleid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleid])

  /*  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('victimData') || '{}')
    setAllLocalData(localData)
    setLoader(false)
    setEditFlagVictim(false)
  }, [loader, editflagvictim]) */

  return (
    <>
      <Card sx={{ padding: 0 }}>
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
            <h3>Victim Info</h3>
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
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Employer</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Occupation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addvictimData.length > 0 ? (
                  addvictimData.map((item: any, id: any) => {
                    return (
                      <>
                        <TableRow key={id} hover role='checkbox' tabIndex={-1}>
                          <TableCell key={id}>
                            {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                          </TableCell>
                          <TableCell key={id}>{item.employer}</TableCell>
                          <TableCell key={id}>{item.phone}</TableCell>
                          <TableCell key={id}>{item.occupation}</TableCell>
                        </TableRow>
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
                  Victim Information
                </Typography>
              </Box>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='status-select'>Suspect*</InputLabel>
                    <Select
                      fullWidth
                      labelId='status-select'
                      label='Suspect*'
                      name='suspect'
                      id='suspect'
                      value={formik.values.suspect}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      renderValue={() => formik.values.suspect}

                    // error={Boolean(formik.errors.suspect && formik.touched.suspect)}
                    >
                      <ListSubheader>
                        <TextField
                          size="small"

                          // Autofocus on textfield

                          autoFocus
                          placeholder="Type to search..."
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            )
                          }}
                          onChange={(e: any) => setSearchText(e.target.value)}
                          onKeyDown={(e: any) => {
                            if (e.key !== "Escape") {

                              // Prevents autoselecting item while typing (default Select behaviour)

                              e.stopPropagation();
                            }
                          }}
                        />
                      </ListSubheader>

                      {displayedOptions.map((option: any, i: any) => (

                        /*     {option == "Smith Martinez" ? (setSubMenuId(1)) :  (setSubMenuId(2))} */

                        <MenuItem key={i} value={1}>
                          Smith Martinez
                        </MenuItem>

                      ))}
                      {/* <MenuItem value='1'>Smith Martinez</MenuItem>
                      <MenuItem value='2'>Jhonsan Hernandez</Lopez TaylorMenuItem>
                      <MenuItem value='3'>Willams Thomas</MenuItem>
                      <MenuItem value='4'></MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Name*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Name*'
                      placeholder='Name'
                      name='name'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.name && formik.touched.name)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Address*'
                      name='address'
                      id='address'
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.address && formik.touched.address)}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Phone No*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Phone No*'
                      placeholder='Phone No'
                      name='phone'
                      id='phone'
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.phone && formik.touched.phone)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                    <InputLabel id='status-select'>Raes</InputLabel>
                    <Select
                      fullWidth
                      labelId='status-select'
                      label='Raes'
                      name='raes'
                      value={formik.values.raes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.raes && formik.touched.raes)}
                    >
                      <MenuItem value='Black or African American'>Black or African American</MenuItem>
                      <MenuItem value='Asian'>Asian</MenuItem>
                      <MenuItem value='Native Americans and Alaska Natives'>
                        Native Americans and Alaska Natives
                      </MenuItem>
                      <MenuItem value='White'>White</MenuItem>
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
                      value={formik.values.sex}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.sex && formik.touched.sex)}
                    >
                      <MenuItem value='Male'>Male</MenuItem>
                      <MenuItem value='Female'>Female</MenuItem>
                      <MenuItem value='Other'>Other</MenuItem>
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
                      value={formik.values.hair}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.hair && formik.touched.hair)}
                    >
                      <MenuItem value='Straight'>Straight</MenuItem>
                      <MenuItem value='Wavy'>Wavy</MenuItem>
                      <MenuItem value='Curly'>Curly</MenuItem>
                      <MenuItem value='Coily'>Coily</MenuItem>
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
                      value={formik.values.eyes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.eyes && formik.touched.eyes)}
                    >
                      <MenuItem value='Black'>Black</MenuItem>
                      <MenuItem value='Blue'>Blue</MenuItem>
                      <MenuItem value='Hazel'>Hazel</MenuItem>
                      <MenuItem value='Gray'>Gray</MenuItem>
                      <MenuItem value='Violet'>Violet</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>EHT</InputLabel>
                    <OutlinedInput
                      label='EHT'
                      name='eht'
                      id='eht'
                      value={formik.values.eht}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.eht && formik.touched.eht)}
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
                      value={formik.values.occupation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.occupation && formik.touched.occupation)}
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
                      value={formik.values.employer}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.employer && formik.touched.employer)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Drivers License</InputLabel>
                    <OutlinedInput
                      label='Drivers License'
                      name='driverselic'
                      id='driverselic'
                      value={formik.values.driverselic}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.driverselic && formik.touched.driverselic)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Social Security</InputLabel>
                    <OutlinedInput
                      label='Social Security'
                      name='socialsecurity'
                      id='socialsecurity'
                      value={formik.values.socialsecurity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.socialsecurity && formik.touched.socialsecurity)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
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

export default AddVictim
