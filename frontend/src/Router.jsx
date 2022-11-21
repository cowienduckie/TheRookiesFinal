import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import {
  ManageAssetPage,
  ManageAssetAction,
  ManageAssetLoader,
  ManageUserAction,
  ManageUserLoader,
  ManageUserPage,
  ErrorPage,
  HomePage,
  ManageAssignmentPage,
  ManageAssignmentAction,
  ManageAssignmentLoader,
  ManageRequestForReturningPage,
  ManageRequestForReturningAction,
  ManageRequestForReturningLoader,
  ReportPage,
  ReportAction,
  ReportLoader,
  AdminPage,
  AdminPageLoader,
  LoginPage,
  LoginPageLoader,
  LogoutPage,
  ChangePasswordPage,
  ChangePasswordPageLoader,
} from "./Pages";

const adminRouter = {
  element: <AdminPage />,
  loader: AdminPageLoader,
  children: [
    {
      path: "/admin/user-management",
      element: <ManageUserPage />,
      loader: ManageUserLoader,
      action: ManageUserAction,
    },
    {
      path: "/admin/asset-management",
      element: <ManageAssetPage />,
      loader: ManageAssetLoader,
      action: ManageAssetAction,
    },
    {
      path: "/admin/assignment-management",
      element: <ManageAssignmentPage />,
      loader: ManageAssignmentLoader,
      action: ManageAssignmentAction,
    },
    {
      path: "/admin/returning-request-management",
      element: <ManageRequestForReturningPage />,
      loader: ManageRequestForReturningLoader,
      action: ManageRequestForReturningAction,
    },
    {
      path: "/admin/report",
      element: <ReportPage />,
      loader: ReportLoader,
      action: ReportAction,
    },
  ],
};

const authenticationRouter = [
  {
    path: "/login",
    element: <LoginPage />,
    loader: LoginPageLoader,
  },
  {
    path: "/change-password",
    element: <ChangePasswordPage />,
    loader: ChangePasswordPageLoader,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
];

const layoutRouter = {
  element: <LayoutPage />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: '/user-management',
      element: <ManageUserPage />,
      loader: ManageUserLoader,
      action: ManageUserAction,
    },
    {
      path: '/asset-management',
      element: <ManageAssetPage />,
      loader: ManageAssetLoader,
      action: ManageAssetAction,
    },
    {
      path: '/assignment-management',
      element: <ManageAssignmentPage />,
      loader: ManageAssignmentLoader,
      action: ManageAssignmentAction,
    },
    {
      path: '/returning-request-management',
      element: <RequestForReturningPage />,
      loader: RequestForReturningLoader,
      action: RequestForReturningAction,
    },
    {
      path: '/report',
      element: <ReportPage />,
      loader: ReportLoader,
      action: ReportAction,
    },
  ],
}

const changePasswordRouter = {
  path: '/password-change',
  // element: <ChangePasswordModal />,
  element: <ChangePasswordPage />,
  errorElement: <ErrorPage />,
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      adminRouter,
      ...authenticationRouter,
      changePasswordRouter],
  },
])
