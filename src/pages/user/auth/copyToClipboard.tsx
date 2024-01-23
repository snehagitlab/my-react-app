// Import necessary dependencies
import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import copy from 'clipboard-copy';

// Create the ClipboardCopy component
const ClipboardCopy = () => {
    // State to store the text to be copied
    const [textToCopy, setTextToCopy] = useState<string>('Hello, clipboard!');

    // State for Snackbar (to show copy success/failure)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Function to handle the copy button click
    const handleCopyClick = async () => {
        try {
            // Use clipboard-copy to copy the text to the clipboard
            await copy(textToCopy);

            // Show success message in Snackbar
            setSnackbarMessage('Text copied to clipboard');
            setSnackbarOpen(true);
        } catch (err) {
            // Show error message in Snackbar
            setSnackbarMessage('Failed to copy text to clipboard');
            setSnackbarOpen(true);
        }
    };

    // // Function to handle Snackbar close
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTextToCopy(e.target.value);
    };

    return (
        <div style={{ marginTop: '20px' }}>
            {/* Text input for the text to be copied */}
            <TextField
                label="Text to Copy"
                variant="outlined"
                fullWidth
                value={textToCopy}
                onChange={handleTextChange}
            />

            {/* Button to trigger the copy action */}
            <Button variant="contained" onClick={handleCopyClick}>
                Copy to Clipboard
            </Button>

            {/* Snackbar to show copy success/failure */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}
                    onClose={handleSnackbarClose}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
export default ClipboardCopy
