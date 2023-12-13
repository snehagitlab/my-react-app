// ** React Imports
import React, { useState, useEffect } from 'react'

// toast popup
//import { toast } from 'react-toastify'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import { IconButton, Stack, useTheme } from '@mui/material'
import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'

// ** Icons Imports
import OrganisationAvatar from 'src/assets/Images/organisation.png'
import EditDarkIcon from 'src/assets/Images/Icons/dark/edit.svg'
import EditLightIcon from 'src/assets/Images/Icons/light/edit.svg'

// ** Custom Components Imports
import TableHeader from '../../organisations/components/TableHeader'

//import { useNavigate } from 'react-router'

// import { useNavigate } from 'react-router'
import { API_PATHS } from 'src/config/api.config'
import Add_Org_Type from './add_org_type/Add_Org_Type';
import {Helmet} from "react-helmet";

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

import OrganisationContext from 'src/context/OrganisationProvider'

const OrganizationTypeList = () => {
  const theme = useTheme()

  const isDarkMode = theme.palette.mode === 'dark' ? true : false

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Array<any>>([])
  const [searching, setSearching] = useState<string>('')
  const { createOrgList, setOrgtypeId, statusChange } = React.useContext<any>(OrganisationContext)
  const [isAddNewType, setAddNewType] = React.useState(false)
  const [record, setRecord] = useState(10)

  // ** Hooks
  //const router = useRouter()
  //const navigate = useNavigate()

  const fetchAllOrganisationsData = async () => {
    if (searching) {
      setPage(1)
    }
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.organisationType
      }/?sortOrder=DESC&pageNumber=${page.toString()}&recordsPerPage=${record.toString()}&search={"orgTypeName":"${searching}"}`
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

  const handleorgtypeInfo = (rows: any) => {
    setOrgtypeId(rows.orgTypeId)
  }

 /*  const onChangeStatus = async (rows: any) => {
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const data = { orgTypeId: rows.orgTypeId, isActive: !rows.isActive }
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.organisationType}/enableDisable`)
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
  } */

  useEffect(() => {
    fetchAllOrganisationsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, record, statusChange])

  //table pagination default columns name
  const defaultColumns = [
    {
      flex: 0.1,
      minWidth: 300,
      field: 'orgTypeName',
      headerName: 'Organization Type',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Tooltip TransitionComponent={Zoom} title={params.row.orgTypeName}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '11rem' }}>
                  <Typography
                    noWrap
                    component='a'
                    variant='body2'
                    sx={{ fontWeight: 400, color: 'text.primary', textDecoration: 'none' }}
                  >
                    {params.row.orgTypeName}
                  </Typography>
                </div>
              </Tooltip>
            </Box>
          </Box>
        )
      }
    },

 /*    {
      flex: 0.2,
      minWidth: 140,
      field: 'isActive',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => (
        <Switch checked={params.row.isActive} onChange={() => onChangeStatus(params.row)} />
      )
    }, */

    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: any) => (
        <Stack rowGap={2} direction='row'>
          <Tooltip TransitionComponent={Zoom} title='Edit'>
            <IconButton onClick={() => { toggleAddOrganisationForm(), handleorgtypeInfo(params.row) }}>
              <img alt="icon" src={isDarkMode ? EditLightIcon : EditDarkIcon} width='18px' height='18px'/>
            </IconButton>
          </Tooltip>
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
    //router('/organization/add')
    setAddNewType(true)
  }

  const closeOrgPopup = () => {
    fetchAllOrganisationsData()
    setAddNewType(false)
    setOrgtypeId(0)
  }

  return (
    <>
    <Helmet>
        <title>Organization Type - Gogtas</title>
        <meta name="description" content="Organization Type" />
    </Helmet>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {isAddNewType ? <Add_Org_Type toggle={closeOrgPopup} /> : null}
        <TableHeader toggle={toggleAddOrganisationForm} handesearchbox={setSearching} />
        {
          data.length && data.length ? (
            <DataGrid
              autoHeight
              pagination
              rows={data}
              pageSize={pageSize}
              getRowId={row => row.orgTypeId}
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
                    Add Organization Type
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )
        }
      </Grid >
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </Grid >
    </>
  )
}

export default OrganizationTypeList
