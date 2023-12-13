import React from 'react'
import { Grid, Card, CardContent, InputBase, InputAdornment, Typography, Box } from '@mui/material'

//import react router
import { useNavigate } from 'react-router-dom'

//import images
import Search from 'src/assets/Images/user_Icons/light/search-normal.svg'
import FolderOpen from '../../../../assets/Images/user_Icons/light/folder-open.png'
import Paper from '../../../../assets/Images/user_Icons/light/Paper.svg'

function UserKnowledgeFaq() {
  const navigate = useNavigate()

  return (
    <Grid>
      {/* searching task */}
      <Card sx={{ background: '#ffffff' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Grid sx={{ width: '80%', margin: 'auto' }}>
            <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item>
                <Typography>Home - Knowledge - my category</Typography>
              </Grid>
              <Grid item>
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
              </Grid>
            </Grid>
            <Grid sx={{ textAlign: 'start' }}>
              <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid sx={{ marginBottom: '9px', marginRight: '10px' }}>
                  {' '}
                  <img alt="file-open" src={FolderOpen} style={{ width: '35px', height: '35px' }} />
                </Grid>
                <Grid>
                  <Typography sx={{ fontSize: '36px', fontWeight: '700', padding: '30px 0px 30px 0px' }}>
                    FAQ (1)
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* faq list */}
      <Grid sx={{ padding: '24px 0px 24px 0px', height: '61vh' }}>
        <Grid
          container
          sx={{
            width: '85%',
            margin: 'auto ',
            boxShadow: ' 0 6px 19px rgb(39 49 58 / 10%)',
            border: ' 1px solid #ebeff3',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px 24px 16px 24px'
          }}
        >
          <Grid
            onClick={() => navigate('/user/knowledge/article')}
            md={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: '#F5F7F9'
              }
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 24px 16px 24px'
              }}
            >
              <Grid>
                <img src={Paper} alt='document-text' style={{ height: '20px' }} />
              </Grid>
              <Grid>
                <Box style={{ marginLeft: '5px', color: '#2C5CC5' }}>test</Box>
              </Grid>
            </Grid>
            <Grid>
              <Typography sx={{ fontSize: '13px', color: 'gray', fontFamily: 'Mazzard' }}>
                Created by Shrutika Khot, Modified on Thu, 07 Jul 2022 at 05:53 AM by Shrutika Khot
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserKnowledgeFaq
