import * as React from 'react'
import { useState } from 'react'
import TicketContext from './TicketProvider'

const TicketState = (props: any) => {
  const [agentList, setAgentList] = useState([])
  const [agent, setAgent] = useState()
  const [createTicketResponse, setCreateTicketResponse] = useState()
  const [openTicketDetails, setOpenTicketDetails] = React.useState(false)
  const [editTicket, setEditTicket] = React.useState()
  const [getTicketId, setGetTicketId] = React.useState('')
  const [showopenTicket, setShowopenTicket] = React.useState(false)
  const [showUpdateUserData, setShowUpdateUserData] = React.useState()
  const [ticketData, setTicketData] = React.useState<any>([])
  const [offenceTicketCreate, setOffenceTicketCreate] = useState(false)
  const [editVictimDialogue, setEditVictimDialogue] = useState<any>(false)
  const [offenceticketslider, setoffenceticketslider] = React.useState(false)
  const [getOffenceTicketId, setOffenceTicketId] = React.useState(0)
  const [offenceTicketgetInfo, setoffenceTicketgetInfo] = React.useState(false)
  const [editWitnessDialogue, setEditWitnessDialogue] = useState<any>(false)
  const [editSuspectDialogue, setEditSuspectDialogue] = useState<any>(false)
  const [editPropertyDialogue, setEditPropertyDialogue] = useState<any>(false)
  const [loading, setLoading] = useState(false)
  const [allData, setAllData] = useState([])
  const [getOffenceTabId, setOffenceTabId] = React.useState(1)
  const [offenceTabNameActive, setOffenceTabNameActive] = useState<string>('victim-info')
  const [deleteTicket, setDeleteTicket] = useState("")


  //edit victim details
  const [victimData, setVictimData] = useState<any>([])
  const [witnessData, setWitnessData] = useState<any>([])
  const [suspectData, setSuspectData] = useState<any>([])
  const [propertyData, setPropertyData] = useState<any>([])
  const [basicPicker, setBasicPicker] = useState<Date | null>()
  const [caseInfo, setCaseInfo] = useState<any>()

  //Add offence ticket tab view manage
  const [addvictimData, setaddvictimData] = useState<any>([])
  const [addwitnessData, setaddwitnessData] = useState<any>([])
  const [addsuspectData, setaddsuspectData] = useState<any>([])
  const [addpropertyData, setaddpropertyData] = useState<any>([])
  const [changepasstoggleuser, setchangepasstoggleuser] = React.useState(false)

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

  //responsive state
  const [opacity, setOpacity] = useState<any>('none')
  const [pendingTicketsStyle, setPendingTicketsStyle] = useState<any>(defaultStyle)
  const [createTicketsStyle, setCreateTicketsStyle] = useState<any>(defaultStyle)
  const [offenceTicketsStyle, setOffenceTicketsStyle] = useState<any>(defaultStyle)
  const [getSupportTicketId, setSupportTicketId] = React.useState(0)

  const handleCloseBtn = () => {
    setOpacity('none')
  }
  const handleViewBtn = () => {
    setOpacity('block')
  }

  //ticket listing slider open
  const handleSliderOpen = () => {
    handleCloseBtn()
    setPendingTicketsStyle({
      ...defaultStyle,
      right: '0'
    })
    document.title = 'Tickets - Gogtas'

  }

  //tickt listinjg slider close
  const handleSliderClose = () => {
    setPendingTicketsStyle(defaultStyle)
    document.title = 'Dashboard - Gogtas'
  }

  //offenceticketz slider open
  const handlecreateSliderOpen = () => {
    setCreateTicketsStyle({
      ...defaultStyle,
      right: '0'
    })
    setOffenceTabId(1)
    setOffenceTabNameActive('victim-info')


  }

  //offence ticket slider close
  const handlecreateSliderClose = () => {
    setOffenceTicketId(0)
    setCreateTicketsStyle(defaultStyle)
    setoffenceTicketgetInfo(!offenceTicketgetInfo)
    setaddvictimData([])
    setaddwitnessData([])
    setaddsuspectData([])
    setaddpropertyData([])


  }

  //create ticket slider open
  const handleoffenceSliderOpen = () => {
    setOffenceTicketsStyle({
      ...defaultStyle,
      right: '0 !important'
    })
    document.title = "Create Ticket - Gogtas"
  }

  //create ticket slider close
  const handleoffenceSliderClose = () => {
    setOffenceTicketsStyle(defaultStyle)
    setSupportTicketId(0)
    setRefreshSupportTicket(!refreshSupportTicket)
    document.title = 'Dashboard - Gogtas'

  }

  const initialValues = {
    suspect: '',
    name: '',
    address: '',
    phone: '',
    dob: '',
    raes: '',
    sex: '',
    hair: '',
    eye: '',
    eht: '',
    occupation: '',
    employer: '',
    driverLicance: '',
    socialsecurity: ''
  }
  const [editValue, setEditValue] = useState<any>(initialValues)
  const [editWitnessValue, setEditWitnessValue] = useState<any>(initialValues)
  const [editSuspectValue, setEditSuspectValue] = useState<any>(initialValues)
  const [editPropertyValue, setEditPropertyValue] = useState<any>(initialValues)

  //common inpu field text foield
  const [messageTicket, setMessageTicket] = React.useState<any>('')
  const [commentreplay, setcommentReply] = useState('')
  const [getOrgId, setOrgId] = useState(0)
  const [Tabvalue, setTabValue] = useState<string>('0')
  const [FinalfilePath, setFinalfilePath] = useState<any>([])

  //drop file context
  const [drop, setDrop] = useState(false)
  const [filterData, setFilterData] = useState<any>([])
  const [imgPath, setImagePath] = React.useState<any>([])
  const [editoffenceticketrefresh, seteditoffenceticketrefresh] = useState<any>(false)

  //arrest report context
  const [arrestreport, setArrestReport] = React.useState(false);

  //Refresh CommonInputField Componene
  const [CommonInputFieldshow, setCommonInputFieldShow] = React.useState<any>(false)

  //After Delete Ticket  in Listing
  const [deleteTicketListing, setDeleteTicketlisting] = React.useState<any>(false)

  //Refress Support Ticket
  const [refreshSupportTicket, setRefreshSupportTicket] = React.useState(false)

  //Refresh sidebarLeft and Active support after update profile pic
  const [updateuserProfile, setupdateuserProfile] = React.useState(false)

  //agent Details for commonInputField
  const [agentDetails, setAgentDetails] = useState([])



  return (
    <>
      <TicketContext.Provider
        value={{
          setAgentList,
          agentList,
          setAgent,
          agent,
          setEditTicket,
          editTicket,
          setCreateTicketResponse,
          createTicketResponse,
          setOpenTicketDetails,
          openTicketDetails,
          getTicketId,
          setGetTicketId,
          showopenTicket,
          setShowopenTicket,
          showUpdateUserData,
          setShowUpdateUserData,
          ticketData,
          setTicketData,
          offenceTicketCreate,
          setOffenceTicketCreate,
          setEditVictimDialogue,
          editVictimDialogue,
          setVictimData,
          victimData,
          setWitnessData,
          witnessData,
          setSuspectData,
          suspectData,
          setPropertyData,
          propertyData,
          setBasicPicker,
          basicPicker,
          setEditValue,
          editValue,
          offenceticketslider,
          setoffenceticketslider,
          getOffenceTicketId,
          setOffenceTicketId,
          offenceTicketgetInfo,
          setoffenceTicketgetInfo,
          setEditWitnessDialogue,
          editWitnessDialogue,
          setEditWitnessValue,
          editWitnessValue,
          setCaseInfo,
          caseInfo,
          setEditSuspectValue,
          editSuspectValue,
          setEditSuspectDialogue,
          editSuspectDialogue,
          setEditPropertyDialogue,
          editPropertyDialogue,
          setEditPropertyValue,
          editPropertyValue,
          addvictimData,
          setaddvictimData,
          addwitnessData,
          setaddwitnessData,
          addsuspectData,
          setaddsuspectData,
          addpropertyData,
          setaddpropertyData,
          setLoading,
          loading,
          setAllData,
          allData,
          handleSliderOpen,
          handlecreateSliderOpen,
          handlecreateSliderClose,
          handleoffenceSliderOpen,
          handleoffenceSliderClose,
          handleCloseBtn,
          handleViewBtn,
          opacity,
          handleSliderClose,
          pendingTicketsStyle,
          createTicketsStyle,
          offenceTicketsStyle,
          setchangepasstoggleuser,
          changepasstoggleuser,
          getOffenceTabId,
          setOffenceTabId,
          setMessageTicket,
          messageTicket,
          setcommentReply,
          commentreplay,
          setImagePath,
          imgPath,
          offenceTabNameActive,
          setOffenceTabNameActive,
          getOrgId,
          setOrgId,
          Tabvalue,
          setTabValue,
          FinalfilePath,
          setFinalfilePath,
          drop,
          setDrop,
          filterData,
          setFilterData,
          editoffenceticketrefresh,
          seteditoffenceticketrefresh,
          getSupportTicketId,
          setSupportTicketId,
          deleteTicket,
          setDeleteTicket,
          arrestreport,
          setArrestReport,
          CommonInputFieldshow,
          setCommonInputFieldShow,
          deleteTicketListing,
          setDeleteTicketlisting,
          refreshSupportTicket,
          setRefreshSupportTicket,
          updateuserProfile,
          setupdateuserProfile,
          agentDetails,
          setAgentDetails,

        }}
      >
        {props.children}
      </TicketContext.Provider>
    </>
  )
}

export default TicketState
