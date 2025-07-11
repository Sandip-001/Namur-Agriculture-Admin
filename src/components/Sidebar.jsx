import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { FaAngleRight, FaClipboardCheck, FaUsers } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { SiCoursera, SiProducthunt } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../App";
import { IoNewspaper, IoNotifications } from "react-icons/io5";
import {
    RiAdminFill,
    RiAdvertisementFill,
    RiHistoryFill,
} from "react-icons/ri";

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const { setAlertBox, windowWidth, setIsOpenNav } = useContext(MyContext);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    };

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
            <div className="sidebar" style={{ background: "#05a415" }}>
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
                                <span className='icon'><RiAdvertisementFill /></span>
                                Ads
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                            <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                <ul className='submenu'>
                                    <li><Link to='/admin-advertisement-list' onClick={handleCloseSidebarOnMobile}>Admin Adds</Link></li>
                                    <li><Link to='/user-advertisement-list' onClick={handleCloseSidebarOnMobile}>User Adds</Link></li>
                                </ul>
                            </div>
                        </li>

                        <li>
                            <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                <span className='icon'><FaUsers /></span>
                                Users
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                            <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                <ul className='submenu'>
                                    <li><Link to='/users' onClick={handleCloseSidebarOnMobile}>All Users</Link></li>
                                    <li><Link to='/FPO-list' onClick={handleCloseSidebarOnMobile}>FPO</Link></li>
                                </ul>
                            </div>
                        </li>

                        <li>
                            <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                <span className='icon'><IoNotifications /></span>
                                Communication
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                            <div className={`submenuWrapper ${activeTab === 3 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                <ul className='submenu'>
                                    <li><Link to='/news-list' onClick={handleCloseSidebarOnMobile}>News</Link></li>
                                    <li><Link to='/create-notification' onClick={handleCloseSidebarOnMobile}>Notification</Link></li>
                                </ul>
                            </div>
                        </li>

                        <li>
                            <Button className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                                <span className='icon'><MdManageAccounts /></span>
                                Management
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                            <div className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                <ul className='submenu'>
                                    <li><Link to='/category-list' onClick={handleCloseSidebarOnMobile}>Category</Link></li>
                                    <li><Link to='/subCategory-list' onClick={handleCloseSidebarOnMobile}>Sub-Category</Link></li>
                                    <li><Link to='/product-list' onClick={handleCloseSidebarOnMobile}>Product</Link></li>
                                    <li><Link to='/subadmin-list' onClick={handleCloseSidebarOnMobile}>Subadmin</Link></li>
                                    <li><Link to='/distActivity' onClick={handleCloseSidebarOnMobile}>District Activity</Link></li>
                                </ul>
                            </div>
                        </li>

                        <li>
                            <Link to='/logs' onClick={handleCloseSidebarOnMobile}>
                                <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                    <span className='icon'><RiHistoryFill /></span>
                                    History
                                </Button>
                            </Link>
                        </li>

                        <li>
                            <Link to='/orders' onClick={handleCloseSidebarOnMobile}>
                                <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                    <span className='icon'><FaClipboardCheck /></span>
                                    Orders
                                </Button>
                            </Link>
                        </li>


                    </ul>
                </>
            </div>
        </>
    );
};

export default Sidebar;
