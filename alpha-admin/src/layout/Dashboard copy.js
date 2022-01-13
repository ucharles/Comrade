import React from "react";
import { Title } from "react-admin";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Box,
  Container,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import Grid from "@mui/material/Grid";
import "./Dashboard.css";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: 10,
    matginTop: 10,
  },
  buttonBox: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  card: {
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

export const Dashboard = () => {
  const classes = useStyles();

  const EVENTS = [
    {
      id: 1,
      title: "event 2",
      start: "2022-01-01T12:30:00Z",
      end: "2022-01-01T14:00:00Z",
      resourceId: 1,
    },
  ];
  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <Card className={classes.card}>
            <Title title={process.env.REACT_APP_TITLE} />
            <CardHeader
              title="Calendar Title"
              subheader={<div>Subtitle</div>}
              action={
                <Box className={classes.buttonBox}>
                  <IconButton
                    className={classes.button}
                    href="#/calendar/edit"
                    variant="contained">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className={classes.button}
                    href="#/calendar/event"
                    variant="contained">
                    <AddIcon />
                  </IconButton>
                </Box>
              }
            />
            <CardContent>
              <FullCalendar
                timeZone="local"
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={EVENTS}
                height={"81vh"}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={2}>
          <Card className={classes.card}>
            <CardHeader
              title="Members (n)"
              action={
                <IconButton sx={{ marginLeft: "auto", mr: 0.5 }}>
                  <AddIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Box sx={{ mb: 2, display: "flex" }}>
                <Avatar sx={{ mr: 2 }}></Avatar>
                <Box>
                  <div>Username</div>
                  <div>Role</div>
                </Box>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Avatar sx={{ mr: 2 }}></Avatar>
                <div>
                  <div>Username</div>
                  <div>Role</div>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
