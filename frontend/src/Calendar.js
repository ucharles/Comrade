import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import Button from "./shared/components/FormElements/Button";

const EVENTS = [
  {
    id: 1,
    title: "event 2",
    start: "2022-01-01T12:30:00Z",
    end: "2022-01-01T14:00:00Z",
    resourceId: 1,
  },
  {
    id: 2,
    title: "event 3",
    start: "2021-12-31T13:30:00Z",
    end: "2021-12-31T14:00:00Z",
    resourceId: 1,
  },
  {
    id: 3,
    title: "event 4",
    start: "2021-12-31T13:30:00Z",
    end: "2021-12-31T14:00:00Z",
    resourceId: 1,
  },
  {
    id: 4,
    title: "event 5",
    start: "2021-12-31T13:30:00Z",
    end: "2021-12-31T14:00:00Z",
    resourceId: 1,
  },
  {
    id: 5,
    title: "event 6",
    start: "2021-12-31T15:30:00Z",
    end: "2021-12-31T16:00:00Z",
    resourceId: 1,
  },
  {
    id: 6,
    title: "event 6",
    start: "2022-01-06T15:30:00Z",
    end: "2022-01-06T16:00:00Z",
    resourceId: 1,
  },
  {
    id: 7,
    title: "event 6",
    start: "2022-01-06T15:30:00Z",
    end: "2022-01-06T16:00:00Z",
    resourceId: 1,
  },
  {
    id: 8,
    title: "event 6",
    start: "2022-01-06T15:30:00Z",
    end: "2022-01-06T16:00:00Z",
    resourceId: 1,
  },
  {
    id: 9,
    title: "event 6",
    start: "2022-01-06T15:30:00Z",
    end: "2022-01-06T16:00:00Z",
    resourceId: 1,
  },
];

const MyCalendar = () => {
  console.log(new Date("2021-12-31T12:30:00Z"));
  // Setup the localizer by providing the moment (or globalize) Object
  // to the correct localizer.

  const navigate = useNavigate();
  const [weekStartDayIndex, setWeekStartDayIndex] = useState(0);

  const dateClickHandler = (arg) => {
    let path = arg.dateStr;
    navigate(path);
    // return <AddEvent dateStr={arg.dateStr} />;
  };
  const weekStartDayHandler = (event) => {
    setWeekStartDayIndex(parseInt(event.target.value));
  };

  return (
    <React.Fragment>
      <div className="header">
        <Button to="/new">ADD EVENT</Button>
      </div>
      <div>
        <span>Start Day</span>
        <select
          name="startDaySelector"
          onChange={weekStartDayHandler}
          value={weekStartDayIndex}>
          <option value="0">Sun</option>
          <option value="1">Mon</option>
          <option value="2">Tue</option>
          <option value="3">Wed</option>
          <option value="4">Thu</option>
          <option value="5">Fri</option>
          <option value="6">Sat</option>
        </select>
      </div>
      <div className="calendar">
        <FullCalendar
          timeZone="local"
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={EVENTS}
          dateClick={dateClickHandler}
          firstDay={weekStartDayIndex}
          height="90vh"
        />
      </div>
    </React.Fragment>
  );
};
export default MyCalendar;
