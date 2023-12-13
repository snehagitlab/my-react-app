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
import ImageUpdateIcon from 'src/assets/Images/update_image_icon.svg'

//import Typography from '@mui/material/Typography'

//import TextField from '@mui/material/TextField'

import MuiAvatar from '@mui/material/Avatar'
import SettingPage from 'src/pages/admin/setting'

//import axios
import axios from 'axios'

//import config
import { API_PATHS, FILE_TYPE } from 'src/config/api.config'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC
const API_VERSION = process.env.REACT_APP_API_VERSION

//toasify
import { toast } from 'react-toastify'

//import formik
import * as yup from 'yup'

//import compoennts
import LoadingButton from '@mui/lab/LoadingButton'
import OrganisationContext from 'src/context/OrganisationProvider'
import {Helmet} from "react-helmet";

//import image url
const imagePath = 'https://storage.googleapis.com/'

// import file upload type
const usertype: any = parseInt(FILE_TYPE.USER_LOGO)

const AccountSettings = () => {
  const user = JSON.parse(localStorage.getItem('userData') || '{}')
  const userId = user.data.userId
  const { getupdateadmin, setupdateadmin } = React.useContext<any>(OrganisationContext)

  //const { updateUserStyle, handleUserUpdateClose } = React.useContext<any>(ChatContext)
  const [finalFilePath, setFinalfilePath] = React.useState<any>()


  const [imgPath, setImagePath] = React.useState<any>()
  const fileInput: any = useRef()
  const finalImgPath = [finalFilePath]
  const [updateAdminLoading, setUpdateAdminLoading] = React.useState(false)


  const selectFile = () => {
    fileInput.current.click()
  }

  //get image onChnage event
  const handleGetUserImg = async (e: any) => {
    const file = e.target.files[0]
    const FileExtemsion = ['jpg', 'jpeg', 'png']
    if (FileExtemsion.includes(file.name.split('.').pop().toLowerCase())) {

      if (file) {
        const reader = new FileReader()
        reader.onload = function (e: any) {
          setImagePath(e.target.result)
        }
        reader.readAsDataURL(file)
      }
      setUpdateAdminLoading(true)
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
        setUpdateAdminLoading(false)

      } catch (error) {
        setUpdateAdminLoading(false)
        console.log(error)
      }
    } else {
      toast.error(`This ${file.name.split('.').pop()} can't support`)
    }
  }

  //end of get image onChnage event

  const schema = yup.object().shape({
    email: yup.string().email('Invalid Email Format').required(),
    fname: yup.string().min(3).required(),
    lname: yup.string().min(3).required(),
    phone: yup.string().matches(/^[0-9]+$/, 'Must be only digits').length(10, 'Please enter a valid mobile number.'),
  })
  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      email: '',
      phone: ''
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
        setImagePath(data.profilePicture)
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
    formData.append('profilePicture', finalImgPath)
    formData.append('phone', formik.values.phone)
    setUpdateAdminLoading(true)

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/profile`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
      const response2: any = await axios.put(`${url}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      })
      if (response2.status === 200) {
        toast.success(response2.data.message)
        setupdateadmin(!getupdateadmin)
        setUpdateAdminLoading(false)

      } else {
        toast.error(response2.message)
        setUpdateAdminLoading(false)

      }
    } catch (error) {
      console.log(error)
      setUpdateAdminLoading(false)
    }
  }

  useEffect(() => {
    handleGetUserDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (


    <>
    <Helmet>
        <title>Account Settings - Gogtas</title>
        <meta name="description" content="Account Settings" />
    </Helmet>
      <Grid sx={{ display: 'flex' }}>
        <Grid md={4}>
          <SettingPage />
        </Grid>
        <Grid md={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              width: '100%',
              maxWidth: '600px',
              justifyContent: 'center',
              display: 'flex ',
              overflowY: 'auto'
            }}
          >
            <Grid container spacing={6} sx={{ width: { xs: '100%', sm: '100%', md: '100%' }, alignItems: 'center' }}>
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

                  <MuiAvatar src={`${imgPath}`} alt='User Profile' sx={{ width: '100%', height: '100%' }} />
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

              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth >
                  <InputLabel>First Name*</InputLabel>
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
              <Grid item xs={6} md={6}>
                <FormControl fullWidth >
                  <InputLabel>Last Name*</InputLabel>
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
                    disabled
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
                  >
                    Cancel
                  </Button>
                  {
                    updateAdminLoading ?
                      <>
                        <LoadingButton
                          loading={updateAdminLoading}
                          variant='contained'
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
          {/*  </Box> */}
        </Grid>
      </Grid>

    </>
  )
}
export default AccountSettings
