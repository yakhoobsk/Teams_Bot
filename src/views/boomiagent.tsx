import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Switch,
    Select,
    Button,
    Tag,
    Space,
    Tabs,
} from "antd";
import {
    RobotOutlined,
    ApiOutlined,
    DatabaseOutlined,
    SaveOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { Input, } from "antd";
import { AIConnectersGet, DataBaseConnectersGet, ITSMConnectersGet, RestApiConnectersGet } from "../redux/Services/connectersServices";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
const { Title, Text } = Typography;

type AgentCardProps = {
    title: string;
    description: string;
    category: string;
    active: boolean;
    color: string;
    lightColor: string;
    icon: ReactNode;
    saveIcon: ReactNode;
    onToggle: (checked: boolean) => void;
    children: ReactNode;
    delay?: number;
};

export default function AgentConfiguration(): React.ReactElement {
    const [boomiDataHubActive, setBoomiDataHubActive] = useState<boolean>(true);
    const [customDataHubActive, setCustomDataHubActive] = useState<boolean>(false);
    const [boomiIntegrationActive, setBoomiIntegrationActive] = useState<boolean>(true);
    const [customIntegrationActive, setCustomIntegrationActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const AiAgents = useAppSelector((state) => state.connecters?.aiagentget?.[0]?.agents) || [];
    const databaseConnectors = useAppSelector((state) => state.connecters?.databaseget?.[0]?.Connectors) || [];
    const restApiConnectors = useAppSelector((state) => state.connecters?.restapiconnectersget?.Response) || [];
    const ticketConnectors = useAppSelector((state) => state.connecters?.itsmget?.Response) || [];
    const [activeTab, setActiveTab] = useState("datahub");
    const [databaseId, setDatabaseId] = useState("");
    const [aiAgentId, setAiAgentId] = useState("");
    const [restApiId, setRestApiId] = useState("");
    const [ticketId, setTicketId] = useState("");
    const [boomiRestApi, setBoomiRestApi] = useState("");
    const [boomiUserName, setBoomiUserName] = useState("");
    const [boomiPassword, setBoomiPassword] = useState("");
    const [boomiMethod, setBoomiMethod] = useState("");
    useEffect(() => {
        dispatch(ITSMConnectersGet({}));
        dispatch(AIConnectersGet({}));
    }, [dispatch]);

    useEffect(() => {
        dispatch(RestApiConnectersGet({ type: activeTab === "datahub" ? "Datahub" : "Integration", }));
        dispatch(DataBaseConnectersGet({ database_type: activeTab === "datahub" ? "Datahub" : "Integrations", }));
    }, [dispatch, activeTab]);


    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };
    // create or update 

    const buildPayload = (
        type: "datahub" | "integration",
        isBoomi: boolean
    ) => {

        const selectedDb = databaseConnectors.find(
            (x: any) => x.connector_id === databaseId
        );

        const selectedAi = AiAgents.find(
            (x: any) => x.agent_id === aiAgentId
        );



        const selectedTicket = ticketConnectors.find(
            (x: any) => x.ticket_id === ticketId
        );

        return {

            Type: `${type} agent`,

            company_name: "EasyStepin",

            connector: "Teams",

            team_id: "",

            status: isBoomi ? "active" : "inactive",

            type_status: isBoomi ? "true" : "false",

            is_active: isBoomi ? "1" : "0",

            created_by: "",
            updated_by: "",
            created_date: "",
            updated_date: "",

            // ---------------- BOOMI ----------------

            rest_api_name: isBoomi
                ? boomiRestApi
                : "",

            rest_api_details: isBoomi
                ? [
                    {
                        api_name: boomiRestApi,
                        username: boomiUserName,
                        password_token: boomiPassword,
                        http_method: boomiMethod,
                    }
                ]
                : [],

            // ---------------- CUSTOM ----------------

            database_name: !isBoomi
                ? selectedDb?.connector_name || ""
                : "",

            ai_agent: !isBoomi
                ? selectedAi?.agent_name || ""
                : "",

            ticket_system: !isBoomi
                ? selectedTicket?.ticket_name || ""
                : "",

            database_details: !isBoomi
                ? (selectedDb ? [selectedDb] : [])
                : [],

            ai_agent_details: !isBoomi
                ? (selectedAi ? [selectedAi] : [])
                : [],

            ticket_details: !isBoomi
                ? (selectedTicket ? [selectedTicket] : [])
                : [],

        };
    };

    const handleSaveIntegration = () => {
        if (boomiIntegrationActive) {
            const payload = buildPayload("integration", true);
            console.log(payload)
        } else {
            const payload = buildPayload("integration", false);
            console.log(payload)
        }
    };
    const handleSaveDataHub = () => {
        if (boomiDataHubActive) {
            const payload = buildPayload("datahub", true);
            console.log(payload)
        } else {
            const payload = buildPayload("datahub", false);
            console.log(payload)
        }
    };
    const renderSelectField = (
        label: string,
        placeholder: string,
        options: { label: string; value: string }[],
        value: string,
        onChange: (value: string) => void
    ) => (
        <div>
            <Text style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
            }}>{label}</Text>

            <Select
                size="large"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                options={options}
                style={{ width: "100%" }}
            />
        </div>
    );
    const renderTextField = (
        label: string,
        placeholder: string,
        value?: string,
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    ): React.ReactElement => (
        <div>
            <Text
                style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                }}
            >
                {label}
            </Text>

            <Input
                size="large"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{ width: "100%" }}
            />
        </div>
    );


    const AgentCard = ({
        title,
        description,
        category,
        active,
        color,
        lightColor,
        icon,
        saveIcon,
        onToggle,
        children,
        delay = 0,
    }: AgentCardProps): React.ReactElement => (
        <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            style={{ height: "100%" }}
        >
            <Card
                hoverable
                bordered={false}
                style={{
                    height: "100%",
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "#ffffff",
                    border: active ? `1px solid ${color}` : "1px solid #e5e7eb",
                    boxShadow: active
                        ? `0 18px 42px ${color}24`
                        : "0 10px 30px rgba(15, 23, 42, 0.07)",
                    transition: "all 0.25s ease",
                }}
                bodyStyle={{ padding: 0 }}
            >
                <div
                    style={{
                        padding: 24,
                        background: active
                            ? `linear-gradient(135deg, ${color}, ${lightColor})`
                            : "#f8fafc",
                        color: active ? "#ffffff" : "#0f172a",
                        borderBottom: active ? "none" : "1px solid #eef2f7",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 16,
                            alignItems: "flex-start",
                        }}
                    >
                        <Space align="start" size={14}>
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 22,
                                    background: active ? "rgba(255,255,255,0.18)" : `${color}14`,
                                    color: active ? "#ffffff" : color,
                                }}
                            >
                                {icon}
                            </div>

                            <div>
                                <Space size={8} wrap>
                                    <div
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 700,
                                            lineHeight: 1.25,
                                        }}
                                    >
                                        {title}
                                    </div>

                                    <Tag
                                        color={active ? "green" : "default"}
                                        style={{
                                            borderRadius: 999,
                                            marginInlineEnd: 0,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {active ? "Active" : "Inactive"}
                                    </Tag>
                                </Space>

                                <div
                                    style={{
                                        marginTop: 6,
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                        color: active ? "rgba(255,255,255,0.82)" : "#64748b",
                                    }}
                                >
                                    {description}
                                </div>

                                <div
                                    style={{
                                        marginTop: 12,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: active ? "rgba(255,255,255,0.78)" : "#64748b",
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {category}
                                </div>
                            </div>
                        </Space>

                        <Switch checked={active} onChange={onToggle} />
                    </div>
                </div>

                <div
                    style={{
                        padding: 24,
                        minHeight: 278,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div>{children}</div>

                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={saveIcon}
                        onClick={() => {
                            if (activeTab === "datahub") {
                                handleSaveDataHub();
                            } else {
                                handleSaveIntegration();
                            }
                        }}
                        style={{
                            marginTop: 24,
                            height: 46,
                            borderRadius: 10,
                            fontWeight: 600,
                            background: color,
                            borderColor: color,
                            boxShadow: active ? `0 8px 22px ${color}40` : "none",
                        }}
                    >
                        Save Configuration
                    </Button>
                </div>
            </Card>
        </motion.div>
    );

    const dataHubTab = (
        <Row gutter={[24, 24]} align="stretch">
            <Col xs={24} lg={12}>
                <AgentCard
                    title="Boomi DataHub Agent"
                    description="Configure your Boomi REST API connection."
                    category="DataHub Agent"
                    active={boomiDataHubActive}
                    color="#2563eb"
                    lightColor="#38bdf8"
                    icon={<RobotOutlined />}
                    saveIcon={<SaveOutlined />}
                    onToggle={(checked) => {
                        setBoomiDataHubActive(checked);
                        if (checked) setCustomDataHubActive(false);
                    }}
                    delay={0.08}
                >
                    <Row gutter={[16, 18]}>
                        <Col xs={24} sm={12}>
                            {renderTextField("REST API ", " REST API", boomiRestApi,
                                (e) => setBoomiRestApi(e.target.value))}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "User Name",
                                "User Name",
                                boomiUserName,
                                (e) => setBoomiUserName(e.target.value)
                            )}                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Password",
                                "Password",
                                boomiPassword,
                                (e) => setBoomiPassword(e.target.value)
                            )}                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Method",
                                "Method",
                                boomiMethod,
                                (e) => setBoomiMethod(e.target.value)
                            )}
                        </Col>
                    </Row>
                </AgentCard>
            </Col>

            <Col xs={24} lg={12}>
                <AgentCard
                    title="Custom DataHub Agent"
                    description="Configure database, AI, ticket, and REST connections."
                    category="DataHub Agent"
                    active={customDataHubActive}
                    color="#7c3aed"
                    lightColor="#a855f7"
                    icon={<DatabaseOutlined />}
                    saveIcon={<ApiOutlined />}
                    onToggle={(checked) => {
                        setCustomDataHubActive(checked);
                        if (checked) setBoomiDataHubActive(false);
                    }}
                    delay={0.08}
                >
                    <Row gutter={[16, 18]}>
                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "Database Connection",
                                "Select Database",
                                databaseConnectors.map((item: any) => ({
                                    label: item.connector_name,
                                    value: item.connector_id,
                                })),
                                databaseId,
                                setDatabaseId
                            )}                        </Col>
                        <Col xs={24} sm={12}>
                            {renderSelectField("AI Agent Connection", "Select AI Agent", AiAgents.map((item: any) => ({
                                label: item.agent_name,
                                value: item.agent_id,
                            })),
                                aiAgentId,
                                setAiAgentId)}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "Ticket Connection",
                                "Select Ticket Connection",
                                ticketConnectors.map((item: any) => ({
                                    label: item.ticket_name,
                                    value: item.ticket_id,
                                })),
                                ticketId,
                                setTicketId
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "REST API Connection",
                                "Select REST API",
                                restApiConnectors.map((item: any) => ({
                                    label: item.api_name,
                                    value: item.rest_api_id,
                                })),
                                restApiId,
                                setRestApiId
                            )}
                        </Col>
                    </Row>
                </AgentCard>
            </Col>
        </Row>
    );

    const integrationTab = (
        <Row gutter={[24, 24]} align="stretch">
            <Col xs={24} lg={12}>
                <AgentCard
                    title="Boomi Integration Agent"
                    description="Configure your Boomi integration REST API."
                    category="Integration Agent"
                    active={boomiIntegrationActive}
                    color="#0f766e"
                    lightColor="#14b8a6"
                    icon={<ThunderboltOutlined />}
                    saveIcon={<SaveOutlined />}
                    onToggle={(checked) => {
                        setBoomiIntegrationActive(checked);
                        if (checked) setCustomIntegrationActive(false);
                    }}
                >
                    <Row gutter={[16, 18]}>
                        <Col xs={24} sm={12}>
                            {renderTextField("REST API ", " REST API", boomiRestApi,
                                (e) => setBoomiRestApi(e.target.value))}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "User Name",
                                "User Name",
                                boomiUserName,
                                (e) => setBoomiUserName(e.target.value)
                            )}                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Password",
                                "Password",
                                boomiPassword,
                                (e) => setBoomiPassword(e.target.value)
                            )}                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Method",
                                "Method",
                                boomiMethod,
                                (e) => setBoomiMethod(e.target.value)
                            )}
                        </Col>
                    </Row>
                </AgentCard>
            </Col>

            <Col xs={24} lg={12}>
                <AgentCard
                    title="Custom Integration Agent"
                    description="Configure custom integrations and external connections."
                    category="Integration Agent"
                    active={customIntegrationActive}
                    color="#ea580c"
                    lightColor="#f97316"
                    icon={<DatabaseOutlined />}
                    saveIcon={<ApiOutlined />}
                    onToggle={(checked) => {
                        setCustomIntegrationActive(checked);
                        if (checked) setBoomiIntegrationActive(false);
                    }}
                    delay={0.08}
                >
                    <Row gutter={[16, 18]}>
                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "Database Connection",
                                "Select Database",
                                databaseConnectors.map((item: any) => ({
                                    label: item.connector_name,
                                    value: item.connector_id,
                                })),
                                databaseId,
                                setDatabaseId
                            )}                        </Col>
                        <Col xs={24} sm={12}>
                            {renderSelectField("AI Agent Connection", "Select AI Agent", AiAgents.map((item: any) => ({
                                label: item.agent_name,
                                value: item.agent_id,
                            })),
                                aiAgentId,
                                setAiAgentId)}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "Ticket Connection",
                                "Select Ticket Connection",
                                ticketConnectors.map((item: any) => ({
                                    label: item.ticket_name,
                                    value: item.ticket_id,
                                })),
                                ticketId,
                                setTicketId
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "REST API Connection",
                                "Select REST API",
                                restApiConnectors.map((item: any) => ({
                                    label: item.api_name,
                                    value: item.rest_api_id,
                                })),
                                restApiId,
                                setRestApiId
                            )}
                        </Col>
                    </Row>
                </AgentCard>
            </Col>
        </Row>
    );

    return (
        <div
            style={{
                padding: 32,
                background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 45%, #f8fafc 100%)",
            }}
        >
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, color: "#0f172a" }}>
                    Teams Bot Configuration
                </Title>

                <Text style={{ color: "#64748b", fontSize: 15 }}>
                    Configure DataHub and Integration agents separately.
                </Text>
            </div>

            <Card
                bordered={false}
                style={{
                    borderRadius: 18,
                    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                    border: "1px solid #e5e7eb",
                }}
                bodyStyle={{ padding: 24 }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    size="large"
                    items={[
                        {
                            key: "datahub",
                            label: (
                                <Space>
                                    <DatabaseOutlined />
                                    DataHub
                                </Space>
                            ),
                            children: dataHubTab,
                        },
                        {
                            key: "integration",
                            label: (
                                <Space>
                                    <ApiOutlined />
                                    Integration
                                </Space>
                            ),
                            children: integrationTab,
                        },
                    ]}
                />
            </Card>
        </div>
    );
}