import React, { useState } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Space,
    Table,
    Tag,
    Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { RoleData } from "../../constants/roles";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RoleManagementCreate, RoleManagementDelete, RoleManagementGet, RoleManagementUpdate } from "../../redux/Services/connectersServices";

const { Title, Text } = Typography;

interface RoleFormValues {
    roleName: string;
    description: string;
}

interface RoleManagementProps {
    roles: RoleData[];
}

export default function RoleManagement({ roles }: RoleManagementProps): React.ReactElement {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth?.authotp);
    const currentUserEmail = auth?.Mail_Id || "";
    const [form] = Form.useForm<RoleFormValues>();
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingRecord, setEditingRecord] = useState<RoleData | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const isEditing = editingId !== null;

    const openCreateModal = () => {
        setEditingId(null);
        setEditingRecord(null);
        setOpen(true);
    };

    const openEditModal = (record: RoleData) => {
        setEditingId(record.id);
        setEditingRecord(record);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setEditingId(null);
        setEditingRecord(null);
    };

    const onFinish = async (values: RoleFormValues) => {
        setSaving(true);
        try {
            if (isEditing) {
                const payload = {
                    role_id: editingId,
                    role_name: values.roleName,
                    description: values.description,
                };

                await dispatch(RoleManagementUpdate({ payload })).unwrap();
            } else {
                const payload = {
                    role_name: values.roleName,
                    description: values.description,
                    created_by: currentUserEmail,
                };

                await dispatch(RoleManagementCreate({ payload })).unwrap();
            }

            dispatch(RoleManagementGet({}));
            closeModal();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const deleteRole = async (record: RoleData) => {
        setDeletingId(record.id);
        try {
            await dispatch(RoleManagementDelete({ payload: { role_id: record.id } })).unwrap();
            dispatch(RoleManagementGet({}));
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    const columns: ColumnsType<RoleData> = [
        {
            title: "Role Name",
            dataIndex: "roleName",
            key: "roleName",
            render: (roleName: string) => (
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
                        <SafetyCertificateOutlined />
                    </div>

                    <Text strong style={{ color: "#111827" }}>
                        {roleName}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description: string) => (
                <Text style={{ color: "#475569" }}>{description}</Text>
            ),
        },
        {
            title: "Action",
            key: "action",
            align: "right",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete role"
                        description="Are you sure you want to delete this role?"
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true, loading: deletingId === record.id }}
                        onConfirm={() => deleteRole(record)}
                    >
                        <Button danger icon={<DeleteOutlined />} loading={deletingId === record.id}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div
            className="role-management-page"
            style={{
                minHeight: "100vh",
                padding: 32,
                background: "#f4f7fb",
            }}
        >
            <style>
                {`
          .role-management-page .ant-form-item-label > label {
            color: #020202c9 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }

          .role-management-page .ant-input::placeholder {
            color: #020202c9 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }

          .role-management-page .ant-input {
            border-radius: 10px !important;
          }

          .role-management-page .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155 !important;
            font-weight: 500 !important;
          }

          .role-management-card {
            animation: fadeUp 0.45s ease both;
          }

          .role-management-card:hover {
            transform: translateY(-2px);
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .role-management-page {
              padding: 18px !important;
            }
          }
        `}
            </style>

            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24}>
                        <Tag
                            color="blue"
                            style={{
                                borderRadius: 999,
                                padding: "4px 12px",
                                marginBottom: 10,
                                fontWeight: 600,
                            }}
                        >
                            Role Management
                        </Tag>

                        <Title level={2} style={{ margin: 0, color: "#111827" }}>
                            Roles
                        </Title>

                        <Text style={{ color: "#64748b", fontSize: 15 }}>
                            Create, edit, and delete the roles available to users.
                        </Text>
                    </Col>
                </Row>

                <Card
                    className="role-management-card"
                    variant="borderless"
                    style={{
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                    }}
                    styles={{ body: { padding: 24 } }}
                >
                    <Row
                        align="middle"
                        justify="space-between"
                        gutter={[16, 16]}
                        style={{ marginBottom: 22 }}
                    >
                        <Col>
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
                                    <SafetyCertificateOutlined />
                                </div>

                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Role List
                                    </Title>
                                    <Text type="secondary">
                                        View, edit, and delete roles.
                                    </Text>
                                </div>
                            </Space>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={openCreateModal}
                                style={{
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
                                }}
                            >
                                Create Role
                            </Button>
                        </Col>
                    </Row>

                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={roles}
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    />
                </Card>
            </div>

            <Modal
                title={isEditing ? "Edit Role" : "Create Role"}
                open={open}
                onCancel={closeModal}
                footer={null}
                destroyOnHidden
                width={480}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        roleName: editingRecord?.roleName || "",
                        description: editingRecord?.description || "",
                    }}
                    style={{ marginTop: 18 }}
                >
                    <Form.Item
                        name="roleName"
                        label={
                            <span style={{ color: "#020202c9", fontWeight: 600 }}>
                                Role Name
                            </span>
                        }
                        rules={[{ required: true, message: "Please enter role name" }]}
                    >
                        <Input size="large" placeholder="Enter role name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={
                            <span style={{ color: "#020202c9", fontWeight: 600 }}>
                                Description
                            </span>
                        }
                    >
                        <Input.TextArea rows={3} placeholder="Enter role description" />
                    </Form.Item>

                    <Row justify="end" gutter={12}>
                        <Col>
                            <Button onClick={closeModal}>Cancel</Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={saving}
                                icon={isEditing ? <EditOutlined /> : <PlusOutlined />}
                                style={{
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    fontWeight: 600,
                                }}
                            >
                                {isEditing ? "Update Role" : "Create Role"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}
