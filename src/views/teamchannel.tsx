import React, { useEffect, useState } from "react";
import { Table, Checkbox, Space, Select, TimePicker, DatePicker, InputNumber, Button, Tooltip, Popconfirm, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BellOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { GroupAlertCreate, GroupAlertDelete, GroupAlertUpdate, GroupsGet } from "../redux/Services/connectersServices";
import TeamNotificationModal from "../components/Teamcreate";
import { parseGroupMembers } from "../utils/groupMembers";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TeamPermission {
    key: string;
    id: number;
    teamName: string;
    members: string[];

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

const TeamAlertsTable: React.FC = () => {
    const [data, setData] = useState<TeamPermission[]>([]);
    const dispatch = useAppDispatch();
    const groupAlerts = useAppSelector((state) => state.connecters?.GroupsGets) || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updatingKey, setUpdatingKey] = useState<string | null>(null);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);

    useEffect(() => {
        dispatch(GroupsGet({}));
    }, [dispatch]);

    const isValidTimeString = (value: any): boolean =>
        typeof value === "string" && dayjs(value, "HH:mm", true).isValid();

    // The backend stores hour/minute in UTC (schedules are entered in IST),
    // same convention as Individual Alerts.
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
        if (groupAlerts?.Response?.length) {
            const isSet = (v: any) => v !== undefined && v !== null && v !== "" && v !== "0" && v !== 0;

            const mappedData: TeamPermission[] = groupAlerts.Response.map((item: any) => {
                const scheduleType = item.schedule_type?.trim().toLowerCase();

                return {
                    key: `${item.id}`,
                    id: item.id,
                    teamName: item.group_name || item.team_name || "",
                    members: parseGroupMembers(item.members),
                    type: item.type?.toLowerCase(),

                    scheduleType,

                    schedule_days_of_week:
                        scheduleType === "weekly" && isSet(item.week) ? item.week : null,

                    schedule_day_of_month:
                        scheduleType === "monthly" && isSet(item.day) ? Number(item.day) : null,

                    schedule_date: null,

                    schedule_time: utcHourMinuteToIstTime(item.hour, item.minute),

                    customSchedules: [],

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

            setData(mappedData);
        }
    }, [groupAlerts]);

    const handleScheduleChange = (
        key: string,
        field:
            | "schedule_days_of_week"
            | "schedule_day_of_month"
            | "schedule_date"
            | "schedule_time",
        value: any
    ) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === key
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    };
    const addCustomSchedule = (key: string) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === key
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
    const removeCustomSchedule = (key: string, index: number) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === key
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
        key: string,
        index: number,
        field: "date" | "time",
        value: string | null
    ) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === key
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
        key: string,
        value: "daily" | "weekly" | "monthly" | "custom"
    ) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === key
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
        key: string,
        value: "datahub" | "integration"
    ) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === key
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
        key: string,
        field: keyof Omit<TeamPermission, "key" | "teamName" | "members" | "id">,
        checked: boolean
    ) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === key
                    ? {
                        ...item,
                        [field]: checked,
                    }
                    : item
            )
        );
    };

    const handleEdit = async (record: TeamPermission) => {
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

        const payload = {
            id: record.id,
            team_name: record.teamName,
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
            updated_at: new Date().toISOString(),
        };

        setUpdatingKey(record.key);
        try {
            await dispatch(GroupAlertUpdate({ payload })).unwrap();
            dispatch(GroupsGet({}));
        } catch (error) {
            console.error(error);
        } finally {
            setUpdatingKey(null);
        }
    };

    const handleDelete = async (record: TeamPermission) => {
        setDeletingKey(record.key);
        try {
            const payload = {
                id: record.id,
            };
            await dispatch(GroupAlertDelete({ payload })).unwrap();
            dispatch(GroupsGet({}));
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingKey(null);
        }
    };


    const columns: ColumnsType<TeamPermission> = [
        {
            title: "Team",
            dataIndex: "teamName",
            key: "teamName",
            width: 220,
            render: (teamName: string, record) => (
                <Space orientation="vertical" size={2}>
                    <span>{teamName}</span>
                    <Tag style={{ borderRadius: 999 }}>
                        {record.members.length} member{record.members.length === 1 ? "" : "s"}
                    </Tag>
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
                        handleTypeChange(record.key, value)
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
                            handleScheduleTypeChange(record.key, value)
                        }
                    />

                    {/* Weekly - just a day-of-week name, no separate date */}
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
                                    record.key,
                                    "schedule_days_of_week",
                                    value
                                )
                            }
                        />
                    )}

                    {/* Monthly - just a numeric day of month, no week/day-name */}
                    {record.scheduleType === "monthly" && (
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Day of Month"
                            min={1}
                            max={31}
                            value={record.schedule_day_of_month}
                            onChange={(value) =>
                                handleScheduleChange(
                                    record.key,
                                    "schedule_day_of_month",
                                    value
                                )
                            }
                        />
                    )}

                    {/* Custom */}
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
                                                record.key,
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
                                                record.key,
                                                index,
                                                "time",
                                                time ? time.format("HH:mm") : null
                                            )
                                        }
                                    />

                                    <Button
                                        danger
                                        onClick={() => removeCustomSchedule(record.key, index)}
                                    >
                                        Remove
                                    </Button>
                                </Space>
                            ))}

                            <Button
                                type="dashed"
                                block
                                onClick={() => addCustomSchedule(record.key)}
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
                                    record.key,
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
                        handleCheckbox(record.key, "mdm", e.target.checked)
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
                        handleCheckbox(record.key, "longrun", e.target.checked)
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
                        handleCheckbox(record.key, "atom", e.target.checked)
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
                        handleCheckbox(record.key, "tickets", e.target.checked)
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
                        title="Delete Team Alert"
                        description="Are you sure you want to delete this team alert?"
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

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Space>
                        <BellOutlined style={{ color: "#14a9fa" }} />
                        Team Alerts
                    </Space>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}  >
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
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
                        Create Team Alert
                    </Button>

                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",

                }}
            >
                <Table
                    bordered
                    rowKey="key"
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    scroll={{ x: "max-content", y: 520 }}
                    size="middle"
                />
                <TeamNotificationModal
                    open={isModalOpen}
                    loading={loading}
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={async (values) => {
                        try {
                            setLoading(true);

                            // Convert IST -> UTC, same as Individual Alerts.
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

                            await dispatch(
                                GroupAlertCreate({
                                    payload,
                                })
                            ).unwrap();

                            setIsModalOpen(false);
                            dispatch(GroupsGet({}));
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
            </div>
        </>
    );
};

export default TeamAlertsTable;
