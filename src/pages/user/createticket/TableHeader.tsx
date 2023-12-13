// ** MUI Imports
import { Button, Box} from '@mui/material'
import { MouseEventHandler } from 'react'

interface ITableHeaderProps {
    toggleCreateTicketModal: MouseEventHandler<HTMLButtonElement> | undefined
}

const TableHeader = (props: ITableHeaderProps) => {
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
      
      <Box>
        <Button
          sx={{ mb: 2, p: 3 }}
          variant='contained'
         
          onClick={props.toggleCreateTicketModal}
        >
          Create Ticket
        </Button>
        
      </Box>
    </Box>
  )
}

export default TableHeader
