// ** MUI Imports
import { Grid, Box, IconButton, Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import TabContext from '@mui/lab/TabContext'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Divider from '@mui/material/Divider'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

//import images
import Scrolling from '../../../assets/Images/user_Icons/light/scrolling.svg'
import file_icon from '../../../assets/Images/user_Icons/light/file_icon.png'
import Pdf_img from '../../../assets/Images/user_Icons/light/pdf_img.png'
import view_img from '../../../assets/Images/user_Icons/light/view_img.png'
import delete_img from '../../../assets/Images/user_Icons/light/delete_img.png'
import upload_img from '../../../assets/Images/user_Icons/light/upload_img.png'



//image before url
const imagePath = 'https://storage.googleapis.com/'



//import axios
import axios from 'axios'

//config file
import { API_PATHS, FILE_TYPE } from 'src/config/api.config'

// ** React Imports
import React, { useState, useEffect, SyntheticEvent } from 'react'

//import toastify
import { toast } from 'react-toastify'

//import loader and another compoent
import CircularProgress from '@mui/material/CircularProgress'

/* import Addsuspect from 'src/pages/user/police/addSuspect'
import Addvictim from 'src/pages/user/police/addVictim' */

import Addproperty from 'src/pages/user/police/addProperty'
import Addwitness from 'src/pages/user/police/addWitness'
import TicketContext from 'src/context/TicketProvider'
import OrganisationContext from 'src/context/OrganisationProvider'

//formik valodation
import { useFormik } from 'formik'
import * as yup from 'yup'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { nameval, numberval, fieldwithspecl } from 'src/pages/util/validationall'



import { OFFENCE_TAB_TYPE } from 'src/config/api.config'

// file upload type get
const fileType: any = parseInt(FILE_TYPE.TICKET_ATTACHMENT)

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC
const API_VERSION = process.env.REACT_APP_API_VERSION

const Commonticket = () => {
  const [description, setDescription] = useState(EditorState.createEmpty())
  const [publicNarrative, setPublicNarrative] = useState(EditorState.createEmpty())
  const [assignlist, setAssignlist] = useState<Array<any>>([])
  const [reportdate, setReportDate] = useState<Date | null>(new Date())
  const [offencedate, setOffenceDate] = useState<Date | null>(new Date())
  const [caseNumber, setCaseNumber] = useState<number>()
  const [assigneId, setAssigneeId] = React.useState(0)

  //import file upload state
  const [filterData, setFilterData] = React.useState<any>([])
  const [imgPath, setImagePath] = React.useState<any>([])
  const [viewImg, setviewImg] = React.useState<any>(false);
  const [imgUrlpopup, setImgUrlPopup] = React.useState<any>()
  const [previewImage, setPreviewImage] = useState<any>([])
  const [previewImgDisplay, setPreviewImgDisplay] = useState<any>([])


  //edit image state
  const [filterData1, setFilterData1] = React.useState<any>([])
  const [imgPath1, setImagePath1] = React.useState<any>([])

  const {
    offenceTicketgetInfo,
    setCreateTicketResponse,
    getOffenceTicketId,
    setLoading,
    loading,
    handlecreateSliderClose,
    createTicketsStyle,
    setOffenceTabId,
    offenceTabNameActive,
    setOffenceTabNameActive,
    setOffenceTicketId
  } = React.useContext<any>(TicketContext)
  const {
    setaddvictimData,
    addvictimData,
    addwitnessData,
    setaddwitnessData,
    addsuspectData,
    setaddsuspectData,
    addpropertyData,
    setaddpropertyData,
    seteditoffenceticketrefresh,
    editoffenceticketrefresh
  } = React.useContext<any>(TicketContext)


  const [assignename, setAssignename] = useState<Array<any>>([])
  const fetchAssigneName = () => {
    assignlist.map((item: any) => {
      const last = item[Object.keys(item)[Object.keys(item).length - 1]]
      const first = item[Object.keys(item)[Object.keys(item).length - 2]]
      const fullname = { text: `${first + ' ' + last}`, value: `${first + ' ' + last}`, url: `${first + ' ' + last}` }
      setAssignename(assignlist => [...assignlist, fullname])
    })
  }

  const {
    victimcount,
    witnesscount,
    suspectcount,
    propertycount,
    setvictimCount,
    setwitnessCount,
    setsuspectCount,
    setpropertyCount
  } = React.useContext<any>(OrganisationContext)





  const schema = yup.object().shape({
    title: nameval,

    /* to: numberval, */
    priority: numberval,
    offence: fieldwithspecl,

    /* narrative: fieldwithspecl */
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      to: '',
      status: '1',
      priority: '2',
      type: '',
      dueDate: '',
      attachment: '',
      tickettype: '',
      offence: ''

      /*  narrative: '' */
    },
    validationSchema: schema,
    onSubmit: () => {
      {
        getOffenceTicketId && getOffenceTicketId > 0 ? handleUpdateOffenceTicket() : handleCreateTicket()
      }
    }
  })

  //fetch all agent
  const fetchAllAsignee = async () => {
    const caseno = Math.floor(Math.random() * 1000000) + 1
    setCaseNumber(caseno)
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.user}/pick/list/?pageNumber=1&sortBy=email&sortOrder=ASC&search={"roleId":[2,3]}&showAll=true`
    )
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
        const firstFolder = result.payload.data[0]
        if (firstFolder != undefined) {
          setAssigneeId(firstFolder.userId)
        }
        fetchAssigneName()
      } else {
        console.log('something went wrong')
      }
    } catch (ex: any) { }
  }

  const handleGeteditFile = async (e: any) => {
    const imgData1: any = Array.from(e.target.files)
    const array1: any = [];
    const base64Img1: any = []
    for (const file of imgData1) {
      if (file.name.split('.').pop() == "docx" || file.name.split('.').pop() == "png" || file.name.split('.').pop() == "jpeg" || file.name.split('.').pop() == "jpg" || file.name.split('.').pop() == "gif" || file.name.split('.').pop() == "xlsx" || file.name.split('.').pop() == "doc" || file.name.split('.').pop() == "pdf" || file.name.split('.').pop() == "txt" || file.name.split('.').pop() == "csv") {
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

  //onChnage file upload function
  const handleGetFile = async (e: any) => {
    const imgData: any = Array.from(e.target.files)
    const array: any = [];
    const base64Img: any = []
    for (const file of imgData) {
      if (file.name.split('.').pop() == "docx" || file.name.split('.').pop() == "png" || file.name.split('.').pop() == "jpeg" || file.name.split('.').pop() == "jpg" || file.name.split('.').pop() == "gif" || file.name.split('.').pop() == "xlsx" || file.name.split('.').pop() == "doc" || file.name.split('.').pop() == "pdf" || file.name.split('.').pop() == "txt" || file.name.split('.').pop() == "csv") {
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

  const handleViewImgClose = () => {
    setviewImg(false)
    setImgUrlPopup("")
  }

  //create time remove image
  const handleClick = (id: any) => {
    setImagePath(imgPath.filter((_: any, i: any) => i !== id))
    setFilterData(filterData.filter((_: any, i: any) => i !== id))
  }

  //edit time remove image
  const handleEditImgClick = (id: any) => {
    setImagePath1(imgPath1.filter((_: any, i: any) => i !== id))
    setFilterData1(filterData1.filter((_: any, i: any) => i !== id))
  }

  //create ticket api calling
  const handleCreateTicket = async () => {
    const array: any = []
    if (filterData.length > 0) {
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
          }
        })
        if (response.status === 200) {
          const Imgdata = response.data.payload.filesPath
          if (Imgdata) {
            for (let i = 0; i < Imgdata.length; i++) {
              array.push(Imgdata[i]['filePath'])
            }
          }
        } else {
          console.log(response)
        }
      }
      catch (error: any) {
        toast.error(error.response.data.message)
        setImagePath([])
        setFilterData([])
      }
    }



    // final submit api calling
    setLoading(true)
    const convertDescription = draftToHtml(convertToRaw(description.getCurrentContent()))
    const convertpublicNarrative = draftToHtml(convertToRaw(publicNarrative.getCurrentContent()))
    const defaultData = {}
    const caseinfo = {}
    Object.assign(defaultData, { title: formik.values.title })
    Object.assign(defaultData, { description: convertDescription })
    Object.assign(defaultData, { to: assigneId /* formik.values.to */ })
    Object.assign(defaultData, { status: parseInt(formik.values.status) })
    Object.assign(defaultData, { priority: parseInt(formik.values.priority) })
    Object.assign(defaultData, { type: 2 })
    Object.assign(defaultData, { categoryId: 2 })
    Object.assign(caseinfo, { casenumber: caseNumber })
    Object.assign(caseinfo, { offence: formik.values.offence })
    Object.assign(caseinfo, { narrative: convertpublicNarrative })
    Object.assign(caseinfo, { reportdate: reportdate })
    Object.assign(caseinfo, { offencedate: offencedate })
    if (array.length > 0) {
      Object.assign(defaultData, { attachment: JSON.stringify(array && array) })
    }


    const victimData = addvictimData
    const suspectData = addsuspectData //JSON.parse(localStorage.getItem('suspectData') || '{}')
    const propertyData = addpropertyData //JSON.parse(localStorage.getItem('propertyData') || '{}')
    const witnessData = addwitnessData //JSON.parse(localStorage.getItem('witnessData') || '{}')

    // const otherOffenceData = JSON.parse(localStorage.getItem('otherOffenceData') || '{}')

    const otherFields = {
      victimData: victimData,
      suspectData: suspectData,
      propertyData: propertyData,

      //otherOffenceData: otherOffenceData,
      witnessData: witnessData,
      caseInfo: caseinfo
    }
    Object.assign(defaultData, { otherFields: otherFields })
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}`)
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(defaultData)
      })
      const result = await response.json()

      if (result.status == 200) {
        setImagePath([])
        setFilterData([])
        setLoading(false)
        setDescription(EditorState.createEmpty())
        setPublicNarrative(EditorState.createEmpty())
        setReportDate(new Date())
        setOffenceDate(new Date())
        formik.resetForm()
        handlecreateSliderClose()
        toast.success('Ticket created successfully')
        setCreateTicketResponse(result)
        const no = Math.floor(Math.random() * 1000000) + 1
        setCaseNumber(no)
      } else {
        toast.error(result.message)
        setLoading(false)
      }
    } catch (ex) {
      console.log(ex)
    }
    formik.resetForm()
  }

  //get offence ticket Details
  const handleGetOffenceDetails = async (getOffenceTicketId: any) => {
    if (getOffenceTicketId > 0) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/detail?ticketId=${getOffenceTicketId}`)
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
          setPreviewImage(JSON.parse(result.payload.attachment))
          const caseInfo = result.payload.pivotDetail.otherFields.caseInfo
          const victimData = result.payload.pivotDetail.otherFields.victimData
          const suspectData = result.payload.pivotDetail.otherFields.suspectData
          const witnessData = result.payload.pivotDetail.otherFields.witnessData
          const propertyData = result.payload.pivotDetail.otherFields.propertyData
          const title = result.payload.title
          const agentid = result.payload.toUser.userId

          //set Description to immutable format

          const description = result.payload.description
          const contentBlock = convertFromHTML(description)
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap)
          const description1 = EditorState.createWithContent(contentState)
          setDescription(description1)
          const narrative = caseInfo.narrative
          const contentBlock1 = convertFromHTML(narrative)
          const contentStatenarrative = ContentState.createFromBlockArray(contentBlock1.contentBlocks, contentBlock1.entityMap)
          const contentStatenarrative1 = EditorState.createWithContent(contentStatenarrative)
          setPublicNarrative(contentStatenarrative1)

          setCaseNumber(caseInfo.casenumber)
          formik.setFieldValue('title', title)
          formik.setFieldValue('offence', caseInfo.offence)
          formik.setFieldValue('to', agentid)

          setaddvictimData(victimData)
          setvictimCount(victimData.length)

          setaddsuspectData(suspectData)
          setsuspectCount(suspectData.length)

          setaddwitnessData(witnessData)
          setwitnessCount(witnessData.length)

          setaddpropertyData(propertyData)
          setpropertyCount(propertyData.length)
        } else {
          //navigate(-1)
        }
      } catch (ex: any) { }
    }
  }

  const openPreviewImgModal = (prevImgUrl: any) => {
    setPreviewImgDisplay(`${imagePath}${prevImgUrl}`)
    console.log('prevImgUrl', previewImgDisplay)
    setviewImg(true)
  }


  const handleUpdateOffenceTicket = async () => {

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
            Accept: 'application/json',
          }
        })
        if (response.status === 200) {
          const Imgdata1 = response.data.payload.filesPath
          if (Imgdata1) {
            for (let i = 0; i < Imgdata1.length; i++) {
              array1.push(Imgdata1[i]['filePath'])
            }

            // setPreviewImage([...previewImage, ...array1])
            if (previewImage == null) {
              setPreviewImage(array1)
            } else {
              setPreviewImage([...previewImage, ...array1])
            }
          }
        } else {
          console.log(response)
        }
      }
      catch (error: any) {
        toast.error(error.response.data.message)
        setImagePath1([])
        setFilterData1([])
      }
    }



    // finally update api calling 
    setLoading(true)
    const convertDescription = draftToHtml(convertToRaw(description.getCurrentContent()))
    const convertpublicNarrative = draftToHtml(convertToRaw(publicNarrative.getCurrentContent()))
    const defaultData = {}
    const caseinfo = {}
    Object.assign(defaultData, { ticketId: getOffenceTicketId })
    Object.assign(defaultData, { title: formik.values.title })
    Object.assign(defaultData, { description: convertDescription })
    Object.assign(defaultData, { to: assigneId /* formik.values.to */ })
    Object.assign(defaultData, { status: parseInt(formik.values.status) })
    Object.assign(defaultData, { priority: parseInt(formik.values.priority) })
    Object.assign(defaultData, { type: 2 })
    Object.assign(defaultData, { categoryId: 2 })
    Object.assign(caseinfo, { casenumber: caseNumber })
    Object.assign(caseinfo, { offence: formik.values.offence })
    Object.assign(caseinfo, { narrative: convertpublicNarrative })
    Object.assign(caseinfo, { reportdate: reportdate })
    Object.assign(caseinfo, { offencedate: offencedate })
    if (previewImage == null) {
      Object.assign(defaultData, { attachment: JSON.stringify(array1) })
    } else {
      Object.assign(defaultData, {
        attachment: [...previewImage, ...array1] && JSON.stringify([...previewImage, ...array1])
      })
    }


    const victimData = addvictimData //JSON.parse(localStorage.getItem('victimData') || '{}')
    const suspectData = addsuspectData //JSON.parse(localStorage.getItem('suspectData') || '{}')
    const propertyData = addpropertyData //JSON.parse(localStorage.getItem('propertyData') || '{}')
    const witnessData = addwitnessData //JSON.parse(localStorage.getItem('witnessData') || '{}')
    const otherFields = {
      victimData: victimData,
      suspectData: suspectData,
      propertyData: propertyData,
      witnessData: witnessData,
      caseInfo: caseinfo
    }
    Object.assign(defaultData, { otherFields: otherFields })
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
        body: JSON.stringify(defaultData)
      })
      const result = await response.json()

      if (result.status == 200) {
        setLoading(false)
        setOffenceTicketId(0)
        handleResetForm()
        seteditoffenceticketrefresh(!editoffenceticketrefresh)
        handlecreateSliderClose()
        toast.success(result.message)
        setCreateTicketResponse(result)
        const no = Math.floor(Math.random() * 1000000) + 1
        setCaseNumber(no)
      } else {
        toast.error(result.message)
        setLoading(false)
      }
    } catch (ex) {
      console.log(ex)
      setLoading(false)
    }


  }


  const handleTabsChange = (event: SyntheticEvent, newValue: string) => {
    setOffenceTabNameActive(newValue)
  }

  /* Without update get back */

  const refreshOffenceInfo = () => {
    formik.resetForm()
    setDescription(EditorState.createEmpty())
    setPublicNarrative(EditorState.createEmpty())
  }

  useEffect(() => {
    fetchAllAsignee()
    fetchAssigneName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [victimcount])

  useEffect(() => {
    fetchAssigneName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    handleGetOffenceDetails(getOffenceTicketId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOffenceTicketId])
  useEffect(() => {
    refreshOffenceInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offenceTicketgetInfo])

  const handleResetForm = () => {
    formik.resetForm()
    setDescription(EditorState.createEmpty())
  }


  //handle tab change
  const handlechangeTab = (e: any) => {
    setOffenceTabId(e)
  }

  const handleDeleteEditImg = (id: any) => {
    setPreviewImage(previewImage.filter((_: any, i: any) => i !== id))
  }

  return (
    <>
      <Box className='pendingTickets' sx={createTicketsStyle}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{ width: '22%', display: { xs: 'none', sm: 'none', md: 'block' } }}
            onClick={handlecreateSliderClose}
          ></Box>
          <Box
            sx={{
              width: { xs: '100%', sm: '100%', md: '78%' },
              boxShadow: '0 0 60px lightgrey',
              background: '#ffffff',
              position: 'relative'
            }}
          >
            <IconButton
              size='small'
              onClick={handlecreateSliderClose}
              sx={{
                color: 'text.secondary',
                position: 'absolute',
                left: { xs: '0px', sm: '0px', md: '-25px' },
                top: '15px'
              }}
            >
              <img src={Scrolling} alt='rightArrow' style={{ width: '41px', height: '41px', marginTop: '3px' }} />
            </IconButton>
            <Grid
              onClick={() => toast.info('this on progress task')}
              container
              alignItems={'center'}
              justifyContent={'space-evenly'}
              sx={{
                background: 'white',
                borderBottom: '1px solid lightgray'
              }}
            ></Grid>
            <Grid
              onClick={() => toast.info('this on progress task')}
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
                  offence ticket
                </Typography>
              </Grid>
            </Grid>
            <form onSubmit={formik.handleSubmit}>
              <Grid
                container
                alignItems={'center'}
                justifyContent={'space-evenly'}
                sx={{
                  background: '#ffffff',
                  borderBottom: '1px solid lightgray',
                  height: 'calc(100vh - 84px)',
                  overflowY: 'auto'
                }}
              >
                <Box sx={{ width: '80%' }}>
                  <Box sx={{ marginTop: '20px' }}>
                    <Grid container spacing={6}>
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
                          placeholder="Narrative"
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
                          mention={{
                            separator: ' ',
                            trigger: '@',
                            suggestions: assignename
                          }}
                          hashtag={{
                            separator: ' ',
                            trigger: '#'
                          }}
                        />
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
                      {/* <Grid item sm={12}>
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
                            <MenuItem value='1'>Open</MenuItem>
                            <MenuItem value='2'>Pending</MenuItem>
                            <MenuItem value='3'>Closed</MenuItem>
                            <MenuItem value='4'>Waiting On Custoer</MenuItem>
                            <MenuItem value='5'>Waiting On Third Party</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid> */}

                      <Grid item sm={12} xs={12} sx={{ display: 'none' }}>
                        <FormControl fullWidth sx={{ background: '#ffffff' }}>
                          {/*  <InputLabel id='status-select'>Assignee*</InputLabel> */}
                          <Select
                            fullWidth
                            labelId='status-select'
                            label='Assigned to'
                            name='to'
                            id='to'
                            value={assigneId}
                          >
                            {assignlist.map(a => {
                              return (
                                <MenuItem value={assigneId} key={a.fname} sx={{ textTransform: 'capitalize' }}>
                                  {a.fname} {a.lname}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      {/* <Grid item sm={6} xs={12}>
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
                            <MenuItem value='1'>Urgent</MenuItem>
                            <MenuItem value='2'>High</MenuItem>
                            <MenuItem value='3'>Medium</MenuItem>
                            <MenuItem value='4'>Low</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid> */}
                    </Grid>
                  </Box>

                  {/* //add file uploading */}
                  {/* <label htmlFor='contained-button-file'>
                    <Input accept='image/*' id='contained-button-file' multiple type='file' />
                    <Button
                      component='span'
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: '600',
                        width: '62vw',
                        p: '23px 5px',
                        borderRadius: '9px',
                        textTransform: 'capitalize',
                        backgroundColor: 'rgba(224, 228, 248, 0.61)',
                        border: ' 0.77013px dashed rgba(45, 74, 205, 0.29)',
                        fontSize: '19px',
                        color: '#2A3A51',
                        marginBottom: '16px',
                        justifyContent: 'center',
                        marginLeft: '2px',
                        marginTop: '22px'
                      }}
                    >
                      <img
                        src={FileUpload}
                        alt='file upload'
                        style={{ width: '26px', height: '26px', marginRight: '10px' }}
                      />{' '}
                      Upload Files/Documents
                    </Button>
                  </label> */}

                  {/* file uplaoding */}
                  <Grid item xs={12} sx={{ marginTop: '20px' }}>
                    <Grid sx={{ display: "flex" }} >

                      <Grid>
                        {imgPath.length > 0 && (
                          <Grid sx={{ width: '100%', height: '100px', padding: '10px 0px' }}>
                            <Box sx={{ display: 'flex' }}>
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
                                          border: "1px solid lightgray",
                                          borderRadius: "2px",
                                          width: '95px',
                                          height: '90px',
                                          padding: "10px",
                                          marginRight: '10px',
                                          position: 'relative',
                                          display: "flex"
                                        }}
                                      >
                                        <Box key={index} sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }} className="hoverImg">
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
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <img alt="img" src={item} style={{ height: '74px', width: '74px', opacity: "0.8", background: "#ffffff" }} />
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
                                                    onClick={() => handleClick(index)}
                                                    src={delete_img}
                                                    alt='delete-img'
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <Typography variant='body2' sx={{ fontSize: '14px', color: 'primary.main', position: "absolute" }}>Pdf file</Typography>
                                              <img
                                                alt="pdf-img"
                                                src={Pdf_img}
                                                style={{ height: '74px', width: '74px', opacity: "0.2" }}
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
                                                    onClick={() => handleClick(index)}
                                                    src={delete_img}
                                                    alt='delete-img'
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <Typography variant='body2' sx={{ fontSize: '14px', color: 'primary.main', position: "absolute" }}>file</Typography>
                                              <img
                                                alt="file-icon"
                                                src={file_icon}
                                                style={{ height: '74px', width: '74px', marginTop: '5px', opacity: "0.2" }}
                                              />
                                            </>
                                          )}
                                        </Box>
                                      </Box>
                                    </>
                                  )
                                })}
                            </Box>
                          </Grid>
                        )
                        }
                      </Grid>

                      {/* image edited working */}

                      <Grid sx={{ display: 'flex' }} >
                        {previewImage && (
                          <Grid sx={{ width: '100%', height: '100px', padding: '10px 0px' }} >
                            <Box sx={{ display: 'flex' }}>
                              {previewImage &&
                                previewImage.map((item: any, index: any) => {
                                  const type = item.split('.').pop()

                                  return (
                                    <>
                                      <Box
                                        key={index}
                                        sx={{
                                          backgroundColor: '#ffffff',
                                          border: "1px solid lightgray",
                                          borderRadius: "2px",
                                          width: '95px',
                                          height: '90px',
                                          padding: "10px",
                                          marginRight: '10px',
                                          position: 'relative',
                                          display: "flex"
                                        }}
                                      >
                                        <Box key={index} sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }} className="hoverImg">
                                          {(type && type === 'png') || (type && type === 'jpeg') || (type && type === 'jpg') || (type && type === 'gif') ? (
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
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <img src={`${imagePath}${item}`} alt="img" style={{ height: '74px', width: '74px', opacity: "0.8", background: "#ffffff" }} />
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
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <Typography variant='body2' sx={{ fontSize: '14px', color: 'primary.main', position: "absolute" }}>Pdf file</Typography>
                                              <img
                                                alt="pdf-img"
                                                src={Pdf_img}
                                                style={{ height: '74px', width: '74px', opacity: "0.2" }}
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
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <Typography variant='body2' sx={{ fontSize: '14px', color: 'primary.main', position: "absolute" }}>file</Typography>
                                              <img
                                                alt="file-icon"
                                                src={file_icon}
                                                style={{ height: '74px', width: '74px', marginTop: '5px', opacity: "0.2" }}
                                              />
                                            </>
                                          )}
                                        </Box>
                                      </Box>
                                    </>
                                  )
                                })}
                            </Box>
                          </Grid>
                        )
                        }
                        {imgPath1.length > 0 && (
                          <Grid sx={{ width: '100%', height: '100px', padding: '10px 0px' }}>
                            <Box sx={{ display: 'flex' }}>
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
                                          border: "1px solid lightgray",
                                          borderRadius: "2px",
                                          width: '95px',
                                          height: '90px',
                                          padding: "10px",
                                          marginRight: '10px',
                                          position: 'relative',
                                          display: "flex"
                                        }}
                                      >
                                        <Box key={index} sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }} className="hoverImg">
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
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <img alt="img" src={item} style={{ height: '74px', width: '74px', opacity: "0.8", background: "#ffffff" }} />
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
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <Typography variant='body2' sx={{ fontSize: '14px', color: 'primary.main', position: "absolute" }}>Pdf file</Typography>
                                              <img
                                                alt="pdf-img"
                                                src={Pdf_img}
                                                style={{ height: '74px', width: '74px', opacity: "0.2" }}
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
                                                    style={{ width: '20px', height: '20px', paddingLeft: "5px" }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                              <Typography variant='body2' sx={{ fontSize: '14px', color: 'primary.main', position: "absolute" }}>file</Typography>
                                              <img
                                                alt="file-icon"
                                                src={file_icon}
                                                style={{ height: '74px', width: '74px', marginTop: '5px', opacity: "0.2" }}
                                              />
                                            </>
                                          )}
                                        </Box>
                                      </Box>
                                    </>
                                  )
                                })}
                            </Box>
                          </Grid>
                        )
                        }
                      </Grid>
                      {/* end diplay documents */}

                      {getOffenceTicketId && getOffenceTicketId > 0 ? <>
                        <Box
                          sx={{
                            backgroundColor: '#d3d3d3b3',
                            width: '90px',
                            height: '90px',
                            padding: "10px",
                            marginTop: '10px',
                            position: 'relative',
                            display: "flex",
                          }}
                        >
                          <Button
                            className="fileUpload-box btn"
                          >
                            <img src={upload_img} alt='file_upload' style={{ width: '20px', height: '20px' }} />
                            <input type='file' id='upload-img' className="upload-btn-wrapper" multiple onChange={handleGeteditFile} />
                          </Button>
                        </Box>
                      </> :
                        <>
                          <Box
                            sx={{
                              backgroundColor: '#d3d3d3b3',
                              width: '90px',
                              height: '90px',
                              padding: "10px",
                              marginTop: '10px',
                              position: 'relative',
                              display: "flex",
                            }}
                          >
                            <Button
                              className="fileUpload-box btn"
                            >
                              <img src={upload_img} alt='file_upload' style={{ width: '20px', height: '20px' }} />
                              <input type='file' id='upload-img' className="upload-btn-wrapper" onChange={handleGetFile} multiple />
                            </Button>
                          </Box>
                        </>}


                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ margin: 0, marginTop: 5 }} />
                  </Grid>
                  <Box>
                    <Grid container spacing={6} sx={{ marginBotoom: '0', justifyContent: 'center' }}>
                      <Grid item xs={12} md={12}>
                        <h2 style={{ marginBottom: 0, marginTop: '12px' }}>Case Info</h2>
                      </Grid>
                      {/*  <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ background: '#f6f6f6' }}>
                          <InputLabel>Case Number*</InputLabel>
                          <OutlinedInput
                            label='Case Number'
                            name='caseNumber'
                            id='caseNumber'
                            onChange={formik.handleChange}
                            value={caseNumber}
                            readOnly={true}
                          />
                        </FormControl>
                      </Grid> */}
                      <Grid item xs={12} md={12}>
                        <FormControl fullWidth sx={{ background: '#ffffff' }}>
                          <InputLabel>Offence*</InputLabel>
                          <OutlinedInput
                            label='offence'
                            name='offence'
                            id='offence'
                            onChange={formik.handleChange}
                            value={formik.values.offence}
                            error={Boolean(formik.errors.offence && formik.touched.offence)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label='Date of Report* '
                              disablePast
                              value={reportdate}
                              onChange={newValue => setReportDate(newValue)}
                              renderInput={params => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label='Date of Offence*'
                              value={offencedate}
                              onChange={newValue => setOffenceDate(newValue)}
                              renderInput={params => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Card>
                          <TabContext value={offenceTabNameActive}>
                            <TabList
                              variant='scrollable'
                              scrollButtons={false}
                              onChange={handleTabsChange}
                              sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                            >
                              <Tab value='victim-info' label={`Victim (${victimcount > 0 ? victimcount : '0'})`} onClick={() => handlechangeTab(parseInt(OFFENCE_TAB_TYPE.Victim))} />
                              <Tab value='witness-info' label={`Witness (${witnesscount > 0 ? witnesscount : '0'})`} onClick={() => handlechangeTab(parseInt(OFFENCE_TAB_TYPE.Witness))} />
                              <Tab value='suspect-info' label={`Suspect (${suspectcount > 0 ? suspectcount : '0'})`} onClick={() => handlechangeTab(parseInt(OFFENCE_TAB_TYPE.Suspect))} />
                              <Tab value='property-info' label={`Property (${propertycount > 0 ? propertycount : '0'})`} />

                              {/* <Tab value='other-info' label={`Other (${othercount})`} /> */}
                            </TabList>
                            <CardContent>
                              <TabPanel value='victim-info' >
                                <Grid item xs={12} md={12} >
                                  {getOffenceTicketId && getOffenceTicketId > 0 ? (
                                    <Addwitness getOffenceTicketId={getOffenceTicketId} />
                                  ) : (
                                    <Addwitness getOffenceTicketId={0} />
                                  )}
                                </Grid>
                              </TabPanel>
                              <TabPanel value='witness-info'>
                                <Grid item xs={12} md={12}>
                                  {getOffenceTicketId && getOffenceTicketId > 0 ? (
                                    <Addwitness getOffenceTicketId={getOffenceTicketId} />
                                  ) : (
                                    <Addwitness getOffenceTicketId={0} />
                                  )}
                                </Grid>
                              </TabPanel>
                              <TabPanel value='suspect-info'>
                                <Grid item xs={12} md={12}>
                                  {getOffenceTicketId && getOffenceTicketId > 0 ? (
                                    <Addwitness getOffenceTicketId={getOffenceTicketId} />
                                  ) : (
                                    <Addwitness getOffenceTicketId={0} />
                                  )}
                                </Grid>
                              </TabPanel>
                              <TabPanel value='property-info'>
                                <Grid item xs={12} md={12}>
                                  {getOffenceTicketId && getOffenceTicketId > 0 ? (
                                    <Addproperty getOffenceTicketId={getOffenceTicketId} />
                                  ) : (
                                    <Addproperty getOffenceTicketId={0} />
                                  )}
                                </Grid>
                              </TabPanel>
                              {/*  <TabPanel value='other-info'>
                                <Grid item xs={12} md={12}>
                                  <OtherOffenceInfo />
                                </Grid>
                              </TabPanel> */}
                            </CardContent>
                          </TabContext>
                        </Card>
                      </Grid>
                      {/*  <Grid item xs={12}>
                        <FormControl fullWidth sx={{ background: '#ffffff' }}>
                          <TextField
                            rows={4}
                            multiline
                            name='narrative'
                            id='narrative'
                            label='Public Narrative*'
                            onChange={formik.handleChange}
                            value={formik.values.narrative}
                            error={Boolean(formik.errors.narrative && formik.touched.narrative)}
                          />
                        </FormControl>
                      </Grid> */}
                      <Grid item xs={12}>
                        <ReactDraftWysiwyg
                          editorState={publicNarrative}
                          onEditorStateChange={(data: any) => setPublicNarrative(data)}
                          placeholder="Public Narrative"
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
                          mention={{
                            separator: ' ',
                            trigger: '@',
                            suggestions: assignename
                          }}
                          hashtag={{
                            separator: ' ',
                            trigger: '#'
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={12}
                        sx={{ alignItem: 'center', justifyContent: 'center', marginTop: '15px;' }}
                      >
                        <Box m={1} display='flex' justifyContent='center' alignItems='center'>
                          <Button
                            variant='outlined'
                            onClick={() => {
                              handlecreateSliderClose(), handleResetForm()
                            }}
                            sx={{ textTransform: 'capitalize', border: '1px  solid #2D4ACD' }}
                            color='secondary'
                          >
                            Cancel
                          </Button>

                          <Button
                            type='submit'
                            sx={{ marginLeft: '10px', textTransform: 'capitalize' }}
                            variant='contained'
                          >
                            {loading ? <CircularProgress color='inherit' size='4vh' /> : getOffenceTicketId > 0 ? 'Update' : 'Create'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </form>
          </Box>
        </Box>
      </Box>


      {/* file display images */}
      <Dialog
        open={viewImg}
        onClose={handleViewImgClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle onClick={handleViewImgClose} id='alert-dialog-title'>
          close
        </DialogTitle>
        <DialogContent sx={{ height: '500px', width: '500px' }} className="image-preview">
          <img alt="img-popup" src={imgUrlpopup ? imgUrlpopup : previewImgDisplay} style={{ width: "100%", height: "100%" }} />
        </DialogContent>
      </Dialog>

    </>
  )
}

export default Commonticket
