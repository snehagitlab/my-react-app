// ** MUI Imports
import { Button, Box, InputAdornment, InputBase } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import Search from '../../../../../assets/Images/user_Icons/light/search-normal.svg'

// import images
//import search from 'src/assets/Images/adminIcons/searchicon.png'

interface TableHeaderProps {
  toggle: () => void
 
   handesearchbox: any

}

const TemplateHeader = (props: TableHeaderProps) => {
  // ** Props
  const { toggle  , handesearchbox  } = props
   const handleSearch = (e: any) => {
    handesearchbox(e.target.value)
  } 

  return (
    <Box
      sx={{
        mb: 2,
        pb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <InputBase
        size='small'
        sx={{ p: 3, borderRadius: '9px', background: '#F7F7F7 !important', color: '#323A49' }}
        placeholder='Search'
        name='search'
        onChange={e => {
          handleSearch(e)
        }} 
        
        startAdornment={
          <InputAdornment sx={{ mr: 2 }} position='start'>
            <img src={Search} alt='search-img' style={{ width: '19px', height: '19px' }} />
          </InputAdornment>
        }
      />
      <Button
        sx={{ p: 3, textTransform: 'capitalize' }}
        onClick={toggle}
        variant='contained'
        startIcon={<IconCirclePlus color='white' />}
      >
       Add Template
      </Button>
    </Box>
  )
}

export default TemplateHeader
