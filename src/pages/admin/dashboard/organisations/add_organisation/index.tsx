// ** React Imports
import React, { MouseEvent, useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { Box, FormHelperText, /* FormLabel, */  Grid } from '@mui/material'
import Select from '@mui/material/Select';
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import CardActions from '@mui/material/CardActions'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'
import MuiAvatar from '@mui/material/Avatar'

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

//import axios 
import axios from 'axios';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

//import reract router dom
import { useNavigate, useNavigate as useRouter, useLocation } from 'react-router-dom'

//import formik
import { useFormik } from 'formik'
import * as yup from 'yup'

//import config file
import { API_PATHS, FILE_TYPE, KB_ACCESS } from 'src/config/api.config'

//import toasitify
import { toast } from 'react-toastify'

//import validation param
import { nameval, newOrgTypeval } from 'src/pages/util/validationall'

//import compoenent
import OrganisationContext from 'src/context/OrganisationProvider'
import org_default from 'src/assets/Images/org_default.svg'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import ImageUpdateIcon from 'src/assets/Images/update_image_icon.svg'


//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC

// import file upload type
const orgProfile: any = parseInt(FILE_TYPE.ORG_LOGO)

const AddOrganisation = () => {

  const router = useRouter()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const path = pathname
  const { setCreateOrgtList } = React.useContext<any>(OrganisationContext)
  const [values, setValues] = useState<any>({
    showPassword: false,
    showPassword2: false
  })
  const [orgProfileImage, setOrgProfileImage] = useState()

  // const [isOpenCropImage, setImageCropper] = React.useState<any>(false)
  const [getSelectedImage, setSelectedImage] = React.useState<any>()
  const [orgTypeData, setOrgTypeData] = useState<Array<any>>([])
  const [addOrgLoading, setAddOrgLoading] = React.useState(false)
  const [updateOrgLoading, setUpdateOrgLoading] = React.useState(false)
  const [orgProfileImageUpdate, setOrgProfileImageUpdate] = useState()

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
    email: yup.string().email('Invalid Email Format').required('Email is required'),
    domainName: yup
      .string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url'
      ),

    orgName: nameval,
    newOrgType: newOrgTypeval,
    fname: yup
      .string()
      .min(3)
      .matches(/^[aA-zZ\s]+$/, '')
      .required(),

    lname: yup
      .string()
      .min(3)
      .matches(/^[aA-zZ\s]+$/, '')
      .required(),

    userPhone: yup
      .string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .length(10, 'Please enter a valid mobile number.'),
    password: yup.string().min(8, 'Passowrd contain greater than 8 character').matches(/[@$!%*#?&]+/, "Password must contain a special character."),
    userEmail: yup.string().email().required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Password and confirm password does not match').min(8, 'Passowrd contain greater than 8 character').matches(/[@$!%*#?&]+/, "Password must contain a special character.")
  })

  const location: any = useLocation()
  const state: any = location.state

  const formik = useFormik({
    initialValues: {
      orgId: state == null ? '' : state.orgId,
      orgName: state == null ? '' : state.orgName,
      newOrgType: state == null ? '' : state.orgTypeId,
      email: state == null ? '' : state.email,
      domainName: state == null ? '' : state.website,
      line1: state == null ? '' : state.orgBranch[0].add1,
      line2: state == null ? '' : state.orgBranch[0].add2,
      country: state == null ? '' : state.orgBranch[0].country,
      zipCode: state == null ? '' : state.orgBranch[0].zipCode,
      state: state == null ? '' : state.orgBranch[0].state,
      city: state == null ? '' : state.orgBranch[0].city,
      password: '',
      confirmPassword: '',
      fname: '',
      lname: '',
      userPhone: '',
      userEmail: '',
      allFields: '',
      KbAccess: 1,
      durationMonth: '',
      allowAgents: '',
      trailPeriod: ''

    },
    validationSchema: schema,

    onSubmit: () => {
      {
        state == null && path == '/organization/add' ? handleCreateOrganisation() : handleEditOrganisation()
      }

    }

  })

  const fileInput: any = useRef()

  const selectFile = () => {
    fileInput.current.click()
  }

  const [getSelectedImageUpdate, setSelectedImageUpdate] = React.useState<any>()

  const onChangeHandlerUpdate = async (e: any) => {

    const file = e.target.files[0]
    const FileExtemsion = ['jpg', 'png']
    if (FileExtemsion.includes(file.name.split('.').pop().toLowerCase())) {
      setOrgProfileImageUpdate(e.target.files[0])
      if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        const imageDataUrl = await readFile(e.target.files[0])
        setSelectedImageUpdate(imageDataUrl)
      }
    } else {
      toast.error(`This ${file.name.split('.').pop()} can't support`)
    }
  }

  const handleGetOrganisation = async () => {
    if (state.orgId != null) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}/detail?orgId=${state.orgId}`)
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

          formik.setFieldValue('orgName', data.orgName)
          formik.setFieldValue('email', data.email)
          formik.setFieldValue('domainName', data.website)
          formik.setFieldValue('state', data.orgBranch[0].state)
          formik.setFieldValue('country', data.orgBranch[0].country)
          formik.setFieldValue('city', data.orgBranch[0].city)
          formik.setFieldValue('line1', data.orgBranch[0].add1)
          formik.setFieldValue('line2', data.orgBranch[0].add2)
          formik.setFieldValue('zipCode', data.orgBranch[0].zipCode)
          formik.setFieldValue('fname', data.orgUser[0].user.fname)
          formik.setFieldValue('lname', data.orgUser[0].user.lname)
          formik.setFieldValue('userPhone', data.orgUser[0].user.phone)
          formik.setFieldValue('userEmail', data.orgUser[0].user.email)
          formik.setFieldValue('newOrgType', data.orgTypeId)
          formik.setFieldValue('KbAccess', data.KnowBaseAccess)

          setOrgProfileImage(data.logo)
          setSelectedImage(data.logo)
          setSelectedImageUpdate(data.logo)

          //setOrgProfileImageUpdate(data.logo)

        } else {
          navigate(-1)
        }
      } catch (ex: any) { }
    }
  }
  const handleCreateOrganisation = async () => {
    setAddOrgLoading(true)

    //upload logo api calling
    let orgLogoImage: any
    if (orgProfileImage) {
      const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
      const formData = new FormData()
      formData.append('file', orgProfileImage)
      formData.append('type', orgProfile)
      try {
        const response = await axios.post(`${BASE_URL_PUBLIC}/v1/file`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${UserData.token}`
          }
        })

        if (response) {
          orgLogoImage = response.data.payload.filesPath[0].filePath

        }
      } catch (error) {
        console.log(error)
        setAddOrgLoading(false)

      }
    }

    //final create organisation api calling
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    const requestData = {}
    Object.assign(requestData, { fname: formik.values.fname })
    Object.assign(requestData, { lname: formik.values.lname })
    Object.assign(requestData, { userEmail: formik.values.userEmail })
    Object.assign(requestData, { userPhone: formik.values.userPhone })
    Object.assign(requestData, { email: formik.values.email })
    Object.assign(requestData, { confirmEmail: formik.values.email })
    Object.assign(requestData, { city: formik.values.city })
    Object.assign(requestData, { state: formik.values.state })
    Object.assign(requestData, { zipCode: formik.values.zipCode })
    Object.assign(requestData, { country: formik.values.country })
    Object.assign(requestData, { add1: formik.values.line1 })
    Object.assign(requestData, { add2: formik.values.line2 })
    Object.assign(requestData, { orgName: formik.values.orgName })
    Object.assign(requestData, { website: formik.values.domainName })
    Object.assign(requestData, { password: formik.values.password })
    Object.assign(requestData, { confirmPassword: formik.values.confirmPassword })
    Object.assign(requestData, { allFields: formik.values.allFields })
    Object.assign(requestData, { orgTypeId: formik.values.newOrgType })
    Object.assign(requestData, { logo: orgLogoImage && orgLogoImage })
    Object.assign(requestData, { knowBaseAccess: formik.values.KbAccess })
    Object.assign(requestData, { allowAgents: formik.values.allowAgents })
    Object.assign(requestData, { durationMonth: formik.values.durationMonth })
    if (freeTrialCheckBox) {
      Object.assign(requestData, { trailPeriod: formik.values.trailPeriod })
      Object.assign(requestData, { isFreeTrial: 1 })
    } else {
      Object.assign(requestData, { isFreeTrial: 0 })
    }

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
      console.log(result)
      if (result.status == 200) {
        formik.resetForm()
        setCreateOrgtList(true)
        toast.success(result.message)
        navigate('/organization')
        setAddOrgLoading(false)

      } else {
        setAddOrgLoading(false)
        toast.error(result.message)
      }
    } catch (err) {
      setAddOrgLoading(false)
      console.log(err)
    }
  }
  const handleEditOrganisation = async () => {
    setUpdateOrgLoading(true)

    //upload logo api calling
    let orgLogoImage: any
    if (orgProfileImageUpdate != null) {
      const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
      const formData = new FormData()
      formData.append('file', orgProfileImageUpdate)
      formData.append('type', orgProfile)
      try {
        const response = await axios.post(`${BASE_URL_PUBLIC}/v1/file`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${UserData.token}`
          }
        })

        if (response) {
          orgLogoImage = response.data.payload.filesPath[0].filePath
        }
      } catch (error) {
        console.log(error)
        setUpdateOrgLoading(false)

      }
    }



    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    const requestData = {}
    Object.assign(requestData, { orgId: formik.values.orgId })
    Object.assign(requestData, { fname: formik.values.fname })
    Object.assign(requestData, { lname: formik.values.lname })
    Object.assign(requestData, { userEmail: formik.values.email })
    Object.assign(requestData, { userPhone: formik.values.userPhone })
    Object.assign(requestData, { email: formik.values.email })
    Object.assign(requestData, { confirmEmail: formik.values.email })
    Object.assign(requestData, { city: formik.values.city })
    Object.assign(requestData, { state: formik.values.state })
    Object.assign(requestData, { zipCode: formik.values.zipCode })
    Object.assign(requestData, { country: formik.values.country })
    Object.assign(requestData, { add1: formik.values.line1 })
    Object.assign(requestData, { add2: formik.values.line2 })
    Object.assign(requestData, { orgName: formik.values.orgName })
    Object.assign(requestData, { orgTypeId: formik.values.newOrgType })
    Object.assign(requestData, { website: formik.values.domainName })
    Object.assign(requestData, { password: formik.values.password })
    Object.assign(requestData, { confirmPassword: formik.values.confirmPassword })
    Object.assign(requestData, { knowBaseAccess: formik.values.KbAccess })

    if (getSelectedImageUpdate != null) {
      Object.assign(requestData, { logo: orgLogoImage && orgLogoImage })
    } else {
      Object.assign(requestData, { logo: orgProfileImage && orgProfileImage })
    }

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
        toast.success(result.message)
        navigate('/organization')
        setUpdateOrgLoading(false)

      } else {
        toast.error(result.message)
        setUpdateOrgLoading(false)

      }
    } catch (ex: any) {
      toast.error(ex.message)
      setUpdateOrgLoading(false)

    }
  }
  useEffect(() => {
    handleGetOrganisation()
    fetchAllOrganisationsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const redirecttoEdit = () => {
    navigate('/organization/edit')
  }
  const toggleCancelAddOrganisation = () => router(-1)
  const checkStylePath = path === '/organization/add'

  const fetchAllOrganisationsData = async () => {
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.organisationType
      }/?sortOrder=ASC&pageNumber=1&recordsPerPage=30&search={"orgTypeName":""}`
    )

    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    if (response.status === 200) {
      const result = await response.json()
      setOrgTypeData(result.payload.data)
    }
  }

  const onChangeHandler = async (e: any) => {
    const file = e.target.files[0]
    const FileExtemsion = ['jpg', 'png']
    if (FileExtemsion.includes(file.name.split('.').pop().toLowerCase())) {
      setOrgProfileImage(e.target.files[0])

      if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        const imageDataUrl = await readFile(e.target.files[0])
        setSelectedImage(imageDataUrl)
      }
    } else {
      toast.error(`This ${file.name.split('.').pop()} can't support`)
    }
  }



  const readFile = (file: any) => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  //country state city api

  const [statelist, setSatateList] = useState<Array<any>>([])
  const [stateId, setStateId] = React.useState<any>(0)
  const [countryId, setCountryId] = React.useState<any>(0)

  //fetch all State
  const fetchAllState = async (name: any) => {
    if (countryId > 0) {
      const url = new URL(
        `${BASE_URL}/${API_VERSION}/${API_PATHS.location}/${API_PATHS.states}?country_id=${countryId}&showAll=true&search={"name":"${name}"}`
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
          setSatateList(data)
        } else {
          console.log('something went wrong')
        }
      } catch (ex: any) {
        console.log(ex.message)
      }
    }
  }



  const onInputChange = (event: any, value: any) => {
    formik.values.city = ''
    setDisableCity(false)
    if (value) {
      formik.values.state = value ? value : ''
      fetchAllState(value);
    } else {
      setSatateList([]);
    }
  };
  const [citylist, setCityList] = useState<Array<any>>([])
  const [disableCity, setDisableCity] = React.useState(true);
  const [disableState, setDisableState] = React.useState(true);

  const fetchAllCity = async (stateId: any) => {
    if (stateId && stateId > 0) {
      const url = new URL(
        `${BASE_URL}/${API_VERSION}/${API_PATHS.location}/${API_PATHS.cities}?state_id=${stateId}&showAll=true`
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
          setCityList(data)
        } else {
          console.log('something went wrong')
        }
      } catch (ex: any) {
        console.log(ex.message)
      }
    } else {/* toast.error('Please select state') */ }

  }
  const onInputChangeCity = (event: any, value: any) => {
    if (value) {
      formik.values.city = value

    }
  };

  useEffect(() => {
    fetchAllCity(stateId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId])

  //Get All Cities
  const [countrieslist, setCountriesList] = useState<Array<any>>([])

  const fetchAllCountries = async (name: any) => {
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.location}?showAll=true&search={"name":"${name}"}`
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
        setCountriesList(data)
      } else {
        console.log('something went wrong')
      }
    } catch (ex: any) {
      console.log(ex.message)
    }
  }

  const onInputChangeCountry = (event: any, value: any) => {
    setDisableState(false)
    formik.values.state = null
    formik.values.city = ''
    if (value) {
      formik.values.country = value ? value : ''
      fetchAllCountries(value);
    } else {
      setSatateList([]);
    }
  };

  //Free Trial 
  const [freeTrialCheckBox, setFreeTrialCheckBox] = useState(false)
  const [freeTrialDays, setFreeTrialDays] = useState(true)
  const [licenseFieldDisabled, setLicenseFieldDisabled] = useState(false)

  const handleSetTrialPeriod = () => { setFreeTrialCheckBox(!freeTrialCheckBox) }

  useEffect(() => {
    freeTrialCheckBox === true ? (
      setFreeTrialDays(false), 
      setLicenseFieldDisabled(true),
      formik.values.allowAgents = '',
      formik.values.durationMonth = ''
    ): (
      setFreeTrialDays(true), 
      setLicenseFieldDisabled(false), 
      formik.values.trailPeriod = '')}, [freeTrialCheckBox])



  return (
    <>
      <Card>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <h3>Organization Details</h3>
              </Grid>
              <Grid item xs={12} md={6}>
                {path == '/organization/view' ? (
                  <Grid item>
                    <CardActions sx={{ justifyContent: 'end', padding: '0' }}>
                      <Button
                        size='large'
                        type='submit'
                        value={state.orgId}
                        sx={{ mr: 2, ml: 70, textTransform: 'capitalize', mb: 5 }}
                        variant='contained'
                        onClick={() => redirecttoEdit()}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Grid>
                ) : (
                  <Grid item>
                    <CardActions></CardActions>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={5}>

              <Grid item xs={12} md={12} display='flex'
                justifyContent='center'
                alignItems={'center'}>
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  sx={{
                    height: '150px',
                    width: '150px',
                    border: '5px solid #2d4acd2b',
                    boxSizing: 'border-box',
                    borderRadius: '90px',
                    position: 'relative'
                  }}
                >
                  {
                    state == null && path == '/organization/add' ?
                      <>
                        <MuiAvatar src={getSelectedImage ? getSelectedImage : org_default} alt='Organization Profile' sx={{ width: '90%', height: '90%' }} />
                        <input
                          type='file'
                          style={{ display: 'none' }}
                          ref={fileInput}
                          onChange={onChangeHandler}
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
                      </>
                      :
                      <>

                        <MuiAvatar src={getSelectedImageUpdate ? getSelectedImageUpdate : org_default} alt='Organization Profile' sx={{ width: '90%', height: '90%' }} />
                        <input
                          type='file'
                          style={{ display: 'none' }}
                          ref={fileInput}
                          onChange={onChangeHandlerUpdate}
                          accept='image/*'
                          disabled={path === '/organization/view' ? true : false}
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
                      </>
                  }
                </Box>
              </Grid>

              <Grid item xs={12} md={6} >
                <FormControl fullWidth>
                  <InputLabel id='status-select'
                  >Organization Type*</InputLabel>
                  <Select
                    fullWidth
                    labelId='status-select'
                    label='Organization Type*'
                    name='newOrgType'
                    id='newOrgType'

                    //  onChange={handleChange}
                    onChange={formik.handleChange}
                    value={formik.values.newOrgType}
                    error={Boolean(formik.errors.newOrgType && formik.touched.newOrgType)}
                    readOnly={path === '/organization/view' ? true : false}
                  >
                    {orgTypeData.map(a => {
                      return (
                        <MenuItem value={a.orgTypeId} key={a.orgTypeName}>
                          {a.orgTypeName}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Organization Name*</InputLabel>
                  <OutlinedInput
                    value={formik.values.orgName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Organization  Name'
                    name='orgName'
                    id='orgName'
                    readOnly={path === '/organization/view' ? true : false}
                    error={Boolean(formik.errors.orgName && formik.touched.orgName)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Website</InputLabel>
                  <OutlinedInput
                    value={formik.values.domainName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Website'
                    name='domainName'
                    id='domainName'
                    placeholder='www.onpoint.com'
                    readOnly={path === '/organization/view' ? true : false}
                    error={Boolean(formik.errors.domainName && formik.touched.domainName)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
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
                    readOnly={path === '/organization/view' ? true : false}
                    error={Boolean(formik.errors.email && formik.touched.email)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Address Line 1</InputLabel>
                  <OutlinedInput
                    value={formik.values.line1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Address Line 1'
                    name='line1'
                    id='line1'
                    readOnly={path === '/organization/view' ? true : false}
                    error={Boolean(formik.errors.line1 && formik.touched.line1)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Address Line 2</InputLabel>
                  <OutlinedInput
                    value={formik.values.line2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Address Line 2'
                    name='line2'
                    id='line2'
                    readOnly={path === '/organization/view' ? true : false}
                    error={Boolean(formik.errors.line2 && formik.touched.line2)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ background: '#ffffff' }}>
                  <Autocomplete
                    value={formik.values.country ? formik.values.country : null}
                    onInputChange={onInputChangeCountry}
                    id='free-solo-dialog-demo'
                    options={countrieslist}
                    getOptionLabel={option => {
                      if (typeof option === 'string') {
                        return option
                      }
                      if (option.name) {
                        setCountryId(option.id)

                        return option.name
                      } else {
                        return option.name
                      }
                    }}

                    selectOnFocus
                    handleHomeEndKeys
                    renderOption={(props, countrieslist) => (
                      <li {...props} value={countrieslist.name} key={countrieslist.id}>
                        {countrieslist.name}
                      </li>
                    )}
                    freeSolo
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={
                          'Country'
                        }
                        variant="outlined"

                      /*  InputProps={{
                         className:  `outlined :1px solid ${Boolean(formik.errors.country && formik.touched.country)  ? "red" : "lightgray"}`
                      }} */

                      //sx={{outline : `1px solid ${Boolean(formik.errors.country && formik.touched.country)  ? "red" : "lightgray"}`}}

                      />

                    )}
                    readOnly={path === '/organization/view' ? true : false}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ background: '#ffffff' }}>
                  <Autocomplete
                    value={formik.values.state ? formik.values.state : null}
                    disabled={disableState ? true : false}
                    onInputChange={onInputChange}
                    id='free-solo-dialog-demo'
                    options={statelist}
                    getOptionLabel={option => {
                      if (typeof option === 'string') {
                        return option
                      }
                      if (option.name) {
                        setStateId(option.id)

                        return option.name
                      } else {
                        return option.name
                      }
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, statelist) => (
                      <li {...props} value={statelist.name} key={statelist.id}>
                        {statelist.name}
                      </li>
                    )}
                    freeSolo
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={
                          'State'
                        }
                      />
                    )}
                    readOnly={path === '/organization/view' ? true : false}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ background: '#ffffff' }}>
                  <Autocomplete
                    value={formik.values.city ? formik.values.city : null}
                    disabled={disableCity ? true : false}
                    onInputChange={onInputChangeCity}
                    id='free-solo-dialog-demo'
                    options={citylist}
                    getOptionLabel={option => {
                      if (typeof option === 'string') {
                        return option
                      }
                      if (option.name) {
                        return option.name
                      } else {
                        return option.name
                      }
                    }}
                    selectOnFocus
                    handleHomeEndKeys
                    renderOption={(props, citylist) => (
                      <li {...props} value={citylist.name} key={citylist.name}>
                        {citylist.name}
                      </li>
                    )}
                    freeSolo
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={
                          'City'
                        }

                      />

                    )}
                    readOnly={path === '/organization/view' ? true : false}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Zip Code</InputLabel>
                  <OutlinedInput
                    type='number'
                    value={formik.values.zipCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Zip Code'
                    name='zipCode'
                    id='zipCode'
                    readOnly={path === '/organization/view' ? true : false}
                    error={Boolean(formik.errors.zipCode && formik.touched.zipCode)}
                  />
                </FormControl>
              </Grid>

            </Grid>
            <Grid sx={{ mb: 5, mt: 5 }}>
              <h3>Admin Details</h3>
              <Divider sx={{ margin: 0 }} />
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ backgroundColor: checkStylePath ? '#ffffff' : '#f6f6f6' }}>
                  <InputLabel>First Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    label='First Name'
                    value={formik.values.fname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder='First Name'
                    name='fname'
                    readOnly={path === '/organization/add' ? false : true}
                    error={Boolean(formik.errors.fname && formik.touched.fname)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ backgroundColor: checkStylePath ? '#ffffff' : '#f6f6f6' }}>
                  <InputLabel>Last Name*</InputLabel>
                  <OutlinedInput
                    value={formik.values.lname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    label='Last Name'
                    placeholder='Last Name'
                    name='lname'
                    readOnly={path === '/organization/add' ? false : true}
                    error={Boolean(formik.errors.lname && formik.touched.lname)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ backgroundColor: checkStylePath ? '#ffffff' : '#f6f6f6' }}>
                  <InputLabel>Email*</InputLabel>
                  <OutlinedInput
                    value={formik.values.userEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label='Email'
                    name='userEmail'
                    id='userEmail'
                    placeholder='example@email.com'
                    readOnly={path === '/organization/add' ? false : true}
                    error={Boolean(formik.errors.userEmail && formik.touched.userEmail)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ backgroundColor: checkStylePath ? '#ffffff' : '#f6f6f6' }}>
                  <InputLabel>Phone No.</InputLabel>
                  <OutlinedInput
                    type='number'
                    value={formik.values.userPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    label='Phone No.'
                    placeholder='Phone No'
                    name='userPhone'
                    readOnly={path === '/organization/add' ? false : true}
                    error={Boolean(formik.errors.userPhone && formik.touched.userPhone)}
                  />
                </FormControl>
              </Grid>

              {path === '/organization/add' ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Password*</InputLabel>
                      <OutlinedInput
                        label='Password'
                        value={formik.values.password}
                        name='password'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                        error={Boolean(formik.errors.password && formik.touched.password)}
                      />
                      {formik.errors.password && (
                        <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important', marginLeft: '0px' }} id=''>
                          {formik.errors.password}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Confirm Password*</InputLabel>
                      <OutlinedInput
                        value={formik.values.confirmPassword}
                        label='Confirm Password'
                        name='confirmPassword'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                        error={Boolean(formik.errors.confirmPassword && formik.touched.confirmPassword)}
                      />
                      {formik.errors.confirmPassword && (
                        <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important', marginLeft: '0px' }} id=''>
                          {formik.errors.confirmPassword}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <Grid></Grid>
              )}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ background: '#ffffff' }}>
                  <InputLabel id='status-select'>Knowledge Base Access*</InputLabel>
                  <Select
                    id='KbAccess'
                    name='KbAccess'
                    labelId='status-select'
                    label='Knowledge Base Access*'
                    value={formik.values.KbAccess}
                    onChange={formik.handleChange}
                    readOnly={path === '/organization/view' ? true : false}

                    error={Boolean(formik.errors.KbAccess && formik.touched.KbAccess)}
                  >
                    <MenuItem value={parseInt(KB_ACCESS.NOACCESS)}>No Access</MenuItem>
                    <MenuItem value={parseInt(KB_ACCESS.SELFANDADMIN)}>Organization Admin And Superadmin</MenuItem>
                    <MenuItem value={parseInt(KB_ACCESS.SELF)}>Organization Admin</MenuItem>
                    <MenuItem value={parseInt(KB_ACCESS.ONLYSUPERADMIN)}>Only Superadmin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {path === '/organization/add' ? (
                <>
                  <Grid xs={12} sm={12} lg={12} sx={{ mt: 5, ml: 5 }}>
                    <h3>License Or Free Trial</h3>
                    <Divider sx={{ margin: 0 }} />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={6} >
                    <Grid sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', height: 'fit-content', marginTop: '18px' }}>
                      <Grid item xs={4} sm={4} lg={4} >
                        <FormGroup>
                          <FormControlLabel control={<Checkbox checked={freeTrialCheckBox} onChange={handleSetTrialPeriod} />} label="Free Trial Period" />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6} sm={3} lg={4} sx={{ marginLeft: '7%' }} >
                        <FormControl fullWidth sx={{ backgroundColor: freeTrialCheckBox ? '#ffffff' : '#f6f6f6' }}>
                          <InputLabel>Days*</InputLabel>
                          <OutlinedInput
                            fullWidth
                            type='number'
                            label='Days'
                            value={formik.values.trailPeriod}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='Days'
                            name='trailPeriod'
                            readOnly={path === '/organization/add' ? false : true}
                            error={Boolean(formik.errors.trailPeriod && formik.touched.trailPeriod)}
                            disabled={freeTrialDays}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} >

                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                      <Grid item sx={{ width: '1px', height: '90px', background: 'lightGray', marginRight: '20px' }}>
                        {' '}
                      </Grid>
                      <Grid item xs={12} sm={6} md={8} lg={8} sx={{ marginRight: '10px' }}>
                        <FormControl fullWidth sx={{ backgroundColor: freeTrialCheckBox ? '#f6f6f6' : '#ffffff' }}>
                          <InputLabel>No. of Agents</InputLabel>
                          <OutlinedInput
                            type='number'
                            value={formik.values.allowAgents}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label='No. of Agents'
                            name='allowAgents'
                            id='allowAgents'
                            disabled={licenseFieldDisabled}
                            error={Boolean(formik.errors.allowAgents && formik.touched.allowAgents)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={8} lg={8} sx={{ marginLight: '10px' }}>
                        <FormControl fullWidth sx={{ backgroundColor: freeTrialCheckBox ? '#f6f6f6' : '#ffffff' }}>
                          <InputLabel>Duration in months</InputLabel>
                          <OutlinedInput
                            type='number'
                            value={formik.values.durationMonth}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label='Duration in months'
                            name='durationMonth'
                            id='durationMonth'
                            disabled={licenseFieldDisabled}
                            error={Boolean(formik.errors.durationMonth && formik.touched.durationMonth)}
                          />
                        </FormControl>
                      </Grid>
                      {/*  <FormControl sx={{  ml: 6 }}>
        <FormLabel>Module Access</FormLabel>
        <FormGroup>
          <FormControlLabel
            label='Chat'
            control={<Checkbox checked={true} /* onChange={handleChange}   name='gilad' />}
          />
          <FormControlLabel
            label='Knowledge Base'
            control={<Checkbox checked={false} /* onChange={handleChange}   name='jason' />}
          />
          <FormControlLabel
            label='Screen Recording'
            control={<Checkbox checked={true} /* onChange={handleChange} name='antoine' />}
          />
          <FormControlLabel
            label='Video Calling'
            control={<Checkbox checked={false} /* onChange={handleChange}  name='antoine' />}
          />
        </FormGroup>
      </FormControl> */}
                    </Grid>
                  </Grid>
                </>
              ) : ('')}

              {path === '/organization/add' ? (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 2 }} />
                  </Grid>
                  <Grid item sx={{ margin: '-15px', padding: 0 }}>
                    <CardActions>
                      <Divider sx={{ margin: 0 }} />
                      {
                        addOrgLoading ?
                          <>
                            <LoadingButton
                              loading={addOrgLoading}
                              variant='contained'
                              size='large'
                              disabled
                              sx={{
                                textTransform: 'capitalize',
                                mr: 2,
                              }}
                            >
                              Submit
                            </LoadingButton>
                          </>
                          :
                          <>
                            <Button
                              size='large'
                              type='submit'
                              sx={{ mr: 2, textTransform: 'capitalize' }}
                              variant='contained'
                            >
                              Submit
                            </Button>
                          </>
                      }
                      <Button
                        size='large'
                        variant='outlined'
                        color='secondary'
                        sx={{ textTransform: 'capitalize' }}
                        onClick={toggleCancelAddOrganisation}
                      >
                        Cancel
                      </Button>
                    </CardActions>
                  </Grid>
                </>
              ) : path === '/organization/edit' ? (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 2 }} />
                  </Grid>

                  <Grid item sx={{ margin: '-15px', padding: 0 }}>
                    <CardActions>
                      {
                        updateOrgLoading ?
                          <>
                            <LoadingButton
                              loading={updateOrgLoading}
                              variant='contained'
                              size='large'
                              disabled
                              sx={{
                                textTransform: 'capitalize',
                                mr: 2,
                              }}
                            >
                              Update
                            </LoadingButton>
                          </>
                          :
                          <>
                            <Button
                              size='large'
                              type='submit'
                              sx={{ mr: 2, textTransform: 'capitalize' }}
                              variant='contained'
                            >
                              Update
                            </Button>
                          </>
                      }
                      <Button
                        size='large'
                        variant='outlined'
                        color='secondary'
                        sx={{ textTransform: 'capitalize' }}
                        onClick={toggleCancelAddOrganisation}
                      >
                        Cancel
                      </Button>
                    </CardActions>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 5 }} />
                  </Grid>
                  <CardActions>
                    <Button
                      size='large'
                      sx={{ textTransform: 'capitalize' }}
                      variant='outlined'
                      color='secondary'
                      onClick={toggleCancelAddOrganisation}
                    >
                      Go back
                    </Button>
                  </CardActions>
                </>
              )}

            </Grid>
          </CardContent>
        </form>
      </Card>

      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}

export default AddOrganisation
