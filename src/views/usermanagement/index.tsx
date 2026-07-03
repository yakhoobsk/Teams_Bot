import { useEffect, useState } from "react";
import {
    Table,
    Card,
    Row,
    Col,
    Tag,
    Typography,
    Input,
    Button,
    Modal,
    Form,
    Select,
    Space,
    message,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    UserAddOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UsersGet } from "../../redux/Services/connectersServices";
import AppPagination from "../../components/AppPagination";

const { Title, Text } = Typography;

type UserRow = {
    id: string | number;
    userName: string;
    usermail: string;
    role: string;
    active: boolean;
};

type AddUserFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    active: boolean;
};

const UserManagement = () => {
    const dispatch = useAppDispatch();
    const userspage = useAppSelector((state) => state.connecters?.usersget);

    const [form] = Form.useForm<AddUserFormValues>();
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [search, setSearch] = useState("");
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [addedUsers, setAddedUsers] = useState<UserRow[]>([]);

    useEffect(() => {
        const payload = {
            search_by_filter: "All",
            search: search,
        };

        dispatch(UsersGet({ Payload: payload, pagnation: pagination }));
    }, [dispatch, pagination, search]);

    const handlePagination = (page: number, limit: number) => {
        setPagination({ page, limit });
    };

    const handleSearch = (value: string) => {
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));

        setSearch(value);
    };

    const users: UserRow[] = (userspage?.[0]?.results || []).map((item: any) => ({
        id: item.boomi_user_id,
        userName: `${item.first_name} ${item.last_name}`,
        usermail: item.user_id,
        role: item.type,
        active: item.is_boomi_user === "true",
    }));

    const tableUsers = [...addedUsers, ...users];

    const openAddUser = () => {
        form.resetFields();
        form.setFieldsValue({ active: true });
        setAddUserOpen(true);
    };

    const closeAddUser = () => {
        form.resetFields();
        setAddUserOpen(false);
    };

    const handleAddUser = (values: AddUserFormValues) => {
        const newUser: UserRow = {
            id: Date.now(),
            userName: `${values.firstName} ${values.lastName}`,
            usermail: values.email,
            role: values.role,
            active: values.active,
        };

        setAddedUsers((prev) => [newUser, ...prev]);
        message.success("User added successfully");
        closeAddUser();
    };

    const columns = [
        {
            title: "User ID",
            dataIndex: "id",
            width: 130,
            render: (value: string | number) => (
                <Text style={{ color: "#475569", fontWeight: 500 }}>{value}</Text>
            ),
        },
        {
            title: "User Name",
            dataIndex: "userName",
            render: (value: string) => (
                <Space>
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UserOutlined />
                    </div>

                    <Text strong style={{ color: "#111827" }}>
                        {value}
                    </Text>
                </Space>
            ),
        },
        {
            title: "User Mail",
            dataIndex: "usermail",
            render: (value: string) => (
                <Text style={{ color: "#475569" }}>{value}</Text>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            render: (value: string) => (
                <Tag color="blue" style={{ borderRadius: 999, fontWeight: 500 }}>
                    {value}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "active",
            width: 130,
            render: (active: boolean) => (
                <Tag
                    style={{
                        backgroundColor: active ? "#ecfdf5" : "#fef2f2",
                        color: active ? "#047857" : "#dc2626",
                        border: active ? "1px solid #bbf7d0" : "1px solid #fecaca",
                        borderRadius: 999,
                        fontWeight: 600,
                        padding: "4px 12px",
                    }}
                >
                    {active ? "Active" : "Inactive"}
                </Tag>
            ),
        },
    ];

    return (
        <div
            className="user-management-page"
            style={{
                minHeight: "100vh",
                padding: 24,
                background: "#f4f7fb",
            }}
        >
            <style>
                {`
          .user-management-page .ant-form-item-label > label {
            color: #020202c9 !important;
            font-size: 14px !important;
            font-weight: 500 !important;
          }

          .user-management-page .ant-input::placeholder,
          .user-management-page .ant-select-selection-placeholder {
            color: #020202c9 !important;
            font-size: 14px !important;
            font-weight: 500 !important;
          }

          .user-management-page .ant-input,
          .user-management-page .ant-select-selector {
            border-radius: 10px !important;
          }

          .user-management-page .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155 !important;
            font-weight: 600 !important;
          }

          .user-management-card {
            animation: fadeUp 0.4s ease both;
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .user-management-page {
              padding: 16px !important;
            }
          }
        `}
            </style>

            <Card
                className="user-management-card"
                bordered={false}
                style={{
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                }}
                bodyStyle={{ padding: 24 }}
            >
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col xs={24} md={14}>
                        <Space align="center" size={12}>
                            <div
                                style={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: 12,
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 22,
                                }}
                            >
                                <UserAddOutlined />
                            </div>

                            <div>
                                <Title level={3} style={{ margin: 0, color: "#111827" }}>
                                    User Management
                                </Title>
                                <Text style={{ color: "#64748b" }}>
                                    Search, view, and add users.
                                </Text>
                            </div>
                        </Space>
                    </Col>

                    <Col xs={24} md={10} style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={openAddUser}
                            style={{
                                borderRadius: 10,
                                fontWeight: 600,
                                background: "#2563eb",
                                borderColor: "#2563eb",
                                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
                            }}
                        >
                            Add User
                        </Button>
                    </Col>
                </Row>

                <Row
                    justify="space-between"
                    align="middle"
                    gutter={[16, 16]}
                    style={{ marginTop: 24, marginBottom: 20 }}
                >
                    <Col xs={24} md={10} lg={8}>
                        <Input
                            placeholder="Search users..."
                            allowClear
                            size="large"
                            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                </Row>

                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={tableUsers}
                    scroll={{ x: 900 }}
                    pagination={false}
                />

                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <AppPagination
                        currentPage={pagination.page}
                        pageSize={pagination.limit}
                        totalRecords={Number(userspage?.[0]?.totalResults || 0)}
                        onChange={handlePagination}
                    />
                </div>
            </Card>

            <Modal
                title="Add User"
                open={addUserOpen}
                onCancel={closeAddUser}
                footer={null}
                destroyOnClose
                width={560}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddUser}
                    initialValues={{ active: true }}
                    style={{ marginTop: 18 }}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="firstName"
                                label={
                                    <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                        First Name
                                    </span>
                                }
                                rules={[{ required: true, message: "Please enter first name" }]}
                            >
                                <Input size="large" placeholder="Enter first name" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="lastName"
                                label={
                                    <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                        Last Name
                                    </span>
                                }
                                rules={[{ required: true, message: "Please enter last name" }]}
                            >
                                <Input size="large" placeholder="Enter last name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label={
                            <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                Email
                            </span>
                        }
                        rules={[
                            { required: true, message: "Please enter user mail" },
                            { type: "email", message: "Please enter valid email" },
                        ]}
                    >
                        <Input size="large" placeholder="Enter user mail" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label={
                            <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                Role
                            </span>
                        }
                        rules={[{ required: true, message: "Please select role" }]}
                    >
                        <Select
                            size="large"
                            placeholder="Select role"
                            options={[
                                { label: "Admin", value: "Admin" },
                                { label: "User", value: "User" },
                                { label: "Developer", value: "Developer" },
                                { label: "Manager", value: "Manager" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="active" label={
                        <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                            Status
                        </span>
                    } valuePropName="checked">
                        <Select
                            size="large"
                            placeholder="Select status"
                            options={[
                                { label: "Active", value: true },
                                { label: "Inactive", value: false },
                            ]}
                        />
                    </Form.Item>

                    <Row justify="end" gutter={12}>
                        <Col>
                            <Button onClick={closeAddUser}>Cancel</Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<PlusOutlined />}
                                style={{
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    fontWeight: 600,
                                }}
                            >
                                Add User
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;