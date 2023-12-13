import { useState, useEffect, useCallback } from 'react'

import * as React from 'react'

//import react-router
import { useNavigate } from 'react-router-dom'

//import images
 import Knowledge from 'src/assets/Images/user_Icons/light/knowlwdge_img.png'

// import mui
import { styled } from '@mui/material/styles'
import { Grid, Card, CardContent, Typography, InputBase, InputAdornment } from '@mui/material'

import Box, { BoxProps } from '@mui/material/Box'
import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'

// Styled Link component
const StyledLink = styled('a')({
  textDecoration: 'none'
})

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(5),
  backgroundColor: `rgba(${theme.palette.customColors.main}, 0.08)`
}))

// import image

import Search from 'src/assets/Images/user_Icons/light/search-normal.svg'
import { API_PATHS } from 'src/config/api.config'
import { toast } from 'react-toastify'
import {Helmet} from "react-helmet";

const imagePath = 'https://storage.googleapis.com/'


const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const KnowledgeList = () => {
  const navigate = useNavigate()
  const [listCategory, setListCategory] = useState<any>([])
  const [searchCategory, setSearchCategory] = useState("")
  const [categoryLoading, setCategoryLoading] = useState(false)


  const getCategoryDetails = async () => {
    setCategoryLoading(true)
    let myUrl: any;
    if (searchCategory) {
      myUrl = `${BASE_URL}/${API_VERSION}/${API_PATHS.category}/${API_PATHS.user}/${API_PATHS.dashboard}?showAll=true&search={"name": "${searchCategory}"}`
    } else {
      myUrl = `${BASE_URL}/${API_VERSION}/${API_PATHS.category}/${API_PATHS.user}/${API_PATHS.dashboard}?showAll=true`
    }
    const url = new URL(myUrl)

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
        setCategoryLoading(false)
        setListCategory(result.payload.data)

      } else {
        toast.error(result.message)
        setCategoryLoading(false)
      }
    } catch (error: any) {
      toast.error(error.message)
      setCategoryLoading(false)
    }
  }
  useEffect(() => {
    getCategoryDetails()
  }, [searchCategory])


  const handleOpenCategory = (categoryid: any) => {
    navigate(`/user/knowledge/category/${categoryid}`)
  }

  //searching api in that debouncing through api calling 
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

  //get onChnage value on search filled
  const handleChange = (e: any) => {
    setSearchCategory(e.target.value)
  }

  //usecallback used in debouncing function
  const optimisedVersion = useCallback(debounce(handleChange), [])


  return (
    <>
      <Helmet>
        <title>Knowledge Base - Gogtas</title>
        <meta name="description" content="Knowledge Base" />
    </Helmet>
      <Box sx={{ height: 'calc(100vh - 87px)', overflowY: 'auto' }}>
        <Box sx={{ background: '#F4F5FA' }}>
          {/* //searching task */}
          <Card>
            <CardContent sx={{ pt: '30px', pb: '30px !important', pl: '0px', pr: '0px', textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 1.5, fontSize: '20px' }}>
                Hello, how can we help?
              </Typography>
              <Typography variant='body2' sx={{ marginBottom: 7, fontSize: '15px' }}>
                choose a category to quickly find the help you need
              </Typography>
              <Grid item>
                <InputBase
                  size='small'
                  className='searchticket-input'
                  name='search'
                  sx={{
                    background: 'white',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: 'rgba(42, 58, 81)',
                    padding: '12px 14px',
                    border: '1px solid #DCDCDC',
                    width: '20%'
                  }}
                  placeholder='Search'
                  onChange={optimisedVersion}
                  startAdornment={
                    <InputAdornment sx={{ mr: '10px' }} position='start'>
                      <img src={Search} alt='search' style={{ width: '17px', height: '17px' }} />
                    </InputAdornment>
                  }
                />
              </Grid>
            </CardContent>
          </Card>
          {/* end searching task */}

          {/* <Grid container sx={{ padding: '22px 32px', background: '#F7F8F9' }} justifyContent='space-between'> */}
          {/* {[1, 2, 3, 4, 5].map(item => (
              <Grid item key={item} xs={12} sx={{ marginBottom: '16px' }}>
                <Card sx={{ borderRadius: '12px' }}>
                  <CardContent>
                    <Grid container alignItems={'center'}>
                      <Grid item>
                        <img
                          src={File_attachment}
                          alt='notificationicon'
                          style={{ marginRight: '15px', height: '46px' }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography
                          sx={{
                            fontWeight: '500',
                            fontSize: '21px',
                            color: '#2F4BCB'
                          }}
                        >
                          Getting started with webbrix?
                        </Typography>
                      </Grid>
                      <Grid item sm={12} sx={{ ml: '60px' }}>
                        <Typography
                          sx={{
                            fontSize: '18px',
                            fontWeight: '400',
                            color: 'rgba(42, 58, 81, 0.87)',
                            lineHeight: '149.2%'
                          }}
                        >
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, ex? Facere ex maiores
                          expedita amet provident ipsa deserunt est reprehenderit magnam voluptatem corrupti, totam,
                          rerum velit sequi id mollitia veniam?
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))} */}
          <Box >
            <Grid container sx={{ padding: '10px', display: "flex", justifyContent: "center", alignItems: "center" }} >
              {categoryLoading ? <>
                <Box sx={{
                  paddingLeft: '20px', alignItems: 'center', justifyContent: 'center', display: ' flex',
                  marginTop: '20px'
                }}>
                  <div className="loading">Loading...</div>
                </Box>
              </>
                : listCategory?.length > 0 ? listCategory.map((item: any, index: number) => (
                  <Grid item xs={12} sm={6} md={3} key={index} sx={{ padding: '10px' }} onClick={() => {
                    handleOpenCategory(item.catId)
                  }}>
                    <Card>
                      <StyledLink>
                        <StyledBox sx={{
                          background: '#2d4acd24', width: "100%",
                          padding: "10px", height: "21vh"
                        }}>
                          {item.image ? <img src={`${imagePath}${item.image}`} alt='knowledge-base' /> :  <img src={Knowledge} alt='knowledge-base' />}

                        </StyledBox>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Tooltip TransitionComponent={Zoom} title={item.name}>
                            <Typography variant='h6' sx={{ mb: 1.75, fontWeight: '500', textTransform: 'capitalize' }}>
                              {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}
                            </Typography>
                          </Tooltip>
                          <Typography variant='body2'>
                            {item.totalFolder} Folder | {item.totalArticle} Articles

                          </Typography>

                        </CardContent>
                      </StyledLink>
                    </Card>
                  </Grid>
                ))
              :'No categories available'}
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default KnowledgeList
