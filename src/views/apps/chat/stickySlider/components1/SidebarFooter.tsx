import styled from '@emotion/styled';
import React from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Typography } from '@mui/material';

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  collapsed?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ children, collapsed, ...rest }) => {
  return (
    <div className='mb-[10px]'>
      {
        <div className='flex items-center h-50 bg-white p-3 cursor-pointer'>
          <KeyboardBackspaceIcon sx={{ color: (theme: any) => theme.palette.primary.main }} className={`mr-[5px] text-${(theme: any) => theme?.palette?.primary?.main}`} /> {/* Add some spacing between the icon and text */}
          <Typography sx={{ color: (theme: any) => theme.palette.primary.main }} className={`!text-sm !font-semibold`} >
            ProBizCa
          </Typography>
        </div>
      }
    </div>
  );
};
