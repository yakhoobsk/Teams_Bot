import React, { useEffect, useState } from "react";
import { Table, Checkbox, Space, Select, TimePicker, DatePicker, Button, Tooltip, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BellOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IndividualUser, IndividualuserCreate, IndividualuserDelete, IndividualuserUpdate } from "../redux/Services/connectersServices";
import utc from "dayjs/plugin/utc";
import NotificationModal from "../components/Individualcreate";

dayjs.extend(utc);
interface UserPermission {
    key: string;
    name: string;
    email: string;
    id: number;

    type?: "datahub" | "integration";

    scheduleType?: "daily" | "weekly" | "monthly" | "custom";

    schedule_week?: number | null;
    schedule_date?: string | null;
    schedule_time?: string | null;
    schedule_days_of_week?: string | null;
    customSchedules?: {
        date: string | null;
        time: string | null;
    }[];
    mdm: boolean;
    longrun: boolean;
    atom: boolean;
    tickets: boolean;
}



const UserAlertsTable: React.FC = () => {
    const [data, setData] = useState<UserPermission[]>([]);
    const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
    console.log(userPermissions)
    const dispatch = useAppDispatch()
    const individualuser = useAppSelector((state) => state.connecters?.IndividualUsers) || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        dispatch(IndividualUser({}));
    }, [dispatch]);


    useEffect(() => {
        if (individualuser?.Response?.length) {
            const mappedData: UserPermission[] = individualuser.Response.map((item: any) => ({
                key: item.id,
                name: item.username,
                email: item.usermail,
                id: item.id,
                type: item.type?.toLowerCase(),

                scheduleType: item.schedule_type?.toLowerCase(),

                schedule_week:
                    item.schedule_type === "Monthly"
                        ? Number(item.week)
                        : null,

                schedule_days_of_week:
                    item.schedule_type === "Weekly" ||
                        item.schedule_type === "Monthly"
                        ? item.week
                        : null,

                schedule_date:
                    item.schedule_type === "Custom"
                        ? `${item.year}-${item.month}-${item.day}`
                        : null,

                schedule_time: `${item.hour}:${item.minute}`,

                customSchedules:
                    item.schedule_type === "Custom"
                        ? [
                            {
                                date: `${item.year}-${item.month}-${item.day}`,
                                time: `${item.hour}:${item.minute}`,
                            },
                        ]
                        : [],

                mdm:
                    item.mdm === true || item.mdm === "true",

                longrun:
                    item.longrun === true || item.longrun === "true",

                atom:
                    item.atom === true || item.atom === "true",

                tickets:
                    item.tickets === true || item.tickets === "true",
            }));

            setData(mappedData);
        }
    }, [individualuser]);

    const handleScheduleChange = (
        key: string,
        field:
            | "schedule_week"
            | "schedule_days_of_week"
            | "schedule_days_of_month"
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
                        schedule_week: null,
                        schedule_days_of_week: null,
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
        setUserPermissions((prev) =>
            prev.map((item) =>
                item.key === key
                    ? {
                        ...item,
                        type: value,
                    }
                    : item
            )
        );
    };


    const handleCheckbox = (
        key: string,
        field: keyof Omit<UserPermission, "key" | "name" | "email">,
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

    const handleEdit = (record: UserPermission) => {
        const utcTime = dayjs(record.schedule_time, "HH:mm")
            .utc()
            .format("HH");

        const utcMinute = dayjs(record.schedule_time, "HH:mm")
            .utc()
            .format("mm");
        const payload = {
            id: record.key,
            username: record.name,
            usermail: record.email,
            type: record.type === "datahub" ? "Datahub" : "Integration",
            schedule_type: record.scheduleType,
            day: record.schedule_date
                ? dayjs(record.schedule_date).format("DD")
                : "",
            week: record.schedule_days_of_week ?? "",
            month: record.schedule_date
                ? dayjs(record.schedule_date).format("M")
                : "",
            year: record.schedule_date
                ? dayjs(record.schedule_date).format("YYYY")
                : "",
            hour: utcTime,
            minute: utcMinute,
            atom: record.atom ? "1" : "0",
            longrun: record.longrun ? "1" : "0",
            mdm: record.mdm ? "1" : "0",
            tickets: record.tickets ? "1" : "0",
        };
        dispatch(IndividualuserUpdate({ payload })).unwrap();
        dispatch(IndividualUser({}));
    };

    const handleDelete = async (record: UserPermission) => {
        try {
            const payload = {
                id: record.id,
            }
            await dispatch(
                IndividualuserDelete({ payload })
            ).unwrap();

            dispatch(IndividualUser({}));
        } catch (error) {
            console.error(error);
        }
    };


    const columns: ColumnsType<UserPermission> = [
        {
            title: "User",
            dataIndex: "name",
            key: "name",
            width: 180,
        },
        {
            title: "User Email",
            dataIndex: "email",
            key: "email",
            width: 250,
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
                <Space direction="vertical" style={{ width: "100%" }} size={8}>
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

                    {/* Weekly */}
                    {record.scheduleType === "weekly" && (
                        <Select
                            placeholder="Day of Week"
                            value={record.schedule_days_of_week}
                            options={[
                                { label: "Sunday", value: 0 },
                                { label: "Monday", value: 1 },
                                { label: "Tuesday", value: 2 },
                                { label: "Wednesday", value: 3 },
                                { label: "Thursday", value: 4 },
                                { label: "Friday", value: 5 },
                                { label: "Saturday", value: 6 },
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

                    {/* Monthly */}
                    {record.scheduleType === "monthly" && (
                        <>
                            <Select
                                placeholder="Week"
                                value={record.schedule_week}
                                options={[
                                    { label: "First", value: 1 },
                                    { label: "Second", value: 2 },
                                    { label: "Third", value: 3 },
                                    { label: "Fourth", value: 4 },
                                    { label: "Last", value: 5 },
                                ]}
                                onChange={(value) =>
                                    handleScheduleChange(
                                        record.key,
                                        "schedule_week",
                                        value
                                    )
                                }
                            />

                            <Select
                                placeholder="Day of Week"
                                value={record.schedule_days_of_week}
                                options={[
                                    { label: "Sunday", value: 0 },
                                    { label: "Monday", value: 1 },
                                    { label: "Tuesday", value: 2 },
                                    { label: "Wednesday", value: 3 },
                                    { label: "Thursday", value: 4 },
                                    { label: "Friday", value: 5 },
                                    { label: "Saturday", value: 6 },
                                ]}
                                onChange={(value) =>
                                    handleScheduleChange(
                                        record.key,
                                        "schedule_days_of_week",
                                        value
                                    )
                                }
                            />
                        </>
                    )}

                    {/* Custom */}
                    {record.scheduleType === "custom" && (
                        <>
                            {(record.customSchedules || []).map((item, index) => (
                                <Space key={index} style={{ width: "100%" }} align="start">
                                    <DatePicker
                                        value={item.date ? dayjs(item.date) : null}
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
                                        value={item.time ? dayjs(item.time, "HH:mm") : null}
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
                                record.schedule_time
                                    ? dayjs(record.schedule_time, "HH:mm")
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
                    <Tooltip title="Edit">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
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
                        title="Delete User"
                        description="Are you sure you want to delete this user?"
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record)}
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
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
                        Individual Alerts
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
                        Create Individual User
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
                    scroll={{ x: "max-content" }}
                    size="middle"
                />
                <NotificationModal
                    open={isModalOpen}
                    loading={loading}
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={async (values) => {
                        try {
                            setLoading(true);

                            // Convert IST -> UTC
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
        </>
    );
};

export default UserAlertsTable;