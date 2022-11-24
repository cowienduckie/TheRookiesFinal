import { Outlet } from "react-router-dom";

export function ManageUserPage() {
  return (
    <>
      <h1>User Management Page</h1>
      <Outlet/>
    </>
  );
}
