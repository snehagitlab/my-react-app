import React, { useEffect, useRef, useState, useContext } from 'react'
import { TextareaAutosize, Typography } from '@mui/material'
import Avatar from '../../../@core/components/mui/avatar'
import { Grid } from '@mui/material'
import { DefaultProfilePic } from '../../../views/apps/chat/chatContent/defaultProfilePic'
import sendBtnImage from '../../../assets/Images/sendbtn.png'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import TicketContext from '../../../context/TicketProvider'
import { CHAT_MESSAGE_TYPE, API_PATHS, SOCKET_TICKET_REFRESH } from '../../../config/api.config'
import ChatContext from '../../../context/ChatProvider'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTheme } from '@mui/material/styles'
import { Helmet } from 'react-helmet'
import { socket } from '../../../views/apps/chat/chatContent/SocketConnection'
import moment from 'moment'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { useSettings } from '../../../@core/hooks/useSettings'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { IconButton } from '@mui/material';
import Picker from 'emoji-picker-react';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicroPhoneSelected from '../../../assets/Images/user_Icons/light/microphone_selected.png';
import { Close } from 'mdi-material-ui'
import { MessageItem } from './types'
import { SocketMessageInterface } from 'src/interfaces/SocketInterfaces'

const CHAT_URL = import.meta.env.VITE_APP_CHAT_URL

