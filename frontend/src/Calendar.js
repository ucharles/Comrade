import React from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import Button from "./shared/components/FormElements/Button";

const EVENTS = [
  {
    title: "event 1",
    start: "2021-12-31T12:30:00Z",
    end: "2021-12-31T14:00:00Z",
  },
  {
    title: "event 2",
    start: "2022-01-01T12:30:00Z",
    end: "2022-01-01T14:00:00Z",
  },
  {
    title: "event 3",
    start: "2021-12-31T13:30:00Z",
    end: "2021-12-31T14:00:00Z",
  },
  {
    title: "event 4",
    start: "2021-12-31T13:30:00Z",
    end: "2021-12-31T14:00:00Z",
  },
  {
    title: "event 5",
    start: "2021-12-31T13:30:00Z",
    end: "2021-12-31T14:00:00Z",
  },
  {
    title: "event 6",
    start: "2021-12-31T15:30:00Z",
    end: "2021-12-31T16:00:00Z",
  },
  {
    title: "event 6",
    start: "2022-01-06T15:30:00Z",
    end: "2022-01-06T16:00:00Z",
  },
  {
    title: "event 6",
    start: "2022-01-06T15:30:00Z",
    end: "2022-01-06T16:00:00Z",
  },
  {
    title: "event 6",
    start: "2022-01-06T15:30:00Z",
    end: "2022-01-06T16:00:00Z",
  },
  {
    title: "event 6",
    start: "2022-01-06T15:30:00Z",
    end: "2022-01-06T16:00:00Z",
  },
];

const Calendar = () => {
  const navigate = useNavigate();

  const dateClickHandler = (arg) => {
    let path = arg.dateStr;
    navigate(path);
    // return <AddEvent dateStr={arg.dateStr} />;
  };

  return (
    <React.Fragment>
      <div className="header">
        <Button to="/new">ADD EVENT</Button>
      </div>
      <div className="calendar">
        <FullCalendar
          timeZone="local"
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={EVENTS}
          dateClick={dateClickHandler}
          height="90vh"
        />
      </div>
    </React.Fragment>
  );
};
export default Calendar;
