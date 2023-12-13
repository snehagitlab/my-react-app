import React, { Fragment, useRef,useState,useEffect } from 'react'
import { Grid, Button,ButtonGroup } from '@mui/material'
import AddTicket from '../../../../assets/Images/user_Icons/light/add-circle.svg'
import KBredirection from '../../../../assets/Images/user_Icons/light/KBredirection_icon.svg'
import TicketContext from 'src/context/TicketProvider'
import { KB_ACCESS } from 'src/config/api.config'
import { API_PATHS } from 'src/config/api.config'

const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION


function CreateTicket() {

  const { handleoffenceSliderOpen} = React.useContext<any>(TicketContext)

  //ref
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const myRef: any = useRef()

 const handleKBRedirect = () => {
    window.open('/user/knowledge', '_blank')
  }
  const [kbaccess, setKBaccess] = useState()
  const [userId, setUserId] = useState(0)


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
    setUserId(user.data.userId)
    handleGetUserDetails()
 
 }, [userId])

 const handleGetUserDetails = async () => {
  if(userId > 0) {
  const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.user}/detail?userId=${userId}`)
  const user = JSON.parse(localStorage.getItem('user1Data') || '{}')
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })
    const result = await response.json()

    if (result.status == 200) {
      const data = result.payload.data
      setKBaccess(data?.userOrg?.org?.KnowBaseAccess)

    } else {
      console.log(result.message)
    }
  } catch (ex: any) { }
}
}
 

  return (
    <div style={{ width: '90%', margin: '16px 19px', marginBottom: '0' }}>
      <Grid item sx={{ Width: '60px' }}>
        <Fragment>
          <ButtonGroup
            variant='contained'
            ref={anchorRef}
            aria-label='split button'
            sx={{
              width: 1,
              height: '60px',
              boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)',
              borderRadius: '14px'
            }}
          >
            <Button
              onClick={handleoffenceSliderOpen}
              ref={myRef}
              sx={{
                padding: '9px 0 9px 25px',
                borderRadius: '14px',
                boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)',
                width: 1,
                justifyContent: 'start'
              }}
            >
              <span
                style={{
                  textTransform: 'capitalize',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: 'Mazzard',
                  lineHeight: '25px'
                }}
              >
                Create Ticket 
              </span>
            </Button>
            <Button
              size='small'
              aria-haspopup='menu'
              onClick={handleoffenceSliderOpen}
              aria-label='select merge strategy'

            /*   aria-expanded={openTicket ? 'true' : undefined}
              aria-controls={openTicket ? 'split-button-menu' : undefined} */

              sx={{ padding: '20px 20px!important', borderRadius: '14px' }}
            >
              <img src={AddTicket} alt='add category' />

              {/* <MenuDown /> */}
            </Button>
          </ButtonGroup>
          {
            
            kbaccess != undefined && KB_ACCESS.NOACCESS == kbaccess ? '' :
        
           (<ButtonGroup
            variant='contained'
            aria-label='split button'
            sx={{
              width: 1,
              height: '60px',
              boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)',
              borderRadius: '14px',
              marginTop:'10px'
            }}
          >
       
            <Button
           
              sx={{
                padding: '9px 0 9px 25px',
                borderRadius: '14px',
                boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)',
                width: 1,
                justifyContent: 'start'
              }}
              onClick = {handleKBRedirect}
            >

              <span
                style={{
                  textTransform: 'capitalize',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: 'Mazzard',
                  lineHeight: '25px'
                }}
              >
             Knowledge Base
              </span>

            </Button>
             <Button
              size='small'
              aria-haspopup='menu'
              aria-label='select merge strategy'
              sx={{ padding: '20px 20px!important', borderRadius: '14px' }}
              onClick = {handleKBRedirect}
            >
              <img src={KBredirection} alt='add category' style={{marginLeft:"20px"}}/>
            </Button> 
          
          </ButtonGroup>) }
        </Fragment>
      </Grid>
    </div>
  )
}

export default CreateTicket
