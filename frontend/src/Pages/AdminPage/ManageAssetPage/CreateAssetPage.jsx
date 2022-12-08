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
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  ASSET_MAX_LENGTH,
  ASSET_NAME_ONLY,
  ASSET_NAME_REQUIRED,
  CATEGORY_REQUIRED,
  INSTALLED_DATE_REQUIRED,
  SPECIFICATION_MAX_LENGTH,
  SPECIFICATION_NAME_ONLY,
  SPECIFICATION_REQUIRED,
  STATE_REQUIRED
} from "../../../Constants/ErrorMessages";
import {
  STATE_AVAILABLE_ENUM,
  STATE_NOT_AVAILABLE_ENUM
} from "../../../Constants/CreateAssetConstants";
import { getAllCategories } from "../../../Apis/CategoryApis";
import { createAsset } from "../../../Apis/AssetApis";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

function useLoader() {
  const location = useLocation();
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    const loadCategories = async () => {
      const res = await getAllCategories();

      setCategoryList(res);
    };

    loadCategories();
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    categoryList
  };
}

export function CreateAssetPage() {
  const { categoryList } = useLoader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdAsset, setCreatedAsset] = useState({});
  const location = useLocation();
  const [form] = Form.useForm();
  const dateFormat = "YYYY/MM/DD";

  const navigate = useNavigate();

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onFinish = async (values) => {
    values = {
      ...values,
      name: values.name.trim(),
      categoryId: values.categoryId,
      installedDate: dayjs(values.installedDate).add(7, "h"),
      state: parseInt(values.state)
    };
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[2] = true;
      return newLoadings;
    });

    await createAsset(values)
      .then((data) => {
        setCreatedAsset(data);
        setIsModalOpen(true);
      })
      .finally(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[2] = false;
          return newLoadings;
        });
      });
  };

  const handleCancel = () => {
    navigate("/admin/manage-asset");
  };

  const handleSuccess = () => {
    navigate("/admin/manage-asset", { state: { newAsset: createdAsset } });
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
      <h1 className="mb-5 text-2xl font-bold text-red-600">Create New Asset</h1>
      <Form
        {...layout}
        form={form}
        name="formCreateAsset"
        onFinish={onFinish}
        initialValues={{ state: STATE_AVAILABLE_ENUM }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: ASSET_NAME_REQUIRED },
            {
              pattern: /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/,
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
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: CATEGORY_REQUIRED }]}
        >
          <Select
            name="categoryId"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Link
                  to="/admin/manage-asset/create-category"
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
            options={categoryList.map((value) => ({
              label: value.name,
              value: value.id
            }))}
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
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(
                    ["name", "categoryId", "installedDate", "specification"],
                    true
                  ) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
                }
                loading={loadings[2]}
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
        onOk={handleSuccess}
        onCancel={handleSuccess}
        closable={handleSuccess}
        footer={[]}
      >
        <h1 className="mb-5 text-2xl font-bold text-red-600">
          Create Asset Successfully
        </h1>
        <p className="mb-8">New asset is created successfully!</p>
        <Button
          className="content-end"
          danger
          key="back"
          onClick={handleSuccess}
        >
          Close
        </Button>
      </Modal>
    </>
  );
}
