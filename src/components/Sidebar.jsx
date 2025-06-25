import { Button } from '@mui/material'
import React, { useContext, useState } from 'react'
import { FaAngleRight, FaClipboardCheck, FaUsers } from 'react-icons/fa6'
import { IoMdLogOut } from 'react-icons/io'
import { MdDashboard } from 'react-icons/md'
import { SiCoursera, SiProducthunt } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom'
import { MyContext } from '../App'
import { IoNewspaper } from 'react-icons/io5'
import { RiAdvertisementFill } from "react-icons/ri";

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

    const logout = () => {
        localStorage.clear();
        setAlertBox({
            msg: 'Logout Successfully!',
            open: true,
            error: false
        });
        navigate("/login");
    };

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
                                        <li><Link to='/add-category' onClick={handleCloseSidebarOnMobile}>Add Category</Link></li>
                                        <li><Link to='/category-list' onClick={handleCloseSidebarOnMobile}>CategoryList</Link></li>
                                        <li><Link to='/add-subCategory' onClick={handleCloseSidebarOnMobile}>Add Sub-Category</Link></li>
                                        <li><Link to='/subCategory-list' onClick={handleCloseSidebarOnMobile}>Sub-CategoryList</Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                    <span className='icon'><SiProducthunt /></span>
                                    Product
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                                <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                    <ul className='submenu'>
                                        <li><Link to='/add-product' onClick={handleCloseSidebarOnMobile}>Add Product</Link></li>
                                        <li><Link to='/product-list' onClick={handleCloseSidebarOnMobile}>Product List</Link></li>
                                    </ul>
                                </div>
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
                                <Button className={`w-100 ${activeTab === 5 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                    <span className='icon'><IoNewspaper /></span>
                                    News
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                                <div className={`submenuWrapper ${activeTab === 5 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                    <ul className='submenu'>
                                        <li><Link to='/add-news' onClick={handleCloseSidebarOnMobile}>Add News</Link></li>
                                        <li><Link to='/news-list' onClick={handleCloseSidebarOnMobile}>News List</Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <Button className={`w-100 ${activeTab === 6 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                    <span className='icon'><RiAdvertisementFill /></span>
                                    Advertisement
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                                <div className={`submenuWrapper ${activeTab === 6 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                                    <ul className='submenu'>
                                        <li><Link to='/add-advertisement' onClick={handleCloseSidebarOnMobile}>Add Advertisement</Link></li>
                                        <li><Link to='/advertisement-list' onClick={handleCloseSidebarOnMobile}>Advertisement List</Link></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>

                    </>

                <br />

                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button variant='contained' onClick={logout}><IoMdLogOut /> Logout</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
