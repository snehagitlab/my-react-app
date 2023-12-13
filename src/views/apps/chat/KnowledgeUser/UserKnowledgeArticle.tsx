import React, { useState, useEffect, useRef } from 'react'
import { Grid, Typography, Box, Card, CardContent, /* InputBase, InputAdornment, */ Divider, IconButton } from '@mui/material'

//import imagrs
//import Search from 'src/assets/Images/user_Icons/light/search-normal.svg'

import documentText from '../../../../assets/Images/user_Icons/light/document-textdark.png'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { API_PATHS } from 'src/config/api.config'
import { useNavigate } from 'react-router'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Pdf_img from 'src/assets/Images/user_Icons/light/pdf_img.png'
import file_icon from 'src/assets/Images/user_Icons/light/file_icon.png'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

//icon
import Close from 'mdi-material-ui/Close'

const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const imagePath = 'https://storage.googleapis.com/'

function UserKnowledgeArticle() {
  const navigate = useNavigate()

  //const [text, setText] = useState(true)
  const [title, setTitle] = useState('')
  const [articleDate, setArticleDate] = useState('')
  const [description, setDescription] = useState('')
  const [listArticle, setListArticle] = useState<any>([])
  const { articleid } = useParams()
  const ScrollTopRef = useRef<any>()
  const [catId, setCatId] = useState<any>()
  const [catName, setCatName] = useState<any>()
  const [folderId, setFolderId] = useState<any>(0)
  const [storeAttachment, setStoreAttachment] = React.useState<any>()
  const storeFileAttachment = storeAttachment && JSON.parse(storeAttachment)

  const [viewImg, setviewImg] = React.useState<any>(false);
  const [imgUrlpopup, setImgUrlPopup] = React.useState<any>()
  const [previewImgDisplay, setPreviewImgDisplay] = useState<any>([])
  const [webContent, setwebContent] = useState('')
  const [videoLink, setvideoLink] = useState(0)
  const youtubeLink = 'https://youtube.com/embed/'

  //set date format
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
  const date = new Date(articleDate)
  const article_date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} `


  const getArticleList = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}?showAll=true&search={"isPublish":1,"folderId":${folderId}}`)
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
        setListArticle(result.payload.data)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handlearticleId = (e: any) => {
    const articleid = e.articleId
    navigate(`/user/knowledge/article/${articleid}`)
  }

  const handleGetArticleDetails = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}/detail?articleId=${articleid}`)

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
        setCatId(data.catId)
        setTitle(data.title)
        setArticleDate(data.createdAt)
        setDescription(data.content)
        setFolderId(data.folderId)
        setwebContent(data.webContent)
        setvideoLink(data.videoLink)
        setStoreAttachment(data.attachment)

      } else {
        toast.error(result.message)
      }
    } catch (ex: any) {
      toast.error(ex.message)
    }
  }
  const handleDownloadImg = (imgPath: any) => {
    window.location.href = `${imagePath}${imgPath}`
  }


  const handleGetCategoryName = async () => {
    if (catId) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}/detail?catId=${catId}`)

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
          setCatName(data.name)
        } else {
          toast.error(result.message)
        }
      } catch (ex: any) {
        toast.error(ex.message)
      }
    }
  }

  const handleArticleUsefullYes = async (flag: boolean) => {

    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}/helpful?articleId=${articleid}`)

    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')

    const requestData = {}

    Object.assign(requestData, { isHelpful: flag })


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

      } else {
        toast.error(result.message)
      }
    } catch (ex) {
      console.log(ex)
    }

  }

  useEffect(() => {
    handleGetCategoryName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catId])

  const backtoHomeNavigation = () => {
    navigate('/user/dashboard')
  }

  const backtoKnowledgeNavigation = () => {
    navigate('/user/knowledge')
  }

  const backtoCategoryNavigation = () => {
    navigate(`/user/knowledge/category/${catId}`)
  }

  useEffect(() => {
    getArticleList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, articleid])

  const handleScrollTo = () => {
    ScrollTopRef.current.scrollTo(0, 0);
  };
  const openPreviewImgModal = (prevImgUrl: any) => {
    console.log(prevImgUrl)
    setPreviewImgDisplay(`${imagePath}${prevImgUrl}`)
    setviewImg(true)
  }
  useEffect(() => {
    handleGetArticleDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleid])
  useEffect(() => {
    const imageData: any = []
    storeFileAttachment &&
      storeFileAttachment.length > 0 &&
      storeFileAttachment.map((item: any) => {
        imageData.push(`${imagePath}${item}`)
      })

    if (imageData.length > 0) {
      setPreviewImgDisplay(imageData && imageData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleid])
  const handleViewImgClose = () => {
    setviewImg(false)
    setImgUrlPopup("")
  }

  return (
    <>
      <Grid >
        {/* searching task */}
        <Grid ref={ScrollTopRef} sx={{ width: '100%', margin: 'auto', background: '#F7F7F7', height: 'calc(100vh - 143px)', overflowY: 'scroll' }}>
          <Card sx={{ background: '#ffffff' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Grid sx={{ width: '80%', margin: 'auto' }}>
                <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Grid item><span style={{ cursor: 'pointer' }} onClick={() => {
                    backtoHomeNavigation()
                  }}>Home</span> - <span style={{ cursor: 'pointer' }} onClick={() => {
                    backtoKnowledgeNavigation()
                  }}>Knowledge Base</span> - <span style={{ cursor: 'pointer' }} onClick={() => {
                    backtoCategoryNavigation()
                  }}>{catName && catName}</span></Grid>

                {/*   <Grid item>
                    <InputBase
                      size='small'
                      sx={{ p: 3, borderRadius: '9px', background: '#F7F7F7 !important', color: '#323A49' }}
                      placeholder='Search'
                      name='search'
                      startAdornment={
                        <InputAdornment sx={{ mr: 2 }} position='start'>
                          <img src={Search} alt='search-img' style={{ width: '19px', height: '19px' }} />
                        </InputAdornment>
                      }
                    />
                  </Grid> */}
                </Grid>
                <Grid sx={{ textAlign: 'start', display: 'flex', alignItems: 'center' }}>
                  {/*   <Grid sx={{ marginBottom: '28px', marginRight: '10px' }}>
                  <img src={documentText} alt='document-text' style={{ height: '33px' }} />
                </Grid> */}
                  <Grid>
                    <Typography sx={{ fontSize: '32px', fontWeight: '700', padding: '30px 0px 5px 0px' }}>
                      {//text ? 'How to make payment by support application ?' : 'How to check my attendance ?'
                      }
                      {title.length > 0 ? (title) : ('')}
                    </Typography>
                    <Typography
                      sx={{ fontSize: '17px', fontWeight: '500', padding: '0px 0px 30px 0px', color: '#6c757d' }}
                    >
                      Created at {article_date ? article_date : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {/* end of searching task */}



          <Grid sx={{ padding: '24px 0px 70px 0px' }}>
            <Grid
              container
              sx={{
                width: '85%',
                margin: 'auto ',
                boxShadow: ' 0 6px 19px rgb(39 49 58 / 10%)',
                border: '1px solid #ebeff3',
                borderRadius: '3px'
              }}
            >
              <Grid item xs={9} sx={{ padding: '30px', background: '#fff' }}>
              {videoLink && videoLink != 0 ?
              <Grid sx={{display:'flex',alignItems:'center',justifyContent:'center'}} >
                <iframe src={`${youtubeLink}${videoLink}`} width='50%' height='300px' style={{border:'0'}}></iframe>
                </Grid>
                : ''
                }
              {webContent && webContent != '' ?
              <Grid sx={{marginTop:'20px'}} >
              <iframe src={webContent} width='100%' height='600px' style={{border:'0'}}></iframe>

              </Grid>
              : ''
              }
                <Typography
                  sx={{
                    fontFamily: 'Mazzard-regular',
                    fontWeight: '500',
                    fontSize: '14px',
                    color: ' rgba(42, 58, 81, 0.87)'
                  }}
                  dangerouslySetInnerHTML={{ __html: description }}
                ></Typography>
                <Grid sx={{ width: '100%', height: 'auto', padding: '10px 0px' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: "end" }}>
                  {storeFileAttachment === undefined || storeFileAttachment === null ? (
                    <Typography sx={{ fontSize: '14px' }}></Typography>
                  ) : (
                    storeFileAttachment.map((img: any, id: number) => {

                      return (
                        <>
                          {img.split('.').pop() === "png" || img.split('.').pop() === "jpg" || img.split('.').pop() === "jpeg" ? <>
                            <Grid
                               key={id}
                              spacing={3}
                              sx={{
                                fontFamily: 'Mazzard',
                                fontWeight: '500',
                                fontSize: '19px',
                                color: '#2D4ACD',
                                paddingTop: '8px',
                                display: 'flex'
                              }}
                            >
                              <CustomAvatar
                                variant='square'
                                sx={{
                                  width: { sm: '55px', xs: '55px', md: '64px' },
                                  height: { sm: '55px', xs: '55px', md: '64px' },
                                  marginRight: '14px',
                                  backgroundColor: '#EEEEEE'
                                }}
                              >

                                <img
                                  src={`${imagePath}${img}`}
                                  alt='doc-img'
                                  style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                  onClick={() => openPreviewImgModal(img)}
                                />
                              </CustomAvatar>
                            </Grid>
                          </> :
                            img.split('.').pop() === "pdf" ?
                              <>
                                <a href={`${imagePath}${img}`} target="_blank" rel="noopener noreferrer">
                                  <Grid
                                     key={id}
                                    spacing={3}
                                    sx={{
                                      fontFamily: 'Mazzard',
                                      fontWeight: '500',
                                      fontSize: '19px',
                                      color: '#2D4ACD',
                                      paddingTop: '8px',
                                      display: 'flex'
                                    }}
                                  >
                                    <CustomAvatar
                                      variant='square'
                                      sx={{
                                        width: { sm: '55px', xs: '55px', md: '64px' },
                                        height: { sm: '55px', xs: '55px', md: '64px' },
                                        marginRight: '14px',
                                        backgroundColor: '#EEEEEE'
                                      }}
                                    >
                                      <img
                                        src={Pdf_img}
                                        alt='file'
                                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                      />
                                    </CustomAvatar>
                                  </Grid>
                                </a>
                              </> : <>
                                <Grid
                                   key={id}
                                  onClick={() => handleDownloadImg(img)}
                                  spacing={3}
                                  sx={{
                                    fontFamily: 'Mazzard',
                                    fontWeight: '500',
                                    fontSize: '19px',
                                    color: '#2D4ACD',
                                    paddingTop: '8px',
                                    display: 'flex'
                                  }}
                                >
                                  <CustomAvatar
                                    variant='square'
                                    sx={{
                                      width: { sm: '55px', xs: '55px', md: '64px' },
                                      height: { sm: '55px', xs: '55px', md: '64px' },
                                      marginRight: '14px',
                                      backgroundColor: '#EEEEEE'
                                    }}
                                  >

                                    <img
                                      src={file_icon}
                                      alt='file'
                                      style={{ width: '50px', height: '50px', cursor: 'pointer', opacity: "0.3" }}


                                    />

                                  </CustomAvatar>
                                </Grid>
                              </>}
                              </>
                        
                      )
                    })
                  )}
                </Box>
                </Grid>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ padding: '25px', fontSize: '21px', fontWeight: '700', display: 'flex' }}>
                    Was This article helpful?
                  </Box>
                  <Typography
                    sx={{
                      color: 'red ',
                      padding: ' 5px 27px',
                      margin: '10px',
                      border: '1px solid lightgray',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleArticleUsefullYes(false)}
                  >
                    No
                  </Typography>
                  <Typography
                    sx={{
                      color: 'green',
                      padding: ' 5px 27px',
                      margin: '10px',
                      border: '1px solid lightgray',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleArticleUsefullYes(true)}
                  >
                    Yes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3} sx={{ background: '#f5f7f9', padding: '20px' }}>
                {/* <Grid sx={{ alignItem: 'center', display: 'flex' }}>
                <Box>
                  <img src={documentText} alt='document-text' style={{ height: '23px' }} />
                </Box>
                <Typography sx={{ fontSize: '15px', fontFamily: 'Mazzard', ml: 3, mt: 1 }}>Print</Typography>
              </Grid> */}
                <Box sx={{ fontSize: '17px', mt: 4, fontFamily: 'Mazzard', fontWeight: '500' }}>
                  Articles in this folder -
                </Box>
                {listArticle.length > 0 ? (
                  listArticle &&
                  listArticle.map((item: any, id: any) => {

                    return (
                      articleid == item.articleId ? (' ') : (
                        <a onClick={() => handlearticleId(item)} key={id}>
                          <Grid sx={{ alignItems: 'center', display: 'flex', mt: 3 }}
                          >
                            <img src={documentText} alt='document-text' style={{ height: '20px' }} />

                            <Typography
                              sx={{ fontSize: '14px', fontFamily: 'Mazzard', ml: 3, mt: 1, color: '#2C5CC5', cursor: 'pointer' }}
                              onClick={handleScrollTo}

                            // onClick={/* handleToggle1 */}
                            >
                              {item.title.length > 35 ? `${item.title.substring(0, 35)}...` : item.title}

                            </Typography>
                          </Grid>
                        </a>)
                    )
                  })
                ) : (
                  <span style={{ marginLeft: '20px' }}>Articles not available</span>
                )}

                {/*  <Box sx={{ fontSize: '17px', mt: 4, fontFamily: 'Mazzard', fontWeight: '500' }}>
                You may like to read -
              </Box>
              <Grid sx={{ alignItems: 'center', display: 'flex', mt: 3 }}>
                <Box>
                  <img src={documentText} alt='document-text' style={{ height: '20px' }} />
                </Box>
                <Typography
                  sx={{ fontSize: '14px', fontFamily: 'Mazzard', ml: 3, mt: 1, color: '#2C5CC5', cursor: 'pointer' }}

                //onClick={/* handleToggle2 *
                >
                  How to check my attendance ?
                </Typography>
              </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={viewImg}
        onClose={handleViewImgClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth="sm"
       
      >
        <DialogTitle onClick={handleViewImgClose} id='alert-dialog-title'>
          <IconButton
            size='small'
            sx={{ position: 'absolute', right: '0rem', top: '3px' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: '500px', width: '500px'  }} className="image-preview">
          <img
            src={imgUrlpopup ? imgUrlpopup : previewImgDisplay}
            alt='img-popup'
            style={{ width: '100%', height: '100%' }}
          />
        </DialogContent>
      </Dialog></>
  )
}

export default UserKnowledgeArticle
