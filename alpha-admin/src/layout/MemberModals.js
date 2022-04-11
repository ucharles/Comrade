import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Box, Button, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DataGrid } from "@mui/x-data-grid";

import Modal from "@mui/material/Modal";

// 프로필 사진 넣을까?
const columns = [
  {
    field: "nickname",
    headerName: "Nickname",
    width: 110,
  },
];

// JSON 형식으로 받을 멤버(더미)
let members = [
  {
    _id: "61d6cf33bffd707ad9702853",
    username: "dummy1",
  },
  {
    _id: "61d6cf33bffd707ad9702854",
    username: "dummy2",
  },
  {
    _id: "61d6cf33bffd707ad9702855",
    username: "dummy3",
  },
  {
    _id: "61d6cf33bffd707ad9702856",
    username: "dummy4",
  },
];

let num;
let rows = [];

for (num = 0; num < members.length; num++) {
  rows.push({
    id: members[num]._id,
    nickname: members[num].username,
  });
}

/* 멤버 관리 모달 (캘린더 관리자에게만 보일 것)*/
export const EditMemberModal = (props) => {
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
        aria-describedby="modal-modal-description"
      >
        <Box
          width={{ xs: 290, sm: 300, lg: 500 }}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit members
          </Typography>
          <Typography id="modal-modal-description" sx={{ marginY: 2 }}>
            Select the member you want to delete.
          </Typography>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
              setSeletionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
          />
          <Box
            sx={{
              marginY: 1,
              display: "flex",
              flexDirection: "row-reverse",
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={deleteHandler}
              sx={{ mb: 2 }}
            >
              DELETE
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export const AddMemberModal = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={{ xs: 290, sm: 300, lg: 500 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add member
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Share the link below with the member you want to invite.
        </Typography>
        <Typography
          // id="addMemLink"
          sx={{
            bgcolor: "#EEEEEE",
            px: 2,
            py: 1,
            mt: 1,
            display: "flex",
            lineHeight: 2.5,
          }}
        >
          link
          <IconButton
            sx={{ marginLeft: "auto", mr: 0.5 }}
            // onClick={copyLink}
          >
            <ContentCopyIcon />
          </IconButton>
        </Typography>
      </Box>
    </Modal>
  );
};
