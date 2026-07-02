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
                            <Tag key={user} color="geekblue">
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
                        <Text strong>{value}</Text>
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
            style={{
                minHeight: "100vh",
                padding: 32,
                background:
                    "radial-gradient(circle at top left, #dbeafe 0, transparent 32%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
            }}
        >
            <style>
                {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes softPulse {
            0%, 100% {
              box-shadow: 0 0 0 rgba(37, 99, 235, 0);
            }
            50% {
              box-shadow: 0 0 32px rgba(37, 99, 235, 0.18);
            }
          }

          .animated-card {
            animation: fadeUp 0.45s ease both;
          }

          .metric-card {
            transition: all 0.25s ease;
          }

          .metric-card:hover {
            transform: translateY(-3px);
          }

          .form-card {
            animation: fadeUp 0.5s ease both;
          }

          .table-card {
            animation: fadeUp 0.6s ease both;
          }
        `}
            </style>

            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} lg={16}>
                        <Space direction="vertical" size={6}>
                            <Tag
                                color="blue"
                                style={{
                                    width: "fit-content",
                                    borderRadius: 999,
                                    padding: "4px 12px",
                                    fontWeight: 600,
                                }}
                            >
                                Notification Management
                            </Tag>

                            <Title level={2} style={{ margin: 0, color: "#0f172a" }}>
                                Alert Channels
                            </Title>

                            <Text style={{ color: "#64748b", fontSize: 15 }}>
                                Create, schedule, activate, and manage alert notification channels.
                            </Text>
                        </Space>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Row gutter={[12, 12]}>
                            <Col span={12}>
                                <Card
                                    className="metric-card animated-card"
                                    bordered={false}
                                    style={{
                                        borderRadius: 16,
                                        background: "#ecfdf5",
                                        border: "1px solid #bbf7d0",
                                    }}
                                    bodyStyle={{ padding: 16 }}
                                >
                                    <Text style={{ color: "#047857", fontWeight: 700 }}>Active</Text>
                                    <Title level={3} style={{ margin: 0, color: "#065f46" }}>
                                        {activeCount}
                                    </Title>
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Card
                                    className="metric-card animated-card"
                                    bordered={false}
                                    style={{
                                        borderRadius: 16,
                                        background: "#fff7ed",
                                        border: "1px solid #fed7aa",
                                    }}
                                    bodyStyle={{ padding: 16 }}
                                >
                                    <Text style={{ color: "#c2410c", fontWeight: 700 }}>
                                        Inactive
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: "#9a3412" }}>
                                        {inactiveCount}
                                    </Title>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={9}>
                        <Card
                            className="form-card"
                            bordered={false}
                            style={{
                                borderRadius: 16,
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                                overflow: "hidden",
                                background: "#ffffff",
                            }}
                            bodyStyle={{ padding: 0 }}
                        >
                            <div
                                style={{
                                    padding: "22px 24px",
                                    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                                    color: "#ffffff",
                                }}
                            >
                                <Space align="center" size={14}>
                                    <div
                                        style={{
                                            width: 46,
                                            height: 46,
                                            borderRadius: 12,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "rgba(255,255,255,0.14)",
                                            color: "#ffffff",
                                            fontSize: 21,
                                        }}
                                    >
                                        <BellOutlined />
                                    </div>

                                    <div>
                                        <Title level={4} style={{ margin: 0, color: "#ffffff" }}>
                                            {isEditing ? "Edit Alert Channel" : "Create Alert Channel"}
                                        </Title>
                                        <Text style={{ color: "rgba(255,255,255,0.72)" }}>
                                            Configure recipients, schedule, and status.
                                        </Text>
                                    </div>
                                </Space>
                            </div>

                            <div style={{ padding: 24 }}>
                                <Alert
                                    type="success"
                                    showIcon
                                    message="Active channels send notifications automatically."
                                    style={{
                                        marginBottom: 22,
                                        borderRadius: 10,
                                        background: "#f0fdf4",
                                        border: "1px solid #bbf7d0",
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
                                    <div
                                        style={{
                                            padding: 16,
                                            borderRadius: 14,
                                            background: "#f8fafc",
                                            border: "1px solid #eef2f7",
                                            marginBottom: 18,
                                        }}
                                    >
                                        <Space align="center" size={8} style={{ marginBottom: 14 }}>
                                            <TeamOutlined style={{ color: "#2563eb" }} />
                                            <Text strong style={{ color: "#0f172a" }}>
                                                Recipients
                                            </Text>
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
                                    </div>

                                    <div
                                        style={{
                                            padding: 16,
                                            borderRadius: 14,
                                            background: "#f8fafc",
                                            border: "1px solid #eef2f7",
                                            marginBottom: 18,
                                        }}
                                    >
                                        <Space align="center" size={8} style={{ marginBottom: 14 }}>
                                            <CheckCircleOutlined style={{ color: "#16a34a" }} />
                                            <Text strong style={{ color: "#0f172a" }}>
                                                Channel Status
                                            </Text>
                                        </Space>

                                        <Form.Item
                                            name="active"
                                            valuePropName="checked"
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                                        </Form.Item>
                                    </div>

                                    <div
                                        style={{
                                            padding: 16,
                                            borderRadius: 14,
                                            background: "#f8fafc",
                                            border: "1px solid #eef2f7",
                                        }}
                                    >
                                        <Space align="center" size={8} style={{ marginBottom: 14 }}>
                                            <CalendarOutlined style={{ color: "#7c3aed" }} />
                                            <Text strong style={{ color: "#0f172a" }}>
                                                Schedule
                                            </Text>
                                        </Space>

                                        <Form.Item
                                            name="scheduleType"
                                            label="Schedule Type"
                                            rules={[{ required: true, message: "Please select schedule type" }]}
                                        >
                                            <Select
                                                size="large"
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
                                            <Form.Item name="interval" label="Repeat Every" style={{ marginBottom: 0 }}>
                                                <InputNumber
                                                    min={1}
                                                    addonAfter="Days"
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
                                                        size="large"
                                                        style={{ width: "100%" }}
                                                    />
                                                </Form.Item>

                                                <Form.Item name="days" label="Repeat On" style={{ marginBottom: 0 }}>
                                                    <Checkbox.Group options={dayOptions} />
                                                </Form.Item>
                                            </>
                                        )}

                                        {["Monthly", "Quarterly", "HalfYearly"].includes(scheduleType) && (
                                            <Form.Item name="scheduleDate" label="Schedule Date" style={{ marginBottom: 0 }}>
                                                <DatePicker size="large" style={{ width: "100%" }} />
                                            </Form.Item>
                                        )}

                                        {scheduleType === "Annually" && (
                                            <Form.Item name="scheduleDate" label="Annual Date" style={{ marginBottom: 0 }}>
                                                <DatePicker
                                                    picker="date"
                                                    format="DD MMMM"
                                                    size="large"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        )}

                                        {scheduleType === "Custom" && (
                                            <Form.Item name="customDates" label="Custom Dates" style={{ marginBottom: 0 }}>
                                                <DatePicker
                                                    multiple
                                                    format="DD-MM-YYYY"
                                                    size="large"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        )}
                                    </div>

                                    <Divider style={{ margin: "22px 0" }} />

                                    <Row gutter={12}>
                                        <Col span={10}>
                                            <Button
                                                block
                                                size="large"
                                                icon={<ReloadOutlined />}
                                                onClick={resetForm}
                                                style={{
                                                    borderRadius: 10,
                                                    height: 44,
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
                                                    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.24)",
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

                    <Col xs={24} lg={15}>
                        <Card
                            className="table-card"
                            bordered={false}
                            style={{
                                borderRadius: 18,
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 18px 42px rgba(15, 23, 42, 0.09)",
                            }}
                            bodyStyle={{ padding: 24 }}
                        >
                            <Row align="middle" justify="space-between" gutter={[16, 16]}>
                                <Col>
                                    <Space align="center" size={12}>
                                        <div
                                            style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 12,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#f0fdf4",
                                                color: "#16a34a",
                                                fontSize: 20,
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
                                        icon={<CheckCircleOutlined />}
                                        color="success"
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