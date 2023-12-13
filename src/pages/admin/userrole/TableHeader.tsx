// ** MUI Imports
import { Button, Box, InputAdornment, InputBase } from '@mui/material'
import { MouseEventHandler } from 'react'
import Search from 'src/assets/Images/user_Icons/light/search-normal.svg'
import addCircle from 'src/assets/Images/adminIcons/add-circle.svg'

//import search from 'src/assets/Images/adminIcons/searchicon.png'


//IconCirclePlus

interface ITableHeaderProps {
  toggleAddUserAgentModal: MouseEventHandler<HTMLButtonElement> | undefined,
  handlesearchbox:any
}

const TableHeader = (props: ITableHeaderProps) => {
  const { handlesearchbox } = props

  const handleSearch = (e:any) =>
  {
    //console.log(e.target.value)
    handlesearchbox(e.target.value)
  }

  return (
    <Box
      sx={{
        mb: 2,
        pb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <InputBase
        size='small'
        sx={{ p: 3, borderRadius: 2, background: '#F7F7F7 !important',color:'#323A49' }}
        placeholder='Search'
        name="search"
        onChange={(e)=>{handleSearch(e)}}
        startAdornment={
          <InputAdornment sx={{ mr: 3 }} position='start'>
            <img src={Search} alt='search-img' style={{ width: '19px', height: '19px' }} />
          </InputAdornment>
        }
      />
      <Box>
        <Button
          sx={{ mb: 2, p: 3 ,textTransform: 'capitalize'}}
          variant='contained'
          startIcon={<img src={addCircle} alt='adduser-img' height={'21px'} />}
          onClick={props.toggleAddUserAgentModal}
        >
          Add User Role
        </Button>
        
      </Box>
    </Box>
  )
}

export default TableHeader
