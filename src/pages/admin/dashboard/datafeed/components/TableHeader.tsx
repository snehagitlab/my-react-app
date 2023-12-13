// ** MUI Imports
import { Button, Box  , InputAdornment, InputBase  } from '@mui/material'
import {  IconTableExport } from '@tabler/icons'
import { MouseEventHandler } from 'react'
import addCircle from 'src/assets/Images/adminIcons/add-circle.svg'
import Search from '../../../../../assets/Images/user_Icons/light/search-normal.svg'

//impoert react-router-dom
import { Link } from 'react-router-dom'


interface ITableHeaderProps {
 
  toggleImportStudenttModal: MouseEventHandler<HTMLButtonElement> | undefined,
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

          onClick={props.toggleImportStudenttModal}
        >
         Import Data
        </Button>
        <Link to='/apidata' >
        <Button
          sx={{ mb: 2, p: 3, ml: 2,textTransform: 'capitalize' }}
          variant='outlined'
          startIcon={<IconTableExport color='#2D4ACD' />}
          
        >
         API
        </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default TableHeader
