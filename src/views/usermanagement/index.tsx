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
    Space,
    message,
    Tooltip,
} from "antd";
import {
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    UserAddOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { userCreate, UsersGet, UserUpdate } from "../../redux/Services/connectersServices";
import AppPagination from "../../components/AppPagination";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

type UserRow = {
    id: string | number;
    userName: string;
    usermail: string;
    role: string;
    active: boolean;
    isBoomiUser: boolean;
};

type AddUserFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    active: boolean;
};

const UserManagement = ({ activeTab }: { activeTab: string }) => {
    const dispatch = useAppDispatch();
    const userspage = useAppSelector((state) => state.connecters?.usersget);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
    const [form] = Form.useForm<AddUserFormValues>();
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [search, setSearch] = useState("");
    const [addUserOpen, setAddUserOpen] = useState(false);

    useEffect(() => {
        if (activeTab === "usermanagemnt") {
            const payload = {
                search_by_filter: "All",
                search: search,
            };
            dispatch(UsersGet({ Payload: payload, pagnation: pagination }));
        }

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
        isBoomiUser: item.is_boomi_user === "true",
    }));

    const tableUsers = users;

    const openAddUser = () => {
        setIsEdit(false);
        setSelectedUser(null);
        form.resetFields();
        setAddUserOpen(true);
    };
    const closeAddUser = () => {
        form.resetFields();
        setAddUserOpen(false);
    };




    const handleAddUser = async (values: AddUserFormValues) => {
        try {
            const payload = {
                boomi_user_id: "",
                id: "",
                user_id: values.email,
                last_name: values.lastName,
                first_name: values.firstName,
                accountid: "",
                is_boomi_user: "false",
                type: "User",
            };

            await dispatch(
                userCreate({
                    payload,
                })
            ).unwrap();

            message.success("User created successfully");

            dispatch(
                UsersGet({
                    Payload: {
                        search_by_filter: "All",
                        search,
                    },
                    pagnation: pagination,
                })
            );

            closeAddUser();
        } catch (error: any) {
            message.error(error?.message || "Failed to create user");
        }
    };

    const handleUpdateUser = async (values: AddUserFormValues) => {
        try {
            const payload = {
                boomi_user_id: selectedUser?.id,
                user_id: values.email,
                first_name: values.firstName,
                last_name: values.lastName,
                accountid: "",
                is_boomi_user: "false",
                type: "User",
            };

            await dispatch(
                UserUpdate({
                    payload,
                })
            ).unwrap();

            message.success("User updated successfully");

            dispatch(
                UsersGet({
                    Payload: {
                        search_by_filter: "All",
                        search,
                    },
                    pagnation: pagination,
                })
            );

            closeAddUser();
        } catch (error: any) {
            message.error(error?.message || "Failed to update user");
        }
    };
    const handleEdit = (record: UserRow) => {
        setIsEdit(true);
        setSelectedUser(record);

        const [firstName, ...last] = record.userName.split(" ");

        form.setFieldsValue({
            firstName,
            lastName: last.join(" "),
            email: record.usermail,
        });

        setAddUserOpen(true);
    };

    const columns: ColumnsType<UserRow> = [
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
        {
            title: "Actions",
            key: "actions",
            width: 140,
            align: "center",
            render: (_: any, record: UserRow) => (
                <Space size="middle">
                    <Tooltip
                        title={
                            record.isBoomiUser
                                ? "Boomi users cannot be edited"
                                : "Edit User"
                        }
                    >
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            disabled={record.isBoomiUser}
                            style={{
                                color: record.isBoomiUser ? "#bfbfbf" : "#1677ff",
                                fontSize: 18,
                            }}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>


                </Space>
            ),
        }
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
                            size="small"
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
                title={isEdit ? "Update User" : "Add User"}
                open={addUserOpen}
                onCancel={closeAddUser}
                footer={null}
                destroyOnClose
                width={560}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        if (isEdit) {
                            handleUpdateUser(values);
                        } else {
                            handleAddUser(values);
                        }
                    }}
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





                    <Row justify="end" gutter={12}>
                        <Col>
                            <Button onClick={closeAddUser}>Cancel</Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={isEdit ? <EditOutlined /> : <PlusOutlined />}
                                style={{
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    fontWeight: 600,
                                }}
                            >
                                {isEdit ? "Update User" : "Add User"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;