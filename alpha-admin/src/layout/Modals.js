import React from "react";
import { Alert, AlertTitle, Box, Button, Grid } from "@mui/material";
import Modal from "@mui/material/Modal";

export const AlertModal = (props) => {
  return (
    <Modal open={props.open} onClose={props.close}>
      <Box
        width={{ xs: 290, sm: 400, lg: 500 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
        }}
      >
        <Alert
          severity={props.severity}
          sx={{
            bgcolor: "background.paper",
            fontSize: "1em",
            "& .MuiAlert-icon": {
              fontSize: "2em",
            },
          }}
        >
          <AlertTitle sx={{ fontSize: "1.5em" }}>{props.message}</AlertTitle>
          {props.secondMessage}
        </Alert>
        <Button onClick={props.close} fullWidth={true}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export const ConfirmModal = (props) => {
  return (
    <Modal open={props.open} onClose={props.close}>
      <Box
        width={{ xs: 290, sm: 400, lg: 500 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Alert
              severity={props.severity}
              sx={{
                bgcolor: "background.paper",
                fontSize: "1em",
                "& .MuiAlert-icon": {
                  fontSize: "2em",
                },
              }}
            >
              <AlertTitle sx={{ fontSize: "1.5em" }}>
                {props.message}
              </AlertTitle>
              {props.secondMessage}
            </Alert>
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={props.action}
              value={props.value}
              variant="contained"
              fullWidth={true}
            >
              OK
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={props.close} variant="outlined" fullWidth={true}>
              CANCEL
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
