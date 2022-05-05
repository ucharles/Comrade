import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Title,
  useAuthState,
  Loading,
  useRedirect,
  useNotify,
} from "react-admin";

import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "axios";

const theme = createTheme();

export default function JoinCalendar() {
  const { isLoading, authenticated } = useAuthState();
  const redirect = useRedirect();
  const notify = useNotify();
  const [loading, setLoading] = useState(true);
  const [calendar, setCalendar] = useState({});

  const uuid = useParams().uuid;

  useEffect(() => {
    const fetchCalendarInfo = async () => {
      try {
        const response = await axios(
          `${process.env.REACT_APP_BACKEND_URL}/invite/${uuid}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          let calendar = response.data;
          if (calendar.message) {
            notify(`${calendar.message}`);
            setTimeout(() => {
              redirect(
                `${process.env.REACT_APP_FRONTEND_URL}/calendar/${calendar._id}`
              );
            }, 2000);
          } else {
            setCalendar(calendar);
            setLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCalendarInfo();
  }, [notify, redirect, uuid]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/calendar/member`,
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        withCredentials: true,
        data: {
          nickname: data.get("nickname"),
          role: data.get("role"),
          calendarId: calendar._id,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        notify("Invite Complete! Redirecting...", { type: "success" });
        setTimeout(() => {
          redirect(
            `${process.env.REACT_APP_FRONTEND_URL}/calendar/${calendar._id}`
          );
        }, 3000);
      } else if (response.status > 300) {
        notify("Error! Please try again.", {
          type: "warning",
          autoHideDuration: 5000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resetHandler = (event) => {
    event.preventDefault();
  };
  if (isLoading || loading) {
    return <Loading />;
  }
  if (!isLoading && authenticated && !loading) {
    return (
      <ThemeProvider theme={theme}>
        <Title title={process.env.REACT_APP_TITLE} />
        <Card sx={{ height: "100%" }}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Typography component="h1" variant="h4">
                Join Calendar
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  {/* 캘린더명 표시 필요 */}
                  <Grid item xs={12}>
                    Calendar Name
                    <Typography component="h2" variant="h5">
                      {calendar.name === undefined ? null : calendar.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="nickname"
                      label="Nickname"
                      name="nickname"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth id="role" label="Role" name="role" />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 1 }}>
                  Join
                </Button>
                <Button
                  type="reset"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1, mb: 1 }}
                  onClick={resetHandler}>
                  Reset
                </Button>
              </Box>
            </Box>
          </Container>
        </Card>
      </ThemeProvider>
    );
  }
  return null;
}
