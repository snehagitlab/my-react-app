import Box from '@mui/material/Box'
import React from 'react'

import { Outlet } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'

//import component
import KnowledgeHeader from 'src/views/apps/chat/KnowledgeUser/KnowledgeHeader'

const Layout = () => {
  // const user1 = localStorage.getItem('user1Data') == null ? false : true

  return (
    <React.Fragment>
      <KnowledgeHeader />
      <Box>
        <Outlet />
      </Box>

      {/* <main>{user1 ? <Outlet /> : <Navigate to='/userlogin' />}</main> */}

      <ToastContainer autoClose={3000} position='bottom-right' />
    </React.Fragment>
  )
}
export default Layout
