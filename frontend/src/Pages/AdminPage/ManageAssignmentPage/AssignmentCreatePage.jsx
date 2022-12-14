import { Button, DatePicker, Form, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  ASSIGNED_DATE_REQUIRED,
  NOTE_RANGE_FROM_6_TO_255_CHARACTERS
} from "../../../Constants/ErrorMessages";
import { createAssignment } from "../../../Apis/AssignmentApis";

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 }
};

const tailLayout = {
  wrapperCol: { offset: 9 }
};

const dateFormat = "DD/MM/YYYY";

const disabledDate = (current) => {
  return current && current < dayjs().startOf("day");
};

function useLoader() {
  const location = useLocation();
  const user = location.state && location.state.user;
  const asset = location.state && location.state.asset;

  const [assignedUser, setAssignedUser] = useState();
  const [assignedAsset, setAssignedAsset] = useState();

  useEffect(() => {
    if (!!user) {
      setAssignedUser(user);
    }

    if (!!asset) {
      setAssignedAsset(asset);
    }
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return { assignedUser, assignedAsset };
}

export function AssignmentCreatePage() {
  const { assignedUser, assignedAsset } = useLoader();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadings, setLoadings] = useState([]);

  const setLoadingByIndex = (index, isLoading) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = isLoading;
      return newLoadings;
    });
  };

  const handleSearchUser = () => {
    setLoadingByIndex(1, true);

    navigate("/admin/manage-assignment/create-assignment/user-list", {
      state: { background: location }
    });

    setLoadingByIndex(1, false);
  };

  const handleSearchAsset = () => {
    setLoadingByIndex(2, true);

    navigate("/admin/manage-assignment/create-assignment/asset-list", {
      state: { background: location }
    });

    setLoadingByIndex(2, false);
  };

  const handleFormSubmit = async (values) => {
    setLoadingByIndex(0, true);

    const inputData = {
      assignedTo: assignedUser && assignedUser.id,
      assetId: assignedAsset && assignedAsset.id,
      assignedDate: dayjs(values.assignedDate)
        .add(7, "h")
        .utcOffset(0)
        .startOf("date"),
      note: values.note && values.note.trim()
    };

    await createAssignment(inputData)
      .then((data) => {
        navigate("/admin/manage-assignment", {
          state: { newAssignment: data }
        });
      })
      .finally(() => {
        setLoadingByIndex(0, false);
      });
  };

  const handleFormCancel = () => {
    navigate("/admin/manage-assignment");
  };

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold text-red-600">
        Create New Assignment
      </h1>
      <br />
      <Form
        {...formLayout}
        labelAlign="left"
        form={form}
        name="formCreateAssignment"
        onFinish={handleFormSubmit}
        initialValues={{
          assignedDate: dayjs()
        }}
      >
        <Form.Item name="user" label="User" required>
          <Input.Group compact className="flex flex-row">
            <Input value={assignedUser && assignedUser.username} disabled />
            <Button
              type="primary"
              className="bg-gray-400 px-2"
              icon={<SearchOutlined className="align-middle" />}
              loading={loadings[1]}
              onClick={handleSearchUser}
            />
          </Input.Group>
        </Form.Item>
        <Form.Item name="asset" label="Asset" required>
          <Input.Group compact className="flex flex-row">
            <Input value={assignedAsset && assignedAsset.name} disabled />
            <Button
              type="primary"
              className="bg-gray-400 px-2"
              icon={<SearchOutlined className="align-middle" />}
              loading={loadings[2]}
              onClick={handleSearchAsset}
            />
          </Input.Group>
        </Form.Item>
        <Form.Item
          name="assignedDate"
          label="Assigned Date"
          rules={[{ required: true, message: ASSIGNED_DATE_REQUIRED }]}
        >
          <DatePicker
            className="min-w-full cursor-pointer"
            disabledDate={disabledDate}
            format={(date) => date.utc().format(dateFormat)}
          />
        </Form.Item>
        <Form.Item
          name="note"
          label="Note"
          rules={[
            {
              min: 6,
              max: 255,
              message: NOTE_RANGE_FROM_6_TO_255_CHARACTERS
            }
          ]}
        >
          <Input.TextArea style={{ height: 150 }} showCount maxLength={255} />
        </Form.Item>
        <Form.Item {...tailLayout} shouldUpdate>
          {() => (
            <div>
              <Button
                className="mr-2"
                type="primary"
                danger
                htmlType="submit"
                disabled={
                  !(!!assignedUser && !!assignedUser.id) ||
                  !(!!assignedAsset && !!assignedAsset.id) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
                }
                loading={loadings[0]}
              >
                Save
              </Button>
              <Button className="ml-2" danger onClick={handleFormCancel}>
                Cancel
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </>
  );
}
