import React, { useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    InputNumber,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Typography,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    BellOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    TeamOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

type ScheduleType =
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Quarterly"
    | "HalfYearly"
    | "Annually"
    | "Custom";

interface AlertChannel {
    id: number;
    users: string[];
    scheduleType: ScheduleType;
    interval?: number;
    days?: string[];
    active: boolean;
}

interface AlertChannelFormValues {
    users: string[];
    scheduleType: ScheduleType;
    interval?: number;
    days?: string[];
    scheduleDate?: unknown;
    customDates?: unknown;
    active: boolean;
}

const userOptions = [
    "John Smith",
    "Robert",
    "David",
    "Michael",
    "Emma",
    "Sophia",
    "Olivia",
    "William",
];

const GroupOptions = [
    "Product",
    "R & D",
    "Services"
    ,
];

const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export default function AlertChannelConfiguration(): React.ReactElement {
    const [form] = Form.useForm<AlertChannelFormValues>();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [scheduleType, setScheduleType] = useState<ScheduleType>("Weekly");

    const [data, setData] = useState<AlertChannel[]>([
        {
            id: 1,
            users: ["John Smith", "David"],
            scheduleType: "Weekly",
            interval: 1,
            days: ["Monday", "Friday"],
            active: true,
        },
    ]);

    const isEditing = editingId !== null;
    const activeCount = data.filter((item) => item.active).length;
    const inactiveCount = data.length - activeCount;

    const resetForm = (): void => {
        form.resetFields();
        form.setFieldsValue({
            scheduleType: "Weekly",
            active: true,
        });
        setScheduleType("Weekly");
        setEditingId(null);
    };

    const onFinish = (values: AlertChannelFormValues): void => {
        if (editingId !== null) {
            setData((prev) =>
                prev.map((item) =>
                    item.id === editingId
                        ? {
                            ...item,
                            ...values,
                        }
                        : item
                )
            );

            message.success("Alert channel updated");
        } else {
            setData((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    ...values,
                },
            ]);

            message.success("Alert channel created");
        }

        resetForm();
    };

    const onEdit = (record: AlertChannel): void => {
        setEditingId(record.id);
        setScheduleType(record.scheduleType);

        form.setFieldsValue({
            users: record.users,
            scheduleType: record.scheduleType,
            interval: record.interval,
            days: record.days,
            active: record.active,
        });
    };

    const toggleStatus = (id: number, active: boolean): void => {
        setData((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        active,
                    }
                    : item
            )
        );

        message.success(active ? "Alert channel activated" : "Alert channel deactivated");
    };

    const columns: ColumnsType<AlertChannel> = useMemo(
        () => [
            {
                title: "Notify Users",
                dataIndex: "users",
                key: "users",
                render: (users: string[]) => (
                    <Space size={[6, 6]} wrap>
                        {users.map((user) => (
                            <Tag key={user} color="blue">
                                {user}
                            </Tag>
                        ))}
                    </Space>
                ),
            },
            {
                title: "Schedule",
                dataIndex: "scheduleType",
                key: "scheduleType",
                render: (value: ScheduleType, record) => (
                    <Space direction="vertical" size={2}>
                        <Text strong style={{ color: "#020202c9" }}>
                            {value}
                        </Text>
                        {record.interval && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Every {record.interval}{" "}
                                {value === "Daily"
                                    ? "day(s)"
                                    : value === "Weekly"
                                        ? "week(s)"
                                        : "period(s)"}
                            </Text>
                        )}
                    </Space>
                ),
            },
            {
                title: "Days",
                dataIndex: "days",
                key: "days",
                render: (days?: string[]) =>
                    days?.length ? (
                        <Space size={[4, 4]} wrap>
                            {days.map((day) => (
                                <Tag key={day}>{day.slice(0, 3)}</Tag>
                            ))}
                        </Space>
                    ) : (
                        <Text type="secondary">-</Text>
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
                    <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
                        Edit
                    </Button>
                ),
            },
        ],
        []
    );

    return (
        <div
            className="alert-channel-page"
            style={{
                minHeight: "100vh",
                padding: 32,
                background: "#f4f7fb",
            }}
        >
            <style>
                {`
          .alert-channel-page .ant-form-item-label > label {
            color: #000000a8 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }

          .alert-channel-page .ant-select-selection-placeholder,
          .alert-channel-page .ant-picker-input > input::placeholder,
          .alert-channel-page .ant-input-number-input::placeholder {
            color: #000000a8 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }

          .alert-channel-page .ant-select-selector,
          .alert-channel-page .ant-picker,
          .alert-channel-page .ant-input-number {
            border-radius: 10px !important;
          }

          .alert-channel-page .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155 !important;
            font-weight: 600 !important;
          }

          .alert-channel-page .ant-card {
            transition: all 0.25s ease;
          }

          .alert-channel-page .summary-card:hover,
          .alert-channel-page .main-card:hover {
            transform: translateY(-2px);
          }
        `}
            </style>

            <div style={{ maxWidth: 1220, margin: "0 auto" }}>
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
                            Notification Management
                        </Tag>

                        <Title level={2} style={{ margin: 0, color: "#111827" }}>
                            Alert Channels
                        </Title>

                        <Text style={{ color: "#64748b", fontSize: 15 }}>
                            Create notification channels, assign users, and control delivery schedules.
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
                                        background: "#ffffff",
                                        border: "1px solid #dbeafe",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    bodyStyle={{ padding: 18 }}
                                >
                                    <Space direction="vertical" size={2}>
                                        <Text style={{ color: "#2563eb", fontWeight: 600 }}>
                                            Active Channels
                                        </Text>
                                        <Title level={3} style={{ margin: 0, color: "#1d4ed8" }}>
                                            {activeCount}
                                        </Title>
                                    </Space>
                                </Card>
                            </Col>

                            <Col xs={12}>
                                <Card
                                    className="summary-card"
                                    bordered={false}
                                    style={{
                                        borderRadius: 14,
                                        background: "#ffffff",
                                        border: "1px solid #fed7aa",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    bodyStyle={{ padding: 18 }}
                                >
                                    <Space direction="vertical" size={2}>
                                        <Text style={{ color: "#ea580c", fontWeight: 600 }}>
                                            Inactive Channels
                                        </Text>
                                        <Title level={3} style={{ margin: 0, color: "#c2410c" }}>
                                            {inactiveCount}
                                        </Title>
                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} align="stretch">
                    <Col xs={24} lg={10}>
                        <Card
                            className="main-card"
                            bordered={false}
                            style={{
                                height: "100%",
                                borderRadius: 16,
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                                overflow: "hidden",
                            }}
                            bodyStyle={{ padding: 0 }}
                        >
                            <div
                                style={{
                                    padding: 22,
                                    background: "#ffffff",
                                    borderBottom: "1px solid #eef2f7",
                                }}
                            >
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
                                        <BellOutlined />
                                    </div>

                                    <div>
                                        <Title level={4} style={{ margin: 0, color: "#111827" }}>
                                            {isEditing ? "Edit Alert Channel" : "Create Alert Channel"}
                                        </Title>
                                        <Text style={{ color: "#64748b" }}>
                                            Fill the details below to configure alerts.
                                        </Text>
                                    </div>
                                </Space>
                            </div>

                            <div style={{ padding: 22 }}>
                                <Alert
                                    type="info"
                                    showIcon
                                    message="Active channels will send alerts based on the selected schedule."
                                    style={{
                                        marginBottom: 20,
                                        borderRadius: 10,
                                        background: "#eff6ff",
                                        borderColor: "#bfdbfe",
                                    }}
                                />

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    initialValues={{
                                        scheduleType: "Weekly",
                                        active: true,
                                    }}
                                >
                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: 14,
                                            background: "#f8fafc",
                                            border: "1px solid #eef2f7",
                                            marginBottom: 16,
                                        }}
                                        bodyStyle={{ padding: 16 }}
                                    >
                                        <Space align="center" size={8} style={{ marginBottom: 14 }}>
                                            <TeamOutlined style={{ color: "#2563eb" }} />
                                            <Text strong style={{ color: "#020202c9" }}>Recipients</Text>
                                        </Space>

                                        <Form.Item
                                            name="users"
                                            label="Notify Users"
                                            rules={[{ required: true, message: "Please select users" }]}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Select users"
                                                allowClear
                                                size="large"
                                                options={userOptions.map((user) => ({
                                                    label: user,
                                                    value: user,
                                                }))}
                                            />
                                        </Form.Item>

                                        <Space align="center" size={8} style={{ marginBottom: 12, marginTop: 10 }}>
                                            <TeamOutlined style={{ color: "#2563eb" }} />
                                            <Text strong style={{ color: "#020202c9" }}>Groups</Text>
                                        </Space>

                                        <Form.Item
                                            name="Groups"
                                            label="Groups"
                                            rules={[{ required: true, message: "Please select users" }]}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Select Groups"
                                                allowClear
                                                size="large"
                                                options={GroupOptions.map((group) => ({
                                                    label: group,
                                                    value: group,
                                                }))}
                                            />
                                        </Form.Item>
                                    </Card>

                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: 14,
                                            background: "#f8fafc",
                                            border: "1px solid #eef2f7",
                                            marginBottom: 16,
                                        }}
                                        bodyStyle={{ padding: 16 }}
                                    >
                                        <Space align="center" size={8} style={{ marginBottom: 14 }}>
                                            <CheckCircleOutlined style={{ color: "#16a34a" }} />
                                            <Text strong style={{ color: "#020202c9" }}>Status</Text>
                                        </Space>

                                        <Form.Item
                                            name="active"
                                            label="Channel Status"
                                            valuePropName="checked"
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                                        </Form.Item>
                                    </Card>

                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: 14,
                                            background: "#f8fafc",
                                            border: "1px solid #eef2f7",
                                        }}
                                        bodyStyle={{ padding: 16 }}
                                    >
                                        <Space align="center" size={8} style={{ marginBottom: 14 }}>
                                            <CalendarOutlined style={{ color: "#7c3aed" }} />
                                            <Text strong style={{ color: "#020202c9" }}>Schedule</Text>
                                        </Space>

                                        <Form.Item
                                            name="scheduleType"
                                            label="Schedule Type"
                                            rules={[
                                                { required: true, message: "Please select schedule type" },
                                            ]}
                                        >
                                            <Select
                                                size="large"
                                                placeholder="Select schedule type"
                                                onChange={(value: ScheduleType) => setScheduleType(value)}
                                                options={[
                                                    { label: "Daily", value: "Daily" },
                                                    { label: "Weekly", value: "Weekly" },
                                                    { label: "Monthly", value: "Monthly" },
                                                    { label: "Quarterly", value: "Quarterly" },
                                                    { label: "Half Yearly", value: "HalfYearly" },
                                                    { label: "Annually", value: "Annually" },
                                                    { label: "Custom", value: "Custom" },
                                                ]}
                                            />
                                        </Form.Item>

                                        {scheduleType === "Daily" && (
                                            <Form.Item
                                                name="interval"
                                                label="Repeat Every"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    addonAfter="Days"
                                                    placeholder="Enter days"
                                                    size="large"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        )}

                                        {scheduleType === "Weekly" && (
                                            <>
                                                <Form.Item name="interval" label="Repeat Every">
                                                    <InputNumber
                                                        min={1}
                                                        addonAfter="Weeks"
                                                        placeholder="Enter weeks"
                                                        size="large"
                                                        style={{ width: "100%" }}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    name="days"
                                                    label="Repeat On"
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Checkbox.Group options={dayOptions} />
                                                </Form.Item>
                                            </>
                                        )}

                                        {["Monthly", "Quarterly", "HalfYearly"].includes(
                                            scheduleType
                                        ) && (
                                                <Form.Item
                                                    name="scheduleDate"
                                                    label="Schedule Date"
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <DatePicker
                                                        placeholder="Select schedule date"
                                                        size="large"
                                                        style={{ width: "100%" }}
                                                    />
                                                </Form.Item>
                                            )}

                                        {scheduleType === "Annually" && (
                                            <Form.Item
                                                name="scheduleDate"
                                                label="Annual Date"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <DatePicker
                                                    picker="date"
                                                    format="DD MMMM"
                                                    placeholder="Select annual date"
                                                    size="large"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        )}

                                        {scheduleType === "Custom" && (
                                            <Form.Item
                                                name="customDates"
                                                label="Custom Dates"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <DatePicker
                                                    multiple
                                                    format="DD-MM-YYYY"
                                                    placeholder="Select custom dates"
                                                    size="large"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        )}
                                    </Card>

                                    <Divider style={{ margin: "22px 0" }} />

                                    <Row gutter={12}>
                                        <Col span={10}>
                                            <Button
                                                block
                                                size="large"
                                                icon={<ReloadOutlined />}
                                                onClick={resetForm}
                                                style={{
                                                    height: 44,
                                                    borderRadius: 10,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        </Col>

                                        <Col span={14}>
                                            <Button
                                                block
                                                size="large"
                                                htmlType="submit"
                                                type="primary"
                                                icon={isEditing ? <EditOutlined /> : <PlusOutlined />}
                                                style={{
                                                    height: 44,
                                                    borderRadius: 10,
                                                    fontWeight: 600,
                                                    background: "#2563eb",
                                                    borderColor: "#2563eb",
                                                    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.24)",
                                                }}
                                            >
                                                {isEditing ? "Update Channel" : "Create Channel"}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={14}>
                        <Card
                            className="main-card"
                            bordered={false}
                            style={{
                                height: "100%",
                                borderRadius: 16,
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                            }}
                            bodyStyle={{ padding: 24 }}
                        >
                            <Row align="middle" justify="space-between" gutter={[16, 16]}>
                                <Col>
                                    <Space align="center" size={12}>
                                        <div
                                            style={{
                                                width: 46,
                                                height: 46,
                                                borderRadius: 12,
                                                background: "#f0fdf4",
                                                color: "#16a34a",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 22,
                                            }}
                                        >
                                            <ThunderboltOutlined />
                                        </div>

                                        <div>
                                            <Title level={4} style={{ margin: 0 }}>
                                                Configured Alert Channels
                                            </Title>
                                            <Text type="secondary">
                                                Review, edit, activate, or pause alert channels.
                                            </Text>
                                        </div>
                                    </Space>
                                </Col>

                                <Col>
                                    <Tag
                                        color="blue"
                                        style={{
                                            borderRadius: 999,
                                            padding: "6px 12px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {data.length} Channel{data.length === 1 ? "" : "s"}
                                    </Tag>
                                </Col>
                            </Row>

                            <Table
                                rowKey="id"
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                                style={{ marginTop: 22 }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}