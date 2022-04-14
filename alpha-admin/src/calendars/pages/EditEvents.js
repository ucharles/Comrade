import React, { useState } from "react";
import { Title, useAuthState, Loading } from "react-admin";
import { Card, Button, Typography, Container, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "date",
    headerName: "Date",
    width: 110,
  },
  {
    field: "time",
    headerName: "Time",
    flex: 1,
    minWidth: 100,
  },
];

// JSON 형식으로 받을 일정들(더미)
let events = [
  {
    _id: "61d6cf33bffd707ad9702853",
    title: "dummy",
    startTime: "2022-01-08 20:00",
    endTime: "2022-01-09 01:15",
    createdAt: "2022-01-05 13:00",
  },
  {
    _id: "61d6cf33bffd707ad9702854",
    title: "dummy2",
    startTime: "2022-01-09 03:00",
    endTime: "2022-01-09 15:00",
    createdAt: "2022-01-05 13:01",
  },
  {
    _id: "61d6cf33bffd707ad9702855",
    title: "dummy3",
    startTime: "2022-01-09 19:30",
    endTime: "2022-01-10 07:00",
    createdAt: "2022-01-05 13:02",
  },
  {
    _id: "61d6cf33bffd707ad9702856",
    title: "dummy4",
    startTime: "2022-02-09 09:30",
    endTime: "2022-02-09 12:00",
    createdAt: "2022-01-05 13:03",
  },
];

let num;
let rows = [];
let resultTime;
let startDate;
let endDate;
let startTime;
let endTime;

for (num = 0; num < events.length; num++) {
  startDate = events[num].startTime.substring(0, 10);
  endDate = events[num].endTime.substring(0, 10);
  startTime = events[num].startTime.substring(11, 16);
  endTime = events[num].endTime.substring(11, 16);

  if (startDate !== endDate) {
    endTime = Number(endTime.substring(0, 2)) + 24 + endTime.substring(2, 5);
  }

  resultTime = startTime + " ~ " + endTime;

  rows.push({
    id: events[num]._id,
    date: startDate,
    time: resultTime,
  });
}

const EditEvents = () => {
  const { isLoading, authenticated } = useAuthState();

  const [selectionModel, setSeletionModel] = useState([]);
  const deleteHandler = () => {
    alert("Are you sure you want to delete this event?");
    console.log(selectionModel);
  };
  if (isLoading) {
    return <Loading />;
  }
  if (authenticated) {
    return (
      <React.Fragment>
        <Card sx={{ height: "100%" }}>
          <Container component="main" maxWidth="lg">
            <Typography variant="h5" margin={1}>
              Edit events
            </Typography>

            <Box style={{ height: 600, width: "100%" }}>
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
              />
            </Box>
            <Box
              sx={{
                marginY: 1,
                display: "flex",
                flexDirection: "row-reverse",
              }}>
              <Button
                type="button"
                variant="outlined"
                onClick={deleteHandler}
                sx={{ mb: 2 }}>
                DELETE
              </Button>
            </Box>
          </Container>
        </Card>
      </React.Fragment>
    );
  }
  return null;
};

export default EditEvents;
