import "./RequestTableRow.css";
import React from "react";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Select, { SelectChangeEvent } from "@mui/material/Select";


function RequestTableRow(props) {
  const [amount, setAmount] = React.useState();

  return (
    <TableRow hover tabIndex={-1} key={props.username}>
      <TableCell align="center" className="TableCell">{props.username}</TableCell>
      <TableCell align="center">
        <TextField
          onChange={(e) => setAmount(e.target.value)}
          label="AMOUNT"
          type="number"
          variant="standard"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </TableCell>
      <TableCell align="center">
        <Select label="Currency" defaultValue="LEV">
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="LEV">LEV</MenuItem>
          <MenuItem value="ILS">ILS</MenuItem>
        </Select>
      </TableCell>
      <TableCell align="center">
        <Button variant="contained" disabled={amount=="" || amount==null}>
          APPROVE
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button variant="outlined">REJECT</Button>
      </TableCell>
    </TableRow>
  );
}

export default RequestTableRow;
