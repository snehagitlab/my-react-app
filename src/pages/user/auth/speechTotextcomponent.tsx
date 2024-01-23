// SpeechRecognition.js
import React, { useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechRecognitionComponent = () => {
    // const {
    //     transcript,
    //     listening,
    //     resetTranscript,
    //     browserSupportsSpeechRecognition,
    // } = useSpeechRecognition();

    // if (!browserSupportsSpeechRecognition) {
    //     return <p>Your browser does not support speech recognition.</p>;
    // }

    const startListeningHandler = () => {
        SpeechRecognition.startListening();
    };

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
        // setMessageTicket((prevState: any) => [...prevState, transcript].toString().replace(/,/g, ''))
        handleCloseListening()
        setIsListening(false)
        resetTranscript()
    }

    const handleReset = () => {
        resetTranscript()
    }

    const handleCloseListingPopover = () => {
        //setAnchorElListening(null)
        resetTranscript()
        setIsListening(false)
    }

    const handleCloseListening = () => {
        //setAnchorElListening(null)
    }

    const handleOpenListening = (event: React.MouseEvent<HTMLButtonElement>) => {
        //setAnchorElListening(event.currentTarget)
    }



    return (
        <div>
            <p>Transcript: {transcript}</p>
            <p>Listening: {isListening ? 'Yes' : 'No'}</p>
            <button onClick={startListeningHandler}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
        </div>
    );
};

export default SpeechRecognitionComponent;
