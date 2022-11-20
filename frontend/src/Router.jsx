import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import {
  ManageAssetPage,
  ManageAssetAction,
  ManageAssetLoader,
  ManageUserAction,
  ManageUserLoader,
  ManageUserPage,
  ErrorPage,
  HomePage,
  LayoutPage,
  ManageAssignmentPage,
  ManageAssignmentAction,
  ManageAssignmentLoader,
  RequestForReturningPage,
  RequestForReturningAction,
  RequestForReturningLoader,
  ReportPage,
  ReportAction,
  ReportLoader,
} from './Pages'

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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [layoutRouter],
  },
])
