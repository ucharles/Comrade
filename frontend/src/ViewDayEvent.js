import React, { useState } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import { useParams } from "react-router-dom";
import "./ViewDayEvent.css";

const groups = [
  { id: 1, title: "Summary" },
  { id: 2, title: "helloooooooooooooooooo" },
  { id: 3, title: "world" },
  { id: 4, title: "world" },
  { id: 5, title: "world" },
  { id: 6, title: "world" },
  { id: 7, title: "world" },
  { id: 8, title: "world" },
  { id: 9, title: "world" },
  { id: 10, title: "world" },
  { id: 11, title: "world" },
  { id: 12, title: "world" },
  { id: 13, title: "world" },
  { id: 14, title: "world" },
  { id: 15, title: "world" },
  { id: 16, title: "world" },
  { id: 17, title: "world" },
  { id: 18, title: "world" },
  { id: 19, title: "world" },
  { id: 20, title: "world" },
  { id: 21, title: "world" },
  { id: 22, title: "world" },
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
  const [sidebarWidth, setSideBarWidth] = useState(0);
  const inputDate = useParams().date;
  const defaultTimeStart = moment(inputDate)
    .startOf("day")
    .add(12, "hour")
    .toDate();
  const defaultTimeEnd = moment(inputDate)
    .startOf("day")
    .add(19, "hour")
    .toDate();
  const defaultTimeRange = defaultTimeEnd - defaultTimeStart;
  const defaultVisableTimeStart = moment(inputDate).startOf("day").toDate();
  const defaultVisableTimeEnd = moment(inputDate).add(24, "hour");

  console.log(defaultTimeStart);

  const sideBarHandler = () => {
    sidebarWidth === 0 ? setSideBarWidth(150) : setSideBarWidth(0);
  };

  return (
    <React.Fragment>
      <div>
        <button type="button" onClick={sideBarHandler}>
          {sidebarWidth === 0 ? "Open Sidebar" : "Close Sidebar"}
        </button>
      </div>
      {/* <div>{inputDate}</div> */}
      <div>
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={defaultTimeStart}
          defaultTimeEnd={defaultTimeEnd}
          minZoom={defaultTimeRange}
          maxZoom={defaultTimeRange}
          canMove={false}
          sidebarWidth={sidebarWidth}
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
                return <div {...getRootProps()}>Name</div>;
              }}
            </SidebarHeader>
            {/* 내용을 가운데에 고정하고 싶음 */}
            <DateHeader
              unit="primaryHeader"
              labelFormat="YYYY/MM/DD dddd"
              headerData={{ isMonth: true }}
            />
            <DateHeader unit="hour" labelFormat="HH:00" />
          </TimelineHeaders>
        </Timeline>
      </div>
    </React.Fragment>
  );
};

export default ViewDayEvent;
