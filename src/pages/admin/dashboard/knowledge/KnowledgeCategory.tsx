import React, { useState, useCallback, useEffect, useContext, Fragment } from 'react'
import { Grid, ListItemText, Tooltip, Modal, InputAdornment, IconButton, Stack, InputBase } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

//import react-router-dom
import { useLocation } from 'react-router-dom'

//import icon
//import EditIcon from '@mui/icons-material/Edit'

//list item
//import Collapse from '@mui/material/Collapse'

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'


//import Dialogue
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'

//import DialogActions from '@mui/material/DialogActions'

//im,por table
import { DataGrid } from '@mui/x-data-grid'

//import component
import CommonKnowledge from './commonKnowledge'



import article_icon from '../../../../assets/Images/Icons/dark/article_icon.png'
import folder_icon from '../../../../assets/Images/Icons/dark/folder_icon.png'
import Edit from '../../../../assets/Images/Icons/dark/edit.svg'

//import config file
import { API_PATHS, USER_ROLE } from 'src/config/api.config'

//import toast
import { toast } from 'react-toastify'

//IMPORT REACT-ROUTER-DOM
import { useNavigate } from 'react-router'

//import compoenent
import KnowledgeContext from 'src/context/knowledgeProvider'

//import axios
import axios from 'axios'
import EditFolder from './EditFolder'
import { useTheme } from '@mui/material/styles'
import TrashDarkIcon from 'src/assets/Images/Icons/dark/trash.svg'
import Search from 'src/assets/Images/user_Icons/light/search-normal.svg'
import EditDarkIcon from 'src/assets/Images/Icons/dark/edit.svg'
import Zoom from '@mui/material/Zoom'
import ViewDarkIcon from 'src/assets/Images/Icons/dark/eye.svg'


//import env
const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

//const BASE_URL_SUPPORT= process.env.REACT_APP_BASE_URL

/*const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

 const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}; */

