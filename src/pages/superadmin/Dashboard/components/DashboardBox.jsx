import React, { useState } from 'react'
import { Button } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';



const DashboardBox = (props) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;

  return (
    <Button className='dashboardBox' style={{backgroundImage:`linear-gradient(to right, ${props.color[0]}, ${props.color[1]})`}}>

        {
            props.grow === true ?
            <span className='chart'><TrendingUpIcon/></span>
            :
            <span  className='chart'><TrendingDownIcon/></span>
        }

        <div className='d-flex w-100'>
            <div className='col1'>
                <h4 className='text-white mb-0'>{props.name}</h4>
                <span className='text-white'>{props.length}</span>
            </div>

            <div className='ms-auto'>
                {
                    props.icon ?
                    <span className='icon'>
                        {props.icon}
                    </span>
                    :
                    ''
                }
            </div>
        </div> 

        
        
          
    </Button>
  )
}

export default DashboardBox