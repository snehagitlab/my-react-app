// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
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
import { toast } from 'react-toastify'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

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
import * as yup from 'yup'
import OrganisationContext from 'src/context/OrganisationProvider'
import TicketContext from 'src/context/TicketProvider'
import { API_PATHS } from 'src/config/api.config'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

const filter = createFilterOptions<any>()

const AddWitness = ({ getOffenceTicketId }: any) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [basicPicker, setBasicPicker] = useState<Date | null>(new Date())
  const { setwitnessCount, setvictimCount, setsuspectCount } = React.useContext<any>(OrganisationContext)
  const { addwitnessData, setaddwitnessData, getOffenceTabId, addvictimData, setaddvictimData,
    addsuspectData, setaddsuspectData } = React.useContext<any>(TicketContext)
  const [value, setValue] = React.useState<any | null>(null);
  const [open, toggleOpen] = React.useState(false);
  const [allVictim, setAllVictim] = useState<Array<any>>([])
  const [CompareArray, setCompareArray] = useState()
  const [offenceUserId, setOffenceUserId] = React.useState<any>(0)

  const [refreshform, setrefreshform] = React.useState(false);
  const [firstname, setfirstname] = React.useState('');

  const firstNameRef:any = useRef();


  const schema = yup.object().shape({
    suspect: yup.string().required(),
    fname: yup.string().required(),
    lname: yup.string().required()
  })

  const formik = useFormik({
    initialValues: {

      fname: '',
      lname: '',
      suspect: '',
      email: '',
      address: '',
      phone: '',
      race: '',
      sex: '',
      hair: '',
      eyes: '',
      eht: '',
      occupation: '',
      employer: '',
      driverselic: '',
      socialsecurity: '',
      zipCode: '',
      state: '',
      city: '',
      weight: '',
      height: ''
    },

    validationSchema: schema,

    onSubmit: () => {
      {
        handleCreateTicket()
      }
    }
  })

  //const roleid = formik.values.suspect

  // console.log(offenceUserId)

  const handleCreateTicket = async () => {
    const requestData: any = {
      fname: formik.values.fname,
      lname: formik.values.lname,
      suspect: formik.values.suspect,
      email: formik.values.email,
      phone: formik.values.phone,
      race: formik.values.race,
      zip: formik.values.zipCode,
      city: formik.values.city,
      state: formik.values.state,
      address: formik.values.address,
      sex: formik.values.sex,
      hair: formik.values.hair,
      eyes: formik.values.eyes,
      height: formik.values.height,
      weight: formik.values.weight,
      dateofbirth: basicPicker,
      drivesLicense: formik.values.driverselic,
      socialSecurity: formik.values.socialsecurity,
      id: new Date().getTime().toString()
    }

    // console.log(requestData)

    if (getOffenceTabId == 1) {
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
    }
    else if (getOffenceTabId == 2) {

      if (getOffenceTicketId && getOffenceTicketId > 0) {
        if (addwitnessData && addwitnessData.length > 0) {
          setaddwitnessData([...addwitnessData, requestData])
          setwitnessCount(addwitnessData.length + 1)

        }
        else {
          setaddwitnessData([requestData])
          setwitnessCount(1)
        }
      }
      else {
        setaddwitnessData([...addwitnessData, requestData])
        setwitnessCount(addwitnessData.length + 1)
      }
    }
    else if (getOffenceTabId == 3) {

      if (getOffenceTicketId && getOffenceTicketId > 0) {
        if (addsuspectData && addsuspectData.length > 0) {
          setaddsuspectData([...addsuspectData, requestData])
          setsuspectCount(addsuspectData.length + 1)

        }
        else {
          setaddsuspectData([requestData])
          setsuspectCount(1)

        }
      }
      else {

        // console.log(JSON.stringify(requestData))

        setaddsuspectData(addsuspectData.concat(requestData))
        setsuspectCount(addsuspectData.length + 1)
      }
    }
    formik.resetForm()
    setShow(false)
  }



  const fetchAllJsonData = async (offenceUserId: any) => {

    setOffenceUserId(offenceUserId)
    if (offenceUserId > 0) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.offenceuser}/detail?offenceUserId=${offenceUserId}`)
      const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        })
        const result = await response.json()

        if (result.status == 200) {
          const data = result.payload.data
          setCompareArray(data)
          formik.resetForm()
          formik.setFieldValue('fname', data.fname)
          formik.setFieldValue('lname', data.lname)
          formik.setFieldValue('address', data.address)
          setBasicPicker(data.dob)
          formik.setFieldValue('sex', data.sex)
          formik.setFieldValue('race', data.raes)
          formik.setFieldValue('eyes', data.eyes)
          formik.setFieldValue('hair', data.hair)
          formik.setFieldValue('height', data.eht)
          formik.setFieldValue('weight', data.weight)
          formik.setFieldValue('city', data.city)
          formik.setFieldValue('state', data.state)
          formik.setFieldValue('zipCode', data.zip)
          formik.setFieldValue('driverselic', data.drivesLicense)
          formik.setFieldValue('socialsecurity', data.socialSecurity)
          formik.setFieldValue('phone', data.phone)

        } else {
          console.log(result.message)
        }
      }
      catch (ex: any) { }
    }

  }
  const refreshForm = () => {
    formik.resetForm()
    setBasicPicker(new Date())
    setValue('')
  }

  //Update Offence UserInfo
  const updateoffenceUserInfo = async (offenceuserId: any) => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.offenceuser}?offenceUserId=${offenceuserId}`)

    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')

    const requestData = {}
    Object.assign(requestData, { fname: formik.values.fname })
    Object.assign(requestData, { lname: formik.values.lname })
    Object.assign(requestData, { address: formik.values.address })
    Object.assign(requestData, { phone: formik.values.phone })
    Object.assign(requestData, { dob: basicPicker })
    Object.assign(requestData, { raes: formik.values.race })
    Object.assign(requestData, { hair: formik.values.hair })
    Object.assign(requestData, { eyes: formik.values.eyes })
    Object.assign(requestData, { eht: formik.values.height })
    Object.assign(requestData, { height: formik.values.height })
    Object.assign(requestData, { weight: formik.values.weight })
    Object.assign(requestData, { hair: formik.values.hair })
    Object.assign(requestData, { drivesLicense: formik.values.driverselic })
    Object.assign(requestData, { socialSecurity: formik.values.socialsecurity })
    Object.assign(requestData, { city: formik.values.city })
    Object.assign(requestData, { state: formik.values.state })
    Object.assign(requestData, { zip: formik.values.zipCode })
    Object.assign(requestData, { sex: formik.values.sex })



    if (JSON.stringify(CompareArray) != JSON.stringify(requestData)) {
      try {
        const response = await fetch(url.toString(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(requestData)
        })
        const result = await response.json()

        if (result.status == 200) {
          formik.resetForm()
          setBasicPicker(new Date())
          setValue('')
          setOffenceUserId(0)
          handleCreateTicket()
          setShow(false)

          // toast.success(result.message)

        } else {

          //toast.error(result.message)
        }
      } catch (ex: any) {
        console.log(ex)
      }
    } else {
      handleCreateTicket()
      setShow(false)
      formik.resetForm()
    }
  }

  const fetchAllVictimList = async () => {
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.offenceuser}?showAll=true`
    )
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })
      const result = await response.json()
      if (result.status == 200) {
        const data = result.payload.data
        setAllVictim(data)
      } else {
        console.log('something went wrong')
      }
    } catch (ex: any) { }
  }



  const AddOffenceUserInfo = async () => {

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.offenceuser}`)
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const requestData = {}
    Object.assign(requestData, { fname: formik.values.fname })
    Object.assign(requestData, { lname: formik.values.lname })
    Object.assign(requestData, { address: formik.values.address })
    Object.assign(requestData, { phone: formik.values.phone })
    Object.assign(requestData, { dob: basicPicker })
    Object.assign(requestData, { raes: formik.values.race })
    Object.assign(requestData, { sex: formik.values.sex })
    Object.assign(requestData, { hair: formik.values.hair })
    Object.assign(requestData, { eyes: formik.values.eyes })
    Object.assign(requestData, { email: formik.values.email })
    Object.assign(requestData, { height: formik.values.height })
    Object.assign(requestData, { eht: formik.values.height })
    Object.assign(requestData, { weight: formik.values.weight })
    Object.assign(requestData, { city: formik.values.city })
    Object.assign(requestData, { state: formik.values.state })
    Object.assign(requestData, { zip: formik.values.zipCode })
    Object.assign(requestData, { drivesLicense: formik.values.driverselic })
    Object.assign(requestData, { socialSecurity: formik.values.socialsecurity })

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(requestData)
      })
      const result = await response.json()

      if (result.status == 200) {
        toast.success(result.message)
        handleCreateTicket()
        setShow(false)
        formik.resetForm()

      } else {

        toast.error(result.message)

      }
    } catch (ex) {
      console.log(ex)
    }
  }

  const handleaddofencechanges = () => {
    formik.resetForm()
    setBasicPicker(new Date())
    setOffenceUserId(0)
    setValue('')
    formik.setFieldValue('fname', firstname)
  }


  useEffect(() => {
    handleCreateTicket
    fetchAllJsonData(offenceUserId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offenceUserId])

  useEffect(() => {
    fetchAllVictimList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    handleaddofencechanges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    handleaddofencechanges
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshform])





  return (

    <>



      <Card sx={{ border: '1px solid lightgray' }}>
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
            {getOffenceTabId == 1 ? (<h3>Victim Info</h3>) : getOffenceTabId == 2 ? (<h3>Witness Info</h3>) : (<h3>Suspect Info</h3>)}

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
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>City</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getOffenceTabId == 1 ? (addvictimData.length > 0 ? (
                  addvictimData.map((item: any, id: any) => {
                    return (
                      <>
                        <TableRow key={id} hover role='checkbox' tabIndex={-1}>

                          {/* <TableCell >{item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                          </TableCell> */}


                          <TableCell key={id}>{item.fname}</TableCell>
                          <TableCell key={id}>{item.lname}</TableCell>
                          <TableCell key={id}>{item.phone}</TableCell>
                          <TableCell key={id}>{item.city}</TableCell>
                        </TableRow>
                      </>
                    )
                  })
                ) : (
                  <Typography sx={{ marginLeft: '15px' }}>No record found</Typography>
                )) : getOffenceTabId == 2 ? (addwitnessData.length > 0 ? (
                  addwitnessData.map((item: any, id: any) => {
                    return (
                      <>
                        <TableRow key={id} hover role='checkbox' tabIndex={-1}>
                          <TableCell key={id}>{item.fname}</TableCell>
                          <TableCell key={id}>{item.lname}</TableCell>
                          <TableCell key={id}>{item.phone}</TableCell>
                          <TableCell key={id}>{item.city}</TableCell>
                        </TableRow>
                      </>
                    )
                  })
                ) : (
                  <Typography sx={{ marginLeft: '15px' }}>No record found</Typography>
                )) : (addsuspectData.length > 0 ? (
                  addsuspectData.map((item: any, id: any) => {
                    return (
                      <>
                        <TableRow key={id} hover role='checkbox' tabIndex={-1}>
                          <TableCell key={id}>{item.fname}</TableCell>
                          <TableCell key={id}>{item.lname}</TableCell>
                          <TableCell key={id}>{item.phone}</TableCell>
                          <TableCell key={id}>{item.city}</TableCell>
                        </TableRow>
                      </>
                    )
                  })
                ) : (
                  <Typography sx={{ marginLeft: '15px' }}>No record found</Typography>
                ))}


              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Dialog
          fullWidth
          open={show}
          maxWidth='md'
          scroll='body'
          onClose={() => { setShow(false), refreshForm() }}
          TransitionComponent={Transition}
          onBackdropClick={() => { setShow(false), refreshForm() }}
        >
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
              <IconButton
                size='small'
                onClick={() => { setShow(false), refreshForm() }}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Close />
              </IconButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3 }}>
                  {getOffenceTabId == 1 ? ('Victim Information') : getOffenceTabId == 2 ? ('Witness Information') : ('Suspect Information')}


                </Typography>
              </Box>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        setTimeout(() => {

                          toggleOpen(true);
                          setrefreshform(true)
                        });
                      } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setrefreshform(true)
                        setfirstname(newValue.inputValue)
                        firstNameRef.current.focus();
                      } else {
                        setValue(newValue)
                        if (newValue) { setOffenceUserId(newValue.offenceUserId) }
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      if (params.inputValue !== '') {

                        filtered.push({
                          inputValue: params.inputValue,
                          fname: `Click here to add "${params.inputValue}"`,
                        });

                        setrefreshform(true)
                        setfirstname(params.inputValue)
                      }

                      return filtered;
                    }}
                    id="free-solo-dialog-demo"
                    options={allVictim}
                    getOptionLabel={(option) => {

                      // e.g value selected with enter, right from the input

                      if (typeof option === 'string') {

                        return option;

                      }
                      if (option.fname && option.lname) {


                        return option.fname + ' ' + option.lname;

                      }
                      else {


                        return option.fname;

                      }




                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, allVictim) => <li {...props} value={allVictim.offenceUserId} key={allVictim.offenceUserId}>{allVictim.fname}{' '}{allVictim.lname}</li>}
                    freeSolo
                    renderInput={(params) => <TextField {...params} label={getOffenceTabId == 1 ? 'Victim*' : getOffenceTabId == 2 ? 'Witness*' : 'Suspect*'} />}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>First Name</InputLabel>
                    <OutlinedInput
                    inputRef={firstNameRef}
                      fullWidth
                      label='First Name'
                      placeholder='First Name'
                      name='fname'
                      value={formik.values.fname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.fname && formik.touched.fname)}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Last Name</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Last Name'
                      placeholder='Last Name'
                      name='lname'
                      value={formik.values.lname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.lname && formik.touched.lname)}
                    />
                  </FormControl>
                </Grid>


                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
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
                    <InputLabel>Race</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Race'
                      name='race'
                      value={formik.values.race}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.race && formik.touched.race)}
                    />
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
                      <MenuItem value='M'>Male</MenuItem>
                      <MenuItem value='F'>Female</MenuItem>
                      <MenuItem value='O'>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='status-select'>Hair</InputLabel>
                    <OutlinedInput
                      label='Hair'
                      name='hair'
                      id='hair'
                      value={formik.values.hair}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.hair && formik.touched.hair)}
                    />

                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='status-select'>Eyes</InputLabel>
                    <OutlinedInput
                      label='Eyes'
                      name='eyes'
                      id='eyes'
                      value={formik.values.eyes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.eyes && formik.touched.eyes)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Height</InputLabel>
                    <OutlinedInput
                      label='Height'
                      name='height'
                      id='height'
                      value={formik.values.height}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.height && formik.touched.height)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Weight</InputLabel>
                    <OutlinedInput
                      label='Weight'
                      name='weight'
                      id='weight'
                      value={formik.values.weight}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.weight && formik.touched.weight)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Address</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Address'
                      name='address'
                      id='address'
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.address && formik.touched.address)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <OutlinedInput
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='City'
                      name='city'
                      id='city'
                      error={Boolean(formik.errors.city && formik.touched.city)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <OutlinedInput
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='State'
                      name='state'
                      id='state'
                      error={Boolean(formik.errors.state && formik.touched.state)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Zip Code</InputLabel>
                    <OutlinedInput
                      type='number'
                      value={formik.values.zipCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Zip Code'
                      name='zipCode'
                      id='zipCode'
                      error={Boolean(formik.errors.zipCode && formik.touched.zipCode)}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Phone No</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='Phone No'
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
                    <InputLabel>Email</InputLabel>
                    <OutlinedInput
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Email'
                      name='email'
                      id='email'
                      placeholder='example@email.com'
                      error={Boolean(formik.errors.email && formik.touched.email)}
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
                {offenceUserId > 0 ?
                  (
                    <>
                      <Button variant='contained' sx={{ marginRight: 1, textTransform: 'capitalize' }} onClick={() => updateoffenceUserInfo(offenceUserId)}>
                        Submit
                      </Button>
                      <Button variant='outlined' color='secondary' onClick={() => { setShow(false), refreshForm() }} sx={{ textTransform: 'capitalize' }}>
                        Discard
                      </Button>
                    </>)
                  :
                  (
                    <>
                      <Button variant='contained' sx={{ marginRight: 1, textTransform: 'capitalize' }} onClick={() => AddOffenceUserInfo()}>
                        Submit
                      </Button>
                      <Button variant='outlined' color='secondary' onClick={() => { setShow(false), refreshForm() }} sx={{ textTransform: 'capitalize' }}>
                        Discard
                      </Button>
                    </>
                  )
                }

              </DialogActions>
            </DialogContent>
          </form>
        </Dialog>
      </Card>
    </>
  )
}

export default AddWitness
