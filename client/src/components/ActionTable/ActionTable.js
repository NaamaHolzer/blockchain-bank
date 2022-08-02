import { React, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import "./ActionTable.css";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function setDate(date) {
  return (
    date.getDate().toString() +
    "/" +
    (date.getMonth() + 1).toString() +
    "/" +
    date.getFullYear().toString()
  );
}

let headCells = [
  {
    id: "fromUser",
    numeric: false,
    disablePadding: true,
    label: "From",
  },
  {
    id: "toUser",
    numeric: false,
    disablePadding: false,
    label: "To",
  },
  {
    id: "amount",
    numeric: false,
    disablePadding: false,
    label: "Amount (LevCoin)",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "endDate",
    numeric: false,
    disablePadding: false,
    label: "End Date",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const cellsHeaders =
    props.action === "loan"
      ? headCells
      : headCells.filter((e) => e.id != "endDate");

  return (
    <TableHead>
      <TableRow>
        {cellsHeaders.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            style={{ fontWeight: "bold" }}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  return (
    <div className="header-container">
      <h1 className="title">{props.action.toUpperCase() + "S"}</h1>
      <Select
        className="select"
        label="range"
        defaultValue="ALL"
        onChange={async (e) => {
          props.fetchData(e.target.value);
        }}
      >
        <MenuItem value="WEEK">WEEK</MenuItem>
        <MenuItem value="MONTH">MONTH</MenuItem>
        <MenuItem value="YEAR">YEAR</MenuItem>
        <MenuItem value="ALL">ALL</MenuItem>
      </Select>
    </div>
  );
};

export default function ActionTable(props) {
  const [tableState, setTableState] = useState(props.action);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("amount");
  const [currentRange, setCurrentRange] = useState("YEAR");

  const closeRequest = async (id) => {
    try {
      let response = await fetch(process.env.REACT_APP_BASE_URL + "/loan", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
        credentials: "include",
      });
      if (response.ok) {
        response = await response.json();
        await fetchData(currentRange);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const fetchData = useCallback(
    async (range) => {
      let rangeNum;
      switch (range) {
        case "ALL":
          rangeNum = -1;
          break;
        case "YEAR":
          rangeNum = 365;
          break;
        case "MONTH":
          rangeNum = 30;
          break;
        case "WEEK":
          rangeNum = 7;
          break;
        default:
          toast.error("Invalid range", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
      }
      setCurrentRange(range);
      let url;
      if (rangeNum === -1) {
        url = props.admin
          ? props.action + "/all" + props.action + "s"
          : props.action + "/user" + props.action + "s";
      } else {
        url = props.admin
          ? props.action + "/adminrange?range=" + rangeNum.toString()
          : props.action + "/range?range=" + rangeNum.toString();
      }

      let res = await fetch(process.env.REACT_APP_BASE_URL + "/" + url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        res = await res.json();
        const resRows = res.rows.map((x) => x.action);
        setRows(resRows);
      } else {
        res = await res.json();
        toast.error(res.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
    [props.action]
  );

  useEffect(() => {
    fetchData("YEAR").catch(console.error);
  }, [fetchData]);

  if (props.action != tableState) {
    setTableState(props.action);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar fetchData={fetchData} action={props.action} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              action={props.action}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map(
                (row, index) => {
                  return props.action === "transaction" ? (
                    <TableRow hover tabIndex={-1} key={row.name}>
                      <TableCell align="center">{row.fromUser}</TableCell>
                      <TableCell align="center">{row.toUser}</TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="center">
                        {setDate(new Date(row.date))}
                      </TableCell>
                    </TableRow>
                  ) : (
                    
                    <TableRow hover tabIndex={-1} key={row.name}>
                      <TableCell align="center">{row.fromUser}</TableCell>
                      <TableCell align="center">{row.toUser}</TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="center">
                        {setDate(new Date(row.date))}
                      </TableCell>
                      <TableCell align="center">
                        {setDate(new Date(row.endDate))}
                      </TableCell>
                    {props.admin?(
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={async () => closeRequest(row.id)}
                        >
                          CLOSE
                        </Button>
                      </TableCell>):(<div/>)}
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
