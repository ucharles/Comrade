import * as React from "react";
import { Title } from "react-admin";
import { Card, CardContent, CardHeader, Avatar, Box } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import Grid from "@mui/material/Grid";
import "./Dashboard.css";

export const Dashboard = () => {
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
        <Grid item xs={10}>
          <Card sx={{ height: "100%" }}>
            <Title title={process.env.REACT_APP_TITLE} />
            <CardHeader
              title="Calendar Title"
              subheader={<div>Subtitle</div>}
              action={
                <div>
                  <Button sx={{ marginLeft: "auto", m: 1 }} variant="contained">
                    Add Event
                  </Button>
                  <Button sx={{ marginLeft: "auto", m: 1 }} variant="contained">
                    Edit event
                  </Button>
                </div>
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
        <Grid item xs={2}>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title="Members (n)"
              action={
                <IconButton sx={{ marginLeft: "auto", mr: 0.5 }}>
                  <AddIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Box>
                <Grid container>
                  <Grid item xs={3}>
                    <Avatar></Avatar>
                  </Grid>
                  <Grid item xs={9}>
                    helloworld
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
