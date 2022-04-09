import moment from "moment";
import React, { useState, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import EventModal from "../../layout/EventModals";
import "react-calendar-timeline/lib/Timeline.css";
import "./ViewDayEvent.css";

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

const groups = [
  { id: 1, title: "Summary" },
  { id: 2, title: "helloooooooooooooooooo" },
  { id: 3, title: "world" },
  { id: 4, title: "world" },
  { id: 5, title: "world" },
  { id: 6, title: "world" },
];

const items = [
  {
    id: 1,
    group: 1,
    title: "3",
    start_time: moment("2021-12-31T12:30:00Z"),
    end_time: moment("2021-12-31T14:00:00Z"),
  },
  {
    id: 2,
    group: 2,
    title: "2",
    start_time: moment().add(-0.5, "hour"),
    end_time: moment().add(0.5, "hour"),
  },
  {
    id: 3,
    group: 1,
    title: "1",
    start_time: moment().add(2, "hour"),
    end_time: moment().add(3, "hour"),
  },
  {
    id: 4,
    group: 1,
    title: "3",
    start_time: moment().add(2, "hour"),
    end_time: moment().add(4, "hour"),
  },
];

const ViewDayEvent = (props) => {
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  const isMobile = width <= 768;
  const navigate = useNavigate();

  // const [sidebarWidth, setSideBarWidth] = useState(0);
  const inputDate = useParams().date;
  let path = `/calendar/event/`;

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
  const [eventOpen, setEventOpen] = useState(false);
  const [eventObj, setEventObj] = useState({});
  const eventModalOpen = (obj) => {
    setEventOpen(true);
    setEventObj(obj);
  };
  const eventModalClose = () => setEventOpen(false);

  // const sideBarHandler = () => {
  //   sidebarWidth === 0 ? setSideBarWidth(150) : setSideBarWidth(0);
  // };

  const intervalRenderer = ({ intervalContext, getIntervalProps, data }) => {
    return (
      <div
        {...getIntervalProps()}
        className={`rct-dateHeader ${
          data.isMonth ? "rct-dateHeader-primary" : ""
        }`}
        onClick={() => {
          return false;
        }}>
        <span
          style={{
            position: data.isMonth ? "sticky" : "static",

            left: "0",
            right: "0",
            padding: "0 6rem",

            // padding: "0 1rem",
          }}>
          {intervalContext.intervalText}
        </span>
      </div>
    );
  };

  return (
    <React.Fragment>
      {/* <div className="float-button">
        <button type="button" onClick={sideBarHandler}>
          {sidebarWidth === 0 ? "Open" : "Close"}
        </button>
      </div> */}
      {/* <div>{inputDate}</div> */}
      <Card>
        <Box sx={{ style: "flex" }}>
          <Counter />
          <Button href="/calendar/1" variant="contained">
            Calendar
          </Button>
        </Box>
        <Timeline
          stackItems
          groups={groups}
          items={items}
          defaultTimeStart={defaultTimeStart}
          defaultTimeEnd={defaultTimeEnd}
          minZoom={defaultTimeRange}
          maxZoom={defaultTimeRange}
          canMove={false}
          canResize={false}
          sidebarWidth={isMobile ? window.innerWidth / 5 : 150}
          onItemSelect={(itemId, e, time) => {
            const obj = items.find((v) => {
              return v.id === itemId;
            });
            if (obj.group === 1) {
              eventModalOpen(obj);
            }
          }}
          onItemClick={(itemId, e, time) => {
            let obj = items.find((v) => {
              return v.id === itemId;
            });
            if (obj.group === 1) {
              eventModalOpen(obj);
            }
          }}
          onTimeChange={(_start, _end, updateScrollCanvas) => {
            if (
              _start > defaultVisableTimeStart &&
              _end < defaultVisableTimeEnd
            )
              updateScrollCanvas(_start, _end);
          }}>
          <TimelineHeaders className="sticky">
            <SidebarHeader>
              {({ getRootProps }) => {
                return <div {...getRootProps()}></div>;
              }}
            </SidebarHeader>
            {/* 내용을 가운데에 고정하고 싶음 */}
            <DateHeader
              unit="primaryHeader"
              headerData={{ isMonth: true }}
              labelFormat="YYYY/MM/DD ddd"
              intervalRenderer={intervalRenderer}
            />
            <DateHeader unit="hour" labelFormat="HH" />
          </TimelineHeaders>
        </Timeline>
      </Card>
      <EventModal open={eventOpen} close={eventModalClose} obj={eventObj} />
    </React.Fragment>
  );
};

export default ViewDayEvent;
