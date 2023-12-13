import  React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { orgTypeval } from 'src/pages/util/validationall'

import { useFormik } from 'formik'
import * as yup from 'yup'

import { toast } from 'react-toastify'
import { API_PATHS } from 'src/config/api.config'
import OrganisationContext from 'src/context/OrganisationProvider'
import LoadingButton from '@mui/lab/LoadingButton';


//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

interface ButtonPressedProps {
  toggle: () => void
}

function Add_Org_Type(props: ButtonPressedProps){
  
  const [addOrgTypeLoading, setAddOrgTypeLoading] = React.useState(false)
  const [updateOrgTypeLoading, setupdateOrgTypeLoading] = React.useState(false)

  const schema = yup.object().shape({
    orgNType: orgTypeval
  })
  const { orgtypeId,setOrgtypeId,setCreateUserAgentList,createUserAgentList} = React.useContext<any>(OrganisationContext)

  const formik = useFormik({
    initialValues: {
      orgNType: '',
      
    },
    validationSchema: schema,
    onSubmit: () => {
      {
        orgtypeId > 0 ? handleUpdateDepartment() : handleCreateOrgType() 
      }
    }
  })  

  const handleCreateOrgType = async () => {
    setAddOrgTypeLoading(true)
    if(formik.values.orgNType != "")
    {
     const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisationType}`)
     const user = JSON.parse(localStorage.getItem('userData') || '{}')
     const requestData = {}
     Object.assign(requestData, { orgTypeName: formik.values.orgNType })
    
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
        toast.success('Organization Type created successfully')
        props.toggle()
        setAddOrgTypeLoading(false)

      } else {
         toast.error(result.message)
         setAddOrgTypeLoading(false)

       }
     }catch (ex) {
         console.log(ex)
         setAddOrgTypeLoading(false)

       }
     }
     else
     {
         toast.error("Title and type is must!")
         setAddOrgTypeLoading(false)

     }
     
   }
   const handleUpdateDepartment= async () => {
    setupdateOrgTypeLoading(true)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisationType}`)

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

    const requestData = {}
    Object.assign(requestData, { orgTypeId: orgtypeId })
    Object.assign(requestData, { orgTypeName: formik.values.orgNType })
   
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
        setupdateOrgTypeLoading(false)

        toast.success(result.message)
        formik.resetForm()
        setOrgtypeId(0)
        setCreateUserAgentList(!createUserAgentList)
        props.toggle()
      } else {
        toast.error(result.message)
        setupdateOrgTypeLoading(false)

      }
    } catch (ex: any) {
      toast.error(ex.message)
      setupdateOrgTypeLoading(false)

    }
  }

  const handleGetdepartmenttypeDetails = async () => {
    if(orgtypeId > 0) {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisationType}/detail?orgTypeId=${orgtypeId}`)

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
        formik.setFieldValue('orgNType', data.orgTypeName)
        
      } else {
        toast.success(result.message)
      }
    } catch (ex: any) { console.log(ex)}
  }
  }


  useEffect(() => {
    handleGetdepartmenttypeDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgtypeId])

  return (

    <div>
      <Dialog open={true} 
        fullWidth={true}
        maxWidth="sm"
        keepMounted
      >
        <DialogTitle>Organization Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <form onSubmit={formik.handleSubmit}>
        
              <FormControl fullWidth sx={{ backgroundColor: '#ffffff', margin:'10px'}}>
                      <InputLabel>Organization Type*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        label='Organization Type'
                        value={formik.values.orgNType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='orgNType'
                        error={Boolean(formik.errors.orgNType && formik.touched.orgNType)}
                      />
             </FormControl>
          
                      {orgtypeId > 0 ? 
                        
                        updateOrgTypeLoading ?
                          <LoadingButton
                  loading={updateOrgTypeLoading}
                  variant='contained'
                  disabled
                  sx={{ mr: 2, textTransform: 'capitalize', margin:'20px 0px 0px 10px' }}

                >
                  Update
                </LoadingButton>
                :
                           <Button
                        size='large'
                        type='submit'
                        sx={{ mr: 2, textTransform: 'capitalize', margin:'20px 0px 0px 10px' }}
                        variant='contained'
                      >
                         Update
                      </Button>
                        
                        :
                        
                        
                          addOrgTypeLoading ?
                          <LoadingButton
                  loading={addOrgTypeLoading}
                  variant='contained'
                  disabled
                  sx={{ mr: 2, textTransform: 'capitalize', margin:'20px 0px 0px 10px' }}

                >
                  Create
                </LoadingButton>
                :
                <Button
                size='large'
                type='submit'
                sx={{ mr: 2, textTransform: 'capitalize', margin:'20px 0px 0px 10px' }}
                variant='contained'
              >
                 Create
              </Button>
                       
                        
                      }
                      <Button
                        size='large'
                        variant='outlined'
                        color='secondary'
                        sx={{ textTransform: 'capitalize', margin:'20px 0px 0px 10px', alignItems:'center' }}
                        onClick={props.toggle}
                       >
                        Cancel
                      </Button>
                      </form>
            </DialogContent>
        <DialogActions>

        </DialogActions>
          
      </Dialog>
    </div>
  );
}

export default Add_Org_Type