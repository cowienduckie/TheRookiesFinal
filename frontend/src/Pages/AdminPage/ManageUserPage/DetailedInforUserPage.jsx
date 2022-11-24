import { Divider, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";

export function DetailedInforUserPage() {
  let { id } = useParams();
  console.log(id);
  return (
    <>
      <Modal open={true} closable={false} footer={false}>
        <div className=" flex justify-between content-center">
          <h1 className="text-2xl text-red-600 font-bold">
            Detail User Information
          </h1>
          <button className="border border-red-600 text-red-600 pb-1 pl-1 pr-1 rounded h-fit">
            <CloseOutlined />
          </button>
        </div>
        <Divider />
        <div>
          <table className="border-separate border-spacing-5 ml-10">
            <tbody>
              <tr>
                <td>Staff Code:</td>
                <td>SD1901</td>
              </tr>
              <tr>
                <td>Full Name:</td>
                <td>An Nguyen Thuy</td>
              </tr>
              <tr>
                <td>User Name:</td>
                <td>annt</td>
              </tr>
              <tr>
                <td>Date of birth:</td>
                <td>29/04/1993</td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>Female</td>
              </tr>
              <tr>
                <td>Type:</td>
                <td>Staff</td>
              </tr>
              <tr>
                <td>Location:</td>
                <td>Hanoi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
