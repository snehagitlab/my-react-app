// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Imports
import { Link } from 'react-router-dom'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'src/assets/Images/Icons/google.png'
import Apple from 'src/assets/Images/Icons/apple.png'
import Microsoft from 'src/assets/Images/Icons/microsoft.png'
import IconRight from 'src/assets/Images/Icons/arrow-right.png'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: 'admin',
  email: 'admin@materio.com'
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgClasses = useBgColor()
  const {
    settings: { skin }
  } = useSettings()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password }, () => {
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }

  return (
    <Box className='content-center'>
      <Box sx={{ mb: 10 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', marginBottom: 1.5 }}>
          Login to Your Account
        </Typography>
      </Box>
      <Box sx={{ maxWidth: theme => theme.spacing(100) }}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          {/* <FormControl fullWidth sx={{ mb: 4 }}> */}
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <>
                <InputLabel sx={{ mb: 2 }}>Email</InputLabel>
                <TextField
                  autoFocus
                  // label='Email'
                  value={value}
                  fullWidth
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  placeholder='admin@materio.com'
                  sx={{ mb: 5 }}
                />
              </>
            )}
          />
          {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}

          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <>
                <InputLabel sx={{ mb: 2 }} htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <OutlinedInput
                  value={value}
                  onBlur={onBlur}
                  label='Password'
                  onChange={onChange}
                  fullWidth
                  id='auth-login-v2-password'
                  error={Boolean(errors.password)}
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
              </>
            )}
          />
          {errors.password && (
            <FormHelperText sx={{ color: 'error.main' }} id=''>
              {errors.password.message}
            </FormHelperText>
          )}
          <Box sx={{ mb: 4, mt: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'right' }}>
            <Link to='/forgot-password'>
              <LinkStyled>Forgot Password?</LinkStyled>
            </Link>
          </Box>
          <Button
            endIcon={<img src={IconRight} />}
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            sx={{ mb: 5, borderRadius: 2, p: '15px !important', textTransform: 'none' }}
          >
            Log in
          </Button>
          <Divider>
            <Typography>OR</Typography>
          </Divider>
          <Box sx={{ mt: 7 }}>
            <Button
              fullWidth
              startIcon={<img src={Google} alt='google' />}
              size='large'
              type='submit'
              variant='contained'
              sx={{
                marginBottom: 7,
                padding: '15px !important',
                borderRadius: 2,
                backgroundColor: '#FFFFFF',
                color: '#000000',
                textTransform: 'none',
                '&:hover': { backgroundColor: theme => theme.palette.grey[200] }
              }}
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              startIcon={<img src={Microsoft} alt='microsoft' />}
              size='large'
              type='submit'
              variant='contained'
              sx={{
                marginBottom: 7,
                padding: '15px !important',
                borderRadius: 2,
                backgroundColor: '#FFFFFF',
                color: '#000000',
                textTransform: 'none',
                '&:hover': { backgroundColor: theme => theme.palette.grey[200] }
              }}
            >
              Continue with Microsoft
            </Button>
            <Button
              fullWidth
              startIcon={<img src={Apple} alt='apple' />}
              size='large'
              type='submit'
              variant='contained'
              sx={{
                marginBottom: 7,
                padding: '15px !important',
                borderRadius: 2,
                backgroundColor: '#FFFFFF',
                color: '#000000',
                textTransform: 'none',
                '&:hover': { backgroundColor: theme => theme.palette.grey[200] }
              }}
            >
              Continue with Apple
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography variant='h6' sx={{ color: theme => theme.palette.primary.dark }}>
              <Link to='/register'>
                <LinkStyled>Signup for an account</LinkStyled>
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

// LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

// LoginPage.guestGuard = true

export default LoginPage
