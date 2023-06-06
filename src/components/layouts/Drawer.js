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
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentsIcon from "@mui/icons-material/Payments";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FeedIcon from "@mui/icons-material/Feed";
import BackpackIcon from "@mui/icons-material/Backpack";

const routes = [
  {
    route: "/studentDetail",
    text: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    route: "/studentPaymentDetail",
    text: "Payment",
    icon: <PaymentIcon />,
  },
  {
    route: "/studyPackPaymentDetail",
    text: "Study Pack Payment",
    icon: <PaymentsIcon />,
  },
  {
    route: "/manageLessons",
    text: "Lessons",
    icon: <PlayLessonIcon />,
  },
  {
    route: "/manageVideo",
    text: "Videos",
    icon: <OndemandVideoIcon />,
  },

  {
    route: "/managePdf",
    text: "Tutes",
    icon: <PictureAsPdfIcon />,
  },
  {
    route: "/managePaper",
    text: "Papers",
    icon: <FeedIcon />,
  },

  {
    route: "/manageStudyPack",
    text: "Study Pack",
    icon: <BackpackIcon />,
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
