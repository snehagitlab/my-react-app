import React, { useState, useEffect, useContext, useCallback ,useRef} from 'react'
import { Box, Grid, Typography, Button, MenuItem, Modal, InputBase, InputAdornment, Dialog, DialogContent, FormControl, InputLabel, OutlinedInput, TextField, Select, DialogActions, Checkbox, ListItemText, IconButton } from '@mui/material'
import Divider from '@mui/material/Divider'
import Search from 'src/assets/Images/user_Icons/light/search-normal.svg'

//import react route
import { useNavigate } from 'react-router-dom'

//import images
import File_attachment from '../../../../assets/Images/user_Icons/light/file_attachment.png'
import blank_folder from '../../../../assets/Images/adminIcons/blank_folder.png'

//import compoenent
import CommonKnowledge from './commonKnowledge'
import KnowledgeContext from 'src/context/knowledgeProvider'

//import Category from '../../../../assets/Images/Icons/dark/category.png'

//import toast
import { toast } from 'react-toastify'

//import config
import { API_PATHS, USER_ROLE, KB_ACCESS,FILE_TYPE } from 'src/config/api.config'

//import compoenent
import Loader from "./categoryLoader"
import DraftLoader from "./draftLoader"
import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import EditDarkIcon from 'src/assets/Images/Icons/dark/edit.svg'
import TrashDarkIcon from 'src/assets/Images/Icons/dark/trash.svg'
import ViewDarkIcon from 'src/assets/Images/Icons/dark/eye.svg'
import HideDarkIcon from 'src/assets/Images/Icons/dark/hideEye.svg'
import axios from 'axios';
import MuiAvatar from '@mui/material/Avatar'
import ImageUpdateIcon from 'src/assets/Images/update_image_icon.svg'
import {Helmet} from "react-helmet";


const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_LIC = process.env.REACT_APP_BASE_URL
const BASE_URL_SUPPORT = process.env.REACT_APP_BASE_URL
const KC_IMAGE: any = parseInt(FILE_TYPE.KNOWLEDGE_CATEGORY)
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC
const imagePath = 'https://storage.googleapis.com/'


function Knowledge() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { addFolder, setCategoryopen, createCategory, /* setFolderId, setCategoryId, */ setFolderAddcatId, setDraftDisplay, setCategoryName, /* setFolderCatname, setFolderName, */ setScrollId, myRef
    , KbAccess,
    setKbAccess,
    userRole,
    setUserRole } = useContext<any>(KnowledgeContext)
  const [listCategory, setListCategory] = useState<any>([])
  const [listArticle, setListArticle] = useState<any>([])
  const [categoryCount, setCategoryCount] = useState(0)
  const [categoryLoader, setCategoryLoader] = useState(false)
  const [draftLoader, setDraftLoader] = useState(false)
  const [deletecategoryId, setDeleteCategoryId] = React.useState<any>(0)
  const [searchValue, setsearchValue] = useState('')
  const [editcategoryId, seteditCategoryId] = React.useState<any>(0)
  const [getSelectedImageUpdate, setSelectedImageUpdate] = React.useState<any>()


  //delete category modal state
  const [openTicket, setOpenTicket] = React.useState(false);
  const handleCloseTicket = () => {

    setOpenTicket(false)
  }
  const handleOpen = (deleteId: any) => {
    setDeleteCategoryId(deleteId)
    setOpenTicket(true);
  };

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


  // delete modal css
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '5px 7px 20px rgb(0 0 0 / 25%) !important',
    bgcolor: 'background.paper',
    p: 8
  }
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const getCategoryDetails = async () => {
    setDraftLoader(true)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}/${API_PATHS.dashboard}?showAll=true&search={"name":"${searchValue}"}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
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
        setDraftLoader(false)
        setListCategory(result.payload.data)
        const countData = result.payload.data
        setCategoryCount(countData.length)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const onChangeHandlerUpdate = async (e: any) => {
    const file = e.target.files[0]
    const FileExtemsion = ['jpg', 'png']
    if (FileExtemsion.includes(file.name.split('.').pop().toLowerCase())) {
        setOrgProfileImageUpdate(e.target.files[0])
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            const imageDataUrl = await readFile(e.target.files[0])
            setSelectedImageUpdate(imageDataUrl)
        }
    } else {
        toast.error(`This ${file.name.split('.').pop()} can't support`)
    }
}


