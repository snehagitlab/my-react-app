// ** React Imports,useCallback useState
import React, { useEffect} from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { useFormik } from 'formik'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import SettingPage from 'src/pages/admin/setting'

//import axios
import axios from 'axios'

//import config
import { API_PATHS } from 'src/config/api.config'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

//toasify
import { toast } from 'react-toastify'

//import formik
import * as yup from 'yup'

//import compoennts
import TicketContext from 'src/context/TicketProvider'

const TransferOwnership = () => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    const userId = user.data.userId
    const { setShowUpdateUserData, showUpdateUserData } = React.useContext<any>(TicketContext)
    
  
    const schema = yup.object().shape({
      email: yup.string().email('Invalid Email Format').required(),
      fname: yup.string().min(3),
      lname: yup.string().min(3),
      phone:yup.string().matches(/^[0-9]+$/, 'Must be only digits').length(10, 'Please enter a valid mobile number.'),
    })
    const formik = useFormik({
      initialValues: {
        fname: '',
        lname: '',
        email: '',
        phone:''
      },
      validationSchema: schema,
      onSubmit: () => {
        {
          handleEditUserData()
        }
      }
    })
  
    // ** Get User Details
    const handleGetUserDetails = async () => {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/detail?userId=${userId}`)
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
          const data = result.payload.data
          formik.setFieldValue('fname', data.fname)
          formik.setFieldValue('email', data.email)
          formik.setFieldValue('lname', data.lname)
          formik.setFieldValue('address', data.address)
          formik.setFieldValue('country', data.country)
          formik.setFieldValue('city', data.city)
          formik.setFieldValue('phone', data.phone)
         
        } else {
          console.log(result.message)
        }
      } catch (ex: any) { }
    }
  
    //edit user details
    const handleEditUserData = async () => {
      const formData: any = new FormData()
      formData.append('fname', formik.values.fname)
      formData.append('lname', formik.values.lname)
      formData.append('email', formik.values.email)
      
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/profile`)
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
      try {
        const response2: any = await axios.put(`${url}`, formData, {
          headers: {
            'content-type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        })
        console.log(response2)
        if (response2.status === 200) {
          toast.success(response2.data.message)
          setShowUpdateUserData(response2)
  
  /*         handleUserUpdateClose()
  
   */      } else {
          toast.error(response2.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    useEffect(() => {
      handleGetUserDetails()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showUpdateUserData])

  return (
    <>
      <Grid sx={{ display: 'flex' }}>
        <Grid md={4}>
          <SettingPage />
        </Grid>
        <Grid md={8}  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>  
        <form onSubmit={formik.handleSubmit} >
            <Grid container spacing={5}  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
           
              <Grid item xs={12} md={6}>
                <FormControl fullWidth >
                  <InputLabel>First Name</InputLabel>
                  <OutlinedInput
                    value={formik.values.fname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='First Name'
                    name='fname'
                    id='fname'
                    error={Boolean(formik.errors.fname && formik.touched.fname)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth >
                  <InputLabel>Last Name</InputLabel>
                  <OutlinedInput
                    value={formik.values.lname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Last Name'
                    name='lname'
                    id='lname'
                    error={Boolean(formik.errors.lname && formik.touched.lname)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel>Email*</InputLabel>
                  <OutlinedInput
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Email'
                    name='email'
                    id='email'
                    value={formik.values.email}
                    error={Boolean(formik.errors.email && formik.touched.email)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel>Phone</InputLabel>
                  <OutlinedInput
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Phone'
                    name='phone'
                    id='phone'
                    value={formik.values.phone}
                    error={Boolean(formik.errors.phone && formik.touched.phone)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={12} sx={{ alignItem: 'center', justifyContent: 'center' }}>
                <Box m={1} display='flex' justifyContent='center' alignItems='center' sx={{ marginBottom: '60px' }}>
                <Button
                   
                    size='large'
                    sx={{ marginLeft: '10px', textTransform: 'capitalize' }}
                    variant='outlined'

                    //onClick={handleUserUpdateClose}

                                       >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    size='large'
                    sx={{ marginLeft: '10px', textTransform: 'capitalize' }}
                    variant='contained'
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  )
}
export default TransferOwnership
