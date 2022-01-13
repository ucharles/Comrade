import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Title } from "react-admin";
import { styled } from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const Input = styled("input")({
  display: "none",
});

export default function CreateCalendar() {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  useEffect(() => {
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
  }, [file]);

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

  const resetHandler = (event) => {
    event.preventDefault();
    setPreviewUrl(null);
  };

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
            <Typography component="h1" variant="h5">
              Create New Calendar
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="calendarName"
                    required
                    fullWidth
                    id="calendarName"
                    label="Calendar Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="numberOfMember"
                    type="number"
                    label="Number of member"
                    name="numberOfMember"
                  />
                </Grid>

                <Grid item xs={12}>
                  Image Preview
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
                Create
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
