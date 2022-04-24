import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  useLogout,
  Menu,
  MenuItemLink,
  useAuthState,
  Loading,
} from "react-admin";
import axios from "axios";

//import AuthContext from "../shared/util/auth-context";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name, width, height) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width,
      height,
    },
    children: `${name[0][0].toUpperCase()}`,
  };
}

const MyMenu = (props) => {
  const { isLoading, authenticated } = useAuthState();
  const [calendars, setCalendars] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const fetchCalendars = async () => {
    try {
      const response = await axios(
        `${process.env.REACT_APP_BACKEND_URL}/calendar/`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setCalendars(response.data.calendars);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  const logout = useLogout();
  const handleLogout = () => logout();

  if (isLoading) {
    return <Loading />;
  }
  if (authenticated) {
    return (
      <div>
        <Menu {...props}>
          {calendars.map((calendar, index) => (
            <MenuItemLink
              sx={{ height: 50, paddingLeft: 1.3 }}
              key={calendar._id}
              to={`/calendar/${calendar._id}`}
              selected={selectedIndex === index}
              primaryText={calendar.name}
              leftIcon={
                calendar.image ? (
                  <Box sx={{ paddingRight: 1.5 }}>
                    <Avatar
                      sx={{ width: 35, height: 35 }}
                      src={`${process.env.REACT_APP_ASSET_URL}/${calendar.image}`}
                    />
                  </Box>
                ) : (
                  <Box sx={{ paddingRight: 1.5 }}>
                    <Avatar {...stringAvatar(calendar.name, 35, 35)} />
                  </Box>
                )
              }
            />
          ))}
          <MenuItemLink
            sx={{ height: 50 }}
            to="/calendar/settings"
            primaryText="Edit Calendars"
            leftIcon={<EditIcon />}
          />
          <MenuItemLink
            sx={{ height: 50 }}
            to="/calendar/new"
            primaryText="Create Calendar"
            leftIcon={<AddIcon />}
          />
          <Divider variant="middle" />
          <MenuItemLink
            sx={{ height: 50 }}
            to="/settings"
            primaryText="Account Setting"
            leftIcon={<SettingsIcon />}
          />
          <MenuItemLink
            sx={{ height: 50 }}
            to="/logout"
            primaryText="Logout"
            leftIcon={<LogoutIcon />}
            onClick={handleLogout}
          />
        </Menu>
      </div>
    );
  }
  return <React.Fragment></React.Fragment>;
};

export default MyMenu;
