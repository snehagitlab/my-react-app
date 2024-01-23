import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, MenuItemStyles } from './baseComponent';
import { SidebarHeader } from './components1/SidebarHeader';
import { Box } from '@mui/material';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { SidebarFooter } from './components1/SidebarFooter';
import { useTheme } from '@mui/material/styles'
import ChatContext from '../../../../context/ChatProvider';

const StickySlider = () => {
    const { collapsed, toggled, setToggled } = React.useContext<any>(ChatContext)

    const theme = useTheme()

    // type Theme = 'light' | 'dark';

    // const themes = {
    //     light: {
    //         sidebar: {
    //             backgroundColor: '#ffffff',
    //             color: '#607489',
    //         },
    //         menu: {
    //             menuContent: '#fbfcfd',
    //             icon: '#607489',
    //             hover: {
    //                 backgroundColor: 'transparent',
    //                 color: '#44596e',
    //             },
    //             disabled: {
    //                 color: '#9fb6cf',
    //             },
    //         },
    //     },
    //     dark: {
    //         sidebar: {
    //             backgroundColor: '#0b2948',
    //             color: '#8ba1b7',
    //         },
    //         menu: {
    //             menuContent: '#082440',
    //             icon: '#ffffff',
    //             hover: {
    //                 backgroundColor: '#00458b',
    //                 color: '#b6c8d9',
    //             },
    //             disabled: {
    //                 color: '#3e5e7e',
    //             },
    //         },
    //     },
    // };

    // hex to rgba converter
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const [broken, setBroken] = React.useState(true);

    const menuItemStyles: MenuItemStyles = {
        root: {
            fontSize: '16px',
            fontWeight: 500,
        },
        SubMenuExpandIcon: {
            color: '#b6b7b9',
        },
    };

    const menuItemData = [
        { icon: <PermContactCalendarOutlinedIcon sx={{ color: (theme) => theme.palette.primary.main }} />, label: 'Contact', disabled: false },
        { icon: <PersonSearchOutlinedIcon sx={{ color: (theme) => theme.palette.primary.main }} />, label: 'Affiliate', disabled: true },
        { icon: <PersonAddAlt1OutlinedIcon sx={{ color: (theme) => theme.palette.primary.main }} />, label: 'Employee', disabled: true },
        { icon: <ManageAccountsOutlinedIcon sx={{ color: (theme) => theme.palette.primary.main }} />, label: 'Admin', disabled: true },
    ];
    const [activeMenu, setActiveMenu] = useState(1);

    const handleMenuClick = (index: number) => {
        setActiveMenu(index);
    };


    return (
        <>
            {/* bg-${(theme: any) => theme?.palette?.background?.paper}  */}
            <Box sx={{ backgroundColor: (theme) => theme.palette.primary.main + '13' }} className={`flex h-full border border-solid  border-${(theme: any) => theme.palette.divider}`}>
                <Sidebar
                    collapsed={collapsed}
                    toggled={toggled}
                    onBackdropClick={() => setToggled(false)}
                    onBreakPoint={setBroken}
                    breakPoint="md"
                >
                    <Box className="flex flex-col justify-between h-full">
                        <Box>
                            <SidebarHeader className="mb-[40px] mt-[16px]" />
                            <Box className="mb-[32px]">
                                <Menu menuItemStyles={menuItemStyles}>
                                    {/* suffix={<Badge variant="success">New</Badge>} */}
                                    {menuItemData.map((item, index) => (
                                        <MenuItem key={index}
                                            onClick={() => handleMenuClick(index)}
                                            className={`flex flex-col align-middle justify-center`} style={{ opacity: `${activeMenu !== index ? 0.6 : 1}` }}>
                                            <div className={` flex items-center justify-center`}>{item.icon}</div>
                                            <div>{item.label}</div>

                                        </MenuItem >
                                    ))}
                                </Menu >
                            </Box >
                        </Box >
                        <SidebarFooter className="mb-[10px]" />

                    </Box >
                </Sidebar >


            </Box >
        </>
    )
};

export default StickySlider