const readFile = (file: any) => {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}

  useEffect(() => {
    getCategoryDetails()
  }, [addFolder, createCategory, searchValue])

  //get draft

  const getDrafts = async () => {
    setCategoryLoader(true)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}?search={"isPublish":0}&recordsPerPage=3`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
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
        setListArticle(result.payload.data)
        setCategoryLoader(false)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    getDrafts()
  }, [])

  const handleMoveCateogry = (id: any, name: any) => {
    navigate('/knowledge/category', { state: id })
    setDraftDisplay(false)
    setCategoryName(name)
  }

  /*  const viewAllDraft = () => {
     setCategoryName()
     navigate('/knowledge/category')
     setDraftDisplay(true)
   } */

 /*  const handleGetFolderId = (folderid: any, foldername: any, catName: any, catId: any) => {
    setCategoryName()
    navigate('/knowledge/category', { state: catId })
    setFolderId(folderid)
    setCategoryId(catId)
    setFolderName(foldername)
    setFolderCatname(catName)
    setDraftDisplay(false)
  } */

  const handleAddFolder = (catId: any) => {
    setFolderAddcatId(catId)
    setCategoryopen(true)
  }


  const handleButtonClick = (id: any) => {
    setScrollId(id)
    setTimeout(() => {
      if (myRef) {
        myRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, 1500)
  }

  //Get Article Edit Mode
  const handleArticleInfo = (row: any) => {
    navigate('/knowledge/addArticle', { state: row })
  }

  //Hide Super Admin Categor
  const hideSuperAdminCategory = async (hideCatId: any) => {
    if (hideCatId > 0) {
      const data = { catId: hideCatId }

      const url = `${BASE_URL}/${API_VERSION}/${API_PATHS.category}/${API_PATHS.hide_toggle}`
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
      try {
        const response = await fetch(url, {
          method: 'POST',
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
          getCategoryDetails()
          setDeleteCategoryId(0)
        }
        else {
          toast.error(result.message)
          getCategoryDetails()
          setDeleteCategoryId(0)
        }
      } catch (err: any) {
        toast.error(err.message)
        setDeleteCategoryId(0)
      }
    }
  }
  const [userRoleId, setUserRoleId] = React.useState(0)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    setUserRoleId(user.data.userRole[0])
  }, [])




  //KB Access or not using license API
  const handleGetFreeTrailCountOrg = async () => {
    if (userRole === parseInt(USER_ROLE.ORG_ADMIN)) {
      const url = new URL(`${BASE_URL_LIC}/${API_VERSION}/${API_PATHS.organisation}/${API_PATHS.license}/detail`)
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
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
          const data = result.payload.knowBaseAccess
          setKbAccess(data)
        } else {
          const data = result.payload.knowBaseAccess
          setKbAccess(data)
        }
      } catch (ex: any) { }

    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    setUserRole(user.data.userRole[0])
    handleGetFreeTrailCountOrg()
  }, [])



  const handleDelete = async () => {
    const requestData = { catId: deletecategoryId }
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}`)
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      },
      body: JSON.stringify(requestData)

    })
    const result = await response.json()
    if (result.status === 200) {
      toast.success(result.message)
      setDeleteCategoryId(0)
      handleCloseTicket()
      getCategoryDetails()
    } else {
      toast.success(result.message)
      setDeleteCategoryId(0)
      handleCloseTicket()
    }

  }


  const handleSearch = (e: any) => {
    setsearchValue(e.target.value)
  }

  const debounce = (func: any) => {
    let timer: any;

    return function (this: any, ...args: any[]) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        func.apply(this, args)
      }, 300);
    }
  }

  const optimisedVersion = useCallback(debounce(handleSearch), [])

  const [isCheckName, setIsCheckName] = React.useState<any>([])
  const [isCheck, setIsCheck] = React.useState<any>([]);
  const [orgTypeSelect, setOrgTypeSelect] = useState<any>([])
  const [catname, setCatname] = useState<any>("")
  const [catdetails, setCatdetails] = useState<any>("")
  const [openDialogueCategory, setOpenDialogueCategory] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [loader, setLoader] = useState(false)
  const [OrgtypeList, setOrgTypeList] = React.useState<Array<any>>([])
  const [orgProfileImageUpdate, setOrgProfileImageUpdate] = useState()

  // get single category details
  const handleClickOpenCategory = async (catId: any) => {
    setLoader(true)
    setOpenDialogueCategory(true)
    setIsCheckName([])
    seteditCategoryId(catId)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}/detail?catId=${catId}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
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

        setLoader(false)
        setSelectedImageUpdate(imagePath+result.payload.data.image)
        setCatname(result.payload.data.name)
        setCatdetails(result.payload.data.description)
        setOrgTypeSelect(result.payload.data.orgCatMap)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  const handleCloseCategory = () => {
    setOpenDialogueCategory(false)
    setSelectedImageUpdate([])
  }

   const fileInput: any = useRef()

   const selectFile = () => {
    fileInput.current.click()
  } 

  const handleChangeName = (event: any) => {
    setIsUpdate(true)
    setCatname(event.target.value)
  }

  //cat details onChnage
  const handleChangeDetails = (event: any) => {
    setIsUpdate(true)
    setCatdetails(event.target.value)
  }
  const fetchAllOrganisationsType = async () => {
    const url = new URL(
      `${BASE_URL_SUPPORT}/${API_VERSION}/${API_PATHS.organisationType
      }?sortOrder=DESC&showAll=true`
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
      setOrgTypeList(result.payload.data)
    }
  }

  useEffect(() => { fetchAllOrganisationsType() }, [])
  const handleCheck = (e: any) => {
    setIsCheckName([])
    const { id, checked, value } = e.target;
    setIsCheck([...isCheck, id])
    setIsCheckName([...isCheckName, value])
    if (!checked) {
      setIsCheck(isCheck.filter((item: any) => item !== id));
      setIsCheckName(isCheckName.filter((item: any) => item !== value));
    }
  }

  //edit category
  const handleEditCategory = async (cid: any) => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}?catId=${cid}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    if (isUpdate === false) {
      toast.error('Please Update knowledgebase Details')
    }
    else {
      let orgLogoImage: any
        if (orgProfileImageUpdate != null) {
            const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
            const formData = new FormData()
            formData.append('file', orgProfileImageUpdate)
            formData.append('type', KC_IMAGE)
            try {
                const response = await axios.post(`${BASE_URL_PUBLIC}/v1/file`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${UserData.token}`
                    }
                })

                if (response) {
                    orgLogoImage = response.data.payload.filesPath[0].filePath
                }
            } catch (error) {
                console.log(error)
            }
        }
        let catImg:any
        if (getSelectedImageUpdate != null) {
          catImg = orgLogoImage && orgLogoImage 
      } else {
        catImg = orgProfileImageUpdate && orgProfileImageUpdate 
      }
      try {
        const response = await fetch(url.toString(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          },

          body: JSON.stringify({

            name: catname,
            description: catdetails,
            orgTypeId: isCheck.map(JSON.parse),
            image: catImg

          })
        })
        const result = await response.json()
        if (result.status == 200) {
          toast.success(result.message)
          setOpenDialogueCategory(false)
          getCategoryDetails()
        } else {
          toast.error(result.message)
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    }

  }
  useEffect(() => {
    setIsCheck(orgTypeSelect.map((li: any) => li.orgTypeId.toString()));
  }, [orgTypeSelect])

  useEffect(() => {
    setIsCheckName([])
    setIsUpdate(true)
    OrgtypeList.map(group => {

      if (isCheck.includes(`${group.orgTypeId}`)) {
        setIsCheckName((oldArray: any) => [...oldArray, `${group.orgTypeName}`]);
      }
    })

  }, [isCheck])

  return (
    <>
    <Helmet>
        <title>Knowledge Base - Gogtas</title>
        <meta name="description" content="Knowledge Base" />
    </Helmet>
      <Box>
        <Grid>
          <CommonKnowledge />
        </Grid>
        <Grid>
          <Grid sx={{ backgroundColor: '#FFFFFF', paddingTop: '40px', borderRadius: '5px' }}>
            {
              KbAccess != KB_ACCESS.ONLYSUPERADMIN && userRole === parseInt(USER_ROLE.ORG_ADMIN) ?
                <>
                  {listArticle.length > 0 ?
                    <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '17px', fontWeight: '600', fontFamily: 'Mazzard-regular' }}>
                        Draft <span style={{ fontSize: "15px" }}>({listArticle?.length > 0 ? listArticle.length : 0})</span>
                      </Typography>

                      {/*     <Typography
                        onClick={() => viewAllDraft()}
                        sx={{
                          fontSize: '14px',
                          fontWeight: '500',
                          fontFamily: 'Mazzard-regular',
                          color: '#2c5cc5'
                          , cursor: 'pointer'
                        }}
                      >
                        View All
                      </Typography> */}
                    </Grid> : " "}
                  <Grid container spacing={5} sx={{ marginTop: '3px', display: 'flex' }}>
                    {categoryLoader ?
                      [0, 1, 2,].map((item: any) => {
                        return (
                          <Grid item xs={12} md={4} key={item.toString()} >
                            <Loader />
                          </Grid>
                        )
                      })
                      : listArticle.length > 0 ? (
                        listArticle &&
                        listArticle.map((item: any, id: any) => {
                          const date = new Date(item.createdAt)
                          const createdAt = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} `

                          return (
                            <Grid item xs={12} md={4} key={id} sx={{ paddingTop: '0px !important' }}>
                              <Box
                                sx={{
                                  padding: '17px',
                                  borderRadius: '3px',
                                  background: '#F5F7F9',
                                  boxShadow: ' rgba(0, 0, 0, 0.20  ) 0px 5px 15px',
                                  marginBottom: '40px',
                                  marginTop: '20px',
                                  border: '1px solid lightgray',
                                  cursor: 'pointer'
                                }}
                                onClick={() => { handleArticleInfo(item) }}
                              >
                                <Tooltip TransitionComponent={Zoom} title={item.title}>
                                  <Box sx={{ fontSize: '17px', fontWeight: '600', marginBottom: '5px', width: '272px', overflow: 'hidden' }}>
                                    {item.title.length > 35 ? `${item.title.substring(0, 35)}...` : item.title}
                                  </Box>
                                </Tooltip>
                                <Box sx={{ fontSize: '13px' }}>{createdAt}</Box>
                              </Box>
                            </Grid>

                          )
                        })
                      ) : (' '

                        /*  <span style={{ marginLeft: '20px',marginBottom:'20px' }}>Draft not found</span> */
                      )}
                  </Grid>
                </>
                : userRole === parseInt(USER_ROLE.SUPPER_ADMIN) ?
                  <>
                    {listArticle.length > 0 ?
                      <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '17px', fontWeight: '600', fontFamily: 'Mazzard-regular' }}>
                         Draft <span style={{ fontSize: "15px" }}>({listArticle?.length > 0 ? listArticle.length : 0})</span>
                        </Typography>

                        {/*  <Typography
                          onClick={() => viewAllDraft()}
                          sx={{
                            fontSize: '14px',
                            fontWeight: '500',
                            fontFamily: 'Mazzard-regular',
                            color: '#2c5cc5'
                            , cursor: 'pointer'
                          }}
                        >
                          View All
                        </Typography> */}
                      </Grid> : ''
                    }
                    <Grid container spacing={5} sx={{ marginTop: '3px', display: 'flex' }}>
                      {categoryLoader ?
                        [0, 1, 2,].map((item: any) => {
                          return (
                            <Grid item xs={12} md={4} key={item.toString()} >
                              <Loader />
                            </Grid>
                          )
                        })
                        : listArticle.length > 0 ? (
                          listArticle &&
                          listArticle.map((item: any, id: any) => {
                            const date = new Date(item.createdAt)
                            const createdAt = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} `

                            return (
                              <Grid item xs={12} md={4} key={id} sx={{ paddingTop: '0px !important' }}>
                                <Box
                                  sx={{
                                    padding: '17px',
                                    borderRadius: '3px',
                                    background: '#F5F7F9',
                                    boxShadow: ' rgba(0, 0, 0, 0.20  ) 0px 5px 15px',
                                    marginBottom: '40px',
                                    marginTop: '20px',
                                    border: '1px solid lightgray',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => { handleArticleInfo(item) }}
                                >
                                  <Tooltip TransitionComponent={Zoom} title={item.title}>
                                    <Box sx={{ fontSize: '17px', fontWeight: '600', marginBottom: '5px', width: '272px', overflow: 'hidden' }}>
                                      {item.title.length > 35 ? `${item.title.substring(0, 35)}...` : item.title}
                                    </Box>
                                  </Tooltip>
                                  <Box sx={{ fontSize: '13px' }}>{createdAt}</Box>
                                </Box>
                              </Grid>

                            )
                          })
                        ) : (' '

                          /*  <span style={{ marginLeft: '20px',marginBottom:'20px' }}>Draft not found</span> */
                        )}
                    </Grid></> : ' '
            }


            {/* knwlwedge article folder grid */}
            <Grid sx={{ fontSize: '17px', fontWeight: '600', fontFamily: 'Mazzard-regular', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              <Box>Categories <span style={{ fontSize: "15px" }}>({categoryCount ? categoryCount : 0})</span></Box>
              <Box>
                <InputBase
                  size='small'
                  sx={{ p: 3, borderRadius: 2, background: '#F7F7F7 !important', color: '#323A49' }}
                  placeholder='Search'
                  name="search"
                  onChange={optimisedVersion}
                  startAdornment={
                    <InputAdornment sx={{ mr: 3 }} position='start'>
                      <img src={Search} alt='search-img' style={{ width: '19px', height: '19px' }} />
                    </InputAdornment>
                  }
                /></Box>
            </Grid>

            <Grid container spacing={5} sx={{ marginTop: '3px', display: 'flex', }}>

              {draftLoader ? [0, 1, 2,].map((item: any) => {
                return (
                  <Grid item xs={12} md={4} key={item.toString()} >
                    <DraftLoader />
                  </Grid>
                )
              }) : listCategory.length > 0 ?
                listCategory.map((item: any, index: number) => {

                  return (
                    <Grid item xs={12} md={4} key={index} >
                      <Grid
                        sx={{
                          border: ' 2px solid lightgray',
                          borderRadius: '8px',
                          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',

                        }}
                      >
                        <Box className='category-menu' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', cursor: 'pointer' }} onClick={() => { handleMoveCateogry(item.catId, item.name), handleButtonClick(item.catId) }}>
                            <img
                              src={File_attachment}
                              alt='file_attachment'
                              style={{ marginRight: '15px', height: '30px' }}
                            />
                            <Tooltip TransitionComponent={Zoom} title={item.name}>
                              <Typography sx={{ fontFamily: 'Mazzard', fontSize: "17px", fontWeight: "700", textTransform: "capitalize" }}> {item.name.length > 22 ? `${item.name.substring(0, 22)}...` : item.name}</Typography>
                            </Tooltip>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', cursor: 'pointer' }}>
                            <Box className='icon-category-menu ' >
                              {parseInt(USER_ROLE.ORG_ADMIN) === userRole && item.type == USER_ROLE.ORG_ADMIN ?
                                <>
                                  <Tooltip TransitionComponent={Zoom} title='Edit'>
                                    <img src={EditDarkIcon} alt='edit-img' onClick={() => handleClickOpenCategory(item.catId)} style={{ height: '18px', width: '18px', marginRight: '6px' }} />
                                  </Tooltip>
                                  <Tooltip TransitionComponent={Zoom} title='Delete'>
                                    <img src={TrashDarkIcon} onClick={() => { handleOpen(item.catId) }} alt='delete-img' style={{ height: '18px', width: '18px', marginRight: '6px' }} />
                                  </Tooltip>
                                </>
                                : parseInt(USER_ROLE.SUPPER_ADMIN) === userRole ?
                                  <>
                                    <Tooltip TransitionComponent={Zoom} title='Edit'>
                                      <img src={EditDarkIcon} alt='edit-img' onClick={() => handleClickOpenCategory(item.catId)} style={{ height: '18px', width: '18px', marginRight: '6px' }} />
                                    </Tooltip>
                                    <Tooltip TransitionComponent={Zoom} title='Delete'>
                                      <img src={TrashDarkIcon} onClick={() => { handleOpen(item.catId) }} alt='delete-img' style={{ height: '18px', width: '18px', marginRight: '6px' }} />
                                    </Tooltip></> : ''
                              }

                              {
                                userRoleId.toString() === USER_ROLE.ORG_ADMIN && item.type === 1 ?
                                  <Tooltip TransitionComponent={Zoom} title={item.isHide === 0 ? 'Hide' : 'Show'}>
                                    <img alt="icon" src={item.isHide === 0 ? ViewDarkIcon : HideDarkIcon} onClick={() => hideSuperAdminCategory(item.catId)} style={{ height: '18px', width: '18px', marginRight: '6px' }} />
                                  </Tooltip>
                                  : ''}
                            </Box>

                          </Box>
                          {/*  <Box onClick={() => setDeleteCategoryId(item.catId)}>
                          <Fragment>

                            <IconButton size='small' sx={{ color: 'text.secondary' }}>
                              <Avatar src={Dots} sx={{ width: '35px', height: '35px' }} onClick={handleDropdownOpen} />
                            </IconButton>
                            <Menu
                              className=' pdf-export-popover'
                              anchorEl={anchorElDrop}
                              open={Boolean(anchorElDrop)}
                              onClose={() => handleDropdownClose()}
                              sx={{
                                '& .MuiMenu-paper': {
                                  width: 230, marginTop: 4, boxShadow: '#fff 10px 6px 20px -8px !important', border: '1px solid lightgrey'
                                }
                              }}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                              {
                                userRoleId.toString() === USER_ROLE.ORG_ADMIN && item.type === 1 ?
                                  <MenuItem sx={{ p: 0 }} >
                                    <Box sx={styles} onClick={() => hideSuperAdminCategory()} >
                                      <img src={ColorEdit} alt='edit-img' style={{ height: '18px', width: '18px', marginRight: '6px' }} />
                                      {item.isHide === 0 ? console.log(item.isHide + '<=====' + item.catId) : console.log(item.isHide + '<==>' + item.catId)}

                                              {item.catId}
                                   </Box>
                                  </MenuItem>
                                  : ''}
                                  <MenuItem sx={{ p: 0 }}>
                                    <Box sx={styles} onClick={() => { handleOpen(), handleDropdownClose() }} >
                                      <img src={deleteTicketIcon} alt='edit-img' style={{ height: '18px', width: '18px', marginRight: '6px' }} />{' '}

                                      Delete
                                    </Box>
                                  </MenuItem>

                                </Menu>
                              </Fragment>

                        </Box> */}


                        </Box>
                        {item.folders.length <= 0 ?
                          <>
                            <Box
                              sx={{ padding: '20px',  textAlign: 'center' }}
                            >
                              <img
                                src={blank_folder}
                                alt='file_attachment'
                                style={{ marginRight: '15px', height: '60px' }}
                              />
                              <Typography sx={{ fontFamily: 'Mazzard-regular', fontSize: '16px', fontWeight: '500', color: "#b9b9b9de" }}>This category is empty</Typography>
                            </Box>
                            <Grid sx={{ padding: '0px 30px 39px 30px', fontSize: '14px', textAlign: "center" }} >
                              <Button variant="outlined" onClick={() => handleAddFolder(item.catId)} sx={{ textTransform: "capitalize" }}>add Folder</Button>
                            </Grid>
                          </> :
                          <>
                            {item.folders && item.folders[0] ?
                              <Grid sx={{ padding: '2px 30px 0px 30px', fontSize: '14px' }} /* onClick={() => { handleGetFolderId(item.folders[0].folderId, item.folders[0].name, item.name, item.catId), handleButtonClick(item.catId) }} */>
                                <Grid
                                  sx={{
                                    padding: '10px 0px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontFamily: 'Mazzard-regular',
                                   
                                    /*  cursor: 'pointer'

                                    /* 
                                    '&:hover': {
                                      backgroundColor: '#ebeef0'
                                    } */
                                  }}
                                >
                                  <Tooltip TransitionComponent={Zoom} title={item.folders[0].name}>
                                    <Box sx={{ fontSize: "16px", textTransform: "capitalize" }}> {item.folders[0].name.length > 35 ? `${item.folders[0].name.substring(0, 35)}...` : item.folders[0].name}</Box>
                                  </Tooltip>
                                  <Box sx={{ fontSize: "16px", fontWeight: "700" }}>{item.folders[0].totalArticle}</Box>
                                </Grid>
                                <Divider sx={{ margin: 0, borderColor: "#ffffff" }} />
                              </Grid> : <>
                                <Grid sx={{ padding: '2px 30px 0px 30px', fontSize: '14px' }} >
                                  <Grid sx={{ padding: '10px 0px', color: "#ffffff" }}> Folder not found</Grid>
                                  <Divider sx={{ margin: 0 }} />
                                </Grid>
                              </>}
                            {/* //sec */}
                            {item.folders && item.folders[1] ?
                              <Grid sx={{ padding: '2px 30px 0px 30px', fontSize: '14px' }} /* onClick={() => { handleGetFolderId(item.folders[1].folderId, item.folders[1].name, item.name, item.catId), handleButtonClick(item.catId) }} */ >
                                <Grid
                                  sx={{
                                    padding: '10px 0px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontFamily: 'Mazzard-regular',
                                   
                                   
                                    /*  cursor: 'pointer'

                                    
                                    '&:hover': {
                                      backgroundColor: '#ebeef0'
                                    } */
                                  }}
                                >
                                  <Tooltip TransitionComponent={Zoom} title={item.folders[1].name}>
                                    <Box sx={{ fontSize: "16px", textTransform: "capitalize" }}> {item.folders[1].name.length > 35 ? `${item.folders[1].name.substring(0, 35)}...` : item.folders[1].name}</Box>
                                  </Tooltip>
                                  <Box sx={{ fontSize: "16px", fontWeight: "700" }}>{item.folders[1].totalArticle}</Box>
                                </Grid>
                                <Divider sx={{ margin: 0, borderColor: "#ffffff" }} />
                              </Grid> : <>
                                <Grid sx={{ padding: '2px 30px 0px 30px', fontSize: '14px' }} >
                                  <Grid sx={{ padding: '10px 0px', color: "#ffffff" }}> Folder not found</Grid>
                                  <Divider sx={{ margin: 0, borderColor: "#ffffff" }} />
                                </Grid>
                              </>}
                            {/* third */}
                            {item.folders && item.folders[2] ?
                              <Grid sx={{ padding: '2px 30px 0px 30px', fontSize: '14px' }} /* onClick={() => { handleGetFolderId(item.folders[2].folderId, item.folders[2].name, item.name, item.catId), handleButtonClick(item.catId) }} */  >
                                <Grid
                                  sx={{
                                    padding: '10px 0px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontFamily: 'Mazzard-regular'
                                   
                                    /*  cursor: 'pointer'
'&:hover': {
                                      backgroundColor: '#ebeef0'
                                    } */
                                  }}
                                >
                                  <Tooltip TransitionComponent={Zoom} title={item.folders[2].name}>
                                    <Box sx={{ fontSize: "16px", textTransform: "capitalize" }}> {item.folders[2].name.length > 35 ? `${item.folders[2].name.substring(0, 35)}...` : item.folders[2].name}</Box>
                                  </Tooltip>
                                  <Box sx={{ fontSize: "16px", fontWeight: "700" }}>{item.folders[2].totalArticle}</Box>
                                </Grid>
                                <Divider sx={{ margin: 0, borderColor: "#ffffff" }} />
                              </Grid> : <>
                                <Grid sx={{ padding: '2px 30px 0px 30px', fontSize: '14px' }} >
                                  <Grid sx={{ padding: '10px 0px', color: "#ffffff" }}> Folder not found</Grid>
                                  <Divider sx={{ margin: 0, borderColor: "#ffffff" }} />
                                </Grid>
                              </>}
                          </>

                        }
                        <Grid
                          onClick={() => handleMoveCateogry(item.catId, item.name)}
                          sx={{
                            color: '#2D4ACD',
                            padding: '20px 30px',
                            fontSize: '14px',
                            fontFamily: 'Mazzard-regular',
                            cursor: 'pointer',
                            display: item.folders.length <= 0 ? 'none' : 'block',
                          }}
                        >
                          View All Folder
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                }) : <Grid item xs={12} md={4} ><Box>Category not found</Box></Grid>}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* delete ticket modal */}
      <Modal
        hideBackdrop
        open={openTicket}
        onClose={handleCloseTicket}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
        sx={{ backgroundColor: '#00000075' }}
        
      >
        <Box sx={{ ...style }}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Delete Category
          </Typography>
          <p id='child-modal-description'>Are you sure you want to delete this Category?</p>

          <Button
            variant='contained'
            size='small'
            sx={{
              marginRight: 2, mb: 0, background: `${theme.palette.primary.main}`, textTransform: 'capitalize'
            }}
            onClick={handleDelete}
          >
            Ok
          </Button>
          <Button variant='outlined' size='small' sx={{ textTransform: 'capitalize' }} onClick={handleCloseTicket}>
            Cancel
          </Button>
        </Box>
      </Modal>
      {/* category edit dialogue */}
      <Dialog
        fullWidth
        maxWidth='sm'
        open={openDialogueCategory}
        onClose={handleCloseCategory}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>

            <Grid
                        item
                        xs={12}
                        md={12}
                        display='flex'
                        justifyContent='center'
                        alignItems={'center'}
                        sx={{ paddingTop: '2px !important' }}
                    >
                        <Box
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            sx={{
                                height: '100px',
                                width: '100px',
                                border: '5px solid #2d4acd2b',
                                boxSizing: 'border-box',
                                borderRadius: '60px',
                                position: 'relative'
                            }}
                        >

                            <MuiAvatar src={getSelectedImageUpdate ? getSelectedImageUpdate : ''} alt='Category Image' sx={{ width: '100%', height: '100%' }} />
                            <input
                                type='file'
                                style={{ display: 'none' }}
                                ref={fileInput}
                                onChange={onChangeHandlerUpdate}
                                accept='image/*'
                            />
                            <IconButton
                                size='small'
                                sx={{ color: 'text.secondary', position: 'absolute', bottom: '-5px', right: '-10px' }}
                            >
                                <img
                                    onClick={selectFile}
                                    src={ImageUpdateIcon}
                                    alt='rightArrow'
                                    style={{ width: '24px', height: '24px' }}
                                />
                            </IconButton>
                        </Box>

                    </Grid>

          </Grid>

          {loader ? <Box sx={{
            paddingLeft: '0px', alignItems: 'center', justifyContent: 'center', display: ' flex',
            marginTop: '0px'
          }}>
            <div className="loading">Loading...</div>
          </Box> :
            <Grid>
              <Grid sx={{ marginTop: '15px' }}>
                <FormControl fullWidth sx={{ background: '#ffffff' }}>
                  <InputLabel>
                    Name*
                  </InputLabel>
                  <OutlinedInput sx={{ marginBottom: '20px' }} label='Name' name='title' id='title' value={catname} onChange={(e: any) => handleChangeName(e)} />
                </FormControl>
              </Grid>
              <Grid>
                <FormControl fullWidth sx={{ background: '#ffffff' }}>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    id='textarea-outlined'
                    placeholder='Description'
                    label='Description'
                    name='description'
                    value={catdetails}
                    onChange={(e: any) => handleChangeDetails(e)}
                  />
                </FormControl>
              </Grid>
              {userRoleId === 1 ?

                <Grid item sm={12} >
                  <FormControl fullWidth sx={{ marginTop: '15px' }}>
                    <InputLabel id="demo-multiple-checkbox-label">Organization Type*</InputLabel>
                    <Select

                      id="demo-multiple-checkbox"
                      multiple
                      value={isCheckName}
                      input={<OutlinedInput label="Organization Type*" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                    >

                      {OrgtypeList.map(a => {
                        return (
                          <MenuItem value={a.orgTypeId + '-' + a.orgTypeName} key={a.orgTypeId} sx={{ textTransform: 'capitalize' }}>
                            <Checkbox checked={isCheck.includes(a.orgTypeId.toString())} id={a.orgTypeId} onChange={handleCheck} value={a.orgTypeName} />
                            <ListItemText primary={a.orgTypeName} />
                          </MenuItem>

                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid> : ' '}
            </Grid>
          }
        </DialogContent>


        <DialogActions>
          <Grid sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }} md={12}>
            <Grid md={5} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              <Button
                fullWidth
                variant='outlined'
                sx={{
                  fontWeight: '500',
                  fontSize: '13px',
                  borderRadius: '9px',
                  filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                  p: '12px',
                  textTransform: 'capitalize',
                  marginRight: '10px'
                }}
                onClick={handleCloseCategory}
              >
                Cancel
              </Button>

              <Button
                onClick={() => handleEditCategory(editcategoryId)}
                fullWidth
                variant='contained'
                sx={{
                  fontWeight: '500',
                  fontSize: '13px',
                  borderRadius: '9px',
                  filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                  p: '12px',
                  textTransform: 'capitalize'
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog >
      {/* end category edit dialogue */}

    </>
  )
}

export default Knowledge
