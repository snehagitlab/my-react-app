import * as React from 'react'
import { Grid, Card, CardContent, Typography,  CardActions } from '@mui/material'

// import images
//import UserImage from '../../../assets/Images/user_Icons/light/user_img.png'

//import Dots from '../../../assets/Images/user_Icons/light/dots.svg'

import { TICKET_PRIORITY } from 'src/config/api.config'

const TicketListDashboard = ({ item }: any) => {
  /* const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
 
  const handleClose = () => {
    setAnchorEl(null)
  }
 
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
 */
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
  const date = new Date(item.createdAt)
  const formatted_date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

  return (
    <>
      <Grid item xs={12} key={item} sx={{ paddingLeft: '40px !important',mb:5 }}>
        <Card sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #DDDDDD' }}>
          <CardContent sx={{ padding: '10px 13px', marginLeft: '2px' }}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justifyContent='space-between' spacing={5} alignItems='center'>
                  {/* <Grid item xs={12} md={4}> */}
                  <Grid item>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '13px',
                        color: 'rgba(42, 58, 81, 0.53)',
                        lineHeight: '19px'
                      }}
                    >
                      {item.ticketNumber}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={12} md={3}> */}
                  <Grid item>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        color: ' rgba(42, 58, 81, 0.53)',
                        lineHeight: '19px',
                        display: { xs: 'none', sm: 'none', md: 'block' }
                      }}
                    >
                      {formatted_date}
                    </Typography>

                   {/*  <Grid item sx={{ display: { xs: 'block', md: 'none', sm: 'block' } }}>
                      <IconButton size='small' sx={{ color: 'text.secondary' }}>
                        <Avatar src={Dots} sx={{ width: '35px', height: '35px' }} />
                      </IconButton>
                    </Grid> */}

                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={5} direction='column'>
                  <Grid item>
                    <Typography
                      sx={{
                        color: 'rgba(42, 58, 81, 0.87)',
                        fontWeight: '500',
                        fontSize: { xs: '14px', sm: '14px', md: '16px' }
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ padding: '10px 0px 0px' }}>
            <Grid
              container
              spacing={0}
              justifyContent='space-between'
              alignItems='center'
              sx={{ p: '10px 13px', borderTop: '1px solid #EBEBEB' }}
            >
              <Grid item>
                    <Typography

                      /* onClick={(event: any) => handleClickpopover(event, item.ticketId)} */

                      sx={{
                        fontSize: '12px',
                        textTransform: 'capitalize',
                        color:
                          item.status === 1
                            ? '#03B8DB'
                            : item.status === 2
                              ? '#FF8A2B'
                              : item.status === 3
                                ? 'gray'
                                : item.status === 4
                                  ? 'purple'
                                  : 'green',

                        p: '0px 0px 0px 30px',
                        '&:hover': {
                          color:
                            item.status === 1
                              ? '#03B8DB'
                              : item.status === 2
                                ? '#FF8A2B'
                                : item.status === 3
                                  ? 'gray'
                                  : item.status === 4
                                    ? 'purple'
                                    : 'green'
                        }
                      }}
                    >
                      {item.status === 1
                        ? 'Open'
                        : item.status === 2
                          ? 'Pending'
                          : item.status === 3
                            ? 'Closed'
                            : 'Waiting On Customer'}
                    </Typography>
                  </Grid>
              <Grid
                item
                sx={{
                  display: { md: 'block', sm: 'none', xs: 'none' },
                  width: '1px',
                  height: '40px',
                  background: 'rgba(226, 226, 226, 0.53)'
                }}
              ></Grid>
              <Grid item>
                <Grid container justifyContent='center' alignItems='center'>
                  {/* <Grid item sx={{ mr: '10px' }}>
                    <Avatar src={UserImage} />
                  </Grid> */}
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        fontSize: '12px',
                        color: 'rgba(42, 58, 81, 0.53)'
                      }}
                    >
                      assignee
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        color: 'rgba(42, 58, 81, 0.87)',
                        fontWeight: '500',
                        fontSize: { xs: '14px', sm: '14px', md: '16px' },
                        textTransform: 'capitalize'
                      }}
                    >
                      {item.toUser.fname} {item.toUser.lname}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                sx={{
                  width: '100%',
                  height: '1px',
                  background: '#EBEBEB',
                  margin: '10px 0',
                  display: { lg: 'none', md: 'none', sm: 'block' }
                }}
              >
                {' '}
              </Grid>

              <Grid
                item
                sx={{
                  display: { md: 'block', sm: 'none', xs: 'none' },
                  width: '1px',
                  height: '40px',
                  background: 'rgba(226, 226, 226, 0.53)'
                }}
              >
                {' '}
              </Grid>
              <Grid item>
                <Grid container justifyContent='center' alignItems='center'>
                 {/*  <Grid item sx={{ mr: '10px' }}>
                    <Avatar src={UserImage} />
                  </Grid> */}
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        fontSize: '12px',
                        color: 'rgba(42, 58, 81, 0.53)'
                      }}
                    >
                      raised by
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Mazzard',
                        color: 'rgba(42, 58, 81, 0.87)',
                        fontWeight: '500',
                        fontSize: { xs: '14px', sm: '14px', md: '16px' },
                        textTransform: 'capitalize'
                      }}
                    >
                      {item.fromUser.fname} {item.fromUser.lname}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ width: '1px', height: '40px', background: 'rgba(226, 226, 226, 0.53)' }}>
                {' '}
              </Grid>
              <Grid item>
                <Grid item>
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard',
                      fontSize: '12px',
                      color: 'rgba(42, 58, 81, 0.53)'
                    }}
                  >
                    priority
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Mazzard',
                      color: 'rgba(42, 58, 81, 0.87)',
                      fontWeight: '500',
                      fontSize: { xs: '14px', sm: '14px', md: '16px' },
                      textTransform: 'capitalize'
                    }}
                  >
                    {item.priority === parseInt(TICKET_PRIORITY.URGENT) ? (
                      <>urgent</>
                    ) : item.priority === parseInt(TICKET_PRIORITY.HIGH) ? (
                      <>high</>
                    ) : item.priority === parseInt(TICKET_PRIORITY.MEDIUM) ? (
                      <>medium</>
                    ) : (
                      <>low</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item sx={{ width: '1px', height: '40px', background: 'rgba(226, 226, 226, 0.53)' }}>
                {' '}
              </Grid>
             {/*  <Grid item>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    fontSize: '12px',
                    color: 'rgba(42, 58, 81, 0.53)'
                  }}
                >
                  category
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Mazzard',
                    color: 'rgba(42, 58, 81, 0.87)',
                    fontWeight: '500',
                    fontSize: '16px',
                    textTransform: 'capitalize'
                  }}
                >
                  {' '}
                  {item.category.category}
                </Typography>
              </Grid> */}

             {/*  <Grid item>
                <IconButton
                  size='small'
                  sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block', sm: 'none' } }}
                >
                  <Avatar src={Dots} />
                </IconButton>
              </Grid> */}

            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </>
  )
}
export default TicketListDashboard
