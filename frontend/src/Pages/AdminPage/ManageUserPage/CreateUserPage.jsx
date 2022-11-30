import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  ConfigProvider,
  Modal
} from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { createUser } from "../../../Apis/UserApis";
import {
  DOB_REQUIRED,
  DOB_UNDER_18,
  FIRST_NAME_REQUIRED,
  GENDER_REQUIRED,
  JOINED_DATE_NOT_LATER_DOB,
  JOINED_DATE_NOT_WEEKENDS,
  JOINED_DATE_REQUIRED,
  LAST_NAME_REQUIRED,
  NAME_MAX_LENGTH,
  NAME_ONLY_ALLOW,
  ROLE_REQUIRED
} from "../../../Constants/ErrorMessages";
import {
  GENDER_FEMALE_ENUM,
  GENDER_MALE_ENUM,
  ROLE_ADMIN_ENUM,
  ROLE_STAFF_ENUM
} from "../../../Constants/CreateUserConstants";

dayjs.extend(customParseFormat);

export function CreateUserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;
  const dateFormatList = ["YYYY/MM/DD", "YYYY/MM/DD"];

  const navigate = useNavigate();

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onFinish = async (values) => {
    values = {
      ...values,
      firstName: values.firstName.trim(),
      gender: parseInt(values.gender),
      role: parseInt(values.role)
    };
    await createUser(values).then((data) => {
      console.log(data);
      setIsModalOpen(true);
    });
  };

  const handleCancel = () => {
    navigate("/admin/manage-user");
  };

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 7 }
  };

  const tailLayout = {
    wrapperCol: { offset: 9 }
  };

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold text-red-600">Create New User</h1>
      <Form
        {...layout}
        form={form}
        name="formCreateUser"
        onFinish={onFinish}
        initialValues={{ gender: GENDER_FEMALE_ENUM }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: FIRST_NAME_REQUIRED },
            {
              pattern: /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
              message: NAME_ONLY_ALLOW
            },
            {
              min: 1,
              max: 255,
              message: NAME_MAX_LENGTH
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: LAST_NAME_REQUIRED },
            {
              pattern: /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
              message: NAME_ONLY_ALLOW
            },
            {
              min: 1,
              max: 255,
              message: NAME_MAX_LENGTH
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date Of Birth"
          rules={[
            { required: true, message: DOB_REQUIRED },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("dateOfBirth") <
                    dayjs().endOf("day").subtract(18, "year")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(DOB_UNDER_18));
              }
            })
          ]}
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            format={dateFormatList}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          className="text-red-600"
          rules={[{ required: true, message: GENDER_REQUIRED }]}
        >
          <Radio.Group>
            <ConfigProvider
              theme={{
                components: {
                  Radio: {
                    colorPrimary: "#FF0000"
                  }
                }
              }}
            >
              <Radio value={GENDER_FEMALE_ENUM}>Female</Radio>
              <Radio value={GENDER_MALE_ENUM}>Male</Radio>
            </ConfigProvider>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="joinedDate"
          label="Joined Date"
          rules={[
            { required: true, message: JOINED_DATE_REQUIRED },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  getFieldValue("dateOfBirth") === undefined 
                  ||
                  getFieldValue("joinedDate") > getFieldValue("dateOfBirth")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(JOINED_DATE_NOT_LATER_DOB));
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
                return Promise.reject(new Error(JOINED_DATE_NOT_WEEKENDS));
              }
            })
          ]}
          onClick={console.log()}
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            format={dateFormatList}
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Type"
          rules={[{ required: true, message: ROLE_REQUIRED }]}
        >
          <Select name="role">
            <Option value={ROLE_ADMIN_ENUM}>Admin</Option>
            <Option value={ROLE_STAFF_ENUM}>Staff</Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout} shouldUpdate>
          {() => (
            <div>
              <Button
                className="mx-2"
                type="primary"
                danger
                onSubmit={onFinish}
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(
                    [
                      "firstName",
                      "lastName",
                      "dateOfBirth",
                      "joinedDate",
                      "role"
                    ],
                    true
                  ) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
                }
              >
                Save
              </Button>
              <Button className="mx-3" danger onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>

      <Modal
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        closable={handleCancel}
        footer={[]}
      >
        <h1 className="mb-5 text-2xl font-bold text-red-600">
          Create User Successfully
        </h1>
        <p className="mb-8">New user is created successfully!</p>
        <Button
          className="content-end"
          danger
          key="back"
          onClick={handleCancel}
        >
          Close
        </Button>
      </Modal>
    </>
  );
}
