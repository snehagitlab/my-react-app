// ** React Imports,useCallback
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Tooltip from '@mui/material/Tooltip'
import OutlinedInput from '@mui/material/OutlinedInput'
import LoadingButton from '@mui/lab/LoadingButton'

//import axios
import axios from 'axios'

// ** Icons Imports
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'

import { useFormik } from 'formik'

//import loader compoennt
import TicketContext from 'src/context/TicketProvider'

//import toasitfy
import { toast } from 'react-toastify'

//import images
import Scrolling from '../../../assets/Images/user_Icons/light/scrolling.svg'
import LeftArrow from '../../../assets/Images/user_Icons/light/LeftArrow.png'

//file uplaod images
import file_icon from '../../../assets/Images/user_Icons/light/file_icon.png'
import Pdf_img from '../../../assets/Images/user_Icons/light/pdf_img.png'
import view_img from '../../../assets/Images/user_Icons/light/view_img.png'
import delete_img from '../../../assets/Images/user_Icons/light/delete_img.png'
import upload_img from '../../../assets/Images/user_Icons/light/upload_img.png'

//import config file
import { TICKET_PRIORITY, TICKET_STATUS, FILE_TYPE, API_PATHS,TICKET_PROBLEM_TYPE } from 'src/config/api.config'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import * as yup from 'yup'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { nameval, numberval } from 'src/pages/util/validationall'
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Close from 'mdi-material-ui/Close'

// import file upload type
const fileType: any = parseInt(FILE_TYPE.TICKET_ATTACHMENT)

//image before url
const imagePath = 'https://storage.googleapis.com/'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC
const API_VERSION = process.env.REACT_APP_API_VERSION

