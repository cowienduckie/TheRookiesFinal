import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  ConfigProvider,
  Modal,
  Space
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  ASSET_MAX_LENGTH,
  ASSET_NAME_ONLY,
  ASSET_NAME_REQUIRED,
  INSTALLED_DATE_REQUIRED,
  SPECIFICATION_MAX_LENGTH,
  SPECIFICATION_NAME_ONLY,
  SPECIFICATION_REQUIRED,
  STATE_REQUIRED
} from "../../../Constants/ErrorMessages";
import {
  STATE_AVAILABLE_ENUM,
  STATE_NOT_AVAILABLE_ENUM,
  STATE_RECYCLED_ENUM,
  STATE_WAITING_FOR_RECYCLING_ENUM
} from "../../../Constants/CreateAssetConstants";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export function EditAssetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [form] = Form.useForm();
  const dateFormat = "YYYY/MM/DD";

  const navigate = useNavigate();

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onFinish = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    navigate("/admin/manage-asset");
  };

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 7 }
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

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold text-red-600">Edit Asset</h1>
      <Form
        {...layout}
        form={form}
        name="formEditAsset"
        onFinish={onFinish}
        initialValues={{ state: STATE_AVAILABLE_ENUM }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: ASSET_NAME_REQUIRED },
            {
              pattern: /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
              message: ASSET_NAME_ONLY
            },
            {
              min: 6,
              max: 50,
              message: ASSET_MAX_LENGTH
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          //rules={[{ required: true, message: ROLE_REQUIRED }]}
        >
          <Select
            disabled
            name="role"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Link
                  to="/admin/manage-asset/create-asset/create-category"
                  state={{ background: location }}
                >
                  <Button
                    type="text"
                    style={{ textAlign: "left" }}
                    block
                    onClick={() => enterLoading(1)}
                    loading={loadings[1]}
                  >
                    <em style={{ fontStyle: "normal", color: "red" }}>+ </em>
                    Add New Category
                  </Button>
                </Link>
              </>
            )}
            options={[
              { value: "first", label: "First Category" },
              { value: "second", label: "Second Category" }
            ]}
          />
        </Form.Item>

        <Form.Item
          name="specification"
          label="Specification"
          rules={[
            { required: true, message: SPECIFICATION_REQUIRED },
            {
              pattern:
                /^([a-zA-Z0-9!*_@#$%^&+=<>|.,:;"'{})(-/`~]+\s)*[a-zA-Z0-9!*_@#$%^&+=<>|.,:;"'{})(-/`~]+$/,
              message: SPECIFICATION_NAME_ONLY
            },
            {
              min: 6,
              max: 255,
              message: SPECIFICATION_MAX_LENGTH
            }
          ]}
        >
          <Input.TextArea style={{ height: 100 }}></Input.TextArea>
        </Form.Item>

        <Form.Item
          name="installedDate"
          label="Installed Date"
          rules={[{ required: true, message: INSTALLED_DATE_REQUIRED }]}
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            format={(date) => date.utc().format(dateFormat)}
          />
        </Form.Item>

        <Form.Item
          name="state"
          label="State"
          className="text-red-600"
          rules={[{ required: true, message: STATE_REQUIRED }]}
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
              <Space direction="vertical">
                <Radio value={STATE_AVAILABLE_ENUM}>Available</Radio>
                <Radio value={STATE_NOT_AVAILABLE_ENUM}>Not available</Radio>
                <Radio value={STATE_WAITING_FOR_RECYCLING_ENUM}>
                  Waiting for recycling
                </Radio>
                <Radio value={STATE_RECYCLED_ENUM}>Recycled</Radio>
              </Space>
            </ConfigProvider>
          </Radio.Group>
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
                    ["name", "installedDate", "specification"],
                    true
                  ) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
                }
                onClick={() => enterLoading(1)}
                loading={loadings[1]}
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
          Eddit Asset Successfully
        </h1>
        <p className="mb-8">Asset is edited successfully!</p>
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
