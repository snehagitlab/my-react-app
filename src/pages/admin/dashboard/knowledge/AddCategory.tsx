import React, { useEffect } from 'react'
import { Box, Button, Checkbox, Grid, ListItemText, MenuItem, Select } from '@mui/material'

import {
  DialogTitle
} from '@mui/material'
import Close from 'mdi-material-ui/Close'

// import { styled } from '@mui/material/styles'

//import images
import upload_img from 'src/assets/Images/user_Icons/light/upload_img.png'
import view_img from 'src/assets/Images/user_Icons/light/view_img.png'

//config file
import { FILE_TYPE, USER_ROLE } from 'src/config/api.config'

//import compoenent
import KnowledgeContext from 'src/context/knowledgeProvider'
import { nameval } from 'src/pages/util/validationall'

import { DialogActions, Dialog, DialogContent, TextField, OutlinedInput, InputLabel, FormControl, IconButton, Tooltip } from '@mui/material'

//import formik
import * as yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { API_PATHS } from 'src/config/api.config'
import axios from 'axios'
import LoadingButton from '@mui/lab/LoadingButton'
import delete_img from 'src/assets/Images/user_Icons/light/delete_img.png'


//env file
const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const fileType: any = parseInt(FILE_TYPE.KNOWLEDGE_CATEGORY)
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC
const BASE_URL_SUPPORT= process.env.REACT_APP_BASE_URL

