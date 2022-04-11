import React, { useState, useContext } from "react";
import {
  useLogout,
  Menu,
  MenuItemLink,
  useAuthState,
  Loading,
} from "react-admin";

import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import BookIcon from "@mui/icons-material/Book";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import LabelIcon from "@mui/icons-material/Label";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Avatar from "@mui/material/Avatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
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
    name: "dummy calendar1",
    description: "description1",
    iconSrc: "https://www.1999.co.jp/itbig81/10812608.jpg",
    creator: "Captain1",
    timestamps: "2022-01-05 13:00",
  },
  {
    _id: "61d6cf33bffd707ad9702854",
    name: "dummy calendar2",
    description: "description222222",
    iconSrc: "",
    creator: "Captain2",
    timestamps: "2022-01-06 13:00",
  },
];

const MyMenu = (props) => {
  const { loading, authenticated } = useAuthState();

  const [open, setOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleClick = () => {
    setOpen(!open);
  };
  const logout = useLogout();
  const handleLogout = () => logout();

  if (loading) {
    return <Loading />;
  }
  if (authenticated) {
    return (
      <div>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Menu {...props}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {calendars.map((calendar, index) => (
              <MenuItemLink
                key={calendar._id}
                // 캘린더별 URL설정 필요
                to="/"
                selected={selectedIndex === index}
                primaryText={calendar.name}
                leftIcon={
                  calendar.iconSrc ? (
                    <Avatar
                      sx={{ width: 35, height: 35 }}
                      src={calendar.iconSrc}
                    />
                  ) : (
                    <Avatar {...stringAvatar(calendar.name, 35, 35)} />
                  )
                }
              />
            ))}
          </Collapse>
          <MenuItemLink
            to="/calendar/settings"
            primaryText="Edit Calendars"
            leftIcon={<EditIcon />}
          />
          <MenuItemLink
            to="/calendar/new"
            primaryText="Create Calendars"
            leftIcon={<AddIcon />}
          />
          <Divider variant="middle" />
          <MenuItemLink
            to="/settings"
            primaryText="Account Setting"
            leftIcon={<SettingsIcon />}
          />
          <MenuItemLink
            to=""
            primaryText="Logout"
            leftIcon={<LogoutIcon />}
            onClick={handleLogout}
          />
        </Menu>
      </div>
    );
  }
  return null;
};

export default MyMenu;
