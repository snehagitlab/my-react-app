import { Box, BoxProps, IconButton, InputLabel, Switch, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import Close from 'mdi-material-ui/Close'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useSettings } from '../../../@core/hooks/useSettings'
import { styled } from '@mui/material/styles'
import Check from 'mdi-material-ui/Check'
import { Settings } from '../../../@core/context/settingsContext'
import ChatContext from '../../../context/ChatProvider'


const CustomizerSpacing = styled('div')(({ theme }) => ({
    padding: theme.spacing(5, 6)
}))

const ColorBox = styled(Box)<BoxProps>(({ theme }) => ({
    width: 40,
    height: 40,
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(0, 1.5),
    color: theme.palette.common.white,
    transition: 'box-shadow .25s ease',
    borderRadius: theme.shape.borderRadius
}))

function ThemeCutomizer() {
    const { setDrawerOpen } = useContext<any>(ChatContext)
    const { settings, saveSettings } = useSettings()
    const { mode, themeColor } = settings
    const handleChange = (field: keyof Settings, value: Settings[keyof Settings]): void => {
        saveSettings({ ...settings, [field]: value })
    }

    return (
        <>
            <Box
                className='customizer-header'
                sx={{
                    position: 'relative',
                    p: theme => theme.spacing(3.5, 5),
                    borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    Theme Customizer
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Customize & Preview in Real Time</Typography>
                <IconButton
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                        right: 20,
                        top: '50%',
                        position: 'absolute',
                        color: 'text.secondary',
                        transform: 'translateY(-50%)'
                    }}
                >
                    <Close fontSize='small' />
                </IconButton>
            </Box>
            <PerfectScrollbar options={{ wheelPropagation: false }}>
                <CustomizerSpacing className='customizer-body'>
                    {/* <Typography
              component='p'
              variant='caption'
              sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Theming
            </Typography> */}

                    {/* Skin */}

                    {/* <Box sx={{ mb: 4 }}>
              <Typography>Skin</Typography>
              <RadioGroup
                row
                value={skin}
                onChange={e => handleChange('skin', e.target.value as Settings['skin'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='default' label='Default' control={<Radio />} />
                <FormControlLabel value='bordered' label='Bordered' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='semi-dark' label='Semi Dark' control={<Radio />} />
                )}
              </RadioGroup>
            </Box> */}

                    {/* Mode */}
                    <Box sx={{ mb: 4 }}>
                        <Typography>Mode</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <InputLabel
                                htmlFor='change-mode'
                                sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
                            >
                                Light
                            </InputLabel>
                            <Switch
                                id='change-mode'
                                name='change-mode'
                                checked={mode === 'dark'}
                                onChange={e => handleChange('mode', e.target.checked ? 'dark' : 'light')}
                            />
                            <InputLabel
                                htmlFor='change-mode'
                                sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
                            >
                                Dark
                            </InputLabel>
                        </Box>
                    </Box>

                    {/* Color Picker */}
                    <Box>
                        <Typography sx={{ mb: 2.5 }}>Primary Color</Typography>
                        <Box sx={{ display: 'flex' }}>
                            {/* <ColorBox
                  onClick={() => handleChange('themeColor', 'primary')}
                  sx={{
                    ml: 0,
                    backgroundColor: 'primary.main',
                    ...(themeColor === 'primary' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                  }}
                >
                  {themeColor === 'primary' ? <Check fontSize='small' /> : null}
                </ColorBox> */}
                            <ColorBox
                                onClick={() => handleChange('themeColor', 'secondary')}
                                sx={{
                                    backgroundColor: 'secondary.main',
                                    ...(themeColor === 'secondary' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                                }}
                            >
                                {themeColor === 'secondary' ? <Check fontSize='small' /> : null}
                            </ColorBox>
                            <ColorBox
                                onClick={() => handleChange('themeColor', 'success')}
                                sx={{
                                    backgroundColor: 'success.main',
                                    ...(themeColor === 'success' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                                }}
                            >
                                {themeColor === 'success' ? <Check fontSize='small' /> : null}
                            </ColorBox>
                            <ColorBox
                                onClick={() => handleChange('themeColor', 'error')}
                                sx={{
                                    backgroundColor: 'error.main',
                                    ...(themeColor === 'error' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                                }}
                            >
                                {themeColor === 'error' ? <Check fontSize='small' /> : null}
                            </ColorBox>
                            <ColorBox
                                onClick={() => handleChange('themeColor', 'warning')}
                                sx={{
                                    backgroundColor: 'warning.main',
                                    ...(themeColor === 'warning' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                                }}
                            >
                                {themeColor === 'warning' ? <Check fontSize='small' /> : null}
                            </ColorBox>
                            <ColorBox
                                onClick={() => handleChange('themeColor', 'info')}
                                sx={{
                                    mr: 0,
                                    backgroundColor: 'info.main',
                                    ...(themeColor === 'info' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                                }}
                            >
                                {themeColor === 'info' ? <Check fontSize='small' /> : null}
                            </ColorBox>
                            {/*  <ColorBox
                  onClick={() => handleChange('themeColor', 'diabetes')}
                  sx={{
                    mr: 0,
                    backgroundColor: 'diabetes.main',
                    ...(themeColor === 'diabetes' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                  }}
                >
                  {themeColor === 'diabetes' ? <Check fontSize='small' /> : null}
                </ColorBox> */}
                        </Box>
                    </Box>


                </CustomizerSpacing>

                {/* <Divider sx={{ m: 0 }} /> */}

                {/* <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Layout
            </Typography>

            {/* Content Width */}

                {/* <Box sx={{ mb: 4 }}>
              <Typography>Content Width</Typography>
              <RadioGroup
                row
                value={contentWidth}
                onChange={e => handleChange('contentWidth', e.target.value as Settings['contentWidth'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='full' label='Full' control={<Radio />} />
                <FormControlLabel value='boxed' label='Boxed' control={<Radio />} />
              </RadioGroup>
            </Box> */}

                {/* AppBar 
            <Box sx={{ mb: 4 }}>
              <Typography>AppBar Type</Typography>
              <RadioGroup
                row
                value={appBar}
                onChange={e => handleChange('appBar', e.target.value as Settings['appBar'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='fixed' label='Fixed' control={<Radio />} />
                <FormControlLabel value='static' label='Static' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='hidden' label='Hidden' control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* AppBar Blur
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>AppBar Blur</Typography>
              <Switch
                name='appBarBlur'
                checked={appBarBlur}
                onChange={e => handleChange('appBarBlur', e.target.checked)}
              />
            </Box>

            {/* RTL 
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>RTL</Typography>
              <Switch
                name='direction'
                checked={direction === 'rtl'}
                onChange={e => handleChange('direction', e.target.checked ? 'rtl' : 'ltr')}
              />
            </Box>
          </CustomizerSpacing>

          <Divider sx={{ m: 0 }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Menu
            </Typography>

            {/* Menu Layout
            <Box sx={{ mb: layout === 'horizontal' && appBar === 'hidden' ? {} : 4 }}>
              <Typography>Menu Layout</Typography>
              <RadioGroup
                row
                value={layout}
                onChange={e => {
                  saveSettings({
                    ...settings,
                    layout: e.target.value as Settings['layout'],
                    lastLayout: e.target.value as Settings['lastLayout']
                  })
                }}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='vertical' label='Vertical' control={<Radio />} />
                <FormControlLabel value='horizontal' label='Horizontal' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Menu Collapsed
            {/* {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Menu Collapsed</Typography>
                <Switch
                  name='navCollapsed'
                  checked={navCollapsed}
                  onChange={e => handleChange('navCollapsed', e.target.checked)}
                />
              </Box>
            )} */}

                {/* Menu Hidden

            {/* {layout === 'horizontal' && appBar === 'hidden' ? null : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Menu Hidden</Typography>
                <Switch
                  name='navHidden'
                  checked={navHidden}
                  onChange={e => handleChange('navHidden', e.target.checked)}
                />
              </Box>
            )} 
          </CustomizerSpacing> */}
            </PerfectScrollbar>
        </>
    )
}

export default ThemeCutomizer
