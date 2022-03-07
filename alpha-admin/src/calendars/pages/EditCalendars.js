import React, { useState } from "react";
import {
  Card,
  Typography,
  Container,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

// JSON 형식으로 받을 캘린더들(더미)
let calendars = [
  {
    _id: "61d6cf33bffd707ad9702853",
    name: "dummy calendar1",
    description: "description1",
    creator: "Captain1",
    timestamps: "2022-01-05 13:00",
  },
  {
    _id: "61d6cf33bffd707ad9702854",
    name: "dummy calendar2",
    description: "description222222",
    creator: "Captain2",
    timestamps: "2022-01-06 13:00",
  },
];

// 유저 아이디 더미
const username = "Captain2";

const isCreator = (calendar) => {
  return calendar.creator === username;
};

const EditCalendars = () => {
  // 탈퇴 -> 탈퇴 완료시 캘린더 삭제된 결과 표시 필요
  const withdrawalHanlder = (event) => {
    alert("in withdrawalHandler");
    console.log(event.target.value);
  };
  // 임명 -> 임명 완료 시, 탈퇴버튼 활성화 표시 필요
  const delegationHandler = (event) => {
    alert("in delegationHanlder");
    console.log(event);
  };
  // 삭제 -> 삭제완료시 캘린더 삭제된 결과 표시 필요
  const deleteHandler = (event) => {
    alert("in deleteHanlder");
    console.log(event.target.value);
  };

  return (
    <React.Fragment>
      <Card sx={{ height: "100%" }}>
        <Container component="main" maxWidth="md">
          <Typography variant="h5" margin={1}>
            Edit calendars
          </Typography>
          <Grid
            sx={{
              border: 1,
              borderColor: "grey.200",
              borderRadius: "10px",
              p: 1,
            }}
          >
            <List>
              {calendars.map((calendar, index) => (
                <React.Fragment key={calendar._id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        {/* 캘린더 아이콘 들어갈 자리 */}
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={calendar.name}
                      secondary={calendar.description}
                    />
                    {/* 캘린더 팀원, 팀장인지에 따라 버튼을 달리 표시 */}
                    {!isCreator(calendar) && (
                      <Button
                        onClick={withdrawalHanlder}
                        value={calendar._id}
                        variant="contained"
                        sx={{ width: 100, fontSize: 12 }}
                      >
                        Withdrawal
                      </Button>
                    )}
                    {isCreator(calendar) && (
                      <React.Fragment>
                        <Button
                          onClick={delegationHandler}
                          value={calendar._id}
                          variant="outlined"
                          sx={{ mr: 1, width: 100, fontSize: 12 }}
                        >
                          Delegation
                        </Button>
                        <Button
                          onClick={deleteHandler}
                          value={calendar._id}
                          variant="contained"
                          sx={{ width: 100, fontSize: 12 }}
                        >
                          Delete
                        </Button>
                      </React.Fragment>
                    )}
                  </ListItem>
                  {!calendars.length === index + 1 && (
                    <Divider sx={{ mx: 2, my: 0.5 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Container>
      </Card>
    </React.Fragment>
  );
};

export default EditCalendars;
