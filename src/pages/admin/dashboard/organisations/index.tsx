// ** React Imports
import React, { useState, useEffect } from 'react'

// toast popup
import { toast } from 'react-toastify'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import { Switch, IconButton, Stack, useTheme } from '@mui/material'
/* import Modal from '@mui/material/Modal'

import Button from '@mui/material/Button'

*/ import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'

// ** Icons Imports
import OrganisationAvatar from 'src/assets/Images/empty_folder.svg'

//import UserDarkIcon from 'src/assets/Images/Icons/dark/user.svg'
import EditDarkIcon from 'src/assets/Images/Icons/dark/edit.svg'
/* import TrashDarkIcon from 'src/assets/Images/Icons/dark/trash.svg'
 */ import ViewDarkIcon from 'src/assets/Images/Icons/dark/eye.svg'

import EditLightIcon from 'src/assets/Images/Icons/light/edit.svg'

/* import TrashLightIcon from 'src/assets/Images/Icons/light/trash.svg' 

*/ import ViewLightIcon from 'src/assets/Images/Icons/light/eye.svg'

//import UserLightIcon from 'src/assets/Images/Icons/light/user.svg'

// ** Custom Components Imports
import TableHeader from './components/TableHeader'
import { useNavigate as useRouter } from 'react-router-dom'
import { useNavigate } from 'react-router'

import { API_PATHS } from 'src/config/api.config'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

import OrganisationContext from 'src/context/OrganisationProvider'
import LockDarkIcon from 'src/assets/Images/Icons/dark/dark_light.svg'
import ChangePasswordModal from 'src/pages/admin/dashboard/user_agents_list/components/ChangePasswordModal'
import {Helmet} from "react-helmet";

