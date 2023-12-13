import React, { useEffect, useState, useRef } from 'react'

//import mui 
import {
   Box, Button, Grid, Card, Typography, TextField, IconButton, TextareaAutosize
} from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Zoom from '@mui/material/Zoom'
import Tooltip from '@mui/material/Tooltip'
import {
   DialogActions,
   DialogContent,
   DialogTitle
} from '@mui/material'

//import toast
import { toast } from 'react-toastify'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import MicroPhoneSelected from 'src/assets/Images/user_Icons/light/microphone_selected.png'
import MicroPhone from 'src/assets/Images/user_Icons/light/microphone-2.png'
import Popover from '@mui/material/Popover'
import Closemodal from 'src/assets/Images/user_Icons/light/close_modal1.png'

//import compoenent
import TicketContext from 'src/context/TicketProvider'
import Checkbox from '@mui/material/Checkbox';

//import env
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION

//import config file
import { API_PATHS } from 'src/config/api.config'

function ArrestReport({ ticketId }: any) {
   const commands: any = [
      {
         command: 'open *',
         callback: (website: any) => {
            window.open('http://' + website.split(' ').join(''))
         }
      },
      {
         command: 'change background colour to *',
         callback: (color: any) => {
            document.body.style.background = color
         }
      },
      {
         command: 'reset',
         callback: () => {
            handleReset()
         }
      },
      ,
      {
         command: 'reset background colour',
         callback: () => {
            document.body.style.background = `rgba(0, 0, 0, 0.8)`
         }
      }
   ]
   const { setArrestReport } = React.useContext<any>(TicketContext)
   const [suspectData, setSuspectData] = useState<any>([])
   const [narrative, setNarrative] = useState<any>()
   const [isListening, setIsListening] = useState(false)
   const microphoneRef: any = useRef(null)
   const { transcript, resetTranscript } = useSpeechRecognition({ commands })
   const [anchorElListening, setAnchorElListening] = React.useState<HTMLButtonElement | null>(null)
   const openListening = Boolean(anchorElListening)
   const idListening = openListening ? 'simple-popover' : undefined


   const closeArrestReportModal = () => {
      setArrestReport(false)
   }
   const stopHandle = () => {
      microphoneRef.current.classList.remove('listening')
      SpeechRecognition.stopListening()
      setNarrative((prevState: any) => [...prevState, transcript].toString().replace(/,/g, ''))
      handleCloseListening()
      setIsListening(false)
      resetTranscript()
   }
   const handleCloseListening = () => {
      setAnchorElListening(null)
   }
   const handleReset = () => {
      resetTranscript()
   }
   const handleListing = () => {
      setIsListening(true)
      microphoneRef.current.classList.add('listening')
      SpeechRecognition.startListening({
         continuous: true
      })
   }
   const handleCloseListingPopover = () => {
      setAnchorElListening(null)
      resetTranscript()
      setIsListening(false)
   }
   const handleOpenListening = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElListening(event.currentTarget)
   }
   const handleGetSuspectDetails = async () => {
      //get ticket details
      if (ticketId) {
         const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
         const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/detail?ticketId=${ticketId}`)
         const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
               Authorization: `Bearer ${UserData.token}`
            }
         })
         const result = await response.json()

         if (result.status === 200) {
            console.log(result?.payload)
            setSuspectData(result?.payload.pivotDetail.otherFields?.suspectData)



         } else if (result.status === 412) {
            toast.error(result.message)

         }
      }


   }


   useEffect(() => {
      handleGetSuspectDetails()
   }, [ticketId])



   // function createData(
   //    name: string,
   //    calories: number,
   //    fat: number,
   //    carbs: number,
   //    protein: number,
   // ) {
   //    return { name, calories, fat, carbs, protein };
   // }

   // const rows = [
   //    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
   //    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
   //    createData('Eclair', 262, 16.0, 24, 6.0),
   //    createData('Cupcake', 305, 3.7, 67, 4.3),
   //    createData('Gingerbread', 356, 16.0, 49, 3.9),
   // ];


   return (
      <>
         <Box>
            <DialogTitle id="alert-dialog-title">
               Suspect Table
            </DialogTitle>
            <DialogContent>
               {/* //start dialogue */}
               <Card sx={{ border: '1px solid lightgray' }}>
                  <Grid
                     sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#f6f8f9',
                        padding: '0px 20px',
                        border: '1px solid lightgray'
                     }}
                  >
                     <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                           <TableHead>
                              <TableRow>
                                 <TableCell padding="checkbox">
                                    <Checkbox
                                       color="primary"

                                       /*  indeterminate={numSelected > 0 && numSelected < rowCount}
                                        checked={rowCount > 0 && numSelected === rowCount}
                                        onChange={onSelectAllClick} */

                                       inputProps={{
                                          'aria-label': 'select all Suspect',
                                       }}
                                    />
                                 </TableCell>
                                 <TableCell>first Name</TableCell>
                                 <TableCell>last Name</TableCell>
                                 <TableCell >Sex</TableCell>
                                 <TableCell >City</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {suspectData.length == 0 ? <Typography sx={{ textAlign: "center" }}>No record found</Typography> : suspectData && suspectData.map((sdata: any, id: any) => (
                                 <TableRow
                                    key={id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                 >
                                    <TableCell >
                                       <Checkbox
                                          color="primary"

                                          /*  indeterminate={numSelected > 0 && numSelected < rowCount}
                                           checked={rowCount > 0 && numSelected === rowCount}
                                           onChange={onSelectAllClick} */

                                          inputProps={{
                                             'aria-label': 'select all Suspect',
                                          }}
                                       /></TableCell>
                                    <TableCell >
                                       {sdata.fname}
                                    </TableCell>
                                    <TableCell >{sdata.lname}</TableCell>
                                    <TableCell >{sdata.sex === "M" ? "Male" : "Female"}</TableCell>
                                    <TableCell >{sdata.city}</TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  </Grid>


               </Card>
               <Grid sx={{ display: "flex" }}>
                  <Grid item sm={10} sx={{ marginTop: '25px' }}>
                     <TextField
                        multiline
                        rows={3}
                        fullWidth
                        name='Narrative'
                        id='textarea-outlined'
                        placeholder='Narrative'
                        label='Narrative'
                        value={narrative && narrative}
                        onChange={(e) => setNarrative(e.target.value)}

                     />
                  </Grid>
                  <Grid item sm={2} sx={{ marginTop: '25px' }}>
                     <Box sx={{ border: "1px solid #3a354142", borderRadius: "6px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "10px" }}>
                        <Tooltip TransitionComponent={Zoom} title='speech to text converter'>
                           <IconButton
                              size='small'
                              sx={{
                                 color: 'text.primary',
                                 display: isListening ? 'none' : 'block'
                              }}
                              ref={microphoneRef}
                              onClick={(e: any) => {
                                 handleListing(), handleOpenListening(e)
                              }}
                           >
                              <img src={MicroPhone} alt='microphone' style={{ width: '30px', height: '30px' }} />
                           </IconButton>

                        </Tooltip>
                        {isListening && (
                           <IconButton
                              size='small'
                              sx={{ color: 'text.red', mr: { xs: 4, sm: 4, md: '25px' } }}
                              onClick={stopHandle}
                              className='microphone-start'
                           >
                              <img src={MicroPhoneSelected} alt='microphone' style={{ width: '20px', height: '20px' }} />
                           </IconButton>
                        )}
                     </Box>
                  </Grid>
               </Grid>


            </DialogContent>
            <DialogActions>
               <Button variant='contained' onClick={closeArrestReportModal}>Generate Report</Button>
            </DialogActions>

         </Box>
         <Popover
            sx={{ padding: '21px', overflow: 'hidden', width: '100%', top: '200px' }}
            anchorPosition={{ top: 500, left: 710 }}
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'left'
            }}
            className='viewPopup-listening'
            id={idListening}
            open={openListening}
            anchorEl={anchorElListening}
            onClose={handleCloseListening}
         >
            <Grid container sx={{ paddingTop: '12px' }} justifyContent={'space-between'}>
               <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                     size='small'
                     sx={{ color: 'text.red', mr: { md: '14px', xs: '10px', sm: '14px' } }}
                     className='microphone-start'
                  >
                     <img src={MicroPhoneSelected} alt='microphone' style={{ width: '20px', height: '20px' }} />
                  </IconButton>
                  <Typography>Speech to Text Converter</Typography>
               </Grid>
               <Grid item>
                  <img
                     src={Closemodal}
                     alt='close-img'
                     onClick={handleCloseListingPopover}
                     style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                  />
               </Grid>
            </Grid>
            <Grid container spacing={5} justifyContent={'center'} sx={{ marginTop: '0 !important' }}>
               <Grid item sm={12}>
                  <TextareaAutosize
                     value={transcript}
                     minRows={7}
                     style={{
                        width: '100%',
                        borderColor: '#e5e5e5',
                        borderRadius: '10px',
                        height: '105px',
                        padding: '5px'
                     }}
                  />
               </Grid>
               <Grid item sm={5}>
                  <Button
                     onClick={handleReset}
                     fullWidth
                     variant='outlined'
                     sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        border: '1px solid #ff0000a6',
                        borderRadius: '9px ',
                        filter: 'drop-shadow(0px 17px 24px rgba(255, 113, 52, 0.25))',
                        p: '13px',
                        textTransform: 'capitalize',
                        color: '#ff0000a6',
                        '&:hover': {
                           border: '1px solid #ff0000a6'
                        }
                     }}
                  >
                     Reset
                  </Button>
               </Grid>
               <Grid item sm={5}>
                  <Button
                     onClick={stopHandle}
                     fullWidth
                     variant='contained'
                     sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        borderRadius: '9px',
                        boxShadow: '0px 17px 24px rgba(45, 74, 205, 0.25)',
                        p: '13px',
                        textTransform: 'capitalize',
                        backgroundColor: '#ff0000a6',
                        '&:hover': {
                           backgroundColor: '#ff0000a6'
                        }
                     }}
                  >
                     Stop & Add
                  </Button>
               </Grid>
            </Grid>
         </Popover>
      </>
   )
}

export default ArrestReport