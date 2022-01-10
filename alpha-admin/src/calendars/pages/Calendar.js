import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import Button from "./shared/components/FormElements/Button";
import { useHttpClient } from "./shared/hooks/http-hook";

// const EVENTS = [
//   {
//     id: 1,
//     title: "event 2",
//     start: "2022-01-01T12:30:00Z",
//     end: "2022-01-01T14:00:00Z",
//     resourceId: 1,
//   },
// ];

const MyCalendar = () => {
  // Setup the localizer by providing the moment (or globalize) Object
  // to the correct localizer.
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();
  const [weekStartDayIndex, setWeekStartDayIndex] = useState(0);

  useEffect(() => {
    // default is GET method
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/events`
        );
        setEvents(
          responseData.events.map((data) => {
            return {
              id: data.id,
              title: data.title,
              start: data.startTime,
              end: data.endDate,
              resourceId: 1,
            };
          })
        );
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);

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
          events={events}
          dateClick={dateClickHandler}
          firstDay={weekStartDayIndex}
          height="90vh"
        />
      </div>
    </React.Fragment>
  );
};
export default MyCalendar;
