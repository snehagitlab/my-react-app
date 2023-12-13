import React, { useState, useEffect } from 'react'
import {
  Grid, Typography, Card,
  CardContent, Modal, IconButton

} from '@mui/material'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

//import { toast } from 'react-toastify'
import { API_PATHS } from 'src/config/api.config'
import { IconX } from '@tabler/icons'
import KnowledgeContext from 'src/context/knowledgeProvider'

/* import ListItemText, ListItemButton from '@mui/material/ListItemText'
import List from '@mui/material/List'
 */


interface IAddUserAgentModalProps {
  open: boolean
  onClose: any
}

//env file
const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION



const TemplatePreview = (props: IAddUserAgentModalProps) => {
  const { applyTemplateID, setSelectedTemplateId/* setApplyTemplateID */ } = React.useContext<any>(KnowledgeContext)

  // const [templateData, setTemplateData] = React.useState<Array<any>>([])
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')

  const handleGetTemplateDetails = async () => {
    if (applyTemplateID > 0) {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.template}/detail?templateId=${applyTemplateID}`)
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
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
          setTitle(data.title)
          setDescription(data.content)
        } else {
          // toast.error(result.message)
        }
      } catch (ex: any) {
        // console.log(ex)
      }
    }
  }

  const insertTemplateView = (e: any) => {
    setSelectedTemplateId(e)
    props.onClose()
  }

  
  useEffect(() => {
    handleGetTemplateDetails()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyTemplateID])


  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
        className='user-agent-modal'
      >
        <Box sx={{  overflowY: 'scroll'}}>
          <Card

              sx={{
                width: 800,
                position: 'fixed',
                left: 'calc(50% - 300px)',
                zIndex: 100
              }}

          >
          <IconButton
              sx={{
                position: 'absolute',
                top: '10px',
                left: '90%',
                zIndex: 500
              }}
              onClick={props.onClose}
            >
              <IconX />
            </IconButton>

            <CardContent sx={{ pt: 8, pl: 8, pr: 8, mb: 8 }}>
              <Grid sx={{ display: 'flex' }}>
               

                <Grid item md={12} >
                  <Grid item sx={{ fontSize: '25px', background: '#fff', paddingBottom: '5px' }}>{title}</Grid>

                  <Grid item sx={{ background: '#fff' }}>

                    <Typography
                      sx={{
                        fontFamily: 'Mazzard-regular',
                        fontWeight: '500',
                        fontSize: '14px',
                        color: ' rgba(42, 58, 81, 0.87)', overflowY: 'scroll', height: 'calc(100vh - 200px)'
                      }}
                      dangerouslySetInnerHTML={{ __html: description }}
                      ></Typography>
                  </Grid>
                  <Grid item sx={{ mt: 15 }}>

                    <Button
                      size='large'
                      sx={{ mr: 2, textTransform: 'capitalize' }}
                      variant='contained'
                      onClick={() => insertTemplateView(applyTemplateID)}
                    >
                      Insert Template
                    </Button>
                    <Button
                      size='large'
                      variant='outlined'
                      color='secondary'
                      sx={{ textTransform: 'capitalize' }}
                      onClick={props.onClose}                   >
                      Cancel
                    </Button>

                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  )
}
export default TemplatePreview


