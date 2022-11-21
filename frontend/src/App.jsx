import { Route, Routes, useLocation } from "react-router-dom";
import { AuthState } from "./Contexts/AuthState";
import {
  AdminPage,
  AdminPageLoader,
  ChangePasswordPage,
  ChangePasswordPageLoader,
  HomePage,
  LoginPage,
  LoginPageLoader,
  LogoutPage,
  MainLayout,
  ManageAssetAction,
  ManageAssetLoader,
  ManageAssetPage,
  ManageAssignmentAction,
  ManageAssignmentLoader,
  ManageAssignmentPage,
  ManageRequestForReturningAction,
  ManageRequestForReturningLoader,
  ManageRequestForReturningPage,
  ManageUserAction,
  ManageUserLoader,
  ManageUserPage,
  ReportAction,
  ReportLoader,
  ReportPage,
} from "./Pages";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  const mainRoutes = (
    <Routes location={background || location}>
      <Route path="/" element={<MainLayout />}>
        <Route index={true} element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} loader={AdminPageLoader}>
          <Route
            path="/admin/manage-asset"
            element={<ManageAssetPage />}
            loader={ManageAssetLoader}
            action={ManageAssetAction}
          />
          <Route
            path="/admin/manage-user"
            element={<ManageUserPage />}
            loader={ManageUserLoader}
            action={ManageUserAction}
          />
          <Route
            path="/admin/manage-assignment"
            element={<ManageAssignmentPage />}
            loader={ManageAssignmentLoader}
            action={ManageAssignmentAction}
          />
          <Route
            path="/admin/manage-returning"
            element={<ManageRequestForReturningPage />}
            loader={ManageRequestForReturningLoader}
            action={ManageRequestForReturningAction}
          />
          <Route
            path="/admin/report"
            element={<ReportPage />}
            loader={ReportLoader}
            action={ReportAction}
          />
        </Route>
        <Route path="/login" element={<LoginPage />} loader={LoginPageLoader} />
        <Route
          path="/change-password"
          element={<ChangePasswordPage />}
          loader={ChangePasswordPageLoader}
        />
        <Route path="/logout" element={<LogoutPage />} />
      </Route>
    </Routes>
  );

  const modalRoutes = (
    <Routes>
      <Route path="/login" element={<LoginPage />} loader={LoginPageLoader} />
      <Route
        path="/change-password"
        element={<ChangePasswordPage />}
        loader={ChangePasswordPageLoader}
      />
      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  );

  return (
    <AuthState>
      {mainRoutes}
      {background && modalRoutes}
    </AuthState>
  );
}

export default App;
