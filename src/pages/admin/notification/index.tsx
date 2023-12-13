   import { Grid, Typography } from '@mui/material'

const notification = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography>Work In Progress</Typography>
      </Grid>
    </Grid>
  )
}
export default notification  

/* import React from "react";


const checkboxes = [
  { id: 1, text: "Checkbox 1" },
  { id: 2, text: "Checkbox 1" },
  { id: 3, text: "Checkbox 1" }
];

class Notification extends React.Component {
  state = {
    selectedCheckboxes: []
  };

 const onChange = (id:any) => {
    const selectedCheckboxes = this.state.selectedCheckboxes;

    // Find index
    const findIdx = selectedCheckboxes.indexOf(id);

    // Index > -1 means that the item exists and that the checkbox is checked
    // and in that case we want to remove it from the array and uncheck it
    if (findIdx > -1) {
      selectedCheckboxes.splice(findIdx, 1);
    } else {
      selectedCheckboxes.push(id);
    }

    this.setState({
      selectedCheckboxes: selectedCheckboxes
    });
  };
  render() {
    const { selectedCheckboxes } = this.state;
    return (
      <div className="App">
        {checkboxes.map(checkbox => (
          <label key={checkbox.id}>
            {checkbox.text}
            <input
              type="checkbox"
              onChange={() => this.onChange(checkbox.id)}
              selected={selectedCheckboxes.includes(checkbox.id)}
            />
          </label>
        ))}
        <p>Selected checkboxes: {JSON.stringify(selectedCheckboxes)}</p>
      </div>
    );
  }
}


export default Notification; */


/*import React ,{ useReactMediaRecorder } from "react-media-recorder"

 import { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ListSubheader,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; */

/* const containsText = (text:any, searchText:any) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const allOptions = ["Option One", "Option Two", "Option Three", "Option Four"];


const Notification = () => {

  const{status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({screen:true})
  
 /*  const [selectedOption, setSelectedOption] = useState(allOptions[0]);

  const [searchText, setSearchText] = useState("");
  const displayedOptions = useMemo(
    () => allOptions.filter((option) => containsText(option, searchText)),
    [searchText]
  ); 

return(

   <>
        <div>
          <p>{status}</p>
          <button onClick={startRecording}>Start Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
          <video src={mediaBlobUrl} controls autoPlay loop />
        </div>

{/* <Box sx={{ m: 10 }}>
<FormControl fullWidth>
  <InputLabel id="search-select-label">Options</InputLabel>
  <Select

    // Disables auto focus on MenuItems and allows TextField to be in focus

    MenuProps={{ autoFocus: false }}
    labelId="search-select-label"
    id="search-select"
    value={selectedOption}
    label="Options"
    onChange={(e) => setSelectedOption(e.target.value)}
    onClose={() => setSearchText("")}

    // This prevents rendering empty string in Select's value
    // if search text would exclude currently selected option.

    renderValue={() => selectedOption}
  >

    {/* TextField is put into ListSubheader so that it doesn't
        act as a selectable item in the menu
        i.e. we can click the TextField without triggering any selection.

    <ListSubheader>
      <TextField
        size="small"

        // Autofocus on textfield

        autoFocus
        placeholder="Type to search..."
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Escape") {

            // Prevents autoselecting item while typing (default Select behaviour)

            e.stopPropagation();
          }
        }}
      />
    </ListSubheader>
    {displayedOptions.map((option:any, i:any) => (
      <MenuItem key={i} value={option}>
        {option}
      </MenuItem>
    ))}
  </Select>
</FormControl>
</Box>
</>
    
  )
}
export default Notification  */