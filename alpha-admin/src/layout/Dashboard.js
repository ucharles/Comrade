import React from "react";
import { Title } from "react-admin";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Box,
  Container,
  Paper,
  Typography,
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
    marginRight: 5,
    matginTop: 10,
  },
  buttonBox: {
    marginLeft: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  card: {
    padding: 15,
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
      <Grid container spacing={1} sx={{ width: "100%" }}>
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <Paper className={classes.card}>
            <Title title={process.env.REACT_APP_TITLE} />
            <Box sx={{ display: "flex", mb: 1 }}>
              <Box>
                <Typography variant="h4" component="h2">
                  Calendar Title
                </Typography>
                <Typography variant="h6" component="h3">
                  Subtitle
                </Typography>
              </Box>
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
            </Box>
            <Box sx={{ height: "80vh" }}>
              <FullCalendar
                timeZone="local"
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={EVENTS}
                height="100%"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={2}>
          <Paper className={classes.card}>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Typography variant="h6" component="h2" sx={{ ml: 0.5, mt: 0.4 }}>
                Members (n)
              </Typography>

              <IconButton sx={{ marginLeft: "auto", mr: 0.5 }}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ mb: 2, display: "flex" }}>
              <Avatar sx={{ mt: 0.5, mr: 2 }}></Avatar>
              <Box>
                <div>Username</div>
                <div>Role</div>
              </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Avatar sx={{ mt: 0.5, mr: 2 }}></Avatar>
              <div>
                <div>Username</div>
                <div>Role</div>
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};