const OrganisationList = () => {
  const theme = useTheme()

  const isDarkMode = theme.palette.mode === 'dark' ? true : false

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Array<any>>([])
  const [searching, setSearching] = useState<string>('')
  const { createOrgList ,setchangepasstoggle, changepasstoggle,setaddUserAgentId} = React.useContext<any>(OrganisationContext)

  const [record, setRecord] = useState(10)

  // ** Hooks
  const router = useRouter()
  const navigate = useNavigate()
  const fetchAllOrganisationsData = async () => {
    if (searching) {
      setPage(1)
    }
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.organisation
      }/?sortOrder=DESC&pageNumber=${page.toString()}&recordsPerPage=${record.toString()}&search={"orgName":"${searching}"}`
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

      //console.log('all data===>' + JSON.stringify(result.payload.data))

      setData(result.payload.data)
      setRecord(result.pager.totalRecords)
    }
  }
  {
    /* const deleteOrganisation = async (id: number) => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}?orgId=${id}`)
    try {
      const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
      const response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${UserData.token}`
        }
      })
      if (response.status === 200) {
        toast.success('organization deleted successfully ')
        setRequestStatus({ ...requestStatus, success: true })
        fetchAllOrganisationsData()
        handleClose()
      } else {
        setRequestStatus({ ...requestStatus, error: true })
      }
    } catch (err: any) {
      setRequestStatus({ ...requestStatus, error: true, msg: err.message })
    }
  } */
  }

  // modal css

  /* const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 420,
    height: 200,
    bgcolor: 'background.paper',
    boxShadow: 2,
    p: 8
  } */
  const onEditOrgBtnClick = (row: any) => {
    navigate('/organization/edit', { state: row })
  }
  const onViewOrgBtnClick = (row: any) => {
    navigate('/organization/view', { state: row })
  }

  const onChangeStatusOrg = async (rows: any) => {
    const data = { orgId: rows.orgId, isActive: !rows.isActive }

    const url = `${BASE_URL}/${API_VERSION}/${API_PATHS.organisation}/enableDisable`
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()

      if (result.status === 200) {
        toast.success(result.message)
        fetchAllOrganisationsData()
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }
  useEffect(() => {
    fetchAllOrganisationsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, record])
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState<boolean>(false)

  //Change Password Super Admin
  const [senduserIdtotoggle, setsenduserIdtotoggle] = useState(0)

  const toggleChangePasswordModalOpen = () => {
    setOpenChangePasswordModal(true)
    setchangepasstoggle(!changepasstoggle)
  }
  const toggleChangePasswordModalclose = () => {
    setOpenChangePasswordModal(!openChangePasswordModal)
  }
  const handleuserId = (rows: any) => {
    //console.log(rows.userId)
    const userId = rows.userId
    setsenduserIdtotoggle(userId)
    setaddUserAgentId(userId)
  }

  //table pagination default columns name
  const defaultColumns = [
    {
      flex: 0.1,
      minWidth: 230,
      field: 'orgName',
      headerName: 'Organization Name',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Tooltip TransitionComponent={Zoom} title={params.row.orgName}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '16rem' }}>
                  <Typography
                    noWrap
                    component='a'
                    variant='body2'
                    sx={{ fontWeight: 400, color: 'text.primary', textDecoration: 'none' }}
                  >
                    {params.row.orgName}
                  </Typography>
                               
                </div>
              </Tooltip>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'isFreeTrial',
      headerName: 'Subscription',
      sortable: false,
      renderCell: (params: any) => {
      return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '16rem' }}>
                  {
                    params.row.isFreeTrial === 1 ?
                    
                    <span
                    
                    style={{
                    fontSize: '12px',
                    backgroundColor:'#2d4acd',marginLeft: '10px',  paddingLeft: '5px',paddingRight: '5px',paddingBottom: '10px',paddingTop: '10px',
                     textTransform: 'capitalize',
                    color: '#fff',
                    borderRadius: '5px'
                   }}
                    >
                      Free Trial
                    </span>
                    
                    :''
                  }
                </div>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      field: 'website',
      minWidth: 200,
      headerName: 'Domain',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.secondary', fontSize: '15px' }}>
              {params.row.website}
            </Typography>
          </Box>
        )
      }
    },

/*     {
      flex: 0.2,
      field: 'orgBranch',
      minWidth: 100,
      headerName: 'City',
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {params.row.orgBranch.length === 0 ? null : params.row.orgBranch[0].city}
            </Typography>
          </Box>
        )
      }
    }, */

     {
      //flex: 0.3,
      field: 'orgType',
      minWidth: 200,
      headerName: 'Organization Type',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize', fontSize: '14px' }}>
              {params.row.orgType != null ? params.row.orgType.orgTypeName : null }
            </Typography>
          </Box>
        )
      }
    }, 

    {
      // flex: 0.2,
      minWidth: 140,
      field: 'isActive',
      headerName: 'Status',
      sortable: false,
      renderCell: (params: any) => {
        return <Switch checked={params.row.isActive} onChange={() => onChangeStatusOrg(params.row)} name='check' />
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: any) => (
        <Stack rowGap={2} direction='row'>

         {/*  <Tooltip TransitionComponent={Zoom} title='User'>
            <IconButton>
              <img alt="icon" src={isDarkMode ? UserLightIcon : UserDarkIcon} />
            </IconButton>
          </Tooltip> */}

          <Tooltip TransitionComponent={Zoom} title='View'>
            <IconButton>
              <img alt="icon" src={isDarkMode ? ViewLightIcon : ViewDarkIcon} onClick={() => onViewOrgBtnClick(params.row)} />
            </IconButton>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title='Edit'>
            <IconButton onClick={() => onEditOrgBtnClick(params.row)}>
              <img alt="icon" src={isDarkMode ? EditLightIcon : EditDarkIcon} width='18px' height='18px'/>
            </IconButton>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title='Reset Pasword' >
            <IconButton  onClick={() => {
                  toggleChangePasswordModalOpen(), handleuserId(params.row)
                }}>
             
                <img alt="lock-icon" src={isDarkMode ? LockDarkIcon : LockDarkIcon} width='17px' height='17px'  />
              
            </IconButton>
          </Tooltip>
          {/* <Tooltip TransitionComponent={Zoom} title='Delete'>
            <IconButton onClick={() => handleOpen()}>
              <img src={isDarkMode ? TrashLightIcon : TrashDarkIcon} />
            </IconButton>
          </Tooltip> */}

          {/* delete organisation pop-up */}
          {/* <Modal
            hideBackdrop
            open={open}
            onClose={handleClose}
            aria-labelledby='child-modal-title'
            aria-describedby='child-modal-description'
          >
            <Box sx={{ ...style }}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                Delete Organisation
              </Typography>
              <p id='child-modal-description'>Are you sure you want to delete this organisation?</p>

              <Button
                variant='contained'
                size='small'
                sx={{ marginRight: 2, mb: 0, background: `${theme.palette.primary.main}` }}
                onClick={() => deleteOrganisation(params.row.orgId)}
              >
                Ok
              </Button>
              <Button variant='contained' size='small' onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Modal> */}
        </Stack>
      )
    }
  ]

  //end default columns name

  useEffect(() => {
    fetchAllOrganisationsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createOrgList, record])

  const toggleAddOrganisationForm = () => {
    router('/organization/add')
  }

  return (
    <>
     <Helmet>
        <title>Organization-Gogtas</title>
        <meta name="description" content="Organization" />
    </Helmet>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableHeader toggle={toggleAddOrganisationForm} handesearchbox={setSearching} />
        {data.length && data.length ? (
          <DataGrid
            autoHeight
            pagination
            rows={data}
            pageSize={pageSize}
            getRowId={row => row.orgId}
            disableSelectionOnClick
            columns={defaultColumns}
            checkboxSelection={false}
            rowsPerPageOptions={[7, 10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onPageChange={newPageNo => setPage(newPageNo)}
            disableColumnMenu
          />
        ) : (
          <Grid
            container
            spacing={2}
            alignItems='center'
            justifyContent='center'
            direction='column'
            sx={{ padding: 5, overflowY: 'auto' }}
          >
            <Grid item xs={12}>
              <img src={OrganisationAvatar} alt='Organisation Avatar' style={{ height: 300, width: 390 }} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems='center' justifyContent='center' direction='column' sx={{ mt: 3 }}>
                <Typography
                  variant='h4'
                  sx={{
                    fontSize: '28px !important',
                    color: '#000',
                    fontWeight: 600,
                    lineHeight: '44px',
                    letterSpacing: '0em'
                  }}
                >
                  Add Organization
                </Typography>

                {/* <Typography
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
      </Grid>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </Grid>
    <ChangePasswordModal open={openChangePasswordModal} onClose={toggleChangePasswordModalclose} userId={senduserIdtotoggle} />
    </>
  )
}

export default OrganisationList
