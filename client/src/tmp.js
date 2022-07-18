// import { React, useCallback, useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import Box from "@mui/material/Box";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TableSortLabel from "@mui/material/TableSortLabel";
// import Paper from "@mui/material/Paper";
// import { visuallyHidden } from "@mui/utils";
// import "./ActionTable.css";

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

// function setDate(date) {
//   return (
//     date.getDate().toString() +
//     "/" +
//     (date.getMonth() + 1).toString() +
//     "/" +
//     date.getFullYear().toString()
//   );
// }

// let headCells = [
//   {
//     id: "from",
//     numeric: false,
//     disablePadding: true,
//     label: "From",
//   },
//   {
//     id: "to",
//     numeric: false,
//     disablePadding: false,
//     label: "To",
//   },
//   {
//     id: "amount",
//     numeric: false,
//     disablePadding: false,
//     label: "Amount (LevCoin)",
//   },
//   {
//     id: "date",
//     numeric: false,
//     disablePadding: false,
//     label: "Date",
//   },
//   {
//     id: "endDate",
//     numeric: false,
//     disablePadding: false,
//     label: "End Date",
//   },
// ];

// function EnhancedTableHead(props) {
//   const { order, orderBy, onRequestSort } = props;
//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   const cellsHeaders =
//     props.action === "loan"
//       ? headCells
//       : headCells.filter((e) => e.id != "endDate");

//   return (
//     <TableHead>
//       <TableRow>
//         {cellsHeaders.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={"center"}
//             style={{ fontWeight: "bold" }}
//             padding={headCell.disablePadding ? "none" : "normal"}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : "asc"}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <Box component="span" sx={visuallyHidden}>
//                   {order === "desc" ? "sorted descending" : "sorted ascending"}
//                 </Box>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

// EnhancedTableHead.propTypes = {
//   onRequestSort: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(["asc", "desc"]).isRequired,
//   orderBy: PropTypes.string.isRequired,
// };

// const EnhancedTableToolbar = (props) => {
//   return <h1 className="Title">{props.action.toUpperCase() + "S"}</h1>;
// };

// export default function ActionTable(props) {
//   const [tableState, setTableState] = useState(props.action);
//   const [rows, setRows] = useState([]);
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState("amount");

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const adminActions = props.admin ? "/all" : "/user";
//       let res = await fetch(
//         process.env.REACT_APP_BASE_URL +
//           "/" +
//           props.action +
//           adminActions +
//           props.action +
//           "s",
//         {
//           method: "GET",
//           headers: {
//             "content-type": "application/json",
//             accept: "application/json",
//           },
//           credentials: "include",
//         }
//       );
//       if (res.ok) {
//         res = await res.json();
//         console.log(res);
//         setRows(res.rows);
//       } else {
//         res = await res.json();
//         alert(res.message);
//       }
//     };

//     fetchData().catch(console.error);
//   }, [props.action]);

//   if (props.action != tableState) {
//     setTableState(props.action);
//   }

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Paper sx={{ width: "100%", mb: 2 }}>
//         <EnhancedTableToolbar action={props.action} />
//         <TableContainer>
//           <Table sx={{ minWidth: 750 }} >
//             <EnhancedTableHead
//               order={order}
//               orderBy={orderBy}
//               onRequestSort={handleRequestSort}
//               action={props.action}
//             />
//             <TableBody>
//               {stableSort(rows, getComparator(order, orderBy))
//                 .map((row, index) => {
//                   return props.action === "transaction" ? (
//                     <TableRow hover tabIndex={-1} key={row.name}>
//                       <TableCell align="center">
//                         {row.action.fromUser}
//                       </TableCell>
//                       <TableCell align="center">{row.action.toUser}</TableCell>
//                       <TableCell align="center">{row.action.amount}</TableCell>
//                       <TableCell align="center">
//                         {setDate(new Date(row.action.date))}
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     <TableRow hover tabIndex={-1} key={row.name}>
//                       <TableCell align="center">
//                         {row.action.fromUser}
//                       </TableCell>
//                       <TableCell align="center">{row.action.toUser}</TableCell>
//                       <TableCell align="center">{row.action.amount}</TableCell>
//                       <TableCell align="center">
//                         {setDate(new Date(row.action.date))}
//                       </TableCell>
//                       <TableCell align="center">
//                         {setDate(new Date(row.action.endDate))}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// }