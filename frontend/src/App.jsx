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
  ManageRequestForReturningListPage,
  ManageUserPage,
  ReportPage,
  UserListPage,
  DetailedInfoUserPage,
  DisableUserPage,
  DeleteAssetPage,
  AssetListPage,
  AssetDetailPage,
  DetailedInfoHomePage,
  AcceptAssignmentPage,
  DeclineAssignmentPage,
  ReturnAssignmentPage,
  AssignmentDetailPage,
  AssignmentListPage,
  CreateAssetPage,
  CreateCategoryPage
} from "./Pages";
import {
  AssetListModal,
  AssignmentCreatePage,
  AssignmentDeletePage,
  UserListModal
} from "./Pages/AdminPage/ManageAssignmentPage";

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
              path="/admin/manage-asset/delete-asset/:id"
              element={<DeleteAssetPage />}
            />
            <Route
              path="/admin/manage-asset/create-asset"
              element={<CreateAssetPage />}
            />
            <Route
              path="/admin/manage-asset/create-category"
              element={<CreateCategoryPage />}
            />
            <Route index={true} element={<AssetListPage />} />
            <Route
              path="/admin/manage-asset/:assetId"
              element={<AssetDetailPage />}
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
          >
            <Route index={true} element={<AssignmentListPage />} />
            <Route
              path="/admin/manage-assignment/:assignmentId"
              element={<AssignmentDetailPage />}
            />
            <Route
              path="/admin/manage-assignment/create-assignment"
              element={<AssignmentCreatePage />}
            >
              <Route
                path="/admin/manage-assignment/create-assignment/user-list"
                element={<UserListModal />}
              />
              <Route
                path="/admin/manage-assignment/create-assignment/asset-list"
                element={<AssetListModal />}
              />
            </Route>
            <Route
              path="/admin/manage-assignment/delete-assignment/:id"
              element={<AssignmentDeletePage />}
            ></Route>
          </Route>
          <Route
            path="/admin/manage-returning"
            element={<ManageRequestForReturningPage />}
          >
            <Route
              index={true}
              element={<ManageRequestForReturningListPage />}
            />
          </Route>
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
        path="/admin/manage-asset/delete-asset/:id"
        element={<DeleteAssetPage />}
      />
      <Route
        path="/assignments/:assignmentId"
        element={<DetailedInfoHomePage />}
      />
      <Route
        path="/admin/manage-asset/:assetId"
        element={<AssetDetailPage />}
      />
      <Route
        path="/assignments/:assignmentId"
        element={<DetailedInfoHomePage />}
      />
      <Route
        path="/assignments/accept/:assignmentId"
        element={<AcceptAssignmentPage />}
      />
      <Route
        path="/assignments/decline/:assignmentId"
        element={<DeclineAssignmentPage />}
      />
      <Route
        path="/assignments/return/:assignmentId"
        element={<ReturnAssignmentPage />}
      />
      <Route
        path="/admin/manage-asset/create-category"
        element={<CreateCategoryPage />}
      />
      <Route
        path="/admin/manage-assignment/delete-assignment/:id"
        element={<AssignmentDeletePage />}
      />
      <Route
        path="/admin/manage-assignment/:assignmentId"
        element={<AssignmentDetailPage />}
      />
      <Route
        path="/admin/manage-assignment/create-assignment/user-list"
        element={<UserListModal />}
      />
      <Route
        path="/admin/manage-assignment/create-assignment/asset-list"
        element={<AssetListModal />}
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
