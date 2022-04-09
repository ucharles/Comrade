import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Title } from "react-admin";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import momentPlugin from "@fullcalendar/moment";
import Grid from "@mui/material/Grid";
import "./Dashboard.css";

import { AddMemberModal, EditMemberModal } from "./MemberModals";

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
      width: "auto",
    },
  },
}));

export const Dashboard = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const inputDate = useParams().date;
  const fullCalendarRef = useRef();

  let path = "/calendar/1/date/";

  useEffect(() => {
    const calendarApi = fullCalendarRef.current.getApi();
    const changeViewDate = (arg) => {
      console.log("useEffect: changeViewDate");
      console.log("inputDate: " + inputDate);
      // URL에 날짜가 있는 경우
      if (inputDate) {
        // URL의 날짜로 이동
        let start = moment(inputDate).format("YYYY-MM");
        calendarApi.gotoDate(start);
      }
      // URL에 날짜가 없는 경우
      else {
        // 오늘 날짜로 이동
        calendarApi.today();
      }
    };
    changeViewDate();
  }, [inputDate]);

  const navigatePrevMonth = () => {
    const calendarApi = fullCalendarRef.current.getApi();
    let currentDate = calendarApi.getDate();
    navigate(path + moment(currentDate).add(-1, "months").format("YYYY-MM"));
  };

  const navigateNextMonth = () => {
    const calendarApi = fullCalendarRef.current.getApi();
    let currentDate = calendarApi.getDate();
    navigate(path + moment(currentDate).add(1, "months").format("YYYY-MM"));
  };

  const EVENTS = [
    {
      id: 1,
      title: "event 2",
      start: "2022-01-01T12:30:00Z",
      end: "2022-01-01T14:00:00Z",
      resourceId: 1,
    },
  ];

  // 멤버 추가 모달 State
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const addMemberModalOpen = () => setAddMemberOpen(true);
  const addMemberModalClose = () => setAddMemberOpen(false);

  // 멤버 관리 모달 State
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const editMemberModalOpen = () => setEditMemberOpen(true);
  const editMemberModalClose = () => setEditMemberOpen(false);

  const dateClickHandler = (arg) => {
    let path = `/calendar/1/event/${arg.dateStr}`;
    navigate(path);
    // return <AddEvent dateStr={arg.dateStr} />;
  };

  return (
    <React.Fragment>
      <Grid container spacing={1} sx={{ width: "auto" }}>
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
                  href="#/calendar/1/edit"
                  variant="contained">
                  <EditIcon />
                </IconButton>
                <IconButton
                  className={classes.button}
                  href="#/calendar/1/event"
                  variant="contained">
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ height: "80vh" }}>
              <FullCalendar
                ref={fullCalendarRef}
                initialView="dayGridMonth"
                titleFormat="YYYY/MM"
                headerToolbar={{
                  left: "title",
                  right: "today customPrev,customNext",
                }}
                customButtons={{
                  customPrev: {
                    text: " < Prev ",
                    click: navigatePrevMonth,
                  },
                  customNext: {
                    text: " Next > ",
                    click: navigateNextMonth,
                  },
                }}
                timeZone="local"
                dateClick={dateClickHandler}
                plugins={[dayGridPlugin, interactionPlugin, momentPlugin]}
                events={EVENTS}
                height="100%"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={2}>
          <Paper className={classes.card}>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ ml: 0.5, mt: 0.4 }}>
                  Members (n)
                </Typography>
              </Box>
              <Box
                sx={{
                  marginLeft: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}>
                {/* 멤버 관리 모달 (캘린더 관리자에게만 보일 것)*/}
                <IconButton onClick={editMemberModalOpen}>
                  <EditIcon />
                  <EditMemberModal
                    open={editMemberOpen}
                    close={editMemberModalClose}
                  />
                </IconButton>
                {/* 멤버 추가 모달 */}
                <IconButton onClick={addMemberModalOpen}>
                  <AddIcon />
                  <AddMemberModal
                    open={addMemberOpen}
                    close={addMemberModalClose}
                  />
                </IconButton>
              </Box>
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
