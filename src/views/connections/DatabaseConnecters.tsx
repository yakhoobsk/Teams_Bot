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
import {
    databaseconnecterCreate, DataBaseConnectersGet, databaseconnecterDelete,
    // databaseconnecterUpdate 
} from "../../redux/Services/connectersServices";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface DatabaseRecord {
    key: string;
    connector_id: string;
    name: string;
    database: string;
    database_type: string;
    host: string;
    server: string;
    connection_url: string;
    username: string;
    password: string;
    is_active: string;
}





const DatabaseConnectors = ({ activeTab, type }: { activeTab: string; type: string }) => {
    const [selectedDb, setSelectedDb] = useState("azure");
    const dispatch = useAppDispatch()
    const database = useAppSelector((state) => state.connecters?.databaseget);
    const connectors = database?.Database_Connector || [];
    const auth = useAppSelector((state) => state.auth?.authotp);
    const [openDatabaseModal, setOpenDatabaseModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (connectorId: string) => {
        setDeletingId(connectorId);
        try {
            await dispatch(
                databaseconnecterDelete({ payload: { connector_id: connectorId } })
            ).unwrap();
            const payload = {
                database_type: type
            }
            dispatch(DataBaseConnectersGet(payload));
        } catch {
            // error toast already shown by the databaseconnecterDelete thunk
        } finally {
            setDeletingId(null);
        }
    };
    useEffect(() => {
        if (activeTab === "Database") {
            const payload = {
                database_type: type
            }
            dispatch(DataBaseConnectersGet(payload));
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
            connection_url: apiData?.connection_url || "",
            host: apiData?.host || "",
            server: apiData?.server || "",
            user_name: apiData?.user_name || "",
            password: apiData?.password || "",
            database_schema: apiData?.database_schema || apiData?.database_name || "",
        };
    });
    const columns: ColumnsType<DatabaseRecord> = [
        {
            title: "Connector ID",
            dataIndex: "connector_id",
            key: "connector_id",
            width: 130,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "database schema",
            dataIndex: "database_schema",
            key: "database_schema",
        },
        {
            title: "Type",
            dataIndex: "database_type",
            key: "database_type",
            width: 110,
        },
        {
            title: "Host",
            dataIndex: "host",
            key: "host",
        },
        {
            title: "Server",
            dataIndex: "server",
            key: "server",
        },
        {
            title: "Connection URL",
            dataIndex: "connection_url",
            key: "connection_url",
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
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            width: 100,
            render: (value: string) => (value === "1" ? "Active" : "Inactive"),
        },
        {
            title: "port",
            dataIndex: "port",
            key: "port",
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            width: 90,
            render: (_, record: any) => (
                <Popconfirm
                    title="Delete Connector?"
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true, loading: deletingId === record.connector_id }}
                    onConfirm={() => handleDelete(record.connector_id)}
                >
                    <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        loading={deletingId === record.connector_id}
                    />
                </Popconfirm>
            ),
        },
    ];

    const databaseFields = {
        azure: [
            { name: "server", label: "Server" },
            { name: "port", label: "Port" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],

        mysql: [
            { name: "database_schema", label: "Database Name" },
            { name: "host", label: "Host" },
            { name: "port", label: "Port" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],

        postgres: [
            { name: "database_schema", label: "Database Name" },
            { name: "host", label: "Host" },
            { name: "port", label: "Port" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],

        oracle: [
            { name: "host", label: "Host" },
            { name: "port", label: "Port" },
            { name: "service_name", label: "Service Name" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],

        snowflake: [
            { name: "database_schema", label: "Database Name" },
            { name: "account", label: "Account" },
            { name: "warehouse", label: "Warehouse" },
            { name: "schema", label: "Schema" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password", password: true },
        ],
    };

    const fields = databaseFields[selectedDb as keyof typeof databaseFields];

    const handleSave = async () => {
        const values = form.getFieldsValue();

        const selectedConnector = connectors.find(
            (item: any) =>
                item.connector_name.toLowerCase() === current.apiKey.toLowerCase()
        );

        const payload: any = {
            Mail_Id: auth?.Mail_Id,
            connector_id: selectedConnector?.connector_id || "",
            connector_name: current.apiKey,
            connection_url: values.connection_url || "",
            host: values.host || "",
            user_name: values.username || "",
            password: values.password || "",
            schema_name: values.schema || "",
            created_by: auth?.Mail_Id || "",
            updated_by: auth?.Mail_Id || "",
            is_active: "1",
            database_schema: values.database_schema || "",
            server: values.server || "",
            service_name: values.service_name || "",
            warehouse: values.warehouse || "",
            account: values.account || "",
            database_type: type,
            port: values.port || "",
        };

        setSaving(true);
        try {
            if (selectedConnector?.connector_id) {
                await dispatch(databaseconnecterCreate({ payload })).unwrap();
            } else {
                await dispatch(databaseconnecterCreate({ payload })).unwrap();
            }
            const payloads = {
                database_type: type
            }
            dispatch(DataBaseConnectersGet(payloads));
        } catch {
            // error toast already shown by the databaseconnecter thunks
        } finally {
            setSaving(false);
        }
    };

    const current =
        databases.find((db) => db.key === selectedDb) || databases[0];

    useEffect(() => {
        form.setFieldsValue({
            database_schema: current.database_schema,
            host: current.host,
            server: current.server,
            username: current.user_name,
            password: current.password,
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
                                    type="primary"
                                    size="large"
                                    loading={saving}
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
                    rowKey="connector_id"
                    columns={columns}
                    scroll={{ x: 1600, y: 450 }}
                    dataSource={connectors.map((item: any) => ({
                        key: item.connector_id,
                        connector_id: item.connector_id,
                        name: item.connector_name,
                        database_schema: item.database_schema || item.database_name,
                        database_type: item.database_type,
                        host: item.host,
                        server: item.server,
                        connection_url: item.connection_url,
                        username: item.user_name,
                        password: item.password,
                        port: item.port,
                        is_active: item.is_active,
                    }))}
                    pagination={false}
                />
            </Modal>
        </div>
    );
}

export default DatabaseConnectors;