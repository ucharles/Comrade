import React, { useState, useEffect, useReducer, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthState, Loading, Title } from "react-admin";
import moment from "moment";

import EventModal from "../../layout/EventModals";

import {
  Avatar,
  Box,
  Paper,
  Typography,
  Card,
  Button,
  Modal,
  Popper,
} from "@mui/material";
import axios from "axios";

// user 정보
// 이벤트 정보, 교집합 정보

const ViewDayEvent = (props) => {
  console.log("ViewDayEvent Start");
  const { isLoading, authenticated } = useAuthState();

  const inputDate = useParams().date;
  const calendarId = useParams().cid;
  const [width, setWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState({});
  const [inters, setInters] = useState({});
  const [eventOpen, setEventOpen] = useState(false);
  const [eventObj, setEventObj] = useState({});

  const eventModalOpen = (obj) => {
    setEventOpen(true);
    setEventObj(obj);
  };
  const eventModalClose = () => setEventOpen(false);

  useEffect(() => {
    console.log("Fetch Data");
    const fetchEventsInCalendar = async () => {
      try {
        const response = await axios(
          `${process.env.REACT_APP_BACKEND_URL}/events/calendar/${calendarId}/int-day/${inputDate}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setEvents(response.data.events);
          setInters(response.data.intersection);
          console.log(events);
        }
      } catch (err) {
        console.log(err);
      }
      console.log("Fetching items API End");
      setLoading(false);
    };
    fetchEventsInCalendar();
  }, []);

  const navigate = useNavigate();

  // const [sidebarWidth, setSideBarWidth] = useState(0);

  let path = `/calendar/${calendarId}/event/`;
  const inputDateMonth = moment(inputDate).format("YYYY-MM");

  function reducer(state, action) {
    switch (action.type) {
      case "prev":
        navigate(path + moment(state).add(-1, "day").format("YYYY-MM-DD"));
        window.location.reload(false);
        return 0;
      case "next":
        navigate(path + moment(state).add(1, "day").format("YYYY-MM-DD"));
        window.location.reload(false);
        return 0;
      default:
        throw new Error();
    }
  }
  function Counter() {
    const [state, dispatch] = useReducer(reducer, inputDate);
    return (
      <>
        <Button variant="contained" onClick={() => dispatch({ type: "prev" })}>
          Prev
        </Button>
        <Button variant="contained" onClick={() => dispatch({ type: "next" })}>
          Next
        </Button>
      </>
    );
  }

  // 멤버 추가 모달 State

  // const sideBarHandler = () => {
  //   sidebarWidth === 0 ? setSideBarWidth(150) : setSideBarWidth(0);
  // };

  if (isLoading || loading) {
    return <Loading />;
  }
  if (!isLoading && authenticated && !loading) {
    return (
      <React.Fragment>
        <Title title={process.env.REACT_APP_TITLE} />
        <Card>
          <Box sx={{ style: "flex" }}>
            <Counter />
            <Button
              href={`/calendar/${calendarId}/date/${inputDateMonth}`}
              variant="contained">
              Calendar
            </Button>
          </Box>
          <Box>
            <Typography>Intersections</Typography>
            {inters.map((inter, index) => {
              return (
                <Card sx={{ backgroundColor: "green" }} key={inter._id}>
                  <Typography>{inter.title}</Typography>
                </Card>
              );
            })}
          </Box>
          <Box>
            <Typography>Events</Typography>
            {events.map((event, index) => {
              return (
                <Card key={event._id}>
                  <Typography>
                    {event.nickname}: {event.title}
                  </Typography>
                </Card>
              );
            })}
          </Box>
        </Card>
        <EventModal open={eventOpen} close={eventModalClose} obj={eventObj} />
      </React.Fragment>
    );
  }
  return null;
};

export default ViewDayEvent;