function KnowledgeCategory() {
  const location: any = useLocation()
  let state: any = location.state
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(1)
  const [isOpened, setIsOpened] = useState(false);
  const { dispArticleBackBtn,setdispArticleBackBtn,setcategoryIdforAddArticle, addFolder, createCategory, getDraft, setgetdraft, folderId, setFolderId, setFolderEditDialogue, folderEditDialogue, setEditFolderName, setEditFolderDescription, setRoleId, seteditFolderId, seteditFolderCatId, setCatIdDirection, setDraftLoading /* myRef , scrollId*/ } = useContext<any>(KnowledgeContext)
  const [folder, setFolder] = useState<any>()
  const [article, setArticle] = useState<any>()
  const [catId, setCatId] = useState<any>(1)
  const [record, setRecord] = useState(10)
  const theme = useTheme()
  const [searchValue, setSearchValue] = useState('');
  const [folderCount, setFolderCount] = useState(0)
  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
  }

  if (catId != 1) {
    state = "";
  }

  setcategoryIdforAddArticle(state)
  setCatIdDirection(state)
  const handleCloseFolder = () => {
    setFolderEditDialogue(false)
  }
  const toggleStyle = {
    boxShadow: '0 6px 12px rgb(0 0 0 / 5%), 0 1px 4px rgb(0 0 0 / 15%)',
    borderTop: '0.5px solid ebeef0'
  }

  const withoutToggleStyle = {
    borderTop: '0.5px solid #ebeef0',
    borderBottom: '0.5px solid #ebeef0'
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '2px 3px 10px rgb(0 0 0 / 25%) !important',
    bgcolor: 'background.paper',
    p: 8
  }

  //get single folder details
  const handleClickOpenFolder = async (folderId: any) => {
    seteditFolderId(folderId)
    setCatId(1)
    setFolderEditDialogue(true)
    setEditFolderName('')
    setEditFolderDescription('')

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.folder}/detail?folderId=${folderId}`)
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
        setEditFolderName(result.payload.data.name)
        setEditFolderDescription(result.payload.data.description)
        seteditFolderCatId(result.payload.data.catId)
        setRoleId(result.payload.data.roleId)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }


  //get all draft
  const getALLDrafts = async () => {
    if (state === null || state === "" && folderId === undefined) {
      setDraftLoading(true)
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}?search={"isPublish":0}&pageNumber=${page}&recordsPerPage=${record}`)
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
          setDraftLoading(false)
          setArticle(result.payload.data)
          setRecord(result.pager.totalRecords)
          setgetdraft();
        } else {
          toast.error(result.message)
        }
      } catch (error: any) {
        toast.error(error.message)
        setDraftLoading(false)
      }

    }
  }

  //category onClick through getFolder
  const handleCategoryFolderList = async (cid: any, searchValue: any) => {
    setCatId(cid)
    setOpen(!open)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.folder}?showAll=true&search={"catId":${cid},"name":"${searchValue}"}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
      const result = await axios({
        method: 'get',
        url: url.toString(),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })
      if (result.status === 200) {
        setFolder(result.data.payload.data)
        const countData = result.data.payload.data
        setFolderCount(countData.length)
        handlegetArticles(cid)
      } else {
        toast.error(result.data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  //category onClick through getarticles
  const handlegetArticles = async (cid: any) => {
    setFolderId(0)
    setCatId(cid);

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}?search={"catId":${cid}}&pageNumber=${page}&recordsPerPage=150`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
      const result = await axios({
        method: 'get',
        url: url.toString(),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })
      if (result.status === 200) {
        setArticle(result.data.payload.data)
        setRecord(result.data.pager.totalRecords)
      } else {
        toast.error(result.data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  //folder onClick through getArticles
  const openFolderArticle = async (folderId: any) => {
    setFolderId(folderId)
    if (page > 0 && record > 0) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}?search={"folderId":${folderId}}&pageNumber=${page}&recordsPerPage=${record}`)
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
      try {
        const result = await axios({
          method: 'get',
          url: url.toString(),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        })
        if (result.status === 200) {
          setArticle(result.data.payload.data)
          setRecord(result.data.pager.totalRecords)
        } else {
          toast.error(result.data.message)
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    } else { console.log('The pageNumber must be valid value') }
  }

  useEffect(() => {
    if (searchValue && catId) {
      handleCategoryFolderList(catId, searchValue)
    }
  }, [catId, searchValue]);

  useEffect(() => {
    //getCategoryList()

    if (state && searchValue == '') {
      handleCategoryFolderList(state, searchValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addFolder, createCategory, searchValue])

  useEffect(() => {
    getALLDrafts()
    if (getDraft) {
      getALLDrafts()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, getDraft])

  useEffect(() => {
    if (state && searchValue == '') {
      handlegetArticles(state)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, searchValue])

  useEffect(() => {
    if (folderId) {
      openFolderArticle(folderId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, record])

  const [userRole, setUserRole] = useState(0)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    setUserRole(user.data.userRole[0])
  }, [])

  const handleArticleInfo = (row: any) => {
    const TypeId = row.type
    if (parseInt(USER_ROLE.ORG_ADMIN) === userRole) {
      if (TypeId == USER_ROLE.SUPPER_ADMIN) {
        setdispArticleBackBtn(!dispArticleBackBtn)
        navigate('/knowledge/article/preview', { state: row.articleId })
      }
      else if (TypeId == USER_ROLE.ORG_ADMIN) {
        navigate('/knowledge/addArticle', { state: row })

      } else {
        toast.error('Something went wrong')
      }
    } else { navigate('/knowledge/addArticle', { state: row }) }

  }

  const [deleteFolderId, setDeleteFolderId] = React.useState<any>(0)

  //delete Folder modal state
  const [openTicket, setOpenTicket] = React.useState(false);
  const handleCloseTicket = () => {

    setOpenTicket(false)
  }
  const handleOpenFolder = (deleteId: any) => {
    setDeleteFolderId(deleteId)
    setOpenTicket(true);
  };

  //delete Article modal state
  const [deleteArticleId, setDeleteArticleId] = React.useState<any>(0)
  const [openArticle, setOpenArticle] = React.useState(false)
  const handleCloseArticle = () => { setOpenArticle(false), setDeleteArticleId(0) }
  const handleOpenArticle = (deleteId: any) => {
    setDeleteArticleId(deleteId)
    setOpenArticle(true);
  }

  const handleDelete = async () => {
    const requestData = { folderId: deleteFolderId }
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.folder}`)
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
      setDeleteFolderId(0)
      handleCloseTicket()
      handleCategoryFolderList(catId, null)
      openFolderArticle(deleteFolderId)

    }
    else {
      toast.success(result.message)
      setDeleteFolderId(0)
      handleCloseTicket()
    }
  }



  const deleteArticle = async (articleId: any) => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}?articleId=${articleId}`)
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
        toast.success("Article deleted successfully")
        openFolderArticle(folderId)
        handleCloseArticle()
        setDeleteArticleId(0)
      } else {
        toast.error('Something went wrong!')
      }
    } catch (err: any) {
      console.log(err)
    }
  }


  const handleDisplayInputField = () => {
    setIsOpened(!isOpened);
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

  const optimisedVersion = useCallback(debounce(handleSearchChange), [])


  //table pagination default columns names
  const defaultColumns = [
    {
      flex: 0.1,
      fontSize: "14px",
      minWidth: 400,
      fontFamily: 'Mazzard',
      field: 'foldername',
      headerName: ' Article ',
      sortable: false,
      renderCell: (params: any) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row' }}>
              <div>
                <img
                  src={article_icon}
                  style={{ width: '19px', height: '19px', marginRight: '10px' }}
                  alt='folder_img'
                />
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '16px' }}
                onClick={() => { handleArticleInfo(params.row) }}
              >
                <Typography
                  noWrap
                  component='a'
                  variant='body2'
                  sx={{ fontWeight: 400, textDecoration: 'none', fontSize: '14px', fontFamily: 'Mazzard-regular', color: "#333038cf" }}
                >
                  {params.row.title}
                </Typography>

                <Typography sx={{ textDecoration: 'none', fontSize: '8px', fontFamily: 'Mazzard-regular' }}>
                  {new Date(params.row.createdAt).getDate()} {new Date(params.row.createdAt).toLocaleString('default', { month: 'long' }).substring(0, 3)} {new Date(params.row.createdAt).getFullYear()}
                </Typography>

              </div>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'useful',
      minWidth: 10,
      headerName: 'Helpful',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {params.row.useful}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'orgBranch',
      minWidth: 20,
      headerName: 'Action',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Stack rowGap={2} direction='row'>
            {/*  <Tooltip TransitionComponent={Zoom} title='View'>
            <IconButton>
              <img alt="icon-img" src={ViewDarkIcon}  onClick={() => { handleArticleInfo(params.row) }} />
            </IconButton>
          </Tooltip> */}


            {parseInt(USER_ROLE.ORG_ADMIN) === userRole && params.row.type == USER_ROLE.ORG_ADMIN ?
              <>
                <Tooltip TransitionComponent={Zoom} title='Edit'>
                  <IconButton onClick={() => { handleArticleInfo(params.row) }} >
                    <img alt="icon-img" src={EditDarkIcon} style={{ height: '18px', width: '18px' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title='Delete'>
                  <IconButton onClick={() => handleOpenArticle(params.row.articleId)} >
                    <img alt="icon-img" src={TrashDarkIcon} style={{ height: '18px', width: '18px' }} />
                  </IconButton>
                </Tooltip>

              </>
              : parseInt(USER_ROLE.SUPPER_ADMIN) === userRole ?
                <>
                  <Tooltip TransitionComponent={Zoom} title='Edit'>
                    <IconButton onClick={() => { handleArticleInfo(params.row) }} >
                      <img alt="icon-img" src={EditDarkIcon} style={{ height: '18px', width: '18px' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip TransitionComponent={Zoom} title='Delete'>
                    <IconButton onClick={() => handleOpenArticle(params.row.articleId)} >
                      <img alt="icon-img" src={TrashDarkIcon} style={{ height: '18px', width: '18px' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip TransitionComponent={Zoom} title='View'>
                  <IconButton onClick={() => { handleArticleInfo(params.row) }} >
                    <img alt="icon-img" src={ViewDarkIcon} style={{ height: '18px', width: '18px' }} />
                  </IconButton>
                </Tooltip>
                </> : <Tooltip TransitionComponent={Zoom} title='View'>
                  <IconButton onClick={() => { handleArticleInfo(params.row) }} >
                    <img alt="icon-img" src={ViewDarkIcon} style={{ height: '18px', width: '18px' }} />
                  </IconButton>
                </Tooltip>
            }


          </Stack>
        )
      }
    }



  ]


  return (
    <>
      <Grid>
        <CommonKnowledge />
      </Grid>
      <Grid container sx={{ display: 'flex', mt: '10px' }}>
        <Grid
          item
          md={3}
          sm={12}
          xs={12}
          sx={{
            padding: '0px 0px 15px 0px',
            borderRight: "1px solid lightgray",
            backgroundColor: '#F5F7F9'
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box
              sx={{

                padding: '15px 15px 14px 15px',
                fontSize: '16px',
                fontFamily: 'Mazzard',
                fontWeight: "500",
                textTransform: "capitalize"
              }}
            >
              Folders<span style={{ fontSize: "14px" }}>({folderCount ? folderCount : 0})</span>

            </Box>
            <Box sx={{ marginRight: '5%', cursor: 'pointer' }} >
              <Box sx={isOpened ? { display: 'none' } : {}}>
                <Tooltip arrow title="Search">

                  <img src={Search} alt='search-img' style={{ width: '19px', height: '19px' }} onClick={handleDisplayInputField} />

                </Tooltip>
              </Box>
              {isOpened ? (<InputBase
                size='small'
                sx={{ border: '1px solid lightgray', p: 1, borderRadius: 1, background: '#fff !important', color: '#323A49' }}
                placeholder='Search Folder'
                name="search"
                onChange={optimisedVersion}
                startAdornment={
                  <InputAdornment sx={{ mr: 3 }} position='start'>
                    <img src={Search} alt='search-img' style={{ width: '19px', height: '19px' }} />
                  </InputAdornment>
                }
              />)
                : ''}
            </Box>
          </Box>

          <Grid sx={{
            height: "69vh",
            overflowY: "auto"
          }}>
            <Box>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', paddingTop: 0 }} component='nav'>
                {
                  folder && folder.length > 0 ?
                    folder.map((item: any, index: number) => {

                      return (
                        <>
                          <ListItemButton
                            sx={{ background: item.folderId === state || item.folderId === folderId ? "lightgray" : "#ffffff", '&:hover': { background: item.folderId === state || item.folderId === folderId ? "lightgray" : "#ffffff" } }}
                            className='main-knowledge'
                            onClick={() => { openFolderArticle(item.folderId), setPage(1), setRecord(50) }}
                            style={open ? toggleStyle : withoutToggleStyle}
                            key={index}
                          >
                            <ListItemIcon>
                              <img src={folder_icon} style={{ width: '19px', height: '19px' }} alt='folder_img' />
                            </ListItemIcon>
                            <Tooltip title={item.name}>
                              <ListItemText sx={{ fontSize: '16px', fontFamily: 'Mazzard', textTransform: "capitalize" }} primary={item.name.length < 25 ? item.name : `${item.name.substring(0, 25)}...`} />
                            </Tooltip>
                            {/* <Tooltip title={open && item.catId === categoryId ? 'Hide Category' : 'Show Category'}> */}

                            {
                              parseInt(USER_ROLE.ORG_ADMIN) === userRole && item.type == USER_ROLE.ORG_ADMIN ?
                                <>
                                  <Tooltip title="Edit">
                                    <img
                                      onClick={() => handleClickOpenFolder(item.folderId)}
                                      src={Edit}
                                      alt='edit_img'
                                      className='knowledge_edit_icon'
                                      style={{ width: '18px', height: '18px' }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="Delete">

                                    <img alt="Delete Category" src={TrashDarkIcon} className='knowledge_edit_icon'
                                      style={{ marginLeft: '5px', width: '18px', height: '18px' }}
                                      onClick={() => handleOpenFolder(item.folderId)}
                                    />
                                  </Tooltip>
                                </>
                                : parseInt(USER_ROLE.SUPPER_ADMIN) === userRole ?
                                  <>
                                    <Tooltip title="Edit">
                                      <img
                                        onClick={() => handleClickOpenFolder(item.folderId)}
                                        src={Edit}
                                        alt='edit_img'
                                        className='knowledge_edit_icon'
                                        style={{ width: '18px', height: '18px' }}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <img alt="Delete Category" src={TrashDarkIcon} className='knowledge_edit_icon'
                                        style={{ marginLeft: '5px', width: '18px', height: '18px' }}
                                        onClick={() => handleOpenFolder(item.folderId)}
                                      />
                                    </Tooltip>
                                  </>
                                  : ''

                            }


                            {/*  </Tooltip> */}
                          </ListItemButton >
                        </>
                      )
                    })
                    : <Typography sx={{ fontSize: '15px', fontWeight: '400', marginLeft: '8px', paddingTop: '5px' }}>Folder not available</Typography>
                }
                {/*   {listCategory &&
                  listCategory.map((item: any, index: number) => {

                    return (
                      <>
                        <ListItemButton
                          ref={item.catId === scrollId ? myRef : null}
                          sx={{ background: item.catId === state || item.catId === catId ? "lightgray" : "#ffffff", '&:hover': { background: item.catId === state || item.catId === catId ? "lightgray" : "#ffffff" } }}
                          className='main-knowledge'
                          onClick={() => handleCategoryFolderList(item.catId)}
                          style={open ? toggleStyle : withoutToggleStyle}
                          key={index}
                        >
                          <ListItemIcon>
                            <img src={Category} style={{ width: '19px', height: '19px' }} alt='article_icon' />
                          </ListItemIcon>
                          <Tooltip title={item.name}>
                            <ListItemText sx={{ fontSize: '16px', fontFamily: 'Mazzard', textTransform: "capitalize" }} primary={item.name.length < 25 ? item.name : `${item.name.substring(0, 25)}...`} />
                          </Tooltip>
                          {/* <Tooltip title={open && item.catId === categoryId ? 'Hide Category' : 'Show Category'}> 
      
                          {
                          parseInt(USER_ROLE.ORG_ADMIN) === userRole && item.type == USER_ROLE.ORG_ADMIN ?
                          <>
                          <img
                            onClick={() => handleClickOpenCategory(item.catId)}
                            src={Edit}
                            alt='edit_img'
                            className='knowledge_edit_icon'
                            style={{ width: '19px', height: '19px' }}
                          />
                          <img alt="Delete Category" src={TrashDarkIcon} className='knowledge_edit_icon'
                          style={{marginLeft:'5px'}}
                          onClick={() => handleOpen(item.catId)}
                            />
                          </>
                          : parseInt(USER_ROLE.SUPPER_ADMIN) === userRole ?
                          <img
                          onClick={() => handleClickOpenCategory(item.catId)}
                          src={Edit}
                          alt='edit_img'
                          className='knowledge_edit_icon'
                          style={{ width: '19px', height: '19px' }}
                        /> :''
                          
                          }

                          {open && item.catId === categoryId ? <ExpandMore /> : <ExpandLess /> }
                     {/*  </Tooltip> 
                        </ListItemButton >
                        {
                          folder && folder.length <= 0 && item.catId === catId ? <>
                            <Collapse sx={{ paddingLeft: '10px' }} in={open} timeout='auto' unmountOnExit key={index}>
                              <List component='div' disablePadding>
                                <ListItemButton sx={{ pl: 4 }} className='empty-knowledge'>
                                  <span style={{ fontSize: "13px", fontFamily: "Mazzard-regular", color: "rgba(58, 53, 65, 0.87)" }}>This category is empty</span>
                                </ListItemButton>
                              </List>
                            </Collapse>
                          </> :
                            folder && item.catId === catId && folder.map((items: any, index: number) => {

                              return (
                                <>
                                  <Collapse sx={{ paddingLeft: '10px' }} in={open} timeout='auto' unmountOnExit key={index} onClick={() => openFolderArticle(items.folderId)}>
                                    <List component='div' disablePadding>
                                      <ListItemButton sx={{ pl: 4, background: folderId === items.folderId ? "#e0e1e19e" : "#ffffff", '&:hover': { background: item.catId === state || item.catId === catId ? "#e0e1e19e" : "#ffffff" } }} className='main-knowledge'>
                                        <ListItemIcon>
                                          <img src={folder_icon} style={{ width: '19px', height: '19px' }} alt='folder_img' />
                                        </ListItemIcon>
                                        <Tooltip title={items.name}>
                                          <ListItemText sx={{ fontSize: '16px', fontFamily: 'Mazzard' }} primary={items.name.length < 25 ? items.name : `${items.name.substring(0, 25)}...`} /></Tooltip>
                                         { parseInt(USER_ROLE.ORG_ADMIN) === userRole && item.type == USER_ROLE.ORG_ADMIN ?
                                        <Box className='knowledge_edit_icon' sx={{ fontSize: '15px' }} onClick={() => handleClickOpenFolder(items.folderId)}>
                                          <EditIcon />
                                        </Box>
                                        : parseInt(USER_ROLE.SUPPER_ADMIN) === userRole ?
                                        <Box className='knowledge_edit_icon' sx={{ fontSize: '15px' }} onClick={() => handleClickOpenFolder(items.folderId)}>
                                        <EditIcon />
                                      </Box>
                                      :''
                                       }
                                      </ListItemButton >
                                    </List >
                                  </Collapse >
                                </>
                              )
                            })
                        }
                      </>
                    )
                  })} */}
              </List >
            </Box >
          </Grid >
        </Grid >


        <Grid item md={9} sm={12} xs={12} sx={{
          backgroundColor: '#ffffff', height: "69vh",
          overflowY: "auto"
        }}>

          {article && catId ?
            <DataGrid
              className='knowledgeArticle_grid'
              autoHeight
              pagination
              rows={article}
              pageSize={pageSize}
              getRowId={article => article.articleId}
              disableSelectionOnClick
              columns={defaultColumns}
              checkboxSelection={false}
              rowsPerPageOptions={[7, 10, 25, 50]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              onPageChange={newPageNo => setPage(newPageNo)}
              disableColumnMenu
            />
            : " "}
        </Grid>


        {/* category edit dialogue */}
        <Dialog
          fullWidth
          maxWidth='sm'
          open={folderEditDialogue}
          onClose={handleCloseFolder}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <EditFolder handleCloseFolder={handleCloseFolder} handleCategoryFolderList={handleCategoryFolderList} />


        </Dialog>
        {/* end category edit dialogue */}
        {/* delete Article modal */}
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
              Delete Folder
            </Typography>
            <p id='child-modal-description'>Are you sure you want to delete this Folder?</p>

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
        {/* delete Folder modal */}
        <Modal
          hideBackdrop
          open={openArticle}
          onClose={handleCloseArticle}
          aria-labelledby='child-modal-title'
          aria-describedby='child-modal-description'
          sx={{ backgroundColor: '#00000075' }}

        >
          <Box sx={{ ...style }}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Delete Article
            </Typography>
            <p id='child-modal-description'>Are you sure you want to delete this Article?</p>

            <Button
              variant='contained'
              size='small'
              sx={{ marginRight: 2, mb: 0, textTransform: 'capitalize' }}
              onClick={() => deleteArticle(deleteArticleId)}
            >
              Ok
            </Button>
            <Button variant='outlined' size='small' sx={{ textTransform: 'capitalize' }} onClick={handleCloseArticle}>
              Cancel
            </Button>
          </Box>
        </Modal>

      </Grid >

    </>
  )
}

export default KnowledgeCategory
