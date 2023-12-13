import React from 'react'
import { Grid } from '@mui/material'
import {Helmet} from "react-helmet";

const SettingsPageHelp = () => {
  return (
    <>
      <Helmet>
        <title>Help - Gogtas</title>
        <meta name="description" content="Help" />
    </Helmet>
      <Grid container sx={{ display: 'flex' , justifyContent: 'center', alignItems: 'center',height:'calc(100% - 64px)'}}>
       
        <Grid md={12}  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <iframe   src="https://www.youtube.com/embed/7IAUQkQL4-g" style={{border:'0',height:'412px',width:'60%'}} ></iframe>
        </Grid>
      </Grid>
    </>
  )
}
export default SettingsPageHelp
