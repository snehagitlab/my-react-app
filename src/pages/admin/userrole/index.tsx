// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import { Box, Typography, Grid, Stack } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import UserAgentList from 'src/assets/Images/userAgentList.png'
import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'
import EditDarkIcon from 'src/assets/Images/Icons/dark/edit.svg'
import EditLightIcon from 'src/assets/Images/Icons/light/edit.svg'

// ** Custom Components
import AddUserRole from './AddUserRole'

// ** Data Import
import { Container, IconButton, useTheme } from '@mui/material'
import TableHeader from './TableHeader'
import { API_PATHS } from 'src/config/api.config'
import OrganisationContext from 'src/context/OrganisationProvider'
import {Helmet} from "react-helmet";


//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

const Userrole = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark' ? true : false

  const [data, setData] = useState<Array<any>>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(1)
  const [openAddUserAgentModal, setOpenAddUserAgentModal] = useState<boolean>(false)
  const {addUserAgenttoggle, setaddUserAgenttoggle,settypeId,createUserAgentList } = React.useContext<any>(OrganisationContext)

  const [record, setRecord] = useState(10)
  const [usersearching, setUserSearching] = useState<string>('')
  const toggleAddUserAgentModal = () => {
    setOpenAddUserAgentModal(true)
   
  }
  
  const toggleAddUserAgentModalclose = () => {
    setaddUserAgenttoggle(!addUserAgenttoggle)
    setOpenAddUserAgentModal(!openAddUserAgentModal)
  }

 
  const fetchAllUserTypeData = async () => {
    if (usersearching) {
      setPage(1)
    }
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.user}/types?pageNumber=${page}&recordsPerPage=${record}&sortOrder=DESC&search={"typeName":"${usersearching}"}`
    )
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

      // console.log(result.payload.data);

      setData(result.payload.data)
      setRecord(result.pager.totalRecords)

    }
  }

  

  const handleuserId = (rows: any) => {
    const userId = rows.userTypeId
    settypeId(userId)
  }

 

  useEffect(() => {
    fetchAllUserTypeData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserAgentList, record, usersearching])

  const columns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 170,
      field: 'full_name',
      headerName: 'Name',
      sortable: false,

      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip TransitionComponent={Zoom} title={params.row.typeName}>
              <Typography
                noWrap
                variant='body2'
                sx={{ color: 'text.primary', fontSize: '16px', textTransform: 'capitalize' }}
              >
                {params.row.typeName}
              </Typography>
              </Tooltip>
            </Box>
          </Box>
        )
      }
    },


    {
      flex: 0.2,
      field: 'Type',
      minWidth: 140,
      headerName: 'Type',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
            {params.row.roleId == 3 ? 'Agent' : 'User'}
          </Typography>
        )
      }
    },
    
   /*  {
      flex: 0.2,
      field: 'Ticket Type',
      minWidth: 140,
      headerName: 'Ticket Type',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
            {params.row.ticketType == 1 ? 'Support' : params.row.ticketType == 2 ? 'Offence' : 'Support,Offence'}
          </Typography>
        )
      }
    }, */

    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => (
        <Stack rowGap={2} direction='row'>
          <Tooltip TransitionComponent={Zoom} title='Edit'>
            <IconButton >
              <a onClick={() => { toggleAddUserAgentModal(), handleuserId(params.row) }} >
                <img alt="icon" src={isDarkMode ? EditLightIcon : EditDarkIcon} height="18px" width='18px' />
              </a>
            </IconButton>
          </Tooltip>


        </Stack>
      )
    }
  ]

  return (
    <>
      <Helmet>
        <title>User Role - Gogtas</title>
        <meta name="description" content="User Role" />
    </Helmet>
      <Container maxWidth='xl'>
        <TableHeader
          toggleAddUserAgentModal={toggleAddUserAgentModal}
          handlesearchbox={setUserSearching}
        />

        {data.length ? (
          <DataGrid
          autoHeight
          pagination
          rows={data}
          pageSize={pageSize}
          getRowId={row => row.userTypeId}
          disableSelectionOnClick
          columns={columns}
          checkboxSelection={false}
          rowsPerPageOptions={[10, 25, 50]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          onPageChange={newPageNo => setPage(newPageNo)}
          disableColumnMenu
          />
        ) : (

          /*  <Box sx={{ width: '100%', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={UserAgentList} alt='Organisation Avatar' />
          </Box> */
          <Grid
            container
            spacing={2}
            alignItems='center'
            justifyContent='center'
            direction='column'
            sx={{ padding: 5, overflowY: 'auto' }}
          >
            <Grid item xs={12}>
              <img src={UserAgentList} alt='Organisation Avatar' style={{ height: 300, width: 390 }} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems='center' justifyContent='center' direction='column' sx={{ mt: 3 }}>
                <Typography
                  variant='h4'
                  sx={{
                    fontSize: '28px !important',
                    color: '#000',
                    fontWeight: 500,
                    lineHeight: '44px',
                    letterSpacing: '0em'
                  }}
                >
                  Add User Role
                </Typography>
                {/*   <Typography
                variant='body1'
                sx={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '26px',
                  letterSpacing: '0em',
                  textAlign: 'center',
                  width: 500
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
              </Typography> */}
              </Grid>
            </Grid>
          </Grid>
        )}

        <AddUserRole open={openAddUserAgentModal} onClose={toggleAddUserAgentModalclose} />
        </Container>

      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}

export default Userrole
