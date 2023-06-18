/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "utils/lib/axios";
import { Grid, TextField } from "@material-ui/core";

export default function PopupBox(props) {
  const {
    open,
    handleClose,

    getPromptsList,
    setAlert,

    selectedRow,
  } = props;

  const handleClick = async (id, action) => {
    try {
      const payload = {
        _id: id,
      };
      await axios.put(`/admin/approve-prompts/${id}/${action}`, payload);
      getPromptsList();

      if (action) {
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Approved",
        });
      } else {
        setAlert({
          showAlert: true,
          severity: "warning",
          message: "Declined",
        });
      }

      handleClose();
    } catch (e) {
      handleClose();
      setAlert({
        showAlert: true,
        severity: "success",
        message: "Action Failed",
      });
    } finally {
      setTimeout(() => {
        setAlert({
          showAlert: false,
          severity: "success",
          message: "Action Failed",
        });
      }, 3000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
    >
      <DialogTitle id="alert-dialog-title">{"Prompt"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{ marginTop: "10px" }}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Title"
              disabled
              value={selectedRow?.title}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Category"
              disabled
              value={selectedRow?.category}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Description"
              disabled
              value={selectedRow?.description}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Input Params"
              disabled
              value={selectedRow?.inputParams}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Prompt"
              multiline
              disabled
              value={selectedRow?.prompt}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{ background: "green", marginRight: "10px" }}
          onClick={() => handleClick(selectedRow?._id, "Approve")}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          onClick={() => handleClick(selectedRow?._id, "Reject")}
          style={{ background: "red" }}
          autoFocus
        >
          Decline
        </Button>
      </DialogActions>
    </Dialog>
  );
}
