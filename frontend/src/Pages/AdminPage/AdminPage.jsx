import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import { STAFF } from "../../Constants/SystemConstants";

export function AdminPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const role = authContext.userRole;

    if (role === null || role === "") {
      return navigate("/login");
    }
  
    if (role === STAFF) {
      return navigate("/");
    }
  })

  return (
    <>
      <Outlet />
    </>
  );
}