// const Input = styled('input')({
//   display: 'none'
// })

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function AddCategory() {
  const { setfirstmodalOpen, firstmodalopen, setCreateCategory } = React.useContext<any>(KnowledgeContext)
  const [imgUrlpopup, setImgUrlPopup] = React.useState<any>()
  const [filePath, setFilePath] = React.useState<any>()

  const [viewImg, setviewImg] = React.useState<any>(false);
  const [imgPath, setImagePath] = React.useState<any>([])
  const [addCategoryLoading, setAddCategoryLoading] = React.useState(false)
  const [OrgtypeList, setOrgTypeList] = React.useState<Array<any>>([])
  const [userRoleId, setUserRoleId] = React.useState(0)
  const [isCheckName, setIsCheckName] = React.useState<any>([])
  const [isCheck, setIsCheck] = React.useState<any>([]);


  //Upload category File
  const handleGetUserImg = async (e: any) => {
    const file = e.target.files[0]

    if (e.target.files[0].name.split('.').pop() == 'png' || e.target.files[0].name.split('.').pop() == 'jpg') {
      setFilePath(file)
      if (file) {
        const reader = new FileReader()
        reader.onload = function (e: any) {
          setImagePath(e.target.result)
        }
        reader.readAsDataURL(file)
      }

    } else {
      toast.error(`This ${e.target.files[0].name.split('.').pop()} can't support`)
    }
  }


  const closetoggleNewCategoryModal = () => {
    setfirstmodalOpen(false)
  }

  const schema = yup.object().shape({
    name: nameval
   
  })
  const formik = useFormik({
    initialValues: {
      name: '',
      description: ''
    },

    validationSchema: schema,
    onSubmit: () => {
      handleAddCategory()
    }
  })

  const handleAddCategory = async () => {
    setAddCategoryLoading(true)
    if(userRoleId.toString() === USER_ROLE.SUPPER_ADMIN && isCheck.length <= 0) {
        toast.error('Organization type is requiered')
        setAddCategoryLoading(false)
    }else {
    //file upload image set
    let finalFilePath: any;
    if(filePath != undefined)
    {
    const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
    const formData = new FormData()
    formData.append('file', filePath)
    formData.append('type', fileType)
    try {
      const response = await axios.post(`${BASE_URL_PUBLIC}/v1/file`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${UserData.token}`
        }
      })
      finalFilePath = response.data.payload.filesPath[0].filePath
     
    } catch (error: any) {
      setAddCategoryLoading(false)
      console.log(error.message)
    }
  }




    const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}`)
    const user = JSON.parse(localStorage.getItem('userData') || '{}')
    const requestData = {}
    Object.assign(requestData, { image: finalFilePath })
    Object.assign(requestData, { name: formik.values.name })
    Object.assign(requestData, { description: formik.values.description })
    Object.assign(requestData, { orgTypeId: isCheck.map(JSON.parse) })
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
        setAddCategoryLoading(false)
        toast.success("Category created successfully")
        setCreateCategory(result)
        formik.resetForm()
        closetoggleNewCategoryModal()
      } else {
        setAddCategoryLoading(false)
        toast.error(result.message)
      }
    } catch (ex: any) {
      setAddCategoryLoading(false)
      toast.error(ex.message)
    }
      }
  
  
  }

  const openViewImgModal = (imgUrl: any) => {
    setImgUrlPopup(imgUrl)
    setviewImg(true)
  }
  const handleViewImgClose = () => {
    setviewImg(false)
    setImgUrlPopup("")
  }

  //create time remove item
  const handleClick = () => {
    setImagePath('')
  }



 
  const handleCheck = (e: any) => {
    const { id, checked, value } = e.target;
    setIsCheck([...isCheck, id])
    setIsCheckName([...isCheckName, value])
    if (!checked) {
      setIsCheck(isCheck.filter((item: any) => item !== id));
      setIsCheckName(isCheckName.filter((item: any) => item !== value));
    }

  }

  const fetchAllOrganisationsType = async () => {
    const url = new URL(
      `${BASE_URL_SUPPORT}/${API_VERSION}/${API_PATHS.organisationType
      }?sortOrder=DESC&showAll=true`
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
      setOrgTypeList(result.payload.data)
    }
  }
  
   useEffect(() => {fetchAllOrganisationsType()},[])

   useEffect(() => {  const user = JSON.parse(localStorage.getItem('userData') || '{}')
   setUserRoleId(user.data.userRole[0])
  },[])


  return (
    <Grid>
      {/* dialogur  */}
      <Box>
        <Dialog
          fullWidth
          open={firstmodalopen}
          maxWidth='xs'
          scroll='body'
          onClose={closetoggleNewCategoryModal}
          onBackdropClick={closetoggleNewCategoryModal}
          className='new-category-modal'
        >
          <Box>
            <form onSubmit={formik.handleSubmit}>
              <DialogContent sx={{ position: 'relative', padding: '35px 35px' }}>
                <Grid sx={{ display: 'flex', marginBottom: "10px" }} >
                  {
                    imgPath.length > 0 && (
                      <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }} className="hoverImg">
                        <Box
                          justifyContent='center'
                          alignItems='center'
                          sx={{
                            height: '90px',
                            width: '90px',
                            border: '5px solid #2d4acd2b',
                            boxSizing: 'border-box',
                            marginRight: '7px',
                            marginTop: '10px',
                            position: 'relative'
                          }}
                        >
                          <>
                            <IconButton
                              size='small'
                              className='imageiconBox'
                              sx={{
                                color: 'text.secondary'
                              }}
                            >
                              <Tooltip title='view image' placement='top'>
                                <img
                                  onClick={() => openViewImgModal(imgPath)}
                                  src={view_img}
                                  alt='view-img'
                                  style={{ width: '20px', height: '20px' }}
                                />
                              </Tooltip>
                              <Tooltip title='delete image' placement='top'>
                                <img
                                  onClick={() => handleClick()}
                                  src={delete_img}
                                  alt='delete-img'
                                  style={{ width: '20px', height: '20px', paddingLeft: '5px' }}
                                />
                              </Tooltip>
                            </IconButton>
                            <img src={imgPath} alt='Evidence' width='100%' height='100%' />
                          </>
                        </Box>
                      </Box>
                    )}
                    {imgPath.length > 0  ?
                   ' '
                  :  <>
                  <Box
                    sx={{
                      backgroundColor: '#d3d3d3b3',
                      width: '90px',
                      height: '90px',
                      padding: "10px",
                      marginTop: '10px',
                      position: 'relative',
                      display: "flex",
                    }}
                  >
                    <Button
                      className="fileUpload-box btn"
                    >
                      <img src={upload_img} alt='file_upload' style={{ width: '20px', height: '20px' }} />
                      <input type='file' id='upload-img' className="upload-btn-wrapper" onChange={handleGetUserImg} multiple />
                    </Button>
                  </Box>
                  </>
                }
                </Grid>
                <Grid item sm={12}>
                  <FormControl fullWidth sx={{ marginTop: '12px' }}>
                    <InputLabel htmlFor='name'>Category Name*</InputLabel>
                    <OutlinedInput
                      autoFocus
                      label='Category Name*'
                      id='date'
                      placeholder='Category Name'
                      fullWidth
                      name='name'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.touched.name && formik.errors.name)}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={12} sx={{ marginTop: '25px' }}>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    id='textarea-outlined'
                    placeholder='Description'
                    label='Description'
                    name='description'
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}

                    //error={Boolean(formik.touched.description && formik.errors.description)}
                  />
                </Grid>
                { userRoleId.toString() === USER_ROLE.SUPPER_ADMIN ?

                <Grid item sm={12} >
                <FormControl  fullWidth sx={{ marginTop: '15px' }}>
                  <InputLabel id="demo-multiple-checkbox-label">Organization Type*</InputLabel>
                  <Select

                    id="demo-multiple-checkbox"
                    multiple
                    value={isCheckName}
                    input={<OutlinedInput label="Organization Type*" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    
                    {OrgtypeList.map(a => {
                      return (
                        <MenuItem value={a.orgTypeId + '-' + a.orgTypeName} key={a.orgTypeId} sx={{ textTransform: 'capitalize' }}>
                          <Checkbox checked={isCheck.includes(a.orgTypeId.toString())} id={a.orgTypeId} onChange={handleCheck} value={a.orgTypeName} />
                          <ListItemText primary={a.orgTypeName} />
                        </MenuItem>
                                    
                      )
                    })}
                  </Select>
                </FormControl>
            </Grid> : ' '}
              </DialogContent>
              <DialogActions sx={{ pb: { xs: 8, sm: '35px' }, justifyContent: 'center' }}>
                <Button
                  variant='outlined'
                  sx={{
                    mr: 1,
                    fontSize: '16px',
                    borderRadius: '13px',
                    filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                    textTransform: ' capitalize'
                  }}
                  onClick={closetoggleNewCategoryModal}
                >
                  Cancel
                </Button>
                {
                  addCategoryLoading ?
                  <>
                <LoadingButton
                  loading={addCategoryLoading}
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
              <>
                 <Button
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
      </Box >

      {/* end dialogue */}

      {/* image dipslay dialogue */}
      <Dialog
        open={viewImg}
        onClose={handleViewImgClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle onClick={handleViewImgClose} id='alert-dialog-title'>
          <IconButton
            size='small'
            sx={{ position: 'absolute', right: '1rem', top: '0.5rem' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: '500px', width: '500px' }} className="image-preview">
          <img alt="img-popup" src={imgUrlpopup ? imgUrlpopup : ' '} style={{ width: "100%", height: "100%" }} />
        </DialogContent>
      </Dialog>
      {/* end image display dialogur  */}
    </Grid >
  )
}

export default AddCategory
