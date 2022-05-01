import React, { useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Copyright from "../../shared/components/UIElements/Copyright";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignUp() {
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessgae] = useState("");
  const inputText = useRef([]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    event.preventDefault();
    if (window.confirm("Are you sure you want to proceed?")) {
      try {
        const response = await axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          method: "POST",
          withCredentials: true,
          data: formData,
        });

        if (response.status >= 200 && response.status <= 300) {
          alert("Success. Your account has been saved. Please login.");
          navigate("/login");
        }
      } catch (e) {
        setErrorMessgae(e.response.data.message);
        setShowAlert(true);
        if (
          e.response.data.message ===
          "User exists already, please login instead."
        ) {
          inputText.current[1].focus();
        } else if (
          e.response.data.message ===
          "Password unmatch. Please confirm password."
        ) {
          inputText.current[2].focus();
        } else {
          inputText.current[0].focus();
        }
        throw new Error();
      }
    } else {
      return;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {showAlert && (
                <Grid item xs={12}>
                  <Alert severity="error">{errorMessage}</Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  inputRef={(el) => (inputText.current[0] = el)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  inputRef={(el) => (inputText.current[1] = el)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  inputRef={(el) => (inputText.current[2] = el)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  inputRef={(el) => (inputText.current[3] = el)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
