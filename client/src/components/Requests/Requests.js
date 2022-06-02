import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import RequestTableRow from "../RequestTableRow/RequestTableRow";
import Paper from "@mui/material/Paper";
import "./Requests.css";

const rows = [
  { username: "naama"},
  { username: "kayla"},
  { username: "shira"},
  { username: "tamar"},
];

const EnhancedTableToolbar = (props) => {
  return <h1 className="Title">PENDING REQUESTS</h1>;
};

export default function Requests(props) {

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableBody>
              {rows.map((row) => {
                return <RequestTableRow username={row.username}></RequestTableRow>;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
