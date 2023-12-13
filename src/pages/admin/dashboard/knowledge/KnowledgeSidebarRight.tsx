import React, { useEffect } from 'react'
import {
  Grid, Box, MenuItem, InputLabel, FormControl, Select, OutlinedInput, Typography
} from '@mui/material'


//list item
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { toast } from 'react-toastify'

//import icon
import AddBoxIcon from '@mui/icons-material/AddBox'
import { API_PATHS } from 'src/config/api.config'
import KnowledgeContext from 'src/context/knowledgeProvider'
import TemplatePreview from './template/templatePreview'
import AddFolder from './AddFolder'

const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

function KnowledgeSidebarRight() {
  const [opens, setOpen] = React.useState(true)
  const [openArticle, setOpenArticle] = React.useState(true)
  const [templateData, setTemplateData] = React.useState<Array<any>>([])
  const [folderData, setFolderData] = React.useState<Array<any>>([])
  const { categoryIdforAddArticle, setfolderIdaddarticle, setaddTagaddarticle, categoryopen,
    setApplyTemplateID, draftArticleCatId, draftArticleFolderId, draftArticleaddTag,
    setCategoryopen, refreshsidebarright, setPreviewArticleId, setDraftArticleaddTag, setcategoryIdforAddArticle, setDraftArticleCatId, FirstCatFolder, addFolder } = React.useContext<any>(KnowledgeContext)
  const [folderId, setFolderId] = React.useState(0)
  const [addtags, setAddTag] = React.useState('')
  const ListInnerRef = React.useRef<any>()
  const [page, setPage] = React.useState(1)
  const [record] = React.useState<any>(10)
  const [listCategory, setListCategory] = React.useState<any>([])
  const [categoryId, setCategoryId] = React.useState(0)
  const [templateCount, setTemplateCount] = React.useState(0)
  const templateCountText = 'Template(' + templateCount + ')'
  setfolderIdaddarticle(folderId)
  setaddTagaddarticle(addtags)

  //setcategoryIdforAddArticle(categoryId)

  const toggleStyle = {
    boxShadow: '0 6px 12px rgb(0 0 0 / 5%), 0 1px 4px rgb(0 0 0 / 15%)',
    borderTop: '0.5px solid ebeef0',
    background: "#F5F7F9"
  }

  const withoutToggleStyle = {
    borderTop: '0.5px solid #ebeef0',
    borderBottom: '0.5px solid #ebeef0',
    background: "#F5F7F9"
  }

  const [openTemplateViewModal, setOpenTemplateViewModal] = React.useState<boolean>(false)
  const toggleTemplateViewdModalOpen = () => {
    setOpenTemplateViewModal(true)

  }
  const toggleChangePasswordModalclose = () => {
    setOpenTemplateViewModal(!openTemplateViewModal)
  }

  const handleClick = () => {
    setOpen(!opens)
  }

  const handleOpenArticle = () => {
    setOpenArticle(!openArticle)
  }

  const handleChangefolder = (e: any) => {
    setFolderId(e.target.value)
    setfolderIdaddarticle(e.target.value)
  }
  const handleChangeAddTag = (e: any) => {
    setAddTag(e.target.value)
  }
  const handleTemplateInsert = (templateId: any) => {
    setApplyTemplateID(templateId)
  }
  const handleChangeCategory = (e: any) => {
    setCategoryId(e.target.value)
    setDraftArticleCatId(e.target.value)
    setcategoryIdforAddArticle(e.target.value)
  }

  // scrolling through get height
  const handleScroll = () => {
    if (ListInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = ListInnerRef.current
      if (scrollTop + clientHeight > scrollHeight - 1) {
        setPage(page + 1)
      }
    }
  }
  const fetchAllTemplateData = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.template}/?sortBy=createdAt&sortOrder=DESC&pageNumber=${page}&recordsPerPage=${record}`)
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
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
        setTemplateData(olddata => {
          return [...olddata, ...result.payload.data]
        })
        setTemplateCount(result.pager.totalRecords)
      }
      else {
        toast.error('Something went Wrong')
      }
    }
    catch (ex: any) {
      console.log(ex)
    }
  }


  const fetchAllFolder = async () => {
    if(categoryIdforAddArticle > 0)
    {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.folder}?showAll=true&search={"catId":${categoryIdforAddArticle}}`)
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
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
        setFolderData(result.payload.data)
        const firstFolder = result.payload.data[0]
        if (firstFolder != undefined) {
          setFolderId(firstFolder.folderId)
        }
      }
      else {

        // toast.error(result.message)

      }
    } catch (ex: any) {
      console.log("catch", ex)
    }
  }
  }

  const fetchAllFolderListByDraftArticle = async () => {
    if (draftArticleCatId > 0) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.folder}?showAll=true&search={"catId":${draftArticleCatId}}`
      )
      const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
      try {
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
          setFolderData(result.payload.data)
          setCategoryId(draftArticleCatId)
          setFolderId(draftArticleFolderId)
          setAddTag(draftArticleaddTag)
        }
        else {
          toast.error('Something went wrong')
        }
      } catch (ex: any) {
        console.log(ex)
      }
    }
  }
  const getCategoryDetails = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}?showAll=true&isMyCat=1`)
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
        setListCategory(result.payload.data)
        const firstFolder = result.payload.data[0]
        if (firstFolder != undefined) {
          setCategoryId(firstFolder.catId)
          setcategoryIdforAddArticle(firstFolder.catId)

        }
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }

  }
  const fetchAllFolderAgainstselectedCategory = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.folder}?showAll=true&search={"catId":${categoryId}}`
    )
    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    try {
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
        setFolderData(result.payload.data)
        const firstFolder = result.payload.data[0]
        if (firstFolder != undefined) {
          setFolderId(firstFolder.folderId)
        }
      }
      else {
        toast.error('Something went wrong')
      }
    } catch (ex: any) {
      console.log(ex)
    }
  }
  const RefreshArticleform = () => {

    getCategoryDetails()
    setaddTagaddarticle('')
    setDraftArticleaddTag('')
    setPreviewArticleId(0)
    setApplyTemplateID(0)
  }

  /* useEffect(() => {
    fetchAllFolder()
    getCategoryDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdforAddArticle]) */

  useEffect(() => {

    fetchAllFolder()
     getCategoryDetails()
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FirstCatFolder, addFolder])

  useEffect(() => {
    fetchAllTemplateData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    fetchAllFolderListByDraftArticle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftArticleFolderId, draftArticleaddTag])

  useEffect(() => {
    if(draftArticleFolderId == 0)
    {
    fetchAllFolderAgainstselectedCategory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId,draftArticleFolderId])

  useEffect(() => {
    RefreshArticleform()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshsidebarright])

  return (
    <>
      <Grid >
        <Box>
          {categoryopen ? <AddFolder /> : ''}
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', paddingTop: " 22px" }} component='nav'>
            <Grid sx={{ borderLeft: "1px solid #cfd7df", boxShadow: "0 2px 5px 0 #cfd7df" }}>

              {/* start article property */}
              <ListItemButton onClick={handleOpenArticle} style={openArticle ? toggleStyle : withoutToggleStyle}>
                <ListItemText sx={{ fontSize: '16px', fontFamily: 'Mazzard' }} primary='Article Properties' />
                {openArticle ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse sx={{ paddingLeft: '10px' }} in={openArticle} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  <FormControl fullWidth sx={{ background: '#ffffff', marginTop: '20px' }}>
                    <InputLabel id='status-select'>Category*</InputLabel>
                    <Select id='Category' name='Category' labelId='Folder-select' label='Category' value={categoryId}
                      onChange={handleChangeCategory}>
                      {listCategory &&
                        listCategory.map((item: any) => {
                          return (
                            <MenuItem value={item.catId} key={item.folderId} sx={{ textTransform: 'capitalize' }} >
                              {item.name}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  </FormControl>
                  <Typography
                    sx={{ textAlign: 'right', color: '#2D4ACD', fontSize: '14px', cursor: 'pointer', marginTop: "7px" }}
                    onClick={() => {
                      setCategoryopen(true)
                    }}
                  >Create New Folder

                  </Typography>
                  <FormControl fullWidth sx={{ background: '#ffffff', marginTop: '10px' }}>
                    <InputLabel id='status-select'>Folder*</InputLabel>
                    <Select id='Folder' name='Folder' labelId='Folder-select' label='Folder' value={folderId}
                      onChange={handleChangefolder}>
                      {folderData.map((folder: any) => {

                        return (

                          <MenuItem value={folder.folderId} key={folder.folderId} sx={{ textTransform: 'capitalize' }} >
                            {folder.name}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ background: '#ffffff', marginTop: "20px" }}>
                    <InputLabel>Add Tags</InputLabel>
                    <OutlinedInput sx={{ marginBottom: '20px' }} label='Add Tags' name='addtags' id='addtags'
                      value={addtags} onChange={handleChangeAddTag}
                    />
                  </FormControl>
                </List>
              </Collapse>
              {/* end article property */}

              <ListItemButton
                className='main-knowledged-article'
                onClick={handleClick}
                style={opens ? toggleStyle : withoutToggleStyle}
              >
                <ListItemText sx={{ fontSize: '16px', fontFamily: 'Mazzard' }} primary={templateCountText} />

                {opens ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse sx={{ paddingLeft: '10px' }} in={opens} timeout='auto' unmountOnExit>
                <Grid
                  item
                  xs={12}
                  md={12}
                 
                >
                  <List component='div' disablePadding  sx={{ height: 'calc(100vh - 550px)', overflowY: 'auto'}}
                  ref={ListInnerRef}
                    onScroll={handleScroll} >
                    {templateData &&
                      templateData.map((item: any, index: number) => {
                        return (
                          <span onClick={() => handleTemplateInsert(item.templateId)} key={index}>
                            <ListItemButton
                              sx={{ pl: 4, fontSize: '14px', fontFamily: 'Mazzard' }}
                              className='main-knowledge-showArticle'
                              key={index}
                              onClick={() => toggleTemplateViewdModalOpen()}
                            >

                              {/*  [Sample] */}
                              <ListItemText
                                sx={{ fontSize: '14px !important', fontFamily: 'Mazzard', marginLeft: '3px' }}
                                primary={item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title}
                              />



                              {/* onChange={() => setDescription(item.content)} */}
                              <Box className='knowledge_edit_icon' sx={{ fontSize: '15px' }}>
                                <AddBoxIcon />
                              </Box>
                            </ListItemButton>
                          </span>
                        )
                      })}
                  </List>
                </Grid>
              </Collapse>
            </Grid>
          </List>
        </Box>
      </Grid>
      <TemplatePreview open={openTemplateViewModal} onClose={toggleChangePasswordModalclose} />
    </>
  )
}

export default KnowledgeSidebarRight
