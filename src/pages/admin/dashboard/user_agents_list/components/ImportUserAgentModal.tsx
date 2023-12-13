import React, { useState, useRef } from 'react'
import {
  Button,
  Modal,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import { IconX } from '@tabler/icons'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import ImportUsrAgentAvatar from 'src/assets/Images/addUserAgent.png'
import { CSVLink } from 'react-csv';
import { API_PATHS } from 'src/config/api.config'
import axios from 'axios'
import { toast } from 'react-toastify'
import OrganisationContext from 'src/context/OrganisationProvider'
import CircularProgress from '@mui/material/CircularProgress'


//const REACT_APP_SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

interface IImportUserAgentModalProps {
  open: boolean
  onClose: any
}

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

function ImportUserAgentModal(props: IImportUserAgentModalProps) {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const [role, setRole] = useState<any>(3)
  const [filePath, setFilePath] = useState<any>()
  const [openImportUserAgentErrorModal, setOpenImportUserAgentErrorModal] = useState<boolean>(false)
  const toggleImportUserAgentErrorModal = (): void => { setOpenImportUserAgentErrorModal(prev => !prev) }
  const [showError, setShowError] = useState<any>()
  const csvLinkRef = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data
  const { createUserAgentList, setCreateUserAgentList, setLoading, loading, datafeedfileName, setdatafeedFileName } = React.useContext<any>(OrganisationContext)

  const changeHandler = (event: any) => {
    setdatafeedFileName(event.target.files[0].name)
    setFilePath(event.target.files[0])
  }

  const [csvData, setcsvData] = useState('')
  const downloadTemplate = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/sheet/sample`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
      const response = await axios.get(url.toString(), {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        },
      })
      if (response) {
        const newStr = response.data.replaceAll('"', '');
        setcsvData(newStr)
        csvLinkRef?.current?.link.click();
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  const handleRoleChange = (e: any) => {
    setRole(e.target.value)
  }

  const handleGetUserAndAgent = async () => {
    setLoading(true)
    const file = filePath
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/upload`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    const formData = new FormData()
    formData.append('role', role)
    formData.append('dataFile', file)
    axios({
      method: 'post',
      url: url.toString(),
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false)
          toast.success(response.data.message)
          props.onClose()
          setCreateUserAgentList(!createUserAgentList)

        }
      })
      .catch(function (error) {
        if (error.response.data.status === 500) {
          setLoading(false)
          props.onClose()
          toast.error(error.response.data.message)
        }
        else {
          setLoading(false)
          props.onClose()
          setOpenImportUserAgentErrorModal(true)
          setShowError(error.response.data.payload.error)
          toast.error(error.response.data.message)
        }

      })
  }

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
        className='import-user-agent-modal'
      >
        <Box sx={{ overflowY: 'scroll' }}>
          <Card
            sx={{
              width: 500,
              position: 'fixed',
              left: 'calc(50% - 300px)',
            
            }}
          >
             <IconButton
              sx={{
                position: 'absolute',
                top: '10px',
                left: '90%',
                zIndex: 500
              }}
              onClick={props.onClose}
            >
              <IconX />
            </IconButton>

            <CardContent sx={{ pt: 10, pl: 10, pr: 10, mb: 10 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <img src={ImportUsrAgentAvatar} alt="import-user-agent" style={{ height: 150, width: 150 }} />
                <Box sx={{ m: 5 }}>
                  <Typography variant='h5'>Import User and Agent</Typography>
                </Box>
              </Box>
              <Grid container spacing={5} alignItems='center' justifyContent='center' direction='column'>
                <Grid item xs={12}>
                  <CSVLink
                    data={csvData}
                    ref={csvLinkRef}
                    filename='Import User & Agent template.csv'
                  >
                  </CSVLink>
                  <Button
                    onClick={downloadTemplate}
                    sx={{ textTransform: 'capitalizes' }}
                  >
                    Download Template
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <RadioGroup
                      row
                      name='role'
                      defaultValue='3'
                      value={role}
                      onChange={(e) => handleRoleChange(e)}
                    >
                      <FormControlLabel value='4' control={<Radio />} label='User' />
                      <FormControlLabel value='3' control={<Radio />} label='Agent' />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    {...getRootProps()}
                    sx={{
                      backgroundColor: theme => theme.palette.primary.light,
                      height: '100px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexFlow: 'column nowrap',
                      fontSize: '24px',
                      color: '#555555',
                      border: '2px #c3c3c3 dashed',
                      borderRadius: '12px'
                    }}
                  >
                    <input  {...getInputProps()} type="file"
                      name="file"
                      accept=".csv" onChange={changeHandler} />
                    {isDragActive ? (
                      <Typography>Drop the files here ...</Typography>
                    ) : (
                      <Typography>Drag 'n' drop some files here, or click to select files</Typography>
                    )}
                  </Box>

                </Grid>
                <span> {datafeedfileName && datafeedfileName}</span>
                {/* <p>{filePath}</p> */}
                <Grid item xs={12}>
                  <Button variant='contained' size='large' sx={{ textTransform: 'capitalize' }} onClick={handleGetUserAndAgent} >
                    {loading ? <CircularProgress color='inherit' size='4vh' /> : 'Import'}
                  </Button>
                </Grid>

              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Modal>
      <Modal
        open={openImportUserAgentErrorModal}
        onClose={toggleImportUserAgentErrorModal}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
        className='import-user-agent-modal'

      >
        <Box sx={{
          maxWidth: 500, display: 'flex', flexDirection: 'column'
        }}>
          <Card

       /*      sx={{
              width: 500,
              position: 'fixed',
              zIndex: 100,
              overflowY: 'auto',
              maxHeight: '100%'
            }} */
            className="errordatafeedmodal"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '10px',
                left: '90%',
                zIndex: 500
              }}
            >
              <IconButton onClick={toggleImportUserAgentErrorModal}>
                <IconX />
              </IconButton>
            </Box>

            <CardContent sx={{
              pt: 10, pl: 10, pr: 10, mb: 10,
              border: '1px solid red', background: '#e7b7b7'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left', flexDirection: 'column' , maxHeight: "450px",
              overflowY: "auto" }}>
                <Box sx={{ m: 5 }}>
                  <Typography sx={{
                    fontFamily: 'Mazzard-regular', fontWeight: 600, mb: '5px', fontSize: { sm: '14px', xs: '14px', md: '16px' }
                  }} dangerouslySetInnerHTML={{ __html: showError }}></Typography>
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  )
}

export default ImportUserAgentModal
