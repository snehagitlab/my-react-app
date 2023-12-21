import Box from '@mui/material/Box'
import React from 'react'

import { Outlet } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import SidebarLeft from '../views/apps/chat/sidebarLeft/SidebarLeft'
import UpdateUser from '../pages/user/auth/updateUser'

const Layout = () => {
  // const user1 = localStorage.getItem('user1Data') == null ? false : true

  return (
    <React.Fragment>
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',

          height: '100vh',
          overflowX: 'hidden'
        }}
      >
        <SidebarLeft />
        <Box sx={{ width: { md: '80vw', sm: '100%', xs: '100%' } }}>
          <Outlet />
        </Box>
        <UpdateUser />


        {/* <main>{user1 ? <Outlet /> : <Navigate to='/userlogin' />}</main> */}
      </Box>
      <ToastContainer autoClose={3000} position='bottom-right' />
    </React.Fragment>
  )
}
export default Layout
