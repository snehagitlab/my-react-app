import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function ImageCopper(){
  
  return (

    <div>
      <Dialog open={true} 
        fullWidth={true}
        maxWidth="sm"
        keepMounted
      >
        <DialogTitle>Add New Organization Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
       
            </DialogContent>
        <DialogActions>
        <Button
                        size='large'
                        type='submit'
                        sx={{ mr: 2, textTransform: 'capitalize', margin:'20px 0px 0px 10px' }}
                        variant='contained'
                      >
                        Submit
                      </Button>
                      <Button
                        size='large'
                        variant='outlined'
                        color='secondary'
                        sx={{ textTransform: 'capitalize', margin:'20px 0px 0px 10px', alignItems:'center' }}
                        onClick={props.toggle}
                       >
                        Cancel
                      </Button>
       
        </DialogActions>
          
      </Dialog>
    </div>
  );
}

export default ImageCopper
