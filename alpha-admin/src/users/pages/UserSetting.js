import React, { useState, useEffect, useRef, useCallback } from "react";
import { Title, useAuthState, Loading, useRedirect } from "react-admin";

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
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { AlertModal } from "../../layout/Modals";

const theme = createTheme();

const Input = styled("input")({
  display: "none",
});

export default function UserSetting() {
  const { isLoading, authenticated } = useAuthState();
  const redirect = useRedirect();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Input field 에러 메시지 state
  const [errorMessageUsername, setErrorMessageUsername] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  // Input field 에러 플래그 state
  const [mismatchError, setMismatchError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  // Input field alertMessage 표시 state.
  const [showAlert, setShowAlert] = useState({
    username: false,
    password: false,
    confirmPassword: false,
  });

  // AlertModal State
  const [alertModal, setAlertModalOpen] = useState(false);
  const alertModalOpen = () => setAlertModalOpen(true);
  const alertModalClose = () => {
    setAlertModalOpen(false);
    redirect(`${process.env.REACT_APP_FRONTEND_URL}/settings`);
  };

  const getUser = async () => {
    try {
      const response = await axios(
        `${process.env.REACT_APP_BACKEND_URL}/users`,
        {
          withCredentials: true,
        }
      );
      setUsername(response.data.user.username);
      setUserEmail(response.data.user.email);
      const fileResponse = await fetch(
        `${process.env.REACT_APP_ASSET_URL}/${response.data.user.image}`
      )
        .then((response) => response.blob())
        .then((blob) => {
          const url = `${process.env.REACT_APP_ASSET_URL}/${response.data.user.image}`;
          const file = new File([blob], url.split("/").pop(), {
            type: `image/${url.split(".").pop()}`,
          });
          setFile(file);
        });
    } catch (e) {
      throw Error(e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

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

  // Input field 전체 onFocus 핸들러
  const onFocusHandler = (e) => {
    const { name } = e.target;
    setShowAlert(false);
    setShowAlert({ [name]: true });
    if (name === "username") {
      onChangeUsername(e);
    } else if (name === "password") {
      onChangePassword(e);
    } else if (name === "confirmPassword") {
      onChangeConfirmPassword(e);
    }
  };

  // 유저네임 유효성 검사 onChagne
  const onChangeUsername = useCallback((e) => {
    setUsername(e.target.value);
    let alertMessege;
    let errorFlag = true;
    if (!e.target.value) {
      alertMessege = "Username is Required.";
    } else {
      alertMessege = "Perfect.";
      errorFlag = false;
    }
    setErrorMessageUsername(alertMessege);
    setUsernameError(errorFlag);
  }, []);

  // 비밀번호 유효성 검사 onChange
  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== confirmPassword);
      let alertMessege;
      let errorFlag = true;
      if (!e.target.value) {
        alertMessege = "Password is Required.";
      } else if (e.target.value.length < 6) {
        alertMessege = "Password must be at least 6 characters long.";
      } else {
        alertMessege = "Perfect.";
        errorFlag = false;
      }
      setErrorMessagePassword(alertMessege);
      setPasswordError(errorFlag);
    },
    [confirmPassword]
  );

  // 비밀번호 확인 onChange
  const onChangeConfirmPassword = useCallback(
    (e) => {
      setConfirmPassword(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password]
  );
  // 유효성 검사(onSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("image", file);
    console.log(typeof formData.get("image"));
    try {
      const response = await axios(
        `${process.env.REACT_APP_BACKEND_URL}/users`,
        {
          method: "patch",
          data: formData,
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        alertModalOpen();
      }
    } catch (e) {
      throw Error(e);
    }
  };

  if (isLoading) {
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
              }}
            >
              <Typography component="h1" variant="h5">
                Account Settings
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
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
                      required
                      fullWidth
                      name="username"
                      id="username"
                      label="Username"
                      value={username}
                      onFocus={onFocusHandler}
                      onChange={onChangeUsername}
                    />
                    {showAlert.username && (
                      <Alert
                        severity={
                          errorMessageUsername === "Perfect."
                            ? "success"
                            : "error"
                        }
                        sx={{ bgcolor: "background.paper" }}
                      >
                        {errorMessageUsername}
                      </Alert>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="calendarName"
                      label="Email Address"
                      value={userEmail}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="on"
                      type="password"
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                      onFocus={onFocusHandler}
                      onChange={onChangePassword}
                    />
                    {showAlert.password && (
                      <Alert
                        severity={passwordError ? "error" : "success"}
                        sx={{ bgcolor: "background.paper" }}
                      >
                        {errorMessagePassword}
                      </Alert>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="on"
                      type="password"
                      fullWidth
                      id="confirmPassword"
                      label="Confirm Password"
                      name="confirmPassword"
                      onFocus={onFocusHandler}
                      onChange={onChangeConfirmPassword}
                    />
                    {confirmPassword &&
                      (mismatchError ? (
                        <Alert
                          severity={"error"}
                          sx={{ bgcolor: "background.paper" }}
                        >
                          Passwords do not match.
                        </Alert>
                      ) : (
                        showAlert.confirmPassword && (
                          <Alert
                            severity={"success"}
                            sx={{ bgcolor: "background.paper" }}
                          >
                            Perfect.
                          </Alert>
                        )
                      ))}
                    {!confirmPassword && showAlert.confirmPassword && (
                      <Alert
                        severity={"error"}
                        sx={{ bgcolor: "background.paper" }}
                      >
                        ConfirmPassword is required.
                      </Alert>
                    )}
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
                </Grid>
                <Button
                  disabled={
                    username &&
                    password &&
                    confirmPassword &&
                    !usernameError &&
                    !passwordError &&
                    !mismatchError
                      ? false
                      : true
                  }
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 1 }}
                >
                  Submit
                </Button>
                <AlertModal
                  open={alertModal}
                  close={alertModalClose}
                  severity="success"
                  message="Success"
                  secondMessage="Successfully updated your profile!"
                />
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1, mb: 1 }}
                >
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
