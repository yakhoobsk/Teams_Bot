import {
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Typography,

} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircleFilled,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const DatabaseConnectors = ({ activeTab }: { activeTab: string }) => {
    console.log("Active Tab in AI Agent Connectors:", activeTab);

    const [selectedDb, setSelectedDb] = useState("azure");

    const [form] = Form.useForm();

    const databases = [
        {
            key: "azure",
            name: "Azure SQL",
            icon: "☁️",
            color: "#0078D4",
        },
        {
            key: "mysql",
            name: "MySQL",
            icon: "🐬",
            color: "#00758F",
        },
        {
            key: "postgres",
            name: "PostgreSQL",
            icon: "🐘",
            color: "#336791",
        },
        {
            key: "oracle",
            name: "Oracle",
            icon: "🔴",
            color: "#F80000",
        },
        {
            key: "snowflake",
            name: "Snowflake",
            icon: "❄️",
            color: "#29B5E8",
        },
    ];

    const current =
        databases.find(
            (db) => db.key === selectedDb
        ) || databases[0];

    return (
        <div
            style={{
                padding: 24,
            }}
        >
            <Title level={2}>
                Database Connectors
            </Title>

            <Text type="secondary">
                Connect enterprise databases securely
            </Text>

            <Row
                gutter={[20, 20]}
                style={{
                    marginTop: 30,
                }}
            >
                {databases.map((db) => (
                    <Col
                        xs={24}
                        sm={12}
                        lg={8}
                        xl={4}
                        key={db.key}
                    >
                        <motion.div
                            whileHover={{
                                y: -10,
                                scale: 1.03,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                        >
                            <Card
                                onClick={() =>
                                    setSelectedDb(db.key)
                                }
                                style={{
                                    cursor: "pointer",
                                    borderRadius: 24,
                                    overflow: "hidden",
                                    border:
                                        selectedDb === db.key
                                            ? `2px solid ${db.color}`
                                            : "1px solid #eee",
                                    boxShadow:
                                        selectedDb === db.key
                                            ? `0 15px 40px ${db.color}30`
                                            : "0 8px 20px rgba(0,0,0,.08)",
                                }}
                            >
                                <div
                                    style={{
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 48,
                                        }}
                                    >
                                        {db.icon}
                                    </div>

                                    <Title
                                        level={5}
                                        style={{
                                            marginTop: 10,
                                        }}
                                    >
                                        {db.name}
                                    </Title>

                                    {selectedDb === db.key && (
                                        <CheckCircleFilled
                                            style={{
                                                color: db.color,
                                                fontSize: 22,
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
                    key={selectedDb}
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
                    transition={{
                        duration: 0.4,
                    }}
                >
                    <Card
                        style={{
                            marginTop: 30,
                            borderRadius: 28,
                            overflow: "hidden",
                            boxShadow:
                                "0 20px 60px rgba(0,0,0,.12)",
                        }}
                    >
                        <div
                            style={{
                                background: `linear-gradient(135deg, ${current.color}, ${current.color}CC)`,
                                margin: "-24px -24px 30px",
                                padding: 30,
                                color: "#fff",
                            }}
                        >
                            <Title
                                level={3}
                                style={{
                                    color: "#fff",
                                    margin: 0,
                                }}
                            >
                                {current.icon} {current.name}
                            </Title>

                            <Text
                                style={{
                                    color:
                                        "rgba(255,255,255,.85)",
                                }}
                            >
                                Configure your connection
                            </Text>
                        </div>

                        <Form
                            layout="vertical"
                            form={form}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Host"
                                        name="host"
                                    >
                                        <Input placeholder="e.g. db.company.com or localhost" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Port"
                                        name="port"
                                    >
                                        <Input placeholder="e.g. 1433, 3306, 5432" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Username"
                                        name="username"
                                    >
                                        <Input placeholder="Enter database username" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                    >
                                        <Input.Password placeholder="Enter database password" />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Schema Name"
                                        name="schema"
                                    >
                                        <Input placeholder="e.g. public, dbo, sales_schema" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 12,
                                }}
                            >
                                <Button
                                    size="large"
                                    style={{
                                        borderRadius: 12,
                                    }}
                                >
                                    Test Connection
                                </Button>

                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        borderRadius: 12,
                                        background:
                                            current.color,
                                    }}
                                >
                                    Save Connector
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default DatabaseConnectors;