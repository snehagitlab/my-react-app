import React, { useState, useEffect, useRef } from 'react'
import { Grid, Typography, Box, Card, CardContent, IconButton } from '@mui/material'
import documentText from '../../../../assets/Images/user_Icons/light/document-textdark.png'
import { toast } from 'react-toastify'
import { API_PATHS } from 'src/config/api.config'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import Pdf_img from 'src/assets/Images/user_Icons/light/pdf_img.png'
import file_icon from 'src/assets/Images/user_Icons/light/file_icon.png'
import KnowledgeContext from 'src/context/knowledgeProvider'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

//icon
import Close from 'mdi-material-ui/Close'


const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const imagePath = 'https://storage.googleapis.com/'

function DisplayArticleView() {
  const navigate = useNavigate()
  const location: any = useLocation()
  const articleid: any = location.state
  const [title, setTitle] = useState('')
  const [articleDate, setArticleDate] = useState('')
  const [description, setDescription] = useState('')
  const [listArticle, setListArticle] = useState<any>([])
  const { folderIdaddarticle,dispArticleBackBtn,setdispArticleBackBtn } = React.useContext<any>(KnowledgeContext)
  const ScrollTopRef = useRef<any>()
  const [storeAttachment, setStoreAttachment] = React.useState<any>()
  const storeFileAttachment = storeAttachment && JSON.parse(storeAttachment)
  const [viewImg, setviewImg] = React.useState<any>(false);
  const [imgUrlpopup, setImgUrlPopup] = React.useState<any>()
  const [previewImgDisplay, setPreviewImgDisplay] = useState<any>([])
  const [webContent, setwebContent] = useState('')
  const [videoLink, setvideoLink] = useState(0)
  const youtubeLink = 'https://youtube.com/embed/'
  const [state, setStateArticle] = useState<any>([])
  const [articleDetails, setArticleDetails] = useState<any>([])


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
    if (folderIdaddarticle > 0) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}?showAll=true&search={"isPublish":1,"folderId":${folderIdaddarticle}}`)
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
        } else {
          toast.error(result.message)
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const handlearticleId = (e: any) => {
    const articleid = e.articleId
    navigate('/knowledge/article/preview', { state: articleid })
  }
  const handleViewImgClose = () => {
    setviewImg(false)
    setImgUrlPopup("")
  }
  const handleGetArticleDetails = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.article}/detail?articleId=${articleid}`)
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
        setArticleDetails(data)
        setStateArticle(data)
        setTitle(data.title)
        setArticleDate(data.createdAt)
        setDescription(data.content)
        setStoreAttachment(data.attachment)
        setwebContent(data.webContent)
        setvideoLink(data.videoLink)
      } else {
        toast.error(result.message)
      }
    } catch (ex: any) {
      toast.error(ex.message)
    }
  }

  const handleCancelArticle = () => { 
    if(dispArticleBackBtn){
    setdispArticleBackBtn(!dispArticleBackBtn)
    navigate(-1)
  }else{navigate('/knowledge/addArticle', { state: articleDetails })}
  }


  useEffect(() => {
    getArticleList()
  }, [])
  
  const handleScrollTo = () => {
    ScrollTopRef.current.scrollTo(0, 0);
  };

  useEffect(() => {
    handleGetArticleDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleid])

  //image viewer function
  const openPreviewImgModal = (prevImgUrl: any) => {
    setPreviewImgDisplay(`${imagePath}${prevImgUrl}`)
    setviewImg(true)
  }
  const handleDownloadImg = (imgPath: any) => {
    window.location.href = `${imagePath}${imgPath}`
  }

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
  }, [state])

 

  return (
    <>
      <Grid >
        {/* searching task */}

        <Button

          sx={{
            textTransform: 'capitalize',
            marginLeft: '10px'
          }}
          onClick={() => handleCancelArticle()}

        >
          Back
        </Button>

        <Grid ref={ScrollTopRef} sx={{ width: '100%', margin: 'auto', background: '#F7F7F7', height: 'calc(100vh - 143px)', overflowY: 'scroll' }}>
          <Card sx={{ background: '#ffffff' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Grid sx={{ width: '80%', margin: 'auto' }}>
                <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>

                </Grid>
                <Grid sx={{ textAlign: 'start', display: 'flex', alignItems: 'center' }}>

                  <Grid>
                    <Typography sx={{ fontSize: '32px', fontWeight: '700', padding: '30px 0px 5px 0px' }}>

                      {title.length > 0 ? (title) : ('How to make payment by support application ?')}
                    </Typography>
                    <Typography
                      sx={{ fontSize: '17px', fontWeight: '500', padding: '0px 0px 30px 0px', color: '#6c757d' }}
                    >
                      Created at {article_date}
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
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
              
            >
            
              <Grid item xs={9} sx={{ padding: '30px', background: '#fff' }}>

              {videoLink && videoLink != 0 ?
              <Grid sx={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}} >
                <iframe src={`${youtubeLink}${videoLink}`} width='50%' height='300px'  style={{border:'0'}}></iframe>
                </Grid>
                : ''
                }
                {webContent && webContent != '' ?
              <Grid sx={{margin:'20px ,0px'}} >
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
                  


              

                {/*  <Divider /> */}


{/*                 <Grid sx={{ display: 'flex' , paddingLeft:'15px',marginTop:'15px'}}>
 */}                <Grid sx={{ width: '100%', height: 'auto', padding: '10px 0px' }}>
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
                                    spacing={3}
                                    key={id}
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
                                        style={{ width: '50px', height: '50px', cursor: 'pointer', opacity: "0.3" }}
                                      />
                                    </CustomAvatar>
                                  </Grid>
                                </a>
                              </> : <>
                                <Grid
                                  onClick={() => handleDownloadImg(img)}
                                  spacing={3}
                                  key={id}
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
{/*                 </Grid>
 */}
              </Grid>
              <Grid item xs={3} sx={{ background: '#f5f7f9', padding: '20px',marginBottom:'auto' }}>
                <Box sx={{ fontSize: '17px', mt: 4, fontFamily: 'Mazzard', fontWeight: '500' }}>
                  Articles in this folder -
                </Box>
                {listArticle.length > 0 ? (
                  listArticle &&
                  listArticle.map((item: any, id: any) => {
                    return (
                      state == item.articleId ? (' ') : (
                        <a onClick={() => handlearticleId(item)} key={id}>
                          <Grid sx={{ alignItems: 'center', display: 'flex', mt: 3 }}
                          >
                            <img src={documentText} alt='document-text' style={{ height: '20px' }} />

                            <Typography
                              sx={{ fontSize: '14px', fontFamily: 'Mazzard', ml: 3, mt: 1, color: '#2C5CC5', cursor: 'pointer' }}
                              onClick={handleScrollTo}
                            >
                              {item.title.length > 35 ? `${item.title.substring(0, 35)}...` : item.title}

                            </Typography>
                          </Grid>
                        </a>
                      ))
                  })
                ) : (
                  <span style={{ marginLeft: '20px' }}>Articles not found</span>
                )}

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
      >
        <DialogTitle onClick={handleViewImgClose} id='alert-dialog-title'>
          <IconButton
            size='small'
            sx={{ position: 'absolute', right: '1rem', top: '0.3rem' }}
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
      </Dialog>
    </>
  )
}

export default DisplayArticleView
