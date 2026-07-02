import React, { useState } from "react";
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
} from "antd";
import {
    RobotOutlined,
    ApiOutlined,
    DatabaseOutlined,
    SaveOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

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

    const [boomiIntegrationActive, setBoomiIntegrationActive] =
        useState<boolean>(true);
    const [customIntegrationActive, setCustomIntegrationActive] =
        useState<boolean>(false);

    const renderSelectField = (label: string, placeholder: string): React.ReactElement => (
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

            <Select
                size="large"
                placeholder={placeholder}
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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay }}
            style={{ height: "100%" }}
        >
            <Card
                hoverable
                bordered={false}
                style={{
                    height: "100%",
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "#ffffff",
                    border: active ? `1px solid ${color}` : "1px solid #e5e7eb",
                    boxShadow: active
                        ? `0 18px 42px ${color}26`
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

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: 32,
                background:
                    "linear-gradient(180deg, #f8fafc 0%, #eef2f7 45%, #f8fafc 100%)",
            }}
        >
            <div style={{ marginBottom: 28 }}>
                <Title level={2} style={{ margin: 0, color: "#0f172a" }}>
                    Teams Bot Configuration
                </Title>

                <Text style={{ color: "#64748b", fontSize: 15 }}>
                    Configure DataHub and Integration agents for your Teams bot.
                </Text>
            </div>

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
                    >
                        {renderSelectField("REST API Connection", "Select REST API")}
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
                                {renderSelectField("Database Connection", "Select Database")}
                            </Col>
                            <Col xs={24} sm={12}>
                                {renderSelectField("AI Agent Connection", "Select AI Agent")}
                            </Col>
                            <Col xs={24} sm={12}>
                                {renderSelectField("Ticket Connection", "Select Ticket Connection")}
                            </Col>
                            <Col xs={24} sm={12}>
                                {renderSelectField("REST API Connection", "Select REST API")}
                            </Col>
                        </Row>
                    </AgentCard>
                </Col>

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
                        delay={0.16}
                    >
                        {renderSelectField("REST API Connection", "Select REST API")}
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
                        delay={0.24}
                    >
                        <Row gutter={[16, 18]}>
                            <Col xs={24} sm={12}>
                                {renderSelectField("Database Connection", "Select Database")}
                            </Col>
                            <Col xs={24} sm={12}>
                                {renderSelectField("AI Agent Connection", "Select AI Agent")}
                            </Col>
                            <Col xs={24} sm={12}>
                                {renderSelectField("Ticket Connection", "Select Ticket Connection")}
                            </Col>
                            <Col xs={24} sm={12}>
                                {renderSelectField("REST API Connection", "Select REST API")}
                            </Col>
                        </Row>
                    </AgentCard>
                </Col>
            </Row>
        </div>
    );
}