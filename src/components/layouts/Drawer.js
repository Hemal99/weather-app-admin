import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { toggleClose } from "../../store/actions/authActions";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";

const routes = [
  {
    route: "/dashboard",
    text: "Dashboard",
    icon: <DashboardIcon />,
  },
];

export default function TemporaryDrawer() {
  let token = useSelector((state) => state.auth.accessToken);
  let isDrawerOpen = useSelector((state) => state.auth.isDrawerOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDrawerClose = () => {
    dispatch(toggleClose());
  };

  const onRoute = (path) => {
    navigate(path);

    dispatch(toggleClose());
  };

  const onToggle = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    dispatch(toggleClose());
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={onToggle(anchor, false)}
      onKeyDown={onToggle(anchor, false)}
    >
      <List>
        {routes.map((ele, index) => (
          <ListItem
            key={ele.text}
            disablePadding
            onClick={() => onRoute(ele.route)}
          >
            <ListItemButton>
              <ListItemIcon>{ele.icon}</ListItemIcon>
              <ListItemText primary={ele.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {token && (
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          variant="persistent"
        >
          {list("left")}
        </Drawer>
      )}
    </div>
  );
}
