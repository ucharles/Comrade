import React, { useState, useContext } from "react";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
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

// JSON 형식으로 받을 캘린더들(더미)
let calendars = [
  {
    _id: "61d6cf33bffd707ad9702853",
    name: "Dummy calendar1",
    description: "description1",
    iconSrc: "https://www.1999.co.jp/itbig81/10812608.jpg",
    creator: "Captain1",
  },
  {
    _id: "61d6cf33bffd707ad9702854",
    name: "Dummy calendar2",
    description: "description222222",
    iconSrc: "",
    creator: "Captain2",
  },
];

const MyMenu = (props) => {
  const { isLoading, authenticated } = useAuthState();

  const [open, setOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const logout = useLogout();
  const handleLogout = () => logout();

  //const authCtx = useContext(AuthContext);

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
                calendar.iconSrc ? (
                  <Box sx={{ paddingRight: 1.5 }}>
                    <Avatar
                      sx={{ width: 35, height: 35 }}
                      src={calendar.iconSrc}
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
