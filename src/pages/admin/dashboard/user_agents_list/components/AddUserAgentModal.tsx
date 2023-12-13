import React, { useState, useEffect } from 'react'

import {
  Button,
  Modal,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  OutlinedInput,
  InputLabel,
  Grid,
  IconButton
} from '@mui/material'
import { IconX } from '@tabler/icons'

// toast popup
import { toast } from 'react-toastify'

// ** Icons Imports
import AddUsrAgentAvatar from 'src/assets/Images/addUserAgent.png'
import { useFormik } from 'formik'
import { API_PATHS } from 'src/config/api.config'
import * as yup from 'yup'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { nameval, email, numberval } from 'src/pages/util/validationall'
import OrganisationContext from 'src/context/OrganisationProvider'
import LoadingButton from '@mui/lab/LoadingButton'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

//const REACT_APP_SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

interface IAddUserAgentModalProps {
  open: boolean
  onClose: any
  
}
const AddUserAgentModal = (props: IAddUserAgentModalProps) => {
  
  const [userttypelist, setUserTypelist] = useState<Array<any>>([])
  
  const [adduserLoading, setAdduserLoading] = React.useState(false)
  const [updateuserLoading, setupdateuserLoading] = React.useState(false)
  const { createUserAgentList, setCreateUserAgentList,addUserAgenttoggle ,addUserAgentId,setaddUserAgentId} = React.useContext<any>(OrganisationContext)

    const schema = yup.object().shape({
      fname: nameval,
      lname: nameval,
      email: email,
      usertype: numberval,
      role:numberval,
      phone: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .length(10, 'Please enter a valid mobile number.')
    })
  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      email: '',
      phone: '',
      role:  '3',
      usertype: ''
    },

    validationSchema: schema,
    onSubmit: () => {
      addUserAgentId > 0 ? handleUpdateUser() : handleAddUserAgent()
     
    }
  })
  const roleid = formik.values.role
  const handleAddUserAgent = async () => {
    setAdduserLoading(true)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/`)

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

    const requestData = {}
    Object.assign(requestData, { fname: formik.values.fname })
    Object.assign(requestData, { lname: formik.values.lname })
    Object.assign(requestData, { phone: formik.values.phone })
    Object.assign(requestData, { email: formik.values.email })
    Object.assign(requestData, { role: formik.values.role })
    Object.assign(requestData, { userTypeId: formik.values.usertype })

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(requestData)
      })
      const result = await response.json()

      if (result.status == 200) {
        setAdduserLoading(false)

        toast.success(result.message)
        setCreateUserAgentList(!createUserAgentList)
        formik.resetForm()
        props.onClose()
      } else {
        setAdduserLoading(false)

        toast.error(result.message)
      }
    } catch (ex) {
      setAdduserLoading(false)

      console.log(ex)
    }
  }


  const fetchAllUserType = async () => {
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.user}/types?roleId=${roleid}&showAll=true`
    )
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
        
       // console.log(data)

        setUserTypelist(data)
      } else {
        console.log('something went wrong')
      }
    } catch (ex: any) { }
  }

  const handleGetAddUserAgentDetails = async () => {
    if(addUserAgentId > 0) {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/detail?userId=${addUserAgentId}`)

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
        formik.setFieldValue('email', data.email)
        formik.setFieldValue('fname', data.fname)
        formik.setFieldValue('lname', data.lname)
        formik.setFieldValue('phone', data.phone)
        formik.setFieldValue('role',data.userRole[0].roleId)
        formik.setFieldValue('usertype',data.userTypeId)
        
      } else {
        toast.success(result.message)
      }
    } catch (ex: any) { console.log(ex)}
  }
  }
  const handleUpdateUser = async () => {
    setupdateuserLoading(true)

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}?userId=${addUserAgentId}`)

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

    const requestData = {}
    Object.assign(requestData, { email: formik.values.email })
    Object.assign(requestData, { fname: formik.values.fname })
    Object.assign(requestData, { lname: formik.values.lname })
    Object.assign(requestData, { phone: formik.values.phone })
    Object.assign(requestData, { roleId: formik.values.role })
    Object.assign(requestData, { userTypeId: formik.values.usertype })
   
    try {
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(requestData)
      })
      const result = await response.json()

      if (result.status == 200) {
        setupdateuserLoading(false)
        toast.success(result.message)
        setCreateUserAgentList(!createUserAgentList)
        props.onClose()
      } else {
        setupdateuserLoading(false)
        toast.error(result.message)
      }
    } catch (ex: any) {
      setupdateuserLoading(false)
      toast.error(ex.message)
    }
  }

  const reserformikValue = async () => {
    formik.resetForm()
    setaddUserAgentId(0)
  }

  useEffect(() => {
    reserformikValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserAgenttoggle])
  useEffect(() => {
    handleGetAddUserAgentDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserAgentId])
  useEffect(() => {
    fetchAllUserType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleid])

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
                top: '10px',
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
                  <img alt="user-img" src={AddUsrAgentAvatar} style={{ height: 150, width: 150 }} />
                  <Box sx={{ m: 5 }}>
                    <Typography variant='h5'>Patient and Team Member</Typography>
                  </Box>
                </Box>
                <Grid container spacing={3}>
                  <Grid item>
                    <Grid container spacing={1}>
                      <Grid item>
                        <FormControl>
                          <RadioGroup
                            row
                            name='role'
                            defaultValue='3'
                            value={formik.values.role}
                            onChange={formik.handleChange}
                          >
                            <FormControlLabel value='4' control={<Radio />} label='Patient' />
                            <FormControlLabel value='3' control={<Radio />} label='Team Member' />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <FormControl fullWidth>
                      <InputLabel id='status-select'>User Role*</InputLabel>
                      <Select
                        fullWidth
                        labelId='status-select'
                        label='User Role'
                        name='usertype'
                        id='usertype'
                        value={formik.values.usertype}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.usertype && formik.touched.usertype)}
                      >
                        {userttypelist.map(item => {
                          return (
                            <MenuItem value={item.userTypeId} key={item.userTypeId}>
                              {item.typeName}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={3} alignItems='center' justifyContent='center'>
                      <Grid item xs={12} md={6} lg={6}>
                        <FormControl fullWidth>
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
                      <Grid item xs={12} md={6} lg={6}>
                        <FormControl fullWidth>
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
                      <Grid item xs={12} md={12} lg={12}>
                        <FormControl fullWidth>
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
                      </Grid>
                      <Grid item xs={12} sm={12} lg={12}>
                        <FormControl fullWidth>
                          <InputLabel>Phone No.</InputLabel>
                          <OutlinedInput
                            type='number'
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            fullWidth
                            label='Phone No.'
                            placeholder='Phone No'
                            name='phone'
                            error={Boolean(formik.errors.phone && formik.touched.phone)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item>
                      {addUserAgentId > 0 ? 
                        
                        updateuserLoading ?
                          <LoadingButton
                  loading={updateuserLoading}
                  variant='contained'
                  disabled
                  size='large'
                  sx={{ textTransform: 'capitalize', marginTop: '15px' }}


                >
                  Update
                </LoadingButton>
                :
                           <Button
                           type='submit'
                           size='large'
                           variant='contained'
                           sx={{ textTransform: 'capitalize', marginTop: '15px' }}
 
                      >
                         Update
                      </Button>
                        
                        :
                        
                        
                        adduserLoading ?
                          <LoadingButton
                  loading={adduserLoading}
                  variant='contained'
                  disabled
                  size='large'
                  sx={{ mr: 2, textTransform: 'capitalize', margin:'20px 0px 0px 10px' }}

                >
                  Add
                </LoadingButton>
                :
                <Button
                type='submit'
                size='large'
                variant='contained'
                sx={{ textTransform: 'capitalize', marginTop: '15px' }}

              >
                 Add
              </Button>
                       
                        
                      }
                      </Grid>
                    </Grid>
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

export default AddUserAgentModal
