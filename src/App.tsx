import { useEffect } from "react";
import Calendar from "./Calendar";

const DATA = {
  PROJECT_NAME: "conservativBot",
  T_USER_ID: "749991690",
  TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjc0OTk5MTY5MCwiaWF0IjoxNzQ4MjYzODM0LCJleHAiOjE3Nzk3OTk4MzR9.bAYPe3BX0jnbH8kzS5STHcSwmR6kUiIQCXslT_v9aOo",
};

function App() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("project_name")) {
      window.location.href = `${window.location.pathname}?project_name=${DATA.PROJECT_NAME}&t_user_id=${DATA.T_USER_ID}&token=${DATA.TOKEN}`;
    }
  }, []);

  return (
    <div>
      <Calendar t_user_id={749991690} />
    </div>
  );
}

export default App;
