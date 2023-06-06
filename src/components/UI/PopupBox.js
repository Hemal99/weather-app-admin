/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "utils/lib/axios";

export default function PopupBox(props) {
  const {
    open,
    handleClose,
    slip,
    id,
    getStudentDetails,
    setAlert,
    paymentId,
  } = props;

  const handleClick = async (id, action) => {
    try {
      const payload = {
        _id: id,
        approval: action,
        paymentId: paymentId,
      };
      await axios.put("/admin/approve", payload);
      getStudentDetails();

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
      <DialogTitle id="alert-dialog-title">{"Student Slip"}</DialogTitle>
      <DialogContent>
        <div sx={{ maxWidth: "100%", objectFit: "contain" }}>
          <img
            src={slip}
            alt={"slip"}
            loading="lazy"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{ background: "green", marginRight: "10px" }}
          onClick={() => handleClick(id, true)}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          onClick={() => handleClick(id, false)}
          style={{ background: "red" }}
          autoFocus
        >
          Decline
        </Button>
      </DialogActions>
    </Dialog>
  );
}
