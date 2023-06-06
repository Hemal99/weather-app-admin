import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Grid } from "@material-ui/core";
import PopupBox from "../../components/UI/PopupBox";

import axios from "../../utils/lib/axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Alert from "@material-ui/lab/Alert";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
const userColumns = [
  { id: "classID", label: "Class ID" },
  {
    id: "name",
    label: "Full Name",
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "Email", label: "Email", align: "right" },
  { id: "Status", label: "Status", align: "right" },
  { id: "telNo", label: "Tel No", align: "right" },
];

const months = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

export default function StudentDetail(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [slip, setSlip] = useState("");
  const [slipCount, setSlipCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [id, setId] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const [data, setData] = useState([]);

  const date = new Date();

  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    console.log(event.target.value);
  };

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const [filterData, setFilterData] = useState(data);

  const getStudentDetails = async () => {
    try {
      const { data } = await axios.get(
        `/admin/student-payments/${selectedMonth}`
      );

      console.log(data);

      setSlipCount(data.length);

      setData(data);
      setFilterData(data);
    } catch (e) {}
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = async (slip, id, paymentId) => {
    await axios.put("/admin/check", { paymentId });
    getStudentDetails();
    setId(id);
    setPaymentId(paymentId);
    setSlip(slip);
    setOpen(true);
  };

  const filterStudents = (filter) => {
    if (filter === "all") {
      setFilterData(data);
    } else if (filter === "checked") {
      const newData = data.filter((item) => item.checked === true);
      setFilterData(newData);
      setPage(0);
    } else {
      const newData = data.filter((item) => item.checked === false);
      setFilterData(newData);
      setPage(0);
    }
  };

  //search
  const onSearch = (e) => {
    const text = String(e.target.value).toLowerCase();
    setSearchText(text);
    if (text) {
      // eslint-disable-next-line
      const result = data.filter((item) => {
        const str = JSON.stringify(item).toLowerCase();

        if (str.search(text) >= 0) return item;
      });
      setPage(0);
      setFilterData(result);
    } else {
      setFilterData(data);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getStudentDetails();
    // eslint-disable-next-line
  }, [selectedMonth]);

  return (
    <React.Fragment>
      {alert.showAlert && (
        <Grid item md={12} style={{ marginTop: 5 }}>
          <Alert
            severity={alert.severity}
            onClose={() =>
              setAlert({
                ...alert,
                showAlert: false,
              })
            }
          >
            {alert.message}
          </Alert>
        </Grid>
      )}

      <div>
        <FormControl fullWidth sx={{ mb: 2, maxWidth: 200 }}>
          <InputLabel id="demo-simple-select-label">Month</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedMonth}
            name="month"
            label="Month"
            onChange={handleMonthChange}
          >
            {months.map((month) => (
              <MenuItem value={month.value} key={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Slip Count : {slipCount}
            </Typography>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "20rem",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => filterStudents("checked")}
              >
                Checked
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => filterStudents("unchecked")}
              >
                Not Checked
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => filterStudents("all")}
              >
                All
              </Button>
            </div>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={onSearch}
                value={searchText}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ height: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {userColumns.map((column) => (
                  <TableCell key={column.id} align={"left"}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell key="command" align="left">
                  Slip
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell>{row?.userId?.classId}</TableCell>
                      <TableCell>{`${row?.userId?.firstName} ${row?.userId?.lastName}`}</TableCell>
                      <TableCell>{row?.userId?.email}</TableCell>
                      <TableCell>
                        {row?.status === "pending" ? (
                          <Chip
                            label="Pending"
                            color="warning"
                            variant="outlined"
                          />
                        ) : row?.status === "approved" ? (
                          <Chip
                            label="Approved"
                            color="success"
                            variant="outlined"
                          />
                        ) : row?.status === "rejected" ? (
                          <Chip
                            label="Rejected"
                            color="error"
                            variant="outlined"
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>{row?.userId?.phone}</TableCell>
                      <TableCell key="comman" align="left">
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleClickOpen(
                              row?.slipurl,
                              row?.userId._id,
                              row?._id
                            )
                          }
                        >
                          {row?.checked ? "Checked" : " Check Slip"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <PopupBox
        open={open}
        handleClose={handleClose}
        slip={slip}
        id={id}
        getStudentDetails={getStudentDetails}
        setAlert={setAlert}
        paymentId={paymentId}
      />
    </React.Fragment>
  );
}
