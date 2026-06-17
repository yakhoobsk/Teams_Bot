import { useState } from "react";
import {
    Table,
    Card,
    Select,
    Switch,
    Button,
    Space,
    Tag,
    Typography,
} from "antd";
import {
    PlusOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import AddTeamModal from "../../components/AddTeamModal";

const { Title, Text } = Typography;
interface TeamConfig {
    key: string;
    teamId: string;
    connector: string;
    companyName: string;
    ticket: string;
    database: string;
    aiAgent: string;
    active: boolean;
}

export default function TeamConfiguration() {
    const [openModal, setOpenModal] = useState(false);
    const [dataSource, setDataSource] =
        useState<TeamConfig[]>([
            {
                key: "1",
                teamId: "TEAM001",
                connector: "Microsoft Teams",
                companyName: "EasyStepIn",
                ticket: "Jira",
                database: "MySQL",
                aiAgent: "ChatGPT",
                active: true,
            },
            {
                key: "2",
                teamId: "TEAM002",
                connector: "Microsoft Teams",
                companyName: "EasyStepIn",
                ticket: "ServiceNow",
                database: "Oracle",
                aiAgent: "Gemini",
                active: false,
            },
            {
                key: "3",
                teamId: "TEAM003",
                connector: "Microsoft Teams",
                companyName: "EasyStepIn",
                ticket: "Jira",
                database: "PostgreSQL",
                aiAgent: "Copilot",
                active: true,
            },
            {
                key: "4",
                teamId: "TEAM004",
                connector: "Microsoft Teams",
                companyName: "EasyStepIn",
                ticket: "ServiceNow",
                database: "MySQL",
                aiAgent: "ChatGPT",
                active: true,
            },
            {
                key: "5",
                teamId: "TEAM005",
                connector: "Microsoft Teams",
                companyName: "EasyStepIn",
                ticket: "Jira",
                database: "Oracle",
                aiAgent: "Gemini",
                active: false,
            },
        ]);

    const updateField = (
        key: string,
        field: string,
        value: any
    ) => {
        setDataSource((prev) =>
            prev.map((item) =>
                item.key === key
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    const handleActiveChange = (
        key: string,
        checked: boolean
    ) => {
        setDataSource((prev) =>
            prev.map((item) => ({
                ...item,
                active: checked
                    ? item.key === key
                    : false,
            }))
        );
    };

    const columns = [
        {
            title: "Team ID",
            dataIndex: "teamId",
            width: 140,
            render: (value: string) => (
                <Tag
                    color="blue"
                    style={{
                        padding: "4px 12px",
                        borderRadius: 8,
                        fontWeight: 600,
                    }}
                >
                    {value}
                </Tag>
            ),
        },
        {
            title: "Company Name",
            dataIndex: "companyName",
            width: 220,
        },
        {
            title: "Connector",
            dataIndex: "connector",
            width: 180,

        }
        ,
        {
            title: "Tickets",
            width: 180,
            render: (_: any, record: any) => (
                <Select
                    value={record.ticket}
                    style={{ width: "100%" }}
                    onChange={(value) =>
                        updateField(
                            record.key,
                            "ticket",
                            value
                        )
                    }
                    options={[
                        {
                            label: "Jira",
                            value: "Jira",
                        },
                        {
                            label: "ServiceNow",
                            value: "ServiceNow",
                        },
                    ]}
                />
            ),
        },
        {
            title: "Database",
            width: 180,
            render: (_: any, record: any) => (
                <Select
                    value={record.database}
                    style={{ width: "100%" }}
                    onChange={(value) =>
                        updateField(
                            record.key,
                            "database",
                            value
                        )
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
                            label: "PostgreSQL",
                            value: "PostgreSQL",
                        },
                    ]}
                />
            ),
        },
        {
            title: "AI Agent",
            width: 180,
            render: (_: any, record: any) => (
                <Select
                    value={record.aiAgent}
                    style={{ width: "100%" }}
                    onChange={(value) =>
                        updateField(
                            record.key,
                            "aiAgent",
                            value
                        )
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
            ),
        },
        {
            title: "Status",
            width: 180,
            render: (_: any, record: any) => (
                <Space>
                    <Switch
                        checked={record.active}
                        onChange={(checked) =>
                            handleActiveChange(
                                record.key,
                                checked
                            )
                        }
                    />

                    <Tag
                        color={
                            record.active
                                ? "success"
                                : "default"
                        }
                    >
                        {record.active
                            ? "Active"
                            : "Inactive"}
                    </Tag>
                </Space>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                <div>
                    <Title
                        level={2}
                        style={{
                            marginBottom: 0,
                        }}
                    >
                        Teams Configuration
                    </Title>

                    <Text
                        style={{
                            color: "#6b7280",
                        }}
                    >
                        Manage Team Integrations &
                        AI Agents
                    </Text>
                </div>

                <Space>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setOpenModal(true)}
                        style={{
                            borderRadius: 12,
                            height: 42,
                            background:
                                "linear-gradient(135deg,#6264A7,#7B83EB)",
                            border: "none",
                        }}
                    >
                        Add Connection
                    </Button>
                </Space>
            </div>

            {/* Stats */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                    gap: 20,
                    marginBottom: 24,
                }}
            >
                {[
                    {
                        title: "Total Teams",
                        value: 5,
                    },
                    {
                        title: "Active Teams",
                        value: 3,
                    },
                    {
                        title: "AI Agents",
                        value: 3,
                    },
                ].map((item) => (
                    <motion.div
                        key={item.title}
                        whileHover={{
                            y: -5,
                        }}
                    >
                        <Card
                            style={{
                                borderRadius: 20,
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,.06)",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#888",
                                }}
                            >
                                {item.title}
                            </Text>

                            <Title
                                level={2}
                                style={{
                                    marginTop: 10,
                                    marginBottom: 0,
                                }}
                            >
                                {item.value}
                            </Title>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Table */}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Card
                    style={{
                        borderRadius: 24,
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,.08)",
                    }}
                    bodyStyle={{
                        padding: 0,
                    }}
                >
                    <Table
                        rowKey="key"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{
                            pageSize: 5,
                        }}
                        scroll={{
                            x: 1100,
                        }}
                        rowClassName={() => "team-row"}
                    />
                </Card>

                <AddTeamModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onSubmit={(values) => {
                        setDataSource((prev) => [
                            ...prev,
                            {
                                key: Date.now().toString(),
                                teamId: `TEAM${prev.length + 1}`,
                                connector: "Microsoft Teams",
                                companyName: values.companyName,
                                ticket: values.ticket,
                                database: values.database,
                                aiAgent: values.aiAgent,
                                active: true,
                            },
                        ]);

                        setOpenModal(false);
                    }}
                />
            </motion.div>
        </motion.div>
    );
}