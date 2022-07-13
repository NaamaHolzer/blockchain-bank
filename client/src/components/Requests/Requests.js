import { React, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import RequestTableRow from "../RequestTableRow/RequestTableRow";
import Paper from "@mui/material/Paper";
import "./Requests.css";
import { useEffect } from "react";

const EnhancedTableToolbar = (props) => {
  return <h1 className="Title">PENDING REQUESTS</h1>;
};

export default function Requests(props) {
  const [requests, setRequests] = useState([]);
  const fetchData = useCallback(async () => {
    let res = await fetch(
      process.env.REACT_APP_BASE_URL + "/account/getRequests",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
      }
    );
    if (res.ok) {
      res = await res.json();
      console.log(res)
      setRequests(res.users);
    } else {
      res = await res.json();
      alert(res.message);
    }
  }, []);

  useEffect(() => {
    fetchData()
    .catch(console.error);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableBody>
              {requests.map((row) => {
                return (
                  <RequestTableRow fetchData={fetchData} username={row.username}></RequestTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
