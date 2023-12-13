import React from 'react'
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  OutlinedInput,
  InputLabel
} from '@mui/material'

//import { Link } from 'react-router-dom'

import ForgotPasswordAvatar from '../../../assets/Images/forgotPasswordAvatar.png'
import ArrowRight from '../../../assets/Images/Icons/arrow-right.png'
import { API_PATHS } from 'src/config/api.config'

//import formik
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import LoadingButton from '@mui/lab/LoadingButton'
import { useNavigate } from 'react-router-dom'
import {Helmet} from "react-helmet";


const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC
const API_VERSION = process.env.REACT_APP_API_VERSION

interface FormData {
  email: string
}

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  })


  // Forget password
  const Forgetpassword = () => {

    const [Loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const formik = useFormik({
      initialValues: {
        email: '',
       
      },
  
      validationSchema: schema,
      onSubmit: (values: any) => {
        handleforgetpassword(values)
      }
    })
  
    const handleforgetpassword = async (data: FormData) => {
      setLoading(true)
      if (data.email === '' ) {
        toast.error('Email is required')
      } else {
        const url = new URL(`${BASE_URL_PUBLIC}/${API_VERSION}/${API_PATHS.forgot}/${API_PATHS.password}`)
        try {
          const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify(data)
          })
  
          const result = await response.json()
          if (response.status === 200) {
            setLoading(false)
            toast.success(result.message)
          } else {
            toast.error(result.message)
            setLoading(false)
          }
        } catch (err: any) {
          toast.error(err.message)
          setLoading(false)
        }
      }
    }

    const handleNavigation = () =>
    {
      navigate(-1)
    }

  return (
    <>
    <Helmet>
        <title>Forgot Password-Gogtas</title>
        <meta name="description" content="Forgot Password" />
    </Helmet>
      <Box className='loginBox' >
        <img
          alt='Forgot Password'
          src={ForgotPasswordAvatar}
          style={{ display: 'block', margin: 'auto', marginBottom: '30px', width: '250px' }}
        />
        <Stack rowGap={0}>
          <Typography variant='h3' sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black' }}>
            Forgot Password?
          </Typography>
          <p style={{ textAlign: 'center', color: 'black' }}>No worries, We'll send you reset Password.</p>
        </Stack>

        <Card sx={{ mt: 0 }} style={{ boxShadow: 'none' }}>
          <CardContent
            sx={{
              pt: 5,
              pl: 5,
              pr: 5
            }}
          >
            <form
              onSubmit={formik.handleSubmit}
              noValidate
              autoComplete='off'
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
            <FormControl fullWidth sx={{ mb:7 }}>
                  <InputLabel>Email*</InputLabel>
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
                {
                  Loading ?
                  <>
                <LoadingButton
                  loading={Loading}
                  variant='contained'
                  disabled
                  sx={{
                    textTransform: 'capitalize',
                    width: '100% !important',
                    padding: '15px !important',
                    boxShadow: '0px 3px 15px rgb(45 74 205 / 55%)',
                    my: 0
                  }}
                >
                  Submit <img alt='arrow-right' src={ArrowRight} style={{ marginLeft: '5px' }} />
                </LoadingButton>
              </>
              :
              <>
              <Button
                type='submit'
                variant='contained'
                sx={{
                  textTransform: 'capitalize',
                  width: '100% !important',
                  padding: '15px !important',
                  boxShadow: '0px 3px 15px rgb(45 74 205 / 55%)',
                  my: 0
                }}
              >
                Submit <img alt='arrow-right' src={ArrowRight} style={{ marginLeft: '5px' }} />
              </Button>
              </>
                }
              <p style={{ marginTop:'20px' }}>
                <span onClick={handleNavigation} style={{ textDecoration: 'none', color: '#2d4acd',cursor:'pointer'}}>
                  Back to Login 
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </Box>
      <ToastContainer autoClose={3000} position='bottom-right' />

    </>
  )
}

export default Forgetpassword
