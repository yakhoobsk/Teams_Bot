import {
    Card,
    Row,
    Col,
    Typography,
    Form,
    Input,
    Button,
    Tag,
} from "antd";
import {
    KeyOutlined,
    CheckCircleFilled,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import chatgptLogo from "../../assets/chatgpt-icon.png";
import copilotLogo from "../../assets/copilot-icon.png";
import claudeLogo from "../../assets/claude-ai-icon.png";
import geminiLogo from "../../assets/google-gemini-icon.png";

const { Title, Text } = Typography;
const AIAgentConnectors = ({ activeTab }: { activeTab: string }) => {
    console.log("Active Tab in AI Agent Connectors:", activeTab);
    const [selectedAgent, setSelectedAgent] = useState("chatgpt");

    const [form] = Form.useForm();

    const aiAgents = [
        {
            key: "chatgpt",
            name: "ChatGPT",
            image: chatgptLogo,
            color: "#10A37F",
        },
        {
            key: "copilot",
            name: "Copilot",
            image: copilotLogo,
            color: "#0078D4",
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
    ];

    const current =
        aiAgents.find(
            (x) => x.key === selectedAgent
        ) || aiAgents[0];

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>
                AI Agent Connectors
            </Title>

            <Text type="secondary">
                Connect your preferred AI provider
            </Text>

            <Row
                gutter={[20, 20]}
                style={{
                    marginTop: 24,
                }}
            >
                {aiAgents.map((agent) => (
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
                                <Col
                                    xs={24}
                                    md={24}
                                >
                                    <Form.Item
                                        label="API Key"
                                        name="apiKey"
                                    >
                                        <Input
                                            prefix={
                                                <KeyOutlined

                                                    style={{
                                                        color: "#6264A7",
                                                        fontSize: 18,

                                                    }}
                                                />
                                            }
                                            placeholder="Enter API Key"
                                            size="small"

                                        />
                                    </Form.Item>
                                </Col>


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
                                    style={{
                                        borderRadius:
                                            12,
                                        border:
                                            "none",
                                        background:
                                            current.color,
                                    }}
                                >
                                    Save
                                    Connector
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
        </div>
    );
}
export default AIAgentConnectors;