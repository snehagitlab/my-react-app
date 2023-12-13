import React, { useContext } from 'react'
import { Box } from '@mui/material'
import TicketContext from 'src/context/TicketProvider'

function GragOver() {
   const {
      drop,
      setDrop,
      setFilterData,
      filterData,
      setImagePath,
      imgPath
   } = useContext<any>(TicketContext)


   const handleDragggg = () => {
      setDrop(false)

   }

   const handleDrag = (e: any) => {
      setFilterData(Array.from(e.target.files))
      setFilterData([...filterData, ...e.target.files])

      const base64Img: any = []
      for (const file of e.target.files) {
         const reader = new FileReader()
         reader.onload = function (e: any) {
            base64Img.push(e.target.result)
         }
         reader.readAsDataURL(file)
      }
      setTimeout(() => {
         setImagePath([...imgPath, ...base64Img])
      }, 1000)


      setDrop(false)
   }

   return (
      <>
         {drop && (
            <Box className='dragndropdiv'>
               <input type='file' multiple className='dragndropInput' onChange={handleDrag} onDragLeave={handleDragggg} />
               <Box className='inputBoxdrag'>
                  <h2>Drop Files</h2>
               </Box>
            </Box>
         )}
      </>
   )
}

export default GragOver