import {
    Card,
    Row,
    Col,
    Typography,
    Form,
    Input,
    Button,
    Tag,
    Popconfirm,
    Tooltip,
    Table,
    Modal,
    Space,
} from "antd";
import {
    KeyOutlined,
    CheckCircleFilled,
    EyeInvisibleOutlined,
    EyeTwoTone,
    RobotOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import chatgptLogo from "../../assets/chatgpt-icon.png";
import copilotLogo from "../../assets/copilot-icon.png";
import claudeLogo from "../../assets/claude-ai-icon.png";
import geminiLogo from "../../assets/google-gemini-icon.png";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { aiconnecterCreate, aiconnecterDelete, AIConnectersGet, aiconnecterUpdate } from "../../redux/Services/connectersServices";
import type { ColumnsType } from "antd/es/table";

interface AiAgentRecord {
    key: string;
    aiName: string;
    model: string;
    apiKey: string;
    deploymentName: string;
    endpoint: string;
}



const { Title, Text } = Typography;
const AIAgentConnectors = ({ activeTab }: { activeTab: string }) => {

    const [selectedAgent, setSelectedAgent] = useState("chatgpt");
    const dispatch = useAppDispatch()
    const aigent = useAppSelector((state) => state.connecters?.aiagentget);
    const [openManageAgents, setOpenManageAgents] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<any>(null);
    const [editForm] = Form.useForm();

    useEffect(() => {
        if (activeTab === "AIAgents") {
            dispatch(AIConnectersGet({}));
        }
    }, [activeTab, dispatch]);
    const [form] = Form.useForm();
    const aiAgentData: AiAgentRecord[] =
        aigent?.[0]?.agents?.map((agent: any, index: number) => ({
            key: agent.agent_id || String(index + 1),
            aiName:
                agent.agent_name === "microsoftcopilot"
                    ? "Microsoft Copilot"
                    : agent.agent_name.charAt(0).toUpperCase() +
                    agent.agent_name.slice(1),
            model: agent.model || "-",
            apiKey: agent.api_key || "-",
            deploymentName: agent.deployment_name || "-",
            endpoint: agent.endpoint || "-",
        })) || [];

    const agents = aigent?.[0]?.agents || [];
    const aiAgents = [
        {
            key: "chatgpt",
            name: "ChatGPT",
            image: chatgptLogo,
            color: "#10A37F",
        },
        {
            key: "claude",
            name: "Claude",
            image: claudeLogo,
            color: "#D97706",
        },
        {
            key: "gemini",
            name: "Gemini",
            image: geminiLogo,
            color: "#4285F4",
        },
        {
            key: "copilot",
            name: "Copilot",
            image: copilotLogo,
            color: "#0078D4",
        },
    ].map((item) => {
        const apiData = agents.find((a: any) => {
            const name =
                a.agent_name.toLowerCase() === "microsoftcopilot"
                    ? "copilot"
                    : a.agent_name.toLowerCase();

            return name === item.key;
        });

        return {
            ...item,
            apiKey: apiData?.api_key || "",
            agentId: apiData?.agent_id || "",
        };
    });


    const aiAgentFields = {
        chatgpt: [
            {
                name: "apiKey",
                label: "API Key",
                password: true,
            },
            {
                name: "model",
                label: "Model",
            },
        ],

        claude: [
            {
                name: "apiKey",
                label: "API Key",
                password: true,
            },
            {
                name: "model",
                label: "Model",
            },
        ],

        gemini: [
            {
                name: "apiKey",
                label: "API Key",
                password: true,
            },
            {
                name: "model",
                label: "Model",
            },
        ],

        copilot: [
            {
                name: "apiKey",
                label: "API Key",
                password: true,
            },
            {
                name: "endpoint",
                label: "Endpoint URL",
            },
            {
                name: "deploymentName",
                label: "Deployment Name",
            },
        ],
    };
    const handleEdit = (record: any) => {
        setEditRecord(record);

        editForm.setFieldsValue({
            aiName: record.aiName,
            model: record.model,
            apiKey: record.apiKey,
            deploymentName: record.deploymentName,
            endpoint: record.endpoint,
        });

        setEditOpen(true);
    };

    const handleUpdate = (values: any) => {

        const payload = {
            agent_id: editRecord.key,
            agent_name: editRecord.aiName,
            api_key: values.apiKey,
            model: values.model,
            deployment_name: values.deploymentName,
            endpoint: values.endpoint,
        };

        dispatch(aiconnecterUpdate({ payload })).unwrap();
        setEditOpen(false);
        dispatch(AIConnectersGet({}));
    };
    const fields = aiAgentFields[selectedAgent as keyof typeof aiAgentFields];
    const columns: ColumnsType<AiAgentRecord> = [
        {
            title: "AI Name",
            dataIndex: "aiName",
            key: "aiName",
        },
        {
            title: "Model Name",
            dataIndex: "model",
            key: "model",
        },
        {
            title: "API Key",
            dataIndex: "apiKey",
            key: "apiKey",
            render: (apiKey: string) => {
                if (!apiKey) return "-";

                return (
                    <Tooltip title={apiKey}>
                        {"*".repeat(Math.max(apiKey.length - 4, 8)) + apiKey.slice(-4)}
                    </Tooltip>
                );
            },
        },
        {
            title: "Deployment Name",
            dataIndex: "deploymentName",
            key: "deploymentName",
        },
        {
            title: "Endpoint URL",
            dataIndex: "endpoint",
            key: "endpoint",
            ellipsis: true,
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete AI Agent"
                        description="Are you sure you want to delete this AI Agent?"
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Tooltip title="Delete">
                            <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        }
    ];



    const current =
        aiAgents.find((item: any) => item.key === selectedAgent) ||
        aiAgents[0];


    const handleSave = async () => {
        const values = await form.validateFields();

        const payload = {
            agent_id: "",
            agent_name: current.name,
            api_key: values.apiKey,
            created_by: "",
            created_date: "",
            is_active: true,
        }
        dispatch(
            aiconnecterCreate({ payload })
        ).unwrap();
        dispatch(AIConnectersGet({}));
    };

    const handleDelete = (record: AiAgentRecord) => {
        const payload = {
            agent_id: record.key,
        };

        dispatch(aiconnecterDelete({ payload }));

        dispatch(AIConnectersGet({}));
    };

    return (
        <div style={{ padding: 24 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <div>
                    <Title
                        level={2}
                        style={{
                            marginBottom: 4,
                        }}
                    >
                        AI Agent Connectors
                    </Title>

                    <Text type="secondary">
                        Connect your preferred AI provider
                    </Text>
                </div>

                <Button
                    type="primary"
                    size="large"
                    icon={<RobotOutlined />}
                    onClick={() => setOpenManageAgents(true)}
                    style={{
                        borderRadius: 10,
                        fontWeight: 600,
                        height: 42,
                        paddingInline: 20,
                    }}
                >
                    Manage AI Agents
                </Button>
            </div>

            <Row
                gutter={[20, 20]}
                style={{
                    marginTop: 24,
                }}
            >
                {aiAgents.map((agent: any) => (
                    <Col
                        xs={24}
                        sm={12}
                        lg={6}
                        key={agent.key}
                    >
                        <motion.div
                            whileHover={{
                                y: -10,
                                scale: 1.04,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                        >
                            <Card
                                onClick={() =>
                                    setSelectedAgent(
                                        agent.key
                                    )
                                }
                                style={{
                                    cursor: "pointer",
                                    borderRadius: 24,
                                    overflow:
                                        "hidden",
                                    background:
                                        "rgba(255,255,255,.9)",
                                    backdropFilter:
                                        "blur(20px)",
                                    border:
                                        selectedAgent ===
                                            agent.key
                                            ? `2px solid ${agent.color}`
                                            : "1px solid #eee",
                                    boxShadow:
                                        selectedAgent ===
                                            agent.key
                                            ? `0 15px 40px ${agent.color}40`
                                            : "0 10px 25px rgba(0,0,0,.08)",
                                }}
                            >
                                <div
                                    style={{
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: "50%",
                                            background: `${agent.color}15`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto 16px",
                                            border: `2px solid ${agent.color}30`,
                                        }}
                                    >
                                        <img
                                            src={agent.image}
                                            alt={agent.name}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>

                                    <Title
                                        level={5}
                                        style={{
                                            color: agent.color,
                                        }}
                                    >
                                        {
                                            agent.name
                                        }
                                    </Title>

                                    {selectedAgent ===
                                        agent.key && (
                                            <CheckCircleFilled
                                                style={{
                                                    color:
                                                        agent.color,
                                                    fontSize:
                                                        22,
                                                }}
                                            />
                                        )}
                                </div>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedAgent}
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                >
                    <Card
                        style={{
                            marginTop: 30,
                            borderRadius: 30,
                            overflow:
                                "hidden",
                            border: "none",
                            boxShadow:
                                "0 20px 60px rgba(0,0,0,.12)",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                background: `linear-gradient(135deg,${current.color},${current.color}CC)`,
                                margin:
                                    "-24px -24px 30px",
                                padding: 30,
                                color: "#fff",
                            }}
                        >
                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                        }}
                                    >
                                        <img
                                            src={current.image}
                                            alt={current.name}
                                            style={{
                                                width: 42,
                                                height: 42,
                                                objectFit: "contain",
                                                background: "#fff",
                                                borderRadius: 10,
                                                padding: 4,
                                            }}
                                        />

                                        <div>
                                            <Title
                                                level={3}
                                                style={{
                                                    color: "#fff",
                                                    margin: 0,
                                                }}
                                            >
                                                {current.name}
                                            </Title>

                                            <Text
                                                style={{
                                                    color: "rgba(255,255,255,.9)",
                                                }}
                                            >
                                                AI Provider Configuration
                                            </Text>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                        >
                            <Row gutter={16}>
                                {fields.map((field) => (
                                    <Col span={12} key={field.name}>
                                        <Form.Item
                                            label={
                                                <span
                                                    style={{
                                                        color: "#000",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {field.label}
                                                </span>
                                            }
                                            name={field.name}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Please enter ${field.label}`,
                                                },
                                            ]}
                                        >
                                            {field.password ? (
                                                <Input.Password
                                                    placeholder={`Enter ${field.label}`}
                                                    prefix={<KeyOutlined />}
                                                    iconRender={(visible) =>
                                                        visible ? (
                                                            <EyeTwoTone />
                                                        ) : (
                                                            <EyeInvisibleOutlined />
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <Input
                                                    placeholder={`Enter ${field.label}`}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap: 12,
                                }}
                            >


                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleSave}
                                    style={{
                                        borderRadius: 12,
                                        border: "none",
                                        background: current.color,
                                    }}
                                >
                                    Save Connector
                                </Button>
                            </div>
                        </Form>

                        <div
                            style={{
                                marginTop: 24,
                                gap: 8
                            }}
                        >
                            <Tag
                                color="success"

                            >
                                Secure
                            </Tag>

                            <Tag
                                color="processing"
                                style={{ marginLeft: 10 }}
                            >
                                Enterprise
                            </Tag>

                            <Tag color="purple" style={{ marginLeft: 10 }}>
                                AI Ready
                            </Tag>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>

            <Modal
                title="Manage AI Agents"
                open={openManageAgents}
                onCancel={() => setOpenManageAgents(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setOpenManageAgents(false)}
                    >
                        Close
                    </Button>,
                ]}
                width={1300}
                centered
                destroyOnClose
            >
                <Table<AiAgentRecord>
                    rowKey="key"
                    columns={columns}
                    dataSource={aiAgentData}
                    bordered
                    pagination={false}
                    scroll={{
                        x: "max-content",
                        y: 400,
                    }}
                />
            </Modal>
            <Modal
                title={
                    <span
                        style={{
                            color: "#0F52BA",
                            fontSize: 20,
                            fontWeight: 700,
                        }}
                    >
                        Edit AI Agent
                    </span>
                }
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                footer={[
                    <Button
                        key="cancel"
                        size="large"
                        onClick={() => setEditOpen(false)}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="update"
                        type="primary"
                        size="large"
                        onClick={() => editForm.submit()}
                        style={{
                            background: "#0F52BA",
                            borderColor: "#0F52BA",
                            fontWeight: 600,
                        }}
                    >
                        Update
                    </Button>,
                ]}
                width={700}
                centered
                destroyOnClose
            >
                <style>
                    {`
        .edit-agent-modal .ant-form-item-label > label{
            color:#222 !important;
            font-weight:600 !important;
            font-size:14px;
        }

        .edit-agent-modal .ant-input,
        .edit-agent-modal .ant-input-password{
            border-radius:8px !important;
            height:42px;
        }
    `}
                </style>

                <Form
                    form={editForm}
                    layout="vertical"
                    className="edit-agent-modal"
                    onFinish={handleUpdate}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="apiKey"
                                label="API Key"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter API Key",
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Enter API Key"
                                    prefix={<KeyOutlined />}
                                    iconRender={(visible) =>
                                        visible ? (
                                            <EyeTwoTone />
                                        ) : (
                                            <EyeInvisibleOutlined />
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="model"
                                label="Model"
                            >
                                <Input placeholder="Enter Model" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="deploymentName"
                                label="Deployment Name"
                            >
                                <Input placeholder="Enter Deployment Name" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="endpoint"
                                label="Endpoint URL"
                            >
                                <Input placeholder="https://example.openai.azure.com/" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}
export default AIAgentConnectors;