import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useHttpClient } from "../../shared/hooks/http-hook";
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";
import { Title } from "react-admin";
import { minWidth } from "@mui/system";

const columns = [  {
    field: "date",
    headerName: "Date",
    width : 110
    // valueGetter : (params) =>
    //   `${params.row.events.substr(0,7)}`
  },
  {
    field: "time",
    headerName: "Time",
    flex: 1,
    minWidth:100
  }

  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.events || ""} ${params.row.lastName || ""}`,
  // },
];

// id, date string, created at
// JSON 형식으로 받을 일정들(더미)
let events = [
  {
    _id: "61d6cf33bffd707ad9702853",
    title: "dummy",
    startTime: "2022-01-08 20:00",
    endTime: "2022-01-09 01:15",
    createdAt: "2022-01-05 13:00"
  },
  {
    _id: "61d6cf33bffd707ad9702854",
    title: "dummy2",
    startTime: "2022-01-09 03:00",
    endTime: "2022-01-09 15:00",
    createdAt: "2022-01-05 13:01"
  },
  {
    _id: "61d6cf33bffd707ad9702855",
    title: "dummy3",
    startTime: "2022-01-09 19:30",
    endTime: "2022-01-10 07:00",
    createdAt: "2022-01-05 13:02"
  },
  {
    _id: "61d6cf33bffd707ad9702856",
    title: "dummy4",
    startTime: "2022-02-09 09:30",
    endTime: "2022-02-09 12:00",
    createdAt: "2022-01-05 13:03"
  },
];

let num;
let rows = [];
let resultTime;
let startDate;
let endDate;
let startTime;
let endTime;

for (num = 0; num < events.length; num++){

  startDate = events[num].startTime.substring(0,10);
  endDate = events[num].endTime.substring(0,10);
  startTime = events[num].startTime.substring(11,16);
  endTime = events[num].endTime.substring(11,16);
  
  if(startDate !== endDate){
    endTime = (Number(endTime.substring(0,2)) + 24) + endTime.substring(2,5);
  }

  resultTime = startTime +  " ~ " + endTime;

  rows.push({
    id : events[num]._id, 
    date : startDate,
    time : resultTime
  });

  //console.log(rows);
}


const Editevents = () => {
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  // // console.log(new Date().toTimeString().slice(9));
  // // console.log(new Date().getTimezoneOffset() / -60);

  // const [dateValue, setDateValue] = useState([new DateObject()]);
  // // 초기값 context화
  // const [weekStartDayIndex, setWeekStartDayIndex] = useState(0);

  // const [startTime, setStartTime] = useState();
  // const [endTime, setEndTime] = useState();
  // const navigate = useNavigate();

  // const setTimeStep = (time, step) => {
  //   const modMin = time.minute % step;

  //   if (modMin < step / 2) {
  //     time.minute = time.minute - modMin;
  //   } else {
  //     time.minute = time.minute + (step - modMin);
  //   }
  //   return time;
  // };

  // const addeventsSubmitHandler = async (events) => {
  //   events.preventsDefault();
  //   try {
  //     await sendRequest(
  //       `${process.env.REACT_APP_BACKEND_URL}/events`,
  //       "POST",
  //       JSON.stringify({
  //         date: dateValue.map((date) => date.format()),
  //         startTime: startTime.toString(),
  //         endTime: endTime.toString(),
  //         timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         timezoneOffset: new Date().getTimezoneOffset() / -60,
  //       }),
  //       { "Content-Type": "application/json" }
  //     );
  //     navigate("/");
  //   } catch (err) {}
  // };
  const [selectionModel, setSeletionModel] = React.useState([]);
  const deleteHandler = () => {

    alert('Are you sure you want to delete this event?');
    console.log(selectionModel);

  };

  return (
    <React.Fragment>
      <Card sx={{ height: "100%" }}>
        <Container component="main" maxWidth="lg">
          {/* <CssBaseline /> */}
          <Typography variant="h5" margin={1}>
            Edit events
          </Typography>

          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSeletionModel(newSelectionModel);
              }}
              selectionModel={selectionModel}
              //autoHeight={true}
            />
          </div>
          {/* <Grid item xs={12} sm={6} alignItems="right"> */}
          <Box sx={{
              marginY : 1,
              display : 'flex',
              flexDirection : 'row-reverse'}}>
            <Button
              type="button"
              variant="outlined"
              onClick={deleteHandler}
              //삭제 메시지 알럿 필요
              sx={{ mb: 2 }}
            >
              DELETE
            </Button>
            </Box>
          {/* </Grid> */}
        </Container>
      </Card>
    </React.Fragment>
  );
};

export default Editevents;
