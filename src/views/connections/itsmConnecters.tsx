import {
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Grid,
    Typography,
    Space,
} from "antd";
import { motion } from "framer-motion";
import servicenowimg from "../../assets/servicenow.png"
import Azuredeops from "../../assets/Azuredeops.png"
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { itsmconnecterCreate, ITSMConnectersGet } from "../../redux/Services/connectersServices";
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const ITSMConnectors = ({ activeTab }: { activeTab: string }) => {
    console.log("Active Tab in AI Agent Connectors:", activeTab);

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [ServicenowForm] = Form.useForm();
    const [ADOForm] = Form.useForm();
    const dispatch = useAppDispatch()
    const itsm = useAppSelector((state) => state.connecters?.itsmget);
    const ticketConnectors = itsm?.Response || itsm?.[0]?.Response || [];

    useEffect(() => {
        if (activeTab === "Tickets") {
            dispatch(ITSMConnectersGet({}));
        }
    }, [activeTab, dispatch]);

    const connectors = [
        {
            key: "ServiceNow",
            apiKey: "ServiceNow Connector",
            form: ServicenowForm,
        },
        {
            key: "ADO",
            apiKey: "Azure DevOps Connector",
            form: ADOForm,
        },
    ].map((item) => {
        const apiData = ticketConnectors.find(
            (x: any) =>
                x.ticket_name?.toLowerCase() === item.apiKey.toLowerCase()
        );

        return {
            ...item,
            ticketId: apiData?.ticket_id || "",
            instance_url: apiData?.instance_url || "",
            username: apiData?.username || "",
            token: apiData?.access_token || "",
            is_active: apiData?.is_active || false,
        };
    });

    useEffect(() => {
        const serviceNow = connectors.find(
            (x) => x.key === "ServiceNow"
        );

        ServicenowForm.setFieldsValue({
            instance_url: serviceNow?.instance_url || "",
            username: serviceNow?.username || "",
            token: serviceNow?.token || "",
        });

        const ado = connectors.find(
            (x) => x.key === "ADO"
        );

        ADOForm.setFieldsValue({
            instance_url: ado?.instance_url || "",
            username: ado?.username || "",
            token: ado?.token || "",
        });
    }, [itsm]);

    const saveconnecters = async (values: any, type: string) => {


        const payload = {
            instance_url: values.instance_url,
            username: values.username,
            access_token: values.token,
            ticket_name:
                type === "ServiceNow"
                    ? "servicenow"
                    : "azuredevops",
        };

        dispatch(itsmconnecterCreate({ payload }));

        dispatch(ITSMConnectersGet({}));
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

