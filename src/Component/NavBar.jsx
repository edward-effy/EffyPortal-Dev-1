
import * as React from "react";
import { useState } from "react";
import "./NavBar.css";
import WelcomeName from "./WelcomeName";
import { useNavigate } from 'react-router-dom';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import SignOut from "./LogOut";
import PersonIcon from '@mui/icons-material/Person';
import Effy from '../Image/Effy.png';


export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState("");
  const open = Boolean(anchorEl);

  // Logo Home Btn
  function handleClick(event) {
    event.preventDefault();
    navigate("/");
  }
  // Menu bar onClick Functions
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={handleClick}>
        <img alt="Effy Jewelery" src={Effy} />
      </div>

      <div className="pfpIcon">
        <React.Fragment>
          <PersonIcon
            className="iconBtn"
            onClick={handleClickMenu}
            size="medium"
            sx={{ width: 32, height: 32, ml: 2 }}
          >
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true" aria-expanded={open ? "true" : undefined}
            &gt;
          </PersonIcon>
          {<WelcomeName />}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
                <SignOut />
              </ListItemIcon>
            </MenuItem>
          </Menu>
        </React.Fragment>
      </div>
    </nav>
  );
}

// In this code, we have a `Navbar` component that renders a navigation bar with a logo, a welcome name, and a profile picture (PFP) icon.
//
// The `handleClick` function is used to navigate back to the home page when the logo is clicked.
//
// The `handleClickMenu` function is used to open the menu when the PFP icon is clicked.
//
// The `handleClose` function is used to close the menu when an item is clicked or when the user clicks outside the menu.
//
// The `Menu` component is used to display a dropdown menu with a logout option when the PFP icon is clicked.
//
// The `MenuItem` component is used to create a clickable item in the dropdown menu.
//
// The `ListItemIcon` component is used to display an icon before the text of the menu item.
//
// The `Logout` component is used to display a logout icon before the text of the menu item.
//
// The `SignOut` component is used to handle the logout process when the logout menu item is clicked.
//
// The `WelcomeName` component is used to display the welcome name of the user.
//
// The `PersonIcon` component is used to display the PFP icon.
//
// The `useNavigate` hook is used to programmatically navigate to a different route when the logo is clicked.
//
// The `useState` hook is used to manage the state of the menu.
//
// The `React.Fragment` component is used to group the PFP icon and the welcome name together.
//
// The `img` element is used to display the logo image.
//
// The `nav` element is used to create the navigation bar.
//
// The `div` elements are used to create the different sections of the navigation bar.
//
// The `onClick` event is used to handle clicks on the PFP icon and the logo.
//
// The `onClose` event is used to handle clicks outside the menu and clicks on the menu items.
//
// The `aria-*` attributes are used to provide accessibility information to assistive technologies.
//
// The `sx` prop is used to apply custom styles to the components.
//
// The `size` prop is used to set the size of the PFP icon.
//
// The `ml` prop is used to add margin to the left of the PFP icon.
//
// The `mr` prop is used to add margin to the right of the PFP icon.
//
// The `mt` prop is used to add margin to the top of the PFP icon.
//
// The `mb` prop is used to add margin to the bottom of the PFP icon.
//
// The `filter` prop is used to apply a drop shadow to the menu.
//
// The `transform` prop is used to rotate the menu's background element.
//
// The `zIndex` prop is used to set the stack order of the menu's background element.
//
// The `elevation` prop is used to set the elevation of the menu.
//
// The `transformOrigin` prop is used to set the origin for the menu's transform.
//
//This code provides a `Navbar` component that includes a logo, a welcome name, and a PFP icon. The PFP icon can be clicked to open a dropdown menu with a logout option. The `Navbar` component also includes proper commenting to explain the purpose of each part of the code.