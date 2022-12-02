import { Route, Routes, useLocation } from "react-router-dom";
import { AuthState } from "./Contexts/AuthState";
import {
  AdminPage,
  ChangePasswordFirstTimePage,
  ChangePasswordPage,
  CreateUserPage,
  EditUserPage,
  HomePage,
  LoginPage,
  LogoutPage,
  MainLayout,
  ManageAssetPage,
  ManageAssignmentPage,
  ManageRequestForReturningPage,
  ManageUserPage,
  ReportPage,
  UserListPage,
  DetailedInfoUserPage,
  DisableUserPage,
  CreateAssetPage,
  CreateCategoryPage,
  EditAssetPage
} from "./Pages";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  const mainRoutes = (
    <Routes location={background || location}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index={true} element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route path="/admin/manage-asset" element={<ManageAssetPage />}>
            <Route
              path="/admin/manage-asset/create-asset"
              element={<CreateAssetPage />}
            />
            <Route
              path="/admin/manage-asset/edit-asset"
              element={<EditAssetPage />}
            />
          </Route>
          <Route path="/admin/manage-user" element={<ManageUserPage />}>
            <Route index={true} element={<UserListPage />} />
            <Route
              path="/admin/manage-user/create-user"
              element={<CreateUserPage />}
            />
            <Route
              path="/admin/manage-user/:id"
              element={<DetailedInfoUserPage />}
            />
            <Route
              path="/admin/manage-user/edit-user/:userId"
              element={<EditUserPage />}
            />
            <Route
              path="/admin/manage-user/disable/:id"
              element={<DisableUserPage />}
            />
          </Route>
          <Route
            path="/admin/manage-assignment"
            element={<ManageAssignmentPage />}
          />
          <Route
            path="/admin/manage-returning"
            element={<ManageRequestForReturningPage />}
          />
          <Route path="/admin/report" element={<ReportPage />} />
        </Route>
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route
          path="/change-password-first-time"
          element={<ChangePasswordFirstTimePage />}
        />
        <Route path="/logout" element={<LogoutPage />} />
      </Route>
    </Routes>
  );

  const modalRoutes = (
    <Routes>
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route
        path="/change-password-first-time"
        element={<ChangePasswordFirstTimePage />}
      />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/admin/manage-user/:id" element={<DetailedInfoUserPage />} />
      <Route
        path="/admin/manage-user/disable/:id"
        element={<DisableUserPage />}
      />
      <Route
        path="/admin/manage-asset/create-asset/create-category"
        element={<CreateCategoryPage />}
      />
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
