import React, { useState, useEffect, useRef } from 'react'
import {
    Grid,
    Typography,
    Button,
    TextareaAutosize,
    IconButton,
    Modal

} from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Popover from '@mui/material/Popover'
import Divider from '@mui/material/Divider'
import LoadingButton from '@mui/lab/LoadingButton'

//import axios
import axios from 'axios'

// toast popup
import { toast } from 'react-toastify'

//import images
import add_fileUpload from '../../../../assets/Images/user_Icons/light/add_fileUpload.png'
import Emoji from '../../../../assets/Images/user_Icons/light/Smiley.png'
import Video from '../../../../assets/Images/user_Icons/light/video.png'
import MicroPhoneSelected from '../../../../assets/Images/user_Icons/light/microphone_selected.png'
import MicroPhone from '../../../../assets/Images/user_Icons/light/microphone-2.png'
import ScreenRecorder from '../../../../assets/Images/user_Icons/light/group.png'
import SendImage from '../../../../assets/Images/user_Icons/light/send.png'
import Closemodal from '../../../../assets/Images/user_Icons/light/close_comment_document.svg'
import Pdf_img from '../../../../assets/Images/user_Icons/light/pdf_img.png'
import file_icon from '../../../../assets/Images/user_Icons/light/file_icon.png'
import Close from 'mdi-material-ui/Close'



//import emoji npm
import Picker from 'emoji-picker-react'

// voice plugin
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

//import react router dom
import { useParams } from 'react-router-dom'

//import config file
import { API_PATHS, FILE_TYPE } from 'src/config/api.config'

//env file
const BASE_URL = process.env.REACT_APP_BASE_URL
const API_VERSION = process.env.REACT_APP_API_VERSION
const BASE_URL_PUBLIC = process.env.REACT_APP_BASE_URL_PUBLIC
const ticketType = FILE_TYPE.TICKET_ATTACHMENT

//import screen recorder
import { useReactMediaRecorder } from 'react-media-recorder'

//import mention
const { Option } = Mentions

//import antd
import { Mentions } from 'antd'

//import component
import TicketContext from 'src/context/TicketProvider'
import CircularProgress from '@mui/material/CircularProgress'

const Form = styled('form')(({ theme }) => ({
    padding: theme.spacing(0, 5, 5)
}))

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    boxShadow: theme.shadows[1],
    padding: theme.spacing(1.25, 4),
    justifyContent: 'space-between',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper
}))

