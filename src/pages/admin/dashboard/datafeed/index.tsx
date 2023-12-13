// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import { Box, Typography, Grid, useTheme, Stack, IconButton } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

//import config
import { API_PATHS } from 'src/config/api.config'

//import env
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

import UserAgentList from 'src/assets/Images/userAgentList.png'

import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'
import EditDarkIcon from 'src/assets/Images/Icons/dark/edit.svg'
import EditLightIcon from 'src/assets/Images/Icons/light/edit.svg'

// ** Custom Components
import ImportDataFeedModal from './components/ImportDataFeedModel'

// ** Data Import
import { Container } from '@mui/material'
import TableHeader from './components/TableHeader'
import EditOffenceUser from './components/EditOffenceUser'
import OrganisationContext from 'src/context/OrganisationProvider'

const TableColumns = () => {
  const theme = useTheme()
  const [data, setData] = useState<Array<any>>([])
  const [record, setRecord] = useState(10)
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(1)
  const { setEditOffenceUser ,setdatafeedFileName,refreshImportList} = React.useContext<any>(OrganisationContext)
  const [openImportDataFeedModal, setOpenImportDataFeedModal] = useState<boolean>(false)
  const isDarkMode = theme.palette.mode === 'dark' ? true : false
  const [offenceUserId, setOffenceUserId] = useState<any>([])
  const [edituserafterupdate, setEdituserafterupdate] = useState<any>([])
  const [usersearching, setUserSearching] = useState<string>('')

  // console.log(offenceUserDetails)
  const fetchAllUserTypeData = async () => {
    if (usersearching) {
      setPage(1)
    }
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.offence_user}?pageNumber=${page}&recordsPerPage=${record}&sortOrder=ASC&search={"userName":"${usersearching}"}`
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
      setData(result.payload.data)
      setRecord(result.pager.totalRecords)
    }
  }

  useEffect(() => {
    fetchAllUserTypeData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, edituserafterupdate,refreshImportList,usersearching])

  const toggleImportDataFeedModal = (): void => {
    setOpenImportDataFeedModal(prev => !prev)
    setdatafeedFileName('')
  }

  const getusertypeDataset = (offenceUserId: any) => {

    setEditOffenceUser(true)
    setOffenceUserId(offenceUserId)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 170,
      field: 'full_name',
      headerName: 'Name',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                noWrap
                variant='body2'
                sx={{ color: 'text.primary', fontSize: '16px', textTransform: 'capitalize' }}
              >
                {params.row.fname} {params.row.lname}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      field: 'Dob',
      minWidth: 140,
      headerName: 'Dob',
      renderCell: (params: GridRenderCellParams) => {
        const months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ]
        const date = new Date(params.row.dob)
        const formatted_date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} `
        
        return (
          <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
            {formatted_date && formatted_date}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'Hair',
      minWidth: 140,
      headerName: 'Hair',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
            {params.row.hair ? params.row.hair : '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'Sex',
      minWidth: 140,
      headerName: 'Sex',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
            {params.row.sex ? params.row.sex : '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'Race',
      minWidth: 140,
      headerName: 'Race',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
            {params.row.raes ? params.row.raes : '-'}
          </Typography>
        )
      }
    },

    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => (
        <Stack rowGap={2} direction='row'>
          <Tooltip TransitionComponent={Zoom} title='Edit'>
            <IconButton>
              <a
                onClick={() => {
                  getusertypeDataset(params.row.offenceUserId)
                }}
              >
                <img alt='icon' src={isDarkMode ? EditLightIcon : EditDarkIcon}  width='18px' height='18px' />
              </a>
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ]

  return (
    <>
      <Container maxWidth='xl'>
        <TableHeader toggleImportStudenttModal={toggleImportDataFeedModal}  handlesearchbox={setUserSearching} />
        {data.length ? (
          <DataGrid
            className='datafeed-grid'
            autoHeight
            pagination
            rows={data}
            pageSize={pageSize}
            getRowId={row => row.offenceUserId}
            disableSelectionOnClick
            columns={columns}
            checkboxSelection={false}
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onPageChange={newPageNo => setPage(newPageNo)}
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
                  No data found
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* edit dialogue box */}
        <EditOffenceUser offenceUserId={offenceUserId} setEdituserafterupdate={setEdituserafterupdate} />

        <ImportDataFeedModal open={openImportDataFeedModal} onClose={toggleImportDataFeedModal} />
      </Container>
    </>
  )
}

export default TableColumns
