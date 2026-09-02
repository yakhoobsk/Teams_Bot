import React, { useEffect, useState } from "react";
import { Table, Checkbox, Space, Select, TimePicker, DatePicker, InputNumber, Button, Tooltip, Popconfirm, Tag, Card, Row, Col, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BellOutlined, DeleteOutlined, EditOutlined, PlusOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IndividualUser, IndividualuserCreate, IndividualuserDelete, IndividualuserUpdate } from "../redux/Services/connectersServices";
import AlertCreateModal, { type RecipientType } from "../components/AlertCreateModal";
import { showSnackbar } from "../utils/snackbar";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;

interface AlertRow {
    key: string;
    recipientType: RecipientType;
    id?: number;
    name: string;
    email?: string;
    members?: string[];

    type?: "datahub" | "integration";

    scheduleType?: "daily" | "weekly" | "monthly" | "custom";

    schedule_days_of_week?: string | null;
    schedule_day_of_month?: number | null;
    schedule_date?: string | null;
    schedule_time?: string | null;
    customSchedules?: {
        date: string | null;
        time: string | null;
    }[];
    mdm: boolean;
    longrun: boolean;
    atom: boolean;
    tickets: boolean;
}

const SAMPLE_TEAM_ALERTS: AlertRow[] = [
    {
        key: "team-sample-1",
        recipientType: "team",
        name: "Integration Team",
        members: ["john.doe@easystepin.com", "jane.smith@easystepin.com"],
        type: "datahub",
        scheduleType: "daily",
        schedule_days_of_week: null,
        schedule_day_of_month: null,
        schedule_date: null,
        schedule_time: "09:00",
        customSchedules: [],
        mdm: true,
        longrun: false,
        atom: true,
        tickets: false,
    },
    {
        key: "team-sample-2",
        recipientType: "team",
        name: "QA Team",
        members: ["qa.lead@easystepin.com"],
        type: "integration",
        scheduleType: "weekly",
        schedule_days_of_week: "Monday",
        schedule_day_of_month: null,
        schedule_date: null,
        schedule_time: "18:30",
        customSchedules: [],
        mdm: false,
        longrun: true,
        atom: true,
        tickets: true,
    },
];

