import React, { useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Switch,
    Row,
    Col,
    Button,
} from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface CreateRestApiModalProps {
    open: boolean;
    loading?: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    initialValues?: any;
}

const CreateRestApiModal: React.FC<CreateRestApiModalProps> = ({
    open,
    loading,
    onCancel,
    onSubmit,
    initialValues,
}) => {
    const [form] = Form.useForm();
    const httpMethod = Form.useWatch("http_method", form);

    const handleFinish = (values: any) => {
        const payload = {
            api_name: values.api_name || "null",
            base_url: values.base_url || "null",
            http_method: values.http_method || "null",
            resource_path: values.resource_path || "null",
            authentication_type: values.authentication_type || "null",
            username: values.username || "null",
            password: values.password || "null",

            request_headers: values.request_headers
                ? JSON.parse(values.request_headers)
                : "null",

            request_parameters: values.request_parameters
                ? JSON.parse(values.request_parameters)
                : "null",

            request_body: values.request_body
                ? JSON.parse(values.request_body)
                : "null",

            response_format: values.response_format || "null",
            timeout_seconds: values.timeout_seconds ?? "null",
            retry_count: values.retry_count ?? "null",
            is_status: values.is_status ? 1 : 0,
        };

        onSubmit(payload);
        form.resetFields();
    };

    const validateJSON = (_: any, value: string) => {
        if (!value) return Promise.resolve();

        try {
            JSON.parse(value);
            return Promise.resolve();
        } catch {
            return Promise.reject("Invalid JSON format");
        }
    };

    useEffect(() => {
        const formatJson = (value: any) => {
            if (!value) return "";

            try {
                const parsed =
                    typeof value === "string" ? JSON.parse(value) : value;

                return JSON.stringify(parsed, null, 2);
            } catch {
                return value;
            }
        };

        if (open) {
            form.setFieldsValue({
                ...initialValues,
                request_headers: formatJson(initialValues?.request_headers),
                request_parameters: formatJson(initialValues?.request_parameters),
                request_body: formatJson(initialValues?.request_body),
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, open, form]);

    const handleTestConnection = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                ...values,
                request_headers: values.request_headers
                    ? JSON.parse(values.request_headers)
                    : {},
                request_parameters: values.request_parameters
                    ? JSON.parse(values.request_parameters)
                    : {},
                request_body: values.request_body
                    ? JSON.parse(values.request_body)
                    : {},
            };

            console.log(payload);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <style>
                {`
       .ant-input::placeholder,
textarea::placeholder,
.ant-input-number-input::placeholder,
.ant-select-selection-placeholder {
    color: #000 !important;
    opacity: 0.55 !important;
}

.ant-form-item-label > label {
    color: #0000009c !important;
    font-weight: 400;
}

.ant-input,
.ant-input-password,
.ant-input-number,
.ant-select-selector,
.ant-input-affix-wrapper {
    border-radius: 8px !important;
}
        `}
            </style>
            <Modal
                title={initialValues ? "Edit REST API" : "Create REST API"}
                open={open}
                width={950}
                destroyOnClose
                confirmLoading={loading}
                styles={{
                    body: {
                        maxHeight: "60vh",
                        overflowY: "auto",
                        paddingRight: 8,
                    },
                }}
                footer={[
                    <Button
                        key="cancel"
                        size="large"
                        onClick={() => {
                            form.resetFields();
                            onCancel?.();
                        }}
                    >
                        Cancel
                    </Button>,

                    !initialValues && (
                        <Button
                            key="test"
                            size="large"
                            onClick={handleTestConnection}
                            style={{
                                borderColor: "#0F52BA",
                                color: "#0F52BA",
                                fontWeight: 600,
                            }}
                        >
                            Test Connection
                        </Button>
                    ),

                    <Button
                        key="submit"
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={() => form.submit()}
                    >
                        {initialValues ? "Update" : "Create"}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        http_method: "GET",
                        authentication_type: "Basic",
                        timeout_seconds: 60,
                        retry_count: 3,
                        is_status: true,
                        ...initialValues,
                        request_headers: initialValues?.request_headers
                            ? JSON.stringify(initialValues.request_headers, null, 2)
                            : "",
                        request_parameters: initialValues?.request_parameters
                            ? JSON.stringify(initialValues.request_parameters, null, 2)
                            : "",
                        request_body: initialValues?.request_body
                            ? JSON.stringify(initialValues.request_body, null, 2)
                            : "",
                    }}
                    onFinish={handleFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="API Name"
                                name="api_name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter API Name",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter API Name" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Base URL"
                                name="base_url"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Base URL",
                                    },
                                ]}
                            >
                                <Input placeholder="https://api.example.com" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="HTTP Method"
                                name="http_method"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select HTTP Method",
                                    },
                                ]}
                            >
                                <Select placeholder="Select HTTP Method">
                                    <Option value="GET">GET</Option>
                                    <Option value="POST">POST</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Resource Path"
                                name="resource_path"
                            >
                                <Input placeholder="/users/{id}" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Authentication Type"
                                name="authentication_type"
                            >
                                <Select placeholder="Select Authentication">
                                    <Option value="Basic">Basic</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Username"
                                name="username"
                            >
                                <Input placeholder="Enter Username" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Password"
                                name="password"
                            >
                                <Input.Password placeholder="Enter Password" />
                            </Form.Item>
                        </Col>
                        {httpMethod === "POST" && (
                            <>
                                <Col span={24}>
                                    <Form.Item
                                        label="Request Headers (JSON)"
                                        name="request_headers"
                                        rules={[
                                            {
                                                validator: validateJSON,
                                            },
                                        ]}
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder={`{
  "Content-Type":"application/json"
}`}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Request Parameters (JSON)"
                                        name="request_parameters"
                                        rules={[
                                            {
                                                validator: validateJSON,
                                            },
                                        ]}
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder={`{
  "page":1
}`}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Request Body (JSON)"
                                        name="request_body"
                                        rules={[
                                            {
                                                validator: validateJSON,
                                            },
                                        ]}
                                    >
                                        <TextArea
                                            rows={6}
                                            placeholder={`{
  "name":"John"
}`}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Response Format"
                                        name="response_format"
                                    >
                                        <Select placeholder="Select Response Format">
                                            <Option value="JSON">JSON</Option>
                                            <Option value="XML">XML</Option>
                                            <Option value="TEXT">TEXT</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        label="Timeout (Seconds)"
                                        name="timeout_seconds"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter Timeout",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            min={1}
                                            style={{ width: "100%" }}
                                            placeholder="60"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        label="Retry Count"
                                        name="retry_count"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter Retry Count",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: "100%" }}
                                            placeholder="3"
                                        />
                                    </Form.Item>
                                </Col>
                            </>)}
                        <Col span={24}>
                            <Form.Item
                                label="Status"
                                name="is_status"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        </>
    );
};

export default CreateRestApiModal;