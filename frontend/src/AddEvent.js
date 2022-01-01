import React, { useState } from "react";
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const dateFormat = "YYYY/MM/DD";

const AddEvent = () => {
  const [dateValue, setDateValue] = useState([new DateObject()]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [weekStartDayIndex, setWeekStartDayIndex] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    //value.map((date) => console.log(date.format()));
    console.log(
      JSON.stringify({
        date: dateValue.map((date) => date.format()),
        startTime: startTime.toString(),
        endTime: endTime.toString(),
      })
    );
  };

  const weekStartDayHandler = (event) => {
    setWeekStartDayIndex(parseInt(event.target.value));
  };

  const dateResetHandler = () => {
    setDateValue([]);
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
          <span>Start Time</span>
          <DatePicker
            value={startTime}
            onChange={setStartTime}
            disableDayPicker
            format="HH:mm"
            plugins={[<TimePicker hideSeconds />]}
          />
        </div>
        <div>
          <span>End Time</span>
          <DatePicker
            value={endTime}
            onChange={setEndTime}
            disableDayPicker
            format="HH:mm"
            plugins={[<TimePicker hideSeconds />]}
          />
        </div>

        <p>
          <button type="submit">Submit</button>
        </p>
        <p>
          <button type="button" onClick={dateResetHandler}>
            Reset
          </button>
        </p>
      </form>
    </React.Fragment>
  );
};

export default AddEvent;
