// ** React Imports
import React, { useState, useEffect } from 'react'


// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import { IconButton, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'


/* import Modal from '@mui/material/Modal'
import UserDarkIcon from 'src/assets/Images/Icons/dark/user.svg'
import UserLightIcon from 'src/assets/Images/Icons/light/user.svg'
import Button from '@mui/material/Button' */

import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'

// ** Icons Imports

//import OrganisationAvatar from 'src/assets/Images/organisation.png'
import OrganisationAvatar from 'src/assets/Images/empty_folder.svg'


import EditDarkIcon from 'src/assets/Images/Icons/dark/edit.svg'
import TrashDarkIcon from 'src/assets/Images/Icons/dark/trash.svg'
import ViewDarkIcon from 'src/assets/Images/Icons/dark/eye.svg'

import EditLightIcon from 'src/assets/Images/Icons/light/edit.svg'

import TrashLightIcon from 'src/assets/Images/Icons/light/trash.svg'

import ViewLightIcon from 'src/assets/Images/Icons/light/eye.svg'

// ** Custom Components Imports
import Templateheader from './template/TemplateHeader'
import { useNavigate } from 'react-router'

import { API_PATHS } from 'src/config/api.config'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import {Helmet} from "react-helmet";

//env 
const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_SUPPORT = process.env.REACT_APP_BASE_URL




const TemplateDashboard = () => {

  const theme = useTheme()

  const isDarkMode = theme.palette.mode === 'dark' ? true : false


  const [data, setData] = useState<Array<any>>([])
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(1)
  const [record, setRecord] = useState(10)
  const [searching, setSearching] = useState<string>('')
  const [deleteTemplateId, setDeleteTemplateId] = useState(1)
  const [orgTypeData, setOrgTypeData] = useState<Array<any>>([])

  const handleOpen = (e: any) => {

    setOpen(true);
    setDeleteTemplateId(e)
  };
  const handleClose = () => {
    setOpen(false);
  };

  // ** Hooks
  const navigate = useNavigate()
  const fetchAllTemplateData = async () => {

    if (searching) {
      setPage(1)

    }

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.template}/?sortBy=createdAt&sortOrder=DESC&pageNumber=${page.toString()}&recordsPerPage=${record.toString()}&search={"title":"${searching}"}`
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
  const deleteTemplate = async (id: number) => {


    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.template}?templateId=${id}`)
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
        toast.success('Template deleted successfully ')
        navigate('/knowledge/template')
        fetchAllTemplateData()
        handleClose()
      } else {
        toast.error('Something went wrong!')
      }
    } catch (err: any) {
      console.log(err)
    }
  }
  const fetchAllOrganisationsData = async () => {

    const url = new URL(
      `${BASE_URL_SUPPORT}/${API_VERSION}/${API_PATHS.organisationType}/?sortOrder=ASC&showAll=true`
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
      setOrgTypeData(result.payload.data)
    }
  }

  // modal css

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '5px 7px 20px rgb(0 0 0 / 25%) !important',
    bgcolor: 'background.paper',
    p: 8
  }

  const onEditOrgBtnClick = (row: any) => {
    navigate('/template/edit', { state: row })
  }
  const onViewOrgBtnClick = (row: any) => {
    navigate('/template/view', { state: row })
  }

  useEffect(() => {
    fetchAllTemplateData()
    fetchAllOrganisationsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, record])

  //table pagination default columns name
  const defaultColumns = [
    {
      flex: 0.2,
      minWidth: 120,
      field: 'orgName',
      headerName: 'Title',
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>

              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '11rem' }}>
                <Tooltip TransitionComponent={Zoom} title={params.row.title}>
                  <Typography
                    noWrap
                    component='a'
                    variant='body2'
                    sx={{ fontWeight: 400, color: 'text.primary', textDecoration: 'none' }}
                  >
                    {params.row.title}
                  </Typography>
                </Tooltip>
              </div>

            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.2,
      field: 'website',
      minWidth: 120,
      headerName: 'Type',
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            {orgTypeData.map(a => {
              {

                return (
                  params.row.orgType == a.orgTypeId ?
                    (<Typography key={a.orgTypeId} noWrap variant='body2' sx={{ fontWeight: 400, color: 'text.primary', textDecoration: 'none' }}>
                      {a.orgTypeName}
                    </Typography>) :
                    ('')
                )
              }

            })}



          </Box>
        )
      }
    },

    /* {
      flex: 0.1,
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
    },
    {
      // flex: 0.2,
      minWidth: 140,
      field: 'isActive',
      headerName: 'Status',
      renderCell: (params: any) => {
        return <Switch checked={params.row.isActive} onChange={() => onChangeStatusOrg(params.row)} name='check' />
      }
    }, */
    {
      flex: 0.2,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: any) => (
        <Stack rowGap={2} direction='row'>
          {/* <Tooltip TransitionComponent={Zoom} title='User'>
            <IconButton>
              <img src={isDarkMode ? UserLightIcon : UserDarkIcon} />
            </IconButton>
          </Tooltip> */}
          <Tooltip TransitionComponent={Zoom} title='View'>
            <IconButton>
              <img alt="icon-img" src={isDarkMode ? ViewLightIcon : ViewDarkIcon} onClick={() => onViewOrgBtnClick(params.row)}  width='18px' height='18px' />
            </IconButton>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title='Edit'>
            <IconButton onClick={() => onEditOrgBtnClick(params.row)}>
              <img alt="icon-img" src={isDarkMode ? EditLightIcon : EditDarkIcon}  width='18px' height='18px' />
            </IconButton>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title='Delete'>
            <IconButton onClick={() => handleOpen(params.row.templateId)}>
              <img alt="icon-img" src={isDarkMode ? TrashLightIcon : TrashDarkIcon}  width='18px' height='18px' />
            </IconButton>
          </Tooltip>

          {/* delete organisation pop-up */}
          <Modal
            hideBackdrop
            open={open}
            onClose={handleClose}
            aria-labelledby='child-modal-title'
            aria-describedby='child-modal-description'
            sx={{ backgroundColor: '#00000075' }}
          >
            <Box sx={{ ...style }}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                Delete Template
              </Typography>
              <p id='child-modal-description'>Are you sure you want to delete this template?</p>

              <Button
                variant='contained'
                size='small'
                sx={{ marginRight: 2, mb: 0, textTransform: 'capitalize' }}
                onClick={() => deleteTemplate(deleteTemplateId)}
              >
                Ok
              </Button>
              <Button variant='outlined' size='small' sx={{ textTransform: 'capitalize' }} onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Modal>
        </Stack>
      )
    }
  ]

  //end default columns name

  /* useEffect(() => {
    fetchAllTemplateData()
  }, [record]) */

  const toggleAddTemplateForm = () => {
    navigate('/template/add')
  }

  return (
    <>
    <Helmet>
        <title>Template - Gogtas</title>
        <meta name="description" content="Template" />
    </Helmet>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Templateheader toggle={toggleAddTemplateForm} handesearchbox={setSearching} />
        {data.length && data.length ? (
          <DataGrid
            autoHeight
            pagination
            rows={data}
            pageSize={pageSize}
            getRowId={row => row.templateId}
            disableSelectionOnClick
            columns={defaultColumns}
            checkboxSelection={false}
            rowsPerPageOptions={[7, 10, 25, 50]}
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
                  Add Template
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
    </>

  )
}

export default TemplateDashboard
