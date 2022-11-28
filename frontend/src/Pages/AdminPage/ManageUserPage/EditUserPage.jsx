import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DatePicker,
  Form,
  Input,
  Button,
  Radio,
  Select,
  ConfigProvider
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { editUser } from "../../../Apis/EditUserApis";
dayjs.extend(customParseFormat);

export function EditUserPage() {
  const navigate = useNavigate();
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 5 }
  };

  const tailLayout = {
    wrapperCol: { offset: 3 }
  };

  const handleCancel = () => {
    navigate("/admin/manage-user");
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onFinish = async (values) => {
    await editUser(values)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Form {...layout} onFinish={onFinish}>
        <h1 className="text-2xl text-red-600 font-bold mb-5">Edit User</h1>
        <Form.Item label="First Name">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          label="Date Of Birth"
          rules={[
            { required: true, message: "Please enter your date of birth" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("dateOfBirth") <
                    dayjs().endOf("day").subtract(18, "year")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("User is under 18. Please select a different date")
                );
              }
            })
          ]}
        >
          <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item
          name="radio-button"
          label="Gender"
          class="text-red-600"
          rules={[{ required: true, message: "Please pick your gender!" }]}
        >
          <Radio.Group>
            <ConfigProvider
              theme={{
                components: {
                  Radio: {
                    colorPrimary: "#cf1322"
                  }
                }
              }}
            >
              <Radio value="female"> Female </Radio>
              <Radio value="male"> Male </Radio>
            </ConfigProvider>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="joinedDate"
          label="Joined Date"
          rules={[
            { required: true, message: "Please enter your joined date" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("joinedDate") > getFieldValue("dateOfBirth")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Joined date is not later than Date of Birth. Please select a different date"
                  )
                );
              }
            }),
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  (getFieldValue("joinedDate").day() !== 0 &&
                    getFieldValue("joinedDate").day() !== 6)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Joined date is Saturday or Sunday. Please select a different date"
                  )
                );
              }
            })
          ]}
        >
          <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item
          label="Type"
          rules={[{ required: true, message: "Please pick an user type!" }]}
        >
          <Select>
            <Select.Option value="staff">Staff</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className="mx-2" type="primary" danger onSubmit={onFinish}>
            Save
          </Button>

          <Button className="mx-5" onClick={handleCancel} danger>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
