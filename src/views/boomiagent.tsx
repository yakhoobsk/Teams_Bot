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
import dayjs from "dayjs";
import { AIConnectersGet, DataBaseConnectersGet, ITSMConnectersGet, RestApiConnectersGet, TeamsconfigrationGet, TeamsconfigrationUpdate } from "../redux/Services/connectersServices";
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
    onSave: () => void;
    saving?: boolean;
    children: ReactNode;
    delay?: number;
};

function AgentCard({
    title,
    description,
    category,
    active,
    color,
    lightColor,
    icon,
    saveIcon,
    onToggle,
    onSave,
    saving = false,
    children,
    delay = 0,
}: AgentCardProps): React.ReactElement {
    return (
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
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "#ffffff",
                    border: active ? `1px solid ${color}` : "1px solid #e5e7eb",
                    boxShadow: active
                        ? `0 18px 42px ${color}24`
                        : "0 10px 30px rgba(15, 23, 42, 0.07)",
                    transition: "all 0.25s ease",
                }}
                bodyStyle={{ padding: 0, display: "flex", flexDirection: "column", flex: 1 }}
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
                                            fontWeight: 600,
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
                                            fontWeight: 500,
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
                                        fontWeight: 600,
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
                        flex: 1,
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
                        loading={saving}
                        disabled={!active}
                        onClick={onSave}
                        style={{
                            marginTop: 24,
                            height: 46,
                            borderRadius: 10,
                            fontWeight: 500,
                            background: active ? color : "#e5e7eb",
                            borderColor: active ? color : "#e5e7eb",
                            color: active ? "#ffffff" : "#9ca3af",
                            boxShadow: active ? `0 8px 22px ${color}40` : "none",
                        }}
                    >
                        Save Configuration
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}

const EMPTY_LIST: any[] = [];
const EMPTY_META = { team_id: "", created_by: "", created_date: "" };

