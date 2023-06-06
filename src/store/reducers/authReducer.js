import { LOGIN, LOGOUT, DRAWERCLOSE, DRAWEROPEN } from "../actions/types";

const initialState = {
  accessToken: sessionStorage.getItem("accessToken"),
};
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, ...action.payload };

    case LOGOUT:
      return {
        accessToken: "",
      };

    case DRAWEROPEN:
      return { ...state, isDrawerOpen: true };
    case DRAWERCLOSE:
      return { ...state, isDrawerOpen: false };
    default:
      return state;
  }
}
