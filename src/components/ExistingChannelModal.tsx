import React, { type ReactNode } from "react";
import { Modal, Form, Input, Select, InputNumber, Checkbox, Row, Col, Button, Typography, Alert } from "antd";
import { BellOutlined, ClockCircleOutlined, LinkOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
}

interface ExistingChannelFormValues {
    channelUrl?: string;
    channelId?: string;
    groupId?: string;
    tenantId?: string;
    schedule_type?: string;
    day?: number;
    week?: string;
    hour?: number;
    minute?: number;
    atom?: boolean;
    longrun?: boolean;
    mdm?: boolean;
    tickets?: boolean;
}

const parseTeamsChannelUrl = (url: string) => {
    try {
        const parsed = new URL(url);

        const match = parsed.pathname.match(/\/l\/channel\/([^/]+)/);
        const channelId = match ? decodeURIComponent(match[1]) : "";
        const groupId = parsed.searchParams.get("groupId") || "";
        const tenantId = parsed.searchParams.get("tenantId") || "";

        return { channelId, groupId, tenantId };
    } catch {
        return null;
    }
};

const fieldLabel = (text: string) => (
    <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>{text}</span>
);

const SectionHeader = ({
    icon,
    title,
    subtitle,
}: {
    icon: ReactNode;
    title: string;
    subtitle?: string;
}) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
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
                fontSize: 16,
                flexShrink: 0,
            }}
        >
            {icon}
        </div>

        <div>
            <Text strong style={{ display: "block", fontSize: 15, color: "#111827" }}>
                {title}
            </Text>
            {subtitle && <Text style={{ fontSize: 12, color: "#64748b" }}>{subtitle}</Text>}
        </div>
    </div>
);

const sectionCardStyle: React.CSSProperties = {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
};

