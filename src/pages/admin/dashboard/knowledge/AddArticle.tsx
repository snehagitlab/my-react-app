import React, { useState, useEffect } from 'react'
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import KnowledgeSidebarRight from './KnowledgeSidebarRight'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

//icon
import Close from 'mdi-material-ui/Close'
import file_icon from 'src/assets/Images/user_Icons/light/file_icon.png'
import Pdf_img from 'src/assets/Images/user_Icons/light/pdf_img.png'
import view_img from 'src/assets/Images/user_Icons/light/view_img.png'
import delete_img from 'src/assets/Images/user_Icons/light/delete_img.png'
import upload_img from '../../../../assets/Images/user_Icons/light/folder-add.png'

//import toasify
import { toast } from 'react-toastify'

//import react-router-dom
import { useLocation,  useNavigate } from 'react-router-dom'

//import config fiile
import { API_PATHS, FILE_TYPE } from 'src/config/api.config'

//import component
import KnowledgeContext from 'src/context/knowledgeProvider'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import LoadingButton from '@mui/lab/LoadingButton'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize"

// import env file
const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC

// import file upload type
const fileType: any = parseInt(FILE_TYPE.ARTICLE_ATTACHMENT)

//image before url
const imagePath = 'https://storage.googleapis.com/'



function AddArticle() {
  const { categoryIdforAddArticle, folderIdaddarticle, addTagaddarticle,
    selectedTemplateId, setSelectedTemplateId, setPreviewArticleId, setDraftArticleCatId, draftArticleCatId,
    setDraftArticleFolderId, setDraftArticleaddTag, refreshAddArticleform, previewArticleId, description, setDescription,setDraftDisplay,setCategoryName } = React.useContext<any>(KnowledgeContext)
  const location: any = useLocation()
  const state: any = location.state
  const [articleIdDirection, setArticleIdDirection] = useState<any>()
  const [catName, setCatName] = useState<string>('')
  const [title, setTitle] = useState('')
  const [filterData1, setFilterData1] = React.useState<any>([])
  const [imgPath1, setImagePath1] = React.useState<any>([])
  const [previewImgDisplay, setPreviewImgDisplay] = useState<any>([])
  const [imgPath, setImagePath] = React.useState<any>([])
  const [previewImage, setPreviewImage] = useState<any>([])
  const [viewImg, setviewImg] = React.useState<any>(false);
  const [imgUrlpopup, setImgUrlPopup] = React.useState<any>()
  const [filterData, setFilterData] = React.useState<any>([])
  const [disable, setDisable] = React.useState(false)
  const [addPublishLoading, setPublishLoading] = React.useState(false)


  const getCategoryName = async () => {
    if (!articleIdDirection) {
    } else {
      if (articleIdDirection > 0) {
        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}/detail?catId=${articleIdDirection}`)
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
            setCatName(result.payload.data.name)
          }
        } catch (error: any) {
          toast.error(error.message)
        }
      }
    }

  }

  useEffect(() => {
    getCategoryName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleIdDirection])



  const handletitleChange = (e: any) => {
    setTitle(e.target.value)
  }
  const navigate = useNavigate()

  const handleGeteditFile = async (e: any) => {
    const imgData1: any = Array.from(e.target.files)
    const array1: any = []
    const base64Img1: any = []
    for (const file of imgData1) {
      if (
        file.name.split('.').pop() == 'png' ||
        file.name.split('.').pop() == 'jpeg' ||
        file.name.split('.').pop() == 'jpg' ||
        file.name.split('.').pop() == 'pdf' ||
        file.name.split('.').pop() == 'txt'
      ) {
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
  const handlePublishArticle = async () => {
    setPublishLoading(true)
    const isEmpty = description
    if (isEmpty != '' && webContent != '') {
      toast.error('You can not add webcontent and description in same article')
      setPublishLoading(false)

    }
    else {
      if (categoryIdforAddArticle != "" ) {
      if (folderIdaddarticle != "") {
      if (title != "" ) {
        //file uploading apin calling
        const array: any = []
        if (filterData.length > 0) {
          const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
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
              const Imgdata = response.data.payload.filesPath

              if (Imgdata) {
                for (let i = 0; i < Imgdata.length; i++) {
                  array.push(Imgdata[i]['filePath'])
                }
              }
            } else {
              console.log(response)
              setPublishLoading(false)
            }
          }
          catch (error: any) {
            toast.error(error.response.data.message)
            setImagePath([])
            setFilterData([])
          }
        }

        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}`)
        const user = JSON.parse(localStorage.getItem('userData') || '{}')
        const requestData = {}
        Object.assign(requestData, { title: title })
        Object.assign(requestData, { content: description })
        Object.assign(requestData, { hashTag: addTagaddarticle })
        Object.assign(requestData, { catId: categoryIdforAddArticle })
        Object.assign(requestData, { folderId: folderIdaddarticle })
        Object.assign(requestData, { isPublish: true })
        Object.assign(requestData, { webContent: webContent })
        Object.assign(requestData, { videoLink: '' })
        if (array.length > 0) {
          Object.assign(requestData, { attachment: array && JSON.stringify(array) })
        }

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
            handlePreviewArticle(result.payload.data.articleId)
            setPreviewArticleId(result.payload.data.articleId)
            setSelectedTemplateId(0)
            setPublishLoading(false)
            setDraftArticleFolderId(0)

          } else {
            setDisable(false)
            toast.error(result.message)
            setPublishLoading(false)

          }
        } catch (ex: any) {
          setDisable(false)
          toast.error(ex.message)
          setPublishLoading(false)

        }
      }
      else {
        setDisable(false)
        setPublishLoading(false)
        toast.error("Title is required!")

      }
    }
    else {
      setDisable(false)
      setPublishLoading(false)
      toast.error("Folder  is requiered!")

    }
  }
  else {
    setDisable(false)
    setPublishLoading(false)
    toast.error("Category is requiered!")

  }
    }


  }

  const openPreviewImgModal = (prevImgUrl: any) => {
    setPreviewImgDisplay(`${imagePath}${prevImgUrl}`)
    setviewImg(true)
  }
  const handleDeleteEditImg = (id: any) => {
    setPreviewImage(previewImage.filter((_: any, i: any) => i !== id))
  }
  const handleEditImgClick = (id: any) => {
    setImagePath1(imgPath1.filter((_: any, i: any) => i !== id))
    setFilterData1(filterData1.filter((_: any, i: any) => i !== id))
  }
  const handleSaveArticle = async () => {
    setDisable(true)
    const isEmpty = description
    if (isEmpty != '' && webContent != '') {
      toast.error('You can not add webcontent and decription in same article')
      setDisable(false)

    }
    else {
      if(categoryIdforAddArticle != "")
      {
      if(folderIdaddarticle != "")
      {
      if (title != "") {

        //file uploading apin calling
        const array: any = []
        if (filterData.length > 0) {
          const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
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
        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}`)
        const user = JSON.parse(localStorage.getItem('userData') || '{}')
        const requestData = {}
        Object.assign(requestData, { title: title })
        Object.assign(requestData, { content: description })
        Object.assign(requestData, { hashTag: addTagaddarticle })
        Object.assign(requestData, { catId: categoryIdforAddArticle })
        Object.assign(requestData, { folderId: folderIdaddarticle })
        Object.assign(requestData, { isPublish: false })
        Object.assign(requestData, { webContent: webContent })
        Object.assign(requestData, { videoLink: '' })
        if (array.length > 0) {
          Object.assign(requestData, { attachment: array && JSON.stringify(array) })
        }


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
            setDisable(false)
            toast.success('Article saved successfully')
            handlePreviewArticle(result.payload.data.articleId)
            setPreviewArticleId(result.payload.data.articleId)
            setSelectedTemplateId(0)
            setDraftArticleFolderId(0)
          } else {
            setDisable(false)

            toast.error(result.message)
          }
        } catch (ex: any) {
          setDisable(false)

          toast.error(ex.message)
        }
      }
      else {
        setDisable(false)

        toast.error("Title is required!")
      }
    }else{
      setDisable(false)
      toast.error("Folder is required!")
    }
   }else{
      setDisable(false)
      toast.error("Category is required!")
    }

    }
  }
  const handleCancelArticle = () => { setSelectedTemplateId(0), navigate(-1) ,setDraftArticleFolderId(0) }

  const handlePreviewArticle = (row: any) => {setDraftArticleFolderId(0), navigate('/knowledge/article/preview', { state: row }) }

  const templateUsingArticleDetailView = async () => {
    if (selectedTemplateId > 0) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.template}/detail?templateId=${selectedTemplateId}`)
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
          const data = result.payload.data
          setTitle(data.title)
          const description = data.content
          setDescription(description)
        } else {
          toast.error(result.message)
        }
      } catch (ex: any) {
        toast.error(ex.message)
      }
    }
  }
  const EditViewUsingDraftArticleDetailView = async () => {
    if (state != null && state.articleId > 0 && state.articleId != null) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}/detail?articleId=${state.articleId}`)
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
          setArticleIdDirection(result.payload.data.catId)
          setPreviewArticleId(state.articleId)
          const data = result.payload.data
          setTitle(data.title)
          const description = data.content
          setDescription(description)
          setDraftArticleCatId(data.catId)
          setDraftArticleFolderId(data.folderId)
          setDraftArticleaddTag(data.hashTag)
          setPreviewImage(JSON.parse(data.attachment))
          setwebContent(data.webContent)

        } else {
          toast.error(result.message)
        }
      } catch (ex: any) {
        toast.error(ex.message)
      }
    }
  }

  const handleUpdatePublishArticle = async (isPublishFlag:any) => {
    isPublishFlag ? setPublishLoading(true) :  setDisable(true)
   
    const isEmpty = description
    if (isEmpty != '' && webContent != '') {
      toast.error('You can not add webcontent and decription in same article')
      isPublishFlag ? setPublishLoading(false) :  setDisable(false)

    }
    else {
      if (state.articleId > 0) {

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

              }
            } else {
              console.log(response)

            }
          } catch (error: any) {
            console.log(error.response)
            setImagePath1([])
            setFilterData1([])
          }
        }

        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}?articleId=${state.articleId}`)
        const user = JSON.parse(localStorage.getItem('userData') || '{}')
        const requestData = {}
        Object.assign(requestData, { title: title })
        Object.assign(requestData, { content: description })
        Object.assign(requestData, { hashTag: addTagaddarticle })
        Object.assign(requestData, { catId: draftArticleCatId })
        Object.assign(requestData, { folderId: folderIdaddarticle })
        Object.assign(requestData, { isPublish: isPublishFlag })
        Object.assign(requestData, { webContent: webContent })
        Object.assign(requestData, { videoLink: '' })
        if (previewImage == null) {
          Object.assign(requestData, { attachment: JSON.stringify(array1) })
        } else {
          Object.assign(requestData, {
            attachment: [...previewImage, ...array1] && JSON.stringify([...previewImage, ...array1])
          })
        }


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
            isPublishFlag ? setPublishLoading(false) :  setDisable(false)   
            isPublishFlag ? toast.success('Article Published successfully') :toast.success('Article Saved successfully')
            handlePreviewArticle(result.payload.data.articleId)
            setPreviewArticleId(result.payload.data.articleId)
            setSelectedTemplateId(0)
            setPublishLoading(false)

          } else {
            isPublishFlag ? setPublishLoading(false) :  setDisable(false)   
            toast.error(result.message)
          }
        } catch (ex: any) {
          isPublishFlag ? setPublishLoading(false) :  setDisable(false)   

          toast.error(ex.message)
        }
      }
      else {
        isPublishFlag ? setPublishLoading(false) :  setDisable(false)   
        toast.error('Article Id Not Found')
      }
    }
  }
  const RefreshArticleForm = async () => {
    setTitle('')
    setDescription('')
  }

  const openViewImgModal = (imgUrl: any) => {
    setImgUrlPopup(imgUrl)
    setviewImg(true)
  }


  const handleGetFile = async (e: any) => {
    const imgData: any = Array.from(e.target.files)
    const array: any = []
    const base64Img: any = []
    for (const file of imgData) {
      if (
        file.name.split('.').pop() == 'png' ||
        file.name.split('.').pop() == 'jpeg' ||
        file.name.split('.').pop() == 'jpg' ||
        file.name.split('.').pop() == 'pdf' ||
        file.name.split('.').pop() == 'txt' ||
        file.name.split('.').pop() == 'doc' ||
        file.name.split('.').pop() == 'xsl' ||
        file.name.split('.').pop() == 'csv'
      ) {
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



  const handleViewImgClose = () => {
    setviewImg(false)
    setImgUrlPopup("")
  }

  const handleClick = (id: any) => {
    setImagePath(imgPath.filter((_: any, i: any) => i !== id))
    setFilterData(filterData.filter((_: any, i: any) => i !== id))
  }

  useEffect(() => {
    templateUsingArticleDetailView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId])

  useEffect(() => {
    EditViewUsingDraftArticleDetailView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  useEffect(() => {
    RefreshArticleForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshAddArticleform])

  //change web content
  const [webContent, setwebContent] = useState('')
  const handlewebcontentChange = (e: any) => {

    setwebContent(e.target.value);

  }

  const handleMoveCateogry = (id: any, name: any) => {
    navigate('/knowledge/category', { state: id })
    setDraftDisplay(false)
    setCategoryName(name)
  }


  return (
    <>
      <Grid>
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
                  <Grid item  sx={{ color: "#2D4ACD" }}><span style={{ cursor: 'pointer' }} onClick={() => {
                       navigate('/knowledge')
              }}>Knowledge Base</span>  <span style={{ cursor: 'pointer' }} onClick={() => {
                    handleMoveCateogry(articleIdDirection, catName)
                  }}>{catName && '- '+catName}</span>
                  </Grid>
          <Grid >
            {previewArticleId > 0 ? (


              <Button
                variant='contained'
                sx={{
                  textTransform: 'capitalize',
                  marginLeft: '10px'
                }}
                onClick={() => handlePreviewArticle(previewArticleId)}

              >
                Preview
              </Button>

              /* </Link> */) : ('')}

            <Button
              variant='outlined'
              sx={{
                textTransform: 'capitalize',
                marginLeft: '10px'
              }}
              onClick={() => handleCancelArticle()}

            >
              cancel
            </Button>

            <Button
              variant='outlined'
              sx={{
                textTransform: 'capitalize',
                marginLeft: '10px'
              }}
              onClick={state != null && state.articleId > 0 ? ()=>handleUpdatePublishArticle(false) : handleSaveArticle}
              disabled={disable}
            >

              save
            </Button>


            {
              addPublishLoading ?
                <>
                  <LoadingButton
                    loading={addPublishLoading}
                    variant='contained'
                    disabled
                    sx={{
                      textTransform: 'capitalize',
                      marginLeft: '10px'
                    }}
                  >
                    Publish
                  </LoadingButton>
                </>
                :
                <>  <Button
                  variant='contained'
                  sx={{
                    // display: path === '/knowledge/addArticle' ? 'block' : 'none',
                    textTransform: 'capitalize',
                    marginLeft: '10px'
                  }}
                  onClick={state != null && state.articleId > 0 ? ()=>handleUpdatePublishArticle(true) : handlePublishArticle}

                >
                  Publish
                </Button>
                </>
            }

          </Grid>

        </Grid>
      </Grid>
      <Grid sx={{ display: 'flex' }}>
        <Grid md={9} sx={{ background: '#ffffff' }} className="knowledge-add-article">
          <Grid sx={{ marginTop: '25px', display: 'flex', justifyContent: 'center', }}>
            <FormControl fullWidth>
              <InputLabel>Title*</InputLabel>
              <OutlinedInput
                value={title}
                onChange={handletitleChange}
                label='Title'
                name='Title'
                id='title'
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
            sx={{ marginTop: 7 }}
            className='text-editor-knowledge'
          >

            <CKEditor
              editor={ClassicEditor}
              data={description}
              config={{
                ckfinder: {
                  // Upload the images to the server using the CKFinder QuickUpload command.
                  uploadUrl: `${BASE_URL_PUBLIC}/${API_VERSION}/${API_PATHS.editor}/${API_PATHS.file}?type=${FILE_TYPE.ARTICLE_ATTACHMENT}`
                },
                mediaEmbed: {
                  previewsInData: true
                },
                link: {

                addTargetToExternalLinks: true

              },
              placeholder:'Description'  
            }
              }
              onChange={(event: any, editor: any) => {
                const data = editor.getData();
                setDescription(data)
              }}
            />

          </Grid>
          <Grid container spacing={6} sx={{ marginTop: 1 }}>

            <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel>Web Content</InputLabel>
                <OutlinedInput
                  value={webContent}
                  onChange={handlewebcontentChange}
                  label='Web Content'
                  name='webContent'
                  id='webContent'
                />
              </FormControl>
            </Grid>


          </Grid>
          <Grid item
            xs={12}
            sm={12}
            sx={{ display: 'flex', justifyContent: 'left', marginTop: '10px', position: 'relative' }}
            className='text-editor-knowledge'>

            <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Grid>
                <Grid sx={{ width: '100%', height: 'auto', padding: '10px 0px' }}>
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
                                    <img src={item} alt="img" style={{ height: '74px', width: '74px', opacity: "0.8", background: "#ffffff" }} />
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

                                      <Tooltip title='delete pdf' placement='top'>
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

                                      <Tooltip title='delete file' placement='top'>
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
                                marginRight: '10px',
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
                                marginRight: '10px',
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



                    {state != null && state.articleId > 0 ? (
                      <>
                        <Box
                          sx={{
                            backgroundColor: '#d3d3d3b3',
                            width: '90px',
                            height: '90px',
                            padding: "10px",
                            marginTop: '10px',
                            marginRight: 'auto',
                            position: 'relative',
                            display: "flex",
                          }}
                        >
                          <Button
                            className="fileUpload-box btn"
                          >
                            <img src={upload_img} alt='file_upload' style={{ width: '20px', height: '20px' }} />
                            <input type='file' id='upload-img' className="upload-btn-wrapper" onChange={handleGeteditFile} multiple />
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
                            padding: "10px",
                            marginTop: '10px',
                            marginRight: 'auto',
                            position: 'relative',
                            display: "flex",
                            justifyContent: 'left',
                            alignItems: 'left'

                          }}
                        >
                          <Button
                            className="fileUpload-box btn"
                          >
                            <img src={upload_img} alt='file_upload' style={{ width: '20px', height: '20px' }} />
                            <input type='file' id='upload-img' className="upload-btn-wrapper" onChange={handleGetFile} multiple />
                          </Button>
                        </Box>
                      </>
                    )

                    }

                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>



        </Grid>
        <Grid md={3} sx={{ height: 'calc(100vh - 88px)', overflowY: 'auto', marginTop: '5px' }}>
          <KnowledgeSidebarRight />
        </Grid>
      </Grid>

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
      </Dialog>
    </>
  )
}

export default AddArticle
