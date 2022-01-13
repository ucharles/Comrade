import React, { useState } from "react";
import { Layout, MenuItemLink } from "react-admin";
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

const menuItems = [
  {
    name: "posts",
    text: "Posts",
  },
  { name: "comments", text: "Comments", icon: <ChatBubbleIcon /> },
  { name: "tags", text: "Tags", icon: <LabelIcon /> },
  { name: "my-profile", text: "My profile", icon: <SettingsIcon /> },
];

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

const MyMenu = ({ onMenuClick, logout }) => {
  const [open, setOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <List
        sx={{ width: "250px" }}
        component="nav"
        // aria-labelledby="nested-list-subheader"
        // subheader={
        //   <ListSubheader component="div" id="nested-list-subheader">
        //     Nested List Items
        //   </ListSubheader>
        // }
      >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component="a"
              href="/#"
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0)}>
              <ListItemIcon>
                <Avatar
                  sx={{ width: 35, height: 35 }}
                  src="https://www.1999.co.jp/itbig81/10812608.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Calendar 1" />
            </ListItemButton>

            <ListItemButton
              component="a"
              href="/#"
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}>
              <ListItemIcon>
                <Avatar {...stringAvatar("Calendar 2", 35, 35)} />
              </ListItemIcon>
              <ListItemText primary="Calendar 2" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
          component="a"
          href="/#/calendar/new"
          onClick={(event) => handleListItemClick(event, null)}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create Calendar" />
        </ListItemButton>

        <Divider />

        <ListItemButton
          component="a"
          href="/#/settings"
          onClick={(event) => handleListItemClick(event, null)}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Account Setting" />
        </ListItemButton>

        <ListItemButton component="a" href="/#/logout" onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>

        {/* {menuItems.map((item) => (
          <MenuItemLink
            key={item.name}
            to={`/${item.name}`}
            primaryText={item.text}
            leftIcon={
              item.icon ? (
                <Avatar>{item.icon}</Avatar>
              ) : (
                <Avatar {...stringAvatar(item.name)} />
              )
            }
            onClick={onMenuClick}
          />
        ))} */}
      </List>
    </div>
  );
};

export default MyMenu;
