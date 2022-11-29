//import { Button } from "antd";
import { Outlet } from "react-router-dom";

export function ManageUserPage() {
  return (
    <>
      {/* <Button type="primary" danger>
        Edit
      </Button> */}
      <Outlet />
    </>
  );
}
