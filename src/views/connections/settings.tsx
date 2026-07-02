import { useEffect, useState } from "react";
import {
    Table,
    Card,
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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TeamsconfigDashboardGet, TeamsconfigGet } from "../../redux/Services/connectersServices";
import ThresholdConfiguration from "../../components/ThresholdConfiguration";

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
interface TeamConfigurationProps {
    activeTab: string;
}

const TeamConfiguration = ({ activeTab }: TeamConfigurationProps) => {
    const [openModal, setOpenModal] = useState(false);
    const config = useAppSelector((state) => state.connecters?.teamcofigget);
    const dispatch = useAppDispatch()
    const [dataSource, setDataSource] = useState<TeamConfig[]>([]);
    const Dashboardconfig = useAppSelector((state) => state.connecters?.teamdashboardget);
    const [openThresholdModal, setOpenThresholdModal] = useState(false);

    useEffect(() => {
        if (activeTab === "TeamsConfiguration") {
            dispatch(TeamsconfigGet({}));
            dispatch(TeamsconfigDashboardGet({}));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!config) return;

        const mappedData = (config.All_Divisions || []).map(
            (item: any, index: number) => ({
                key: item.connector_id || index.toString(),
                teamId: item.connector_id,
                connector: "Microsoft Teams",
                companyName: item.created_by,
                ticket: item.ticket_name,
                database: item.connector_name,
                aiAgent: item.agent_name,
                active: item.is_active === "true",
            })
        );
        setDataSource(mappedData);
    }, [config]);

    // const handleActiveChange = (
    //     key: string,
    //     checked: boolean
    // ) => {
    //     setDataSource((prev) =>
    //         prev.map((item) => ({
    //             ...item,
    //             active: checked
    //                 ? item.key === key
    //                 : false,
    //         }))
    //     );
    // };

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
            dataIndex: "ticket",
            key: "ticket",
            width: 180,
            render: (value: string) => value || "-",
        },
        {
            title: "Database",
            dataIndex: "database",
            key: "database",
            width: 180,
            render: (value: string) => value || "-",
        },
        {
            title: "AI Agent",
            dataIndex: "aiAgent",
            key: "aiAgent",
            width: 180,
            render: (value: string) => value || "-",
        },
        {
            title: "Rest API",
            dataIndex: "restApi",
            key: "restApi",
            width: 180,
            render: (value: string) => value || "-",
        },
        // {
        //     title: "Status",
        //     width: 180,
        //     render: (_: any, record: any) => (
        //         <Space>
        //             <Switch
        //                 checked={record.active}
        //                 onChange={(checked) =>
        //                     handleActiveChange(
        //                         record.key,
        //                         checked
        //                     )
        //                 }
        //             />

        //             <Tag
        //                 color={
        //                     record.active
        //                         ? "success"
        //                         : "default"
        //                 }
        //             >
        //                 {record.active
        //                     ? "Active"
        //                     : "Inactive"}
        //             </Tag>
        //         </Space>
        //     ),
        // },
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
                        onClick={() => setOpenThresholdModal(true)}
                        style={{
                            borderRadius: 12,
                            height: 42,
                            background: "linear-gradient(135deg,#6264A7,#7B83EB)",
                            border: "none",
                        }}
                    >
                        Threshold Notification
                    </Button>

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
                        title: "Total Teams Configuration",
                        value: Dashboardconfig?.teams_configuration ?? 0,
                    },
                    {
                        title: "Total Ticket Connectors",
                        value: Dashboardconfig?.ticket_connectors ?? 0,
                    },
                    {
                        title: "Total Database Connectors",
                        value: Dashboardconfig?.database_connectors ?? 0,
                    },
                    {
                        title: "Total Agent Connectors",
                        value: Dashboardconfig?.agent_connectors ?? 0,
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
                        pagination={false}
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

            <ThresholdConfiguration

                open={openThresholdModal}
                onClose={() => setOpenThresholdModal(false)}
            />

        </motion.div>
    );
}

export default TeamConfiguration;