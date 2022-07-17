
// import * as React from 'react';
// import PropTypes from 'prop-types';
// import { alpha } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import { visuallyHidden } from '@mui/utils';

// function createData(name, calories, fat, carbs, protein) {
//   return {
//     name,
//     calories,
//     fat,
//     carbs,
//     protein,
//   };
// }

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ];
// console.log(rows);
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
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// // This method is created for cross-browser compatibility, if you don't
// // need to support IE11, you can use Array.prototype.sort() directly
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

// const headCells = [
//   {
//     id: 'name',
//     numeric: false,
//       disablePadding: true,
//     label: 'Dessert (100g serving)',
//   },
//   {
//     id: 'calories',
//     numeric: false,
//     disablePadding: false,
//     label: 'Calories',
//   },
//   {
//     id: 'fat',
//     numeric: false,
//     disablePadding: false,
//     label: 'Fat (g)',
//   },
//   {
//     id: 'carbs',
//     numeric: false,
//     disablePadding: false,
//     label: 'Carbs (g)',
//   },
//   {
//     id: 'endDate',
//     numeric: false,
//     disablePadding: false,
//     label: 'End Date',
//   },
// ];
// // let headCells = [
// //     {
// //       id: "from",
// //       numeric: false,
// //       disablePadding: true,
// //       label: "From",
// //     },
// //     {
// //       id: "to",
// //       numeric: false,
// //       disablePadding: false,
// //       label: "To",
// //     },
// //     {
// //       id: "amount",
// //       numeric: false,
// //       disablePadding: false,
// //       label: "Amount (LevCoin)",
// //     },
// //     {
// //       id: "date",
// //       numeric: false,
// //       disablePadding: false,
// //       label: "Date",
// //     },
// //     {
// //       id: "endDate",
// //       numeric: false,
// //       disablePadding: false,
// //       label: "End Date",
// //     },
// //   ];

// function EnhancedTableHead(props) {
//   const { order, orderBy, onRequestSort } =
//     props;
//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : 'asc'}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <Box component="span" sx={visuallyHidden}>
//                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
// };


// const EnhancedTableToolbar = (props) => {
//   return <h1 className="Title">{"Trying"}</h1>;
// };

// export default function ActionTable() {
//   const [order, setOrder] = React.useState('asc');
//   const [orderBy, setOrderBy] = React.useState('calories');

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };


//   return (
//     <Box sx={{ width: '100%' }}>
//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <EnhancedTableToolbar  />
//         <TableContainer>
//           <Table
//             sx={{ minWidth: 750 }}
//             aria-labelledby="tableTitle"
//           >
//             <EnhancedTableHead
//               order={order}
//               orderBy={orderBy}
//               onRequestSort={handleRequestSort}
//             />
//             <TableBody>
//               {/* if you don't need to support IE11, you can replace the `stableSort` call with:
//                  rows.slice().sort(getComparator(order, orderBy)) */}
//               {stableSort(rows, getComparator(order, orderBy))
//                 .map((row, index) => {
//                   const labelId = `enhanced-table-checkbox-${index}`;

//                   return (
//                     <TableRow hover tabIndex={-1} key={row.name}>
//                       <TableCell
//                         component="th"
//                         id={labelId}
//                         scope="row"
//                         padding="none"
//                       >
//                         {row.name}
//                       </TableCell>
//                       <TableCell align="right">{row.calories}</TableCell>
//                       <TableCell align="right">{row.fat}</TableCell>
//                       <TableCell align="right">{row.carbs}</TableCell>
//                       <TableCell align="right">{row.protein}</TableCell>
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

import { React, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import "./ActionTable.css";

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
  return <h1 className="Title">{props.action.toUpperCase() + "S"}</h1>;
};

export default function ActionTable(props) {
  const [tableState, setTableState] = useState(props.action);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("amount");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    const fetchData = async () => {
      const adminActions = props.admin ? "/all" : "/user";
      let res = await fetch(
        process.env.REACT_APP_BASE_URL +
          "/" +
          props.action +
          adminActions +
          props.action +
          "s",
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
        const resRows = res.rows.map(x=>x.action);
        console.log(resRows);
        setRows(resRows);
      } else {
        res = await res.json();
        alert(res.message);
      }
    };

    fetchData().catch(console.error);
  }, [props.action]);

  if (props.action != tableState) {
    setTableState(props.action);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar action={props.action} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              action={props.action}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  return props.action === "transaction" ? (
                    <TableRow hover tabIndex={-1} key={row.name}>
                      <TableCell align="center">
                        {row.fromUser}
                      </TableCell>
                      <TableCell align="center">{row.toUser}</TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="center">
                        {setDate(new Date(row.date))}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow hover tabIndex={-1} key={row.name}>
                      <TableCell align="center">
                        {row.fromUser}
                      </TableCell>
                      <TableCell align="center">{row.toUser}</TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="center">
                        {setDate(new Date(row.date))}
                      </TableCell>
                      <TableCell align="center">
                        {setDate(new Date(row.endDate))}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}