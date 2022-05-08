import React, { useState } from "react";
import moment from "moment-timezone";
import { Cookies } from "react-cookie";
import IconButton from "@mui/material/IconButton";
import { Avatar, Box, Button, Typography, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DataGrid } from "@mui/x-data-grid";
import Tabs from "../shared/components/UIElements/Tabs";
import CloseIcon from "@mui/icons-material/Close";

import Modal from "@mui/material/Modal";

const EventModal = (props) => {
  const [selectionModel, setSeletionModel] = useState([]);
  const cookies = new Cookies();
  const timezone = decodeURIComponent(cookies.get("tz"));

  const deleteHandler = () => {
    alert("Are you sure you want to delete members");
    console.log(selectionModel);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box
        sx={{
          width: 330,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
        }}>
        <Box sx={{ p: 3 }}>
          <Box id="modal-modal-title" sx={{ display: "flex" }}>
            <Typography variant="h6" component="h2" sx={{ marginTop: 0.5 }}>
              Fixing Event
            </Typography>
            <IconButton sx={{ marginLeft: "auto", p: 1 }} onClick={props.close}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box id="modal-modal-description" sx={{ marginTop: 2 }}>
            <Typography sx={{ marginBottom: 1 }}>
              Date:{" "}
              {moment.tz(props.obj.startTime, timezone).format("YYYY/MM/DD")}
            </Typography>
            <Typography sx={{ marginBottom: 1 }}>
              Time: {moment.tz(props.obj.startTime, timezone).format("HH:mm")} ~{" "}
              {moment.tz(props.obj.endTime, timezone).format("HH:mm")}
            </Typography>
          </Box>
          <Tabs obj={props.obj.members} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
            }}>
            <Button
              type="button"
              variant="outlined"
              onClick={deleteHandler}
              sx={{ marginTop: 2 }}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EventModal;
