// export default ChatLog
import React, { useEffect, useRef, useState } from 'react'
import { Typography } from '@mui/material'
import Avatar from '../../../@core/components/mui/avatar'
import { Grid } from '@mui/material'

//import imgaes

//import UserImage from '../../../assets/Images/user_Icons/light/user_img.png'

import { DefaultProfilePic } from '../../../views/apps/chat/chatContent/defaultProfilePic'
import sendBtnImage from '../../../assets/Images/sendbtn.png'

// ** MUI Imports
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

//import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TicketContext from '../../../context/TicketProvider'
import { CHAT_MESSAGE_TYPE, API_PATHS, SOCKET_TICKET_REFRESH } from '../../../config/api.config'
import ChatContext from '../../../context/ChatProvider'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTheme } from '@mui/material/styles'
import { Helmet } from 'react-helmet'
import { socket } from '../../../views/apps/chat/chatContent/SocketConnection'
import moment from 'moment'

const CHAT_URL = import.meta.env.VITE_APP_CHAT_URL

function Index() {

  const { agent } = React.useContext<any>(TicketContext)
  const { previousAgentIdState, ScrollerPageVisible, setScrollerPageVisible, msgConversation, setMsgConversation, page, setPage, setPreviousAgentId, setrefreshConversationList, setcheckFirstAgentID, handleAgentListUnreadCount, sethandleCallConvList } = React.useContext<any>(ChatContext)
  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const senderId = user.data.userId
  const messagesEndRef = useRef<any>(null)
  const theme = useTheme()
  const [msg, setMsg] = useState<string>('')
  const [loder, setLoader] = useState(false)
  const [response, setresponse] = useState<any>()
  const listInnerRef: any = useRef<any>(null)
  const [record, setRecord] = React.useState<any>(12)


  useEffect(() => {
    if (msgConversation && msgConversation.length > 0) {

      return msgConversation.filter((obj: any, index: any, self: any) =>
        self.map((o: any) => o.messageId).indexOf(obj.messageId) === index)
    }

  }, [msgConversation])

  useEffect(() => {
    socket.on("message", (socket: any) => {
      console.log(JSON.stringify(socket))
      setresponse(socket)
    });
  }, []);

  useEffect(() => {

    if (response?.data && response?.type == SOCKET_TICKET_REFRESH.NEW_MESSAGE) {
      setMsgConversation((oldArray: any) => [JSON.parse(response?.data), ...oldArray])
    }
  }, [response])

  useEffect(() => {
    if (messagesEndRef?.current) {
      if (page == 1) {
        BottomScrollheight()
      }
    }
  }, [msgConversation])

  const handleSendMsg = async (e: any) => {
    e.preventDefault()
    if (msg.trim() != '') {
      setLoader(true)
      const shoeMsgData = {}
      Object.assign(shoeMsgData, { message: msg.trim() })
      Object.assign(shoeMsgData, { createdAt: new Date() })
      Object.assign(shoeMsgData, { senderId: senderId })
      setMsgConversation((oldArray: any) => [shoeMsgData, ...oldArray])
      BottomScrollheight()
      setLoader(false)
      setMsg('')
      const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
      const url = new URL(`${CHAT_URL}/${API_PATHS.message}/${API_PATHS.send}`)
      const requestData = {}
      Object.assign(requestData, { message: msg.trim() })
      Object.assign(requestData, { messageType: CHAT_MESSAGE_TYPE.DEFAULT_MSG })
      Object.assign(requestData, { receiverId: agent.userId })
      try {
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${UserData.token}`
          },
          body: JSON.stringify(requestData)
        })
        const result = await response.json()

        if (result.status == 200) {
          setLoader(false)
          setMsg('')
          setcheckFirstAgentID(agent.userId)
        }
        else {
          console.log(result.message)
        }
      } catch (ex) {
        console.log(ex)
      }
    }
    setLoader(false)
    setMsg('')
  }

  const handleScroll = () => {
    const { scrollTop } = listInnerRef.current
    if (scrollTop === 0) {
      const TotalPageNumber = Math.round(record / 12)
      let pages: any
      if (page < TotalPageNumber) {
        ScrollerPageVisible ? (pages = page + 0, setScrollerPageVisible(false)) : pages = page + 1

        setPage(pages)
      } else {
        console.log('Reach to all msg')

      }
    }
  }

  const getConversationDetails = async () => {
    if (previousAgentIdState && previousAgentIdState) {
      previousAgentIdState.push(agent.userId)
      console.log(JSON.stringify(previousAgentIdState))
      if (previousAgentIdState && previousAgentIdState.length > 1) {
        setPreviousAgentId(previousAgentIdState[previousAgentIdState.length - 1])
      }

    } else { setPreviousAgentId(agent.userId) }
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(`${CHAT_URL}/${API_PATHS.message}?receiverId=${agent.userId}&sortOrder=DESC&recordsPerPage=12&pageNumber=${page}&sortBy=createdAt`)
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
      if (page == 1) {
        setMsgConversation([])
        console.log("1");

      }
      handleAgentListUnreadCount ? sethandleCallConvList(true) : sethandleCallConvList(false)
      if (msgConversation && msgConversation.length > 0) {
        console.log(JSON.stringify(result?.payload?.data))
        setMsgConversation((oldArray: any) => [...oldArray, ...result?.payload?.data])
        console.log("2");

      } else {
        setMsgConversation(result?.payload?.data)
        console.log("3");

      }

      if (page == 1) {
        BottomScrollheight()
        console.log("4");

      }

      setRecord(result.pager.totalRecords)

    }
    else {
      setMsgConversation([])
      console.log("5");

    }

  }

  useEffect(() => {
    if (agent?.userId > 0) {
      setMsg('')
      getConversationDetails()
    }
    else { setMsgConversation([]) }
  }, [agent, page])


  function handleKeyPress(e: any) {
    if (e.keyCode === 13 && e.shiftKey === false && !e.altKey) {
      handleSendMsg(e);
    } else if (e.keyCode === 13 && e.altKey) {
      const currentText = e.target.value;
      setMsg(currentText + "\n");
      BottomScrollheight()
    }
  }

  const searchInput = useRef<any>();

  useEffect(() => {
    if (searchInput.current != undefined) {
      searchInput.current.focus();
    }
  }, []);

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
      if (diffDays > 0) {
        return moment(date).format('DD-MM-YY hh:mm A');
      }
      else {
        return moment(date).format('DD-MM-YY hh:mm A');

      }

    }

  }
  function BottomScrollheight() {
    const objDiv: any = document.getElementById("chatHeight");
    objDiv.scrollTop = objDiv.scrollHeight;
  }


  return (
    <>

      <Helmet>
        <title>Chat - Gogtas</title>
        <meta name="description" content="Chat - Gogtas" />
      </Helmet>
      <Box
        sx={{
          background: '#F3F5F7',
          width: '100%',
          height: { md: 'calc(100% - 86px)' },
          justifyContent: 'center',
          border: { sm: ' 1px solid #F4F4F8', xs: '1px solid #F4F4F8', md: 'none' },
          borderRadius: { sm: '38px 38px', xs: '38px 38px', md: '0px 0px' },
          position: 'relative'

        }}
      >
        <Box className='chat-div'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: ' calc(100vh - 76px);'
          }}
        >
          <Box
            id="chatHeight"
            className='msg-div'
            sx={{
              flex: 'auto',
              overflowY: 'auto',
              padding: '15px 25px 0px 25px',
              '&::-webkit-scrollbar-thumb': {
                visibility: 'hidden'
              },
              '&:hover::-webkit-scrollbar-thumb': {
                visibility: 'visible'
              }
            }}

            ref={listInnerRef}
            onScroll={handleScroll}
          >

            <Box className='chatListDiv'>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column-reverse'
              }}
              >

                {msgConversation?.length > 0 ?
                  msgConversation.map((item: any, key: any) => {
                    const time = LastTimeOfMessage(item?.createdAt)

                    return item.senderId == senderId ?
                      <Grid container className='senderMsg' display={'flex'} flexDirection={'column'} alignItems={'end'} ref={messagesEndRef} >                      <Grid item key={key} sx={{ maxWidth: '70%' }}>
                        <Grid container flexDirection={'column'} sx={{ alignItems: 'end', wordBreak: 'break-all' }}>
                          <Grid item>
                            <Typography
                              variant='body2'
                              sx={{
                                display: 'inline-block',
                                background: '#2D4ACD',
                                color: '#FFFFFF',
                                fontSize: '14px',
                                fontWeight: '5  00',
                                fontFamily: 'Mazzard-Regular',
                                padding: '10px 13px',
                                margin: '2px 0',
                                borderRadius: '15px 15px 0px 15px',
                                whiteSpace: "pre-wrap",
                                textShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)' /* Apply a subtle shadow for smoothing */

                              }}
                            >
                              {item.message}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant='body2'
                              sx={{
                                display: 'inline-block',
                                margin: '1px 0px',
                                fontWeight: '400',
                                fontSize: '10px',
                                color: 'rgba(62, 50, 74, 0.63)',
                                transform: 'rotate(-0.07deg)',
                                textAlign: 'end'
                              }}
                            >
                              {time}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      </Grid>

                      : item.senderId == agent.userId ?

                        <>
                          <Grid container className='receiverMsg' sx={{ flexWrap: 'nowrap', maxWidth: '70%' }} key={key} ref={messagesEndRef}
                          >
                            <Grid item alignSelf={'end'} sx={{ marginBottom: '23px' }}>
                              <Avatar alt='Dindy Baker' src={agent != undefined && agent.profilePic != '' ? agent.profilePic : DefaultProfilePic} sx={{ marginRight: '10px', width: '38px', height: '38px' }} />
                            </Grid>
                            <Grid sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column', wordBreak: 'break-all' }}>
                              <Grid item>
                                <Grid container flexDirection={'column-reverse'}>
                                  <Grid item>
                                    <Typography
                                      variant='body2'
                                      sx={{
                                        display: 'inline-block',
                                        background: 'white',
                                        padding: '10px 13px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        fontFamily: 'Mazzard-Regular',
                                        margin: '5px 0 0',
                                        borderRadius: '15px 15px 15px 0',
                                        whiteSpace: "pre-wrap",
                                        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)' /* Apply a subtle shadow for smoothing */

                                      }}
                                    >
                                      {item.message}
                                    </Typography>
                                  </Grid>

                                </Grid>
                              </Grid>
                              <Grid item>
                                <Typography
                                  variant='body2'
                                  sx={{
                                    display: 'inline-block',
                                    margin: '1px 0px',
                                    fontWeight: '400',
                                    fontSize: '10px',
                                    color: 'rgba(62, 50, 74, 0.63)',
                                    transform: 'rotate(-0.07deg)',
                                    textAlign: 'end'

                                  }}
                                >
                                  {time}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>

                        </>
                        : item?.senderId != agent.userId ?
                          (setrefreshConversationList(true))
                          : ''

                  })
                  : ' '}



              </Box>
            </Box>
          </Box>

          {/* //import textfield div */}

          <Grid sx={{ width: '100%' }}>
            <Box sx={{ margin: '20px 20px' }}>
              <form onSubmit={handleSendMsg} >

                <Box sx={{
                  display: 'flex',
                  alignItems: 'end',
                  boxShadow: theme.shadows[1],
                  padding: theme.spacing(1.25, 4),
                  justifyContent: 'space-between',
                  borderRadius: '14px',
                  backgroundColor: theme.palette.background.paper
                }}>

                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      multiline
                      ref={searchInput}
                      maxRows={4}
                      size='small'
                      key="password"
                      value={msg}
                      name='msgs'
                      placeholder='Type a message...'
                      onChange={e => { setMsg(e.target.value) }}
                      sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' }, width: '100%' }}
                      onKeyDown={handleKeyPress}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'end' }}>

                    {loder ?
                      <>
                        <LoadingButton
                          loading={loder}
                          variant='contained'
                          disabled
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '50%',
                            height: '40px',
                            minWidth: '40px',
                            width: '40px'
                          }}
                        >
                          <img
                            style={{ width: "22px", paddingLeft: "3px" }}
                            alt='Dindy Baker' src={sendBtnImage} />
                        </LoadingButton>
                      </>
                      :
                      <Button
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '50%',
                          height: '40px',
                          minWidth: '40px',
                          width: '40px'
                        }}

                        className='sendBtn' type='submit' variant='contained' >

                        <img style={{ width: "22px", paddingLeft: "3px" }} alt='Dindy Baker' src={sendBtnImage} />


                      </Button>
                    }


                  </Box>
                </Box>
              </form>

            </Box>
          </Grid>

          {/* //end text editor */}


        </Box>
      </Box>
    </>
  )
}



export default Index

