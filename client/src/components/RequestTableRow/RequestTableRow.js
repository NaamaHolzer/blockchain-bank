import "./RequestTableRow.css";
import {React, useState} from "react";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function RequestTableRow(props) {
  const handleRequest = async (handleType) => {
    try {
      let response = await fetch(
        process.env.REACT_APP_BASE_URL + "/account/handleRequest",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            username: props.username,
            balance: balance,
            approved: handleType,
            currency: currency,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        response = await response.json();
        props.fetchData();
        setBalance(null);
        toast.success(response.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });       } else {
        response = await response.json();
        toast.error(response.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });              }
    } catch (err) {}
  };
  const [balance, setBalance] = useState();
  const [currency, setCurrency] = useState();

  return (
    <TableRow hover tabIndex={-1} key={props.username}>
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
      <TableCell align="center" className="table-cell">
        {props.username}
      </TableCell>
      <TableCell align="center">
        <TextField
          onChange={(e) => setBalance(e.target.value)}
          label="AMOUNT"
          type="number"
          variant="standard"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </TableCell>
      <TableCell align="center">
        <Select
          label="Currency"
          defaultValue="LEV"
          onChange={(e) => setCurrency(e.target.value)}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="LEV">LEV</MenuItem>
          <MenuItem value="ILS">ILS</MenuItem>
        </Select>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          disabled={balance == "" || balance == null}
          onClick={() => handleRequest(true)}
        >
          APPROVE
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button variant="outlined" onClick={() => handleRequest(false)}>
          REJECT
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default RequestTableRow;
