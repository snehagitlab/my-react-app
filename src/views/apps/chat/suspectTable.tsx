// ** React Imports
import { useState, useEffect} from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'


/* interface Column {
  id: 'name' | 'code' | 'population' | 'size' | 'density'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

 const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US')
  }
] */
 



/* function createData(name: string, code: string, population: number, size: number): Data {
  const density = population / size

  return { name, code, population, size, density }
}

const rows = [10]
 */  /*createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340)*/


const SuspectTable = () => {
  // ** States
  
  const[user,setUser]=useState<any>([])
  console.log(user)
  
function createTable()
{
    const res = JSON.parse(localStorage.getItem('victimData') || '{}')
    setUser(res)

    console.log(res)
}

  /* const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
 */
  
  useEffect(() => {
    createTable()
  }, [])
   
  return (
    
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
             
                <TableCell >Suspect</TableCell>
                <TableCell >Occupation</TableCell>
                <TableCell >raes</TableCell>
                <TableCell >phone</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
               
                   {/*  {user && user.map(({a,id}:any) => {
                          return (
                            <>
                             <TableRow key={id} hover role='checkbox' tabIndex={-1}>
                            <MenuItem  >{a.suspect}</MenuItem>
                            <MenuItem >{a.phone}</MenuItem>
                            <MenuItem >{a.raes}</MenuItem>
                            <MenuItem >{a.occupation}</MenuItem>
                            </TableRow>

                            </>
                          )
                        })}   */}  
                        {/*   {user &&  user.map((item: any, id: any) => {
          console.log(item)

          return (
          <>
          <TableRow key={id} hover role='checkbox' tabIndex={-1}>
          <TableCell key={id}>{item.suspect}</TableCell>
          <TableCell key={id}>{item.occupation}</TableCell>
          <TableCell key={id}>{item.raes}</TableCell>
          <TableCell key={id}>{item.phone}</TableCell>
          </TableRow>
          </>)
        })} */}
           </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
   
  )
}

export default SuspectTable
