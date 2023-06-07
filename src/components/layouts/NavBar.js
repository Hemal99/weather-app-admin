import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  toggleOpen,
  toggleClose,
} from "../../store/actions/authActions";
import { useNavigate } from "react-router-dom";
import ClickAwayListener from "@mui/base/ClickAwayListener";

export default function ButtonAppBar() {
  let token = useSelector((state) => state.auth.accessToken);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const toggle = () => {
    dispatch(toggleOpen());
  };

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {token && (
        <ClickAwayListener onClickAway={() => dispatch(toggleClose)}>
          <AppBar position="fixed" style={{ backgroundColor: "#101d27" }}>
            <Toolbar>
              <IconButton
                onClick={toggle}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {/* <Box
                  component="img"
                  sx={{
                    height: "50px",
                    width: "100px",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginTop: "8px",
                  }}
                  src=""
                  alt="random"
                ></Box> */}
              </Typography>
              <Button color="inherit" onClick={onLogout}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        </ClickAwayListener>
      )}
    </Box>
  );
}
