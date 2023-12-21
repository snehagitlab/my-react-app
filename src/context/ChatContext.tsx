import * as React from 'react'
import { useState } from 'react'
import ChatContext from './ChatProvider'

const defaultStyle = {
  width: '100%',
  position: 'absolute',
  top: '0px',
  right: '-100%',
  zIndex: '2',
  transition: '0.5s linear',
  height: '100vh',
  overflowY: 'hidden'
}

const ChatState = (props: any) => {
  const [showActiveSupport, setShowActiveSupport] = useState(false)
  const [userLogin, setuserLogin] = useState()
  const [getUserImg, setGetUserImg] = useState<any>()
  const [showChat, setShowChat] = useState(false)
  const [updateUserStyle, setupdateUserStyle] = useState<any>(defaultStyle)

  const handleUserUpdate = () => {
    setupdateUserStyle({
      ...defaultStyle,
      right: '0'
    })
    document.title = "Profile - Gogtas"

  }

  const handleUserUpdateClose = () => {
    setupdateUserStyle(defaultStyle)
    document.title = 'Dashboard - Gogtas'
  }

  //chat conversation UUID
  const [UUID, setUUID] = useState<any>('')

  //set connection after login and used in chat 
  const [socketConnection, setSocketConnection] = useState('')

  //call conversation list update for new message arrive from other agent 
  const [refreshConversationList, setrefreshConversationList] = useState<any>(false)


  //check First Agent Id in conversation List
  const [checkFirstAgentID, setcheckFirstAgentID] = useState(0)

  //default user dashboard display after state change display chat Ui
  const [displayChat, setdisplayChatUi] = useState(false)

  //setUnRead Count To zero
  const [handleAgentListUnreadCount, sethandleAgentListUnreadCount] = useState(false)

  //call conversation api if handleAgentListUnreadCount is true
  const [handleCallConvList, sethandleCallConvList] = useState(false)

  //because of unread count not updated
  const [previousAgentIdState, setPreviousAgentIdState] = useState<any>([])
  const [previousAgentId, setPreviousAgentId] = useState<any>()

  //set Page for message
  const [page, setPage] = React.useState(1)

  //Message List Array
  const [msgConversation, setMsgConversation] = useState<any>()

  const [onlineStatus, setOnlineStatus] = useState<any>()
  const [ScrollerPageVisible, setScrollerPageVisible] = useState(false)


  return (
    <>
      <ChatContext.Provider
        value={{
          showActiveSupport,
          setShowActiveSupport,
          setuserLogin,
          userLogin,
          setGetUserImg,
          getUserImg,
          setShowChat,
          showChat,
          updateUserStyle,
          handleUserUpdate,
          handleUserUpdateClose,
          UUID,
          setUUID,
          socketConnection,
          setSocketConnection,
          refreshConversationList,
          setrefreshConversationList,
          checkFirstAgentID,
          setcheckFirstAgentID,
          displayChat,
          setdisplayChatUi,
          handleAgentListUnreadCount,
          sethandleAgentListUnreadCount,
          handleCallConvList,
          sethandleCallConvList,
          previousAgentId,
          setPreviousAgentId,
          page,
          setPage,
          msgConversation,
          setMsgConversation,
          onlineStatus,
          setOnlineStatus,
          ScrollerPageVisible,
          setScrollerPageVisible,
          previousAgentIdState,
          setPreviousAgentIdState
        }}
      >
        {props.children}
      </ChatContext.Provider>
    </>
  )
}

export default ChatState
