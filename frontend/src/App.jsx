import { Outlet } from "react-router-dom";
import { AuthState } from "./Contexts/AuthState";
import { MainLayout } from "./Pages";

function App() {
  return (
    <AuthState>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </AuthState>
  );
}

export default App;
