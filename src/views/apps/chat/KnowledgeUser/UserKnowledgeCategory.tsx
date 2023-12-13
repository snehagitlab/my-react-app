import React, { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, /* InputBase, InputAdornment, */ Divider } from '@mui/material'

//import router
//import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'

//import mui icon
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'

//import imagrs
//import Search from 'src/assets/Images/user_Icons/light/search-normal.svg'

import FolderOpen from '../../../../assets/Images/user_Icons/light/folder-open.png'
import Paper from '../../../../assets/Images/user_Icons/light/Paper.svg'
import { API_PATHS } from 'src/config/api.config'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import { Helmet } from 'react-helmet'

const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

function UserKnowldgeCategory() {
  const navigate = useNavigate()
  const [listCategory, setListCategory] = useState<any>([])
  const { categoryid } = useParams()
  const [loading, setLoading] = React.useState(false)

  const getCategoryDetails = async () => {
    setLoading(true)
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/${API_PATHS.category}/${API_PATHS.dashboard}?showAll=true&search={"catId":"${categoryid}","isPublish":1}`
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
        setListCategory(result.payload.data)
        setLoading(false)
      } else {
        toast.error(result.message)
        setLoading(false)

      }
    } catch (error) {
      console.log(error)
      setLoading(false)

    }
  }
  const handleOpenarticle = (articleid: any) => {
    navigate(`/user/knowledge/article/${articleid}`)
  }

  const backtoHomeNavigation = () => {
    navigate('/user/dashboard')
  }
  const backtoKnowledgeNavigation = () => {
    navigate('/user/knowledge')
  }

  useEffect(() => {
    getCategoryDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <Helmet>
        <title>Knowledge Base Category- Gogtas</title>
        <meta name="description" content="Knowledge Base Category" />
    </Helmet>
    <Grid>
      {/* searching task */}
      <Grid
        sx={{
          overflowX: 'hidden',
          margin: 'auto',
          background: '#F7F7F7',
          height: 'calc(100vh - 88.84px)',
          overflowY: 'auto'
        }}
      >
        <Card sx={{ background: '#ffffff' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Grid sx={{ width: '80%', margin: 'auto' }}>
              <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid item>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      backtoHomeNavigation()
                    }}
                  >
                    Home
                  </span>{' '}
                  -{' '}
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      backtoKnowledgeNavigation()
                    }}
                  >
                    Knowledge Base{' '}
                  </span>
                </Grid>

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
              {/* <Grid sx={{ textAlign: 'start' }}>
                <Grid sx={{ display: 'flex' }}>
                  <Grid>
                    {' '}
                    <LayersOutlinedIcon sx={{ fontSize: '89px', paddingTop: '30px', marginLeft: '-24px' }} />
                  </Grid>
                  <Grid>
                    <Typography sx={{ fontSize: '40px', fontWeight: '700', padding: '30px 0px 30px 0px' }}>
                      Knowledge base
                    </Typography>
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>

        {/* knowledge list */}
        <Grid sx={{ padding: '24px 0px 24px 0px', height: '61vh' }}>
          <Grid
            container
            sx={{
              width: '85%',
              margin: 'auto ',
              boxShadow: ' 0 6px 19px rgb(39 49 58 / 10%)',
              border: ' 1px solid #ebeff3',
              background: '#ffffff',
              borderRadius: '12px'
            }}
          >
            {loading ? (

                <Box sx={{
                  paddingLeft: '20px', alignItems: 'center', justifyContent: 'center', display: ' flex',
                  marginTop: '20px'
                }}>
                  <div className="loading">Loading...</div>
                </Box>
                ) : listCategory.length > 0 ? (
              listCategory &&
              listCategory.map((item: any, id: any) => {
                return (

                  <Grid key={id}>
                    <Grid item sx={{ padding: '16px 25px 16px 25px' }} sm={12} md={12} >
                      <Grid sx={{ display: 'flex' }}>
                        <Grid>
                          <LayersOutlinedIcon sx={{ fontSize: '45px' }} />
                        </Grid>
                        <Grid>
                          <Typography sx={{ fontSize: '20px', fontWeight: '700', textTransform: 'capitalize' }}>
                            {item.name} <span style={{ fontSize: '14px' }}>({item.totalFolder})</span>
                          </Typography>
                          <Typography sx={{ fontSize: '14px', fontWeight: '500', color: '#9B9B9B' }}>
                            {item.description}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Divider sx={{ width: '85vw' }} />

                    {item.totalFolder > 0 ? (
                      item.folders &&
                      item.folders.map((items: any, indexs: number) => {
                        return (
                          <Grid item sx={{ padding: '16px 25px 16px 25px' }} md={6} key={indexs}>
                            <Grid sx={{ display: 'flex' }}>
                              <Grid md={12} sx={{ display: 'flex' }}>
                                <Grid>
                                  <img
                                    src={FolderOpen}
                                    alt='document-text'
                                    style={{ height: '23px', marginRight: '10px' }}
                                  />
                                </Grid>
                                <Grid>
                                  <Typography
                                    sx={{
                                      fontSize: '18px',
                                      fontWeight: '500',
                                      fontFamily: 'Mazzard',
                                      textTransform: 'capitalize'
                                    }}
                                  >
                                    {' '}
                                    {items.name} <span style={{ fontSize: '13px' }}>({items.totalArticle})</span>
                                  </Typography>
                                  {items.totalArticle > 0 ? (
                                    items.articles &&
                                    items.articles.map((aitems: any, aindexs: number) => {
                                      return (
                                        <Grid
                                          sx={{ display: 'flex', marginTop: '20px' }}
                                          key={aindexs}
                                          onClick={() => {
                                            handleOpenarticle(aitems.articleId)
                                          }}
                                        >
                                          <Grid>
                                            <img src={Paper} alt='document-text' style={{ height: '20px' }} />
                                          </Grid>
                                          <Grid>
                                            <Grid style={{ marginLeft: '5px', color: '#2C5CC5', cursor: 'pointer' }}>
                                              {aitems.title}
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      )
                                    })
                                  ) : (
                                    <span style={{ marginLeft: '20px' }}>Article not available</span>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        )
                      })
                    ) : (
                      <span style={{ width: '100%', textAlign: 'center', marginLeft: '20px' }}>Folder not available</span>
                    )}
                  </Grid>

                )
              })
            ) : (
              <span style={{ width: '100%', textAlign: 'center' ,marginLeft: '20px'}}>Folder and Article Not available</span>
            )}
          </Grid>
          <div
            style={{
              height: '50px'
            }}
          >
            {/* added bottom margin by this method because css styling is not working */}
          </div>
        </Grid>
      </Grid>
      {/* end of knowledge list */}
    </Grid>
    </>
  )
}
export default UserKnowldgeCategory
