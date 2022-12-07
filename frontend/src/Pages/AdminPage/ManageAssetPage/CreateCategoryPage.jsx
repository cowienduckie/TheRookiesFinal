import { Form, Input, Button, Modal } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../Apis/CategoryApis";
import {
  CATEGORY_NAME_EXISTED,
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_NAME_ONLY,
  CATEGORY_NAME_REQUIRED,
  CATEGORY_PREFIX_EXISTED,
  CATEGORY_PREFIX_MAX_LENGTH,
  CATEGORY_PREFIX_ONLY,
  CATEGORY_PREFIX_REQUIRED
} from "../../../Constants/ErrorMessages";
import { CheckNullValidation } from "../../../Helpers";

export function CreateCategoryPage() {
  const [isModalCategoryOpen, setIsModalCategoryOpen] = useState(true);
  const [isCreateSuccessfully, setIsCreateSuccessfully] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/admin/manage-asset/create-asset");
  };

  const [backendError, setBackendError] = useState({
    isError: false,
    message: ""
  });

  const onFinish = async (values) => {
    values = {
      ...values
    };
    await createCategory(values)
      .then((data) => {
        setIsCreateSuccessfully(true);
        setIsModalCategoryOpen(false);
      })
      .catch((error) => {
        setBackendError({ isError: true, message: error.statusText });
      });
  };

  useEffect(() => {
    form.validateFields();
  }, [backendError, form]);

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
    <>
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
            name="name"
            rules={[
              CheckNullValidation(CATEGORY_NAME_REQUIRED, "name"),
              {
                pattern: /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/,
                message: CATEGORY_NAME_ONLY
              },
              {
                min: 6,
                max: 50,
                message: CATEGORY_NAME_MAX_LENGTH
              },
              {
                validator() {
                  if (
                    backendError.isError &&
                    backendError.message === CATEGORY_NAME_EXISTED
                  ) {
                    return Promise.reject(new Error(backendError.message));
                  } else {
                    return Promise.resolve();
                  }
                }
              }
            ]}
          >
            <Input
              onChange={() => {
                if (backendError.isError)
                  setBackendError({ isError: false, message: "" });
              }}
              style={{ width: "80%" }}
            />
          </Form.Item>
          <Form.Item
            label="Category Prefix"
            name="prefix"
            rules={[
              CheckNullValidation(CATEGORY_PREFIX_REQUIRED, "prefix"),
              {
                pattern: /^[A-Z]+$/,
                message: CATEGORY_PREFIX_ONLY
              },
              {
                min: 2,
                max: 8,
                message: CATEGORY_PREFIX_MAX_LENGTH
              },
              {
                validator() {
                  if (
                    backendError.isError &&
                    backendError.message === CATEGORY_PREFIX_EXISTED
                  ) {
                    return Promise.reject(new Error(backendError.message));
                  } else {
                    return Promise.resolve();
                  }
                }
              }
            ]}
          >
            <Input
              onChange={() => {
                if (backendError.isError)
                  setBackendError({ isError: false, message: "" });
              }}
              style={{ width: "80%" }}
            />
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

      <Modal
        open={isCreateSuccessfully}
        onOk={handleCancel}
        onCancel={handleCancel}
        closable={handleCancel}
        footer={[]}
      >
        <h1 className="mb-5 text-2xl font-bold text-red-600">
          Create Category Successfully
        </h1>
        <p className="mb-8">New Category is created successfully!</p>
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
