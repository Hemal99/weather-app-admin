
import PromptList from "screens/prompts/PromptList";
import EditPrompt from "screens/prompts/AddPrompt";
import UserList from "screens/dashboard/Dashboard";

export const routes = [

  {
    name: "home",
    element: <UserList />,
    path: "/users",
  },

  {
    name: "prompts",
    element: <PromptList />,
    path: "/prompts",
  },
  {
    name:"edit-prompt",
    element: <EditPrompt />,
    path: "/edit-prompt/:id",
  }
];
