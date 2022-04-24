import React, { useState, useEffect, useRef } from "react";
import { Title, useAuthState, Loading } from "react-admin";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Card, FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme();

const Input = styled("input")({
  display: "none",
});

export default function CreateCalendar() {
  const { isLoading, authenticated } = useAuthState();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  const inputText = useRef([]);

  useEffect(() => {
    if (!isLoading && authenticated) {
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
  }, [authenticated, file, isLoading]);

  const pickedHandler = (event) => {
    let pickedFile;
    // 파일이 존재하고, 파일의 개수가 1개일 때
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("name", formData.get("calendarName"));
    formData.delete("calendarName");
    formData.append("image", file);

    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/calendar/`,
        method: "post",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Calendar added");
        resetHandler();
        window.location.reload();
      }
    } catch (e) {
      throw Error(e);
    }
  };

  const resetHandler = (event) => {
    event.preventDefault();
    inputText.current[0].value = "";
    inputText.current[1].value = "";
    setPreviewUrl(null);
  };

  if (isLoading) {
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
              }}
            >
              <Typography component="h1" variant="h5">
                Create New Calendar
              </Typography>
              <FormControl
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
                //inputref={textInput}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="calendarName"
                      required
                      fullWidth
                      id="calendarName"
                      label="Calendar Name"
                      inputRef={(el) => (inputText.current[0] = el)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="description"
                      label="Description"
                      name="description"
                      inputRef={(el) => (inputText.current[1] = el)}
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
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 1 }}
                >
                  Create
                </Button>
                <Button
                  type="reset"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1, mb: 1 }}
                  onClick={resetHandler}
                >
                  Reset
                </Button>
              </FormControl>
            </Box>
          </Container>
        </Card>
      </ThemeProvider>
    );
  }
  return null;
}