export default function AgentConfiguration(): React.ReactElement {
    const [boomiDataHubActive, setBoomiDataHubActive] = useState<boolean>(true);
    const [customDataHubActive, setCustomDataHubActive] = useState<boolean>(false);
    const [boomiIntegrationActive, setBoomiIntegrationActive] = useState<boolean>(true);
    const [customIntegrationActive, setCustomIntegrationActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const AiAgents = useAppSelector((state) => state.connecters?.aiagentget?.[0]?.agents) || EMPTY_LIST;
    const databaseConnectors = useAppSelector((state) => state.connecters?.databaseget?.Database_Connector) || EMPTY_LIST;
    const restApiConnectors = useAppSelector((state) => state.connecters?.restapiconnectersget?.Response) || EMPTY_LIST;
    const ticketConnectors = useAppSelector((state) => state.connecters?.itsmget?.Response) || EMPTY_LIST;
    const [activeTab, setActiveTab] = useState("datahub");
    // DataHub Custom - the full connector/agent/ticket record, not just its name,
    // so the dropdown still shows the right value even if the freshly-fetched
    // (type-filtered) list doesn't happen to include that record, and saving
    // doesn't silently drop the field.
    const [datahubDatabaseRecord, setDatahubDatabaseRecord] = useState<any>(null);
    const [datahubAiAgentRecord, setDatahubAiAgentRecord] = useState<any>(null);
    const [datahubTicketRecord, setDatahubTicketRecord] = useState<any>(null);
    const [datahubRestApiRecord, setDatahubRestApiRecord] = useState<any>(null);

    // Integration Custom
    const [integrationDatabaseRecord, setIntegrationDatabaseRecord] = useState<any>(null);
    const [integrationAiAgentRecord, setIntegrationAiAgentRecord] = useState<any>(null);
    const [integrationTicketRecord, setIntegrationTicketRecord] = useState<any>(null);
    const [integrationRestApiRecord, setIntegrationRestApiRecord] = useState<any>(null);

    // DataHub Boomi
    const [datahubBoomiRestApi, setDatahubBoomiRestApi] = useState("");
    const [datahubBoomiUserName, setDatahubBoomiUserName] = useState("");
    const [datahubBoomiPassword, setDatahubBoomiPassword] = useState("");
    const [datahubBoomiMethod, setDatahubBoomiMethod] = useState("");
    const [datahubBoomiDeploymentId, setDatahubBoomiDeploymentId] = useState("");

    // Integration Boomi
    const [integrationBoomiRestApi, setIntegrationBoomiRestApi] = useState("");
    const [integrationBoomiUserName, setIntegrationBoomiUserName] = useState("");
    const [integrationBoomiPassword, setIntegrationBoomiPassword] = useState("");
    const [integrationBoomiMethod, setIntegrationBoomiMethod] = useState("");
    const [integrationBoomiDeploymentId, setIntegrationBoomiDeploymentId] = useState("");
    const configget = useAppSelector((state) => state.connecters?.TeamsconfigrationGets) || EMPTY_LIST;
    const auth = useAppSelector((state) => state.auth?.authotp);
    const [savingDataHub, setSavingDataHub] = useState(false);
    const [savingIntegration, setSavingIntegration] = useState(false);

    const [datahubBoomiMeta, setDatahubBoomiMeta] = useState(EMPTY_META);
    const [datahubCustomMeta, setDatahubCustomMeta] = useState(EMPTY_META);
    const [integrationBoomiMeta, setIntegrationBoomiMeta] = useState(EMPTY_META);
    const [integrationCustomMeta, setIntegrationCustomMeta] = useState(EMPTY_META);
    useEffect(() => {

        dispatch(TeamsconfigrationGet({}));

    }, [dispatch]);

    useEffect(() => {
        dispatch(ITSMConnectersGet({}));
        dispatch(AIConnectersGet({}));
    }, [dispatch]);

    useEffect(() => {
        dispatch(RestApiConnectersGet({ type: activeTab === "datahub" ? "Datahub" : "Integration", }));
        dispatch(DataBaseConnectersGet({ database_type: activeTab === "datahub" ? "Datahub" : "Integration", }));
    }, [dispatch, activeTab]);


    const extractMeta = (config: any) => ({
        team_id: config?.team_id || "",
        created_by: config?.created_by || "",
        created_date: config?.created_date || "",
    });

    const parseRestApiDetails = (details: any): any => {
        try {
            const parsed = typeof details === "string" ? JSON.parse(details) : details;
            return Array.isArray(parsed) ? parsed[0] || {} : parsed || {};
        } catch (error) {
            console.error("Failed to parse rest_api_details", error);
            return {};
        }
    };

    const hasValue = (record: any): boolean =>
        !!record && Object.keys(record).length > 0;

    // Makes sure the dropdown can always display the currently-configured
    // value, even when the freshly-fetched (type-filtered) list doesn't
    // happen to include it.
    const withFallbackOption = (
        options: { label: string; value: string }[],
        record: any,
        nameKey: string
    ) => {
        const currentName = record?.[nameKey];
        if (currentName && !options.some((o) => o.value === currentName)) {
            return [...options, { label: currentName, value: currentName }];
        }
        return options;
    };

    const pickRecord = (list: any[], value: string, nameKey: string, currentRecord: any) => {
        if (!value) return null;
        return (
            list.find((item: any) => item[nameKey] === value) ||
            (currentRecord?.[nameKey] === value ? currentRecord : { [nameKey]: value })
        );
    };

    useEffect(() => {
        const configs = configget?.[0]?.Teams_Configuration;

        if (!configs?.length) return;

        // DataHub Boomi
        const datahubBoomi = configs.find(
            (x: any) => x.type === "datahub agent"
        );

        // DataHub Custom
        const datahubCustom = configs.find(
            (x: any) => x.type === "datahub custom"
        );

        // Integration Boomi
        const integrationBoomi = configs.find(
            (x: any) => x.type === "integrations agent"
        );

        // Integration Custom
        const integrationCustom = configs.find(
            (x: any) => x.type === "integrations custom"
        );

        // ---------------- DATAHUB BOOMI ----------------

        if (datahubBoomi) {

            setBoomiDataHubActive(datahubBoomi.status === "active");
            setCustomDataHubActive(datahubBoomi.status !== "active");
            setDatahubBoomiMeta(extractMeta(datahubBoomi));

            setDatahubBoomiRestApi(datahubBoomi.rest_api_name || "");

            if (datahubBoomi.rest_api_details) {
                const rest = parseRestApiDetails(datahubBoomi.rest_api_details);

                setDatahubBoomiUserName(rest.username || "");
                setDatahubBoomiPassword(rest.password || rest.password_token || "");
                setDatahubBoomiMethod(rest.method || rest.http_method || "");
                setDatahubBoomiDeploymentId(rest.deployment_id || "");
            }
        }

        // ---------------- DATAHUB CUSTOM ----------------

        if (datahubCustom) {
            setDatahubCustomMeta(extractMeta(datahubCustom));

            const db = parseRestApiDetails(datahubCustom.database_details);
            const ai = parseRestApiDetails(datahubCustom.ai_agent_details);
            const ticket = parseRestApiDetails(datahubCustom.ticket_details);
            const rest = parseRestApiDetails(datahubCustom.rest_api_details);

            setDatahubDatabaseRecord(hasValue(db) ? db : null);
            setDatahubAiAgentRecord(hasValue(ai) ? ai : null);
            setDatahubTicketRecord(hasValue(ticket) ? ticket : null);
            setDatahubRestApiRecord(hasValue(rest) ? rest : null);
        }
        // ---------------- INTEGRATION BOOMI ----------------

        if (integrationBoomi) {

            setBoomiIntegrationActive(integrationBoomi.status === "active");
            setCustomIntegrationActive(integrationBoomi.status !== "active");
            setIntegrationBoomiMeta(extractMeta(integrationBoomi));

            setIntegrationBoomiRestApi(integrationBoomi.rest_api_name || "");

            if (integrationBoomi.rest_api_details) {
                const rest = parseRestApiDetails(integrationBoomi.rest_api_details);

                setIntegrationBoomiUserName(rest.username || "");
                setIntegrationBoomiPassword(rest.password || rest.password_token || "");
                setIntegrationBoomiMethod(rest.method || rest.http_method || "");
                setIntegrationBoomiDeploymentId(rest.deployment_id || "");
            }
        }

        // ---------------- INTEGRATION CUSTOM ----------------

        if (integrationCustom) {
            setIntegrationCustomMeta(extractMeta(integrationCustom));

            const db = parseRestApiDetails(integrationCustom.database_details);
            const ai = parseRestApiDetails(integrationCustom.ai_agent_details);
            const ticket = parseRestApiDetails(integrationCustom.ticket_details);
            const rest = parseRestApiDetails(integrationCustom.rest_api_details);

            setIntegrationDatabaseRecord(hasValue(db) ? db : null);
            setIntegrationAiAgentRecord(hasValue(ai) ? ai : null);
            setIntegrationTicketRecord(hasValue(ticket) ? ticket : null);
            setIntegrationRestApiRecord(hasValue(rest) ? rest : null);
        }

    }, [configget]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };
    // create or update 

    const buildPayload = (
        type: "datahub" | "integration",
        isBoomi: boolean
    ) => {

        const selectedDb = type === "datahub" ? datahubDatabaseRecord : integrationDatabaseRecord;
        const selectedAi = type === "datahub" ? datahubAiAgentRecord : integrationAiAgentRecord;
        const selectedTicket = type === "datahub" ? datahubTicketRecord : integrationTicketRecord;
        const selectedRest = type === "datahub" ? datahubRestApiRecord : integrationRestApiRecord;

        const boomiRestApi = type === "datahub" ? datahubBoomiRestApi : integrationBoomiRestApi;
        const boomiUserName = type === "datahub" ? datahubBoomiUserName : integrationBoomiUserName;
        const boomiPassword = type === "datahub" ? datahubBoomiPassword : integrationBoomiPassword;
        const boomiMethod = type === "datahub" ? datahubBoomiMethod : integrationBoomiMethod;
        const boomiDeploymentId = type === "datahub" ? datahubBoomiDeploymentId : integrationBoomiDeploymentId;

        const meta =
            type === "datahub"
                ? (isBoomi ? datahubBoomiMeta : datahubCustomMeta)
                : (isBoomi ? integrationBoomiMeta : integrationCustomMeta);

        const currentUserEmail = auth?.Mail_Id || "";
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

        return {

            Type: `${type === "datahub" ? "datahub" : "integrations"} ${isBoomi ? "agent" : "custom"}`,

            company_name: "EasyStepIn",

            connector: "CN-000001",

            team_id: meta.team_id,

            status: isBoomi ? "active" : "inactive",

            type_status: isBoomi ? "true" : "false",

            is_active: isBoomi ? "1" : "0",

            created_by: meta.created_by || currentUserEmail,
            updated_by: currentUserEmail,
            created_date: meta.created_date || now,
            updated_date: now,

            // ---------------- BOOMI ----------------

            rest_api_name: isBoomi
                ? boomiRestApi
                : selectedRest?.api_name || "",

            rest_api_details: isBoomi
                ? [
                    {
                        api: boomiRestApi,
                        username: boomiUserName,
                        password: boomiPassword,
                        method: boomiMethod,
                        deployment_id: boomiDeploymentId,
                    }
                ]
                : (selectedRest ? [selectedRest] : []),

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

    const handleSaveIntegration = async () => {
        const payload = buildPayload("integration", boomiIntegrationActive);

        setSavingIntegration(true);
        try {
            await dispatch(TeamsconfigrationUpdate({ payload })).unwrap();
        } catch {
            // error toast already shown by the TeamsconfigrationUpdate thunk
        } finally {
            setSavingIntegration(false);
        }
    };
    const handleSaveDataHub = async () => {
        const payload = buildPayload("datahub", boomiDataHubActive);

        setSavingDataHub(true);
        try {
            await dispatch(TeamsconfigrationUpdate({ payload })).unwrap();
        } catch {
            // error toast already shown by the TeamsconfigrationUpdate thunk
        } finally {
            setSavingDataHub(false);
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
                fontWeight: 500,
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
                    fontWeight: 500,
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
                    onSave={handleSaveDataHub}
                    saving={savingDataHub}
                    delay={0.08}
                >
                    <Row gutter={[16, 18]}>
                        <Col xs={24}>
                            {renderTextField("REST API", "REST API URL", datahubBoomiRestApi,
                                (e) => setDatahubBoomiRestApi(e.target.value))}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "User Name",
                                "User Name",
                                datahubBoomiUserName,
                                (e) => setDatahubBoomiUserName(e.target.value)
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Password",
                                "Password",
                                datahubBoomiPassword,
                                (e) => setDatahubBoomiPassword(e.target.value)
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Method",
                                "Method",
                                datahubBoomiMethod,
                                (e) => setDatahubBoomiMethod(e.target.value)
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Deployment ID",
                                "Deployment ID",
                                datahubBoomiDeploymentId,
                                (e) => setDatahubBoomiDeploymentId(e.target.value)
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
                    onSave={handleSaveDataHub}
                    saving={savingDataHub}
                    delay={0.08}
                >
                    <Row gutter={[16, 18]}>
                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "Database Connection",
                                "Select Database",
                                withFallbackOption(
                                    databaseConnectors.map((item: any) => ({
                                        label: item.connector_name,
                                        value: item.connector_name,
                                    })),
                                    datahubDatabaseRecord,
                                    "connector_name"
                                ),
                                datahubDatabaseRecord?.connector_name || "",
                                (value) =>
                                    setDatahubDatabaseRecord(
                                        pickRecord(databaseConnectors, value, "connector_name", datahubDatabaseRecord)
                                    )
                            )}
                        </Col>

                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "AI Agent Connection",
                                "Select AI Agent",
                                withFallbackOption(
                                    AiAgents.map((item: any) => ({
                                        label: item.agent_name,
                                        value: item.agent_name,
                                    })),
                                    datahubAiAgentRecord,
                                    "agent_name"
                                ),
                                datahubAiAgentRecord?.agent_name || "",
                                (value) =>
                                    setDatahubAiAgentRecord(
                                        pickRecord(AiAgents, value, "agent_name", datahubAiAgentRecord)
                                    )
                            )}
                        </Col>

                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "Ticket Connection",
                                "Select Ticket Connection",
                                withFallbackOption(
                                    ticketConnectors.map((item: any) => ({
                                        label: item.ticket_name,
                                        value: item.ticket_name,
                                    })),
                                    datahubTicketRecord,
                                    "ticket_name"
                                ),
                                datahubTicketRecord?.ticket_name || "",
                                (value) =>
                                    setDatahubTicketRecord(
                                        pickRecord(ticketConnectors, value, "ticket_name", datahubTicketRecord)
                                    )
                            )}
                        </Col>

                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "REST API Connection",
                                "Select REST API",
                                withFallbackOption(
                                    restApiConnectors.map((item: any) => ({
                                        label: item.api_name,
                                        value: item.api_name,
                                    })),
                                    datahubRestApiRecord,
                                    "api_name"
                                ),
                                datahubRestApiRecord?.api_name || "",
                                (value) =>
                                    setDatahubRestApiRecord(
                                        pickRecord(restApiConnectors, value, "api_name", datahubRestApiRecord)
                                    )
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
                    onSave={handleSaveIntegration}
                    saving={savingIntegration}
                >
                    <Row gutter={[16, 18]}>
                        <Col xs={24}>
                            {renderTextField("REST API", "REST API URL", integrationBoomiRestApi,
                                (e) => setIntegrationBoomiRestApi(e.target.value))}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "User Name",
                                "User Name",
                                integrationBoomiUserName,
                                (e) => setIntegrationBoomiUserName(e.target.value)
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Password",
                                "Password",
                                integrationBoomiPassword,
                                (e) => setIntegrationBoomiPassword(e.target.value)
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Method",
                                "Method",
                                integrationBoomiMethod,
                                (e) => setIntegrationBoomiMethod(e.target.value)
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {renderTextField(
                                "Deployment ID",
                                "Deployment ID",
                                integrationBoomiDeploymentId,
                                (e) => setIntegrationBoomiDeploymentId(e.target.value)
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
                    onSave={handleSaveIntegration}
                    saving={savingIntegration}
                    delay={0.08}
                >
                    <Row gutter={[16, 18]}>
                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "Database Connection",
                                "Select Database",
                                withFallbackOption(
                                    databaseConnectors.map((item: any) => ({
                                        label: item.connector_name,
                                        value: item.connector_name,
                                    })),
                                    integrationDatabaseRecord,
                                    "connector_name"
                                ),
                                integrationDatabaseRecord?.connector_name || "",
                                (value) =>
                                    setIntegrationDatabaseRecord(
                                        pickRecord(databaseConnectors, value, "connector_name", integrationDatabaseRecord)
                                    )
                            )}
                        </Col>

                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "AI Agent Connection",
                                "Select AI Agent",
                                withFallbackOption(
                                    AiAgents.map((item: any) => ({
                                        label: item.agent_name,
                                        value: item.agent_name,
                                    })),
                                    integrationAiAgentRecord,
                                    "agent_name"
                                ),
                                integrationAiAgentRecord?.agent_name || "",
                                (value) =>
                                    setIntegrationAiAgentRecord(
                                        pickRecord(AiAgents, value, "agent_name", integrationAiAgentRecord)
                                    )
                            )}
                        </Col>

                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "Ticket Connection",
                                "Select Ticket Connection",
                                withFallbackOption(
                                    ticketConnectors.map((item: any) => ({
                                        label: item.ticket_name,
                                        value: item.ticket_name,
                                    })),
                                    integrationTicketRecord,
                                    "ticket_name"
                                ),
                                integrationTicketRecord?.ticket_name || "",
                                (value) =>
                                    setIntegrationTicketRecord(
                                        pickRecord(ticketConnectors, value, "ticket_name", integrationTicketRecord)
                                    )
                            )}
                        </Col>

                        <Col xs={24} sm={12}>
                            {renderSelectField(
                                "REST API Connection",
                                "Select REST API",
                                withFallbackOption(
                                    restApiConnectors.map((item: any) => ({
                                        label: item.api_name,
                                        value: item.api_name,
                                    })),
                                    integrationRestApiRecord,
                                    "api_name"
                                ),
                                integrationRestApiRecord?.api_name || "",
                                (value) =>
                                    setIntegrationRestApiRecord(
                                        pickRecord(restApiConnectors, value, "api_name", integrationRestApiRecord)
                                    )
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