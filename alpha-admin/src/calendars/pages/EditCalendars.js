import React, { useEffect, useState } from "react";
import { Title, useAuthState, Loading, useRedirect } from "react-admin";
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
  Box,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "axios";
import { ConfirmModal, AlertModal } from "../../layout/Modals";
import { ChangeOwnerModal } from "../../layout/MemberModals";

const EditCalendars = () => {
  const { isLoading, authenticated } = useAuthState();
  const [calendars, setCalendars] = useState([]);
  const [memberInCalendarRows, setMemberInCalendarRows] = useState([]); // changeOwner 멤버리스트
  const [selectionModel, setSeletionModel] = useState();
  const [userId, setUserId] = useState();
  const [modalData, setModalData] = useState([]);
  const redirect = useRedirect();

  // ConfirmModal State
  const [confirmModal, setConfirmModalOpen] = useState(false);
  const confirmModalOpen = () => setConfirmModalOpen(true);
  const confirmModalClose = () => setConfirmModalOpen(false);

  // AlertModal State
  const [alertModal, setAlertModalOpen] = useState(false);
  const alertModalOpen = () => setAlertModalOpen(true);
  const alertModalClose = () => {
    setAlertModalOpen(false);
    redirect(`${process.env.REACT_APP_FRONTEND_URL}/calendar/settings`);
  };

  // ChangeOwnerModal State
  const [changeOwnerModal, setChangeOwnerModalOpen] = useState(false);
  const changeOwnerModalOpen = (event) => {
    getMembersInCalendar(event);
    setChangeOwnerModalOpen(true);
  };
  const changeOwnerModalClose = () => setChangeOwnerModalOpen(false);

  const isCreator = (calendar) => {
    return calendar.owner === userId;
  };

  const getCalendars = async () => {
    const response = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/calendar/`,
      {
        withCredentials: true,
      }
    );
    setCalendars(await response.data.calendars);
  };

  const getUser = async () => {
    const response = await axios(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      withCredentials: true,
    });
    setUserId(() => response.data.user._id);
  };

  useEffect(() => {
    getCalendars();
    getUser();
  }, []);

  // confirmModal Open & confirm, alert Modal 데이터 설정.
  const openConfirmModalHandler = (event) => {
    event.preventDefault();
    const value = event.target.value;
    const mode = event.target.name;
    let message;
    let successMessage;
    let action;
    if (mode === "Leave") {
      message = "Are you sure you want to leave this calendar?";
      successMessage = "You leaved";
      action = leaveHandler;
    } else if (mode === "ChangeOwner") {
      message = "Are you sure you want to change the owner?";
      successMessage = "Your changes have been successfully saved";
      action = changeOwnerHandler;
    } else {
      message = "Are you sure you want to delete this calendar?";
      successMessage = "Calendar deleted";
      action = deleteHandler;
    }
    setModalData({
      message: message,
      action: action,
      value: value,
      successMessage: successMessage,
    });
    confirmModalOpen();
  };

  // 탈퇴 -> 탈퇴 완료시 캘린더 삭제된 결과 표시 필요
  const leaveHandler = async (event) => {
    event.preventDefault();
    confirmModalClose();
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/calendar/${event.target.value}/itself`,
        method: "delete",
        withCredentials: true,
      });
      if (response.status === 201) {
        alertModalOpen();
      }
    } catch (error) {
      new Error(error);
    }
  };

  const getMembersInCalendar = async (event) => {
    event.preventDefault();
    const seletedCalendar = JSON.parse(event.target.value).calendar;
    let rows = [];
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/calendar/${seletedCalendar._id}`,
        method: "get",
        withCredentials: true,
      });
      if (response.status === 201) {
        const members = response.data.calendar.members;
        for (var num = 0; num < members.length; num++) {
          if (seletedCalendar.owner !== members[num]._id) {
            rows.push({
              id: members[num]._id,
              nickname: members[num].nickname,
            });
          }
        }
        setSeletionModel(() => seletedCalendar._id);
        setMemberInCalendarRows(() => rows);
      }
    } catch (error) {
      new Error(error);
    }
  };
  // 임명 -> 임명 완료 시, 탈퇴버튼 활성화 표시 필요
  const changeOwnerHandler = async (event) => {
    event.preventDefault();
    confirmModalClose();
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/calendar/owner`,
        method: "patch",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        data: {
          userId: event.target.value,
          calendarId: selectionModel,
        },
      });

      if (response.status === 200) {
        alertModalOpen();
      }
    } catch (e) {
      throw new Error();
    }
  };

  // 삭제 -> 삭제완료시 캘린더 삭제된 결과 표시 필요
  const deleteHandler = async (event) => {
    event.preventDefault();
    confirmModalClose();
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/calendar/${event.target.value}`,
        method: "delete",
        withCredentials: true,
      });

      if (response.status === 200) {
        alertModalOpen();
      }
    } catch (e) {
      throw new Error();
    }
  };
  if (isLoading) {
    return <Loading />;
  }
  if (authenticated) {
    return (
      <React.Fragment>
        <Title title={process.env.REACT_APP_TITLE} />
        <Card sx={{ height: "100%" }}>
          <Container component="main" maxWidth="md" sx={{ marginTop: 3 }}>
            <Typography variant="h5" margin={1}>
              Edit Calendars
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
                        primary={
                          <Typography variant="h6">{calendar.name}</Typography>
                        }
                        secondary={calendar.description}
                      />
                    </ListItem>
                    <ListItem>
                      <Box sx={{ marginLeft: "auto" }}>
                        {/* 캘린더 팀원, 팀장인지에 따라 버튼을 달리 표시 */}
                        {!isCreator(calendar) && (
                          <Button
                            onClick={openConfirmModalHandler}
                            value={calendar._id}
                            variant="contained"
                            sx={{ width: 100 }}
                            name="Leave"
                          >
                            Leave
                          </Button>
                        )}
                        {isCreator(calendar) && (
                          <React.Fragment>
                            <Button
                              onClick={changeOwnerModalOpen}
                              value={JSON.stringify({
                                calendar,
                              })}
                              variant="outlined"
                              sx={{ mr: 1, width: 170 }}
                              name="ChangeOwner"
                            >
                              Change Owner
                            </Button>
                            <Button
                              onClick={openConfirmModalHandler}
                              value={calendar._id}
                              variant="contained"
                              sx={{ width: 100 }}
                              name="Delete"
                            >
                              Delete
                            </Button>
                          </React.Fragment>
                        )}
                      </Box>
                    </ListItem>
                    {!calendars.length === index + 1 && (
                      <Divider sx={{ mx: 2, my: 0.5 }} />
                    )}
                  </React.Fragment>
                ))}
                <ConfirmModal
                  open={confirmModal}
                  close={confirmModalClose}
                  severity="warning"
                  message="warning"
                  secondMessage={modalData.message}
                  action={modalData.action}
                  value={modalData.value}
                />
                <AlertModal
                  open={alertModal}
                  close={alertModalClose}
                  severity="success"
                  message="Success"
                  secondMessage={modalData.successMessage}
                />
                <ChangeOwnerModal
                  open={changeOwnerModal}
                  close={changeOwnerModalClose}
                  rows={memberInCalendarRows}
                  onChange={openConfirmModalHandler}
                />
              </List>
            </Grid>
          </Container>
        </Card>
      </React.Fragment>
    );
  }
};

export default EditCalendars;
