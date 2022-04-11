import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Title, useAuthState, Loading } from "react-admin";
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";
import TimePickerPlugin from "react-multi-date-picker/plugins/time_picker";
import {
  Card,
  Grid,
  Button,
  Typography,
  Container,
  Box,
  CssBaseline,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useHttpClient } from "../../shared/hooks/http-hook";

const dateFormat = "YYYY-MM-DD";

const AddEvents = () => {
  const { loading, authenticated } = useAuthState();

  const { sendRequest } = useHttpClient();

  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  // console.log(new Date().toTimeString().slice(9));
  // console.log(new Date().getTimezoneOffset() / -60);

  const [dateValue, setDateValue] = useState([new DateObject()]);
  // 초기값 context화
  const [weekStartDayIndex, setWeekStartDayIndex] = useState(0);

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const navigate = useNavigate();

  const setTimeStep = (time, step) => {
    const modMin = time.minute % step;

    if (modMin < step / 2) {
      time.minute = time.minute - modMin;
    } else {
      time.minute = time.minute + (step - modMin);
    }
    return time;
  };

  const addEventSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/events`,
        "POST",
        JSON.stringify({
          date: dateValue.map((date) => date.format()),
          startTime: startTime.toString(),
          endTime: endTime.toString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezoneOffset: new Date().getTimezoneOffset() / -60,
        }),
        { "Content-Type": "application/json" }
      );
      navigate("/");
    } catch (err) {}
    //value.map((date) => console.log(date.format()));
    // 대충 넘기면 백엔드가 알아서 해주겠지..
  };

  const weekStartDayHandler = (event) => {
    setWeekStartDayIndex(parseInt(event.target.value));
  };

  const dateResetHandler = () => {
    setDateValue([new DateObject()]);
    setStartTime(null);
    setEndTime(null);
  };

  if (loading) {
    return <Loading />;
  }
  if (authenticated) {
    return (
      <React.Fragment>
        <Card sx={{ height: "100%" }}>
          <Title title={process.env.REACT_APP_TITLE} />

          <Container component="main" maxWidth="sm">
            <CssBaseline />

            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
              }}>
              <Typography component="h1" variant="h5">
                Add Event
              </Typography>

              <Box sx={{ mt: 2 }}>
                <InputLabel id="start-day-selector">Start Day</InputLabel>
                <Select
                  id="startDaySelector"
                  onChange={weekStartDayHandler}
                  value={weekStartDayIndex}>
                  <MenuItem value="0">Sun</MenuItem>
                  <MenuItem value="1">Mon</MenuItem>
                  <MenuItem value="2">Tue</MenuItem>
                  <MenuItem value="3">Wed</MenuItem>
                  <MenuItem value="4">Thu</MenuItem>
                  <MenuItem value="5">Fri</MenuItem>
                  <MenuItem value="6">Sat</MenuItem>
                </Select>
              </Box>

              <Box
                component="form"
                onSubmit={addEventSubmitHandler}
                sx={{ mt: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Calendar
                      multiple
                      value={dateValue}
                      onChange={setDateValue}
                      format={dateFormat}
                      sort
                      weekStartDayIndex={weekStartDayIndex}
                      showOtherDays={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={12}>
                        <Typography>Start Time:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <DatePicker
                          value={startTime}
                          onChange={setStartTime}
                          disableDayPicker
                          format="HH:mm"
                          onClose={() => {
                            setStartTime(setTimeStep(startTime, 15));
                          }}
                          plugins={[<TimePickerPlugin hideSeconds />]}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>End Time</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <DatePicker
                          value={endTime}
                          onChange={setEndTime}
                          disableDayPicker
                          format="HH:mm"
                          onClose={() => {
                            setEndTime(setTimeStep(endTime, 15));
                          }}
                          plugins={[<TimePickerPlugin hideSeconds />]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" fullWidth>
                          Submit
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          type="button"
                          fullWidth
                          variant="outlined"
                          onClick={dateResetHandler}
                          sx={{ mb: 2 }}>
                          Reset
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Card>
      </React.Fragment>
    );
  }
  return null;
};

export default AddEvents;
