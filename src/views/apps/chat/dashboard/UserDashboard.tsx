import React, { useEffect, useState } from 'react'


// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// **  Imports mui
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'

//import images
import LeftArrow from '../../../../assets/Images/user_Icons/light/LeftArrow.png'

//impoert react-router-dom
import { Link } from 'react-router-dom'

//import context
import TicketContext from '../../../../context/TicketProvider'
import ChatContext from '../../../../context/ChatProvider'
import { Helmet } from 'react-helmet'
import { KB_ACCESS, API_PATHS } from '../../../../config/api.config'

const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const API_VERSION = import.meta.env.VITE_APP_API_VERSION




function UserDashboard() {
    const { handleSliderOpen, setTabValue } = React.useContext<any>(TicketContext)
    const { setShowActiveSupport } = React.useContext<any>(ChatContext)
    const [orgName, setOrgName] = React.useState<any>("")

    //const [offenceTicketCount, setoffenceTicketCount] = useState<any>()

    const [kbaccess, setKBaccess] = useState()
    const [userId, setUserId] = useState(0)


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
        setUserId(user.data.userId)
        handleGetUserDetails()

    }, [userId])

    const handleGetUserDetails = async () => {
        if (userId > 0) {
            const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/detail?userId=${userId}`)
            const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
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
                    setKBaccess(data?.userOrg?.org?.KnowBaseAccess)

                } else {
                    console.log(result.message)
                }
            } catch (ex: any) { }
        }
    }

    const handleClick = () => {
        setShowActiveSupport(true)
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
        const orgName = user?.data?.userOrg?.org?.orgName
        setOrgName(orgName && orgName)
    }, [])

    const handleTabAllTicket = () => {
        setTabValue("1")
    }

    //fetch ticket counting
    /* const countTicket = async () => {
        const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/status/count`)
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${UserData.token}`
            }
        })
        const result = await response.json()
        if (result.status === 200) {
            setoffenceTicketCount(result.payload.typeWise[1].count)
        }
    }
    useEffect(() => {
        countTicket()
    }, []) */


    return (
        <>
            <Helmet>
                <title>Dashboard - Gogtas</title>
                <meta name="description" content="Dashboard - Gogtas" />
            </Helmet>
            <Box
                sx={{
                    padding: '26.7px 13.7px 26.7px 13.7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: { sm: 'none', xs: 'none', md: '1px solid #F2F2F2' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        size='small'
                        sx={{ color: 'text.secondary', paddingRight: '12px', display: { sm: 'block', xs: 'block', md: 'none' } }}
                        onClick={handleClick}
                    >
                        <img src={LeftArrow} alt='LeftArrow' style={{ width: '33px', height: '33px' }} />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '12px' }}>
                            <Typography
                                sx={{
                                    fontWeight: '500',
                                    fontSize: { xs: '20px', sm: '20px', md: '25px' },
                                    color: '#1B0B2B',
                                    lineHeight: '31.74px',
                                    fontFamily: 'Mazzard',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {orgName !== " undefined" && orgName}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Grid sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'start', height: '100%', width: '100%' }}>
                <Grid sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '120px', height: 'fit-content', width: 'fit-content' }}>
                    <Grid sx={{ padding: "5px 0px 5px 10px", width: '300px' }}>
                        <Card sx={{ border: 0, boxShadow: " 0 3px 10px rgb(0 0 0 / 0.2)", backgroundColor: 'common.white', cursor: "pointer" }}
                            onClick={() => { handleSliderOpen(), handleTabAllTicket() }}>
                            <CardContent sx={{ padding: theme => `${theme.spacing(8, 5, 8)} !important` }}>
                                <Typography
                                    variant='h6'
                                    sx={{ display: 'flex', fontWeight: '600', marginBottom: 2.75, alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}
                                >

                                    All Tickets
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                    {
                        kbaccess != undefined && KB_ACCESS.NOACCESS == kbaccess ? '' :

                            (<Grid sx={{ padding: "5px 0px 5px 10px", width: '300px', marginTop: '20px' }}>
                                <Link to='/user/knowledge' target='_blank' style={{ cursor: "pointer" }} >
                                    <Card sx={{ border: 0, boxShadow: " 0 3px 10px rgb(0 0 0 / 0.2)", backgroundColor: 'common.white', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <CardContent sx={{ padding: theme => `${theme.spacing(8, 5, 8)} !important` }}>

                                            <Typography
                                                variant='h6'
                                                sx={{ display: 'flex', fontWeight: '600', marginBottom: 2.75, alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}
                                            >

                                                Knowledge Base
                                            </Typography>


                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>)
                    }
                </Grid>
            </Grid>
            <Grid>
            </Grid>



        </>
    )
}

export default UserDashboard



