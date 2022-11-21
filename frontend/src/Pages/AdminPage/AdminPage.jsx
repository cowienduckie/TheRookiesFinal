import { Outlet } from "react-router-dom";

export function loader() {
  // TODO: Authorization here
}

export function AdminPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