const AlertsTable: React.FC = () => {
    const [individualData, setIndividualData] = useState<AlertRow[]>([]);
    const [teamData, setTeamData] = useState<AlertRow[]>(SAMPLE_TEAM_ALERTS);
    const dispatch = useAppDispatch();
    const individualuser = useAppSelector((state) => state.connecters?.IndividualUsers) || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updatingKey, setUpdatingKey] = useState<string | null>(null);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);

    useEffect(() => {
        dispatch(IndividualUser({}));
    }, [dispatch]);

    const isValidTimeString = (value: any): boolean =>
        typeof value === "string" && dayjs(value, "HH:mm", true).isValid();

    const utcHourMinuteToIstTime = (hour: any, minute: any): string | null => {
        const h = Number(hour);
        const m = Number(minute);
        if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) {
            return null;
        }
        return dayjs.utc().hour(h).minute(m).second(0).tz("Asia/Kolkata").format("HH:mm");
    };

    const istTimeToUtcHourMinute = (time?: string | null): { hour: string; minute: string } => {
        if (!isValidTimeString(time)) return { hour: "", minute: "" };

        const [h, m] = (time as string).split(":").map(Number);
        const utcTime = dayjs().tz("Asia/Kolkata").hour(h).minute(m).second(0).utc();

        return { hour: utcTime.format("HH"), minute: utcTime.format("mm") };
    };

    useEffect(() => {
        if (individualuser?.Response?.length) {
            const isSet = (v: any) => v !== undefined && v !== null && v !== "" && v !== "0" && v !== 0;

            const mappedData: AlertRow[] = individualuser.Response.map((item: any) => {
                const scheduleType = item.schedule_type?.trim().toLowerCase();

                const hasCustomDate =
                    isSet(item.schedule_years) &&
                    isSet(item.schedule_months) &&
                    isSet(item.schedule_days_of_month);

                return {
                    key: `ind-${item.id}`,
                    recipientType: "individual" as RecipientType,
                    id: item.id,
                    name: item.username,
                    email: item.usermail,
                    type: item.type?.toLowerCase(),

                    scheduleType,

                    schedule_days_of_week:
                        scheduleType === "weekly" && isSet(item.schedule_days_of_week)
                            ? item.schedule_days_of_week
                            : null,

                    schedule_day_of_month:
                        scheduleType === "monthly" && isSet(item.schedule_days_of_month)
                            ? Number(item.schedule_days_of_month)
                            : null,

                    schedule_date:
                        scheduleType === "custom" && hasCustomDate
                            ? `${item.schedule_years}-${item.schedule_months}-${item.schedule_days_of_month}`
                            : null,

                    schedule_time: utcHourMinuteToIstTime(item.schedule_hours, item.schedule_minutes),

                    customSchedules:
                        scheduleType === "custom" && hasCustomDate
                            ? [
                                {
                                    date: `${item.schedule_years}-${item.schedule_months}-${item.schedule_days_of_month}`,
                                    time: utcHourMinuteToIstTime(item.schedule_hours, item.schedule_minutes),
                                },
                            ]
                            : [],

                    mdm:
                        item.mdm === true || item.mdm === "true" || item.mdm === "1",

                    longrun:
                        item.longrun === true || item.longrun === "true" || item.longrun === "1",

                    atom:
                        item.atom === true || item.atom === "true" || item.atom === "1",

                    tickets:
                        item.tickets === true || item.tickets === "true" || item.tickets === "1",
                };
            });

            setIndividualData(mappedData);
        }
    }, [individualuser]);

    const data: AlertRow[] = [...individualData, ...teamData];

    const setDataFor = (recipientType: RecipientType) =>
        recipientType === "individual" ? setIndividualData : setTeamData;

    const handleScheduleChange = (
        record: AlertRow,
        field:
            | "schedule_days_of_week"
            | "schedule_day_of_month"
            | "schedule_date"
            | "schedule_time",
        value: any
    ) => {
        setDataFor(record.recipientType)((prev) =>
            prev.map((item) =>
                item.key === record.key
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    };
    const addCustomSchedule = (record: AlertRow) => {
        setDataFor(record.recipientType)((prev) =>
            prev.map((item) =>
                item.key === record.key
                    ? {
                        ...item,
                        customSchedules: [
                            ...(item.customSchedules || []),
                            {
                                date: null,
                                time: null,
                            },
                        ],
                    }
                    : item
            )
        );
    };
    const removeCustomSchedule = (record: AlertRow, index: number) => {
        setDataFor(record.recipientType)((prev) =>
            prev.map((item) =>
                item.key === record.key
                    ? {
                        ...item,
                        customSchedules: item.customSchedules?.filter(
                            (_, i) => i !== index
                        ),
                    }
                    : item
            )
        );
    };
    const handleCustomScheduleChange = (
        record: AlertRow,
        index: number,
        field: "date" | "time",
        value: string | null
    ) => {
        setDataFor(record.recipientType)((prev) =>
            prev.map((item) =>
                item.key === record.key
                    ? {
                        ...item,
                        customSchedules: item.customSchedules?.map((schedule, i) =>
                            i === index
                                ? {
                                    ...schedule,
                                    [field]: value,
                                }
                                : schedule
                        ),
                    }
                    : item
            )
        );
    };

    const handleScheduleTypeChange = (
        record: AlertRow,
        value: "daily" | "weekly" | "monthly" | "custom"
    ) => {
        setDataFor(record.recipientType)((prev) =>
            prev.map((item) =>
                item.key === record.key
                    ? {
                        ...item,
                        scheduleType: value,
                        schedule_days_of_week: null,
                        schedule_day_of_month: null,
                        schedule_date: null,
                        schedule_time: null,
                    }
                    : item
            )
        );
    };
    const handleTypeChange = (
        record: AlertRow,
        value: "datahub" | "integration"
    ) => {
        setDataFor(record.recipientType)((prev) =>
            prev.map((item) =>
                item.key === record.key
                    ? {
                        ...item,
                        type: value,
                        longrun: value === "datahub" ? false : item.longrun,
                        mdm: value === "integration" ? false : item.mdm,
                    }
                    : item
            )
        );
    };


    const handleCheckbox = (
        record: AlertRow,
        field: "mdm" | "longrun" | "atom" | "tickets",
        checked: boolean
    ) => {
        setDataFor(record.recipientType)((prev) =>
            prev.map((item) =>
                item.key === record.key
                    ? {
                        ...item,
                        [field]: checked,
                    }
                    : item
            )
        );
    };

    const handleEdit = async (record: AlertRow) => {
        const isCustom = record.scheduleType === "custom";
        const customEntry = record.customSchedules?.[0];
        const scheduleTime = isCustom ? customEntry?.time : record.schedule_time;
        const { hour, minute } = istTimeToUtcHourMinute(scheduleTime);

        let day: string | number = "";
        let week = "";
        let month: string | number = "";
        let year: string | number = "";

        if (record.scheduleType === "weekly") {
            week = record.schedule_days_of_week ?? "";
        } else if (record.scheduleType === "monthly") {
            day = record.schedule_day_of_month ?? "";
        } else if (isCustom && customEntry?.date) {
            day = dayjs(customEntry.date).format("DD");
            month = dayjs(customEntry.date).format("M");
            year = dayjs(customEntry.date).format("YYYY");
        }

        setUpdatingKey(record.key);

        if (record.recipientType === "individual") {
            const payload = {
                id: record.id,
                username: record.name,
                usermail: record.email,
                type: record.type === "datahub" ? "Datahub" : "Integration",
                schedule_type: record.scheduleType,
                day,
                week,
                month,
                year,
                hour,
                minute,
                atom: record.atom ? "1" : "0",
                longrun: record.longrun ? "1" : "0",
                mdm: record.mdm ? "1" : "0",
                tickets: record.tickets ? "1" : "0",
            };

            try {
                await dispatch(IndividualuserUpdate({ payload })).unwrap();
                dispatch(IndividualUser({}));
            } catch (error) {
                console.error(error);
            } finally {
                setUpdatingKey(null);
            }
        } else {
            const payload = {
                team_name: record.name,
                members: record.members,
                type: record.type === "datahub" ? "Datahub" : "Integration",
                schedule_type: record.scheduleType,
                day,
                week,
                month,
                year,
                hour,
                minute,
                atom: record.atom ? "1" : "0",
                longrun: record.longrun ? "1" : "0",
                mdm: record.mdm ? "1" : "0",
                tickets: record.tickets ? "1" : "0",
            };

            console.log("Update Team Alert payload:", payload);
            showSnackbar("success", `${record.name} alert updated`);
            setUpdatingKey(null);
        }
    };

    const handleDelete = async (record: AlertRow) => {
        setDeletingKey(record.key);

        if (record.recipientType === "individual") {
            try {
                await dispatch(IndividualuserDelete({ payload: { id: record.id } })).unwrap();
                dispatch(IndividualUser({}));
            } catch (error) {
                console.error(error);
            } finally {
                setDeletingKey(null);
            }
        } else {
            setTeamData((prev) => prev.filter((item) => item.key !== record.key));
            console.log("Delete Team Alert payload:", { team_name: record.name });
            showSnackbar("success", `${record.name} alert deleted`);
            setDeletingKey(null);
        }
    };


    const columns: ColumnsType<AlertRow> = [
        {
            title: "Recipient",
            key: "recipient",
            width: 240,
            render: (_, record) => (
                <Space orientation="vertical" size={2}>
                    <Space size={6}>
                        <Tag
                            color={record.recipientType === "team" ? "purple" : "blue"}
                            style={{ borderRadius: 999, fontWeight: 600 }}
                        >
                            {record.recipientType === "team" ? (
                                <>
                                    <TeamOutlined /> Team
                                </>
                            ) : (
                                <>
                                    <UserOutlined /> Individual
                                </>
                            )}
                        </Tag>
                    </Space>
                    <Text strong>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.recipientType === "team"
                            ? `${record.members?.length || 0} member${record.members?.length === 1 ? "" : "s"}`
                            : record.email}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 180,
            render: (_, record) => (
                <Select
                    style={{ width: "100%" }}
                    placeholder="Select Type"
                    value={record.type}
                    options={[
                        { label: "DataHub", value: "datahub" },
                        { label: "Integration", value: "integration" },
                    ]}
                    onChange={(value) =>
                        handleTypeChange(record, value)
                    }
                />
            ),
        },
        {
            title: "Schedule",
            key: "schedule",
            width: 340,
            render: (_, record) => (
                <Space orientation="vertical" style={{ width: "100%" }} size={8}>
                    <Select
                        placeholder="Schedule Type"
                        value={record.scheduleType}
                        options={[
                            { label: "Daily", value: "daily" },
                            { label: "Weekly", value: "weekly" },
                            { label: "Monthly", value: "monthly" },
                            { label: "Custom", value: "custom" },
                        ]}
                        onChange={(value) =>
                            handleScheduleTypeChange(record, value)
                        }
                    />

                    {record.scheduleType === "weekly" && (
                        <Select
                            placeholder="Day of Week"
                            value={record.schedule_days_of_week}
                            options={[
                                { label: "Sunday", value: "Sunday" },
                                { label: "Monday", value: "Monday" },
                                { label: "Tuesday", value: "Tuesday" },
                                { label: "Wednesday", value: "Wednesday" },
                                { label: "Thursday", value: "Thursday" },
                                { label: "Friday", value: "Friday" },
                                { label: "Saturday", value: "Saturday" },
                            ]}
                            onChange={(value) =>
                                handleScheduleChange(
                                    record,
                                    "schedule_days_of_week",
                                    value
                                )
                            }
                        />
                    )}

                    {record.scheduleType === "monthly" && (
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Day of Month"
                            min={1}
                            max={31}
                            value={record.schedule_day_of_month}
                            onChange={(value) =>
                                handleScheduleChange(
                                    record,
                                    "schedule_day_of_month",
                                    value
                                )
                            }
                        />
                    )}

                    {record.scheduleType === "custom" && (
                        <>
                            {(record.customSchedules || []).map((item, index) => (
                                <Space key={index} style={{ width: "100%" }} align="start">
                                    <DatePicker
                                        value={
                                            item.date && dayjs(item.date).isValid()
                                                ? dayjs(item.date)
                                                : null
                                        }
                                        onChange={(date) =>
                                            handleCustomScheduleChange(
                                                record,
                                                index,
                                                "date",
                                                date ? date.format("YYYY-MM-DD") : null
                                            )
                                        }
                                    />

                                    <TimePicker
                                        format="HH:mm"
                                        value={
                                            isValidTimeString(item.time)
                                                ? dayjs(item.time, "HH:mm")
                                                : null
                                        }
                                        onChange={(time) =>
                                            handleCustomScheduleChange(
                                                record,
                                                index,
                                                "time",
                                                time ? time.format("HH:mm") : null
                                            )
                                        }
                                    />

                                    <Button
                                        danger
                                        onClick={() => removeCustomSchedule(record, index)}
                                    >
                                        Remove
                                    </Button>
                                </Space>
                            ))}

                            <Button
                                type="dashed"
                                block
                                onClick={() => addCustomSchedule(record)}
                            >
                                + Add Schedule
                            </Button>
                        </>
                    )}

                    {record.scheduleType !== "custom" && (
                        <TimePicker
                            format="HH:mm"
                            style={{ width: "100%" }}
                            value={
                                isValidTimeString(record.schedule_time)
                                    ? dayjs(record.schedule_time as string, "HH:mm")
                                    : null
                            }
                            onChange={(time) =>
                                handleScheduleChange(
                                    record,
                                    "schedule_time",
                                    time ? time.format("HH:mm") : null
                                )
                            }
                        />
                    )}
                </Space>

            ),
        },
        {
            title: "MDM",
            dataIndex: "mdm",
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={record.mdm}
                    disabled={record.type === "integration"}
                    onChange={(e) =>
                        handleCheckbox(record, "mdm", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "LongRun",
            dataIndex: "longrun",
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={record.longrun}
                    disabled={record.type === "datahub"}
                    onChange={(e) =>
                        handleCheckbox(record, "longrun", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "Atom",
            dataIndex: "atom",
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={record.atom}
                    onChange={(e) =>
                        handleCheckbox(record, "atom", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "Tickets",
            dataIndex: "tickets",
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={record.tickets}
                    onChange={(e) =>
                        handleCheckbox(record, "tickets", e.target.checked)
                    }
                />
            ),
        }, {
            title: "Actions",
            key: "actions",
            width: 120,
            align: "center",
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Update">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            loading={updatingKey === record.key}
                            onClick={() => handleEdit(record)}
                            style={{
                                borderRadius: 8,
                                height: 42,
                                padding: "0 20px",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                background: "#1677ff",
                                borderColor: "#1677ff",
                            }}
                        >
                            Update   </Button>
                    </Tooltip>

                    <Popconfirm
                        title="Delete Alert"
                        description="Are you sure you want to delete this alert?"
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true, loading: deletingKey === record.key }}
                        onConfirm={() => handleDelete(record)}
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                loading={deletingKey === record.key}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    const individualCount = individualData.length;
    const teamCount = teamData.length;

    return (
        <div
            className="alerts-page"
            style={{
                minHeight: "100vh",
                padding: 32,
                background: "#f4f7fb",
            }}
        >
            <style>
                {`
          .alerts-page .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155 !important;
            font-weight: 500 !important;
          }

          .alerts-card {
            animation: fadeUp 0.45s ease both;
          }

          .alerts-summary-card {
            animation: fadeUp 0.35s ease both;
            transition: all 0.25s ease;
          }

          .alerts-summary-card:hover,
          .alerts-card:hover {
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
            .alerts-page {
              padding: 18px !important;
            }
          }
        `}
            </style>

            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
                            Channels &amp; Alerts
                        </Tag>

                        <Title level={2} style={{ margin: 0, color: "#111827" }}>
                            Alerts
                        </Title>

                        <Text style={{ color: "#64748b", fontSize: 15 }}>
                            Schedule MDM, LongRun, Atom, and Ticket alerts for an individual user or an entire team.
                        </Text>
                    </Col>

                    <Col xs={24} lg={10}>
                        <Row gutter={[14, 14]}>
                            <Col xs={12}>
                                <Card
                                    className="alerts-summary-card"
                                    variant="borderless"
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #dbeafe",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    styles={{ body: { padding: 18 } }}
                                >
                                    <Text style={{ color: "#2563eb", fontWeight: 600 }}>
                                        <UserOutlined /> Individual
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: "#1d4ed8" }}>
                                        {individualCount}
                                    </Title>
                                </Card>
                            </Col>

                            <Col xs={12}>
                                <Card
                                    className="alerts-summary-card"
                                    variant="borderless"
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #e9d5ff",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    styles={{ body: { padding: 18 } }}
                                >
                                    <Text style={{ color: "#7e22ce", fontWeight: 600 }}>
                                        <TeamOutlined /> Team
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: "#6b21a8" }}>
                                        {teamCount}
                                    </Title>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Card
                    className="alerts-card"
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
                                    <BellOutlined />
                                </div>

                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Alert List
                                    </Title>
                                    <Text type="secondary">
                                        The Recipient column shows whether each alert targets an Individual or a Team.
                                    </Text>
                                </div>
                            </Space>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalOpen(true)}
                                style={{
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
                                }}
                            >
                                Create Alert
                            </Button>
                        </Col>
                    </Row>

                    <Card styles={{ body: { padding: 20, overflow: "hidden" } }}>
                        <Table
                            rowKey="key"
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            scroll={{ x: "max-content", y: 520 }}
                            size="middle"
                        />
                    </Card>
                </Card>
            </div>

            <AlertCreateModal
                open={isModalOpen}
                loading={loading}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={async (recipientType, values) => {
                    if (recipientType === "team") {
                        const utcTime = dayjs()
                            .tz("Asia/Kolkata")
                            .hour(values.hour)
                            .minute(values.minute)
                            .second(0)
                            .utc();

                        const payload = {
                            team_name: values.team_name,
                            members: values.members,
                            type: values.type,
                            schedule_type: values.schedule_type,
                            day: values.day ?? "",
                            week: values.week ?? "",
                            month: values.month ?? "",
                            year: values.year ?? "",
                            hour: Number(utcTime.format("HH")),
                            minute: Number(utcTime.format("mm")),
                            atom: values.atom,
                            longrun: values.longrun,
                            mdm: values.mdm,
                            tickets: values.tickets,
                            created_at: values.created_at,
                            updated_at: values.updated_at,
                        };

                        console.log("Create Team Alert payload:", payload);

                        setTeamData((prev) => [
                            ...prev,
                            {
                                key: `team-${Date.now()}`,
                                recipientType: "team",
                                name: values.team_name,
                                members: values.members,
                                type: values.type?.toLowerCase(),
                                scheduleType: values.schedule_type?.toLowerCase(),
                                schedule_days_of_week: values.week || null,
                                schedule_day_of_month: values.day || null,
                                schedule_time:
                                    values.hour !== undefined && values.minute !== undefined
                                        ? `${String(values.hour).padStart(2, "0")}:${String(values.minute).padStart(2, "0")}`
                                        : null,
                                customSchedules: [],
                                mdm: !!values.mdm,
                                longrun: !!values.longrun,
                                atom: !!values.atom,
                                tickets: !!values.tickets,
                            },
                        ]);

                        showSnackbar("success", `${values.team_name} alert created`);
                        setIsModalOpen(false);
                        return;
                    }

                    try {
                        setLoading(true);

                        const utcTime = dayjs()
                            .tz("Asia/Kolkata")
                            .hour(values.hour)
                            .minute(values.minute)
                            .second(0)
                            .utc();

                        const payload = {
                            username: values.username,
                            usermail: values.usermail,
                            type: values.type,
                            schedule_type: values.schedule_type,
                            day: values.day ?? "",
                            week: values.week ?? "",
                            month: values.month ?? "",
                            year: values.year ?? "",
                            hour: Number(utcTime.format("HH")),
                            minute: Number(utcTime.format("mm")),
                            atom: values.atom,
                            longrun: values.longrun,
                            mdm: values.mdm,
                            tickets: values.tickets,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        };

                        await dispatch(
                            IndividualuserCreate({
                                payload,
                            })
                        ).unwrap();

                        setIsModalOpen(false);
                        dispatch(IndividualUser({}));
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                }}
            />
        </div>
    );
};

export default AlertsTable;