function CommonInputField() {
    const { id } = useParams()
    const ticketId: any = id
    const { agentDetails, messageTicket, setMessageTicket, setcommentReply, filterData, setFilterData, setImagePath, imgPath, CommonInputFieldshow } = React.useContext<any>(TicketContext)
    const [record, setRecord] = React.useState<any>(10)
    const [msg, setMsg] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [agentLists, setAgentLists] = useState<any>([])
    const [showPicker, setShowPicker] = useState<boolean>(false)
    const [fileSelected, setFileSelected] = React.useState<any>([])
    const [loader, setLoader] = useState(false)
    const [loadingMeeting, setLoadingMeeting] = useState(false)


    console.log(msg)


    //import popover state
    const [anchorElListening, setAnchorElListening] = React.useState<HTMLButtonElement | null>(null)

    //Video Calling using jitsi
    const [videoPopup, setAnchorVideoPopup] = React.useState<HTMLButtonElement | null>(null)
    const [videoReplayTicketId, setVideoReplayTicketId] = React.useState<any>(0)
    const [R_BlobURL, setBlobURL] = React.useState<any>("")

    const openListening = Boolean(anchorElListening)
    const idListening = openListening ? 'simple-popover' : undefined

    const openVideoListening = Boolean(videoPopup)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '5px 7px 20px rgb(0 0 0 / 25%) !important',
        bgcolor: 'background.paper',
        borderRadius: '25px',
        p: 8
    }

    //state voice
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

    const { transcript, resetTranscript } = useSpeechRecognition({ commands })
    const [isListening, setIsListening] = useState(false)
    const microphoneRef: any = useRef(null)

    const handleListing = () => {
        setIsListening(true)
        microphoneRef.current.classList.add('listening')
        SpeechRecognition.startListening({
            continuous: true
        })
    }

    const stopHandle = () => {
        microphoneRef.current.classList.remove('listening')
        SpeechRecognition.stopListening()
        setMessageTicket((prevState: any) => [...prevState, transcript].toString().replace(/,/g, ''))
        handleCloseListening()
        setIsListening(false)
        resetTranscript()
    }

    const handleReset = () => {
        resetTranscript()
    }

    const handleCloseListingPopover = () => {
        setAnchorElListening(null)
        resetTranscript()
        setIsListening(false)
    }

    const handleCloseListening = () => {
        setAnchorElListening(null)
    }

    const handleOpenListening = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElListening(event.currentTarget)
    }

    //Screen Recording
    const { status, stopRecording, startRecording, mediaBlobUrl /* , clearBlobUrl */ } = useReactMediaRecorder({ screen: true })

    const [isRecordScreenPresent, setRecordScreenPresent] = React.useState(false)

    useEffect(() => {

        if (status == "acquiring_media") {
            setBlobURL("")
            setRecordScreenPresent(false)
        }


        if (mediaBlobUrl) {
            if (!isRecordScreenPresent && status != "idle" && status != "acquiring_media" && status != "recording") {
                setBlobURL(mediaBlobUrl)
                setRecordScreenPresent(true)
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stopRecording])


    useEffect(() => {
        if (mediaBlobUrl) {
            fetch(mediaBlobUrl).then(async (r) => {
                const Rblob = await r.blob()
                const audioFile: any = new File([Rblob], 'voice.mp4', { type: 'video/mp4' });
                if (filterData.length > 0) {
                    setFilterData([...filterData, audioFile])
                } else {
                    setFilterData([audioFile])
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaBlobUrl])

    //fetch agent api calling
    const fetchAgent = async () => {
        setLoading(true)
        const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
        const url = new URL(
            `${BASE_URL}/${API_VERSION}/user/pick/list/?search={"roleId":[2,3]}&showAll=true`
        )
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
            setLoading(false)
            setAgentLists(result.payload.data)
            setRecord(result.pager.totalRecords)
        }
    }

    useEffect(() => {
        fetchAgent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [record])


    const handleSendMsg = (e: any) => {
        e.preventDefault()
        setMsg(e.target.value)
    }

    const onReplyChange = (value: string) => {
        setMessageTicket(value)
    }

    //emoji function
    const onEmojiClick = (event: any, emojiObject: any) => {
        setMessageTicket((prevInput: any) => prevInput + emojiObject.emoji)
    }



    const handleSubmitTicketReply = async () => {
        setShowPicker(false)
        setLoader(true)
        const array: any = []
        let errorMsg: any;
        if (filterData.length > 0) {
            const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
            const formData = new FormData()

            for (let i = 0; i < filterData.length; i++) {
                formData.append('file', filterData[i])
            }

            formData.append('type', ticketType)
            try {
                const response = await axios.post(`${BASE_URL_PUBLIC}/v1/file`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${UserData.token}`
                    }
                })
                if (response.status === 200) {
                    setLoader(false)
                    errorMsg = ""
                    const Imgdata = response.data.payload.filesPath

                    if (Imgdata) {
                        for (let i = 0; i < Imgdata.length; i++) {
                            array.push(Imgdata[i]['filePath'])
                        }
                    }
                } else {
                    setLoader(false)
                }
            }
            catch (error: any) {
                setLoader(false)
                toast.error(error.response.data.message)
                setImagePath([])
                setFilterData([])
                errorMsg = error.response.data.message
            }
        }
        if (errorMsg) {

        } else if (array.length > 0 || messageTicket) {
            const url1 = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/reply`)
            const UserData1: any = JSON.parse(localStorage.getItem('user1Data') || '{}')

            const formData1 = new FormData()
            if (array) {
                formData1.append('attachment', JSON.stringify(array))
            }

            formData1.append('message', messageTicket && messageTicket)
            formData1.append('ticketId', ticketId)
            formData1.append('messageType', 'text')
            axios({
                method: 'post',
                url: url1.toString(),
                data: formData1,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${UserData1.token}`
                }
            })
                .then(function (response) {
                    if (response.status === 200) {
                        setLoader(false)
                        setcommentReply(response.data)

                        //toast.success('Message sent successfully')
                        setImagePath([])
                        setMessageTicket('')
                        setFilterData([])
                        setBlobURL("")
                        errorMsg = ""
                    }
                })
                .catch(function (error) {
                    toast.error(error.response.data.message)
                    setLoader(false)
                })
        } else {

           // toast.error("Please enter any message or upload images")

            setLoader(false)
        }


    }
    const [joinUrl, setJoinUrl] = useState('')
    const [startUrl, setStartUrl] = useState('')
    const handleStartCalling = async () => {
        setLoadingMeeting(true)
        const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
        const UserEmail: any = UserData.data.email
        if (UserEmail != '' && agentDetails?.email != '') {
            const urls = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.zoom}?user_email=${UserEmail}&invitee_email=${agentDetails?.email}`)
            const response = await fetch(urls.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${UserData.token}`
                }
            })
            const result = await response.json()
            if (result.status === 200) {
                setJoinUrl(result?.payload?.join_url)
                setStartUrl(result?.payload?.start_url)
            }
            else {
                toast.error("Meeting not created because " + result.message)
                handleVideoPopupClose()
                setLoadingMeeting(false)

            }

        }
    }

    useEffect(() => {
        if (joinUrl != '' && startUrl != '') {
            const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
            const videoCallMsg = `{"meetingDetail":{"meetingBody": "${UserData.data.fname}  ${UserData.data.lname}  created a meeting. Click here to join -","joinUrl":"${joinUrl}","startUrl":"${startUrl}"}}`
            const url = new URL(`${BASE_URL}/${API_VERSION}/${API_PATHS.ticket}/reply`)
            const formData = new FormData()
            formData.append('attachment', fileSelected)
            formData.append('message', videoCallMsg)
            formData.append('ticketId', videoReplayTicketId)
            formData.append('messageType', 'meeting')
            axios({
                method: 'post',
                url: url.toString(),
                data: formData,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${UserData.token}`
                }
            })
                .then(function (response) {
                    if (response.status === 200) {
                        setAnchorVideoPopup(null)
                        handleVideoPopupClose()
                        setcommentReply(response.data.payload)

                        //toast.success(response.data.message)
                        setMessageTicket('')
                        setFileSelected([])
                        setLoadingMeeting(false)

                    }
                })
                .catch(function (error) {
                    toast.error(error.response.data.message)
                    handleVideoPopupClose()
                    setLoadingMeeting(false)
                })
        }
        else {
            console.log('Something went wrong')
            handleVideoPopupClose()
            setLoadingMeeting(false)
        }
    }, [startUrl])


    //import dropdown close
    const handleVideoPopupClose = () => {
        setAnchorVideoPopup(null)
    }

    //open dropdown
    const handleVideoPopupOpen = (event: any) => {
        setAnchorVideoPopup(event.currentTarget)
        setVideoReplayTicketId(ticketId)
    }





    const handleGetFile = async (e: any) => {

        setFilterData(Array.from(e.target.files))
        setFilterData([...filterData, ...e.target.files])
        const file = e.target.files
        const base64Img: any = []
        const FileExtemsion = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv', 'mp4', 'wav']
        console.log(file.length)
        for (const file of e.target.files) {
            if (FileExtemsion.includes(file.name.split('.').pop().toLowerCase())) {
                const reader = new FileReader()
                reader.onload = function (e: any) {
                    base64Img.push(e.target.result)
                }
                reader.readAsDataURL(file)
            } else {
                toast.error(`This ${file.name.split('.').pop()} can't support`)
            }
        }
        setTimeout(() => {
            setImagePath([...imgPath, ...base64Img])
        }, 1000)

    }

    const handleClick = (id: any) => {
        setImagePath(imgPath.filter((_: any, i: any) => i !== id))
        setFilterData(filterData.filter((_: any, i: any) => i !== id))
    }

    const CommonInputFieldRefresh = () => {
        setShowPicker(false)
        setImagePath([])
        setBlobURL("")
    }

    //refresh commomInputField
    useEffect(() => {
        CommonInputFieldRefresh()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [CommonInputFieldshow])




    return (
        <>
            <Box className='input-div'>
                <Form onSubmit={handleSendMsg} sx={{ padding: '0px 0px 16px 0px ' }}>
                    <ChatFormWrapper sx={{ flexDirection: 'column', alignItems: 'start', borderRadius: '12px', padding: '0' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                width: '100%',
                                borderTopLeftRadius: '12px',
                                borderTopRightRadius: '12px'
                            }}
                        >
                            <Grid sx={{ width: '100%' }}>
                                {R_BlobURL != "" || imgPath ? (
                                    <>
                                        {imgPath.length > 0 && (

                                            /*      <Grid sx={{ width: '100%', height: '100px', padding: '10px' }}>
                                                     <Box sx={{ display: 'flex' }}> */

                                            <Grid sx={{ width: '100%', height: 'auto', padding: '10px 0px' }}>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: "end" }}>
                                                    {imgPath &&
                                                        imgPath.length > 0 &&
                                                        imgPath.map((item: any, index: any) => {
                                                            const type = item.split(';')[0].split(':')[1]

                                                            return (

                                                                <>
                                                                    <Box
                                                                        sx={{
                                                                            backgroundColor: 'lightgray',
                                                                            width: '80px',
                                                                            height: '80px',
                                                                            margin: '5px 9px 5px 9px',
                                                                            display: 'flex'
                                                                        }}
                                                                    >
                                                                        <Box key={index} sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                            {(type && type === 'image/png') || (type && type === 'image/jpeg') ? (
                                                                                <>
                                                                                    <IconButton
                                                                                        size='small'
                                                                                        sx={{
                                                                                            color: 'text.secondary',
                                                                                            position: 'absolute',
                                                                                            right: '-13px',
                                                                                            top: '-14px'
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            onClick={() => handleClick(index)}
                                                                                            src={Closemodal}
                                                                                            alt='rightArrow'
                                                                                            style={{ width: '20px', height: '20px' }}
                                                                                        />
                                                                                    </IconButton>{' '}
                                                                                    <img src={item} alt="itemimg" style={{ height: '80px', width: '80px', opacity: "0.4", position: 'relative' }} />
                                                                                </>
                                                                            ) : type && type === 'application/pdf' ? (
                                                                                <>
                                                                                    <IconButton
                                                                                        size='small'
                                                                                        sx={{
                                                                                            color: 'text.secondary',
                                                                                            position: 'absolute',
                                                                                            right: '-22px',
                                                                                            top: '-14px'
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            onClick={() => handleClick(index)}
                                                                                            src={Closemodal}
                                                                                            alt='rightArrow'
                                                                                            style={{ width: '20px', height: '20px' }}
                                                                                        />
                                                                                    </IconButton>{' '}
                                                                                    <Typography variant='body2' sx={{ fontSize: '14px', color: 'primary.main', position: "absolute", opacity: "0.4" }}>Pdf file</Typography>
                                                                                    <img
                                                                                        alt="" pdf-img
                                                                                        src={Pdf_img}
                                                                                        style={{ height: '70px', width: '70px', marginLeft: '5px', opacity: "0.2" }}
                                                                                    />
                                                                                </>
                                                                            ) : type == 'video/mp4' || type == 'video/wav' ? (
                                                                                <>
                                                                                    <IconButton
                                                                                        size='small'
                                                                                        sx={{
                                                                                            color: 'text.secondary',
                                                                                            position: 'absolute',
                                                                                            right: '-13px',
                                                                                            top: '-14px'
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            onClick={() => handleClick(index)}
                                                                                            src={Closemodal}
                                                                                            alt='rightArrow'
                                                                                            style={{ width: '20px', height: '20px' }}
                                                                                        />
                                                                                    </IconButton>
                                                                                    <video src={item}
                                                                                        style={{ height: '80px', width: '80px' }}
                                                                                        controls />
                                                                                </>
                                                                            )

                                                                                : (
                                                                                    <>
                                                                                        <IconButton
                                                                                            size='small'
                                                                                            sx={{
                                                                                                color: 'text.secondary',
                                                                                                position: 'absolute',
                                                                                                right: '-18px',
                                                                                                top: '-14px'
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                onClick={() => handleClick(index)}
                                                                                                src={Closemodal}
                                                                                                alt='rightArrow'
                                                                                                style={{ width: '20px', height: '20px' }}
                                                                                            />
                                                                                        </IconButton>{' '}
                                                                                        <Typography variant='body2' sx={{ fontSize: '14px', color: 'primary.main', position: "absolute", opacity: "0.4" }}>file</Typography>
                                                                                        <img
                                                                                            alt="file_icon"
                                                                                            src={file_icon}
                                                                                            style={{ height: '70px', width: '70px', marginLeft: '5px', opacity: "0.2" }}
                                                                                        />
                                                                                    </>
                                                                                )}
                                                                        </Box>
                                                                    </Box>
                                                                </>
                                                            )
                                                        })}
                                                </Box>
                                                <>

                                                    <Divider sx={{ m: '9px 0px', borderColor: '#3a35415c', display: R_BlobURL != "" || imgPath ? "block" : "none" }} />
                                                </>
                                            </Grid>
                                        )}

                                        <>
                                            {R_BlobURL != "" ?
                                                <>
                                                    <Grid sx={{ position: "relative", width: '150px', height: '100px' }}>

                                                        <IconButton
                                                            size='small'
                                                            sx={{
                                                                color: 'text.secondary',
                                                                position: 'absolute',
                                                                right: '-6px',
                                                                top: '-5px',
                                                                zIndex: "1"
                                                            }}
                                                        >
                                                            <img
                                                                onClick={() => setBlobURL("")}
                                                                src={Closemodal}
                                                                alt='rightArrow'
                                                                style={{ width: '20px', height: '20px' }}
                                                            />
                                                        </IconButton>{' '}
                                                        {R_BlobURL && <video src={R_BlobURL} width='100%' height='100%' className="video-record" controls />}
                                                    </Grid>
                                                </> : " "}
                                        </>
                                    </>
                                ) : (
                                    ''
                                )}

                                <Mentions
                                    placeholder='Type your comment here…'
                                    onChange={onReplyChange}
                                    value={messageTicket}
                                    className={R_BlobURL! == "" || imgPath ? 'antd-textfield' : 'normal-textfield'}
                                >
                                    {loading ? (
                                        <CircularProgress color='inherit' />
                                    ) : agentLists.length === 0 ? (
                                        <Typography sx={{ textAlign: 'center' }}>NO RECORD FOUND</Typography>
                                    ) : (
                                        agentLists.map((agent: any) => (
                                            <Option key={agent.userId} value={`${agent.fname}`}>
                                                {agent.fname}
                                            </Option>
                                        ))
                                    )}
                                </Mentions>
                            </Grid>
                        </Box>
                        <Box
                            className='chatttask'
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                padding: '8px 17px',
                                position: 'relative',
                                justifyContent: 'space-between',
                                width: '100%',
                                borderLeft: '0.77013px solid rgba(191, 191, 191, 0.78)',
                                borderRight: '0.77013px solid rgba(191, 191, 191, 0.78)',
                                borderBottomLeftRadius: '12px',
                                borderBottomRightRadius: ' 12px'
                            }}
                        >
                            <Box sx={{ display: 'flex' }}>
                                {showPicker && (
                                    <Picker
                                        onEmojiClick={onEmojiClick}
                                        pickerStyle={{ position: 'absolute', bottom: '120px', right: '0px', width: '53vw' }}
                                    />
                                )}

                                <IconButton
                                    size='small'
                                    component='label'
                                    htmlFor='upload-img'
                                    sx={{ mr: { xs: 4, sm: 4, md: '25px' }, color: 'text.primary' }}
                                >
                                    <img src={add_fileUpload} alt='file_upload' style={{ width: '20px', height: '20px' }} />
                                    <input hidden type='file' id='upload-img' onChange={handleGetFile} multiple accept='image/jpeg,image/jpg,image/png,application/pdf,application/doc,video/*' />
                                </IconButton>

                                <IconButton size='small' sx={{ color: 'text.primary', mr: { xs: 4, sm: 4, md: '25px' } }}>
                                    <img
                                        alt='emoji'
                                        src={Emoji}
                                        style={{ width: '20px', height: '20px' }}
                                        onClick={() => {
                                            setShowPicker(!showPicker)
                                        }}
                                    />
                                </IconButton>
                                <IconButton size='small' sx={{ color: 'text.primary', mr: { xs: 4, sm: 4, md: '25px' } }} >
                                    <img
                                        src={Video}
                                        alt='video'
                                        style={{ width: '20px', height: '20px' }}
                                        onClick={(event: any) => handleVideoPopupOpen(event)}
                                    />
                                </IconButton>

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

                                <IconButton
                                    size='small'
                                    sx={{
                                        color: 'text.primary',
                                        mr: { xs: 4, sm: 4, md: '25px' },
                                        display: isListening ? 'none' : 'block'
                                    }}
                                    ref={microphoneRef}
                                    onClick={(e: any) => {
                                        handleListing(), handleOpenListening(e)
                                    }}
                                >
                                    <img src={MicroPhone} alt='microphone' style={{ width: '20px', height: '20px' }} />
                                </IconButton>
                                <IconButton
                                    size='small'
                                    sx={{
                                        color: 'text.primary',
                                        mr: { xs: 4, sm: 4, md: '25px' },
                                    }}
                                >
                                    <img
                                        src={ScreenRecorder}
                                        alt='Screen Recorder'
                                        style={{ width: '20px', height: '20px' }}
                                        onClick={(e) => {
                                            startRecording(), handleGetFile(e)
                                        }}
                                    />
                                </IconButton>
                            </Box>
                            <Box>


                                {loader ?
                                    <>
                                        <LoadingButton
                                            loading={loader}
                                            variant='contained'
                                            disabled
                                            sx={{
                                                textTransform: 'capitalize',
                                                marginLeft: '10px',
                                                color: 'white'
                                            }}
                                        >
                                            Send
                                        </LoadingButton>
                                    </>
                                    :
                                    <>
                                        <Button
                                            onClick={() => handleSubmitTicketReply()}
                                            type='submit'
                                            variant='contained'
                                            sx={{
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                height: { xs: '35px', sm: '38px', md: '40px' },
                                                textTransform: 'capitalize',
                                                padding: '16px',
                                                width: { xs: '80px', sm: '84px', md: '87.4px' }
                                            }}
                                        >
                                            Send
                                            <img src={SendImage} alt='sendimg' style={{ marginLeft: '8px', width: '18px', height: '18px' }} />
                                        </Button>
                                    </>

                                }


                            </Box>
                        </Box>
                    </ChatFormWrapper>
                </Form>
            </Box>

            {/* listening popover */}
            <Popover
                sx={{ padding: '21px', overflow: 'hidden', width: '100%', top: '200px' }}
                anchorPosition={{ top: 200, left: 900 }}

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
                    <Grid item onClick={handleCloseListingPopover} sx={{ cursor: 'pointer' }}>
                        {/*  <img
                            src={Closemodal}
                            alt='close-img'
                            onClick={handleCloseListingPopover}
                            style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                        /> */}
                        <Close />
                    </Grid>
                </Grid>
                <Grid container spacing={5} justifyContent={'center'} sx={{ marginTop: '0 !important', paddingBottom: '15px' }}>
                    <Grid item sm={12}>
                        <TextareaAutosize
                            value={transcript}
                            minRows={7}
                            style={{
                                width: '100%',
                                borderColor: '#e5e5e5 !important',
                                borderRadius: '10px',
                                height: '105px',
                                padding: '5px',
                                outlineColor: '#e5e5e5'
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
            <Modal
                hideBackdrop
                open={openVideoListening}
                onClose={handleVideoPopupClose}
                aria-labelledby='child-modal-title'
                aria-describedby='child-modal-description'
                sx={{ backgroundColor: '#00000075', width: '100%' }}
            >
                <Box sx={{ ...style }}>
                    <Typography id='modal-modal-title' variant='h6' component='h2'>
                        Setup Meeting
                    </Typography>
                    <p id='child-modal-description'>Are you sure you want to setup meeting?</p>

                    {loadingMeeting ?
                        <>
                            <LoadingButton
                                loading={loadingMeeting}
                                variant='contained'
                                size='small'
                                disabled
                                sx={{ marginRight: 2, mb: 0, textTransform: 'capitalize' }}
                            >
                                OK
                            </LoadingButton>
                        </>
                        :
                        <Button
                            variant='contained'
                            size='small'
                            sx={{ marginRight: 2, mb: 0, textTransform: 'capitalize' }}
                            onClick={() => handleStartCalling()}
                        >
                            OK
                        </Button>
                    }
                    <Button variant='outlined' size='small' sx={{ textTransform: 'capitalize' }} onClick={handleVideoPopupClose}>
                        Cancel
                    </Button>
                </Box>
            </Modal>

           


        </>
    )
}

export default CommonInputField

