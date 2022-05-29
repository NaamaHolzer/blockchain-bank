import { Button, Box, Modal, Typography } from "@mui/material";
import * as React from "react";
import { TextField, Dialog, DialogActions, DialogContent } from "@mui/material";
import "./ActionModal.css";
import loan from "../../images/loan.svg";
import transaction from "../../images/transaction.svg";
import Fab from "@mui/material/Fab";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function ActionModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState(new Date());

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="Action">
        <Fab
          className="Action-button"
          variant="extended"
          color="primary"
          onClick={handleClickOpen}
        >
          {props.action}
        </Fab>
        <Dialog className="Action-Dialog" open={open} onClose={handleClose}>
          {props.action === "TRANSFER" ? (
            <img src={transaction} className="Transfer-img" />
          ) : (
            <img src={loan} className="Loan-img" />
          )}
          <DialogContent className="Action-DialogContent">
            <TextField id="to" label="To" type="text" variant="standard" />
            <br></br>
            <TextField
              id="amount"
              label="Amount"
              type="text"
              variant="standard"
            />
            <br></br>
            {props.action === "LOAN" ? (
              <div>
                <br></br>
                <DesktopDatePicker
                  label="End Date"
                  value={value}
                  onChange={handleChange}
                  inputFormat="MM/dd/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            ) : (
              <br></br>
            )}
            <br></br>
          </DialogContent>

          <DialogActions className="Action-DialogOptions">
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}
