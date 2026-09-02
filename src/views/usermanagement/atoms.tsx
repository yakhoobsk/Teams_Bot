import React, { useState } from "react";
import {
    Button,
    Card,
    Col,
    Modal,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    TimePicker,
    Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { type Dayjs } from "dayjs";
import { ClockCircleOutlined, CloudServerOutlined, DatabaseOutlined, EditOutlined } from "@ant-design/icons";
import { showSnackbar } from "../../utils/snackbar";
import { ATOM_LIST } from "../../constants/atomList";

const { Title, Text } = Typography;

const INTERVAL_OPTIONS = [1, 2, 3, 4, 6, 8, 12, 24].map((hours) => ({
    label: `Every ${hours} hr`,
    value: hours,
}));

interface AtomSchedule {
    time: string;
    intervalHours: number;
}

interface AtomData {
    id: number;
    atomName: string;
    status: "online" | "offline";
    active: boolean;
    schedule: AtomSchedule | null;
}

const initialAtoms: AtomData[] = ATOM_LIST.map((atom) => ({
    ...atom,
    active: atom.atomName === "Esi_stagging",
    schedule: null,
}));

export default function AtomManagement({ activeTab }: { activeTab: string }): React.ReactElement {
    const [atoms, setAtoms] = useState<AtomData[]>(initialAtoms);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [scheduleTarget, setScheduleTarget] = useState<AtomData | null>(null);
    const [scheduleTime, setScheduleTime] = useState<Dayjs | null>(null);
    const [scheduleInterval, setScheduleInterval] = useState<number | null>(null);

    const onlineCount = atoms.filter((item) => item.status === "online").length;
    const activeAtom = atoms.find((item) => item.active);

    const handleToggle = (record: AtomData, checked: boolean) => {
        setTogglingId(record.id);

        // Only one Atom can be Active at a time, activating one deactivates the rest.
        setAtoms((prev) =>
            prev.map((atom) => {
                if (atom.id === record.id) {
                    return { ...atom, active: checked };
                }

                return checked ? { ...atom, active: false } : atom;
            })
        );

        console.log("Update Atom payload:", {
            id: record.id,
            atomName: record.atomName,
            active: checked,
        });

        showSnackbar(
            "success",
            checked
                ? `${record.atomName} is now the active Atom`
                : `${record.atomName} deactivated`
        );

        setTogglingId(null);
    };

    const openScheduleModal = (record: AtomData) => {
        setScheduleTarget(record);
        setScheduleTime(record.schedule ? dayjs(record.schedule.time, "HH:mm") : null);
        setScheduleInterval(record.schedule?.intervalHours || null);
        setScheduleModalOpen(true);
    };

    const closeScheduleModal = () => {
        setScheduleModalOpen(false);
        setScheduleTarget(null);
        setScheduleTime(null);
        setScheduleInterval(null);
    };

    const handleSaveSchedule = () => {
        if (!scheduleTarget || !scheduleTime || !scheduleInterval) return;

        const schedule: AtomSchedule = {
            time: scheduleTime.format("HH:mm"),
            intervalHours: scheduleInterval,
        };

        setAtoms((prev) =>
            prev.map((atom) =>
                atom.id === scheduleTarget.id ? { ...atom, schedule } : atom
            )
        );

        console.log("Update Atom Schedule payload:", {
            id: scheduleTarget.id,
            atomName: scheduleTarget.atomName,
            schedule,
        });

        showSnackbar(
            "success",
            `${scheduleTarget.atomName} scheduled at ${schedule.time}, every ${schedule.intervalHours} hr`
        );

        closeScheduleModal();
    };

    const columns: ColumnsType<AtomData> = [
        {
            title: "Atom Name",
            dataIndex: "atomName",
            key: "atomName",
            render: (atomName: string) => (
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
                        <DatabaseOutlined />
                    </div>

                    <Text strong style={{ color: "#111827" }}>
                        {atomName}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Atom Status",
            dataIndex: "status",
            key: "status",
            render: (status: "online" | "offline") => (
                <Tag
                    style={{
                        backgroundColor: status === "online" ? "#ecfdf5" : "#fef2f2",
                        color: status === "online" ? "#047857" : "#dc2626",
                        border: status === "online" ? "1px solid #bbf7d0" : "1px solid #fecaca",
                        borderRadius: 999,
                        fontWeight: 600,
                        padding: "4px 12px",
                        textTransform: "capitalize",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            marginRight: 6,
                            background: status === "online" ? "#22c55e" : "#ef4444",
                        }}
                    />
                    {status}
                </Tag>
            ),
        },
        {
            title: "Schedule",
            key: "schedule",
            align: "center",
            render: (_, record) => (
                <Space>
                    {record.schedule ? (
                        <Tag
                            style={{
                                borderRadius: 999,
                                fontWeight: 600,
                                padding: "4px 12px",
                                background: "#eff6ff",
                                color: "#2563eb",
                                border: "1px solid #bfdbfe",
                            }}
                        >
                            <ClockCircleOutlined style={{ marginRight: 6 }} />
                            {record.schedule.time} · Every {record.schedule.intervalHours} hr
                        </Tag>
                    ) : (
                        <Text style={{ color: "#94a3b8" }}>Not scheduled</Text>
                    )}

                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        style={{ color: "#1677ff" }}
                        onClick={() => openScheduleModal(record)}
                    />
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space orientation="vertical" size={4} align="center">
                    <Switch
                        checked={record.active}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        loading={togglingId === record.id}
                        onChange={(checked) => handleToggle(record, checked)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div
            className="atom-management-page"
            style={{
                minHeight: "100vh",
                padding: 32,
                background: "#f4f7fb",
            }}
        >
            <style>
                {`
          .atom-management-page .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155 !important;
            font-weight: 500 !important;
          }

          .atom-management-card {
            animation: fadeUp 0.45s ease both;
          }

          .summary-card {
            animation: fadeUp 0.35s ease both;
            transition: all 0.25s ease;
          }

          .summary-card:hover,
          .atom-management-card:hover {
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
            .atom-management-page {
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
                            Atom Management
                        </Tag>

                        <Title level={2} style={{ margin: 0, color: "#111827" }}>
                            Atoms
                        </Title>

                        <Text style={{ color: "#64748b", fontSize: 15 }}>
                            Monitor Atom availability and control which Atom is active. Only one Atom can be active at a time.
                        </Text>
                    </Col>

                    <Col xs={24} lg={10}>
                        <Row gutter={[14, 14]}>
                            <Col xs={12}>
                                <Card
                                    className="summary-card"
                                    variant="borderless"
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #dbeafe",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    styles={{ body: { padding: 18 } }}
                                >
                                    <Text style={{ color: "#2563eb", fontWeight: 600 }}>
                                        Online Atoms
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: "#1d4ed8" }}>
                                        {onlineCount} / {atoms.length}
                                    </Title>
                                </Card>
                            </Col>

                            <Col xs={12}>
                                <Card
                                    className="summary-card"
                                    variant="borderless"
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #bbf7d0",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    styles={{ body: { padding: 18 } }}
                                >
                                    <Text style={{ color: "#047857", fontWeight: 600 }}>
                                        Active Atom
                                    </Text>
                                    <Title level={4} style={{ margin: 0, color: "#065f46" }}>
                                        {activeAtom ? activeAtom.atomName : "None"}
                                    </Title>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Card
                    className="atom-management-card"
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
                                    <CloudServerOutlined />
                                </div>

                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Atom List
                                    </Title>
                                    <Text type="secondary">
                                        View Atom status and switch the active Atom.
                                    </Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>

                    <Card
                        styles={{ body: {
                            padding: 20,
                            overflow: "hidden",
                        } }}
                    >
                        <Table
                            rowKey="id"
                            columns={columns}
                            dataSource={atoms}
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
                title={scheduleTarget ? `Schedule — ${scheduleTarget.atomName}` : "Schedule"}
                open={scheduleModalOpen}
                onCancel={closeScheduleModal}
                footer={null}
                destroyOnHidden
                width={420}
            >
                <div style={{ marginTop: 8 }}>
                    <Text style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                        Time
                    </Text>

                    <TimePicker
                        format="HH:mm"
                        style={{ width: "100%", marginTop: 8 }}
                        size="large"
                        value={scheduleTime}
                        onChange={setScheduleTime}
                        placeholder="Select time"
                    />

                    <div style={{ marginTop: 20 }}>
                        <Text style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                            Repeat Every
                        </Text>

                        <Select
                            style={{ width: "100%", marginTop: 8 }}
                            size="large"
                            placeholder="Select interval"
                            options={INTERVAL_OPTIONS}
                            value={scheduleInterval}
                            onChange={setScheduleInterval}
                        />
                    </div>

                    <Row justify="end" gutter={12} style={{ marginTop: 24 }}>
                        <Col>
                            <Button onClick={closeScheduleModal}>Cancel</Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                disabled={!scheduleTime || !scheduleInterval}
                                onClick={handleSaveSchedule}
                                style={{
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    fontWeight: 600,
                                }}
                            >
                                Save
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    );
}