const ExistingChannelModal: React.FC<Props> = ({ open, onCancel, onSubmit }) => {
    const [form] = Form.useForm<ExistingChannelFormValues>();
    const channelId = Form.useWatch("channelId", form);
    const groupId = Form.useWatch("groupId", form);
    const tenantId = Form.useWatch("tenantId", form);
    const scheduleType = Form.useWatch("schedule_type", form);

    const hasAnyId = Boolean(channelId || groupId || tenantId);

    const handleUrlChange = (url: string) => {
        const parsed = url ? parseTeamsChannelUrl(url) : null;

        if (parsed) {
            form.setFieldsValue({
                channelId: parsed.channelId || undefined,
                groupId: parsed.groupId || undefined,
                tenantId: parsed.tenantId || undefined,
            });
        }
    };

    const handleFinish = (values: ExistingChannelFormValues) => {
        const payload = {
            channel_id: values.channelId || "",
            group_id: values.groupId || "",
            tenant_id: values.tenantId || "",
            channel_url: values.channelUrl || "",
            schedule_type: values.schedule_type || "",
            day: values.day ?? "",
            week: values.week ?? "",
            hour: values.hour,
            minute: values.minute,
            atom: !!values.atom,
            longrun: !!values.longrun,
            mdm: !!values.mdm,
            tickets: !!values.tickets,
        };

        onSubmit(payload);
        form.resetFields();
    };

    return (
        <Modal
            open={open}
            title={
                <span style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>
                    Existing Channel Create
                </span>
            }
            width={640}
            footer={null}
            destroyOnHidden
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    schedule_type: "Daily",
                    atom: false,
                    longrun: false,
                    mdm: false,
                    tickets: false,
                }}
                style={{ marginTop: 16 }}
            >
                <div style={sectionCardStyle}>
                    <SectionHeader
                        icon={<LinkOutlined />}
                        title="Channel Identification"
                        subtitle="Paste a Teams channel link, or fill in the IDs directly."
                    />

                    <Form.Item
                        label={fieldLabel("Channel URL")}
                        name="channelUrl"
                        extra={
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>
                                Channel ID / Group ID / Tenant ID are filled in automatically from the link.
                            </span>
                        }
                    >
                        <Input
                            size="large"
                            placeholder="Paste Teams channel URL"
                            onChange={(e) => handleUrlChange(e.target.value)}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item label={fieldLabel("Channel ID")} name="channelId" style={{ marginBottom: 0 }}>
                                <Input size="large" placeholder="Enter Channel ID" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item label={fieldLabel("Group/Team ID")} name="groupId" style={{ marginBottom: 0 }}>
                                <Input size="large" placeholder="Enter Group/Team ID" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item label={fieldLabel("Tenant ID")} name="tenantId" style={{ marginBottom: 0 }}>
                                <Input size="large" placeholder="Enter Tenant ID" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {!hasAnyId && (
                        <Alert
                            style={{ marginTop: 16 }}
                            type="warning"
                            showIcon
                            title="Provide at least one of Channel ID, Group/Team ID, or Tenant ID."
                        />
                    )}
                </div>

                <div style={sectionCardStyle}>
                    <SectionHeader
                        icon={<ClockCircleOutlined />}
                        title="Schedule"
                        subtitle="Choose when this channel's alerts should run."
                    />

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label={fieldLabel("Schedule Type")} name="schedule_type">
                                <Select
                                    size="large"
                                    options={[
                                        { label: "Daily", value: "Daily" },
                                        { label: "Weekly", value: "Weekly" },
                                        { label: "Monthly", value: "Monthly" },
                                        { label: "Custom", value: "Custom" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        {/* Daily */}
                        {scheduleType === "Daily" && (
                            <>
                                <Col span={12}>
                                    <Form.Item label={fieldLabel("Hour")} name="hour" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" placeholder="Hour" min={0} max={23} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label={fieldLabel("Minute")} name="minute" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" placeholder="Minute" min={0} max={59} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </>
                        )}

                        {/* Weekly */}
                        {scheduleType === "Weekly" && (
                            <>
                                <Col span={12}>
                                    <Form.Item label={fieldLabel("Week Day")} name="week" style={{ marginBottom: 0 }}>
                                        <Select
                                            size="large"
                                            options={[
                                                { label: "Sunday", value: "Sunday" },
                                                { label: "Monday", value: "Monday" },
                                                { label: "Tuesday", value: "Tuesday" },
                                                { label: "Wednesday", value: "Wednesday" },
                                                { label: "Thursday", value: "Thursday" },
                                                { label: "Friday", value: "Friday" },
                                                { label: "Saturday", value: "Saturday" },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item label={fieldLabel("Hour")} name="hour" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" min={0} max={23} style={{ width: "100%" }} placeholder="Hour" />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item label={fieldLabel("Minute")} name="minute" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" min={0} max={59} style={{ width: "100%" }} placeholder="Minute" />
                                    </Form.Item>
                                </Col>
                            </>
                        )}

                        {/* Monthly */}
                        {scheduleType === "Monthly" && (
                            <>
                                <Col span={8}>
                                    <Form.Item label={fieldLabel("Day")} name="day" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" min={1} max={31} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label={fieldLabel("Hour")} name="hour" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" min={0} max={23} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label={fieldLabel("Minute")} name="minute" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" min={0} max={59} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </>
                        )}

                        {/* Custom */}
                        {scheduleType === "Custom" && (
                            <>
                                <Col span={12}>
                                    <Form.Item label={fieldLabel("Hour")} name="hour" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" min={0} max={23} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label={fieldLabel("Minute")} name="minute" style={{ marginBottom: 0 }}>
                                        <InputNumber size="large" min={0} max={59} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                    </Row>
                </div>

                <div style={{ ...sectionCardStyle, marginBottom: 24 }}>
                    <SectionHeader
                        icon={<BellOutlined />}
                        title="Alerts"
                        subtitle="Choose which modules this channel should be notified about."
                    />

                    <Row gutter={[16, 16]}>
                        <Col xs={12} sm={6}>
                            <Form.Item name="atom" valuePropName="checked" noStyle>
                                <Checkbox>Atom</Checkbox>
                            </Form.Item>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Item name="longrun" valuePropName="checked" noStyle>
                                <Checkbox>Long Run</Checkbox>
                            </Form.Item>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Item name="mdm" valuePropName="checked" noStyle>
                                <Checkbox>MDM</Checkbox>
                            </Form.Item>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Item name="tickets" valuePropName="checked" noStyle>
                                <Checkbox>Tickets</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                    }}
                >
                    <Button
                        size="large"
                        onClick={() => {
                            form.resetFields();
                            onCancel();
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        disabled={!hasAnyId}
                        style={{
                            background: "#2563eb",
                            borderColor: "#2563eb",
                            fontWeight: 600,
                        }}
                    >
                        Update
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ExistingChannelModal;
