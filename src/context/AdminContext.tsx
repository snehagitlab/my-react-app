import * as React from 'react'
import { useState } from 'react'
import TicketContext from './TicketProvider'

const AdminState = (props: any) => {
  const [createUserAgentList, setCreateUserAgentList] = useState(false)
  const [createOrgList, setCreateOrgtList] = useState(false)

  return (
    <>
      <TicketContext.Provider
        value={{
          createUserAgentList,
          setCreateUserAgentList,
          setCreateOrgtList,
          createOrgList
        }}
      >
        {props.children}
      </TicketContext.Provider>
    </>
  )
}

export default AdminState
