import React, { useState, MouseEvent, useEffect } from 'react'

import {
  Modal,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  OutlinedInput,
  InputLabel,
  Grid,
  IconButton,
  Button,
  FormHelperText

} from '@mui/material'
import { IconX } from '@tabler/icons'
import { toast } from 'react-toastify'
import InputAdornment from '@mui/material/InputAdornment'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// toast popup
//import { toast } from 'react-toastify'

// ** Icons Imports
import AddUsrAgentAvatar from 'src/assets/Images/setting_icons/password_change.png'

//import ResetPassword from 'src/assets/Images/setting_icons/password_change.png'
import OrganisationContext from 'src/context/OrganisationProvider'


import { useFormik } from 'formik'
import { API_PATHS } from 'src/config/api.config'
import * as yup from 'yup'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

interface IAddUserAgentModalProps {
  open: boolean
  onClose: any
  userId: any
}
const ChangePasswordModal = (props: IAddUserAgentModalProps) => {
  const [values, setValues] = useState<any>({
    showPassword: false,
    showPassword2: false
  })

  // const [errorMsg, setErrorMsg] = useState(false)

  const { changepasstoggle } = React.useContext<any>(OrganisationContext)
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickShowConfirmPassword1 = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 })
  }

  const handleMouseDownConfirmPassword1 = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const schema = yup.object().shape({
    newPassword: yup.string().min(8, 'Passowrd contain greater than 8 character').required('This field is required').matches(/[@$!%*#?&]+/, "Password must contain a special character") /* .matches(/\d+/, "One number is required.") */,
    confirmPassword1: yup.string().min(8, 'Passowrd contain greater than 8 character').required('This field is required').oneOf([yup.ref('newPassword'), null], 'Password and new password does not match').matches(/[@$!%*#?&]+/, "Password must contain a special character") /* .matches(/\d+/, "One number is required.") */
  })
  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword1: ''
    },

    validationSchema: schema,

    onSubmit: () => {
      {
        handleChangePassword()
      }
    }
  })

  //console.log(props.userId)

  const handleChangePassword = async () => {
    /* alert(formik.errors.newPassword)
    if(formik.errors.confirmPassword1 && formik.errors.newPassword)
    {  */
    const defaultData = {}
    Object.assign(defaultData, { userId: props.userId })
    Object.assign(defaultData, { new_password: formik.values.newPassword })
    Object.assign(defaultData, { verify_password: formik.values.confirmPassword1 })

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/update/password`)
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${UserData.token}`
        },
        body: JSON.stringify(defaultData)
      })


      const result = await response.json()
      if (result.status === 200) {
        formik.resetForm()
        toast.success(result.message)
        props.onClose()

      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.log(error)
    }

    /*  }
    else
    {
      alert('done1')
      setErrorMsg(true)
    }  */
  }

  const reserformikValue = async () => {
    formik.resetForm()
  }

  useEffect(() => {
    reserformikValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changepasstoggle])


  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
        className='reset-password-modal'
      >
        <Box sx={{ overflowY: 'scroll' }}>
          <Card
            sx={{
              maxWidth: 500,
              position: 'fixed',
              left: 'calc(50% - 300px)'
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: '3px',
                left: '90%',
                zIndex: 500
              }}
              onClick={props.onClose}
            >
              <IconX />
            </IconButton>
            <CardContent sx={{ pt: 8, pl: 8, pr: 8, mb: 8 }}>
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <img alt="user-icon" src={AddUsrAgentAvatar} style={{ height: 120, width: 120 }} />
                  <Box sx={{ m: 5 }}>
                    <Typography variant='h5'> Reset Password</Typography>
                  </Box>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignContent={'center'} sx={{ width: '400px', marginLeft: '9px' }} >
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard',
                      color: '#4C5A6D',
                      fontWeight: '400',
                      fontSize: '14px',
                      textAlign: "center",
                      mt: '-15px',
                      mb: '10px'
                    }}
                  >
                    *Password must be alphanumeric with 1 Special character and at least 8 character long
                  </Typography>
                </Box>
                <Grid container spacing={5}>

                  <Grid item xs={12} md={9} sx={{ marginLeft: '60px' }}>
                    <FormControl fullWidth>
                      <InputLabel>Password*</InputLabel>
                      <OutlinedInput
                        label='Password'
                        value={formik.values.newPassword}
                        name='newPassword'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.errors.newPassword && formik.touched.newPassword)}
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
                      />
                      {formik.errors.newPassword && formik.touched.newPassword &&(
                        <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important' }} id=''>
                          {formik.errors.newPassword}
                        </FormHelperText>
                      )}


                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={9} sx={{ marginLeft: '60px' }}>
                    <FormControl fullWidth>
                      <InputLabel>Confirm Password*</InputLabel>
                      <OutlinedInput
                        value={formik.values.confirmPassword1}
                        label='Confirm Password'
                        name='confirmPassword1'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.errors.confirmPassword1 && formik.touched.confirmPassword1 )}
                        type={values.showPassword2 ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              aria-label='toggle password visibility'
                              onClick={handleClickShowConfirmPassword1}
                              onMouseDown={handleMouseDownConfirmPassword1}
                            >
                              {values.showPassword2 ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {formik.errors.confirmPassword1 && formik.touched.confirmPassword1  &&  (
                        <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important' }} id=''>
                          {formik.errors.confirmPassword1}
                        </FormHelperText>
                      )}


                    </FormControl>
                  </Grid>


                  {/* errorMsg ?  
                <Grid item xs={6} md={12} sx={{ alignItem: 'center', justifyContent: 'center' }}>
            
                <Typography
                sx={{
                  fontFamily: 'Mazzard',
                  color: 'red',
                  fontWeight: '400',
                  fontSize: '14px',
                  textAlign: "center",
                  
                }}
                >       
                Please Enter Valid Password
                </Typography>
                </Grid>
                : '' */

                  }

                  <Grid item xs={6} md={12} sx={{ alignItem: 'center', justifyContent: 'center' }}>
                    <Box m={1} display='flex' justifyContent='center' alignItems='center'>


                      <Button
                        type='submit'
                        size='large'
                        sx={{ marginLeft: '10px', textTransform: 'capitalize' }}
                        variant='contained'
                      >
                        Reset  Password
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Modal>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}

export default ChangePasswordModal
