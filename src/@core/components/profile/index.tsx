import { Box, BoxProps, Divider, Grid, IconButton, InputLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Close from 'mdi-material-ui/Close'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useSettings } from '../../../@core/hooks/useSettings'
import { styled } from '@mui/material/styles'
import ChatContext from '../../../context/ChatProvider'
import { toast } from 'react-toastify'
import { RotatingLines } from 'react-loader-spinner';
import ProfilePic from "../../../assets/Images/profilepic.jpg"
import LeadPencil from 'mdi-material-ui/LeadPencil'
import EmailIcon from '@mui/icons-material/MailOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';

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


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function ProfileInfo() {
    const { setDrawerOpen } = useContext<any>(ChatContext)
    const { settings, saveSettings } = useSettings()
    const [openVerifier, setOpenVerifier] = useState(false);
    const [croppedImage, setCroppedimage] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);
    const [profileImage, setProfileImage] = useState<any>(null);
    const inputRef = React.useRef<any>(null);
    const [eventimageLoader, setEventimageLoader] = useState(false)

    useEffect(() => {
        if (croppedImage != null) {
            //setEventImageLoader(true)
            let imgProf: any = croppedImage.size == 0 ? profileImage : croppedImage
            // Api.handleUploadFile(imgProf, type, (response: any) => {
            //   if (
            //     response.status &&
            //     response.data.status === 200
            //   ) {

            //     setEventThumbnail({
            //       baseUrl: response.data.payload.baseUrl,
            //       imageUrl: response.data.payload.imageUrl
            //     });
            //     setEventImageLoader(false)
            //   } else {
            //     setEventImageLoader(false)
            //     toast.error(response.data.message);
            //   }
            // });
        }
    }, [croppedImage]);

    const handleCloseAssigneeModal = () => {
        setOpenVerifier(!openVerifier);
    };
    //Drag n Drop
    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const FileExtemsion = ["jpg", "jpeg", "png"];
            const maxFileSizeMB = 15;
            const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;
            for (const file of e.dataTransfer.files) {
                if (FileExtemsion.includes(file.name.split(".").pop().toLowerCase())) {
                    if (file.size < maxFileSizeBytes) {
                        const reader = new FileReader()
                        reader.onload = function (e: any) {
                            setOpenVerifier(true);
                            // setEventThumbnailPath(e.target.files[0])
                            setProfileImage(e.target.files[0])
                            //  handeleSave(e.target.files[0])  
                        }
                        reader.readAsDataURL(file)
                    }
                    else {
                        toast.error(`Image size must be below ${maxFileSizeMB}MB`);
                    }
                } else {
                    toast.error(`This ${file.name.split(".").pop()} can't be supported`);
                }
            }
        }
    };

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
                    Profile
                </Typography>
                {/* <Typography sx={{ color: 'text.secondary' }}>Customize & Preview in Real Time</Typography> */}
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
                    <div>
                        <div className="upload w-[150px] h-[150px] rounded-[50%] overflow-hidden mx-auto relative " >
                            {eventimageLoader ?
                                <div className="w-[150px] h-[150px] relative overflow-hidden flex justify-center">
                                    <RotatingLines
                                        strokeColor="#9d71b3"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        width="25"
                                        visible={true}
                                    />
                                </div>
                                :
                                <>
                                    <div className='h-[150px] image-icon'>
                                        <img className={`w-full h-full p-2 rounded-[50%] bg-white object-cover`} src={ProfilePic} alt="File" />
                                        <input
                                            ref={inputRef}
                                            className=" w-full h-full rounded-[50%] overflow-hidden absolute cursor-pointer opacity-0	bg-[transparent] text-[transparent] top-0"
                                            id="profilePic"
                                            name="profilePic"
                                            type="file"
                                            onChange={(e: any) => {
                                                if (inputRef && inputRef.current) {
                                                    inputRef.current.click();
                                                }
                                                const file = e.target.files[0];
                                                const FileExtension = ["jpg", "jpeg", "png"];
                                                const maxFileSizeMB = 15;
                                                const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;
                                                if (file.size < maxFileSizeBytes) {

                                                    if (FileExtension.includes(file.name.split(".").pop().toLowerCase())) {
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onload = function (e: any) {
                                                                // setOpenVerifier(true);
                                                                // setEventThumbnailPath(file)
                                                                // setProfileImage(file)
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }
                                                    else {
                                                        toast.error(`${file.name.split(".").pop()} can't be supported`);

                                                    }
                                                } else {
                                                    toast.error(`File size should be below ${maxFileSizeMB}MB`);
                                                }

                                                if (inputRef.current && inputRef.current !== undefined) {
                                                    inputRef.current.value = ""
                                                }
                                            }}
                                            accept="image/png, image/jpeg, image/jpg"
                                        />
                                        {dragActive && (
                                            <div
                                                id="drag-file-element"
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                            ></div>
                                        )}
                                    </div>
                                    {
                                        <>
                                            <div className='edit-Icon'>

                                                <LeadPencil sx={{ height: '20px', width: '20px' }} />
                                                <input
                                                    ref={inputRef}
                                                    className=" w-full h-full rounded-[50%] overflow-hidden absolute cursor-pointer opacity-0	bg-[transparent] text-[transparent] top-0"
                                                    id="profilePic"
                                                    name="profilePic"
                                                    type="file"
                                                    onChange={(e: any) => {
                                                        if (inputRef && inputRef.current) {
                                                            inputRef.current.click();
                                                        }
                                                        const file = e.target.files[0];
                                                        const FileExtension = ["jpg", "jpeg", "png"];
                                                        const maxFileSizeMB = 15;
                                                        const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;
                                                        if (file.size < maxFileSizeBytes) {

                                                            if (FileExtension.includes(file.name.split(".").pop().toLowerCase())) {
                                                                if (file) {
                                                                    const reader = new FileReader()
                                                                    reader.onload = function (e: any) {
                                                                        setOpenVerifier(true);
                                                                        //  setEventThumbnailPath(file)
                                                                        setProfileImage(file)
                                                                    }
                                                                    reader.readAsDataURL(file)
                                                                }
                                                            }
                                                            else {
                                                                toast.error(`${file.name.split(".").pop()} can't be supported`);

                                                            }
                                                        } else {
                                                            toast.error(`File size should be below ${maxFileSizeMB}MB`);
                                                        }

                                                        if (inputRef.current && inputRef.current !== undefined) {
                                                            inputRef.current.value = ""
                                                        }
                                                    }}
                                                    accept="image/png, image/jpeg, image/jpg"
                                                />
                                            </div>
                                        </>}
                                </>
                            }
                        </div>
                        {/* <p className="text-[#637381] text-xs leading-4 mt-4 font-sans text-center font-normal w-[200px] mx-auto">
                            Allowed *.jpeg, *.jpg, *.png Max size upto 15 MB
                        </p> */}
                    </div>

                    {/* Basic Info Scection */}
                    <Grid sx={{ textAlign: 'center' }}>
                        <Typography
                            variant='caption'
                            sx={{ color: 'text.dark', textTransform: 'capitalize' }}
                        >
                            Hazel Oswal
                        </Typography>
                    </Grid>
                    <Divider sx={{ mb: 4 }} />
                    <Grid container spacing={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Grid item xs={6} md={3} >
                            <Typography sx={{ color: 'text.ternary', textTransform: 'capitalize', py: 1, fontSize: '0.875rem' }}><EmailIcon sx={{ height: '17px', width: '17px' }} /> Email :</Typography>
                            <Typography sx={{ color: 'text.ternary', textTransform: 'capitalize', py: 1, fontSize: '0.875rem' }}><PhoneIphoneOutlinedIcon sx={{ height: '17px', width: '17px' }} />  Phone :</Typography>

                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Typography sx={{ color: 'text.secondary', py: 1, fontSize: '0.875rem' }}>hazel.oswal@gmail.com</Typography>
                            <Typography sx={{ color: 'text.secondary', py: 1, fontSize: '0.875rem' }}>7859641230</Typography>
                        </Grid>
                    </Grid>
                </CustomizerSpacing>
            </PerfectScrollbar >
        </>
    )
}

export default ProfileInfo
