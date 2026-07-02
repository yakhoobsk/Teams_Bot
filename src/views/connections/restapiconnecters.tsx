import {
    Button,
    Card,
    Input,
    Space,
    Switch,
    Table,
    Tag,
    Tooltip,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    ApiOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import CreateRestApiModal from "../../components/restapicreatemodal";

interface RestApi {
    rest_api_id: number;
    api_name: string;
    base_url: string;
    http_method: string;
    resource_path: string;
    authentication_type: string;
    username: string;
    password_token: string;
    request_headers: string;
    request_parameters: string;
    request_body: string;
    response_format: string;
    timeout_seconds: number;
    retry_count: number;
    is_status: boolean;
}

const initialData: RestApi[] = [
    {
        rest_api_id: 1001,
        api_name: "Get Users",
        base_url: "https://api.company.com",
        http_method: "GET",
        resource_path: "/users",
        authentication_type: "Bearer",
        username: "admin",
        password_token: "********",
        request_headers: "Authorization",
        request_parameters: "page=1",
        request_body: "-",
        response_format: "JSON",
        timeout_seconds: 60,
        retry_count: 3,
        is_status: true,
    },
    {
        rest_api_id: 1002,
        api_name: "Create Ticket",
        base_url: "https://api.company.com",
        http_method: "POST",
        resource_path: "/ticket/create",
        authentication_type: "Basic",
        username: "system",
        password_token: "********",
        request_headers: "Content-Type",
        request_parameters: "-",
        request_body: "{...}",
        response_format: "JSON",
        timeout_seconds: 90,
        retry_count: 5,
        is_status: false,
    },
];

export default function RestApiManagement() {
    const [data, setData] = useState(initialData);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const filteredData = data.filter(
        (item) =>
            item.api_name.toLowerCase().includes(search.toLowerCase()) ||
            item.base_url.toLowerCase().includes(search.toLowerCase())
    );

    const handleStatus = (checked: boolean, id: number) => {
        setData((prev) =>
            prev.map((item) =>
                item.rest_api_id === id
                    ? { ...item, is_status: checked }
                    : item
            )
        );
    };

    const columns: any = [
        {
            title: "REST API ID",
            dataIndex: "rest_api_id",
            width: 120,
            fixed: "left",
        },
        {
            title: "API Name",
            dataIndex: "api_name",
            width: 170,
        },
        {
            title: "Base URL",
            dataIndex: "base_url",
            width: 220,
            ellipsis: true,
        },
        {
            title: "Method",
            dataIndex: "http_method",
            width: 100,
            render: (text: string) => {
                const color =
                    text === "GET"
                        ? "green"
                        : text === "POST"
                            ? "blue"
                            : text === "PUT"
                                ? "orange"
                                : "red";

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "Resource Path",
            dataIndex: "resource_path",
            width: 170,
        },
        {
            title: "Auth Type",
            dataIndex: "authentication_type",
            width: 150,
        },
        {
            title: "Username",
            dataIndex: "username",
            width: 130,
        },
        {
            title: "Password / Token",
            dataIndex: "password_token",
            width: 160,
        },
        {
            title: "Headers",
            dataIndex: "request_headers",
            width: 180,
            ellipsis: true,
        },
        {
            title: "Parameters",
            dataIndex: "request_parameters",
            width: 180,
            ellipsis: true,
        },
        {
            title: "Request Body",
            dataIndex: "request_body",
            width: 170,
            ellipsis: true,
        },
        {
            title: "Response",
            dataIndex: "response_format",
            width: 120,
        },
        {
            title: "Timeout",
            dataIndex: "timeout_seconds",
            width: 110,
            render: (t: number) => `${t}s`,
        },
        {
            title: "Retry",
            dataIndex: "retry_count",
            width: 90,
        },
        {
            title: "Status",
            dataIndex: "is_status",
            width: 130,
            render: (_: any, record: RestApi) => (
                <Space>
                    <Switch
                        checked={record.is_status}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        onChange={(checked) =>
                            handleStatus(checked, record.rest_api_id)
                        }
                    />
                </Space>
            ),
        },
        {
            title: "Actions",
            width: 120,
            fixed: "right",
            render: () => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                        />
                    </Tooltip>

                    <Tooltip title="Delete">
                        <Button
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .6 }}
            style={{
                padding: 25,
                background: "#f4f7fb",
                minHeight: "100vh",
            }}
        >
            <motion.div
                initial={{ y: -40 }}
                animate={{ y: 0 }}
                transition={{ duration: .5 }}
            >
                <Card
                    bordered={false}
                    style={{
                        marginBottom: 25,
                        borderRadius: 18,
                        background:
                            "linear-gradient(135deg,#0F52BA,#1E88E5)",
                        color: "#fff",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 15,
                        }}
                    >
                        <Space size={18}>
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 4,
                                }}
                            >
                                <ApiOutlined
                                    style={{
                                        fontSize: 34,
                                        color: "#fff",
                                    }}
                                />
                            </motion.div>

                            <div>
                                <h2
                                    style={{
                                        color: "#fff",
                                        margin: 0,
                                    }}
                                >
                                    REST API Management
                                </h2>

                                <span>
                                    Manage all your API configurations
                                </span>
                            </div>
                        </Space>

                        <Space>
                            <Input
                                allowClear
                                placeholder="Search API..."
                                prefix={<SearchOutlined style={{ color: "#9ca3af", marginTop: 8 }} />}
                                style={{
                                    width: 260,
                                }}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            <motion.div
                                whileHover={{
                                    scale: 1.08,
                                }}
                                whileTap={{
                                    scale: .95,
                                }}
                            >

                            </motion.div>
                        </Space>
                    </div>
                </Card>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 20,
                }}>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{
                            background: "#fff",
                            color: "#dae0ea",
                            fontWeight: 600,
                        }}
                        onClick={() => setOpenModal(true)}
                    >
                        Create REST API
                    </Button>
                </div>

            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .3 }}
            >
                <Card
                    bordered={false}
                    style={{
                        borderRadius: 18,
                    }}
                >
                    <Table
                        rowKey="rest_api_id"
                        columns={columns}
                        dataSource={filteredData}
                        bordered
                        scroll={{
                            x: 2500,
                        }}
                        pagination={{
                            pageSize: 8,
                            showSizeChanger: true,
                        }}
                    />
                </Card>
                <CreateRestApiModal
                    open={openModal}
                    loading={loading}
                    onCancel={() => setOpenModal(false)}
                    onSubmit={async (values) => {
                        console.log("Form Values:", values);

                        try {
                            setLoading(true);



                            setOpenModal(false);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
            </motion.div>
        </motion.div>
    );
}