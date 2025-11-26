import React,{useContext, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.jpeg'
import Button from "@mui/material/Button";
import { MdMenuOpen, MdOutlineLightMode /*MdOutlineMailOutline*/ } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { /*IoCartOutline*/ IoMenu, IoSettingsSharp } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import { Divider } from "@mui/material";
import { MyContext } from "../App";
import UserAvatarImg from "./UserAvatarImg";

const Header = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpennotificationDrop, setIsOpennotificationDrop] = useState(false);

  const myAcc = Boolean(anchorEl);
  const openNotifications = Boolean(isOpennotificationDrop);

  const context = useContext(MyContext);
  const{isToggleSidebar,setIsToggleSidebar, windowWidth, openNav, setAlertBox} = context;

  const navigate = useNavigate();

  const auth = localStorage.getItem("Namur_user");

  const logout = () => {
    localStorage.clear();
    setAlertBox({
      msg:'Logout Successfully!',
      open:true,
      error:false
    });
    navigate("/login");
  };

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

  const handleOpennotificationsDrop = ()=>{
    setIsOpennotificationDrop(true);
  }

  const handleClosenotificationsDrop = ()=>{
    setIsOpennotificationDrop(false);
  }


  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            <div className="col-sm-2 part1">
              <Link to={'/'} className="d-flex align-items-center logo">
                {<img src={logo} alt="logo"/> }
                {<span className="ms-2">NAMUR</span>}
              </Link>
            </div>

            {windowWidth > 992 &&
              <div className="col-sm-3 d-flex align-items-center part2 res-hide">
                <Button className="rounded-circle me-3" onClick={() => setIsToggleSidebar(!isToggleSidebar)}>
                  {
                    isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                  }
                </Button>
                {/*<SearchBox />*/}
              </div>
            }


            <div className="col-sm-7 d-flex align-items-center justify-content-end part3 ms-auto">
              <Button className="rounded-circle me-3" >
                <IoSettingsSharp />
              </Button>

              <div className="dropdownWrapper d-flex justify-content-center align-items-center">
                <Button className="rounded-circle me-3" onClick={handleOpennotificationsDrop}><FaRegBell /></Button>
                {windowWidth <992 && <Button className="rounded-circle me-3 hide" onClick={()=>openNav()}><IoMenu/></Button> }
                <Menu
                  anchorEl={isOpennotificationDrop}
                  id="notifications"
                  className="notifications  dropdown_list"
                  open={openNotifications}
                  onClose={handleClosenotificationsDrop}
                  onClick={handleClosenotificationsDrop}

                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <div className='head ps-3 pb-0'>
                    <h4>Orders (12) </h4>
                  </div>

                  <Divider className="mb-1" />

                  <div className="scroll">
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex align-items-center">
                      <div>
                        <UserAvatarImg img={'https://mironcoder-hotash.netlify.app/images/avatar/01.webp'}/>
                      </div>

                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>
                            added to his favourite list 
                            <b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="userImg">
                          <span className="rounded-circle">
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt='profile-icon' />
                          </span>
                        </div>
                      </div>

                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>
                            added to his favourite list 
                            <b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="userImg">
                          <span className="rounded-circle">
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt='profile-icon' />
                          </span>
                        </div>
                      </div>

                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>
                            added to his favourite list 
                            <b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="userImg">
                          <span className="rounded-circle">
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt='profile-icon' />
                          </span>
                        </div>
                      </div>

                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>
                            added to his favourite list 
                            <b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="userImg">
                          <span className="rounded-circle">
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt='profile-icon' />
                          </span>
                        </div>
                      </div>

                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>
                            added to his favourite list 
                            <b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="userImg">
                          <span className="rounded-circle">
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt='profile-icon' />
                          </span>
                        </div>
                      </div>

                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>
                            added to his favourite list 
                            <b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  </div>

                  <div className="ps-3 pe-3 w-100 pt-2 pb-1">
                    <Button className="btn-blue w-100">View all notifications</Button>
                  </div>

                </Menu>
              </div>

              {
                !auth ?
                  <Link to={'/login'}><Button className="btn-blue btn-lg btn-round">Sign In</Button></Link>
                  :
                  <div className="myAccWrapper">
                    <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                      <div className="userImg">
                        <span className="rounded-circle">
                          {JSON.parse(auth)?.name.charAt(0)}
                        </span>
                      </div>

                      <div className="userInfo res-hide">
                        <h4>{JSON.parse(auth)?.name}</h4>
                        <p className="mb-0" style={{textTransform: 'lowercase'}}>{JSON.parse(auth)?.email }</p>
                      </div>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={myAcc}
                      onClose={handleOpenMyAccDrop}
                      onClick={handleCloseMyAccDrop}

                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={logout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
              }

              
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
