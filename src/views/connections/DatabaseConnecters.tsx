import {
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Typography,

} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircleFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import azureImg from "../../assets/AzureSQL.png";
import mysqlImg from "../../assets/mysql.png";
import postgresImg from "../../assets/pgsql.png";
import oracleImg from "../../assets/oracle.png";
import snowflakeImg from "../../assets/snowflake.png";
import { databaseconnecterCreate, DataBaseConnectersGet, databaseconnecterUpdate } from "../../redux/Services/connectersServices";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const { Title, Text } = Typography;
const DatabaseConnectors = ({ activeTab }: { activeTab: string }) => {
    const [selectedDb, setSelectedDb] = useState("azure");
    const dispatch = useAppDispatch()
    const database = useAppSelector((state) => state.connecters?.databaseget);
    const connectors = database?.[0]?.Connectors || [];

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


    const handleSave = async () => {
        const values = await form.validateFields();

        const selectedConnector = connectors.find(
            (item: any) =>
                item.connector_name.toLowerCase() === current.apiKey.toLowerCase()
        );

        const payload = {
            Mail_Id: "",
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
            <Title level={2}>
                Database Connectors
            </Title>

            <Text type="secondary">
                Connect enterprise databases securely
            </Text>

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
                                <Col span={12}>
                                    <Form.Item
                                        label="Host"
                                        name="host"
                                    >
                                        <Input placeholder="e.g. db.company.com or localhost" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Port"
                                        name="port"
                                    >
                                        <Input placeholder="e.g. 1433, 3306, 5432" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Username"
                                        name="username"
                                    >
                                        <Input placeholder="Enter database username" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                    >
                                        <Input.Password placeholder="Enter database password" />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Schema Name"
                                        name="schema"
                                    >
                                        <Input placeholder="e.g. public, dbo, sales_schema" />
                                    </Form.Item>
                                </Col>
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
        </div>
    );
}

export default DatabaseConnectors;