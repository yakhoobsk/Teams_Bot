import {
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Typography,
    Modal,
    Table,
    Popconfirm,


} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircleFilled,
    DatabaseOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import azureImg from "../../assets/AzureSQL.png";
import mysqlImg from "../../assets/mysql.png";
import postgresImg from "../../assets/pgsql.png";
import oracleImg from "../../assets/oracle.png";
import snowflakeImg from "../../assets/snowflake.png";
import { databaseconnecterCreate, DataBaseConnectersGet, databaseconnecterUpdate } from "../../redux/Services/connectersServices";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface DatabaseRecord {
    key: string;
    name: string;
    database: string;
    server: string;
    port: string;
    username: string;
    password: string;
    schema: string;
    warehouse: string;
    host: string;
}

const databaseData = [
    {
        key: "1",
        name: "Azure SQL",
        database: "EmployeeDB",
        server: "azure.database.windows.net",
        port: "1433",
        username: "admin",
        password: "********",
        schema: "dbo",
        warehouse: "-",
        host: "-",
    },
    {
        key: "2",
        name: "Snowflake",
        database: "SalesDB",
        server: "-",
        port: "-",
        username: "snow_user",
        password: "********",
        schema: "PUBLIC",
        warehouse: "COMPUTE_WH",
        host: "-",
    },
];



