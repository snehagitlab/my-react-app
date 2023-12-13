import { useState } from 'react'
import loginshadow from '../../assets/Images/loginshadow.png'

// ** MUI Components
import { useTheme } from '@mui/material/styles'

// toast popup
import { toast } from 'react-toastify'

// ** Third Party Imports
import * as yup from 'yup'
import { useFormik } from 'formik'
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputAdornment,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
  Alert,
  AlertTitle
} from '@mui/material'
import { EyeOutline, EyeOffOutline } from 'mdi-material-ui'
import { Link, useNavigate } from 'react-router-dom'
import { API_PATHS } from 'src/config/api.config'
import {Helmet} from "react-helmet";

//env file
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC

// ** Layout Import

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(5).required('Password is required')
})

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [error, setError] = useState<any>({ status: false, msg: '' })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      plateform: 1
    },

    validationSchema: schema,
    onSubmit: (values: any) => {
      handleLogin(values)
    }
  })

  const handleLogin = async (data: FormData) => {
    const url = new URL(`${BASE_URL_PUBLIC}/${API_VERSION}/${API_PATHS.login}`)
    if (data.email === '' && data.password === '') {
      setError({ status: true, msg: 'Please enter email and password' })
    }
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
        localStorage.setItem('userRole', result.payload.data.userRole)
        localStorage.setItem('userData', JSON.stringify(result.payload))
        navigate('/dashboard')
      } else {
        toast.error(result.message)
      }
    } catch (err: any) {
      console.log(err.status)
      toast.error(err.message)
    }
  }

  return (
    <> <Helmet>
    <title>Login-Gogtas</title>
    <meta name="description" content="Login" />
    </Helmet>
    <Box
      className='content-center'
      sx={{
        backgroundImage: `linear-gradient(${theme.palette.primary.main} 50%,#FFF 50%)`,
        color: 'darkred',
        position: 'relative'
      }}
    >
      <img alt="login-shadow" src={loginshadow} className='login-img' />
      <Box className='main-div'>
        <Stack>
          <Typography
            sx={{
              fontWeight: '600',
              fontSize: { xs: '40px', sm: '45px', md: '50px' },
              textAlign: 'left',
              color: 'white',
              fontFamily: 'Mazzard-regular'
            }}
          >
            Welcome back
          </Typography>
          <Typography
            sx={{
              color: '#D5DBF5',
              weight: '400',
              fontSize: { xs: '20px', sm: '24px', md: '24px' },
              lineHeight: '38px',
              fontFamily: 'Mazzard-regular'
            }}
          >
            Welcome back! Please enter your details.
          </Typography>
        </Stack>

        <Card sx={{ mt: 5, pt: 5, pb: 5, borderRadius: '11px' }}>
          <CardContent
            className='form-main-div'
            sx={{
              pt: 10,
              pl: 5,
              pr: 5
            }}
          >
            {/* ERROR COMPONENT */}
            {error.status && (
              <Box sx={{ mb: 10, position: 'absolute', bottom: 10, right: 20, m: 5 }}>
                <Alert severity='error' sx={{ width: 300 }}>
                  <AlertTitle>Error</AlertTitle>
                  {error.msg}
                </Alert>
              </Box>
            )}
            <form
              noValidate
              autoComplete='off'
              onSubmit={formik.handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FormControl fullWidth sx={{ mb: 10 }}>
                <InputLabel htmlFor='email' >
                  Email*
                </InputLabel>
                <OutlinedInput
                  sx={{ height: '60px', color: 'rgba(27, 11, 43, 0.79)', fontSize: '17px' }}
                  autoFocus
                  label='Email'
                  id='email'
                  className='admin-login'
                  placeholder='email123'
                  value={formik.values.email}
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={event => {
                    event.target.value = event.target.value.trim()
                    formik.handleChange(event)
                  }}
                  error={Boolean(formik.errors.email && formik.touched.email)}
                />
                {formik.errors.email && formik.touched.email && (
                  <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important' }}>
                    {formik.errors.email}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel htmlFor='password'>
                  Password*
                </InputLabel>
                <OutlinedInput
                  sx={{ height: '60px', color: 'rgba(27, 11, 43, 0.79)', fontSize: '17px' }}
                  value={formik.values.password}
                  label='Password'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  fullWidth
                  placeholder='password'
                  className='admin-login'
                  id='password'
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
                  <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important' }} id=''>
                    {formik.errors.password}
                  </FormHelperText>
                )}
              </FormControl>
              <p style={{ textAlign: 'right', width: '100%' }}>
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
                size='large'
                type='submit'
                variant='contained'
                sx={{
                  textTransform: 'capitalize',
                  width: '140.21px !important',
                  height: '60px',
                  padding: '10px !important',
                  marginTop: '36px',
                  borderRadius: '9px',
                  fontSize: '16px'
                }}
              >
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
    </> 
  )
}

// LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
