import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'

import { Box, Button, Grid, MenuItem } from '@mui/material'

import {
  DialogActions,
  Dialog,
  DialogContent,
  TextField,
  OutlinedInput,
  InputLabel,
  FormControl,
  Select
} from '@mui/material'
import KnowledgeContext from 'src/context/knowledgeProvider'

//import Folderadd from '../../../../assets/Images/user_Icons/light/folder-add.png'
//import { styled } from '@mui/material/styles'

import * as yup from 'yup'
import { toast } from 'react-toastify'
import { nameval, numberval } from 'src/pages/util/validationall'
import { API_PATHS, FOLDER_VISIBLE_TO } from 'src/config/api.config'
import LoadingButton from '@mui/lab/LoadingButton'


const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

function AddFolder() {

  const { setCategoryopen, categoryopen, setAddFolder, createCategory, folderAddcatId } = React.useContext<any>(KnowledgeContext)
  const [listCategory, setListCategory] = useState<any>([])
  const [addFolderLoading, setAddFOlderLoading] = React.useState(false)


  //   console.log(listCategory)

  //category modal close
  const closeNewCategoryModal = () => {

    setCategoryopen(false)
  }



  const schema = yup.object().shape({
    name: nameval,
    catId: numberval,
    roleId: numberval

  })

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      catId: folderAddcatId,
      roleId: 1,
      orderType: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      handleAddFolder()
    }
  })

  //create new folder api
  const handleAddFolder = async () => {
    setAddFOlderLoading(true)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.folder}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    const requestData = {}
    Object.assign(requestData, { name: formik.values.name })
    Object.assign(requestData, { description: formik.values.description })
    Object.assign(requestData, { catId: formik.values.catId })
    Object.assign(requestData, { roleId: formik.values.roleId })
    Object.assign(requestData, { orderType: '1' })

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
        toast.success(result.message)
        setAddFOlderLoading(false)
        formik.resetForm()
        setAddFolder(result)
        closeNewCategoryModal()
      } else {
        setAddFOlderLoading(false)
        toast.error(result.message)
      }
    } catch (ex: any) {
      setAddFOlderLoading(false)
      toast.error(ex.message)
    }
  }

  const getCategory = async () => {
    // const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}`)
    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}?showAll=true&isMyCat=1`)
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
        setListCategory(result.payload.data)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCategory()
  }, [createCategory])

  return (
    <>
      <Box>
        <Dialog
          fullWidth
          open={categoryopen}
          maxWidth='xs'
          scroll='body'
          onClose={closeNewCategoryModal}
          onBackdropClick={closeNewCategoryModal}
          className='new-category-modal'
        >
          <Box>
            <form onSubmit={formik.handleSubmit}>
              <DialogContent sx={{ position: 'relative', padding: '35px 35px 25px 35px' }}>
                <Box>

                 {/*  <label htmlFor='contained-button-file'>
                    <Input accept='image/*' id='contained-button-file' multiple type='file' />
                    <Button
                      component='span'
                      sx={{
                        fontFamily: 'Mazzard',
                        fontWeight: '600',
                        width: '100%',
                        p: '23px 5px',
                        borderRadius: '9px',
                        textTransform: 'capitalize',
                        backgroundColor: 'rgba(224, 228, 248, 0.61)',
                        border: ' 0.77013px dashed rgba(45, 74, 205, 0.29)',
                        fontSize: '19px',
                        color: '#2A3A51',
                        marginBottom: '16px',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={Folderadd}
                        alt='file upload'
                        style={{ width: '26px', height: '26px', marginRight: '10px' }}
                      />{' '}
                      Create Folder
                    </Button>
                  </label> */}

                  <Grid item sm={12}>
                    <FormControl fullWidth sx={{ marginTop: '12px' }}>
                      <InputLabel htmlFor='name'>Folder Name*</InputLabel>
                      <OutlinedInput
                        autoFocus
                        label='Folder Name*'
                        id='date'
                        name='name'
                        placeholder='Enter Folder Name'
                        fullWidth
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.name && formik.errors.name)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={12} sx={{ marginTop: '25px' }}>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      name='description'
                      id='textarea-outlined'
                      placeholder='Description'
                      label='Description'
                      onChange={formik.handleChange}
                      value={formik.values.description}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.touched.description && formik.errors.description)}
                    />
                  </Grid>
                  <Grid item sm={12} sx={{ marginTop: '25px' }}>
                    <FormControl fullWidth >
                      <InputLabel id='demo-multiple-name-label'>Choose Category*</InputLabel>
                      <Select
                        label='Choose Category*'
                        id='demo-multiple-name'
                        labelId='demo-multiple-name-label'
                        name='catId'
                        onChange={formik.handleChange}
                        value={formik.values.catId}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.catId && formik.errors.catId)}
                      >
                        {listCategory &&
                          listCategory.map((item: any, index: any) => {
                            return (
                              <MenuItem value={item.catId} key={index} sx={{ textTransform: 'capitalize' }}>
                                {item.name}
                              </MenuItem>
                            )
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={12} sx={{ marginTop: '25px' }}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-multiple-name-label'>Visible to*</InputLabel>
                      <Select
                        label='Visible to*'
                        id='demo-multiple-name'
                        labelId='demo-multiple-name-label'
                        name='roleId'
                        onChange={formik.handleChange}
                        value={formik.values.roleId}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.roleId && formik.errors.roleId)}
                      >
                        <MenuItem value={FOLDER_VISIBLE_TO.ALL}>All</MenuItem>
                        <MenuItem value={FOLDER_VISIBLE_TO.USER}>User</MenuItem>
                        <MenuItem value={FOLDER_VISIBLE_TO.AGENT}>Agent</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {/*  <Grid item sm={12} sx={{ marginTop: '25px' }}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-multiple-name-label'>Order articles</InputLabel>
                      <Select
                        label='Order articles'
                        id='demo-multiple-name'
                        labelId='demo-multiple-name-label'
                        name='orderType'
                        onChange={formik.handleChange}
                        value={formik.values.orderType}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.orderType && formik.errors.orderType)}
                      >
                        <MenuItem value='1'>1</MenuItem>
                        <MenuItem value='2'>2</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                </Box>
              </DialogContent>
              <DialogActions sx={{ pb: { xs: 8, sm: 8 }, justifyContent: 'center' }}>
                <Button
                  variant='outlined'
                  sx={{
                    mr: 1,
                    fontSize: '16px',
                    borderRadius: '13px',
                    filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                    textTransform: ' capitalize'
                  }}
                  onClick={closeNewCategoryModal}
                >
                  Cancel
                </Button>
                {
                  addFolderLoading ?
                  <>
                <LoadingButton
                  loading={addFolderLoading}
                  variant='contained'
                  disabled
                  sx={{
                    textTransform: 'capitalize',
                    marginLeft: '10px'
                  }}
                >
                  Create
                </LoadingButton>
              </>
              :
              <> <Button
              type='submit'
              variant='contained'
              sx={{
                mr: 1,
                fontSize: '16px',
                boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)',
                textTransform: ' capitalize',
                borderRadius: '13px'
              }}
            >
             Create
            </Button>
              </>
                }
              </DialogActions>
            </form>
          </Box>
        </Dialog>
      </Box>

    </>
  )
}

export default AddFolder
