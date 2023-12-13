import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Badge, InputBase, InputAdornment, FormControl } from '@mui/material'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'

//import UserImage from '../../../../assets/Images/user_Icons/light/user_img.png'
import { API_PATHS, SOCKET_TICKET_REFRESH, USER_ROLE } from 'src/config/api.config'
import Search from 'src/assets/Images/user_Icons/light/search-normal.svg'
import TicketContext from 'src/context/TicketProvider'
import ChatContext from 'src/context/ChatProvider'
import Close from 'mdi-material-ui/Close'

//import CreateTicket from './CreateTicketBtn'
import { socket } from 'src/views/apps/chat/chatContent/SocketConnection'
import { DefaultProfilePic } from 'src/views/apps/chat/chatContent/defaultProfilePic'
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const CHAT_URL = process.env.REACT_APP_CHAT_URL


function ActiveSupport() {
  const navigate = useNavigate()
  const { agent, setAgentList, setAgent, setOpenTicketDetails, setShowopenTicket, setOffenceTicketCreate, updateuserProfile } = React.useContext<any>(TicketContext)
  const { setScrollerPageVisible, setOnlineStatus, onlineStatus, setMsgConversation, setPage, previousAgentId, setrefreshConversationList, sethandleCallConvList, handleCallConvList, sethandleAgentListUnreadCount, setcheckFirstAgentID, setShowActiveSupport, setShowChat, refreshConversationList, checkFirstAgentID, setdisplayChatUi } = React.useContext<any>(ChatContext)
  const [page, setPages] = React.useState(1)
  const [record, setRecord] = React.useState<any>(10)
  const [loading, setLoading] = React.useState(false)
  const listInnerRef: any = useRef<any>(null)
  const [isOpened, setIsOpened] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const LoggedinuserId = user.data.userId
  const [mapperClass, setmapperClass] = useState([{
    userId: '',
    UUID: '',
    isOnline: '',
    profilePic: '',
    unRead: '',
    updatedAt: '',
    fname: '',
    lname: '',
    role: ''
  }])

  const [handleAgentList, sethandleAgentList] = React.useState(false);
  const [filteredArray, setfilteredArray] = React.useState<any>();
  const [displaemptyMessage, setdisplaemptyMessage] = React.useState<any>('');
  const [response, setresponse] = useState<any>()


  useEffect(() => {
    const finalArray = mapperClass.filter(obj => obj.userId !== undefined && obj.userId !== "");
    finalArray.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    const filteredArrays: any = finalArray.filter((obj: any, index: any, self: any) =>
      self.map((o: any) => o.userId).indexOf(obj.userId) === index
    )
    setfilteredArray(filteredArrays)
  }, [mapperClass])

  useEffect(() => {
    getConversationAgetDetails()
    socket.on("message", (socket: any) => {
      setresponse(socket)
    });
  }, []);
  useEffect(() => {
    if (response?.isOnline == 1 || response?.isOnline == 0) {
      setOnlineStatus(response)
    }
    if (response?.data && response?.type == SOCKET_TICKET_REFRESH.NEW_MESSAGE) {
      if (filteredArray == undefined || filteredArray?.length == 0) {
        getConversationAgetDetails()
      }
      if (agent == undefined || filteredArray?.length == 1) {
        getConversationAgetDetails()
      }
    }
  }, [response])


  //fetch agent api calling
  const fetchAgent = async () => {
    setLoading(true)
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(
      `${BASE_URL}/${API_VERSION}/user/pick/list/?pageNumber=${page}&recordsPerPage=10&search={"name":"${searchValue}","roleId":[2,3,4]}&showAll=true`
    )
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    const result = await response.json()
    if (result.status === 200) {
      setAgentList(result.payload.data)
      const data = result.payload.data
      setmapperClass([])
      if (data.length > 0) {

        data.map((item: any) => (

          setmapperClass((oldArray: any) => [...oldArray, {
            userId: item.userId,
            fname: item.fname,
            lname: item.lname,
            profilePic: item.profilePicture,
            UUID: '',
            isOnline: item.isOnline,
            UnRead: '',
            updatedAt: '',
            role: item?.userRole[0]?.roleId
          }
          ])
        ))
      }
      else {
        setdisplaemptyMessage('Agent not available')

        setmapperClass([])
      }
      setRecord(result.pager.totalRecords)
      setLoading(false)
    }
  }



  useEffect(() => {
    if (handleAgentList) {
      fetchAgent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, updateuserProfile, searchValue, handleAgentList])



  const handleShowChatContent = () => {
    navigate('/user/dashboard')
    setShowActiveSupport(false)
    setShowChat(true)
  }

  //scrolling through get height
  const handleScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current
      if (scrollTop + clientHeight > scrollHeight - 1) {
        if (page < 0) {
          setPages(page + 1)
        }
        else { setPages(page) }
      }
    }
  }

  //Chat related active support changes
  const handleDisplayInputField = () => {
    ConversationListByPreviousAgent(previousAgentId)
    setrefreshConversationList(false)
    setmapperClass([])
    setIsOpened(true);
    sethandleAgentList(true)
  }

  const handleHideInputField = () => {
    setdisplaemptyMessage('')
    setIsOpened(false);
    setSearchValue('')
    sethandleAgentList(false)

  }

  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
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



  //chat conversation List Agent
  const getConversationAgetDetails = async () => {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(`${CHAT_URL}`)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    const result = await response.json()
    if (result.status === 200) {
      const data = result.payload.data
      setmapperClass([])
      if (data.length > 0) {
        data.map((item: any) => (
          LoggedinuserId == item.megDetails.receiverDetails.userId ?
            (setmapperClass((oldArray: any) => [...oldArray, {
              userId: item.megDetails.senderDetails.userId,
              fname: item.megDetails.senderDetails.fName,
              lname: item.megDetails.senderDetails.lName,
              profilePic: item.megDetails.senderDetails.profilePic,
              UUID: item.uuid,
              isOnline: item.megDetails.senderDetails.isOnline,
              UnRead: data?.length == 1 && agent?.userId != undefined ? 0 : item.UnRead,
              updatedAt: item.updatedAt,
              role: item.megDetails.senderDetails.roleId
            }]))
            :
            (
              setmapperClass((oldArray: any) => [...oldArray, {
                userId: item.megDetails.receiverDetails.userId,
                fname: item.megDetails.receiverDetails.fName,
                lname: item.megDetails.receiverDetails.lName,
                profilePic: item.megDetails.receiverDetails.profilePic,
                UUID: item.uuid,
                isOnline: item.megDetails.receiverDetails.isOnline,
                UnRead: data?.length == 1 && agent?.userId != undefined ? 0 : item.UnRead,
                updatedAt: item.updatedAt,
                role: item.megDetails.receiverDetails.roleId
              }]))
        )

        )

      }
      else {
        setdisplaemptyMessage('Start your conversation by searching agent')

      }


    }
  }

  const ConversationListByPreviousAgent = async (previousAgentId: any) => {
    if (previousAgentId > 0) {
      const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
      const url = new URL(`${CHAT_URL}/${API_PATHS.message}?receiverId=${previousAgentId}&showAll=true`)
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${UserData.token}`
        }
      })
      const result = await response.json()
      if (result.status === 200) {
        console.log(result.message)
      }
      else {
        console.log(result.message)
      }
    }
  }
  useEffect(() => {
    if (handleAgentList == false) {

      getConversationAgetDetails()
    }
  }, [handleAgentList])


  useEffect(() => {
    if (refreshConversationList) {
      setrefreshConversationList(false)

      getConversationAgetDetails()
    } else {
      setrefreshConversationList(false)
    }
  }, [refreshConversationList])

  useEffect(() => {
    if (checkFirstAgentID > 0) {
      if (filteredArray && filteredArray[0]?.userId != checkFirstAgentID) {

        getConversationAgetDetails()
      }
      setcheckFirstAgentID(0)

    }

  }, [checkFirstAgentID])

  //display  formatted time or day or date for Active agent section
  function LastTimeOfMessage(MessageTime: any) {
    const date = new Date(MessageTime)
    const getDate = date.getDate()
    const today = new Date();
    const getToday = today.getDate()

    //const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (getDate == getToday) {
      const formatted_time = moment(date).format('hh:mm');

      //`${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`

      return formatted_time

    }
    else {
      const diffDays = today.getDate() - date.getDate();
      if (diffDays == 1 || diffDays == 2 || diffDays == 3 || diffDays == 4 || diffDays == 5 || diffDays == 6 || diffDays == 7) {
        return moment(date).format('ddd');

      }
      else {

        return moment(date).format('DD-MM-YY');

        // date.getDate() + '-' + date.getMonth() + 1 + '-' + date.getFullYear()

      }
    }


  }

  useEffect(() => {

    if (handleCallConvList) {

      getConversationAgetDetails()
    }
    sethandleCallConvList(false)
    sethandleAgentListUnreadCount(false)
  }, [handleCallConvList])

  useEffect(() => {
    if (onlineStatus != undefined) {
      const findExistingItem = filteredArray.find((item: any) => {
        return item.userId === onlineStatus.userId;
      });

      if (findExistingItem) {
        findExistingItem.userId = onlineStatus.userId;
        findExistingItem.isOnline = onlineStatus.isOnline == 1 ? 1 : 0;
      }
      setfilteredArray(filteredArray)
      setOnlineStatus()
    }

  }, [onlineStatus])


  return (
    <Box>
      {/* responsive craete ticket button */}
      {/* <Grid sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
        <CreateTicket />
      </Grid> */}
      {/* end responsive create ticket button  */}

      <Grid container justifyContent={'space-between'} sx={{ padding: '0px 15px 0 24px', marginTop: '14px' }}>
        <Grid item sx={isOpened ? { display: 'none' } : {}}>
          <Typography
            sx={{
              fontWeight: '500',
              fontFamily: 'Mazzard',
              textTransform: 'capitalize',
              fontSize: '22px',
              lineHeight: '31.74px',
              color: '#1B0B2B'
            }}
          >
            active support
          </Typography>
        </Grid>
        <Grid item sx={isOpened ? { width: '100%' } : {}}>
          <Box sx={isOpened ? { display: 'none' } : {}}>

            <img src={Search} alt='Search' style={{ width: '17px', height: '17px', cursor: 'pointer' }} onClick={handleDisplayInputField} />

          </Box>
          {isOpened ? (
            <FormControl sx={{ width: '100%' }} fullWidth>
              <InputBase
                sx={{ maxWidth: '100%', p: 1, border: '1px solid lightgray', borderRadius: '12px', background: '#fff !important', color: '#323A49' }}
                placeholder='Search'
                name="search"
                fullWidth
                onChange={optimisedVersion}
                className="slide-right-search"
                startAdornment={
                  <InputAdornment sx={{ mr: 1, ml: 3 }} position='start'>
                    <img src={Search} alt='search-img' style={{ width: '17px', height: '17px' }} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment sx={{ mr: 3, cursor: 'pointer' }} position='start' onClick={handleHideInputField}>
                    <Close fontSize='small' />
                  </InputAdornment>
                }

              />
            </FormControl>)
            : ''}
        </Grid>
      </Grid>
      <Grid sx={{ height: '61vh', overflowY: 'auto' }} ref={listInnerRef} onScroll={handleScroll}>
        {loading ? (

          /*  <CircularProgress color='inherit' /> */

          <Box sx={{ paddingTop: '12rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="loading">Loading...</div>
          </Box>
        ) : filteredArray?.length === 0 ? (
          <Box sx={{ paddingTop: '12rem', display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'normal' }}>
            <Typography sx={{ textAlign: 'center', padding: '0px 50px' }}>{displaemptyMessage ? displaemptyMessage : ''}</Typography>
          </Box>
        ) : (

          filteredArray?.map((item: any, id: number) => {

            const time = LastTimeOfMessage(item?.updatedAt)
            if (item.userId != LoggedinuserId)

              return <>

                <ListItem
                  className="list-item"
                  sx={{ borderBottom: ' 1px solid #e5e5e5', paddingBottom: '0', cursor: 'pointer', paddingTop: '0' }}
                  key={id}
                  onClick={() => {
                    setShowopenTicket(false),
                      setOpenTicketDetails(false),
                      setOffenceTicketCreate(false),
                      handleHideInputField()
                    user.data.userId != item.userId ?
                      (handleShowChatContent(), setdisplayChatUi(true)) : setdisplayChatUi(false)
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      user.data.userId != item.userId ?
                        (setPage(1),
                          setScrollerPageVisible(true),
                          agent?.userId != item.userId ? setMsgConversation([]) : '',
                          setAgent(item),
                          ConversationListByPreviousAgent(previousAgentId),
                          item.UnRead > 0 ? sethandleAgentListUnreadCount(true) : sethandleAgentListUnreadCount(false))
                        : setdisplayChatUi(false)
                    }}
                    disableRipple
                    sx={{
                      p: '15px 4px',
                      width: '100%',
                      borderRadius: 1,
                      alignItems: 'flex-start'
                    }}
                  >
                    <ListItemAvatar sx={{ m: 0 }}>
                      <Badge
                        overlap='circular'
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        badgeContent={
                          <Box
                            component='span'
                            sx={{
                              width: '11px',
                              height: '11px',
                              borderRadius: '50%',
                              border: '2px solid #ffffff',
                              backgroundColor: item.isOnline == 0 ? '#A0A0A0' : '#0EBF7E'
                            }}
                          />
                        }
                      >
                        <MuiAvatar
                          src={item.profilePic ? item.profilePic : DefaultProfilePic}
                          alt={item.fname}
                          sx={{
                            width: 45,
                            height: 45
                          }}
                        />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        my: 0,
                        ml: 4,
                        mr: 1.5,
                        fontSize: '1rem'
                      }}
                      primary={
                        <Typography
                          noWrap
                          sx={{
                            fontFamily: 'Mazzard',
                            fontWeight: 500,
                            fontSize: '16px',
                            color: 'rgba(27, 11, 43, 0.8)',
                            textTransform: 'capitalize',
                            lineHeight: '25.39px'
                          }}
                        >
                          {item.fname + ' ' + item.lname}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          noWrap
                          variant='body2'
                          sx={{
                            fontFamily: 'Mazzard',
                            fontWeight: 500,
                            fontSize: '13px',
                            lineHeight: '14px',
                            color: 'rgba(33, 16, 50, 0.44)'
                          }}
                        >
                          {item.role == USER_ROLE.USER ? 'Patient' : 'Team Member'}
                        </Typography>
                      }
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          fontFamily: 'Mazzard',
                          whiteSpace: 'nowrap',
                          color: 'rgba(27, 11, 43, 0.67)',
                          fontSize: ' 11px',
                          fontWeight: '400px',
                          lineHeight: '17.46px'
                        }}
                      >
                        {item?.updatedAt != '' ? time : ''}
                      </Typography>
                      {item.UnRead > 0 ?
                        <span
                          style={{
                            fontFamily: 'Mazzard',
                            display: 'inline-block',
                            fontSize: '11px',
                            background: '#2D4ACD',
                            width: '22px',
                            height: '22px',
                            color: 'white',
                            borderRadius: '14px',
                            boxShadow: '0px 3px 10px rgba(45, 74, 205, 0.25)',
                            textAlign: 'center',
                            lineHeight: '22px'
                          }}
                        >
                          {item.UnRead}
                        </span>
                        : ''
                      }
                    </Box>
                  </ListItemButton>
                </ListItem>
              </>
          })
        )}
      </Grid>
    </Box>
  )
}

export default ActiveSupport
