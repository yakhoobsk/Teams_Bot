import { motion } from "framer-motion";
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    Space,
    Divider,
    message,
} from "antd";
import {
    ApiOutlined,
    KeyOutlined,
    SaveOutlined,
    CopyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DataHubAgent() {
    const [form] = Form.useForm();

    const handleSave = (values: any) => {
        console.log(values);
        message.success("Configuration saved successfully.");
    };

    const copyToken = async () => {
        const token = form.getFieldValue("token");

        if (!token) {
            message.warning("Enter token first.");
            return;
        }

        await navigator.clipboard.writeText(token);
        message.success("Token copied.");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
                display: "flex",
                justifyContent: "center",
                padding: 30,
            }}
        >
            <Card
                style={{
                    width: "100%",
                    borderRadius: 18,
                    boxShadow: "0 18px 45px rgba(15,82,186,.15)",
                    overflow: "hidden",
                }}
                bodyStyle={{ padding: 35 }}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 0.4,
                    }}
                >
                    <Space
                        align="center"
                        size={15}
                        style={{ marginBottom: 8 }}
                    >
                        <div
                            style={{
                                width: 58,
                                height: 58,
                                borderRadius: 14,
                                background:
                                    "linear-gradient(135deg,#0F52BA,#3B82F6)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#fff",
                                fontSize: 24,
                            }}
                        >
                            <ApiOutlined />
                        </div>

                        <div>
                            <Title level={3} style={{ margin: 0 }}>
                                DataHub Agent
                            </Title>

                            <Text type="secondary">
                                Configure your Boomi AI/ML Agent credentials.
                            </Text>
                        </div>
                    </Space>
                </motion.div>

                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    autoComplete="off"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        color: "#0F52BA",
                                        fontWeight: 600,
                                        fontSize: 15,
                                    }}
                                >
                                    Agent API
                                </span>
                            }
                            name="agentApi"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Agent API",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<ApiOutlined />}
                                placeholder="https://your-agent-api.com"
                            />
                        </Form.Item>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        color: "#0F52BA",
                                        fontWeight: 600,
                                        fontSize: 15,
                                    }}
                                >
                                    Token Details
                                </span>
                            }

                            name="token"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter token",
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<KeyOutlined />}
                                placeholder="Enter Token Details"
                                addonAfter={
                                    <CopyOutlined
                                        onClick={copyToken}
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                }
                            />
                        </Form.Item>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                    >
                        <Space style={{ marginTop: 20 }}>


                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                size="large"
                            >
                                Save Configuration
                            </Button>
                        </Space>
                    </motion.div>
                </Form>
            </Card>
        </motion.div>
    );
}