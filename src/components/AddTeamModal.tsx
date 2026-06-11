import React from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Row,
    Col,
} from "antd";
import {

    ToolOutlined,
    DatabaseOutlined,
    RobotOutlined,
} from "@ant-design/icons";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
}

const AddTeamModal: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        onSubmit(values);
        form.resetFields();
    };

    return (
        <Modal
            open={open}
            footer={null}
            onCancel={onClose}
            width={950}
            centered
            destroyOnClose

        >


            {/* BODY */}

            <div
                style={{
                    background: "#f8fafc",
                    padding: 30,
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    validateTrigger="onSubmit"
                >
                    {/* COMPANY SECTION */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 20,
                            padding: 24,
                            marginBottom: 20,
                            boxShadow:
                                "0 8px 25px rgba(0,0,0,.05)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                marginBottom: 20,
                                color: "#464775",
                            }}
                        >
                            Company Information
                        </div>

                        <Row gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="companyName"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Company Name is required",
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"

                                        placeholder="Company Name"
                                        style={{
                                            height: 40,
                                            borderRadius: 12,
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="connector"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Connector is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Select Connector"
                                        style={{
                                            width: "100%",
                                        }}
                                        options={[
                                            {
                                                label:
                                                    "Microsoft Teams",
                                                value:
                                                    "Microsoft Teams",
                                            },

                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* INTEGRATION SECTION */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 20,
                            padding: 24,
                            boxShadow:
                                "0 8px 25px rgba(0,0,0,.05)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                marginBottom: 20,
                                color: "#464775",
                            }}
                        >
                            Integrations
                        </div>

                        <Row gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="ticket"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Ticket Tool is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Ticket Tool"
                                        suffixIcon={
                                            <ToolOutlined />
                                        }
                                        options={[
                                            {
                                                label: "Jira",
                                                value: "Jira",
                                            },
                                            {
                                                label:
                                                    "ServiceNow",
                                                value:
                                                    "ServiceNow",
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="database"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Database is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Database"
                                        suffixIcon={
                                            <DatabaseOutlined />
                                        }
                                        options={[
                                            {
                                                label: "MySQL",
                                                value: "MySQL",
                                            },
                                            {
                                                label: "Oracle",
                                                value: "Oracle",
                                            },
                                            {
                                                label:
                                                    "PostgreSQL",
                                                value:
                                                    "PostgreSQL",
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item
                                    name="aiAgent"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "AI Agent is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="AI Agent"
                                        suffixIcon={
                                            <RobotOutlined />
                                        }
                                        options={[
                                            {
                                                label: "ChatGPT",
                                                value: "ChatGPT",
                                            },
                                            {
                                                label: "Gemini",
                                                value: "Gemini",
                                            },
                                            {
                                                label: "Copilot",
                                                value: "Copilot",
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* AI CARD */}

                        <div
                            style={{
                                marginTop: 20,
                                borderRadius: 18,
                                padding: 20,
                                color: "#fff",
                                background:
                                    "linear-gradient(135deg,#6264A7,#7B83EB)",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                }}
                            >
                                🤖 AI Agent Integration
                            </div>

                            <div
                                style={{
                                    marginTop: 8,
                                    opacity: 0.9,
                                }}
                            >
                                Connect ChatGPT, Gemini
                                or Copilot to automate
                                ticket creation, incident
                                resolution and intelligent
                                responses.
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            marginTop: 24,
                        }}
                    >
                        <div
                            style={{
                                color: "#888",
                                fontSize: 13,
                            }}
                        >
                            Teams Bot Integration Portal
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                            }}
                        >
                            <Button
                                size="large"
                                onClick={onClose}
                                style={{
                                    borderRadius: 12,
                                    minWidth: 120,
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                htmlType="submit"
                                type="primary"
                                size="large"
                                style={{
                                    minWidth: 180,
                                    height: 48,
                                    borderRadius: 12,
                                    background:
                                        "linear-gradient(135deg,#6264A7,#7B83EB)",
                                    border: "none",
                                    boxShadow:
                                        "0 10px 20px rgba(98,100,167,.3)",
                                }}
                            >
                                Save Team
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default AddTeamModal;