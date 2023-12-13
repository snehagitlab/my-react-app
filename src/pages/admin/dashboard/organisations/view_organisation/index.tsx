// ** React Imports
import { useState, useEffect, SyntheticEvent } from 'react'

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
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'

// ** Icons Imports

// ** Types
import { useNavigate, useNavigate as useRouter, useLocation } from 'react-router-dom'
import { API_PATHS } from 'src/config/api.config'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

import { useFormik } from 'formik'

const fontColor = {
  style: { color: '#000 !important', fontWeight: 'bold !important' }
}

const EditOrganisation = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const location: any = useLocation()
  const state: any = location.state

  const formik = useFormik({
    initialValues: {
      orgName: '',
      email: '',
      domainName: '',
      line1: '',
      line2: '',
      country: '',
      zipCode: '',
      state: '',
      city: '',
      password: '',
      confirmPassword: '',
      fname: '',
      lname: '',
      userPhone: ''
    },
    onSubmit: (values: any) => {
      console.log(values)
    }
  })

  const [value, setValue] = useState<string>('personal-info')

  const handleGetOrganisation = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}/detail?orgId=${state.orgId}`)

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

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
        console.log(result.payload.data)
        const data = result.payload.data
        formik.setFieldValue('orgName', data.orgName)
        formik.setFieldValue('email', data.email)
        formik.setFieldValue('domainName', data.website)
        formik.setFieldValue('state', data.orgBranch[0].state)
        formik.setFieldValue('country', data.orgBranch[0].country)
        formik.setFieldValue('city', data.orgBranch[0].city)
        formik.setFieldValue('line1', data.orgBranch[0].add1)
        formik.setFieldValue('line2', data.orgBranch[0].add2)
        formik.setFieldValue('zipCode', data.orgBranch[0].zipCode)
        formik.setFieldValue('fname', data.orgUser[0].user.fname)
        formik.setFieldValue('lname', data.orgUser[0].user.lname)
        formik.setFieldValue('userPhone', data.orgUser[0].user.phone)
      } else {
        navigate(-1)
      }
    } catch (ex: any) {}
  }

  const handleTabsChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const toggleCancelAddOrganisation = () => router(-1)

  useEffect(() => {
    handleGetOrganisation()
  }, [])

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          variant='scrollable'
          scrollButtons={false}
          onChange={handleTabsChange}
          sx={{ borderBottom: (theme: { palette: { divider: any } }) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab value='personal-info' label='Organization Info' />
          <Tab value='account-details' label='Admin Access Details' />
        </TabList>
        <CardContent>
          <TabPanel value='personal-info'>
            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Organisation Name</InputLabel>
                  <OutlinedInput
                    disabled
                    value={formik.values.orgName}
                    label='Organisation Name'
                    name='orgName'
                    id='orgName'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Website</InputLabel>
                  <OutlinedInput
                    value={formik.values.domainName}
                    name='domainName'
                    id='domainName'
                    label='Website'
                    disabled
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Email</InputLabel>
                  <OutlinedInput value={formik.values.email} name='email' id='email' label='email' disabled />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Address Line 1</InputLabel>
                  <OutlinedInput value={formik.values.line1} name='line1' id='line1' label='Address Line 1' disabled />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Address Line 2</InputLabel>
                  <OutlinedInput value={formik.values.line2} name='line2' id='line2' label='Address Line 2' disabled />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <OutlinedInput
                    value={formik.values.city && formik.values.city}
                    disabled
                    label='City'
                    name='city'
                    id='city'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <OutlinedInput fullWidth value={formik.values.state} disabled label='State' name='state' id='state' />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Zip Code</InputLabel>
                  <OutlinedInput
                    fullWidth
                    value={formik.values.zipCode}
                    disabled
                    label='Zip Code'
                    name='zipCode'
                    id='zipCode'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <OutlinedInput
                    fullWidth
                    value={formik.values.country && formik.values.country}
                    disabled
                    label='Country'
                    name='country'
                    id='country'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ margin: 0 }} />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value='account-details'>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <InputLabel>First Name</InputLabel>
                <OutlinedInput
                  fullWidth
                  value={formik.values.fname}
                  label='First Name'
                  placeholder='First Name'
                  name='fname'
                  required
                  inputProps={fontColor}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Last Name</InputLabel>
                <OutlinedInput
                  fullWidth
                  value={formik.values.lname}
                  label='Last Name'
                  placeholder='Last Name'
                  name='lname'
                  required
                  inputProps={fontColor}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Phone No.</InputLabel>
                <OutlinedInput
                  disabled
                  type='number'
                  fullWidth
                  label='Phone No.'
                  placeholder='Phone No'
                  value={formik.values.userPhone}
                  name='userPhone'
                  required
                  inputProps={fontColor}
                />
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </TabContext>
      <Divider sx={{ margin: 0 }} />
      <CardActions>
        <Button
          size='large'
          sx={{ textTransform: 'capitalize' }}
          variant='outlined'
          color='secondary'
          onClick={toggleCancelAddOrganisation}
        >
          Go back
        </Button>
      </CardActions>
    </Card>
  )
}

export default EditOrganisation
