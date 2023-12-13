import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  InputLabel
} from '@mui/material'
import { EyeOutline, EyeOffOutline } from 'mdi-material-ui'
import CircularProgress from '@mui/material/CircularProgress'

// import react router
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

// import context
// import ChatContext from 'src/context/ChatProvider'

//import images
import ArrowRight from '../../../assets/Images/Icons/arrow-right.png'

// ** Third Party Imports
import * as yup from 'yup'
import { useFormik } from 'formik'

// toast popup
import { toast, ToastContainer } from 'react-toastify'

//import config file
import { API_PATHS } from 'src/config/api.config'

//ticket context
import TicketContext from 'src/context/TicketProvider'
import { Helmet } from 'react-helmet'
import io from 'socket.io-client'

//env file
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC
const API_VERSION = process.env.REACT_APP_API_VERSION
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL

// ** Layout Import
const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(5).required('Password is required')

})

interface FormData {
  email: string
  password: string
  platform: string
}

const LoginDemo = () => {
  const { setLoading, loading } = React.useContext<any>(TicketContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      plateform: 2
    },

    validationSchema: schema,
    onSubmit: (values: any) => {
      handleLogin(values)
    }
  })

  const [isConnected, setIsconnected] = useState("")
  console.log(isConnected + "<<<<<")

  const handleLogin = async (data: FormData) => {
    setLoading(true)
    if (data.email === '' || data.password === '') {
      toast.error('Please fill all the fields')
    } else {
      const url = new URL(`${BASE_URL_PUBLIC}/${API_VERSION}/${API_PATHS.login}`)
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
          const token = result.payload.token

          // const socket = io(`${SOCKET_URL}Bearer ${token}`, { transports: ['websocket'] });



          localStorage.setItem('user1Role', result.payload.data.userRole)
          localStorage.setItem('user1Data', JSON.stringify(result.payload))
          setLoading(false)
          navigate('/user/dashboard')
          const socket = io(`${SOCKET_URL}`, {
            transports: ['websocket'],
            auth: { token: `Bearer ${token}` },
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000
          });
          socket.on('connection', () => {
            setIsconnected("Connected to Socket.IO server");
          });
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

  return (
    <>
      <Helmet>
        <title>Login - Gogtas</title>
        <meta name="description" content="Login - Gogtas" />
      </Helmet>
      <Box
        className='loginBox'
        sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        {/* <Stack rowGap={5}> */}
        <Typography
          sx={{
            fontFamily: 'Mazzard-regular',
            fontWeight: '600',
            fontSize: { md: '45px', xs: '35px', sm: '40px' },
            textAlign: 'center',
            color: '#182434',
            lineHeight: '43px'
          }}
        >
          Login to Your Account
        </Typography>
        {/* </Stack> */}

        <Card sx={{ mt: 5 }} style={{ boxShadow: 'none' }}>
          <CardContent
            sx={{
              pt: '55px',
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
              <FormControl fullWidth sx={{ mb: 10 }}>
                <InputLabel
                  htmlFor='email'
                  error={Boolean(formik.errors.email && formik.touched.email)}
                  sx={{ color: 'rgba(27, 11, 43, 0.79)', fontweight: '400', fontSize: '15px' }}
                >
                  Email*
                </InputLabel>
                <OutlinedInput
                  sx={{ height: '60px', color: 'rgba(27, 11, 43, 0.79)', fontSize: '17px' }}
                  autoFocus
                  label='Email'
                  id='email'
                  value={formik.values.email}
                  fullWidth
                  placeholder='Email'
                  className='admin-login'
                  onBlur={formik.handleBlur}
                  onChange={event => {
                    event.target.value = event.target.value.trim()
                    formik.handleChange(event)
                  }}
                  error={Boolean(formik.errors.email && formik.touched.email)}
                />
                {formik.errors.email && formik.touched.email && (
                  <FormHelperText sx={{ color: 'error.main' }}>{formik.errors.email}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 0 }}>
                <InputLabel
                  htmlFor='password'
                  error={Boolean(formik.errors.password && formik.touched.password)}
                  sx={{ color: 'rgba(27, 11, 43, 0.79)', fontweight: '400', fontSize: '15px' }}
                >
                  Password*
                </InputLabel>
                <OutlinedInput
                  sx={{ height: '60px', color: 'rgba(27, 11, 43, 0.79)', fontSize: '17px' }}
                  value={formik.values.password}
                  label='Password'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  fullWidth
                  id='password'
                  placeholder='Password'
                  className='admin-login'
                  error={Boolean(formik.errors.password && formik.touched.password)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {formik.errors.password && formik.touched.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {formik.errors.password}
                  </FormHelperText>
                )}
              </FormControl>
              <p style={{ textAlign: 'right', width: '100%', marginTop: '8px' }}>
                <Link
                  to='/userForgotPassword'
                  style={{
                    textDecoration: 'none',
                    color: '#2d4acd',
                    fontSize: '15px',
                    fontWeight: '500',
                    fontFamily: 'Mazzard'
                  }}
                >
                  Forgot Password?
                </Link>
              </p>

              <Button
                type='submit'
                variant='contained'
                sx={{
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  fontSize: '15px',
                  width: '100% !important',
                  height: '60px',
                  padding: '15px !important',
                  boxShadow: '0px 3px 15px rgb(45 74 205 / 55%)',
                  my: 2
                }}
              >
                {loading ? (
                  <CircularProgress color='inherit' />
                ) : (
                  <>
                    Log in <img alt="right-arrow" src={ArrowRight} style={{ marginLeft: '11px' }} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
      <ToastContainer autoClose={3000} position='bottom-right' />
    </>
  )
}

export default LoginDemo
