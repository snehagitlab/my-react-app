import React, { MouseEvent, useState, useEffect } from 'react'
import {
  Grid, Typography, Card,
  CardContent, Modal
  , FormHelperText
} from '@mui/material'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import Box from '@mui/material/Box'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { API_PATHS } from '../../../config/api.config'
import * as yup from 'yup'
import { IconX } from '@tabler/icons'
import AddUsrAgentAvatar from '../../../assets/Images/setting_icons/password_change.png'
import TicketContext from '../../../context/TicketProvider'


interface IAddUserAgentModalProps {
  open: boolean
  onClose: any
}

//env fileee
// didhd
const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const API_VERSION = import.meta.env.VITE_APP_API_VERSION



const ChangePassword = (props: IAddUserAgentModalProps) => {
  const { changepasstoggleuser } = React.useContext<any>(TicketContext)

  const [values, setValues] = useState<any>({
    showPassword: false,
    showOldPassword: false,
    showPassword2: false
  })
  const handleClickShowPasswordOld = () => {
    setValues({ ...values, showOldPassword: !values.showOldPassword })
  }
  const handleMouseDownPasswordOld = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
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
    oldPassword: yup.string().min(8, 'Password length must be greater than 8 characters.').required('*Oldpassword  is required.'),
    newPassword: yup.string().min(8, 'Password length must be greater than 8 characters.').required('*Newpassword is required.').matches(/[@$!%*#?&]+/, "Password must contain a special character.")/* .matches(/\d+/, "One number is required.") */,
    confirmPassword: yup.string().min(8, 'Password length must be greater than 8 characters.').required('*Confirmpassword is required.').oneOf([yup.ref('newPassword'), null], 'Password and new password does not match.').matches(/[@$!%*#?&]+/, "Password must contain a special character.")/* .matches(/\d+/, "One number is required.") */

  })
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },

    validationSchema: schema,

    onSubmit: () => {
      {
        handleChangePassword()
      }
    }
  })
  const handleChangePassword = async () => {
    const defaultData = {}
    Object.assign(defaultData, { old_password: formik.values.oldPassword })
    Object.assign(defaultData, { new_password: formik.values.newPassword })
    Object.assign(defaultData, { verify_password: formik.values.confirmPassword })

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/change-password`)
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
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

      //console.log(defaultData)

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
  }

  const reserformikValue = async () => {
    formik.resetForm()
  }

  useEffect(() => {
    reserformikValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changepasstoggleuser])


  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
        className='user-agent-modal'
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
                  <img alt="user-avatar" src={AddUsrAgentAvatar} style={{ height: 120, width: 120 }} />
                  <Box sx={{ m: 5 }}>
                    <Typography variant='h5'> Update Your Password</Typography>
                  </Box>

                  {/*  <Box display={'flex'} justifyContent={'center'} alignContent={'center'}>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        color: '#4C5A6D',
                        fontWeight: '400',
                        fontSize: '16px',
                        textAlign: "center",
                        mt: '-15px',
                        mb: '10px'
                      }}
                    > Your new password must be different from previous used passwords</Typography>
                  </Box> */}

                </Box>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={11} sx={{ marginLeft: '20px' }}>
                    <FormControl fullWidth>
                      <InputLabel>Old Password*</InputLabel>
                      <OutlinedInput
                        label='Old Password'
                        value={formik.values.oldPassword}
                        name='oldPassword'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type={values.showOldPassword ? 'text' : 'password'}
                        error={Boolean(formik.errors.oldPassword && formik.touched.oldPassword)}

                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowPasswordOld}
                              onMouseDown={handleMouseDownPasswordOld}
                              aria-label='toggle password visibility'
                            >
                              {values.showOldPassword ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {formik.errors.oldPassword && formik.touched.oldPassword && (
                        <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important' }}>
                          {formik.errors.oldPassword}
                        </FormHelperText>
                      )}



                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={11} sx={{ marginLeft: '20px' }}>
                    <FormControl fullWidth>
                      <InputLabel>New Password*</InputLabel>
                      <OutlinedInput
                        label='New Password'
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
                      {formik.errors.newPassword && formik.touched.newPassword && (
                        <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important' }} id=''>
                          {formik.errors.newPassword}
                        </FormHelperText>
                      )}


                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={11} sx={{ marginLeft: '20px' }}>
                    <FormControl fullWidth>
                      <InputLabel>Confirm Password*</InputLabel>
                      <OutlinedInput
                        value={formik.values.confirmPassword}
                        label='Confirm Password'
                        name='confirmPassword'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.errors.confirmPassword && formik.touched.confirmPassword)}
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
                      />
                      {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                        <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important' }} id=''>
                          {formik.errors.confirmPassword}
                        </FormHelperText>
                      )}


                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={12} sx={{ alignItem: 'center', justifyContent: 'center' }}>
                    <Box m={1} display='flex' justifyContent='center' alignItems='center'>


                      <Button
                        type='submit'
                        size='large'
                        sx={{ marginLeft: '10px', textTransform: 'capitalize' }}
                        variant='contained'
                      >
                        Update Password
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
export default ChangePassword


/* import { Grid, Typography } from '@mui/material'

const AdminPassword = () => {
    
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography>AdminAccountDetails</Typography>
      </Grid>
    </Grid>
  )
}

export default AdminPassword */
