import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Avatar, Box, Button, Typography, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DataGrid } from "@mui/x-data-grid";
import Tabs from "../shared/components/UIElements/Tabs";
import List from "../shared/components/UIElements/List";

import Modal from "@mui/material/Modal";

const EventModal = (props) => {
  const [selectionModel, setSeletionModel] = useState([]);
  const deleteHandler = () => {
    alert("Are you sure you want to delete members");
    console.log(selectionModel);
  };
  return (
    <React.Fragment>
      <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Fixing Event
          </Typography>
          <Typography id="modal-modal-description" sx={{ marginY: 2 }}>
            Select the member you want to delete.
          </Typography>
          <Typography>Title: {props.obj.title}</Typography>
          <Tabs>
            <List />
          </Tabs>

          <Box
            sx={{
              marginY: 1,
              display: "flex",
              flexDirection: "row-reverse",
            }}>
            <Button
              type="button"
              variant="outlined"
              onClick={deleteHandler}
              sx={{ mb: 2 }}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default EventModal;
