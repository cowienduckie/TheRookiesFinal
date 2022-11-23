import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export function ManageUserPage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/admin/manage-user/create-user");
  };

  return (
    <>
      <h1>User Management Page</h1>
      <Button className="mx-2" type="primary" danger onClick={handleCreate}>
        Create new user
      </Button>
    </>
  );
}
