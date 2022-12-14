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
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
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

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export function CreateUserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdUser, setCreatedUser] = useState({});
  const [form] = Form.useForm();
  const { Option } = Select;
  const dateFormat = "YYYY/MM/DD";

  const navigate = useNavigate();

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onFinish = async (values) => {
    values = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      gender: parseInt(values.gender),
      role: parseInt(values.role),
      dateOfBirth: dayjs(values.dateOfBirth)
        .add(7, "h")
        .utcOffset(0)
        .startOf("date"),
      joinedDate: dayjs(values.joinedDate)
        .add(7, "h")
        .utcOffset(0)
        .startOf("date")
    };
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[1] = true;
      return newLoadings;
    });

    await createUser(values)
      .then((data) => {
        setCreatedUser(data);
        setIsModalOpen(true);
      })
      .finally(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[1] = false;
          return newLoadings;
        });
      });
  };

  const handleCancelModal = () => {
    navigate("/admin/manage-user", { state: { newUser: createdUser } });
  };

  const handleCancelForm = () => {
    navigate(-1);
  };

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 }
  };

  const tailLayout = {
    wrapperCol: { offset: 9 }
  };

  const [loadings, setLoadings] = useState([]);

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold text-red-600">Create New User</h1>
      <br />
      <Form
        {...layout}
        labelAlign="left"
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
          <Input style={{ width: "100%" }} />
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
          <Input style={{ width: "100%" }} />
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
            format={dateFormat}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          className="text-red-600"
          rules={[{ required: true, message: GENDER_REQUIRED }]}
        >
          <Radio.Group style={{ width: "100%" }}>
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
                  getFieldValue("dateOfBirth") === undefined ||
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
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            format={dateFormat}
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Type"
          rules={[{ required: true, message: ROLE_REQUIRED }]}
        >
          <Select name="role" style={{ width: "100%" }}>
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
                loading={loadings[1]}
              >
                Save
              </Button>
              <Button className="mx-3" danger onClick={handleCancelForm}>
                Cancel
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>

      <Modal
        open={isModalOpen}
        onOk={handleCancelModal}
        onCancel={handleCancelModal}
        closable={handleCancelModal}
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
          onClick={handleCancelModal}
        >
          Close
        </Button>
      </Modal>
    </>
  );
}
