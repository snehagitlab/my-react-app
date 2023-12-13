import React from 'react'

//import mui
import { Box, Grid, Typography, IconButton } from '@mui/material'

// import component
import TicketListing from './TicketListing'

// ** images Imports
import RightArrow from '../../../assets/Images/user_Icons/light/rightArrow.svg'

//import context
import TicketContext from 'src/context/TicketProvider'


const SidebarRight = () => {
  const { handleSliderOpen } = React.useContext<any>(TicketContext)
  

  return (
    <>
      <Box sx={{ width: '22%', borderLeft: '1px solid #e5e5e5', display: { xs: 'none', md: 'block' } }}>
      <Box className='open-tickets'>
          <Grid
            container
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{
              padding: '16.7px 13.7px 16.7px 28.35px',
              borderBottom: '1px solid #e5e5e5',
              position: 'relative',
              '&:before': {
                content: '""',
                width: '2.48px',
                height: '41.14px',
                backgroundColor: '#2D4ACD',
                position: 'absolute',
                display: 'inline-block',
                left: '0px'
              }
            }}
          >
            <Grid item>
              <Typography
                sx={{
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  fontSize: '20px',
                  lineHeight: '23.64px',
                  color: '#1B0B2B'
                }}
              >
              Open ticket
              </Typography>
            </Grid>
            <Grid item>
              <IconButton size='small' onClick={handleSliderOpen} sx={{ color: 'text.secondary' }}>
                <img src={RightArrow} alt='rightArrow' style={{ width: '42px', height: '42px' }} />
              </IconButton>
            </Grid>
          </Grid>

          {/* ticket listing div component */}
          <TicketListing categoryId = {1} />
        </Box>
        
       
       
      </Box>
    </>
  )
}

export default SidebarRight
