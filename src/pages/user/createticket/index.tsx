// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'

// ** Icons Imports
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

import FormControl from '@mui/material/FormControl'
import { useFormik } from 'formik'
import OutlinedInput from '@mui/material/OutlinedInput'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState } from 'draft-js'
import Box from '@mui/material/Box'

import { API_PATHS } from 'src/config/api.config'
import { toast } from 'react-toastify'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import CardContent from '@mui/material/CardContent'
import Modal from '@mui/material/Modal'
import { IconX } from '@tabler/icons'
import * as yup from 'yup'
import InputBase from '@mui/material/InputBase'
import InputAdornment from '@mui/material/InputAdornment'
import { IconSearch } from '@tabler/icons'
import { useNavigate as useRouter } from 'react-router-dom'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

interface ICreateTicketProps {
  open: boolean
  onClose: any
}
const OpenCreateTicketModal = (props: ICreateTicketProps) => {
  const router = useRouter()

  /* 
  
    onDrop = useCallback((acceptedFiles: any) => {
      
      console.log(acceptedFiles)
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    import { useDropzone } from 'react-dropzone'*/

  const [description, setDescription] = useState(EditorState.createEmpty())
  const [assignlist, setAssignlist] = useState<Array<any>>([])
  const [searchtext, setSearchtext] = useState()

  const schema = yup.object().shape({
    title: yup.string().min(3),
    description: yup.string().min(3),
    to: yup.number(),
    status: yup.number(),
    priority: yup.number(),
    categoryId: yup.number(),
    type: yup.number()
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      to: '',
      status: '',
      priority: '',
      type: '',
      categoryId: '',
      dueDate: '',
      attachment: '',
      tickettype: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      {
        handleCreateTicket()
      }
    }
  })

  const fetchAllAsignee = async () => {
    const url = new URL(
      `https://dev-api.gogtas.com/support/api/v1/user/?pageNumber=1&sortBy=email&sortOrder=ASC&search={"roleId":3,"fname":"sne"}&showAll=true`
    )

    // const user = JSON.parse(localStorage.getItem('user1Data') || '{}')

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlzQWN0aXZlIjp0cnVlLCJyb2xlIjpbMl0sIm9yZ0lkIjoxLCJpYXQiOjE2NTIxOTIxNzd9.TvkkpNZjCQkzATcStNTxG2OCs1IYe-yx1Z9RGy_9cTM`
        }
      })
      const result = await response.json()
      if (result.status == 200) {
        const data = result.payload.data
        setAssignlist(data)
      } else {
        console.log('something went wrong')
      }
    } catch (ex: any) { }
  }

  const atta = ['gogtasorgdata/public/80061651911740849.jpg']

  const handleCreateTicket = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}`)
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')

    const requestData = {}
    Object.assign(requestData, { title: formik.values.title })
    Object.assign(requestData, { description: JSON.stringify(description) })
    Object.assign(requestData, { to: formik.values.to })
    Object.assign(requestData, { status: parseInt(formik.values.status) })
    Object.assign(requestData, { priority: parseInt(formik.values.priority) })
    Object.assign(requestData, { type: parseInt(formik.values.categoryId) })
    Object.assign(requestData, { categoryId: 1 })
    Object.assign(requestData, { attachment: atta })
    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(requestData)
      })
      const result = await response.json()

      if (result.status == 200) {
        toast.success(result.message)
        formik.resetForm()
        props.onClose()
      } else {
        toast.error(result.message)
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  function handleSearchvalue(event: any) {
    alert(event.target.value)
    setSearchtext(event.target)
  }

  useEffect(() => {
    fetchAllAsignee()
  }, [])

  const toggleCancelAddOrganisation = () => router(-1)

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
        className='user-agent-modal'
      >
        <Box sx={{ overflowY: 'scroll' }}>
          <Card
            sx={{
              maxWidth: 500,
              position: 'fixed',
              left: 'calc(50% - 300px)'
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
            <CardContent sx={{ pt: 8, pl: 8, pr: 8, mb: 8 }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={6}>
                  <Grid item sm={4}>
                    <RadioGroup row name='categoryId' value={formik.values.categoryId} onChange={formik.handleChange}>
                      <FormControlLabel value='1' control={<Radio />} label='Is this incident?' />
                    </RadioGroup>
                  </Grid>

                  <Grid item sm={4}>
                    <RadioGroup row name='categoryId' value={formik.values.categoryId} onChange={formik.handleChange}>
                      <FormControlLabel value='2' control={<Radio />} label='Is this problem?' />
                    </RadioGroup>
                  </Grid>

                  <Grid item sm={4}>
                    <FormControl fullWidth>
                      <InputLabel id='status-select'>Status</InputLabel>
                      <Select
                        id='status'
                        name='status'
                        labelId='status-select'
                        label='Status'
                        value={formik.values.status}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value='1'>Open</MenuItem>
                        <MenuItem value='2'>Pending</MenuItem>
                        <MenuItem value='3'>Closed</MenuItem>
                        <MenuItem value='4'>Waiting On Custoer</MenuItem>
                        <MenuItem value='5'>Waiting On Third Party</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Title*</InputLabel>
                      <OutlinedInput
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label='Title'
                        name='title'
                        id='title'
                        error={Boolean(formik.errors.title && formik.touched.title)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <ReactDraftWysiwyg editorState={description} onEditorStateChange={data => setDescription(data)} />
                  </Grid>
                  {/*  <Grid item xs={12}>
                        <Box
                    {...getRootProps()}
                    sx={{
                      backgroundColor: theme => theme.palette.primary.light,
                      height: '200px',
                      padding: '50px',
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
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Attachment</p>
                    ) : (
                      <p>Attachment</p>
                    )}
                  </Box>
                </Grid> */}

                  <Grid item sm={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='status-select'>Assignee</InputLabel>
                      <Select
                        fullWidth
                        labelId='status-select'
                        label='Assigned to'
                        name='to'
                        id='to'
                        value={formik.values.to}
                        onChange={formik.handleChange}
                      >
                        <InputBase
                          size='small'
                          sx={{ p: 3, borderRadius: 2, background: '#F7F7F7 !important' }}
                          placeholder='Search'
                          name='search'
                          id='search'
                          value={searchtext}
                          onChange={e => handleSearchvalue(e)}
                          startAdornment={
                            <InputAdornment sx={{ mr: 5 }} position='start'>
                              <IconSearch />
                            </InputAdornment>
                          }
                        />

                        {assignlist.map(a => {
                          return (
                            <MenuItem value={a.userId} key={a.fname}>
                              {a.fname}
                              {a.lname}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='status-select'>Priority</InputLabel>
                      <Select
                        fullWidth
                        labelId='status-select'
                        label='Priority'
                        name='priority'
                        id='priority'
                        value={formik.values.priority}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value='1'>Urgent</MenuItem>
                        <MenuItem value='2'>High</MenuItem>
                        <MenuItem value='3'>Medium</MenuItem>
                        <MenuItem value='4'>Low</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={12}>
                    <Button
                      variant='outlined'
                      onClick={toggleCancelAddOrganisation}
                      sx={{ textTransform: 'capitalize', border: '1px  solid #2D4ACD', marginLeft: '80px' }}
                      color='secondary'
                    >
                      Cancel
                    </Button>

                    <Button
                      type='submit'
                      size='large'
                      sx={{ marginLeft: '10px', textTransform: 'capitalize' }}
                      variant='contained'
                    >
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Modal>
      {/* <ToastContainer autoClose={3000} position='bottom-right' /> */}
    </>
  )
}

export default OpenCreateTicketModal
