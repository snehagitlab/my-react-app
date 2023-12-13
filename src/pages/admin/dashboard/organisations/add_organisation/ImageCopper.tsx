import React, { useState, useCallback } from "react";
import Slider from "@mui/material/Slider";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import "./ImageCopperHelper.css";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ButtonPressedProps {

  src: any,
  toggle: () => void
}

function ImageCopper(props: ButtonPressedProps) {

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      console.log(croppedArea, croppedAreaPixels);
    },
    []
  );

  return (

    <div>
      <Dialog open={true}
        fullWidth={true}
        maxWidth="sm"
        keepMounted
      >
        <DialogTitle>Crop Logo</DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <div className="crop-container">
            <Cropper
              image={props.src}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="controls">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => setZoom(Number(zoom))}
              classes={{ root: "slider" }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            size='large'
            type='submit'
            sx={{ mr: 2, textTransform: 'capitalize', margin: '20px 0px 0px 10px' }}
            variant='contained'
          >
            Crop
          </Button>
          <Button
            size='large'
            variant='outlined'
            color='secondary'
            sx={{ textTransform: 'capitalize', margin: '20px 0px 0px 10px', alignItems: 'center' }}
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