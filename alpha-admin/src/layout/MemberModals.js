import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Box, Button, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DataGrid } from "@mui/x-data-grid";
import { useNotify } from "react-admin";

import Modal from "@mui/material/Modal";

// 프로필 사진 넣을까?
const columns = [
  {
    field: "nickname",
    headerName: "Nickname",
    width: 110,
  },
];

/* 멤버 관리 모달 (캘린더 관리자에게만 보일 것)*/
export const EditMemberModal = (props) => {
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
  const [selectionModel, setSeletionModel] = useState([]);
  const deleteHandler = () => {
    alert("Are you sure you want to delete members");
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
  const notify = useNotify();
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  const copyLink = () => {
    copyTextToClipboard(props.link)
      .then(() => {
        // If successful, update the isCopied state value
        setTimeout(() => {
          notify("✅Copied!", { type: "success", autoHideDuration: 5000 });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal
      open={props.open}
      onClose={props.close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={{ xs: 290, sm: 300, lg: 450 }}
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
        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1 }}>
          Share the link below with the member you want to invite.
        </Typography>
        <Box
          sx={{
            bgcolor: "#EEEEEE",
            display: "flex",
          }}
        >
          <Typography noWrap sx={{ m: 2 }}>
            {props.link}
          </Typography>
          <IconButton sx={{ m: 1 }} onClick={copyLink}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Expire: {props.description}
        </Typography>
      </Box>
    </Modal>
  );
};

export const ChangeOwnerModal = (props) => {
  const [selectionModel, setSeletionModel] = useState([]);

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
            Change Owner
          </Typography>
          <Typography id="modal-modal-description" sx={{ marginY: 2 }}>
            Select the member you want to change.
          </Typography>
          <DataGrid
            autoHeight
            rows={props.rows}
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
              onClick={props.onChange}
              value={selectionModel}
              name="ChangeOwner"
              sx={{ mb: 2 }}
            >
              Change
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};
