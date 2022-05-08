import React, { useState, useEffect, useReducer, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthState, Loading } from "react-admin";
import moment from "moment";
import CustomTimeline from "../../layout/CustomTimeline";

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

let groups = [
  { _id: 0, nickname: "Fixed" },
  { _id: 1, nickname: "Intersection" },
];

let items = [{}];

const ViewDayEvent = (props) => {
  console.log("ViewDayEvent Start");
  const { isLoading, authenticated } = useAuthState();

  const inputDate = useParams().date;
  const calendarId = useParams().cid;
  const [width, setWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    if (!isLoading && authenticated) {
      window.addEventListener("resize", handleWindowSizeChange);
      return () => {
        window.removeEventListener("resize", handleWindowSizeChange);
      };
    }
  }, [isLoading, authenticated]);

  useEffect(() => {
    console.log("Fetch Data");
    const fetchUsersInCalendar = async () => {
      try {
        const response = await axios(
          `${process.env.REACT_APP_BACKEND_URL}/calendar/${calendarId}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          for (let member of response.data.calendar.members) {
            groups.push(member);
          }
        }
      } catch (err) {
        console.log(err);
      }
      console.log("Fetching groups API End");
      console.log(groups);
    };
    fetchUsersInCalendar();

    const fetchEventsInCalendar = async () => {
      try {
        const response = await axios(
          `${process.env.REACT_APP_BACKEND_URL}/events/calendar/${calendarId}/int-day/${inputDate}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          if (response.data.events) {
            for (let event of response.data.events) {
              event.startTime = moment(event.startTime);
              event.endTime = moment(event.endTime);
            }
            items = response.data.events;

            if (response.data.intersection) {
              for (let event of response.data.intersection) {
                event.creator = 1;
                event.startTime = moment(event.startTime);
                event.endTime = moment(event.endTime);
                items.push(event);
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
      console.log("Fetching items API End");
      console.log(items);
      setLoading(false);
    };
    fetchEventsInCalendar();
    console.log(groups);
  }, []);

  const isMobile = width <= 768;
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

  let defaultTimeStart = moment(inputDate)
    .startOf("day")
    .add(isMobile ? 12 : 0, "hour")
    .toDate();
  let defaultTimeEnd = moment(inputDate)
    .startOf("day")
    .add(isMobile ? 19 : 24, "hour")
    .toDate();

  const defaultTimeRange = defaultTimeEnd - defaultTimeStart;
  const defaultVisableTimeStart = moment(inputDate).startOf("day").toDate();
  const defaultVisableTimeEnd = moment(inputDate).add(24, "hour");
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
        <Card>
          <Box sx={{ style: "flex" }}>
            <Counter />
            <Button
              href={`/calendar/${calendarId}/date/${inputDateMonth}`}
              variant="contained">
              Calendar
            </Button>
          </Box>
          <CustomTimeline
            groups={groups}
            items={items}
            defaultTimeStart={defaultTimeStart}
            defaultTimeEnd={defaultTimeEnd}
            defaultTimeRange={defaultTimeRange}
            isMobile={isMobile}
            defaultVisableTimeStart={defaultVisableTimeStart}
            defaultVisableTimeEnd={defaultVisableTimeEnd}
          />
        </Card>
      </React.Fragment>
    );
  }
  return null;
};

export default ViewDayEvent;
