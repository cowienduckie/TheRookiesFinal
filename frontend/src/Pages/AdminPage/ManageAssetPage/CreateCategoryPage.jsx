import { Form, Input, Button, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_NAME_ONLY,
  CATEGORY_NAME_REQUIRED,
  CATEGORY_PREFIX_MAX_LENGTH,
  CATEGORY_PREFIX_ONLY,
  CATEGORY_PREFIX_REQUIRED
} from "../../../Constants/ErrorMessages";
import { CheckNullValidation } from "../../../Helpers";

export function CreateCategoryPage() {
  const [isModalCategoryOpen] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1);
  };
  const onFinish = () => {
    navigate(-1);
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

  const tailLayout = {
    wrapperCol: { offset: 9 }
  };

  return (
    <Modal
      open={isModalCategoryOpen}
      onOk={handleCancel}
      onCancel={handleCancel}
      closable={handleCancel}
      footer={[]}
    >
      <h1 className="mb-5 text-2xl font-bold text-red-600">
        Create New Category
      </h1>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        labelCol={{
          span: 8
        }}
        wrapperCol={{
          span: 16
        }}
      >
        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[
            CheckNullValidation(CATEGORY_NAME_REQUIRED, "categoryName"),
            {
              pattern: /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/,
              message: CATEGORY_NAME_ONLY
            },
            {
              min: 6,
              max: 50,
              message: CATEGORY_NAME_MAX_LENGTH
            }
          ]}
        >
          <Input style={{ width: "80%" }} />
        </Form.Item>
        <Form.Item
          label="Category Prefix"
          name="categoryPrefix"
          rules={[
            CheckNullValidation(CATEGORY_PREFIX_REQUIRED, "categoryPrefix"),
            {
              pattern: /^[A-Z]+$/,
              message: CATEGORY_PREFIX_ONLY
            },
            {
              min: 2,
              max: 8,
              message: CATEGORY_PREFIX_MAX_LENGTH
            }
          ]}
        >
          <Input style={{ width: "80%" }} />
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
                  !form.isFieldsTouched(true) ||
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
    </Modal>
  );
}
