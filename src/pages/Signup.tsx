import { useEffect, useState } from 'react'
import loginshadow from '../assets/Images/loginshadow.png'

// ** MUI Components
import { useTheme } from '@mui/material/styles'

// toast popup
import { toast } from 'react-toastify'

import LogoImage from '../assets/Images/logo.png'

// ** Third Party Imports
import * as yup from 'yup'
import { useFormik } from 'formik'
import {
  Box,

  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  Select,
  MenuItem,
  Typography
} from '@mui/material'

import { useNavigate } from 'react-router-dom'

import { API_PATHS } from 'src/config/api.config'

//env file
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC

// ** Layout Import





const Signup = () => {
  const theme = useTheme()

  const navigate = useNavigate()
  
  const schema = yup.object().shape({
    userEmail: yup.string().email().required('Email is required'),
    orgName: yup.string().min(3).required("This Field Requiered"),
    fname: yup
      .string()
      .min(2)
      .matches(/^[aA-zZ\s]+$/, '')
      .required(),
    lname: yup
      .string()
      .min(2)
      .matches(/^[aA-zZ\s]+$/, '')
      .required(),
    userPhone: yup
      .string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .length(10, 'Please enter a valid mobile number.'),
    orgTypeId: yup
      .string()
      .required()

  })

  const formik = useFormik({
    initialValues: {
      orgTypeId:'',
      orgName:'',
      fname:'',
      lname:'',
      userEmail:'',
      userPhone:''

    },

     validationSchema: schema,
    

    onSubmit: () => {
      handleFreeTrail()
    }
  })

  const handleFreeTrail = async () => {
    const url = new URL(`${BASE_URL_PUBLIC}/${API_VERSION}/${API_PATHS.free_trial_org}`)
   
    const requestData = {}
    Object.assign(requestData, { orgTypeId: formik.values.orgTypeId })
    Object.assign(requestData, { orgName: formik.values.orgName })
    Object.assign(requestData, { fname: formik.values.fname })
    Object.assign(requestData, { lname: formik.values.lname })
    Object.assign(requestData, { email: formik.values.userEmail })
    Object.assign(requestData, { phone: formik.values.userPhone })

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(requestData)
      })
      const result = await response.json()

      if (result.status == 200) {
        localStorage.setItem('userRole', result.payload.data.userRole)
        localStorage.setItem('userData', JSON.stringify(result.payload))
        navigate('/dashboard')     
        formik.resetForm()
      } else {
        toast.error(result.message)
      }
    } catch (ex) {
      console.log(ex)
    } 

  }
  const [OrgtypeList, setOrgTypeList] = useState<Array<any>>([])

  const fetchAllOrganisationsType = async () => {
    const url = new URL(
      `${BASE_URL_PUBLIC}/${API_VERSION}/${API_PATHS.organisationType}?sortOrder=DESC&showAll=true`
    )

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    })
    if (response.status === 200) {
      const result = await response.json()
      setOrgTypeList(result.payload.data)
    }
  }

  useEffect(() => {
    fetchAllOrganisationsType()
  }, [])


  return (
    <>
     <Grid sx={{padding:'10px'}}>
     <Grid container  sx={{display: 'flex',justifyContent:'center',  alignItems: 'center'}}>
     <Grid item xs={12} md={6} lg={4} className='logoStylesignup'  sx={{ left:0}}>
     <img alt="logo" src={LogoImage} style={{ height: '50px' }} />

            </Grid>
    
      <Grid item xs={12} md={6} lg={6} className='logoStylesignup' sx={{display: 'flex',justifyContent:'end',  alignItems: 'center'}}
     >
      <Grid>
          <Button
            variant='contained'
            size='large'
            onClick={() => {
              navigate('/login')
            }}
            sx={{ textTransform: 'capitalize' }}
          >
            login as admin
          </Button>
        </Grid>
        <Grid>
          <Button
            variant='contained'
            size='large'
            sx={{ marginLeft: '20px', textTransform: 'capitalize' }}
            onClick={() => {
              navigate('/userLogin')
            }}
          >
            login as user
          </Button>
        </Grid>

     </Grid>
     </Grid>
     </Grid>
      <Grid>
        <Box
          className='content-center'
          sx={{
            backgroundImage: `linear-gradient(${theme.palette.primary.main} 70%,#2d4acd 30%)`,
            color: 'darkred',

             position: 'relative'
          }}
        >
          <img alt="login-shadow" src={loginshadow} className='login-img' />
          <Grid container sx={{ display: 'flex',justifyContent:'center',  alignItems: 'center' }}>
            <Grid item xs={12} md={6} lg={4} className='signuptext'  sx={{ left:0}}>
              <Typography
                sx={{
                  fontWeight: '600',
                  fontSize: { xs: '40px', sm: '45px', md: '45px' },
                  textAlign: 'left',
                  color: 'white',
                  fontFamily: 'Mazzard-regular'

                }}
              >
                Try Gogtas for free
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  weight: '400',
                  fontSize: { xs: '20px', sm: '24px', md: '24px' },
                  lineHeight: '38px',
                  fontFamily: 'Mazzard-regular'

                }}
              >
                No credit card required. No strings attached.
                <ul style={{ fontSize: '18px', fontWeight: '300' }} >
                  <li>60% faster ticket resolution with virtual agents</li>
                  <li>59% deflection in tickets with AI bots</li>
                  <li>3 month payback period</li>
                </ul>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={6} >
              <Card sx={{ borderRadius: '11px' }}>
                <CardContent
                  className='form-main-div'
                  sx={{
                    pt: 10,
                    pl: 5,
                    pr: 5
                  }}
                >

                  <form
                    noValidate
                    autoComplete='off'
                    onSubmit={formik.handleSubmit}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={6} md={6}>
                        <FormControl fullWidth>
                          <InputLabel id='status-select'
                          >Organization Type*</InputLabel>
                          <Select
                            fullWidth
                            labelId='status-select'
                            label='Organization Type*'
                            name='orgTypeId'
                            id='orgTypeId'
                            onChange={formik.handleChange}
                            value={formik.values.orgTypeId}
                            error={Boolean(formik.errors.orgTypeId && formik.touched.orgTypeId)}
                          >
                            {OrgtypeList.map((a: any) => {
                              return (
                                <MenuItem value={a.orgTypeId} key={a.orgTypeId}>
                                  {a.orgTypeName}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Organization Name*</InputLabel>
                          <OutlinedInput
                            value={formik.values.orgName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label='Organization  Name'
                            name='orgName'
                            id='orgName'
                            error={Boolean(formik.errors.orgName && formik.touched.orgName)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>First Name*</InputLabel>
                          <OutlinedInput
                            fullWidth
                            label='First Name'
                            value={formik.values.fname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='First Name'
                            name='fname'
                            error={Boolean(formik.errors.fname && formik.touched.fname)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                          <InputLabel>Last Name*</InputLabel>
                          <OutlinedInput
                            value={formik.values.lname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            fullWidth
                            label='Last Name'
                            placeholder='Last Name'
                            name='lname'
                            error={Boolean(formik.errors.lname && formik.touched.lname)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                          <InputLabel>Email*</InputLabel>
                          <OutlinedInput

                            value={formik.values.userEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label='Email'
                            name='userEmail'
                            id='userEmail'
                            placeholder='example@email.com'
                            error={Boolean(formik.errors.userEmail && formik.touched.userEmail)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
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
                            error={Boolean(formik.errors.userPhone && formik.touched.userPhone)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                          size='large'
                          type='submit'
                          variant='contained'
                          sx={{
                            textTransform: 'capitalize',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginTop: '16px',
                            padding: '10px !important'
                          }}
                        >
                          Signup for Free
                        </Button>
                      </Grid>
                    </Grid>

                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  )
}
export default Signup
