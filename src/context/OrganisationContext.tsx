import * as React from 'react'
import { useState } from 'react'
import OrganisationContext from './OrganisationProvider'

const OrganisationState = (props: any) => {
  const [showActiveSupport, setShowActiveSupport] = useState(false)
  const [createOrgList, setCreateOrgtList] = useState(false)
  const [createUserAgentList, setCreateUserAgentList] = useState(false)
  const [victimcount, setvictimCount] = useState<number>(0)
  const [witnesscount, setwitnessCount] = useState<number>(0)
  const [suspectcount, setsuspectCount] = useState<number>(0)
  const [propertycount, setpropertyCount] = useState<number>(0)
  const [othercount, setotherCount] = useState<number>(0)

  const [statusChange, setStatusChange] = useState(false)
  const [changepasstoggle, setchangepasstoggle] = React.useState(false)
  const [addUserAgenttoggle, setaddUserAgenttoggle] = React.useState(false)
  const [addUserAgentId, setaddUserAgentId] = useState<number>(0)
  const [displayAlluserType, setDisplayAlluserType] = React.useState(false)
  const [addUserTypetoggle, setaddUserTypetoggle] = React.useState(false)
  const [Usertypeid, setUsertypeid] = useState<number>(0)
  const [editOffenceUser, setEditOffenceUser] = useState(false)
  const [typeId, settypeId] = useState(0)
  const [datafeedfileName, setdatafeedFileName] = useState()
  const [loading, setLoading] = useState(false)
  const [refreshImportList, setRefreshImportList] = useState(false)
  const [orgtypeId, setOrgtypeId] = useState(0)

  //satte for when admin detail update change show in header also
  const [getupdateadmin, setupdateadmin] = useState(false)


  return (
    <>
      <OrganisationContext.Provider
        value={{
          showActiveSupport,
          setShowActiveSupport,
          createUserAgentList,
          setCreateUserAgentList,
          setvictimCount,
          victimcount,
          witnesscount,
          setwitnessCount,
          suspectcount,
          setsuspectCount,
          propertycount,
          setpropertyCount,
          othercount,
          setotherCount,
          setCreateOrgtList,
          createOrgList,
          statusChange,
          setStatusChange,
          changepasstoggle,
          setchangepasstoggle,
          addUserAgenttoggle,
          setaddUserAgenttoggle,
          addUserAgentId,
          setaddUserAgentId,
          displayAlluserType,
          setDisplayAlluserType,
          addUserTypetoggle,
          setaddUserTypetoggle,
          Usertypeid,
          setUsertypeid,
          setEditOffenceUser,
          editOffenceUser,
          typeId,
          settypeId,
          datafeedfileName,
          setdatafeedFileName,
          loading,
          setLoading,
          refreshImportList,
          setRefreshImportList,
          orgtypeId,
          setOrgtypeId,
          getupdateadmin, 
          setupdateadmin
        }}
      >
        {props.children}
      </OrganisationContext.Provider>
    </>
  )
}

export default OrganisationState
