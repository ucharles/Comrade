import React, { useState, useEffect } from "react";
import { Title, useAuthState, Loading } from "react-admin";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const Input = styled("input")({
  display: "none",
});

export default function UserSetting() {
  const { loading, authenticated } = useAuthState();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  useEffect(() => {
    if (!loading && authenticated) {
      // 파일의 존재여부를 확인
      if (!file) {
        return;
      }
      // 브라우저 내장 API
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  }, [authenticated, file, loading]);

  const pickedHandler = (event) => {
    let pickedFile;
    // 파일이 존재하고, 파일의 개수가 1개일 때
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  if (loading) {
    return <Loading />;
  }
  if (authenticated) {
    return (
      <ThemeProvider theme={theme}>
        <Card sx={{ height: "100%" }}>
          <Title title={process.env.REACT_APP_TITLE} />
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Typography component="h1" variant="h5">
                Account Settings
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    Profile Image
                  </Grid>

                  <Grid item xs={6}>
                    <Avatar src={previewUrl} sx={{ width: 120, height: 120 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <label htmlFor="contained-button-file">
                      <Input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={pickedHandler}
                      />
                      <Button variant="contained" component="span" fullWidth>
                        Upload
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="username"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="calendarName"
                      required
                      fullWidth
                      id="calendarName"
                      label="Email Address"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      label="Confirm Password"
                      name="confirmPassword"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="timezone"
                      label="Timezone"
                      name="timezone"
                      value={
                        Intl.DateTimeFormat().resolvedOptions().timeZone +
                        " " +
                        new Date().toTimeString().slice(9)
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 1 }}>
                  Submit
                </Button>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1, mb: 1 }}
                  Reset>
                  Cancel
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
