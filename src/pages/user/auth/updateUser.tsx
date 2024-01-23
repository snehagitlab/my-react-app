// ** React Imports,useCallback useState
import React, { useEffect, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { useFormik } from 'formik'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ImageUpdateIcon from '../../../assets/Images/update_image_icon.svg'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MuiAvatar from '@mui/material/Avatar'
import { DefaultProfilePic } from '../../../views/apps/chat/chatContent/defaultProfilePic'

//import axios
import axios from 'axios'

//import images
import Scrolling from '../../../assets/Images/user_Icons/light/scrolling.svg'

//import config
import { API_PATHS, FILE_TYPE } from '../../../config/api.config'

//env file
const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const BASE_URL_PUBLIC = import.meta.env.VITE_APP_BASE_URL_PUBLIC
const API_VERSION = import.meta.env.VITE_APP_API_VERSION

//toasify
import { toast } from 'react-toastify'

//import formik
import * as yup from 'yup'

//import compoennts
import TicketContext from '../../../context/TicketProvider'
import ChatContext from '../../../context/ChatProvider'
import ChangePassword from '../../../pages/user/auth/changePassword'
import LoadingButton from '@mui/lab/LoadingButton'

//import image url
const imagePath = 'https://storage.googleapis.com/'

// import file upload type
const usertype: any = parseInt(FILE_TYPE.USER_LOGO)

const UpdateUser = () => {

  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const userId = user.data.userId
  const { updateuserProfile, setupdateuserProfile, setShowUpdateUserData, showUpdateUserData, setchangepasstoggleuser, changepasstoggleuser } = React.useContext<any>(TicketContext)
  const { updateUserStyle, handleUserUpdateClose } = React.useContext<any>(ChatContext)
  const [finalFilePath, setFinalfilePath] = React.useState<any>()
  const [openChangePasswordModal, setOpenChangePasswordModal] = React.useState<boolean>(false)
  const [handleDetails, sethandleDetails] = React.useState(false)
  const toggleChangePasswordModalOpen = () => {
    setOpenChangePasswordModal(true)
    setchangepasstoggleuser(!changepasstoggleuser)

  }
  const toggleChangePasswordModalclose = () => {
    setOpenChangePasswordModal(!openChangePasswordModal)
  }
  const [imgPath, setImagePath] = React.useState<any>()
  const fileInput: any = useRef()
  const finalImgPath = [finalFilePath]
  const [loader, setLoader] = React.useState(false)


  const selectFile = () => {
    fileInput.current.click()
  }

  // useEffect(() => {
  //   if (handleDetails) {
  //     handleGetUserDetails()
  //   }
  // }, [handleDetails])

  //get image onChnage event
  const handleGetUserImg = async (e: any) => {
    setLoader(true)
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function (e: any) {
        setImagePath(e.target.result)
      }
      reader.readAsDataURL(file)
    }
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', usertype)
    try {
      const response = await axios.post(`${BASE_URL_PUBLIC}/v1/file`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${UserData.token}`
        }
      })
      setImagePath(`${imagePath}` + response.data.payload.filesPath[0].filePath)
      setFinalfilePath(response.data.payload.filesPath[0].filePath)
      setLoader(false)
    } catch (error) {
      console.log(error)
    }
  }

  //end of get image onChnage event

  const schema = yup.object().shape({
    email: yup.string().email('Invalid Email Format').required(),
    fname: yup.string().min(3).required(),
    lname: yup.string().min(3).required()
  })
  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      email: '',
      address: '',
      city: '',
      country: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      {
        handleEditUserData()
      }
    }
  })

  // ** Get User Details
  // const handleGetUserDetails = async () => {
  //   const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/detail?userId=${userId}`)
  //   const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  //   try {
  //     const response = await fetch(url.toString(), {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //         Authorization: `Bearer ${user.token}`
  //       }
  //     })
  //     const result = await response.json()
  //     if (result.status == 200) {
  //       const data = result.payload.data
  //       formik.setFieldValue('fname', data.fname)
  //       formik.setFieldValue('email', data.email)
  //       formik.setFieldValue('lname', data.lname)
  //       formik.setFieldValue('address', data.address)
  //       formik.setFieldValue('country', data.country)
  //       formik.setFieldValue('city', data.city)
  //       setImagePath(data.profilePicture)
  //     } else {
  //       console.log(result.message)
  //     }
  //   } catch (ex: any) { }
  // }

  //edit user details
  const handleEditUserData = async () => {
    const formData: any = new FormData()
    formData.append('fname', formik.values.fname)
    formData.append('lname', formik.values.lname)
    formData.append('email', formik.values.email)
    formData.append('address', formik.values.address)
    formData.append('country', formik.values.country)
    formData.append('city', formik.values.city)
    formData.append('profilePicture', finalImgPath)

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/profile`)
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
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
        setupdateuserProfile(!updateuserProfile)
        handleUserUpdateClose()
      } else {
        toast.error(response2.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   handleGetUserDetails()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [showUpdateUserData])

  return (
    <>
      <Box className='pendingTickets' sx={updateUserStyle}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{ width: '22%', display: { xs: 'none', sm: 'none', md: 'block' } }}
            onClick={() => { handleUserUpdateClose(), sethandleDetails(true) }}
          ></Box>
          <Box
            sx={{
              width: { xs: '100%', sm: '100%', md: '78%' },
              boxShadow: '0 0 60px lightgrey',
              background: '#f6f8f9',
              position: 'relative'
            }}
          >
            <IconButton
              size='small'
              onClick={() => { handleUserUpdateClose(), sethandleDetails(true) }}
              sx={{
                color: 'text.secondary',
                position: 'absolute',
                left: { xs: '0px', sm: '0px', md: '-25px' },
                top: '15px'
              }}
            >
              <img src={Scrolling} alt='rightArrow' style={{ width: '41px', height: '41px', marginTop: '3px' }} />
            </IconButton>
            <Grid
              container
              alignItems={'center'}
              justifyContent={'space-evenly'}
              sx={{
                background: 'white',
                borderBottom: '1px solid lightgray'
              }}
            ></Grid>
            <Grid
              container
              alignItems={'center'}
              justifyContent={'space-evenly'}
              sx={{
                background: 'white',
                borderBottom: '1px solid lightgray'
              }}
            >
              <Grid item md={12} sx={{ textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    padding: '24px 60px',
                    color: 'rgba(42, 58, 81, 0.87)',
                    textTransform: 'capitalize',
                    fontWeight: '600',
                    fontSize: '24px'
                  }}
                >
                  User Profile
                </Typography>
              </Grid>
            </Grid>

            <form
              onSubmit={formik.handleSubmit}
              style={{
                width: '100%',
                justifyContent: 'space-evenly',
                display: 'flex',
                height: 'calc(100vh - 84px)',
                overflowY: 'auto',
                paddingTop: '20px',
                background: '#ffffff'
              }}
            >
              <Grid container spacing={6} sx={{ width: { xs: '100%', sm: '100%', md: '70%' }, alignItems: 'center' }}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  display='flex'
                  justifyContent='center'
                  alignItems={'center'}
                  sx={{ paddingTop: '52px !important' }}
                >
                  <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    sx={{
                      height: '120px',
                      width: '120px',
                      border: '5px solid #2d4acd2b',
                      boxSizing: 'border-box',
                      borderRadius: '60px',
                      position: 'relative'
                    }}
                  >

                    <MuiAvatar src={imgPath == '' ? `${DefaultProfilePic}` : `${imgPath}`} alt='User Profile' sx={{ width: '100%', height: '100%' }} />
                    <input
                      type='file'
                      style={{ display: 'none' }}
                      ref={fileInput}
                      onChange={handleGetUserImg}
                      accept='image/*'
                    />
                    <IconButton
                      size='small'
                      sx={{ color: 'text.secondary', position: 'absolute', bottom: '-5px', right: '-10px' }}
                    >
                      <img
                        onClick={selectFile}
                        src={ImageUpdateIcon}
                        alt='rightArrow'
                        style={{ width: '34px', height: '34px' }}
                      />
                    </IconButton>
                  </Box>
                  <Grid item sx={{ marginLeft: '30px' }}>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        color: '#000021',
                        textTransform: 'capitalize',
                        fontWeight: '500',
                        fontSize: '35px',
                        paddingBottom: '0px'
                      }}
                    >
                      {formik.values.fname} {formik.values.lname}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        color: '#4C5A6D',
                        fontWeight: '500',
                        fontSize: '16px',
                        mt: '-3px'
                      }}
                    >
                      {formik.values.email}
                    </Typography>
                  </Grid>
                  <Button
                    size='large'
                    sx={{ ml: 10, textTransform: 'capitalize' }}
                    variant='contained'
                    onClick={toggleChangePasswordModalOpen}
                  >
                    Change Password
                  </Button>
                </Grid>

                <Grid item xs={6} md={6}>
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
                    <InputLabel>First Name*</InputLabel>
                    <OutlinedInput
                      value={formik.values.fname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Fname'
                      name='fname'
                      id='fname'
                      error={Boolean(formik.errors.fname && formik.touched.fname)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6}>
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
                    <InputLabel>Last Name*</InputLabel>
                    <OutlinedInput
                      value={formik.values.lname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Lname'
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
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
                    <TextField
                      rows={3}
                      multiline
                      name='address'
                      id='address'
                      label='Address'
                      onChange={formik.handleChange}
                      value={formik.values.address == 'null' ? ' ' : formik.values.address}
                      error={Boolean(formik.errors.address && formik.touched.address)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6}>
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
                    <InputLabel>City</InputLabel>
                    <OutlinedInput
                      value={formik.values.city == 'null' ? ' ' : formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='City'
                      name='city'
                      id='city'
                      error={Boolean(formik.errors.city && formik.touched.city)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6}>
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
                    <InputLabel>Country</InputLabel>
                    <OutlinedInput
                      value={formik.values.country == 'null' ? ' ' : formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Country'
                      name='country'
                      id='country'
                      error={Boolean(formik.errors.country && formik.touched.country)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6} md={12} sx={{ alignItem: 'center', justifyContent: 'center' }}>
                  <Box m={1} display='flex' justifyContent='center' alignItems='center' sx={{ marginBottom: '60px' }}>
                    <Button

                      size='large'
                      sx={{ marginLeft: '10px', textTransform: 'capitalize' }}
                      variant='outlined'
                      onClick={() => { handleUserUpdateClose(), sethandleDetails(true) }}
                    >
                      Cancel
                    </Button>
                    {
                      loader ?
                        <>
                          <LoadingButton
                            loading={loader}
                            variant='contained'
                            size='large'
                            disabled
                            sx={{
                              textTransform: 'capitalize',
                              marginLeft: '10px'
                            }}
                          >
                            Update
                          </LoadingButton>
                        </>
                        :
                        <>
                          <Button
                            type='submit'
                            size='large'
                            sx={{ marginLeft: '10px', textTransform: 'capitalize' }}
                            variant='contained'
                          >
                            Update
                          </Button>
                        </>
                    }

                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Box>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
      <ChangePassword open={openChangePasswordModal} onClose={toggleChangePasswordModalclose} />

    </>

  )
}

export default UpdateUser
