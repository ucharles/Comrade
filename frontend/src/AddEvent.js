import React, { useState } from "react";
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const dateFormat = "YYYY-MM-DD";

const AddEvent = () => {
  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  // console.log(new Date().toTimeString().slice(9));
  // console.log(new Date().getTimezoneOffset() / -60);

  const [dateValue, setDateValue] = useState([new DateObject()]);
  // 초기값 context화
  const [weekStartDayIndex, setWeekStartDayIndex] = useState(0);

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    //value.map((date) => console.log(date.format()));
    // 대충 넘기면 백엔드가 알아서 해주겠지..
    console.log(
      JSON.stringify({
        date: dateValue.map((date) => date.format()),
        startTime: startTime.toString(),
        endTime: endTime.toString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset() / -60,
      })
    );
  };

  const weekStartDayHandler = (event) => {
    setWeekStartDayIndex(parseInt(event.target.value));
  };

  const dateResetHandler = () => {
    setDateValue([new DateObject()]);
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <React.Fragment>
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
      <form onSubmit={handleSubmit}>
        <Calendar
          multiple
          value={dateValue}
          onChange={setDateValue}
          format={dateFormat}
          sort
          weekStartDayIndex={weekStartDayIndex}
          showOtherDays={true}
        />
        <div>
          <label>Start Time</label>
          <DatePicker
            value={startTime}
            onChange={setStartTime}
            disableDayPicker
            format="HH:mm"
            plugins={[<TimePicker hideSeconds />]}
          />
        </div>
        <div>
          <label>End Time</label>
          <DatePicker
            value={endTime}
            onChange={setEndTime}
            disableDayPicker
            format="HH:mm"
            plugins={[<TimePicker hideSeconds />]}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
        <div>
          <button type="button" onClick={dateResetHandler}>
            Reset
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default AddEvent;
