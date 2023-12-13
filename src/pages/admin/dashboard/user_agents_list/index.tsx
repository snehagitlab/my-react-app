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
import UserDarkIcon from 'src/assets/Images/Icons/dark/lockdark.svg'

// ** Custom Components
import AddUserAgentModal from './components/AddUserAgentModal'
import ImportUserAgentModal from './components/ImportUserAgentModal'

//import UserDarkIcon from 'src/assets/Images/Icons/dark/lock1.png'

import UserLightIcon from 'src/assets/Images/Icons/light/lock.png'

// ** Data Import
import { Container, Switch, IconButton, useTheme } from '@mui/material'
import TableHeader from './components/TableHeader'
import { API_PATHS } from 'src/config/api.config'
import { toast } from 'react-toastify'
import OrganisationContext from 'src/context/OrganisationProvider'
import ChangePasswordModal from './components/ChangePasswordModal'
import {Helmet} from "react-helmet";



//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

const TableColumns = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark' ? true : false

  const [data, setData] = useState<Array<any>>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(1)
  const [openAddUserAgentModal, setOpenAddUserAgentModal] = useState<boolean>(false)
  const [openImportUserAgentModal, setOpenImportUserAgentModal] = useState<boolean>(false)
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState<boolean>(false)
  const { createUserAgentList } = React.useContext<any>(OrganisationContext)
  const { statusChange, setStatusChange, setchangepasstoggle, changepasstoggle, addUserAgenttoggle, setaddUserAgenttoggle, setaddUserAgentId, setdatafeedFileName } = React.useContext<any>(OrganisationContext)

  const [record, setRecord] = useState(10)
  const [usersearching, setUserSearching] = useState<string>('')
  const [senduserIdtotoggle, setsenduserIdtotoggle] = useState(0)


  /* const toggleAddUserAgentModal = (): void => setOpenAddUserAgentModal(prev => !prev) */
  const toggleImportUserAgentModal = (): void => {
    setOpenImportUserAgentModal(prev => !prev)
    setdatafeedFileName('')
  }
  const toggleAddUserAgentModal = () => {
    setOpenAddUserAgentModal(true)

  }
  const toggleAddUserAgentModalclose = () => {
    setaddUserAgenttoggle(!addUserAgenttoggle)
    setOpenAddUserAgentModal(!openAddUserAgentModal)
  }

  const toggleChangePasswordModalOpen = () => {
    setOpenChangePasswordModal(true)
    setchangepasstoggle(!changepasstoggle)
  }
  const toggleChangePasswordModalclose = () => {
    setOpenChangePasswordModal(!openChangePasswordModal)
  }
  const fetchAllAgentUserData = async () => {
    if (usersearching) {

      const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
      const url = new URL(
        `${BASE_URL}/${API_VERSION}/${API_PATHS.user}/?pageNumber=${page}&recordsPerPage=${record}&sortBy=email&sortOrder=ASC&search={"roleId":[3,4],"name":"${usersearching}"}`
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
        setPage(1)
        const result = await response.json()

        // console.log(result.payload.data);

        setData(result.payload.data)
        setRecord(result.pager.totalRecords)
      }
    } else {
      const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
      const url = new URL(
        `${BASE_URL}/${API_VERSION}/${API_PATHS.user}/?pageNumber=${page}&recordsPerPage=${record}&sortBy=email&sortOrder=ASC&search={"roleId":[3,4]}`
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

  }

  const onChangeStatus = async (rows: any) => {
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const data = { userId: rows.userId, isActive: !rows.isActive }
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/enableDisable`)
    try {
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${UserData.token}`
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      setStatusChange(result)
      if (result.status === 200) {
        toast.success(result.message)
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleuserId = (rows: any) => {
    const userId = rows.userId
    setsenduserIdtotoggle(userId)
    setaddUserAgentId(userId)
  }



  useEffect(() => {
    fetchAllAgentUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserAgentList, record, usersearching, statusChange])

  const columns: GridColDef[] = [

    {
      flex: 0.3,
      minWidth: 120,
      field: 'full_name',
      headerName: 'Name',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const fullName:any = params.row.fname+' '+params.row.lname

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip TransitionComponent={Zoom} title={fullName}>
              <Typography
                noWrap
                variant='body2'
                sx={{ color: 'text.primary', textTransform: 'capitalize',cursor:'pointer' }}
              >
              {fullName}
              </Typography>
              </Tooltip>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.2,
      minWidth: 200,
      headerName: 'Email',
      field: 'start_date',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography noWrap  component='a'
          variant='body2'
          sx={{ fontWeight: 400, color: 'text.primary', textDecoration: 'none' }} >
            {params.row.email}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'Role',
      minWidth: 140,
      headerName: 'Role',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography noWrap   
          component='a'
          variant='body2'
          sx={{ fontWeight: 400, color: 'text.primary', textDecoration: 'none' }} >
            {params.row.userRole.map((res: any) => res.roleId) == 3 ? 'Agent' : 'User'}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      field: 'typeName',
      minWidth: 140,
      headerName: 'User Role',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography  noWrap  component='a'
          variant='body2'
          sx={{ fontWeight: 400, color: 'text.primary', textDecoration: 'none' }} >
            {params.row.userType.typeName != null ? params.row.userType.typeName : ' '}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'salary',
      headerName: 'Status',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Switch checked={params.row.isActive} onChange={() => onChangeStatus(params.row)} />
      )
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => (
        <Stack rowGap={2} direction='row'>
          <Tooltip TransitionComponent={Zoom} title='Reset Pasword'>
            <IconButton>
              <a
                onClick={() => {
                  toggleChangePasswordModalOpen(), handleuserId(params.row)
                }}>
                <img alt="user-icon" src={isDarkMode ? UserLightIcon : UserDarkIcon} width='18px' height='18px' />
              </a>
            </IconButton>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title='Edit'>
            <IconButton >
              <a onClick={() => { toggleAddUserAgentModal(), handleuserId(params.row) }} >
                <img alt="icon" src={isDarkMode ? EditLightIcon : EditDarkIcon} width='18px' height='18px' />
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
        <title>User And Agent - Gogtas</title>
        <meta name="description" content="User And Agent" />
    </Helmet>
      <Container maxWidth='xl'>
        <TableHeader
          toggleAddUserAgentModal={toggleAddUserAgentModal}
          toggleImportUserAgentModal={toggleImportUserAgentModal}
          handlesearchbox={setUserSearching}
        />

        {data.length ? (
          <DataGrid
            autoHeight
            pagination
            rows={data}
            pageSize={pageSize}
            getRowId={row => row.userId}
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
                    fontSize: '20px !important',
                    color: '#000',
                    fontWeight: 500,
                    lineHeight: '44px',
                    letterSpacing: '0em'
                  }}
                >
                  Add Patients & Team Member
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

        <AddUserAgentModal open={openAddUserAgentModal} onClose={toggleAddUserAgentModalclose} />
        <ImportUserAgentModal open={openImportUserAgentModal} onClose={toggleImportUserAgentModal} />
        <ChangePasswordModal open={openChangePasswordModal} onClose={toggleChangePasswordModalclose} userId={senduserIdtotoggle} />
      </Container>

      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}

export default TableColumns
