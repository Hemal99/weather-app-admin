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

import StudyPackPopup from "../../components/UI/StudyPackPopUp";

import axios from "../../utils/lib/axios";

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
  {
    id: "name",
    label: "Username",
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "Email", label: "Email", align: "right" },
  { id: "Status", label: "Status", align: "right" },
  { id: "Slip", label: "Slip", align: "right" },
];

export default function StudyPackPayment(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [slip, setSlip] = useState("");
  const [slipCount, setSlipCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [id, setId] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const [data, setData] = useState([]);

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const [filterData, setFilterData] = useState(data);

  const getStudentDetails = async () => {
    try {
      const { data } = await axios.get(`/admin/student-pack-payments`);

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
    await axios.put("/admin/check-study-pack", { paymentId });
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
  }, []);

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
                      <TableCell>{`${row?.studyPackUserId?.username}`}</TableCell>
                      <TableCell>{row?.studyPackUserId?.email}</TableCell>
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
                      <TableCell key="comman" align="left">
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleClickOpen(
                              row?.slipurl,
                              row?.studyPackUserId._id,
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
      <StudyPackPopup
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