function Index() {

  const { agent } = useContext<any>(TicketContext)
  const { previousAgentIdState, ScrollerPageVisible, setScrollerPageVisible, msgConversation, setMsgConversation, page, setPage, setPreviousAgentId, setrefreshConversationList, setcheckFirstAgentID, handleAgentListUnreadCount, sethandleCallConvList } = useContext<any>(ChatContext)
  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  const senderId = 'e06b3842-4d75-404f-a8de-2120badbb569' //user?.data?.userId
  const messagesEndRef = useRef<any>(null)
  const theme = useTheme()
  const [msg, setMsg] = useState<string>('')
  const [loder, setLoader] = useState(false)
  const [response, setresponse] = useState<any>()
  const listInnerRef: any = useRef<any>(null)
  const [record, setRecord] = useState<any>(12)
  const { settings } = useSettings()
  const { mode } = settings
  const microphoneRef: any = useRef(null)

  console.log(JSON.stringify(msgConversation) + "<<<<")
  useEffect(() => {
    if (msgConversation && msgConversation?.length > 0) {
      msgConversation.filter((obj: any, index: any, self: any) =>
        self.map((o: any) => o.messageId).indexOf(obj.messageId) === index);
    }
  }, [msgConversation]);


  useEffect(() => {
    socket.on("message", (socket: SocketMessageInterface) => {
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
      Object.assign(shoeMsgData, { receiver_id: agent?.receiverId })
      Object.assign(shoeMsgData, { sender_id: senderId })
      Object.assign(shoeMsgData, { content: msg.trim() })
      Object.assign(shoeMsgData, { conversation_id: agent?.conversationId })
      Object.assign(shoeMsgData, { createdAt: new Date() })
      socket.emit("createMessage", shoeMsgData)
      setMsgConversation((oldArray: any) => [shoeMsgData, ...oldArray])
      BottomScrollheight()
      setLoader(false)
      setMsg('')
      const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
      const url = new URL(`${CHAT_URL}/${API_PATHS.message}/${API_PATHS.send}`)
      const requestData = {}
      Object.assign(requestData, { message: msg.trim() })
      Object.assign(requestData, { messageType: CHAT_MESSAGE_TYPE.DEFAULT_MSG })
      Object.assign(requestData, { receiverId: agent?.userId })
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
          setcheckFirstAgentID(agent?.userId)
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
      previousAgentIdState.push(agent?.userId)
      if (previousAgentIdState && previousAgentIdState?.length > 1) {
        setPreviousAgentId(previousAgentIdState[previousAgentIdState?.length - 1])
      }

    } else {
      setPreviousAgentId(agent?.userId)
    }
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const url = new URL(`${CHAT_URL}/${API_PATHS.message}?receiverId=${agent?.userId}&sortOrder=DESC&recordsPerPage=12&pageNumber=${page}&sortBy=createdAt`)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData?.token}`
      }
    })
    const result = await response.json()
    if (result.status === 200) {
      if (page == 1) {
        setMsgConversation([])
      }
      handleAgentListUnreadCount ? sethandleCallConvList(true) : sethandleCallConvList(false)
      if (msgConversation && msgConversation.length > 0) {
        setMsgConversation((oldArray: any) => [...oldArray, ...result?.payload?.data])
      } else {
        setMsgConversation(result?.payload?.data)
      }

      if (page == 1) {
        BottomScrollheight()
      }
      setRecord(result.pager.totalRecords)
    }
    else {
      setMsgConversation([])
    }

  }

  useEffect(() => {
    if (agent?.conversationId !== "" && agent?.conversationId !== undefined) {
      setMsg('')
      //getConversationDetails()
      socket.emit("joinRoom", { "room_id": agent?.conversationId });
      socket.on("joinedRoom", (socketData: any) => {
        console.log("Joined Room Data ", socketData);
        setMsgConversation(socketData)
      });

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
    objDiv.scrollTop = objDiv?.scrollHeight;
  }

  //show emoji picker           
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (event: any, emojiObject: any) => {
    setMsg((prevInput: any) => prevInput + emojiObject.emoji)
  };

  //Speech to text component        
  const commands: any = [
    {
      command: 'open *',
      callback: (website: any) => {
        window.open('http://' + website.split(' ').join(''))
      }
    },
    {
      command: 'change background colour to *',
      callback: (color: any) => {
        document.body.style.background = color
      }
    },
    {
      command: 'reset',
      callback: () => {
        handleReset()
      }
    },
    ,
    {
      command: 'reset background colour',
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`
      }
    }
  ]
  const [anchorElListening, setAnchorElListening] = React.useState<HTMLButtonElement | null>(null)
  const { transcript, resetTranscript } = useSpeechRecognition({ commands })
  const [isListening, setIsListening] = useState(false)
  const openListening = Boolean(anchorElListening)
  const idListening = openListening ? 'simple-popover' : undefined
  const handleListing = () => {
    setIsListening(true)
    microphoneRef?.current?.classList?.add('listening')
    SpeechRecognition.startListening({
      continuous: true
    })
  }

  const stopHandle = () => {
    microphoneRef?.current?.classList?.remove('listening')
    SpeechRecognition.stopListening()
    setMsg((prevState: any) => [...prevState, transcript].toString().replace(/,/g, ''))
    handleCloseListening()
    setIsListening(false)
    resetTranscript()
  }

  const handleReset = () => {
    resetTranscript()
  }

  const handleCloseListingPopover = () => {
    setAnchorElListening(null)
    resetTranscript()
    setIsListening(false)
  }

  const handleCloseListening = () => {
    setAnchorElListening(null)
  }

  const handleOpenListening = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElListening(event.currentTarget)
  }

  const [isHovered, setIsHovered] = useState<string>('');
  const handleMouseEnter = (id: string) => {
    setIsHovered(id);
  };

  const handleMouseLeave = () => {
    setIsHovered('');
  };

  //Edit Message Information item: MessageItem
  const MoreInfoComponent = () => {
    const open = Boolean(isHovered);
    const id1 = open ? 'simple-popover' : undefined;
    const [anchorElDrop, setAnchorElDrop] = React.useState<HTMLButtonElement | null>(null)
    const handleDropdownOpen = (event: any) => {
      setAnchorElDrop(event.currentTarget)
    }
    const handleDropdownClose = () => {
      setAnchorElDrop(null)
    }
    const myListData = [
      { icon: <ContentCopyOutlinedIcon sx={{ color: '#000', height: '18px', width: '18px' }} />, text: 'Copy' },
      { icon: <EditOutlinedIcon sx={{ color: '#000', height: '18px', width: '18px' }} />, text: 'Edit' },
      { icon: <DisabledByDefaultOutlinedIcon sx={{ color: '#000', height: '18px', width: '18px' }} />, text: 'Remove' },
    ];



    return (

      <>
        <MoreVertIcon
          fontSize='small'
          className='text-[#8b8888]  !text-[14px] cursor-pointer absolute -right-3 top-1'
          onClick={(e: any) => handleDropdownOpen(e)}
          aria-describedby={id1}
        />

        <Popover
          id={id1}
          anchorEl={anchorElDrop}
          open={Boolean(anchorElDrop)}
          onClose={() => handleDropdownClose()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box className="w-full">
            <ul className='p-[7px] list-none' >
              {myListData.map((item, index) => (
                <li key={index} className="flex align-middle p-[4px]" >
                  {item.icon}
                  <Typography className="text-sm !text-lightBlack pl-[10px] mb-[15px]" >{item.text}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        </Popover>
      </>
    )

  }



  return (
    <>
      <Helmet>
        <title>Chat - ProBizCa</title>
        <meta name="description" content="Chat - ProBizCa" />
      </Helmet>

      <Box
        // sx={{
        //   background: '#F3F5F7',
        //   width: '100%',
        //   height: { md: 'calc(100% - 86px)' },
        //   justifyContent: 'center',
        //   border: { sm: ' 1px solid #F4F4F8', xs: '1px solid #F4F4F8', md: 'none' },
        //   borderRadius: { sm: '38px 38px', xs: '38px 38px', md: '0px 0px' },
        //   position: 'relative'

        // }}
        sx={{ width: '100%', height: { md: 'calc(100% - 86px)' } }}
        className={`justify-center border border-solid border-[#F4F4F8] bg-white sm:rounded-md xs:rounded-md md:rounded-none`}

      >
        <Box className='chat-div'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: { md: '100%', sm: 'calc(100vh - 152px);', xs: 'calc(100vh - 200px);' }
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
                    console.log(item?.sender_id + "===" + senderId);
                    return item?.sender_id === senderId ?
                      <Grid container className='senderMsg' position={'relative'} display={'flex'} flexDirection={'column'} alignItems={'end'} ref={messagesEndRef} >
                        <Grid item key={key} sx={{ maxWidth: '70%' }}>
                          <Grid container flexDirection={'column'} sx={{ alignItems: 'end', wordBreak: 'break-all' }}>
                            <Grid item
                              onMouseEnter={() => handleMouseEnter(item?.uuid)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <Typography
                                variant='body2'
                                sx={{
                                  display: 'inline-block',
                                  background: (theme) => theme.palette.primary.main,
                                  color: '#FFFFFF',
                                  fontSize: '14px',
                                  fontWeight: '5  00',
                                  fontFamily: 'Mazzard-Regular',
                                  padding: '10px 13px',
                                  margin: '2px 0',
                                  borderRadius: '15px 15px 0px 15px',
                                  whiteSpace: "pre-wrap",

                                }}

                              >
                                {item?.content}
                              </Typography>
                              {isHovered == item?.uuid && (
                                <MoreInfoComponent />
                              )}
                            </Grid>
                            <Grid item>
                              <Typography
                                variant='body2'
                                sx={{
                                  display: 'inline-block',
                                  margin: '1px 0px',
                                  fontWeight: '400',
                                  fontSize: '10px',
                                  color: '#000000b0',
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

                      : item?.sender_id === agent?.receiverId ?

                        <>
                          <Grid container className='receiverMsg' sx={{ flexWrap: 'nowrap', maxWidth: '70%' }} key={key} ref={messagesEndRef}
                          >
                            <Grid item alignSelf={'end'} sx={{ marginBottom: '23px', position: 'relative' }}>
                              <Avatar alt={agent?.fname} src={agent != undefined && agent?.profilePic != '' ? "https://semilynx.gogtas.com/static/media/user_img.d3c64685c1df07b335a7.png" : DefaultProfilePic} sx={{ marginRight: '10px', width: '38px', height: '38px' }} />
                            </Grid>
                            <Grid sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column', wordBreak: 'break-all', position: 'relative' }}>
                              <Grid item>
                                <Grid container flexDirection={'column-reverse'}>
                                  <Grid item
                                    onMouseEnter={() => handleMouseEnter(item?.uuid)}
                                    onMouseLeave={handleMouseLeave}
                                  >
                                    <Typography
                                      variant='body2'
                                      sx={{
                                        display: 'inline-block',
                                        backgroundColor: (theme) => theme.palette.primary.main + '13',
                                        padding: '10px 13px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        fontFamily: 'Mazzard-Regular',
                                        margin: '3px 0 0',
                                        borderRadius: '15px 15px 15px 0',
                                        whiteSpace: "pre-wrap",
                                        color: (theme) => theme.palette.primary.main
                                      }}
                                    >
                                      {item?.content}
                                    </Typography>
                                    {isHovered == item?.uuid && (
                                      <MoreInfoComponent />
                                    )}

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
                                    color: '#000000b0',
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
                        : item?.senderId != agent?.userId ?
                          (setrefreshConversationList(true))
                          : ''

                  })
                  : ' '}



              </Box>
            </Box>
          </Box>

          {/* //import textfield div */}

          <Grid sx={{ width: '100%' }}>
            <Box sx={{ margin: '20px 20px -15px 20px' }}>

              {showEmojiPicker && <Picker onEmojiClick={handleEmojiSelect} />}
            </Box>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Box sx={{ margin: '20px 20px 10px 20px' }}>
              <form onSubmit={handleSendMsg} >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'end',
                  boxShadow: theme?.shadows[1],
                  padding: theme?.spacing(1.25, 4),
                  justifyContent: 'space-between',
                  borderRadius: '14px',
                  backgroundColor: theme?.palette?.background?.paper
                }}>

                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleEmojiClick} sx={{ padding: '0px' }}>
                      {showEmojiPicker ? <KeyboardArrowDownOutlinedIcon /> : <SentimentSatisfiedOutlinedIcon />}
                    </IconButton>

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
                      <>
                        {openListening || msg != "" ?
                          <Button
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '50%',
                              height: '43px',
                              minWidth: '40px',
                              width: '40px'
                            }}

                            className='sendBtn' type='submit' variant='contained' >
                            <SendOutlinedIcon sx={{ color: '#fff', fontSize: '18px' }} />
                          </Button>
                          :
                          <Button
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '50%',
                              height: '43px',
                              minWidth: '40px',
                              width: '40px'
                            }}
                            ref={microphoneRef}
                            onClick={(e: any) => {
                              handleListing(), handleOpenListening(e)
                            }}
                            variant='contained' >
                            <KeyboardVoiceOutlinedIcon sx={{ color: '#fff', fontSize: '20px' }} />

                          </Button>
                        }
                      </>
                    }


                  </Box>
                </Box>
              </form>

            </Box>
          </Grid>

          {/* //end text editor */}


        </Box >
      </Box >
      {/* listening popover */}
      <Popover
        sx={{
          padding: '21px', overflow: 'hidden', width: '100%', bgcolor: '#3a354114'
        }
        }
        // anchorPosition={{ top: 200, left: 900 }}
        className='viewPopup-listening'
        id={idListening}
        open={openListening}
        anchorEl={anchorElListening}
        onClose={handleCloseListening}
      >
        <Grid container sx={{ paddingTop: '12px', position: 'relative' }} justifyContent={'space-between'}>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size='small'
              sx={{ color: 'text.primary', mr: { md: '14px', xs: '10px', sm: '14px' } }}
              className='microphone-start'
            >
              <img src={MicroPhoneSelected} alt='microphone' style={{ width: '20px', height: '20px' }} />
            </IconButton>
            <Typography>Speek now</Typography>
          </Grid>
          <Grid item onClick={handleCloseListingPopover} sx={{ cursor: 'pointer', position: 'absolute', left: '96%', top: '-14%' }}>
            <Close sx={{ width: '19px', height: '19px' }} />
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent={'center'} sx={{ marginTop: '15px !important', paddingBottom: '5px', width: '100%' }}>
          <Grid item sm={12} md={12} sx={{ width: '100%' }}>
            <TextareaAutosize
              value={transcript}
              minRows={7}
              style={{
                width: '100%',
                border: '1px solid #e5e5e5',
                borderRadius: '10px',
                height: '105px',
                padding: '5px',
                outlineColor: '#e5e5e5'
              }}
            />
          </Grid>

          <Grid item sm={5} sx={{ p: '0px !important' }}>
            <Button
              onClick={handleReset}
              fullWidth
              variant='outlined'
              sx={{
                fontWeight: '500',
                fontSize: '13px',
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: '9px ',
                filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                p: '13px 28px',
                mt: '10px',
                textTransform: 'capitalize',
                color: `${theme.palette.primary.main}`,
                '&:hover': {
                  border: `1px solid ${theme.palette.primary.main}`,
                }
              }}
            >
              Reset
            </Button>
          </Grid>
          <Grid item sm={5} sx={{ pt: '0px !important' }}>
            <Button
              onClick={stopHandle}
              fullWidth
              variant='contained'
              sx={{
                fontWeight: '500',
                fontSize: '13px',
                borderRadius: '9px',
                p: '13px',
                mt: '10px',
                textTransform: 'capitalize',
                color: '#fff',
                backgroundColor: `${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}`,
                }
              }}
            >
              Stop & Add
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </>
  )
}



export default Index

