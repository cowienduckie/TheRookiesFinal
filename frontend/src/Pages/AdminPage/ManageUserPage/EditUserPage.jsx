import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DatePicker,
  Form,
  Input,
  Button,
  Radio,
  Select,
  ConfigProvider,
  Modal
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { editUser, getUserById } from "../../../Apis/UserApis";
import {
  DOB_REQUIRED,
  DOB_UNDER_18,
  GENDER_REQUIRED,
  JOINED_DATE_NOT_LATER_DOB,
  JOINED_DATE_NOT_WEEKENDS,
  JOINED_DATE_REQUIRED,
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

export function EditUserPage() {
  const navigate = useNavigate();

  const { userId } = useParams();

  const [form] = Form.useForm();

  const dateFormat = "YYYY/MM/DD";
  const [updatedUser, setUpdatedUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getUserById(userId).then((res) => {
      form.setFieldValue("firstName", res.firstName);
      form.setFieldValue("lastName", res.lastName);
      form.setFieldValue("gender", res.gender === "Male" ? "0" : "1");
      form.setFieldValue(
        "dateOfBirth",
        dayjs.utc(res.dateOfBirth, "DD/MM/YYYY")
      );
      form.setFieldValue("role", res.role === "Admin" ? "0" : "1");
      form.setFieldValue("joinedDate", dayjs.utc(res.joinedDate, "DD/MM/YYYY"));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 }
  };

  const tailLayout = {
    wrapperCol: { offset: 9 }
  };

  const [loadings, setLoadings] = useState([]);
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };

  const handleCancelModal = () => {
    navigate("/admin/manage-user", { state: { newUser: updatedUser } });
  };

  const handleCancelForm = () => {
    navigate(-1);
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onFinish = async (values) => {
    values = {
      ...values,
      role: parseInt(values.role),
      gender: parseInt(values.gender),
      id: userId,
      dateOfBirth: dayjs(values.dateOfBirth)
        .add(7, "h")
        .utcOffset(0)
        .startOf("date"),
      joinedDate: dayjs(values.joinedDate)
        .add(7, "h")
        .utcOffset(0)
        .startOf("date")
    };

    await editUser(values).then((data) => {
      setUpdatedUser(data);
      setIsModalOpen(true);
    });
  };

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold text-red-600">Edit User</h1>
      <br />
      <Form {...layout} labelAlign="left" onFinish={onFinish} form={form}>
        <Form.Item label="First Name" name="firstName">
          <Input style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName">
          <Input style={{ width: "100%" }} disabled />
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
            style={{ width: "100%" }}
            disabledDate={disabledDate}
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
                    colorPrimary: "#cf1322"
                  }
                }
              }}
            >
              <Radio value={GENDER_FEMALE_ENUM}> Female </Radio>
              <Radio value={GENDER_MALE_ENUM}> Male </Radio>
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
                  !value ||
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
            style={{ width: "100%" }}
            disabledDate={disabledDate}
            format={dateFormat}
          />
        </Form.Item>
        <Form.Item
          label="Type"
          name="role"
          rules={[{ required: true, message: ROLE_REQUIRED }]}
        >
          <Select style={{ width: "100%" }}>
            <Select.Option value={ROLE_ADMIN_ENUM}>Admin</Select.Option>
            <Select.Option value={ROLE_STAFF_ENUM}>Staff</Select.Option>
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
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
                }
                onClick={() => enterLoading(1)}
                loading={loadings[1]}
              >
                Save
              </Button>
              <Button className="mx-5" onClick={handleCancelForm} danger>
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
          Edit User Successfully
        </h1>
        <p className="mb-8">User information is updated successfully</p>
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
