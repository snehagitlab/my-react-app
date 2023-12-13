import React, { useRef, useState, Fragment, useContext } from 'react'
import { Box, Button, Grid, ButtonGroup, MenuItem } from '@mui/material'
import { MenuDown } from 'mdi-material-ui'
import Popper from '@mui/material/Popper'
import MenuList from '@mui/material/MenuList'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'


//import react router
import { useNavigate, useLocation } from 'react-router-dom'

// image
//import Edit from '../../../../assets/Images/user_Icons/light/edit.png'

import AddTicket from '../../../../assets/Images/user_Icons/light/add-circle.svg'

//import compoenent
import KnowledgeContext from 'src/context/knowledgeProvider'
import AddCategory from './AddCategory'
import AddFolder from './AddFolder'
import { KB_ACCESS,USER_ROLE } from 'src/config/api.config'



function CommonKnowledge() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const path = pathname
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const user = JSON.parse(localStorage.getItem('userData') || '{}')
  const {setDraftArticleCatId,userRole,KbAccess,setFirstCatFolder, loading, setCategoryopen, categoryopen, setfirstmodalOpen, firstmodalopen, setRefreshAddArticleform, refreshsidebarright, setRefreshsidebarright, setgetdraft, setDraftDisplay,categoryname,   /* draftDisplay, categoryname, folderCatname, foldername, */ setFolderId } = useContext<any>(KnowledgeContext)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleNavigate = () => {
    navigate('/knowledge/addArticle')
    setRefreshAddArticleform(true)
    setFirstCatFolder(true)
    setRefreshsidebarright(!refreshsidebarright)
    setDraftArticleCatId(0)
  }
  const toggleTemplateDashboard = () => {
    navigate('/knowledge/template')
  }

  const viewAllDraft = async () => {
    navigate('/knowledge/category')
    const id = new Date().getTime().toString()
    setgetdraft(id)
    setDraftDisplay(true)
    setFolderId()
  }

  return (
    <Grid>
      {firstmodalopen ? <AddCategory /> : ''}
      {categoryopen ? <AddFolder /> : ''}
      <Grid
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Grid sx={{
          display: 'flex-start',
          justifyContent: 'start',
          alignItems: 'center'
        }}>

            <Grid item  sx={{display: path === '/knowledge/category' ? 'block' : 'none', textTransform: "capitalize", fontSize: "16px", color: "#2D4ACD" }}><span style={{ cursor: 'pointer' }} onClick={() => {
                       navigate('/knowledge')
              }}>Knowledge Base</span>  <span  >{categoryname ? '- '+categoryname: ''}</span>
                  </Grid>
          
        </Grid>
                  
        {
          KbAccess != KB_ACCESS.ONLYSUPERADMIN && userRole === parseInt(USER_ROLE.ORG_ADMIN)?
       
        <Box sx={{ display: 'flex' }}>
          
      {/*     <Button
            onClick={() => viewAllDraft()}
            sx={{
              height: '49px',
              border: '1px solid',
              borderRadius: '9px',
              fontSize: '13px',
              textTransform: 'capitalize',
              marginRight: '10px',
              padding: '10px',
              display: path === '/knowledge/category' ? 'none' : path === '/knowledge/addArticle' ? 'none' : 'block'
            }}
          >
            <img src={Edit} alt='edit' style={{ height: '16px ', marginRight: '10px' }} />
            Manage
          </Button> */}
          <Button
            onClick={() => viewAllDraft()}
            sx={{
              height: '49px',
              border: '1px solid',
              borderRadius: '9px',
              fontSize: '13px',
              textTransform: 'capitalize',
              marginRight: '10px',
              padding: '10px',
              display: path === '/knowledge/category' ? 'block' : path === '/knowledge/addArticle' ? 'none' : 'none'
            }}
          >

            {loading ? "draft Article" : 'draft Article'}

          </Button >
          <Grid item>
            <Fragment>
              <ButtonGroup
                variant='contained'
                ref={anchorRef}
                aria-label='split button'
                sx={{ display: path == '/knowledge/addArticle' ? 'none' : 'block' }}
              >
                <Button
                  onClick={handleToggle}
                  sx={{
                    padding: '0.75rem',
                    borderRadius: '9px',
                    boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)'
                  }}
                >
                  <img src={AddTicket} alt='add category' style={{ marginRight: '10px' }} />
                  <span style={{ textTransform: 'capitalize', paddingRight: '10px' }}>New </span>
                </Button>
                <Button
                  size='small'
                  aria-haspopup='menu'
                  onClick={handleToggle}
                  aria-label='select merge strategy'
                  aria-expanded={open ? 'true' : undefined}
                  aria-controls={open ? 'split-button-menu' : undefined}
                  sx={{ padding: '0 !important', height: '49px' }}
                >
                  <MenuDown />
                </Button>
              </ButtonGroup>

              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: '1' }}>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id='split-button-menu'>
                          <MenuItem sx={{ textTransform: "capitalize" }} onClick={() => setfirstmodalOpen(true)}>create category </MenuItem>
                          <MenuItem sx={{ textTransform: "capitalize" }} onClick={() => setCategoryopen(true)}>create folder</MenuItem>
                          <MenuItem sx={{ textTransform: "capitalize" }} onClick={handleNavigate}>create Article</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Fragment>
          </Grid>
          {
            user.data.userRole[0] === 1 ?
              (
                <Grid item>
                  <Button
                    sx={{ mb: 2, p: 3, textTransform: 'capitalize', ml: '10px' }}
                    variant='contained'
                    onClick={toggleTemplateDashboard}
                  >
                     Templates
                  </Button>
                </Grid>
              )
              :
              (<Grid item></Grid>)
          }
        </Box > : userRole === parseInt(USER_ROLE.SUPPER_ADMIN) ? 
          <Box sx={{ display: 'flex' }}>

         {/*  <Button
            onClick={() => viewAllDraft()}
            sx={{
              height: '49px',
              border: '1px solid',
              borderRadius: '9px',
              fontSize: '13px',
              textTransform: 'capitalize',
              marginRight: '10px',
              padding: '10px',
              display: path === '/knowledge/category' ? 'none' : path === '/knowledge/addArticle' ? 'none' : 'block'
            }}
          >
            <img src={Edit} alt='edit' style={{ height: '16px ', marginRight: '10px' }} />
            Manage
          </Button> */}
          <Button
            onClick={() => viewAllDraft()}
            sx={{
              height: '49px',
              border: '1px solid',
              borderRadius: '9px',
              fontSize: '13px',
              textTransform: 'capitalize',
              marginRight: '10px',
              padding: '10px',
              display: path === '/knowledge/category' ? 'block' : path === '/knowledge/addArticle' ? 'none' : 'none'
            }}
          >

            {loading ? "draft Article" : 'draft Article'}

          </Button >
          <Grid item>
            <Fragment>
              <ButtonGroup
                variant='contained'
                ref={anchorRef}
                aria-label='split button'
                sx={{ display: path == '/knowledge/addArticle' ? 'none' : 'block' }}
              >
                <Button
                  onClick={handleToggle}
                  sx={{
                    padding: '0.75rem',
                    borderRadius: '9px',
                    boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)'
                  }}
                >
                  <img src={AddTicket} alt='add category' style={{ marginRight: '10px' }} />
                  <span style={{ textTransform: 'capitalize', paddingRight: '10px' }}>New </span>
                </Button>
                <Button
                  size='small'
                  aria-haspopup='menu'
                  onClick={handleToggle}
                  aria-label='select merge strategy'
                  aria-expanded={open ? 'true' : undefined}
                  aria-controls={open ? 'split-button-menu' : undefined}
                  sx={{ padding: '0 !important', height: '49px' }}
                >
                  <MenuDown />
                </Button>
              </ButtonGroup>

              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: '1' }}>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id='split-button-menu'>
                          <MenuItem sx={{ textTransform: "capitalize" }} onClick={() => setfirstmodalOpen(true)}>create category </MenuItem>
                          <MenuItem sx={{ textTransform: "capitalize" }} onClick={() => setCategoryopen(true)}>create folder</MenuItem>
                          <MenuItem sx={{ textTransform: "capitalize" }} onClick={handleNavigate}>create Article</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Fragment>
          </Grid>
          {
            user.data.userRole[0] === 1 ?
              (
                <Grid item>
                  <Button
                    sx={{ mb: 2, p: 3, textTransform: 'capitalize', ml: '10px' }}
                    variant='contained'
                    onClick={toggleTemplateDashboard}
                  >
                    Templates
                  </Button>
                </Grid>
              )
              :
              (<Grid item></Grid>)
          }
        </Box >
        :' '}

        {/*for  article pages  */}
        < Grid sx={{ display: path === '/knowledge/addArticle' ? 'flex' : 'none' }
        }>
          <Button
            variant='outlined'
            sx={{
              textTransform: 'capitalize',
              marginLeft: '10px'
            }}
          >
            cancel
          </Button>
          <Button
            variant='outlined'
            sx={{
              // display: path === '/knowledge/addArticle' ? 'block' : 'none',
              textTransform: 'capitalize',
              marginLeft: '10px'
            }}
          >
            save
          </Button>
          <Button
            variant='contained'
            sx={{
              // display: path === '/knowledge/addArticle' ? 'block' : 'none',
              textTransform: 'capitalize',
              marginLeft: '10px'
            }}
          >
            Publish
          </Button>
        </Grid >
      </Grid >
    </Grid >
  )
}

export default CommonKnowledge
