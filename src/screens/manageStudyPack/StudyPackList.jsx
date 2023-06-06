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

import { Button, Typography } from "@material-ui/core";

import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../utils/lib/axios";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";

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
    label: "Title",
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "Description", label: "Description", align: "right" },
  {
    id: "Subject",
    label: "Subject",
    align: "right",
  },
  { id: "Link", label: "Link", align: "right" },
];

export default function StudyPackList(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const getPaperDetails = async () => {
    try {
      const { data } = await axios.get("/admin/get-studyPacks");

      setData(data);
    } catch (e) {}
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deletePdf = async (id) => {
    try {
      await axios.delete(`/admin/delete-studyPack/${id}`);
      getPaperDetails();
    } catch (err) {}
  };

  useEffect(() => {
    getPaperDetails();
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
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
                Study Pack List
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
                    // onChange={onSearch}
                    // value={searchText}
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
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>{row?.description}</TableCell>
                      <TableCell>{row?.subject}</TableCell>
                      <TableCell>
                        <a href={row?.thumbnail}>Thumbnail</a>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => deletePdf(row?._id)}
                        >
                          <DeleteIcon color="error" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <div
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
              onClick={() => navigate("/addStudyPack")}
            >
              <AddIcon />
            </Fab>
          </div>
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
    </React.Fragment>
  );
}
