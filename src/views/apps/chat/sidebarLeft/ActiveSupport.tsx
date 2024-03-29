import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Badge, InputBase, InputAdornment, FormControl, Divider } from '@mui/material'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'

//import UserImage from '../../../../assets/Images/user_Icons/light/user_img.png'
import { API_PATHS, SOCKET_TICKET_REFRESH, USER_ROLE } from '../../../../config/api.config'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import TicketContext from '../../../../context/TicketProvider'
import ChatContext from '../../../../context/ChatProvider'

//import CreateTicket from './CreateTicketBtn'
import { socket } from '../../../../views/apps/chat/chatContent/SocketConnection'
import { DefaultProfilePic } from '../../../../views/apps/chat/chatContent/defaultProfilePic'
import moment from 'moment';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useSettings } from '../../../../@core/hooks/useSettings'
import ChatIcon from 'mdi-material-ui/ChatOutline'
import { ChatObject, SocketMessageInterface } from '@/src/interfaces/SocketInterfaces'

const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const API_VERSION = import.meta.env.VITE_APP_API_VERSION
const CHAT_URL = import.meta.env.VITE_APP_CHAT_URL
const useStyles = makeStyles({
  customTabs: {
    gap: '3rem',
  },
  tabLabel: {
    fontSize: '15px',
    textTransform: 'capitalize',
  },
  tab: {
    minHeight: '10px',
  },

});