const CreateTicket = () => {
  const {
    editoffenceticketrefresh,
    seteditoffenceticketrefresh,
    setCreateTicketResponse,
    setLoading,
    loading,
    handleoffenceSliderClose,
    offenceTicketsStyle,
    getSupportTicketId,
    refreshSupportTicket
  } = React.useContext<any>(TicketContext)
  const [assignlist, setAssignlist] = useState<Array<any>>([])
  const [description, setDescription] = useState(EditorState.createEmpty())
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  }, [])

  //import file upload state
  const [filterData, setFilterData] = React.useState<any>([])
  const [imgPath, setImagePath] = React.useState<any>([])
  const [viewImg, setviewImg] = React.useState<any>(false)
  const [imgUrlpopup, setImgUrlPopup] = React.useState<any>()
  const [previewImage, setPreviewImage] = useState<any>([])
  const [previewImgDisplay, setPreviewImgDisplay] = useState<any>([])

  //edit image state
  const [filterData1, setFilterData1] = React.useState<any>([])
  const [imgPath1, setImagePath1] = React.useState<any>([])

  const handleGeteditFile = async (e: any) => {
    const imgData1: any = Array.from(e.target.files)
    const array1: any = []
    const base64Img1: any = []
    const  FileExtemsion = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx','txt', 'csv']
    for (const file of imgData1) {
      if (FileExtemsion.includes(file.name.split('.').pop().toLowerCase()))
      {
    
        array1.push(file)
        const reader = new FileReader()
        reader.onload = function (e: any) {
          base64Img1.push(e.target.result)

          setImagePath1([...imgPath1, ...base64Img1])
        }
        reader.readAsDataURL(file)
      } else {
        toast.error(`This ${file.name.split('.').pop()} can't support`)
      }
    }
    setFilterData1(Array.from(e.target.files))
    setFilterData1([...filterData1, ...array1])
  }


  const schema = yup.object().shape({
    title: nameval,
    to: numberval,
    priority: numberval
  })
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      to: '',
      status: '1',
      priority: '2',
      type: '2',
      categoryId: '1',
      dueDate: '',
      attachment: '',
      tickettype: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      {
        getSupportTicketId > 0 ? updateSupportTicket() : handleCreateTicket()
      }
    }
  })

  //onChnage file upload function
  const handleGetFile = async (e: any) => {
    const imgData: any = Array.from(e.target.files)
    const array: any = []
    const base64Img: any = []
   const  FileExtemsion = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx','txt', 'csv']
    for (const file of imgData) {
      if (FileExtemsion.includes(file.name.split('.').pop().toLowerCase()))
      {
        array.push(file)
        const reader = new FileReader()
        reader.onload = function (e: any) {
          base64Img.push(e.target.result)
          setImagePath([...imgPath, ...base64Img])
        }
        reader.readAsDataURL(file)
      } else {
        toast.error(`This ${file.name.split('.').pop()} can't support`)
      }
    }
    setFilterData(Array.from(e.target.files))
    setFilterData([...filterData, ...array])
  }

  const openViewImgModal = (imgUrl: any) => {
    setImgUrlPopup(imgUrl)
    setviewImg(true)
  }

  const openPreviewImgModal = (prevImgUrl: any) => {
    setPreviewImgDisplay(`${imagePath}${prevImgUrl}`)
    setviewImg(true)
  }

  const handleViewImgClose = () => {
    setviewImg(false)
    setImgUrlPopup('')
  }

  //create time remove item
  const handleClick = (id: any) => {
    setImagePath(imgPath.filter((_: any, i: any) => i !== id))
    setFilterData(filterData.filter((_: any, i: any) => i !== id))
  }

  //edit time remove image
  const handleEditImgClick = (id: any) => {
    setImagePath1(imgPath1.filter((_: any, i: any) => i !== id))
    setFilterData1(filterData1.filter((_: any, i: any) => i !== id))
  }

  const handleDeleteEditImg = (id: any) => {
    setPreviewImage(previewImage.filter((_: any, i: any) => i !== id))
  }

  //fetch all agent list
  const fetchAllAsignee = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/pick/list/?pageNumber=1&sortBy=email&sortOrder=ASC&search={"roleId":[2,3]}&showAll=true`)
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
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

  const convertDescription = draftToHtml(convertToRaw(description.getCurrentContent()))
  const handleCreateTicket = async () => {
    //file uploading apin calling

    setLoading(true)

    const array: any = []
    if (filterData.length > 0) {
      const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
      const formData = new FormData()

      for (let i = 0; i < filterData.length; i++) {
        formData.append('file', filterData[i])
      }

      formData.append('type', fileType)
      try {
        const response = await axios.post(`${BASE_URL_PUBLIC}/v1/file`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${UserData.token}`
          }
        })
        if (response.status === 200) {
          setImagePath([])
          setLoading(false)
          setFilterData([])
          const Imgdata = response.data.payload.filesPath
          if (Imgdata) {
            for (let i = 0; i < Imgdata.length; i++) {
              array.push(Imgdata[i]['filePath'])
            }
          }
        } else {
          setLoading(false)

        }
      } catch (error: any) {
        toast.error(error.response.data.message)
        setImagePath([])
        setFilterData([])
        setLoading(false)

      }
    }

    setLoading(true)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}`)
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const requestData = {}
    Object.assign(requestData, { title: formik.values.title })
    Object.assign(requestData, { description: convertDescription })
    Object.assign(requestData, { to: formik.values.to })
    Object.assign(requestData, { status: parseInt(formik.values.status) })
    Object.assign(requestData, { priority: parseInt(formik.values.priority) })
    Object.assign(requestData, { type: parseInt(formik.values.type) })
    Object.assign(requestData, { categoryId: 1 })
    if (array.length > 0) {
      Object.assign(requestData, { attachment: array && JSON.stringify(array) })
    }

    console.log(requestData)
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
        setImagePath([])
        setFilterData([])
        setLoading(false)
        toast.success('Ticket created successfully')
        setCreateTicketResponse(result)
        setDescription(EditorState.createEmpty())
        formik.resetForm()
        handleoffenceSliderClose()
      } else {
        toast.error(result.message)
        setLoading(false)
      }
    } catch (ex) {
      console.log(ex)
      setLoading(false)

    }
  }

  useEffect(() => {
    fetchAllAsignee()
  }, [])

  const handleResetForm = () => {
    formik.resetForm()
    setDescription(EditorState.createEmpty())
    setImagePath1([])
    setFilterData1([])
    setImagePath([])
    setFilterData([])
  }

  const getSupportDetails = async (getSupportTicketId: any) => {
    if (getSupportTicketId > 0) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/detail?ticketId=${getSupportTicketId}`)
      const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        })
        const result = await response.json()
        if (result.status == 200) {
          const description = result.payload.description
          const contentBlock = convertFromHTML(description)
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap)
          const description1 = EditorState.createWithContent(contentState)
          setDescription(description1)
          formik.setFieldValue('title', result.payload.title)
          formik.setFieldValue('priority', result.payload.priority)
          formik.setFieldValue('status', result.payload.status)
          formik.setFieldValue('to', result.payload.toUser.userId)
          formik.setFieldValue('categoryId', result.payload.category.categoryId)
          formik.setFieldValue('type', result.payload.type)
          setPreviewImage(JSON.parse(result.payload.attachment))
         
        } else {
          //navigate(-1)
        }
      } catch (ex: any) { }
    }
  }

  const updateSupportTicket = async () => {
    setLoading(true)

    // update time file api calling
    const array1: any = []

    if (filterData1.length > 0) {
      const formData = new FormData()

      for (let i = 0; i < filterData1.length; i++) {
        formData.append('file', filterData1[i])
      }
      formData.append('type', fileType)
      try {
        const response = await axios.post(`${BASE_URL_PUBLIC}/v1/file`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
        if (response.status === 200) {
          const Imgdata1 = response.data.payload.filesPath
          if (Imgdata1) {
            for (let i = 0; i < Imgdata1.length; i++) {
              array1.push(Imgdata1[i]['filePath'])
            }

           /*  if (previewImage == null) {
              setPreviewImage(array1)
            } else {

              setPreviewImage([...previewImage, ...array1])
            } */

            // console.log(finalImg)
            // setPreviewImage(finalImg)
          }
        } else {
          setLoading(false)
        }
      } catch (error: any) {
        setLoading(false)

        toast.error(error.response.data.message)
        setImagePath1([])
        setFilterData1([])
      }
    }


    setLoading(true)

    // finally update api calling
    const convertDescription = draftToHtml(convertToRaw(description.getCurrentContent()))
    const requestData = {}
    Object.assign(requestData, { ticketId: getSupportTicketId })
    Object.assign(requestData, { title: formik.values.title })
    Object.assign(requestData, { description: convertDescription })
    Object.assign(requestData, { to: formik.values.to })
    Object.assign(requestData, { status: parseInt(formik.values.status) })
    Object.assign(requestData, { priority: parseInt(formik.values.priority) })
    Object.assign(requestData, { type:  parseInt(formik.values.type) })
    if (previewImage == null) {
      Object.assign(requestData, { attachment: JSON.stringify(array1) })
    } else {
      Object.assign(requestData, {
        attachment: [...previewImage, ...array1] && JSON.stringify([...previewImage, ...array1])
      })
    }

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}`)
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')

    try {
      const response = await fetch(url.toString(), {
        method: 'PUT',
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
        setLoading(false)
        seteditoffenceticketrefresh(!editoffenceticketrefresh)
        setCreateTicketResponse(result)
        setDescription(EditorState.createEmpty())
        formik.resetForm()
        handleoffenceSliderClose()
        setImagePath1([])
        setFilterData1([])
        setImagePath([])
        setFilterData([])
        setPreviewImage([])

      } else {
        setLoading(false)

        toast.error(result.message)
      }
    } catch (ex) {
      setLoading(false)

      console.log(ex)
    }
  }

  useEffect(() => {
    getSupportDetails(getSupportTicketId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSupportTicketId])

  useEffect(() => {
    refreshSupportInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSupportTicket])


  const refreshSupportInfo = () => {
    formik.resetForm()
    setDescription(EditorState.createEmpty())
    setImagePath1([])
    setFilterData1([])
    setImagePath([])
    setFilterData([])
    setPreviewImage([])
  }


  return (
    <>
      <Box className='pendingTickets' sx={offenceTicketsStyle}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{ width: '22%', display: { xs: 'none', sm: 'none', md: 'block' } }}
            onClick={() => { handleoffenceSliderClose(), setPreviewImage([]) }}
          ></Box>
          <Box
            sx={{
              width: { xs: '100%', sm: '100%', md: '78%' },
              boxShadow: '0 0 60px lightgrey',
              background: '#f6f8f9',
              position: 'relative'
            }}
          >
            {width > 899 ? (
              <>
                <IconButton
                  size='small'
                  onClick={() => {
                    handleoffenceSliderClose(), setImagePath1([]),
                      setFilterData1([]),
                      setPreviewImage([]),
                      setImagePath([]),
                      setFilterData([])
                  }}
                  sx={{
                    color: 'text.secondary',
                    position: 'absolute',
                    left: { xs: '0px', sm: '0px', md: '-25px' },
                    top: '15px'
                  }}
                >
                  <img src={Scrolling} alt='rightArrow' style={{ width: '41px', height: '41px', marginTop: '3px' }} />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size='small'
                  onClick={() => {
                    handleoffenceSliderClose(), setImagePath1([]),
                      setFilterData1([]),
                      setPreviewImage([]),
                      setImagePath([]),
                      setFilterData([])
                  }}
                  sx={{
                    color: 'text.secondary',
                    position: 'absolute',
                    left: { xs: '0px', sm: '0px', md: '-25px' },
                    top: '15px'
                  }}
                >
                  <img src={LeftArrow} alt='rightArrow' style={{ width: '41px', height: '41px', marginTop: '3px' }} />
                </IconButton>
              </>
            )}
            <Grid
              
              container
              alignItems={'center'}
              justifyContent={'space-evenly'}
              sx={{
                background: 'white',
                borderBottom: '1px solid lightgray'
              }}
            ></Grid>
            <Grid
              container
              alignItems={'center'}
              justifyContent={'space-evenly'}
              sx={{
                background: 'white',
                borderBottom: '1px solid lightgray'
              }}
            >
              <Grid item md={12} sx={{ textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    padding: '24px 60px',
                    color: 'rgba(42, 58, 81, 0.87)',
                    textTransform: 'capitalize',
                    fontWeight: '600',
                    fontSize: '24px'
                  }}
                >
                  Create ticket
                </Typography>
              </Grid>
            </Grid>

            <form
              onSubmit={formik.handleSubmit}
              style={{
                width: '100%',
                justifyContent: 'space-evenly',
                display: 'flex',
                height: 'calc(100vh - 84px)',
                overflowY: 'auto',
                paddingTop: '20px',
                background: '#ffffff'
              }}
            >
              <Grid
                container
                spacing={6}
                sx={{ width: { xs: '90%', sm: '90%', md: '70%' }, alignItems: 'center', justifyContent: 'center' , paddingBottom: '20px' }}
              >
                <Grid item sm={8}>
                  <RadioGroup row name='type' value={formik.values.type} onChange={formik.handleChange}>
                    <FormControlLabel value={parseInt(TICKET_PROBLEM_TYPE.INCIDENT)} control={<Radio size='small' />} label='Is this incident?' />
                    <FormControlLabel value={parseInt(TICKET_PROBLEM_TYPE.PROBLEM)} control={<Radio size='small' />} label='Is this problem?' />
                    <FormControlLabel value={parseInt(TICKET_PROBLEM_TYPE.REQUEST)}  control={<Radio size='small' />} label='Service Request' />
                  </RadioGroup>
                </Grid>
                <Grid item sm={4}>
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
                    <InputLabel id='status-select'>Status*</InputLabel>
                    <Select
                      id='status'
                      name='status'
                      labelId='status-select'
                      label='Status'
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.status && formik.touched.status)}
                    >
                      <MenuItem value={parseInt(TICKET_STATUS.OPEN)}>Open</MenuItem>
                      <MenuItem value={parseInt(TICKET_STATUS.PENDING)}>Pending</MenuItem>
                      <MenuItem value={parseInt(TICKET_STATUS.CLOSED)}>Closed</MenuItem>
                      <MenuItem value={parseInt(TICKET_STATUS.WAITING_ON_CUSTOMER)}>Waiting On Customer</MenuItem>
                      <MenuItem value={parseInt(TICKET_STATUS.WAITING_ON_THIRD_PARTY)}>Waiting On Third Party</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
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
                  <ReactDraftWysiwyg
                    editorState={description}
                    onEditorStateChange={(data: any) => setDescription(data)}
                    toolbar={{
                      options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'link'],
                      inline: { inDropdown: true },
                      list: { inDropdown: true },
                      textAlign: { inDropdown: true },
                      link: { inDropdown: true },
                      history: { inDropdown: true }
                    }}
                    editorStyle={{
                      border: '0.01px solid #e0e0e0',
                      marginTop: '-5px',
                      height: '100px',
                      background: '#ffffff',
                      color: 'black',
                      paddingLeft: '20px',
                      paddingRight: '20px'
                    }}
                    placeholder = 'Description'
                  />
                </Grid>
                {/* <Grid item xs={12}>
                    <Box
                    {...getRootProps()}
                    sx={{
                      backgroundColor: theme => theme.palette.primary.light,
                      height: '90px',
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
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
                    <InputLabel id='status-select'>Assignee*</InputLabel>
                    <Select
                      fullWidth
                      labelId='status-select'
                      label='Assigned'
                      name='to'
                      id='to'
                      value={formik.values.to}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.to && formik.touched.to)}
                    >
                      {assignlist.map(a => {
                        return (
                          <MenuItem value={a.userId} key={a.userId} sx={{ textTransform: 'capitalize' }}>
                            {a.fname} {a.lname}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ background: '#ffffff' }}>
                    <InputLabel id='status-select'>Priority*</InputLabel>
                    <Select
                      fullWidth
                      labelId='status-select'
                      label='Priority'
                      name='priority'
                      id='priority'
                      value={formik.values.priority}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.priority && formik.touched.priority)}
                    >
                      <MenuItem value={parseInt(TICKET_PRIORITY.URGENT)}>Urgent</MenuItem>
                      <MenuItem value={parseInt(TICKET_PRIORITY.HIGH)}>High</MenuItem>
                      <MenuItem value={parseInt(TICKET_PRIORITY.MEDIUM)}>Medium</MenuItem>
                      <MenuItem value={parseInt(TICKET_PRIORITY.LOW)}>Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* file uploading grid */}
                <Grid xs={12} md={12} sx={{ marginLeft: '25px' }}>
                  <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Grid>
                      <Grid sx={{ width: '100%', height: 'auto', padding: '20px 0px 10px' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: "end" }}>
                          {imgPath &&
                            imgPath.length > 0 &&
                            imgPath.map((item: any, index: any) => {
                              const type = item.split(';')[0].split(':')[1]

                              return (
                                <>
                                  <Box
                                    key={index}
                                    sx={{
                                      backgroundColor: '#ffffff',
                                      border: '1px solid lightgray',
                                      borderRadius: '2px',
                                      width: '95px',
                                      height: '90px',
                                      padding: '10px',
                                      margin: '0px 6px 15px 0px',

                                      // position: 'relative',
                                      display: 'flex'
                                    }}
                                  >
                                    <Box
                                      key={index}
                                      sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      className='hoverImg'
                                    >
                                      {(type && type === 'image/png') || (type && type === 'image/jpeg') ? (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            <Tooltip title='view image' placement='top'>
                                              <img
                                                onClick={() => openViewImgModal(item)}
                                                src={view_img}
                                                alt='view-img'
                                                style={{ width: '20px', height: '20px' }}
                                              />
                                            </Tooltip>

                                            <Tooltip title='delete image' placement='top'>
                                              <img
                                                onClick={() => handleClick(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <img
                                            src={item}
                                            alt='img'
                                            style={{
                                              height: '74px',
                                              width: '74px',
                                              opacity: '0.8',
                                              background: '#ffffff'
                                            }}
                                          />
                                        </>
                                      ) : type && type === 'application/pdf' ? (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            {/* <img
                                                  onClick={() => openViewImgModal(item)}
                                                  src={view_img}
                                                  alt='rightArrow'
                                                  style={{ width: '20px', height: '20px' }}
                                                /> */}
                                            <Tooltip title='delete pdf' placement='top'>
                                              <img
                                                onClick={() => handleClick(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'primary.main', position: 'absolute' }}
                                          >
                                            Pdf file
                                          </Typography>
                                          <img
                                            alt='pdf-img'
                                            src={Pdf_img}
                                            style={{ height: '74px', width: '74px', opacity: '0.2' }}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            {/* <img
                                                  onClick={() => openViewImgModal(item)}
                                                  src={view_img}
                                                  alt='rightArrow'
                                                  style={{ width: '20px', height: '20px' }}
                                                /> */}

                                            <Tooltip title='delete file' placement='top'>
                                              <img
                                                onClick={() => handleClick(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'primary.main', position: 'absolute' }}
                                          >
                                            file
                                          </Typography>
                                          <img
                                            alt='file-icon'
                                            src={file_icon}
                                            style={{
                                              height: '74px',
                                              width: '74px',
                                              marginTop: '5px',
                                              opacity: '0.2'
                                            }}
                                          />
                                        </>
                                      )}
                                    </Box>
                                  </Box>
                                </>
                              )
                            })}

                          {/* api inside get image div */}
                          {previewImage &&
                            previewImage.map((item: any, index: any) => {
                              const type = item.split('.').pop()

                              return (
                                <>
                                  <Box
                                    key={index}
                                    sx={{
                                      backgroundColor: '#ffffff',
                                      border: '1px solid lightgray',
                                      borderRadius: '2px',
                                      width: '95px',
                                      height: '90px',
                                      padding: '10px',
                                      margin: '4px 3px',
                                      position: 'relative',
                                      display: 'flex'
                                    }}
                                  >
                                    <Box
                                      key={index}
                                      sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      className='hoverImg'
                                    >
                                      {(type && type === 'png') ||
                                        (type && type === 'jpeg') ||
                                        (type && type === 'jpg') ||
                                        (type && type === 'gif') ? (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            <Tooltip title='view image' placement='top'>
                                              <img
                                                onClick={() => openPreviewImgModal(item)}
                                                src={view_img}
                                                alt='view-img'
                                                style={{ width: '20px', height: '20px' }}
                                              />
                                            </Tooltip>

                                            <Tooltip title='delete image' placement='top'>
                                              <img
                                                onClick={() => handleDeleteEditImg(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <img
                                            src={`${imagePath}${item}`}
                                            alt='img'
                                            style={{
                                              height: '74px',
                                              width: '74px',
                                              opacity: '0.8',
                                              background: '#ffffff'
                                            }}
                                          />
                                        </>
                                      ) : type && type === 'pdf' ? (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            {/* <img
                                                  onClick={() => openViewImgModal(item)}
                                                  src={view_img}
                                                  alt='rightArrow'
                                                  style={{ width: '20px', height: '20px' }}
                                                /> */}
                                            <Tooltip title='delete pdf' placement='top'>
                                              <img
                                                onClick={() => handleDeleteEditImg(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'primary.main', position: 'absolute' }}
                                          >
                                            Pdf file
                                          </Typography>
                                          <img
                                            alt='pdf-img'
                                            src={Pdf_img}
                                            style={{ height: '74px', width: '74px', opacity: '0.2' }}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            {/* <img
                                                  onClick={() => openViewImgModal(item)}
                                                  src={view_img}
                                                  alt='rightArrow'
                                                  style={{ width: '20px', height: '20px' }}
                                                /> */}

                                            <Tooltip title='delete file' placement='top'>
                                              <img
                                                onClick={() => handleDeleteEditImg(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'primary.main', position: 'absolute' }}
                                          >
                                            file
                                          </Typography>
                                          <img
                                            alt='file-icon'
                                            src={file_icon}
                                            style={{
                                              height: '74px',
                                              width: '74px',
                                              marginTop: '5px',
                                              opacity: '0.2'
                                            }}
                                          />
                                        </>
                                      )}
                                    </Box>
                                  </Box>
                                </>
                              )
                            })}
                          {/* api inside get image div done */}

                          {/* image upload edit mode */}
                          {imgPath1 &&
                            imgPath1.length > 0 &&
                            imgPath1.map((item: any, index: any) => {
                              const type = item.split(';')[0].split(':')[1]

                              return (
                                <>
                                  <Box
                                    key={index}
                                    sx={{
                                      backgroundColor: '#ffffff',
                                      border: '1px solid lightgray',
                                      borderRadius: '2px',
                                      width: '95px',
                                      height: '90px',
                                      padding: '10px',
                                      margin: '5px 0px 5px 7px',
                                      position: 'relative',
                                      display: 'flex'
                                    }}
                                  >
                                    <Box
                                      key={index}
                                      sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      className='hoverImg'
                                    >
                                      {(type && type === 'image/png') || (type && type === 'image/jpeg') ? (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            <Tooltip title='view image' placement='top'>
                                              <img
                                                onClick={() => openViewImgModal(item)}
                                                src={view_img}
                                                alt='view-img'
                                                style={{ width: '20px', height: '20px' }}
                                              />
                                            </Tooltip>
                                            <Tooltip title='delete image' placement='top'>
                                              <img
                                                onClick={() => handleEditImgClick(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <img
                                            alt='img'
                                            src={item}
                                            style={{
                                              height: '74px',
                                              width: '74px',
                                              opacity: '0.8',
                                              background: '#ffffff'
                                            }}
                                          />
                                        </>
                                      ) : type && type === 'application/pdf' ? (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            {/* <img
                                                  onClick={() => openViewImgModal(item)}
                                                  src={view_img}
                                                  alt='rightArrow'
                                                  style={{ width: '20px', height: '20px' }}
                                                /> */}

                                            <Tooltip title='delete image' placement='top'>
                                              <img
                                                onClick={() => handleEditImgClick(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'primary.main', position: 'absolute' }}
                                          >
                                            Pdf file
                                          </Typography>
                                          <img
                                            alt='pdf-img'
                                            src={Pdf_img}
                                            style={{ height: '74px', width: '74px', opacity: '0.2' }}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <IconButton
                                            size='small'
                                            className='imageiconBox'
                                            sx={{
                                              color: 'text.secondary'
                                            }}
                                          >
                                            {/* <img
                                                  onClick={() => openViewImgModal(item)}
                                                  src={view_img}
                                                  alt='rightArrow'
                                                  style={{ width: '20px', height: '20px' }}
                                                /> */}

                                            <Tooltip title='delete image' placement='top'>
                                              <img
                                                onClick={() => handleEditImgClick(index)}
                                                src={delete_img}
                                                alt='delete-img'
                                                style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                          <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'primary.main', position: 'absolute' }}
                                          >
                                            file
                                          </Typography>
                                          <img
                                            alt='file-icon'
                                            src={file_icon}
                                            style={{
                                              height: '74px',
                                              width: '74px',
                                              marginTop: '5px',
                                              opacity: '0.2'
                                            }}
                                          />
                                        </>
                                      )}
                                    </Box>
                                  </Box>
                                </>
                              )
                            })}
                          {/* image edit mode upload using react js   */}

                          {/* api inside get image  div */}
                          {getSupportTicketId && getSupportTicketId > 0 ? (
                            <>
                              <Box
                                sx={{
                                  backgroundColor: '#d3d3d3b3',
                                  width: '90px',
                                  height: '90px',
                                  padding: '10px',
                                  margin: '5px 9px 5px 5px',
                                  position: 'relative',
                                  display: 'flex'
                                }}
                              >
                                <Button className='fileUpload-box btn'>
                                  <img src={upload_img} alt='edit-time' style={{ width: '20px', height: '20px' }} />
                                  <input
                                    type='file'
                                    id='upload-img'
                                    className='upload-btn-wrapper'
                                    multiple
                                    onChange={handleGeteditFile}
                                  />
                                </Button>
                              </Box>
                            </>
                          ) : (
                            <>
                              <Box
                                sx={{
                                  backgroundColor: '#d3d3d3b3',
                                  width: '90px',
                                  height: '90px',
                                  padding: '10px',
                                  margin: '0px 0px 15px 0px',
                                  position: 'relative',
                                  display: 'flex'                           
                                }}
                              >
                                <Button className='fileUpload-box btn'>

                                  {/* src={upload_img} */}
                                  <img src={upload_img} alt='create-time' style={{ width: '20px', height: '20px' }} />
                                  <input
                                    type='file'
                                    id='upload-img'
                                    className='upload-btn-wrapper'
                                    onChange={handleGetFile}
                                    multiple
                                  />
                                </Button>
                              </Box>
                            </>
                          )}
                          {/* api inside get image end div */}

                        </Box>
                      </Grid>
                    </Grid>


                  </Grid>
                </Grid>
                {/* end image upload grid */}


                <Grid item xs={6} md={12} sx={{ alignItem: 'center', justifyContent: 'center' }}>
                  <Box m={1} display='flex' justifyContent='center' alignItems='center' >
                    <Button
                      variant='outlined'
                      onClick={() => {
                        handleoffenceSliderClose(), handleResetForm()
                      }}
                      sx={{ textTransform: 'capitalize', border: '1px  solid #2D4ACD',marginBottom:'25px' }}
                      color='secondary'
                    >
                      Cancel
                    </Button>

                      {loading ? (
                           <>
                           <LoadingButton
                                 loading={loading}
                                 variant='contained'
                                 disabled
                                 sx={{
                                 textTransform: 'capitalize',
                                 marginLeft: '10px',
                                 color: 'white',marginBottom:'25px'
                                 }}
                             >
                               {getSupportTicketId > 0 ? 'Update' : 'Create'}
                             </LoadingButton> 
                         </>
                      ) :
                      (
                      <>
                      <Button type='submit' sx={{ marginLeft: '10px', textTransform: 'capitalize',marginBottom:'25px' }} variant='contained'>
                      {getSupportTicketId > 0 ? 'Update' : 'Create'}
                      </Button>
                      </>
                      )
                }
                    
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Box>

      {/* file display images */}
      <Dialog
        open={viewImg}
        onClose={handleViewImgClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
       
        <DialogTitle onClick={handleViewImgClose} id='alert-dialog-title'>
          <IconButton
            size='small'
            sx={{ position: 'absolute', right: '1rem', top: '0.3rem' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: '500px', width: '500px' }} className="image-preview">
          <img
            src={imgUrlpopup ? imgUrlpopup : previewImgDisplay}
            alt='img-popup'
            style={{ width: '100%', height: '100%' }}
          />
        </DialogContent>

        {/* <DialogActions>
          <Button onClick={handleViewImgClose}>Disagree</Button>
          <Button onClick={handleViewImgClose} autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  )
}

export default CreateTicket
