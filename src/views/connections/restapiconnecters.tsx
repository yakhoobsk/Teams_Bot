import {
    Button,
    Card,
    Input,
    Space,
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
import { useEffect, useState } from "react";
import CreateRestApiModal from "../../components/restapicreatemodal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RestApiConnectersCreate, RestApiConnectersDelete, RestApiConnectersGet, RestApiConnectersUpdate } from "../../redux/Services/connectersServices";
import { Popover, Typography } from "antd";

const { Paragraph } = Typography;
interface RestApi {
    id: number;
    rest_api_id: string;
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
    created_date?: string;
    created_by?: string;
}


const RestApiManagement = ({ activeTab, type }: { activeTab: string; type: string }) => {
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const restapiconnectersget = useAppSelector((state) => state.connecters?.restapiconnectersget);
    const dispatch = useAppDispatch();
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    useEffect(() => {
        if (activeTab === "RestAPI") {
            dispatch(RestApiConnectersGet({}));
        }
    }, [dispatch]);
    const data = restapiconnectersget?.Response || [];

    const filteredData = data.filter(
        (item: RestApi) =>
            item.api_name.toLowerCase().includes(search.toLowerCase()) ||
            item.base_url.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (restapiconnectersget?.Response?.length) {
            restapiconnectersget.Response.map((item: any) => ({
                id: item.id,
                rest_api_id: item.rest_api_id,
                api_name: item.api_name,
                base_url: item.base_url,
                http_method: item.http_method,
                resource_path: item.resource_path,
                authentication_type: item.authentication_type,
                username: item.username,
                password_token: item.password_token,
                request_headers: item.request_headers || "",
                request_parameters: item.request_parameters || "",
                request_body: item.request_body || "",
                response_format: item.response_format,
                timeout_seconds: item.timeout_seconds,
                retry_count: item.retry_count,
                is_status: item.is_status,
                created_date: item.created_date,
                created_by: item.created_by || "",
            }));

        }
    }, [restapiconnectersget]);


    const handleDelete = async (record: RestApi) => {
        try {
            setLoading(true);

            const payload = {
                rest_api_id: record.rest_api_id,
            };


            await dispatch(
                RestApiConnectersDelete({ payload })
            ).unwrap();


            dispatch(RestApiConnectersGet({}));
        } catch (error) {
            console.error("Delete API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderPopup = (value?: string) => {
        if (!value) return "-";

        return (
            <Popover
                placement="left"
                trigger="hover"
                overlayInnerStyle={{
                    borderRadius: 16,
                    padding: 12,
                }}
                content={
                    <div
                        style={{
                            width: 300,
                            maxHeight: 350,
                            overflow: "auto",
                        }}
                    >
                        <Paragraph
                            copyable
                            style={{
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                fontFamily: "monospace",
                                fontSize: 13,
                                color: "#333",
                            }}
                        >
                            {value}
                        </Paragraph>
                    </div>
                }
            >
                <span
                    style={{
                        cursor: "pointer",
                        color: "#1677ff",
                        display: "inline-block",
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value}
                </span>
            </Popover>
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
            render: renderPopup,
        }, ,
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
            width: 170,
            render: renderPopup,
        },
        {
            title: "Headers",
            dataIndex: "request_headers",
            width: 200,
            render: renderPopup,
        },
        {
            title: "Parameters",
            dataIndex: "request_parameters",
            width: 200,
            render: renderPopup,
        },
        {
            title: "Request Body",
            dataIndex: "request_body",
            width: 220,
            render: renderPopup,
        },
        {
            title: "Resource Path",
            dataIndex: "resource_path",
            width: 180,
            render: renderPopup,
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
            title: "type",
            dataIndex: "Data Hub Type",
            width: 90,
        },
        {
            title: "Actions",
            width: 120,
            fixed: "right",
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedRecord(record);
                                setOpenModal(true);
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Delete">
                        <Button
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
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
                        rowKey="id"
                        columns={columns}
                        dataSource={filteredData}
                        bordered
                        scroll={{ x: 2500 }}
                        pagination={false}
                    />
                </Card>
                <CreateRestApiModal
                    open={openModal}
                    loading={loading}
                    initialValues={selectedRecord}
                    onCancel={() => {
                        setOpenModal(false);
                        setSelectedRecord(null);
                    }}
                    onSubmit={async (values) => {
                        try {
                            setLoading(true);

                            if (selectedRecord) {
                                const payload = {
                                    rest_api_id: selectedRecord.rest_api_id,
                                    api_name: values.api_name,
                                    base_url: values.base_url,
                                    http_method: values.http_method,
                                    resource_path: values.resource_path,
                                    authentication_type: values.authentication_type,
                                    username: values.username,
                                    password_token: values.password_token,
                                    request_headers: values.request_headers,
                                    request_parameters: values.request_parameters,
                                    request_body: values.request_body,
                                    response_format: values.response_format,
                                    timeout_seconds: values.timeout_seconds,
                                    retry_count: values.retry_count,
                                    is_status: values.is_status ? 1 : 0,
                                    updated_by: "yakhoob.shaik@easystepin.com",
                                    updated_date: "2026-07-12 12:00:00",
                                    type: type,
                                };

                                await dispatch(
                                    RestApiConnectersUpdate({ payload })
                                ).unwrap();

                            } else {
                                const payload = {
                                    ...values,
                                    created_by: "yakhoob.shaik@easystepin.com",
                                    is_status: values.is_status ? 1 : 0,
                                    type: type,
                                };

                                await dispatch(
                                    RestApiConnectersCreate({ payload })
                                ).unwrap();
                            }

                            dispatch(RestApiConnectersGet({}));

                            setOpenModal(false);
                            setSelectedRecord(null);
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


export default RestApiManagement;