const DatabaseConnectors = ({ activeTab }: { activeTab: string }) => {
    const [selectedDb, setSelectedDb] = useState("azure");
    const dispatch = useAppDispatch()
    const database = useAppSelector((state) => state.connecters?.databaseget);
    const connectors = database?.[0]?.Connectors || [];
    const auth = useAppSelector((state) => state.auth?.authotp);
    const [openDatabaseModal, setOpenDatabaseModal] = useState(false);
    useEffect(() => {
        if (activeTab === "Database") {
            dispatch(DataBaseConnectersGet({}));
        }
    }, [activeTab, dispatch]);

    const [form] = Form.useForm();
    const databases = [
        {
            key: "azure",
            apiKey: "azuresql",
            name: "Azure SQL",
            image: azureImg,
            color: "#0078D4",
        },
        {
            key: "mysql",
            apiKey: "mysql",
            name: "MySQL",
            image: mysqlImg,
            color: "#00758F",
        },
        {
            key: "postgres",
            apiKey: "postgres",
            name: "PostgreSQL",
            image: postgresImg,
            color: "#336791",
        },
        {
            key: "oracle",
            apiKey: "oracle",
            name: "Oracle",
            image: oracleImg,
            color: "#F80000",
        },
        {
            key: "snowflake",
            apiKey: "snowflake",
            name: "Snowflake",
            image: snowflakeImg,
            color: "#29B5E8",
        },
    ].map((db) => {
        const apiData = connectors.find(
            (item: any) =>
                item.connector_name?.toLowerCase() === db.apiKey.toLowerCase()
        );

        return {
            ...db,
            connectorId: apiData?.connector_id || "",
            connection_url: apiData?.connection_url || "",
            class_name: apiData?.class_name || "",
            user_name: apiData?.user_name || "",
            password: apiData?.password || "",
            schema_name: apiData?.schema_name || "",
        };
    });
    const columns: ColumnsType<DatabaseRecord> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Database Name",
            dataIndex: "database",
            key: "database",
        },
        {
            title: "Server",
            dataIndex: "server",
            key: "server",
        },
        {
            title: "Port",
            dataIndex: "port",
            key: "port",
            width: 100,
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Password",
            dataIndex: "password",
            key: "password",
        },
        {
            title: "Schema",
            dataIndex: "schema",
            key: "schema",
        },
        {
            title: "Warehouse",
            dataIndex: "warehouse",
            key: "warehouse",
        },
        {
            title: "Host",
            dataIndex: "host",
            key: "host",
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            width: 90,
            render: (_) => (
                <Popconfirm
                    title="Delete Connector?"

                >
                    <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm>
            ),
        },
    ];

    const databaseFields = {
        azure: [
            { name: "database", label: "Database Name" },
            { name: "server", label: "Server" },
            { name: "port", label: "Port" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],

        mysql: [
            { name: "database", label: "Database Name" },
            { name: "host", label: "Host" },
            { name: "port", label: "Port" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],

        postgres: [
            { name: "database", label: "Database Name" },
            { name: "host", label: "Host" },
            { name: "port", label: "Port" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],

        oracle: [
            { name: "database", label: "Database Name" },
            { name: "host", label: "Host" },
            { name: "port", label: "Port" },
            { name: "service_name", label: "Service Name" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],

        snowflake: [
            { name: "database", label: "Database Name" },
            { name: "account", label: "Account" },
            { name: "warehouse", label: "Warehouse" },
            { name: "schema", label: "Schema" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],
    };

    const fields = databaseFields[selectedDb as keyof typeof databaseFields];

    const handleSave = async () => {
        const values = await form.validateFields();

        const selectedConnector = connectors.find(
            (item: any) =>
                item.connector_name.toLowerCase() === current.apiKey.toLowerCase()
        );

        const payload = {
            Mail_Id: auth?.Mail_Id,
            connector_name: current.apiKey,
            connection_url: values.host,
            class_name: values.port,
            user_name: values.username,
            password: values.password,
            schema_name: values.schema,
        };

        if (selectedConnector?.connector_id) {
            dispatch(databaseconnecterUpdate({ payload }));
        } else {
            dispatch(databaseconnecterCreate({ payload }));
        }
        dispatch(DataBaseConnectersGet({}));

    };

    const current =
        databases.find((db) => db.key === selectedDb) || databases[0];

    useEffect(() => {
        form.setFieldsValue({
            host: current.connection_url,
            port: current.class_name,
            username: current.user_name,
            password: current.password,
            schema: current.schema_name,
        });
    }, [current, form]);

    return (
        <div
            style={{
                padding: 24,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <div>
                    <Title
                        level={2}
                        style={{ marginBottom: 4 }}
                    >
                        Database Connectors
                    </Title>

                    <Text type="secondary">
                        Connect enterprise databases securely
                    </Text>
                </div>

                <Button
                    type="primary"
                    icon={<DatabaseOutlined />}
                    size="large"
                    style={{
                        borderRadius: 10,
                        height: 42,
                        paddingInline: 20,
                        fontWeight: 600,
                        background: "#1677ff",
                    }}

                    onClick={() => setOpenDatabaseModal(true)}

                >
                    Manage Database Connectors
                </Button>
            </div>

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
                                    <img
                                        src={db.image}
                                        alt={db.name}
                                        style={{
                                            width: 64,
                                            height: 64,
                                            objectFit: "contain",
                                            marginBottom: 12,
                                        }}
                                    />

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
                                        width: 40,
                                        height: 40,
                                        objectFit: "contain",
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: 4,
                                    }}
                                />

                                <Title
                                    level={3}
                                    style={{
                                        color: "#fff",
                                        margin: 0,
                                    }}
                                >
                                    {current.name}
                                </Title>
                            </div>

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
                                {fields.map((field) => (
                                    <Col span={12} key={field.name}>
                                        <Form.Item
                                            label={
                                                <span
                                                    style={{
                                                        color: "#000000ce",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {field.label}
                                                </span>
                                            }
                                            name={field.name}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Please enter ${field.label}`,
                                                },
                                            ]}
                                        >
                                            {field.password ? (
                                                <Input.Password
                                                    placeholder={`Enter ${field.label}`}
                                                />
                                            ) : (
                                                <Input
                                                    placeholder={`Enter ${field.label}`}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                ))}
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
                                    onClick={handleSave}
                                    style={{
                                        borderRadius: 12,
                                        background: current.color,
                                    }}
                                >
                                    Save Connector
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </motion.div>
            </AnimatePresence>

            <Modal
                open={openDatabaseModal}
                title="Database Connectors"
                onCancel={() => setOpenDatabaseModal(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setOpenDatabaseModal(false)}
                    >
                        Close
                    </Button>,
                ]}
                width={1400}
                centered
                destroyOnClose
            >
                <Table
                    bordered
                    rowKey="key"
                    columns={columns}
                    dataSource={databaseData}
                    pagination={{
                        pageSize: 10,
                    }}
                    scroll={{
                        x: 1600,
                    }}
                />
            </Modal>
        </div>
    );
}

export default DatabaseConnectors;