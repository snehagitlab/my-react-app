import React, { useState, useEffect } from 'react'
import { Grid, Select } from '@mui/material'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import { useNavigate } from 'react-router'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { API_PATHS, FILE_TYPE } from 'src/config/api.config'
import MenuItem from '@mui/material/MenuItem'

//import compoenent
import KnowledgeContext from 'src/context/knowledgeProvider'

//import toastify
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingButton from '@mui/lab/LoadingButton'


const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const BASE_URL_SUPPORT = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC


//const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC


function AddTemplate() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const path = pathname
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [orgType, setorgType] = useState('')
  const { createtemplatelist, setCreateTemplateList } = React.useContext<any>(KnowledgeContext)
  const location: any = useLocation()
  const state: any = location.state
  const [orgTypeData, setOrgTypeData] = useState<Array<any>>([])
  const [addTemplateLoading, setAddTemplateLoading] = React.useState(false)
  const [updateTemplateLoading, setUpdateTemplateLoading] = React.useState(false)


  const handletitleChange = (e: any) => {
    setTitle(e.target.value)
  }
  const handleOrgTypeChange = (e: any) => {
    setorgType(e.target.value)
  }

  const handleCreateTemplate = async () => {
    setAddTemplateLoading(true)
    if (title != "" && orgType != "") {
      const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.template}`)
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
      const requestData = {}
      Object.assign(requestData, { title: title })
      Object.assign(requestData, { content: description })
      Object.assign(requestData, { hash_tag: 'test,data' })
      Object.assign(requestData, { orgType: orgType })

      try {
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(requestData)
        })
        const result = await response.json()
        if (result.status == 200) {
          setCreateTemplateList(!createtemplatelist)
          navigate('/knowledge/template')
          setAddTemplateLoading(false)
          toast.success('Template created successfully')
          setTitle('')
          setDescription('')
        } else {    
          setAddTemplateLoading(false)

          toast.error(result.message)
        }
      } catch (ex) {
        setAddTemplateLoading(false)

        console.log(ex)
      }
    }
    else {
      toast.error("Title and type is must!")
      setAddTemplateLoading(false)

    }

  }
  const handleGetTemplateDetails = async () => {
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.template}/detail?templateId=${state.templateId}`)

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
        const description = data.content
        setDescription(description)

        setorgType(data.orgType)

      } else {
        navigate(-1)
      }
    } catch (ex: any) { }
  }
  const handleUpdateTemplate = async () => {
    setUpdateTemplateLoading(true)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.template}?templateId=${state.templateId}`)

    const user = JSON.parse(localStorage.getItem('userData') || '{}')

    const requestData = {}
    Object.assign(requestData, { title: title })
    Object.assign(requestData, { content: description })
    Object.assign(requestData, { hash_tag: 'test,data' })
    Object.assign(requestData, { orgType: orgType })
    try {
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(requestData)
      })
      const result = await response.json()

      if (result.status == 200) {
        setUpdateTemplateLoading(false)

        setCreateTemplateList(!createtemplatelist)
        navigate('/knowledge/template')
        toast.success('Template updated successfully')
        setTitle('')
        setDescription(' ')
      } else {
        toast.error(result.message)
        setUpdateTemplateLoading(false)

      }
    } catch (ex: any) {
      toast.error(ex.message)
      setUpdateTemplateLoading(false)

    }
  }

  const fetchAllOrganisationsData = async () => {

    const url = new URL(
      `${BASE_URL_SUPPORT}/${API_VERSION}/${API_PATHS.organisationType}/?sortOrder=desc&showAll=true`
    )

    const UserData: any = JSON.parse(localStorage.getItem('userData') || '{}')
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${UserData.token}`
      }
    })
    if (response.status === 200) {
      const result = await response.json()
      setOrgTypeData(result.payload.data)
    }
  }

  const toggleCancelAddOrganisation = () => navigate(-1)
  useEffect(() => {
    handleGetTemplateDetails()
    fetchAllOrganisationsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
     
      <Grid sx={{ display: 'flex', width: '800px' }}>

        <Grid md={12} sx={{ background: '#ffffff' }} >

          <Grid item sm={12} sx={{ marginTop: '20px' }}>
            <FormControl fullWidth sx={{ background: '#ffffff' }}>
              <InputLabel id='status-select'>Organization Type*</InputLabel>
              <Select
                id='Organization Type'
                name='Organization Type'
                labelId='status-select'
                label='Organization Type'
                value={orgType}
                readOnly={path === '/template/view' ? true : false}
                onChange={handleOrgTypeChange}
              >
                {orgTypeData.map(a => {
                  return (
                    <MenuItem value={a.orgTypeId} key={a.orgTypeName}>
                      {a.orgTypeName}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <FormControl fullWidth>
              <InputLabel>Title*</InputLabel>
              <OutlinedInput
                value={title}
                onChange={handletitleChange}
                label='Title'
                name='Title'
                id='title'
                readOnly={path === '/template/view' ? true : false}

              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{ marginTop: '20px' }}

            className='text-editor-knowledge'
          >
            <CKEditor
              editor={ClassicEditor}
              data={description}
              config={{
                ckfinder: {
                  // Upload the images to the server using the CKFinder QuickUpload command.
                  uploadUrl: `${BASE_URL_PUBLIC}/${API_VERSION}/${API_PATHS.editor}/${API_PATHS.file}?type=${FILE_TYPE.ARTICLE_ATTACHMENT}`
                },
                mediaEmbed: {
                  previewsInData: true
                },
                link: {
                  addTargetToExternalLinks: true

                },
                placeholder:'Description*'              
              }}
              onChange={(event: any, editor: any) => {
                const data = editor.getData();
                console.log({ event, editor, data });
                setDescription(data)
              }}

            />
          </Grid>
          {path === "/template/add" ? (

            <Grid xs={12} sm={12} item sx={{ marginTop: '5px',marginLeft:'-15px', padding: 0 }}>
              <CardActions>
                {
                  addTemplateLoading ?
                    <>
                      <LoadingButton
                        loading={addTemplateLoading}
                        variant='contained'
                        size='large'
                        disabled
                        sx={{
                          textTransform: 'capitalize',

                        }}
                      >
                        Submit
                      </LoadingButton>
                    </> : <Button
                  size='large'
                  type='submit'
                  sx={{ textTransform: 'capitalize' }}
                  variant='contained'
                  onClick={() => handleCreateTemplate()}
                >
                  Submit
                    </Button>}

                <Button
                  size='large'
                  variant='outlined'
                  color='secondary'
                  sx={{ textTransform: 'capitalize' }}
                  onClick={toggleCancelAddOrganisation}
                >
                  Cancel
                </Button>
              </CardActions>
            </Grid>
          ) : path === '/template/edit' ?
            (
              <Grid item sx={{ margin: '5px', padding: 0 ,marginLeft:'-15px'}}>
                <CardActions>
                  {
                    updateTemplateLoading ?
                      <>
                        <LoadingButton
                          loading={updateTemplateLoading}
                          variant='contained'
                          size='large'
                          disabled
                          sx={{
                            textTransform: 'capitalize',
                            mr: 2
                          }}
                        >
                          Update
                        </LoadingButton>
                      </> :
                  <Button
                    size='large'
                    type='submit'
                    sx={{ mr: 2, textTransform: 'capitalize' }}
                    variant='contained'
                    onClick={() => handleUpdateTemplate()}

                  >
                    Update
                  </Button>
                  }
                  <Button
                    size='large'
                    variant='outlined'
                    color='secondary'
                    sx={{ textTransform: 'capitalize' }}
                    onClick={toggleCancelAddOrganisation}
                  >
                    Cancel
                  </Button>
                </CardActions>
              </Grid>) :
            (
              <CardActions>
                <Button
                  size='large'
                  type='submit'
                  sx={{ mr: 2, textTransform: 'capitalize' }}
                  variant='contained'
                  onClick={toggleCancelAddOrganisation}
                >
                  Go back
                </Button>
              </CardActions>
            )
          }
        </Grid>

      </Grid>
    </>
  )
}

export default AddTemplate
