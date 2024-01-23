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
import { Helmet } from 'react-helmet'
import StartConversationImg from '../../../../assets/Images/chat/DashboardChat.svg'

function UserDashboard() {

    return (
        <>
            <Helmet>
                <title>ProBizCa - Chat</title>
                <meta name="description" content="Probizca-chat" />
            </Helmet>
            <Grid sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'start', height: '100%', width: '100%' }}>
                <Grid sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '200px', height: 'fit-content', width: 'fit-content' }}>
                    <Grid sx={{ width: 300, }} >
                        <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <img src={StartConversationImg} alt="Start Conversation" style={{ width: '90%', height: '90%' }} />
                            <Typography variant="h6" color="#a3a3a3" sx={{ mt: 7 }}>
                                Start Conversation
                            </Typography>
                            <Typography color="#a3a3a3" sx={{ textAlign: 'justify', fontSize: '15px' }}>
                                You didn't made any conversation yet, please select username.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
            <Grid>
            </Grid>
        </>
    )
}
export default UserDashboard



