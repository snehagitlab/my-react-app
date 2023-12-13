import React, {  useState, useContext, useEffect } from 'react'
import { Grid, OutlinedInput, InputLabel, FormControl, Typography, MenuItem, Select, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

//import env
const BASE_URL = process.env.REACT_APP_KNOWLEDGE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION


import KnowledgeContext from 'src/context/knowledgeProvider'

//import config file
import { API_PATHS, FOLDER_VISIBLE_TO } from 'src/config/api.config'

//import toast
import { toast } from 'react-toastify'



function EditFolder({ handleCloseFolder, handleCategoryFolderList }: any) {
    const [isUpdate, setIsUpdate] = useState(false)
    const { setEditFolderName, editFolderName, roleId, setRoleId, editFolderDescription, setEditFolderDescription, editFolderCatId, seteditFolderCatId, editFolderId } = useContext<any>(KnowledgeContext)
    
    //const fileInput: any = useRef()
    const [listCategory, setListCategory] = useState<any>([])

    const handleChangeName = (event: any) => {
        setIsUpdate(true)
        setEditFolderName(event.target.value)
    }

    const handleChangeDescription = (event: any) => {
        setIsUpdate(true)
        setEditFolderDescription(event.target.value)
    }

    const handleChangeVisible = (event: any) => {
        setIsUpdate(true)
        setRoleId(event.target.value)
    }

    const handleChangeCatId = (event: any) => {
        setIsUpdate(true)
        seteditFolderCatId(event.target.value)
    }

    //edit folder 
    const handleEditFolder = async () => {
        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.folder}?folderId=${editFolderId}`)
        const user = JSON.parse(localStorage.getItem('userData') || '{}')

        if (isUpdate === false) {
            toast.error('Please update any folder information')
        }
        else {

            try {
                const response = await fetch(url.toString(), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        name: editFolderName,
                        description: editFolderDescription,
                        roleId: roleId,
                        catId: editFolderCatId,
                        orderType: 1
                    })
                })
                const result = await response.json()
                if (result.status == 200) {
                    toast.success(result.message)
                    handleCloseFolder()
                    handleCategoryFolderList(editFolderCatId,'')
                } else {
                    toast.error(result.message)
                }
            } catch (error: any) {
                toast.error(error.message)
            }
        }
    }

    //gwet 
    const getCategory = async () => {
        const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.category}/${API_PATHS.dashboard}?&showAll=true`)
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
    }, [])

    return (
        <>
            <DialogContent>
                <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                  {/*   <input type='file' style={{ display: 'none' }} ref={fileInput} accept='image/*' />
                    <Tooltip title='Upload image only JPG,PNG files are accepted' placement='top'>
                        <IconButton size='small'>
                            <img
                                onClick={selectFile}
                                src={Category}
                                alt='category_edit'
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    padding: '6px',
                                    border: '1px dashed #cfd7df',
                                    borderRadius: '4px'
                                }}
                            />
                        </IconButton>
                    </Tooltip> */}
                    <Typography>Edit folder</Typography>
                </Grid>
                <Grid sx={{ marginTop: '15px' }}>
                    <FormControl fullWidth sx={{ background: '#ffffff' }}>
                        <InputLabel>
                            Name <span style={{ color: '#3a3541ad' }}>*</span>
                        </InputLabel>
                        <OutlinedInput sx={{ marginBottom: '20px' }} label='Title' name='title' id='title' value={editFolderName} onChange={(e: any) => handleChangeName(e)} />
                    </FormControl>
                </Grid>
                <Grid>


                    <FormControl fullWidth sx={{ background: '#ffffff' }}>
                        <TextField
                      multiline
                      rows={3}
                      fullWidth
                      name='description'
                      id='Description'
                      label='Description'
                      value={editFolderDescription} 
                      onChange={(e: any) => handleChangeDescription(e)}
                      sx={{ marginBottom: '20px' }}
                     
                    />
                    </FormControl>
                </Grid>

                {editFolderCatId && <Grid item sm={12} >
                    <FormControl fullWidth >
                        <InputLabel id='demo-multiple-name-label'>Choose Category <span style={{ color: '#3a3541ad' }}>*</span></InputLabel>
                        <Select
                            label='Choose Category'
                            id='demo-multiple-name'
                            labelId='demo-multiple-name-label'
                            name='catId'
                            value={editFolderCatId}
                            onChange={e => handleChangeCatId(e)}
                            disabled
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
                </Grid>}


                {/* <Grid>

                    <FormControl fullWidth>
                        <InputLabel id='demo-multiple-name-label'>Visible to</InputLabel>
                        <Select
                            label='Visible to'
                            id='demo-multiple-name'
                            labelId='demo-multiple-name-label'
                            name='roleId'
                            value={editFolderVisible && editFolderVisible}
                            onChange={(e: any) => handleChangeVisible(e.target.value)}
                        >
                            <MenuItem value={5}>All</MenuItem>
                            <MenuItem value={4}>User</MenuItem>
                            <MenuItem value={3}>Agent</MenuItem>
                        </Select>
                    </FormControl>
                </Grid> */}
                {roleId &&
                    <Grid sx={{ marginTop: '15px' }}>
                        <FormControl fullWidth>
                            <InputLabel id='demo-multiple-name-label'>Visible to <span style={{ color: '#3a3541ad' }}>*</span></InputLabel>
                            <Select
                                label='Change Priority'
                                value={roleId && roleId}
                                id='demo-simple-select-helper'
                                labelId='demo-simple-select-helper-label'
                                onChange={e => handleChangeVisible(e)}
                            >
                                <MenuItem value={FOLDER_VISIBLE_TO.ALL}>All</MenuItem>
                                <MenuItem value={FOLDER_VISIBLE_TO.USER}>User</MenuItem>
                                <MenuItem value={FOLDER_VISIBLE_TO.AGENT}>Agent</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                }


            </DialogContent>
            <DialogActions>
                <Grid sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }} md={12}>
                    <Grid md={5} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        <Button
                            fullWidth
                            variant='outlined'
                            sx={{
                                fontWeight: '500',
                                fontSize: '13px',
                                borderRadius: '9px',
                                filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                                p: '12px',
                                textTransform: 'capitalize',
                                marginRight: '10px'
                            }}

                            onClick={handleCloseFolder}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleEditFolder}
                            fullWidth
                            variant='contained'
                            sx={{
                                fontWeight: '500',
                                fontSize: '13px',
                                borderRadius: '9px',
                                filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                                p: '12px',
                                textTransform: 'capitalize'
                            }}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    )
}

export default EditFolder