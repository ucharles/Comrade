import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function AlignItemsList(props) {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 500,
        maxHeight: 250,
        overflow: "auto",
      }}>
      {props.obj.map((user, index) => (
        <ListItem key={user.id}>
          <ListItemAvatar>
            <Avatar alt={user.nickname} src={user.image} />
          </ListItemAvatar>
          <ListItemText primary={user.nickname} />
        </ListItem>
      ))}
    </List>
  );
}
