import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

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

import { Typography, Button } from "@material-ui/core";
import Chip from "@mui/material/Chip";

import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../utils/lib/axios";

import PopupBox from "components/UI/PopupBox";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

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
const videoColumns = [
  {
    id: "Name",
    label: "Name",
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "Description", label: "Description", align: "right" },
  {
    id: "Status",
    label: "Status",
    align: "right",
  },
];

export default function LessonList(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [searchText, setSearchText] = useState("");

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState(data);

  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const getPromptsList = async () => {
    try {
      const { data } = await axios.get("/admin/prompts");

      setData(data);
      setFilterData(data);
    } catch (e) {}
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (row) => {
    console.log(row);
    setSelectedRow(row);
    setOpen(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deletePrompt = async (id) => {
    try {
      await axios.delete(`/admin/delete-prompt/${id}`);
      getPromptsList();
    } catch (err) {}
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

  const editPrompt = (id) => {
    navigate(`/edit-prompt/${id}`);
  };

  useEffect(() => {
    getPromptsList();
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        {alert.showAlert && (
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, showAlert: false })}
          >
            {alert.message}
          </Alert>
        )}
        <AppBar position="static">
          <Toolbar>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                Prompt List
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
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
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ height: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {videoColumns.map((column) => (
                  <TableCell key={column.id} align={"left"}>
                    {column.label}
                  </TableCell>
                ))}

                <TableCell key="command" align="left">
                  View Prompt
                </TableCell>
                <TableCell key="command" align="left">
                  Edit
                </TableCell>
                <TableCell key="command" align="left">
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData.length > 0 &&
                filterData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        <TableCell>{row?.title}</TableCell>
                        <TableCell>{row?.description}</TableCell>
                        <TableCell>
                          {row?.status === "Approved" ? (
                            <Chip
                              label="Approved"
                              color="success"
                              variant="outlined"
                            />
                          ) : row?.status === "Pending" ? (
                            <Chip
                              label="Pending"
                              color="primary"
                              variant="outlined"
                            />
                          ) : row?.status === "Rejected" ? (
                            <Chip
                              label="Rejected"
                              color="error"
                              variant="outlined"
                            />
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => handleOpen(row)}
                          >
                            View
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => editPrompt(row?._id)}
                          >
                            <EditIcon color="primary" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => deletePrompt(row?._id)}
                          >
                            <DeleteIcon color="error" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              position: "relative",
              padding: 25,
            }}
          >
            <Fab
              color="secondary"
              aria-label="add"
              onClick={() => navigate("/addLesson")}
            >
              <AddIcon />
            </Fab>
          </div> */}
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
        selectedRow={selectedRow}
        getPromptsList={getPromptsList}
        setAlert={setAlert}
      />
    </React.Fragment>
  );
}
