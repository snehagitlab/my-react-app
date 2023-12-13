import React, { Fragment, forwardRef, ReactElement, Ref, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import { Grid, Typography, Button, MenuItem, Select, OutlinedInput, TextField } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import DialogContent from '@mui/material/DialogContent'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import Dialog from '@mui/material/Dialog'
import Fade, { FadeProps } from '@mui/material/Fade'
import DatePicker from '@mui/lab/DatePicker'

//edit dialogue
const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

//icon
import Close from 'mdi-material-ui/Close'

//  env file
// const BASE_URL = process.env.REACT_APP_BASE_URL

// toast popup
import { toast } from 'react-toastify'

//import config
import { API_PATHS } from 'src/config/api.config'

//import env
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

//import compoennt
import OrganisationContext from 'src/context/OrganisationProvider'

function EditOffenceUser({ offenceUserId, setEdituserafterupdate }: any) {
    const { setEditOffenceUser, editOffenceUser } = React.useContext<any>(OrganisationContext)
    const [offenceUserDetails, setOffenceUserDetails] = useState<any>([])
    const [date, setDate] = useState<any>()


    const getusertypeDataset = async () => {
        setOffenceUserDetails([])
        const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.offence_user}/detail?offenceUserId=${offenceUserId}`)
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
            if (result?.payload?.data) {
                setOffenceUserDetails(result && result.payload.data)
                setDate(result && result.payload.data.dob)

            }
        }
    }

    useEffect(() => {
        getusertypeDataset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offenceUserId])

    const handleChange = (e: any) => {
        const value = e.target.value
        const name = e.target.name
        setOffenceUserDetails({ ...offenceUserDetails, [name]: value })
    }


    //edit offence user api calling function
    const handleEditOffenceUser = async () => {
        const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.offence_user}?offenceUserId=${offenceUserId}`)

        const requestData = {}
        Object.assign(requestData, {
            offenceUserId: offenceUserId,
            fname: offenceUserDetails.fname,
            lname: offenceUserDetails.lname,
            dob: date,
            address: offenceUserDetails.address,
            phone: offenceUserDetails.phone,
            raes: offenceUserDetails.raes,
            sex: offenceUserDetails.sex,
            hair: offenceUserDetails.hair,
            eyes: offenceUserDetails.eyes,
            drivesLicense: offenceUserDetails.drivesLicense,
            socialSecurity: offenceUserDetails.socialSecurity,
            height: offenceUserDetails.height,
            weight: offenceUserDetails.weight,
            city: offenceUserDetails.city,
            state: offenceUserDetails.state,
            zip: offenceUserDetails.zip,
        })
        try {
            const response = await fetch(url.toString(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${UserData.token}`
                },
                body: JSON.stringify(requestData)
            })
            const result = await response.json()
            if (result.status == 200) {
                setEdituserafterupdate(result)
                toast.success(result.message)
                setEditOffenceUser(false)
            } else {
                toast.error(result.message)
            }
        } catch (ex: any) {
            toast.error(ex.message)
        }
    }

    const handleReset = () => {
        setOffenceUserDetails([...offenceUserDetails])
    }

    return (
        <>

            {offenceUserDetails.length == 0 ? (
                ''
            ) : (
                <Dialog
                    fullWidth
                    open={editOffenceUser}
                    maxWidth='md'
                    scroll='body'
                    onClose={() => setEditOffenceUser(false)}
                    TransitionComponent={Transition}
                    onBackdropClick={() => setEditOffenceUser(false)}
                >
                    <Fragment>


                        {/* imprt edit dialogue */}
                        <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                            <IconButton
                                size='small'
                                onClick={() => setEditOffenceUser(false)}
                                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                            >
                                <Close />
                            </IconButton>
                            <Box sx={{ mb: 8, textAlign: 'center' }}>
                                <Typography variant='h5' sx={{ mb: 3 }}>
                                    Victim Information
                                </Typography>
                            </Box>


                            <Grid container spacing={6}>
                                <Grid item sm={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>fName*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            label='fname'
                                            placeholder='fname'
                                            name='fname'
                                            value={offenceUserDetails?.fname}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>lName*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            label='lname'
                                            placeholder='lname'
                                            name='lname'
                                            onChange={handleChange}
                                            value={offenceUserDetails.lname && offenceUserDetails?.lname}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Address*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            label='address'
                                            name='address'
                                            id='address'
                                            onChange={handleChange}
                                            value={offenceUserDetails.address && offenceUserDetails.address}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Phone No*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            label='Phone No'
                                            placeholder='Phone No'
                                            name='phone'
                                            id='phone'
                                            value={offenceUserDetails.phone && offenceUserDetails.phone}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label='Basic example'
                                                value={date}
                                                onChange={newValue => {
                                                    setDate(newValue)
                                                }}
                                                renderInput={params => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>

                                <Grid item sm={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id='status-select'>Raes</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId='status-select'
                                            label='raes'
                                            name='raes'
                                            onChange={handleChange}
                                            value={offenceUserDetails.raes && offenceUserDetails.raes}
                                        >
                                            <MenuItem value='B'>Black or African American</MenuItem>
                                            <MenuItem value='A'>Asian</MenuItem>
                                            <MenuItem value='N'>Native Americans and Alaska Natives</MenuItem>
                                            <MenuItem value='W'>White</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id='status-select'>Sex</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId='status-select'
                                            label='sex'
                                            name='sex'
                                            onChange={handleChange}
                                            value={offenceUserDetails.sex && offenceUserDetails.sex}
                                        >
                                            <MenuItem value='M'>Male</MenuItem>
                                            <MenuItem value='F'>Female</MenuItem>
                                            <MenuItem value='O'>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id='status-select'>Hair</InputLabel>

                                        <Select
                                            fullWidth
                                            labelId='status-select'
                                            label='hair'
                                            name='hair'
                                            id='hair'
                                            value={offenceUserDetails.hair && offenceUserDetails.hair}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value='S'>Straight</MenuItem>
                                            <MenuItem value='W'>Wavy</MenuItem>
                                            <MenuItem value='C'>Curly</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id='status-select'>Eyes</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId='status-select'
                                            label='eyes'
                                            name='eyes'
                                            id='eyes'
                                            onChange={handleChange}
                                            value={offenceUserDetails.eyes && offenceUserDetails.eyes}
                                        >
                                            <MenuItem value='Black'>Black</MenuItem>
                                            <MenuItem value='Blue'>Blue</MenuItem>
                                            <MenuItem value='Hazel'>Hazel</MenuItem>
                                            <MenuItem value='Gray'>Gray</MenuItem>
                                            <MenuItem value='Violet'>Violet</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Drivers License</InputLabel>
                                        <OutlinedInput
                                            label='drivesLicense'
                                            name='drivesLicense'
                                            id='drivesLicense'
                                            onChange={handleChange}
                                            value={offenceUserDetails.drivesLicense && offenceUserDetails.drivesLicense}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Social Security</InputLabel>
                                        <OutlinedInput
                                            label='socialSecurity'
                                            name='socialSecurity'
                                            id='socialSecurity'
                                            onChange={handleChange}
                                            value={offenceUserDetails.socialSecurity && offenceUserDetails.socialSecurity}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Height</InputLabel>
                                        <OutlinedInput
                                            label='height'
                                            name='height'
                                            id='height'
                                            onChange={handleChange}
                                            value={offenceUserDetails.height && offenceUserDetails.height}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Weight</InputLabel>
                                        <OutlinedInput
                                            label='Weight'
                                            name='weight'
                                            id='weight'
                                            onChange={handleChange}
                                            value={offenceUserDetails.weight && offenceUserDetails.weight}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>City</InputLabel>
                                        <OutlinedInput
                                            label='city'
                                            name='city'
                                            id='city'
                                            onChange={handleChange}
                                            value={offenceUserDetails.city && offenceUserDetails.city}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>State</InputLabel>
                                        <OutlinedInput
                                            label='state'
                                            name='state'
                                            id='state'
                                            onChange={handleChange}
                                            value={offenceUserDetails.state && offenceUserDetails.state}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>ZipCode</InputLabel>
                                        <OutlinedInput
                                            label='zip'
                                            name='zip'
                                            id='zip'
                                            value={offenceUserDetails.zip && offenceUserDetails.zip}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                                <Button
                                    variant='contained'
                                    sx={{ marginRight: 1 }}
                                    type='submit'
                                    onClick={() => handleEditOffenceUser()}
                                >
                                    Update
                                </Button>
                                <Button variant='outlined' color='secondary' onClick={() => { handleReset(), setEditOffenceUser(false) }}>
                                    Reset
                                </Button>
                            </DialogActions>
                        </DialogContent>
                        {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
                    </Fragment>
                </Dialog>
            )}
        </>
    )
}

export default EditOffenceUser
