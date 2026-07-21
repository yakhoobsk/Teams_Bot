import React, { useEffect, useMemo, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { GroupsCreate, GroupsDelete, GroupsGet, GroupsUpdate, UserswithoutpagnationGet } from "../../redux/Services/connectersServices";
import { showSnackbar } from "../../utils/snackbar";

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


export default function GroupManagement({ activeTab }: { activeTab: string }): React.ReactElement {
    const [form] = Form.useForm<GroupFormValues>();
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const dispatch = useAppDispatch();
    const groupResponse = useAppSelector((state) => state.connecters.GroupsGets);
    const userspage = useAppSelector((state) => state.connecters?.Userswithoutpagnation);


    useEffect(() => {
        if (activeTab === "GroupManagement") {
            dispatch(GroupsGet({}));
            dispatch(
                UserswithoutpagnationGet({})
            );
        }
    }, [dispatch]);



    const groups: GroupData[] =
        groupResponse?.Response?.map((item: any) => ({
            id: Number(item.id),
            groupId: item.group_id,
            groupName: item.group_name,
            groupMembers: (() => {
                if (!item.members) return [];

                try {
                    let members = item.members;

                    // Handle values like "\"[\\\"user1\\\",\\\"user2\\\"]\""
                    while (typeof members === "string") {
                        members = JSON.parse(members);
                    }

                    return Array.isArray(members)
                        ? members
                        : [String(members)];
                } catch {
                    return [String(item.members)];
                }
            })(),
            active: Boolean(item.is_status),
            description: item.description,
            createdBy: item.created_by,
            createdDate: item.created_date,
            updatedBy: item.updated_by,
            updatedDate: item.updated_date,
        })) || [];




    const isEditing = editingId !== null;

    const activeCount = groups.filter((item: any) => item.active).length;
    const inactiveCount = groups.length - activeCount;



    const openCreateModal = (): void => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ active: true });
        setOpen(true);
    };

    const openEditModal = (record: any): void => {
        setEditingId(record.id);
        setEditingRecord(record);

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

    const onFinish = async (values: GroupFormValues) => {
        try {
            if (editingRecord) {
                const payload = {
                    group_id: editingRecord.groupId,
                    group_name: values.groupName,
                    description:
                        editingRecord.description || "Updated group description",
                    members: values.groupMembers,
                    is_status: values.active ? 1 : 0,
                    updated_by: "praveen@easystepin.com",
                };

                await dispatch(GroupsUpdate({ payload })).unwrap();

                showSnackbar("success", "Group updated successfully");
            } else {
                const payload = {
                    group_name: values.groupName,
                    description: "Group for integration team members",
                    members: values.groupMembers,
                    is_status: values.active,
                    created_by: "praveen@easystepin.com",
                };

                await dispatch(GroupsCreate({ payload })).unwrap();

                showSnackbar("success", "Group created successfully");
            }

            dispatch(GroupsGet({}));

            showSnackbar("success", "Group created successfully");
            closeModal();
        } catch {
            showSnackbar("error", "Operation failed");
        }
    };

    const toggleStatus = async (record: any, active: boolean) => {
        try {
            const payload = {
                group_id: record.groupId,
                group_name: record.groupName,
                description: record.description,
                members: record.groupMembers,
                is_status: active ? 1 : 0,
                updated_by: "praveen@easystepin.com",
            };

            await dispatch(GroupsUpdate({ payload })).unwrap();

            dispatch(GroupsGet({}));

            showSnackbar(
                "success",
                active
                    ? "Group activated successfully"
                    : "Group deactivated successfully"
            );
        } catch {
            showSnackbar("error", "Failed to update status");
        }
    };

    const deleteGroup = async (record: any) => {
        try {
            const payload = {
                group_id: record.groupId,
            };

            await dispatch(GroupsDelete({ payload })).unwrap();

            dispatch(GroupsGet({}));

            showSnackbar("success", "Group deleted successfully");
        } catch {
            showSnackbar("error", "Failed to delete group");
        }
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
                            onChange={(checked) => toggleStatus(record, checked)}
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

                    <Card
                        bodyStyle={{
                            padding: 20,
                            overflow: "hidden",
                        }}
                    >
                        <Table
                            rowKey="groupId"
                            columns={columns}
                            dataSource={groups}
                            pagination={false}
                            scroll={{
                                x: "max-content",
                                y: 450,
                            }}
                        />
                    </Card>
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
                        name="groupMembers"
                        rules={[
                            {
                                required: true,
                                message: "Please select group members",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            showSearch
                            placeholder="Select Group Members"
                            optionFilterProp="label"
                            options={userspage?.map((user: any) => ({
                                label: `${user.first_name} ${user.last_name}`,
                                value: user.user_id,
                            }))}
                            maxTagCount="responsive"

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