const conversations = [
  {
    "_id": "65b21e37b5d120d351328c48",
    "type": 1,
    "participants": [
      "6e6addb9-6c21-4c1e-a9df-0b45535aa117",
      "e06b3842-4d75-404f-a8de-2120badbb569"
    ],
    "createdBy": "e06b3842-4d75-404f-a8de-2120badbb569",
    "createdAt": "2024-01-25T08:39:19.360Z",
    "updatedAt": "2024-01-25T08:39:19.360Z",
    "__v": 0
  },
  {
    "_id": "65b23491bc0ba1b06f8451c9",
    "type": 1,
    "name": null,
    "participants": [
      "a27475d2-8add-4ab1-9e68-d55bbfccac06",
      "e06b3842-4d75-404f-a8de-2120badbb569"
    ],
    "createdBy": "e06b3842-4d75-404f-a8de-2120badbb569",
    "createdAt": "2024-01-25T10:14:41.514Z",
    "updatedAt": "2024-01-25T10:14:41.514Z",
    "__v": 0
  },
  {
    "_id": "65b23d9d17ef8f41d2aafa99",
    "type": 1,
    "name": null,
    "participants": [
      "390f0f12-7fa1-46ae-9c4e-55edd31dca50",
      "e06b3842-4d75-404f-a8de-2120badbb569"
    ],
    "createdBy": "e06b3842-4d75-404f-a8de-2120badbb569",
    "createdAt": "2024-01-25T10:53:17.704Z",
    "updatedAt": "2024-01-25T10:53:17.704Z",
    "__v": 0
  }
];
const users = [
  { "_id": "6e6addb9-6c21-4c1e-a9df-0b45535aa117", "name": "Sneha", "lname": "Patil" },
  { "_id": "a27475d2-8add-4ab1-9e68-d55bbfccac06", "name": "Jiya", "lname": "Patil" },
  // ... (other participant objects)
];
function ActiveSupport() {

  const [mapper, setmapper] = useState<ChatObject[]>();
  const LoggedinuserIds: string = "e06b3842-4d75-404f-a8de-2120badbb569"
  const result = mapper?.map((conversation: ChatObject) => {
    const participants = conversation.participants;
    const matchingUser = users.find(user => LoggedinuserIds === user?._id || (participants && participants.includes(user?._id)));
    if (matchingUser) {
      return {
        conversationId: conversation._id,
        name: matchingUser.name,
        lname: matchingUser.lname,
        updatedAt: conversation.updatedAt,
        receiverId: matchingUser?._id
      };
    }
    return null;
  }).filter(Boolean); // Remove null values from the result


  useEffect(() => {
    socket.emit("findRoom");
    socket.on("listRoom", (socketData: ChatObject[]) => {
      setmapper(socketData);
    });
  }, []);

  const [finalConversationList, setFinalConversationList] = useState<({ conversationId: string; name: string; lname: string; updatedAt: string; receiverId: string } | null)[]>();
  useEffect(() => {
    const finalArrays = result?.filter(obj => obj?.conversationId !== undefined && obj?.conversationId !== "");
    finalArrays?.sort((a, b) => {
      const dateA = a ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
    const filteredArr = finalArrays?.filter((obj, index, self) =>
      self.map(o => o?.conversationId).indexOf(obj?.conversationId) === index
    );

    // Check if the filteredArrayss is different from the current state before updating
    if (!arraysAreEqual(filteredArr, finalConversationList)) {
      setFinalConversationList(filteredArr);
    }

  }, [result])

  // Utility function to check if two arrays are equal
  function arraysAreEqual(arr1: any, arr2: any) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  const classes = useStyles();
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
  const { settings } = useSettings()
  const { mode } = settings
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
    navigate('/chat/user')
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
    if (getDate == getToday) {
      const formatted_time = moment(date).format('hh:mm');
      return formatted_time
    }
    else {
      const diffDays = today.getDate() - date.getDate();
      if (diffDays == 1 || diffDays == 2 || diffDays == 3 || diffDays == 4 || diffDays == 5 || diffDays == 6 || diffDays == 7) {
        return moment(date).format('ddd');
      }
      else {
        return moment(date).format('DD-MM-YY');
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



  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      {/* responsive craete ticket button */}
      {/* <Grid sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
        <CreateTicket />
      </Grid> */}
      {/* end responsive create ticket button  */}

      <Grid container className="flex justify-center align-middle  mt-3" sx={{
        padding: '0px 15px 0px 15px', borderBottom: theme => `1px solid ${theme.palette.divider}`
      }}>
        {/* <Grid item sx={isOpened ? { display: 'none' } : {}}>
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
        </Grid> */}
        {/* <Grid item sx={isOpened ? { width: '100%' } : {}}>
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
        </Grid> */}

        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon position tabs example"
          className={classes.customTabs}

        >
          <Tab className={classes.tab} icon={<ChatIcon sx={{ height: '18px', width: '18px' }} />} iconPosition="start" label={<span className={classes.tabLabel}>Chat</span>} />
          <Tab className={classes.tab} icon={<ContactsOutlinedIcon sx={{ height: '17px', width: '17px' }} />} iconPosition="start" label={<span className={classes.tabLabel}>All</span>} />
          <Tab className={`${classes.tab}`} icon={<GroupsOutlinedIcon sx={{ height: '20px', width: '20px' }} />} iconPosition="start" label={<span className={classes.tabLabel}>Group</span>}
          />
        </Tabs>
      </Grid>
      <Grid sx={{ height: '61vh', overflowY: 'auto' }} ref={listInnerRef} onScroll={handleScroll}>
        {loading ? (

          /*  <CircularProgress color='inherit' /> */

          <Box sx={{ paddingTop: '12rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="loading">Loading...</div>
          </Box>
        ) : finalConversationList?.length === 0 ? (
          <Box sx={{ paddingTop: '12rem', display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'normal' }}>
            <Typography sx={{ textAlign: 'center', padding: '0px 50px' }}>{displaemptyMessage ? displaemptyMessage : ''}</Typography>
          </Box>
        ) : (

          finalConversationList?.map((item: any, id: number) => {

            const time = LastTimeOfMessage(item?.updatedAt)
            if (item?.userId != LoggedinuserId)

              return <>

                <ListItem
                  className={`list-item ${item.isSelected ? 'selected-item' : ''} rounded-2xl m-2 `}
                  sx={{
                    border: theme => `1px solid ${theme.palette.divider}`, paddingBottom: '0', cursor: 'pointer', paddingTop: '0', width: '95%', '&:hover': { backgroundColor: (theme) => theme.palette.primary.main + '13' }
                  }}
                  //  '&:hover': {
                  //   backgroundColor: (theme) => theme.palette.primary.main + '13', borderLeft: (theme) => `3px solid ${theme.palette.primary.main}`,

                  // }
                  key={item?.id}
                  onClick={() => {
                    setShowopenTicket(false),
                      setOpenTicketDetails(false),
                      setOffenceTicketCreate(false),
                      handleHideInputField()
                    user?.data?.userId != item?.userId ?
                      (handleShowChatContent(), setdisplayChatUi(true)) : setdisplayChatUi(false)
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      user?.data?.userId != item?.userId ?
                        (setPage(1),
                          setScrollerPageVisible(true),
                          agent?.userId != item?.userId ? setMsgConversation([]) : '',
                          setAgent(item),
                          ConversationListByPreviousAgent(previousAgentId),
                          item?.UnRead > 0 ? sethandleAgentListUnreadCount(true) : sethandleAgentListUnreadCount(false))
                        : setdisplayChatUi(false)
                    }}
                    disableRipple
                    sx={{
                      p: '12px 2px',
                      width: '100%',
                      borderRadius: 1,
                      alignItems: 'flex-start',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
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
                              backgroundColor: item?.isOnline == 0 ? '#A0A0A0' : '#0ea70e'
                            }}
                          />
                        }
                      >
                        <MuiAvatar
                          src={item?.profilePic !== "no_pic" ? "https://semilynx.gogtas.com/static/media/user_img.d3c64685c1df07b335a7.png" : "https://semilynx.gogtas.com/static/media/user_img.d3c64685c1df07b335a7.png"}
                          alt={item?.name}
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
                            color: mode === 'dark' ? '#ffffff' : 'rgba(27, 11, 43, 0.8)',
                            textTransform: 'capitalize',
                            lineHeight: '25.39px'
                          }}
                        >
                          {item?.name + ' ' + item?.lname}
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
                            color: mode === 'dark' ? '#ffffff' : 'rgba(27, 11, 43, 0.8)',
                          }}
                        >
                          {item?.role == USER_ROLE.USER ? 'Business Owner' : 'Admin'}
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
                          color: mode === 'dark' ? '#ffffff' : 'rgba(27, 11, 43, 0.8)',
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
                          {item?.UnRead}
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
