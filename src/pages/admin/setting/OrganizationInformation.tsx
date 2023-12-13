import React, { useState, useEffect, useRef } from 'react'

import { Autocomplete, Box, Button, CardActions, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import SettingPage from 'src/pages/admin/setting'
import org_default from 'src/assets/Images/org_default.svg'
import { toast } from 'react-toastify'

//import formik
import { useFormik } from 'formik'

import * as yup from 'yup'

//import reract router dom
//import { useLocation } from 'react-router-dom'



import { nameval,  newOrgTypeval } from 'src/pages/util/validationall'

import { API_PATHS, FILE_TYPE } from 'src/config/api.config'
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton'
import MuiAvatar from '@mui/material/Avatar'
import ImageUpdateIcon from 'src/assets/Images/update_image_icon.svg'
import {Helmet} from "react-helmet";



//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC

const orgProfile: any = parseInt(FILE_TYPE.ORG_LOGO)

const AccountSettings = () => {
    const [getSelectedImageUpdate, setSelectedImageUpdate] = React.useState<any>()
    const [updateOrgLoading, setUpdateOrgLoading] = React.useState(false)
    const [orgProfileImageUpdate, setOrgProfileImageUpdate] = useState()
    const [orgTypeData, setOrgTypeData] = useState<Array<any>>([])

    const [orgId, setOrgId] = useState(0)

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
      setOrgId(user?.data.userOrg.orgId)
      handleGetOrganisation()
  
    
  
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [orgId])

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


    const readFile = (file: any) => {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

     const schema = yup.object().shape({
        email: yup.string().email('Invalid Email Format').required('Website is required'),
        domainName: yup
            .string()
            .matches(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                'Enter correct url'
            ),
            
        orgName: nameval,
        newOrgType: newOrgTypeval,
        
       }) 

   

    const formik = useFormik({
        initialValues: {
            
            orgName: '',
            newOrgType: '',
            email: '',
            domainName: '',
            line1: '',
            line2: '',
            country: '',
            zipCode: '',
            state: '',
            city:''
         
        },

         validationSchema: schema,        

        onSubmit: () => {
            {
                handleEditOrganisation()
            }
        } 

    })

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
        Object.assign(requestData, { orgId: orgId })
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
        if (getSelectedImageUpdate != null) {
            Object.assign(requestData, { logo: orgLogoImage && orgLogoImage })
        } else {
            Object.assign(requestData, { logo: orgProfileImageUpdate && orgProfileImageUpdate })
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
    const handleGetOrganisation = async () => {
        if (orgId >  0) {
            const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}/detail?orgId=${orgId}`)
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
                    formik.setFieldValue('newOrgType', data.orgTypeId)
                    setSelectedImageUpdate(data.logo)
                   

                    //setOrgProfileImageUpdate(data.logo)

                }
            } catch (ex: any) { }
        }
    }

    useEffect(() => {
      
        fetchAllOrganisationsData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    const [citylist, setCityList] = useState<Array<any>>([])


    const onInputChange = (event: any, value: any) => {
        if (value) {
            formik.setFieldValue('city', '')
            setDisableCity(false)

            formik.values.state = value ? value : ''
            fetchAllState(value);
        } else {
            setSatateList([]);
        }
    };
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

        }else {
            setCityList([]);
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

    const [getno, setNo] = useState(0)

     useEffect(()=> {
        setNo(0)
     },[])

    const onInputChangeCountry = (event: any, value: any) => {
        setDisableState(false)
        if(getno !== 0)
        {
         formik.values.state = ''
        formik.values.city = ''  
        
        }
        else
        {
            setNo(1)
        }
        if (value) {
       
            formik.values.country = value ? value : ''
            fetchAllCountries(value);
        } else {
            setCountriesList([]);
        }
    };

    const fileInput: any = useRef()

    const selectFile = () => {
        fileInput.current.click()
    }

    return (
        <>
        <Helmet>
        <title>Organization Information - Gogtas</title>
        <meta name="description" content="Organization Information
" />
    </Helmet>
        <Grid sx={{ display: 'flex' }}>
            <Grid md={4}>
                <SettingPage />
            </Grid>
            <Grid md={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid container spacing={5}>
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

                            <MuiAvatar src={getSelectedImageUpdate ? getSelectedImageUpdate : org_default} alt='Organization Profile' sx={{ width: '100%', height: '100%' }} />
                            <input
                                type='file'
                                style={{ display: 'none' }}
                                ref={fileInput}
                                onChange={onChangeHandlerUpdate}
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
                    {/*  <Grid item xs={12} md={12}>

                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input hidden accept="image/*" type="file" onChange={onChangeHandlerUpdate} />
                            <img
                                src={getSelectedImage ? getSelectedImage : org_default}
                                style={{
                                    borderRadius: "50%",
                                    width: 150,
                                    height: 150,
                                    display: "block",
                                    backgroundColor: "lightgray",
                                    backgroundPosition: "center",
                                    backgroundSize: "auto 80px"
                                }}
                                className="big cc visa icon"
                            />
                        </IconButton>

                    </Grid> */}

                    <Grid item xs={12} md={6}>
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
                                    />
                                )}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ background: '#ffffff' }}>
                            <Autocomplete
                                value={formik.values.state ? formik.values.state : ''}
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

                                error={Boolean(formik.errors.zipCode && formik.touched.zipCode)}
                            />
                        </FormControl>
                    </Grid>  <Grid item xs={12}>
                        <Divider sx={{ margin: 0, marginTop: 2 }} />
                    </Grid>
                    <Grid xs={12} md={12} display='flex' justifyContent='center' alignItems='center' >
                        <Box sx={{ marginLeft: '30px' }}>
                            <CardActions>
                                <Divider sx={{ margin: 0 }} />
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
                                                    mr: 3,
                                                }}
                                            >
                                                Update
                                            </LoadingButton>
                                        </>
                                        :
                                        <>
                                            <Button
                                                size='large'
                                                onClick={()=>handleEditOrganisation()}
                                                sx={{ mr: 3, textTransform: 'capitalize' }}
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

                                // onClick={toggleCancelAddOrganisation}
                                >
                                    Cancel
                                </Button>
                            </CardActions>
                        </Box>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
        </>
    )
}

export default AccountSettings
