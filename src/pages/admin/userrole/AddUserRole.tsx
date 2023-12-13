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

 // FormGroup
} from '@mui/material'
import { IconX } from '@tabler/icons'

//import Checkbox from '@mui/material/Checkbox';



// toast popup
import { toast } from 'react-toastify'

// ** Icons Imports
import AddUsrAgentAvatar from 'src/assets/Images/addUserAgent.png'
import { useFormik } from 'formik'
import { API_PATHS ,TICKET_TYPE} from 'src/config/api.config'
import * as yup from 'yup'

import { nameval } from 'src/pages/util/validationall'
import OrganisationContext from 'src/context/OrganisationProvider'

/* import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup' */

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

//const REACT_APP_SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

interface IAddUserRoleProps {
  open: boolean
  onClose: any

}

const AddUserRole = (props: IAddUserRoleProps) => {

  const { createUserAgentList, setCreateUserAgentList, typeId, settypeId ,addUserAgenttoggle} = React.useContext<any>(OrganisationContext)
  const [roleDisplayPermission, setroleDisplayPermission] = useState(false)




/* 
  useEffect(() => {
    if (state.length > 0) {
      if (state[0] === true && state[1] === false) {
        setfinalAddtype("1")
      } else if (state[0] === false && state[1] === true) {
        setfinalAddtype("2")
      } else {
        setfinalAddtype("1,2")
      }
    }
  }, [state]) */





/*   const [selected, selectedCheckboxes] = useState<any[]>([1])
 */



  const schema = yup.object().shape({
    usertype: nameval

  })

  const formik = useFormik({
    initialValues: {
      role: '4',
      usertype: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      typeId > 0 ? handleUpdateUserRole() : handleAddUserRole()

    }
  })

  const handleAddUserRole = async () => {

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/types`)

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

    const requestData = {}
    Object.assign(requestData, { role: formik.values.role })
    Object.assign(requestData, { typeName: formik.values.usertype })
    Object.assign(requestData, { ticketType: TICKET_TYPE.SUPPORT })

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
        toast.success("User Role added successfully")
        props.onClose()
        setCreateUserAgentList(!createUserAgentList)
        formik.resetForm()
      } else {
        toast.error(result.message)
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  const getusertypeData = async () => {

    if (typeId > 0) {
      setroleDisplayPermission(true)
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/types/detail?userTypeId=${typeId}`)
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
          formik.setFieldValue('role', data.roleId)
          formik.setFieldValue('usertype', data.typeName)
          
        } else {
          toast.error(result.message)
        }
      } catch (ex: any) { console.log(ex) }
    }
  }
  const handleUpdateUserRole = async () => {

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/types?userTypeId=${typeId}`)

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

    const requestData = {}
    Object.assign(requestData, { role: formik.values.role })
    Object.assign(requestData, { typeName: formik.values.usertype })
    Object.assign(requestData, { ticketType:  TICKET_TYPE.SUPPORT })

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
        // toast.success(result.message)
        toast.success("User Role updated successfully")
        setCreateUserAgentList(!createUserAgentList)
        props.onClose()
        formik.resetForm()
        settypeId(0)
      } else {
        toast.error(result.message)
      }
    } catch (ex: any) {
      toast.error(ex.message)
    }
  }


  useEffect(() => {
    getusertypeData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeId])

  const reserformikValue = async () => {
    formik.resetForm()
    settypeId(0)
    setroleDisplayPermission(false)
  }

  useEffect(() => {
    reserformikValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserAgenttoggle])


/* 
  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState([event.target.checked, state[1]])
  }; */

/* 
  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState([state[0], event.target.checked])
  }; */


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
                    <Typography variant='h5'>User Role</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>

                  <Grid container spacing={2}>
                    <Grid item>
                      <Grid container spacing={1}>
                        <Grid item md={9} sx={{ marginLeft: '60px' }}>
                          <Typography sx={{ color: 'text.primary', fontSize: '16px', textTransform: 'capitalize', fontWeight: '600' }} >Select Type</Typography>

                          <FormControl>
                            <RadioGroup
                              row
                              name='role'
                              defaultValue='3'
                              value={formik.values.role}
                              onChange={formik.handleChange}
                            >
                              <FormControlLabel value='4' control={<Radio />} label='Patient' disabled={roleDisplayPermission} />
                              <FormControlLabel value='3' control={<Radio />} label='Team Member' disabled={roleDisplayPermission} />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>

                  {/*   <Grid item xs={12} md={9} sx={{ marginLeft: '60px' }} >
                      <Typography sx={{ fontSize: '16px', textTransform: 'capitalize', fontWeight: '600' }} >Select Ticket Type</Typography>
                      <FormControl component="fieldset">
                       
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={state && state[0]}
                                  onChange={handleChange2}
                                  name="support"
                                />
                              }
                              label="support"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={state && state[1]}
                                  onChange={handleChange3}
                                  name="offence"
                                />
                              }
                              label="offence"
                            />
                          </FormGroup>
                        

                      </FormControl>

                    </Grid> */}

                    <Grid item xs={12} md={9} sx={{ marginLeft: '60px', marginTop: '20px' }}>

                      <FormControl fullWidth>
                        <InputLabel>User Role*</InputLabel>
                        <OutlinedInput

                          value={formik.values.usertype}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}

                          label='User Role'
                          name='usertype'
                          id='usertype'

                          error={Boolean(formik.errors.usertype && formik.touched.usertype)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={12} sx={{ alignItem: 'center', justifyContent: 'center' }}>
                      <Box m={1} display='flex' justifyContent='center' alignItems='center'>

                        <Button
                          type='submit'
                          size='large'
                          variant='contained'
                          sx={{ textTransform: 'capitalize', marginTop: '15px' }}
                        >
                          {typeId > 0 ? 'Update User Role' : 'Add User Role'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Modal>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}

export default AddUserRole
