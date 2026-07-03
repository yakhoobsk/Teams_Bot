import React, { useMemo, useState } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Typography,
    message,
    Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    TeamOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface GroupData {
    id: number;
    groupName: string;
    groupMembers: string[];
    active: boolean;
}

interface GroupFormValues {
    groupName: string;
    groupMembers: string[];
    active: boolean;
}

const memberOptions = [
    "John Smith",
    "Robert",
    "David",
    "Michael",
    "Emma",
    "Sophia",
    "Olivia",
    "William",
    "James",
    "Daniel",
];

export default function GroupManagement(): React.ReactElement {
    const [form] = Form.useForm<GroupFormValues>();

    const [open, setOpen] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [groups, setGroups] = useState<GroupData[]>([
        {
            id: 1,
            groupName: "Product",
            groupMembers: ["John Smith", "Emma", "David"],
            active: true,
        },
        {
            id: 2,
            groupName: "Service",
            groupMembers: ["Robert", "Sophia"],
            active: false,
        },
        {
            id: 3,
            groupName: "R&D",
            groupMembers: ["Michael", "Olivia", "William"],
            active: true,
        },
    ]);

    const isEditing = editingId !== null;

    const activeCount = groups.filter((item) => item.active).length;
    const inactiveCount = groups.length - activeCount;

    const openCreateModal = (): void => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ active: true });
        setOpen(true);
    };

    const openEditModal = (record: GroupData): void => {
        setEditingId(record.id);
        form.setFieldsValue({
            groupName: record.groupName,
            groupMembers: record.groupMembers,
            active: record.active,
        });
        setOpen(true);
    };

    const closeModal = (): void => {
        setOpen(false);
        setEditingId(null);
        form.resetFields();
    };

    const onFinish = (values: GroupFormValues): void => {
        if (editingId !== null) {
            setGroups((prev) =>
                prev.map((item) =>
                    item.id === editingId
                        ? {
                            ...item,
                            ...values,
                        }
                        : item
                )
            );

            message.success("Group updated successfully");
        } else {
            setGroups((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    ...values,
                },
            ]);

            message.success("Group created successfully");
        }

        closeModal();
    };

    const toggleStatus = (id: number, active: boolean): void => {
        setGroups((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        active,
                    }
                    : item
            )
        );

        message.success(active ? "Group activated" : "Group deactivated");
    };

    const deleteGroup = (id: number): void => {
        setGroups((prev) => prev.filter((item) => item.id !== id));
        message.success("Group deleted successfully");
    };

    const columns: ColumnsType<GroupData> = useMemo(
        () => [
            {
                title: "Group Name",
                dataIndex: "groupName",
                key: "groupName",
                render: (groupName: string) => (
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
                            <TeamOutlined />
                        </div>

                        <Text strong style={{ color: "#111827" }}>
                            {groupName}
                        </Text>
                    </Space>
                ),
            },
            {
                title: "Group Members",
                dataIndex: "groupMembers",
                key: "groupMembers",
                render: (members: string[]) => (
                    <Space size={[6, 6]} wrap>
                        {members.map((member) => (
                            <Tag key={member} color="blue" style={{ borderRadius: 999 }}>
                                {member}
                            </Tag>
                        ))}
                    </Space>
                ),
            },
            {
                title: "Status",
                dataIndex: "active",
                key: "active",
                render: (active: boolean, record) => (
                    <Space>
                        <Switch
                            checked={active}
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            onChange={(checked) => toggleStatus(record.id, checked)}
                        />
                        <Tag color={active ? "success" : "default"}>
                            {active ? "Active" : "Inactive"}
                        </Tag>
                    </Space>
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
                            title="Delete group"
                            description="Are you sure you want to delete this group?"
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => deleteGroup(record.id)}
                        >
                            <Button danger icon={<DeleteOutlined />}>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                ),
            },
        ],
        []
    );

    return (
        <div
            className="group-management-page"
            style={{
                minHeight: "100vh",
                padding: 32,
                background: "#f4f7fb",
            }}
        >
            <style>
                {`
          .group-management-page .ant-form-item-label > label {
            color: #020202c9 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }

          .group-management-page .ant-input::placeholder,
          .group-management-page .ant-select-selection-placeholder {
            color: #020202c9 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }

          .group-management-page .ant-input,
          .group-management-page .ant-select-selector {
            border-radius: 10px !important;
          }

          .group-management-page .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155 !important;
            font-weight: 600 !important;
          }

          .group-management-card {
            animation: fadeUp 0.45s ease both;
          }

          .summary-card {
            animation: fadeUp 0.35s ease both;
            transition: all 0.25s ease;
          }

          .summary-card:hover,
          .group-management-card:hover {
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
            .group-management-page {
              padding: 18px !important;
            }
          }
        `}
            </style>

            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} lg={14}>
                        <Tag
                            color="blue"
                            style={{
                                borderRadius: 999,
                                padding: "4px 12px",
                                marginBottom: 10,
                                fontWeight: 600,
                            }}
                        >
                            Group Management
                        </Tag>

                        <Title level={2} style={{ margin: 0, color: "#111827" }}>
                            Groups
                        </Title>

                        <Text style={{ color: "#64748b", fontSize: 15 }}>
                            Create groups, assign members, and manage active or inactive status.
                        </Text>
                    </Col>

                    <Col xs={24} lg={10}>
                        <Row gutter={[14, 14]}>
                            <Col xs={12}>
                                <Card
                                    className="summary-card"
                                    bordered={false}
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #dbeafe",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    bodyStyle={{ padding: 18 }}
                                >
                                    <Text style={{ color: "#2563eb", fontWeight: 600 }}>
                                        Active Groups
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: "#1d4ed8" }}>
                                        {activeCount}
                                    </Title>
                                </Card>
                            </Col>

                            <Col xs={12}>
                                <Card
                                    className="summary-card"
                                    bordered={false}
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #fed7aa",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    bodyStyle={{ padding: 18 }}
                                >
                                    <Text style={{ color: "#ea580c", fontWeight: 600 }}>
                                        Inactive Groups
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: "#c2410c" }}>
                                        {inactiveCount}
                                    </Title>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Card
                    className="group-management-card"
                    bordered={false}
                    style={{
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                    }}
                    bodyStyle={{ padding: 24 }}
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
                                    <UsergroupAddOutlined />
                                </div>

                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Group List
                                    </Title>
                                    <Text type="secondary">
                                        View, edit, delete, and update group status.
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
                                Create Group
                            </Button>
                        </Col>
                    </Row>

                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={groups}
                        pagination={false}
                        scroll={{ x: 800 }}
                    />
                </Card>
            </div>

            <Modal
                title={isEditing ? "Edit Group" : "Create Group"}
                open={open}
                onCancel={closeModal}
                footer={null}
                destroyOnClose
                width={560}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ active: true }}
                    style={{ marginTop: 18 }}
                >
                    <Form.Item
                        name="groupName"
                        label={
                            <span
                                style={{
                                    color: "#020202c9",
                                    fontWeight: 600,
                                }}
                            >
                                Group Name
                            </span>
                        }
                        rules={[{ required: true, message: "Please enter group name" }]}
                    >
                        <Input size="large" placeholder="Enter group name" />
                    </Form.Item>

                    <Form.Item
                        name="groupMembers"
                        label={
                            <span
                                style={{
                                    color: "#020202c9",
                                    fontWeight: 600,
                                }}
                            >
                                Group Members
                            </span>
                        }
                        rules={[{ required: true, message: "Please select group members" }]}
                    >
                        <Select
                            mode="multiple"
                            size="large"
                            placeholder="Select group members"
                            allowClear
                            options={memberOptions.map((member) => ({
                                label: member,
                                value: member,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="active"
                        label="Status"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>

                    <Row justify="end" gutter={12}>
                        <Col>
                            <Button onClick={closeModal}>Cancel</Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={isEditing ? <EditOutlined /> : <PlusOutlined />}
                                style={{
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    fontWeight: 600,
                                }}
                            >
                                {isEditing ? "Update Group" : "Create Group"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}