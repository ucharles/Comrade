import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Title, useAuthState, Loading } from "react-admin";
import { Cookies } from "react-cookie";

import moment from "moment-timezone";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import momentPlugin from "@fullcalendar/moment";

import Grid from "@mui/material/Grid";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

import { stringAvatar } from "../shared/util/stringToAvatar";
import { AddMemberModal, EditMemberModal } from "./MemberModals";
import { useMediaQuery } from "@mui/material";
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
      width: "auto",
    },
  },
}));

const cookies = new Cookies();

export const Dashboard = () => {
  const { isLoading, authenticated } = useAuthState();
  const [EVENTS, setEvents] = useState([]);
  const [calendar, setCalendar] = useState({});
  const [inviteInfo, setInviteInfo] = useState({});
  const matches = useMediaQuery("(max-width:767px)");

  const classes = useStyles();
  const navigate = useNavigate();
  const inputDate = useParams().date;
  const calendarId = useParams().cid;
  const fullCalendarRef = useRef();
  const timezone = decodeURIComponent(cookies.get("tz"));

  useEffect(() => {
    const fetchCalendarInfo = async () => {
      try {
        const response = await axios(
          `${process.env.REACT_APP_BACKEND_URL}/calendar/${calendarId}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          let calendarInfo = {};
          calendarInfo.name = response.data.calendar.name;
          calendarInfo.description = response.data.calendar.description;
          calendarInfo.members = response.data.calendar.members;
          calendarInfo.memberCount = response.data.calendar.members.length;
          setCalendar(calendarInfo);
          console.log("fetch calendar complete");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCalendarInfo();
  }, [calendarId]);

  useEffect(() => {
    if (!isLoading && authenticated) {
      const calendarApi = fullCalendarRef.current.getApi();
      const changeViewDate = (arg) => {
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
    }
  }, [authenticated, inputDate, isLoading]);

  useEffect(() => {
    console.log("EVENT array:");
    console.log(EVENTS);
    const fetchEventsInFullCalendar = async () => {
      if (!isLoading && authenticated) {
        const calendarApi = fullCalendarRef.current.getApi();

        const start = moment(calendarApi.view.activeStart).format("YYYY-MM-DD");
        const end = moment(calendarApi.view.activeEnd).format("YYYY-MM-DD");
        try {
          const fetchInterMonthRes = await axios(
            `${process.env.REACT_APP_BACKEND_URL}/events/calendar/${calendarId}/int-month/${start}~${end}`,
            {
              withCredentials: true,
            }
          );
          const fetchMonthRes = await axios(
            `${process.env.REACT_APP_BACKEND_URL}/events/calendar/${calendarId}/one-user-month/${start}~${end}`,
            {
              withCredentials: true,
            }
          );

          if (fetchMonthRes.status === 200) {
            if (fetchMonthRes.data.events.length !== 0) {
              for (let event of fetchMonthRes.data.events) {
                event.id = event._id;
                event.start = event.startTime;
                event.end = event.endTime;
                event.resourceId = 1;
                if (matches) {
                  event.title = event.miniTitle;
                }
              }
              console.log("events: ");
              console.log(fetchMonthRes.data.events);
              setEvents([...fetchMonthRes.data.events]);
            }
          }

          if (fetchInterMonthRes.status === 200) {
            if (fetchInterMonthRes.data.events !== undefined) {
              for (let event of fetchInterMonthRes.data.events) {
                event.id = event._id;
                event.start = event.startTime;
                event.end = event.endTime;
                event.resourceId = 0;
                if (matches) {
                  event.title = event.miniTitle;
                }
              }
              console.log("Intersection: ");
              console.log(fetchInterMonthRes.data.events);
              setEvents([
                ...fetchMonthRes.data.events,
                ...fetchInterMonthRes.data.events,
              ]);
            }
          }
        } catch (err) {
          console.log(err);
        }
        console.log("Fetching items API End");
      }
    };
    fetchEventsInFullCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, authenticated, calendarId, inputDate, matches]);

  console.log("Setted EVENTS");
  console.log(EVENTS);

  let path = `/calendar/${calendarId}/date/`;

  const navigateToday = () => {
    const calendarApi = fullCalendarRef.current.getApi();
    calendarApi.today();
    navigate(`/calendar/${calendarId}`);
  };

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

  const fetchInviteLink = async () => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/invite`,
        headers: { "Content-Type": "application/json" },
        method: "POST",
        withCredentials: true,
        data: {
          calendarId,
        },
      });

      if (response.status === 201) {
        setInviteInfo(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 멤버 추가 모달 State
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const addMemberModalOpen = () => {
    setAddMemberOpen(true);
    fetchInviteLink();
  };
  const addMemberModalClose = () => setAddMemberOpen(false);

  // 멤버 관리 모달 State
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const editMemberModalOpen = () => setEditMemberOpen(true);
  const editMemberModalClose = () => setEditMemberOpen(false);

  const dateClickHandler = (arg) => {
    let path = `/calendar/${calendarId}/event/${arg.dateStr}`;
    navigate(path);
  };

  const eventClickHandler = (arg) => {
    let path = `/calendar/${calendarId}/event/${moment(arg.event.start).format(
      "YYYY-MM-DD"
    )}`;
    navigate(path);
  };

  if (isLoading) {
    return <Loading />;
  }
  if (authenticated) {
    console.log("dashboard rendering");
    console.log(calendar);
    return (
      <React.Fragment>
        <Grid container spacing={1} sx={{ width: "auto" }}>
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <Paper className={classes.card}>
              <Title title={process.env.REACT_APP_TITLE} />
              <Box sx={{ display: "flex", mb: 1 }}>
                <Box>
                  <Typography variant="h4" component="h2">
                    {calendar.name}
                  </Typography>
                  <Typography variant="h6" component="h3">
                    {calendar.description}
                  </Typography>
                </Box>
                <Box className={classes.buttonBox}>
                  <IconButton
                    className={classes.button}
                    href={`/calendar/${calendarId}/edit`}
                    variant="contained">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className={classes.button}
                    href={`/calendar/${calendarId}/event`}
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
                    right: "customToday customPrev,customNext",
                  }}
                  customButtons={{
                    customToday: {
                      text: " Today ",
                      click: navigateToday,
                    },
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
                  eventClick={eventClickHandler}
                  plugins={[dayGridPlugin, interactionPlugin, momentPlugin]}
                  events={EVENTS}
                  height="100%"
                  displayEventTime={false}
                />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={2}>
            <Paper className={classes.card}>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ ml: 0.5, mt: 0.4 }}>
                  {`Members (${calendar.memberCount})`}
                </Typography>
                <Box
                  sx={{
                    marginLeft: "auto",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  {/* 멤버 관리 모달 (캘린더 관리자에게만 보일 것)*/}
                  <IconButton onClick={editMemberModalOpen}>
                    <EditIcon />
                  </IconButton>
                  <EditMemberModal
                    open={editMemberOpen}
                    close={editMemberModalClose}
                  />
                  {/* 멤버 추가 모달 */}
                  <IconButton onClick={addMemberModalOpen}>
                    <AddIcon />
                  </IconButton>
                  <AddMemberModal
                    open={addMemberOpen}
                    close={addMemberModalClose}
                    link={`${process.env.REACT_APP_FRONTEND_URL}/join/${inviteInfo.inviteId}`}
                    description={moment
                      .tz(inviteInfo.expire, timezone)
                      .format("YYYY/MM/DD HH:MM")}
                  />
                </Box>
              </Box>
              {calendar.members !== undefined
                ? calendar.members.map((member, index) => (
                    <Box sx={{ display: "flex", mb: 1 }} key={member._id}>
                      {member.image ? (
                        <Box sx={{ mt: 1, mr: 2 }}>
                          <Avatar
                            src={`${process.env.REACT_APP_ASSET_URL}/${member.image}`}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ mt: 1, mr: 2 }}>
                          <Avatar {...stringAvatar(member.nickname, 35, 35)} />
                        </Box>
                      )}
                      <Box>
                        <Typography>{member.nickname}</Typography>
                        <Typography>{member.role}</Typography>
                      </Box>
                    </Box>
                  ))
                : null}
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
  return <React.Fragment></React.Fragment>;
};
