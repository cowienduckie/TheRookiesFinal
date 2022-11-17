import { Outlet } from "react-router-dom";
import { AuthState } from "./Contexts/AuthState";

function App() {
  return(
    <AuthState>
      <Outlet />
    </AuthState>
  );
}

export default App;
