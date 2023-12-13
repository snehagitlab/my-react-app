// ** React Imports
import { MouseEvent, SyntheticEvent, useState, useCallback } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TabContext from '@mui/lab/TabContext'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import CardActions from '@mui/material/CardActions'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Types
import { useNavigate, useNavigate as useRouter, useLocation } from 'react-router-dom'
import { Alert, AlertTitle, Box, FormHelperText } from '@mui/material'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import * as yup from 'yup'

import { API_PATHS } from 'src/config/api.config'

//env file
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL = process.env.REACT_APP_BASE_URL

const EditOrganisation = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const location: any = useLocation()
  const state: any = location.state

  const [error, setError] = useState<any>({ status: false, msg: '' })

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  // ** States
  const [value, setValue] = useState<string>('personal-info')
  const [isAdminDetailsTabDisabled, setAdminTabDisabled] = useState<boolean>(false)
  const [values, setValues] = useState<any>({
    showPassword: false,
    showPassword2: false
  })

  const handleTabsChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 })
  }

  const handleMouseDownConfirmPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const schema = yup.object().shape({
    email: yup.string().email('Invalid Email Format').required('Email is required'),
    domainName: yup
      .string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url'
      )
      .required('Website is required'),
    orgName: yup.string().min(3).required('Organisation name is required'),
    line1: yup.string().min(3).required('Address is required'),
    line2: yup.string().min(3),
    country: yup.string().min(3).required('Country is required'),
    zipCode: yup.number().min(3).required('Zip code is required'),
    state: yup.string().min(3).required('State is required'),
    city: yup.string().min(3).required('City is required'),
    fName: yup.string().min(3).required('First name is required'),
    lName: yup.string().min(3).required('Last name is required'),
    userPhone: yup
      .string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .length(10, 'Please enter a valid mobile number.')
      .required('Phone Number is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Password and confirm password does not match')
  })
  const formik = useFormik({
    initialValues: {
      orgName: state.orgName || '',
      email: state.email || '',
      domainName: state.website || '',
      line1: state.orgBranch.length === 0 ? null : state.orgBranch[0].add1 || '',
      line2: state.orgBranch.length === 0 ? null : state.orgBranch[0].add2 || '',
      country: state.orgBranch.length === 0 ? null : state.orgBranch[0].country || '',
      zipCode: state.orgBranch.length === 0 ? null : state.orgBranch[0].zipCode || '',
      state: state.orgBranch.length === 0 ? null : state.orgBranch[0].state || '',
      city: state.orgBranch.length === 0 ? null : state.orgBranch[0].city || '',
      password: '',
      confirmPassword: '',
      fname: '',
      lname: '',
      userPhone: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      handleCreateOrganisation()
    }
  })

  const handleCreateOrganisation = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}`)

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

    const requestData = {}
    Object.assign(requestData, { fname: formik.values.fname })
    Object.assign(requestData, { lname: formik.values.lname })
    Object.assign(requestData, { userEmail: formik.values.email })
    Object.assign(requestData, { userPhone: formik.values.userPhone })
    Object.assign(requestData, { email: formik.values.email })
    Object.assign(requestData, { confirmEmail: formik.values.email })
    Object.assign(requestData, { city: formik.values.city })
    Object.assign(requestData, { state: formik.values.state })
    Object.assign(requestData, { zipCode: formik.values.zipCode })
    Object.assign(requestData, { country: formik.values.country })
    Object.assign(requestData, { add1: formik.values.line1 })
    Object.assign(requestData, { add2: formik.values.line2 })
    Object.assign(requestData, { orgName: formik.values.orgName })
    Object.assign(requestData, { website: formik.values.domainName })
    Object.assign(requestData, { password: formik.values.password })
    Object.assign(requestData, { confirmPassword: formik.values.confirmPassword })

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
        alert('Organisation added successfully')
        navigate(-1)
      } else {
        setError({ ...error, status: true, msg: result.message })
      }
    } catch (ex: any) {
      setError({ ...error, status: true, msg: ex.message })
    }
  }

  const toggleCancelAddOrganisation = () => router(-1)

  const handleNext = () => {
    setAdminTabDisabled(false)
    setValue('account-details')
  }
  useMemo(() => {
    if (value == 'personal-info') {
      setAdminTabDisabled(true)
    }
  }, [value])

  return (
    <Card>
      {/* ERROR COMPONENT */}
      {error.status && (
        <Box sx={{ mb: 10, position: 'absolute', bottom: 10, right: 20, m: 5 }}>
          <Alert severity='error' sx={{ width: 300 }}>
            <AlertTitle>Error</AlertTitle>
            {error.msg}
          </Alert>
        </Box>
      )}
      <TabContext value={value}>
        <TabList
          variant='scrollable'
          scrollButtons={false}
          onChange={handleTabsChange}
          sx={{ borderBottom: (theme: { palette: { divider: any } }) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab value='personal-info' label='Organization Info' className='organisation-detail-head' />
          <Tab
            value='account-details'
            disabled={isAdminDetailsTabDisabled}
            label=' Details'
            className='organisation-detail-head'
          />
        </TabList>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <TabPanel value='personal-info'>
              <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Organisation Name</InputLabel>
                    <OutlinedInput
                      value={formik.values.orgName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Organisation Name'
                      name='orgName'
                      id='orgName'
                    />
                    {formik.touched.orgName && formik.errors.orgName && (
                      <FormHelperText error={Boolean(formik.touched.orgName && formik.errors.orgName)}>
                        {formik.errors.orgName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Website</InputLabel>
                    <OutlinedInput
                      value={formik.values.domainName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Website'
                      name='domainName'
                      id='domainName'
                      placeholder='www.onpoint.com'
                    />
                    {formik.touched.domainName && formik.errors.domainName && (
                      <FormHelperText error={Boolean(formik.touched.domainName && formik.errors.domainName)}>
                        {formik.errors.domainName}
                      </FormHelperText>
                    )}
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
                    />
                    {formik.touched.email && formik.errors.email && (
                      <FormHelperText error={Boolean(formik.touched.email && formik.errors.email)}>
                        {formik.errors.email}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Address Line 1</InputLabel>
                    <OutlinedInput
                      value={formik.values.line1}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Address Line 1'
                      name='line1'
                      id='line1'
                    />
                    {formik.touched.line1 && formik.errors.line1 && (
                      <FormHelperText error={Boolean(formik.touched.line1 && formik.errors.line1)}>
                        {formik.errors.line1}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Address Line 2</InputLabel>
                    <OutlinedInput
                      value={formik.values.line2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Address Line 2'
                      name='line2'
                      id='line2'
                    />
                    {formik.touched.line2 && formik.errors.line2 && (
                      <FormHelperText error={Boolean(formik.touched.line2 && formik.errors.line2)}>
                        {formik.errors.line2}
                      </FormHelperText>
                    )}
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
                    />
                    {formik.touched.city && formik.errors.city && (
                      <FormHelperText error={Boolean(formik.touched.city && formik.errors.city)}>
                        {formik.errors.city}
                      </FormHelperText>
                    )}
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
                    />
                    {formik.touched.state && formik.errors.state && (
                      <FormHelperText error={Boolean(formik.touched.state && formik.errors.state)}>
                        {formik.errors.state}
                      </FormHelperText>
                    )}
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
                    />
                    {formik.touched.zipCode && formik.errors.zipCode && (
                      <FormHelperText error={Boolean(formik.touched.zipCode && formik.errors.zipCode)}>
                        {formik.errors.zipCode}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <OutlinedInput
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Country'
                      name='country'
                      id='country'
                    />
                    {formik.touched.country && formik.errors.country && (
                      <FormHelperText error={Boolean(formik.touched.country && formik.errors.country)}>
                        {formik.errors.country}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    {...getRootProps()}
                    sx={{
                      backgroundColor: theme => theme.palette.primary.light,
                      height: '200px',
                      padding: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexFlow: 'column nowrap',
                      fontSize: '24px',
                      color: '#555555',
                      border: '2px #c3c3c3 dashed',
                      borderRadius: '12px'
                    }}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>Drag 'n' drop some files here, or click to select files</p>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item>
                  <Button variant='contained' sx={{ textTransform: 'capitalize' }} color='primary' onClick={handleNext}>
                    Next
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value='account-details'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>First Name</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label='First Name'
                      value={formik.values.fname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder='First Name'
                      name='fname'
                      required
                    />
                    {formik.touched.fname && formik.errors.fname && (
                      <FormHelperText error={Boolean(formik.touched.fname && formik.errors.fname)}>
                        {formik.errors.fname}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Last Name</InputLabel>
                    <OutlinedInput
                      value={formik.values.lname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      label='Last Name'
                      placeholder='Last Name'
                      name='lname'
                      required
                    />
                    {formik.touched.lname && formik.errors.lname && (
                      <FormHelperText error={Boolean(formik.touched.lname && formik.errors.lname)}>
                        {formik.errors.lname}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Phone No.</InputLabel>
                    <OutlinedInput
                      type='number'
                      value={formik.values.userPhone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      label='Phone No.'
                      placeholder='Phone No'
                      name='userPhone'
                      required
                    />
                    {formik.touched.userPhone && formik.errors.userPhone && (
                      <FormHelperText error={Boolean(formik.touched.userPhone && formik.errors.userPhone)}>
                        {formik.errors.userPhone}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                      label='Password'
                      value={formik.values.password}
                      name='password'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type={values.showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            aria-label='toggle password visibility'
                          >
                            {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                      required
                    />
                    {formik.touched.password && formik.errors.password && (
                      <FormHelperText error={Boolean(formik.touched.password && formik.errors.password)}>
                        {formik.errors.password}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Confirm Password</InputLabel>
                    <OutlinedInput
                      value={formik.values.confirmPassword}
                      label='Confirm Password'
                      name='confirmPassword'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type={values.showPassword2 ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            aria-label='toggle password visibility'
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                          >
                            {values.showPassword2 ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                      required
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <FormHelperText error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}>
                        {formik.errors.confirmPassword}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Divider sx={{ margin: 0 }} />
              <CardActions>
                <Button size='large' type='submit' sx={{ mr: 2, textTransform: 'capitalize' }} variant='contained'>
                  Submit
                </Button>
                <Button
                  size='large'
                  sx={{ textTransform: 'capitalize' }}
                  variant='outlined'
                  color='secondary'
                  onClick={toggleCancelAddOrganisation}
                >
                  Cancel
                </Button>
              </CardActions>
            </TabPanel>
          </CardContent>
        </form>
      </TabContext>
    </Card>
  )
}

export default EditOrganisation
