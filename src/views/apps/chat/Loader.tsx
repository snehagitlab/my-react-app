import React from 'react'

// import CircularProgress from '@mui/material/CircularProgress'

// import Dual_Ball_loader from '../../../assets/Images/user_Icons/light/dual_ball_loader.gif'

function Loader() {
  return (
    <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      {/* <CircularProgress color='inherit' /> */}
      <img src={require('../../../assets/Loader/Dual_Ball_loader.gif')} alt='loading...' />
    </div>
  )
}

export default Loader
