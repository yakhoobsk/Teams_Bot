import { useState } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Switch,
    Row,
    Col,
    Grid,
    Typography,
    Space,
} from "antd";
import { motion } from "framer-motion";
import servicenowimg from "../../assets/servicenow.png"
import Azuredeops from "../../assets/Azuredeops.png"
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const ITSMConnectors = ({ activeTab }: { activeTab: string }) => {
    console.log("Active Tab in AI Agent Connectors:", activeTab);

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [ServicenowEnabled, setServicenowEnabled] =
        useState(false);

    const [ADOEnabled, setADOEnabled] =
        useState(false);

    const [ServicenowForm] = Form.useForm();
    const [ADOForm] = Form.useForm();

    const saveconnecters = (
        values: any,
        type: string
    ) => {
        console.log(type, values);
    };

    const cardStyle = {
        borderRadius: 24,
        overflow: "hidden",
        border: "none",
        boxShadow:
            "0 15px 40px rgba(98,100,167,.15)",
        height: "100%",
    };

    return (
        <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
            {/* ServiceNow */}
            <Col xs={24} lg={12}>
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -50,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                >
                    <Card
                        style={cardStyle}
                        bodyStyle={{
                            padding: 0,
                        }}
                    >
                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg,#464775,#6264A7,#7B83EB)",
                                padding: "20px 24px",
                                color: "#fff",
                                borderRadius: "12px 12px 0 0",
                            }}
                        >
                            <Space
                                align="center"
                                size={20}
                            >
                                <img
                                    src={servicenowimg}
                                    alt="servicenow"
                                    style={{
                                        height: 42,
                                        width: 62,
                                        objectFit: "contain",
                                        display: "block",
                                    }}
                                />

                                <div>
                                    <Title
                                        level={3}
                                        style={{
                                            color: "#fff",
                                            margin: 0,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        ServiceNow
                                    </Title>

                                    <Text
                                        style={{
                                            color: "rgba(255,255,255,0.85)",
                                            fontSize: 16,
                                            display: "block",
                                            marginTop: 2,
                                        }}
                                    >
                                        Ticket Integration
                                    </Text>
                                </div>
                            </Space>
                        </div>

                        <div
                            style={{
                                padding: 24,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    marginBottom:
                                        24,
                                }}
                            >
                                <Text strong>
                                    Connector
                                    Status
                                </Text>

                                <Switch
                                    checked={
                                        ServicenowEnabled
                                    }
                                    onChange={
                                        setServicenowEnabled
                                    }
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                />
                            </div>

                            <Form
                                form={
                                    ServicenowForm
                                }
                                layout="vertical"
                                onFinish={(
                                    values
                                ) =>
                                    saveconnecters(
                                        values,
                                        "ServiceNow"
                                    )
                                }
                            >
                                <Form.Item
                                    label="Instance URL"
                                    name="instance_url"
                                >
                                    <Input
                                        size="large"
                                        placeholder="https://company.service-now.com"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Username"
                                    name="username"
                                >
                                    <Input
                                        size="large"
                                        placeholder="api-user"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="API Token"
                                    name="token"
                                >
                                    <Input.Password
                                        size="large"
                                        placeholder="Enter Token"
                                    />
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block={
                                        isMobile
                                    }
                                    style={{
                                        height: 48,
                                        borderRadius:
                                            12,
                                        background:
                                            "linear-gradient(135deg,#6264A7,#7B83EB)",
                                        border:
                                            "none",
                                    }}
                                >
                                    Save ServiceNow
                                </Button>
                            </Form>
                        </div>
                    </Card>
                </motion.div>
            </Col>

            {/* Azure DevOps */}
            <Col xs={24} lg={12}>
                <motion.div
                    initial={{
                        opacity: 0,
                        x: 50,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                >
                    <Card
                        style={cardStyle}
                        bodyStyle={{
                            padding: 0,
                        }}
                    >

                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg,#464775,#6264A7,#7B83EB)",
                                padding: "20px 24px",
                                color: "#fff",
                                borderRadius: "12px 12px 0 0",
                            }}
                        >
                            <Space
                                align="center"
                                size={20}
                            >
                                <img
                                    src={Azuredeops}
                                    alt="servicenow"
                                    style={{
                                        height: 42,
                                        width: 62,
                                        objectFit: "contain",
                                        display: "block",
                                    }}
                                />

                                <div>
                                    <Title
                                        level={3}
                                        style={{
                                            color: "#fff",
                                            margin: 0,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Azure DevOps
                                    </Title>

                                    <Text
                                        style={{
                                            color: "rgba(255,255,255,0.85)",
                                            fontSize: 16,
                                            display: "block",
                                            marginTop: 2,
                                        }}
                                    >
                                        Work Item
                                        Integration
                                    </Text>
                                </div>
                            </Space>
                        </div>

                        <div
                            style={{
                                padding: 24,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    marginBottom:
                                        24,
                                }}
                            >
                                <Text strong>
                                    Connector
                                    Status
                                </Text>

                                <Switch
                                    checked={
                                        ADOEnabled
                                    }
                                    onChange={
                                        setADOEnabled
                                    }
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                />
                            </div>

                            <Form
                                form={ADOForm}
                                layout="vertical"
                                onFinish={(
                                    values
                                ) =>
                                    saveconnecters(
                                        values,
                                        "ADO"
                                    )
                                }
                            >
                                <Form.Item
                                    label="Organization URL"
                                    name="instance_url"
                                >
                                    <Input
                                        size="large"
                                        placeholder="https://dev.azure.com/company"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Username"
                                    name="username"
                                >
                                    <Input
                                        size="large"
                                        placeholder="api-user"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="PAT Token"
                                    name="token"
                                >
                                    <Input.Password
                                        size="large"
                                        placeholder="Enter PAT"
                                    />
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block={
                                        isMobile
                                    }
                                    style={{
                                        height: 48,
                                        borderRadius:
                                            12,
                                        background:
                                            "linear-gradient(135deg,#0F6CBD,#4F9BFF)",
                                        border:
                                            "none",
                                    }}
                                >
                                    Save Azure DevOps
                                </Button>
                            </Form>
                        </div>
                    </Card>
                </motion.div>
            </Col>
        </Row>
    );
};

export default ITSMConnectors;

