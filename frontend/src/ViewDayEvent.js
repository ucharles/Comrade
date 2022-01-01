import React from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import { useParams } from "react-router-dom";

const groups = [
  { id: 1, title: "Summary" },
  { id: 2, title: "hello" },
  { id: 3, title: "world" },
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
];

const ViewDayEvent = (props) => {
  const inputDate = useParams().date;
  const initDate = moment(inputDate).startOf("day");
  console.log(initDate);
  return (
    <React.Fragment>
      {/* <div>{inputDate}</div> */}
      <div>
        <Timeline
          groups={groups}
          items={items}
          canMove={false}
          canResize={false}
          defaultTimeStart={initDate.toDate()}
          defaultTimeEnd={initDate.add(1, "day").toDate()}
        />
      </div>
    </React.Fragment>
  );
};

export default ViewDayEvent;
