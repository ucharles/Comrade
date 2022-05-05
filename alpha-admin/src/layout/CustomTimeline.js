import React, { useState, useEffect, useReducer } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";

import EventModal from "./EventModals";
import "react-calendar-timeline/lib/Timeline.css";
import "./CustomTimeline.css";

const defineKeys = {
  groupIdKey: "_id",
  groupTitleKey: "nickname",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "_id",
  itemTitleKey: "title", // key for item div content
  itemDivTitleKey: "title", // key for item div title (<div title="text"/>)
  itemGroupKey: "creator",
  itemTimeStartKey: "startTime",
  itemTimeEndKey: "endTime",
};

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

const CustomTimeline = (props) => {
  const [eventOpen, setEventOpen] = useState(false);
  const [eventObj, setEventObj] = useState({});
  const eventModalOpen = (obj) => {
    setEventOpen(true);
    setEventObj(obj);
  };
  const eventModalClose = () => setEventOpen(false);

  console.log("Timeline Render");
  console.log(props.groups);
  console.log(props.items);

  return (
    <React.Fragment>
      <Timeline
        keys={defineKeys}
        stackItems
        groups={props.groups}
        items={props.items}
        defaultTimeStart={props.defaultTimeStart}
        defaultTimeEnd={props.defaultTimeEnd}
        minZoom={props.defaultTimeRange}
        maxZoom={props.defaultTimeRange}
        canMove={false}
        canResize={false}
        sidebarWidth={props.isMobile ? window.innerWidth / 5 : 150}
        onItemSelect={(itemId, e, time) => {
          const obj = props.items.find((v) => {
            return v._id === itemId;
          });
          if (obj.creator === 0 || obj.creator === 1) {
            eventModalOpen(obj);
          }
        }}
        onItemClick={(itemId, e, time) => {
          let obj = props.items.find((v) => {
            return v._id === itemId;
          });
          if (obj.creator === 0 || obj.creator === 1) {
            eventModalOpen(obj);
          }
        }}
        onTimeChange={(_start, _end, updateScrollCanvas) => {
          if (
            _start > props.defaultVisableTimeStart &&
            _end < props.defaultVisableTimeEnd
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
      <EventModal open={eventOpen} close={eventModalClose} obj={eventObj} />
    </React.Fragment>
  );
};

export default CustomTimeline;
