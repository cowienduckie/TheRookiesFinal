import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  ConfigProvider,
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function CreateUserPage() {
  const [form] = Form.useForm();
  const { Option } = Select;
  const navigate = useNavigate();
  const onFinish = () => {
    navigate("/");
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const handleSubmit = () => {
    navigate("/admin/manage-user");
  };

  const handleCancel = () => {
    navigate("/admin/manage-user");
  };

  //let newDate = new Date();
  //let date = newDate.getDay();

  const consoleLog = () => {
    //console.log(dayjs().get("day", 0));
    // console.log(getFieldValue("joinedDate").getDay())
  };

  const layout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 10,
    },
  };

  return (
    <>
      <h1 className="text-2xl text-red-600 font-bold mb-5">Create User Page</h1>
      <Form
        {...layout}
        form={form}
        name="nest-messages"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="firstName"
          label="FirstName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="LastName"
          label="LastName"
          rules={[{ required: true }]}
        >
          <Input />
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
              },
            }),
          ]}
        >
          <DatePicker disabledDate={disabledDate} />
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
                    colorPrimary: "#FF0000",
                  },
                },
              }}
            >
              <Radio value="Female">Female</Radio>
              <Radio value="Male">Male</Radio>
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
              },
            }),
            ({ getFieldValue }) => ({
              validator(_, value) {
                // const dayOfWeek = getFieldValue("joinedDate").getDay();
                // const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
                if (
                  !value ||
                  getFieldValue("joinedDate") !== dayjs().get("day", 0)
                  //value.getDay() !== 6
                  //   getFieldValue("joinedDate") !== dayjs().weekday(0)
                  //   ||
                  //   getFieldValue("joinedDate") !== dayjs().isoWeekday(6)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Joined date is Saturday or Sunday. Please select a different date"
                  )
                );
              },
            }),
          ]}
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please pick an user type!" }]}
        >
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="staff">Staff</Option>
          </Select>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 6,
          }}
        >
          <Button
            className="mx-2"
            type="primary"
            danger
            onSubmit={handleSubmit}
            htmlType="submit"
          >
            Submit
          </Button>
          <Button className="mx-2" danger onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="mx-2" danger onClick={consoleLog}>
            Log
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
