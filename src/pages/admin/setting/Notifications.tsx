import React from 'react'
import { Grid, Typography } from '@mui/material'
import SettingPage from 'src/pages/admin/setting'

const Notifications = () => {
  return (
    <>
      <Grid sx={{ display: 'flex' }}>
        <Grid md={4}>
          <SettingPage />
        </Grid>
        <Grid md={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <Typography>Work In Progress</Typography></Grid>
      </Grid>
    </>
  )
}
export default Notifications
