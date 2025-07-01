import { Button } from '@mui/material'
import React, { useContext, useState } from 'react'
import { FaAngleRight, FaClipboardCheck, FaUsers } from 'react-icons/fa6'
import { IoMdLogOut } from 'react-icons/io'
import { MdDashboard } from 'react-icons/md'
import { SiCoursera, SiProducthunt } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom'
import { MyContext } from '../App'
import { IoNewspaper, IoNotifications } from 'react-icons/io5'
import { RiAdminFill, RiAdvertisementFill, RiHistoryFill } from "react-icons/ri";

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const { setAlertBox, windowWidth, setIsOpenNav } = useContext(MyContext)

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu)
    }

    const handleCloseSidebarOnMobile = () => {
        if (windowWidth < 992) {
            setIsOpenNav(false);
        }
    };

    const navigate = useNavigate();

    /*const logout = () => {
        localStorage.clear();
        setAlertBox({
            msg: 'Logout Successfully!',
            open: true,
            error: false
        });
        navigate("/login");
    };*/

    //const role = localStorage.getItem("role");

    return (
        <>
            <div className='sidebar' style={{background: "#05a415"}}>

                    <>
                        <ul>
                            <li>
                                <Link to='/' onClick={handleCloseSidebarOnMobile}>
                                    <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                        <span className='icon'><MdDashboard /></span>
                                        Dashboard
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                                    <span className='icon'><SiCoursera /></span>
                                    Category & Sub-Category
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                                <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                    <ul className='submenu'>
                                        <li><Link to='/category-list' onClick={handleCloseSidebarOnMobile}>CategoryList</Link></li>
                                        <li><Link to='/subCategory-list' onClick={handleCloseSidebarOnMobile}>Sub-CategoryList</Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <Link to='/product-list' onClick={handleCloseSidebarOnMobile}>
                                    <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                        <span className='icon'><SiProducthunt /></span>
                                        Product
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link to='/orders' onClick={handleCloseSidebarOnMobile}>
                                    <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                        <span className='icon'><FaClipboardCheck /></span>
                                        Orders
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link to='/users' onClick={handleCloseSidebarOnMobile}>
                                    <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                                        <span className='icon'><FaUsers /></span>
                                        Users
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link to='/news-list' onClick={handleCloseSidebarOnMobile}>
                                    <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                        <span className='icon'><IoNewspaper /></span>
                                        News
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Button className={`w-100 ${activeTab === 6 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                    <span className='icon'><RiAdvertisementFill /></span>
                                    Advertisement
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                                <div className={`submenuWrapper ${activeTab === 6 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                    <ul className='submenu'>
                                        <li><Link to='/admin-advertisement-list' onClick={handleCloseSidebarOnMobile}>Adds By Admin</Link></li>
                                        <li><Link to='/user-advertisement-list' onClick={handleCloseSidebarOnMobile}>Adds By User</Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <Link to='/subadmin-list' onClick={handleCloseSidebarOnMobile}>
                                    <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
                                        <span className='icon'><RiAdminFill /></span>
                                        SubAdmin
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link to='/create-notification' onClick={handleCloseSidebarOnMobile}>
                                    <Button className={`w-100 ${activeTab === 8 ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
                                        <span className='icon'><IoNotifications /></span>
                                        Notification
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Button className={`w-100 ${activeTab === 9 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(9)}>
                                    <span className='icon'><RiHistoryFill /></span>
                                    History
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                                <div className={`submenuWrapper ${activeTab === 9 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                    <ul className='submenu'>
                                        <li><Link to='/ads-logs' onClick={handleCloseSidebarOnMobile}>Adds Logs</Link></li>
                                        <li><Link to='/news-logs' onClick={handleCloseSidebarOnMobile}>News Logs</Link></li>
                                        <li><Link to='/notification-logs' onClick={handleCloseSidebarOnMobile}>Notification Logs</Link></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>

                    </>

            </div>
        </>
    )
}

export default Sidebar
