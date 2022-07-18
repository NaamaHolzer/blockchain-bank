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
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function ActionModal(props) {
  const [toFilled, setToFilled] = React.useState();
  const [amountFilled, setAmountFilled] = React.useState();

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const submitRequest = async () => {
    if (props.action === "TRANSFER") {
      try {
        let response = await fetch(
          process.env.REACT_APP_BASE_URL + "/transaction",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({
              amount: amountFilled,
              toUser: toFilled,
            }),
            credentials: "include",
          }
        );
        if (response.ok) {
          handleClose();
          response = await response.json();
          toast.success(response.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          response = await response.json();
          toast.error(response.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
                    }
      } catch (err) {}
    } else {
      try {
        let response = await fetch(process.env.REACT_APP_BASE_URL + "/loan", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            amount: amountFilled,
            toUser: toFilled,
            endDate: date,
          }),
          credentials: "include",
        });
        if (response.ok) {
          handleClose();
          response = await response.json();
          toast.success(response.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });        } else {
          response = await response.json();
          toast.error(response.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });        }
      } catch (err) {}
    }
  };
  const [date, setDate] = React.useState(new Date());

  const handleChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
            <TextField
              id="to"
              label="To"
              type="text"
              variant="standard"
              onChange={(e) => setToFilled(e.target.value)}
            />
            <br></br>
            <TextField
              id="amount"
              label="Amount"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              variant="standard"
              onChange={(e) => setAmountFilled(e.target.value)}
            />
            <br></br>
            {props.action === "LOAN" ? (
              <div>
                <br></br>
                <DesktopDatePicker
                  label="End Date"
                  value={date}
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
            <Button
              variant="contained"
              onClick={submitRequest}
              disabled={!toFilled || !amountFilled}
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}
