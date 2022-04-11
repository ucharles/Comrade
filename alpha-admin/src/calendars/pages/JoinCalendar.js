import React, { useState } from "react";
import { Title, useAuthState, Loading } from "react-admin";

import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function JoinCalendar() {
  const { loading, authenticated } = useAuthState();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      nickname: data.get("nickname"),
      role: data.get("role"),
    });
  };

  const resetHandler = (event) => {
    event.preventDefault();
  };
  if (loading) {
    return <Loading />;
  }
  if (authenticated) {
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
                      Calendar 1
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
